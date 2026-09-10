import { type NextRequest, NextResponse } from "next/server"
import { getAuthContext, authErrorStatus } from "@/lib/api-auth"
import { query, transaction } from "@/lib/database"
import { canTransitionCobranca, isCobrancaStatus, parseMoney, COBRANCA_STATUSES } from "@/lib/cobranca-state"

const STATUSES = COBRANCA_STATUSES
const TYPES = ["amigavel", "administrativa", "extrajudicial", "judicial"] as const

function errorResponse(error: unknown, fallback: string) {
  const status = authErrorStatus(error)
  return NextResponse.json({ error: status === 401 ? "Não autenticado" : status === 403 ? "Sem permissão" : fallback }, { status })
}

export async function GET(request: NextRequest) {
  try {
    const auth = await getAuthContext()
    if (!auth) return NextResponse.json({ error: "Não autenticado" }, { status: 401 })
    const params = request.nextUrl.searchParams
    const status = params.get("status")
    const limit = Math.min(Math.max(Number.parseInt(params.get("limit") || "50", 10) || 50, 1), 100)
    const offset = Math.max(Number.parseInt(params.get("offset") || "0", 10) || 0, 0)
    if (status && !STATUSES.includes(status as (typeof STATUSES)[number])) return NextResponse.json({ error: "Status inválido" }, { status: 422 })
    const values: unknown[] = [auth.administradoraId]
    const conditions = ["c.administradora_id = $1", "c.deleted_at IS NULL"]
    if (status) { values.push(status); conditions.push(`c.status = $${values.length}`) }
    const where = conditions.join(" AND ")
    const rows = await query(`SELECT c.id, c.tipo_cobranca, c.status, c.valor_original, c.valor_atual, c.desconto_concedido, c.data_inicio, c.data_fim, c.parcelas, c.beneficiario_id, c.conta_receber_id, c.canal_contato, c.created_at FROM cobrancas c WHERE ${where} ORDER BY c.created_at DESC LIMIT $${values.length + 1} OFFSET $${values.length + 2}`, [...values, limit, offset])
    const [summary] = await query<{ total: number; em_atraso: number; em_cobranca: number; recuperado: number; taxa_recuperacao: number }>(`SELECT COUNT(*)::int AS total, COALESCE(SUM(CASE WHEN c.status = 'pendente' THEN c.valor_atual ELSE 0 END), 0)::numeric AS em_atraso, COUNT(*) FILTER (WHERE c.status = 'em_cobranca')::int AS em_cobranca, COALESCE(SUM(CASE WHEN c.status IN ('paga', 'encerrada') THEN c.valor_atual ELSE 0 END), 0)::numeric AS recuperado, COALESCE(ROUND((COUNT(*) FILTER (WHERE c.status IN ('paga', 'encerrada')) * 100.0 / NULLIF(COUNT(*), 0))::numeric, 2), 0)::numeric AS taxa_recuperacao FROM cobrancas c WHERE ${where}`, values)
    return NextResponse.json({ data: rows, pagination: { limit, offset, count: rows.length, total: Number(summary?.total ?? 0) }, metrics: { em_atraso: Number(summary?.em_atraso ?? 0), em_cobranca: Number(summary?.em_cobranca ?? 0), recuperado: Number(summary?.recuperado ?? 0), taxa_recuperacao: Number(summary?.taxa_recuperacao ?? 0) } })
  } catch (error) { console.error("[v0] Erro ao buscar cobranças:", error); return errorResponse(error, "Erro ao buscar cobranças") }
}

export async function POST(request: NextRequest) {
  try {
    const auth = await getAuthContext()
    if (!auth) return NextResponse.json({ error: "Não autenticado" }, { status: 401 })
    const body = await request.json()
    const valorOriginal = parseMoney(body.valor_original)
    const tipo = String(body.tipo_cobranca || "amigavel")
    if (valorOriginal === null || valorOriginal <= 0) return NextResponse.json({ error: "valor_original deve ser maior que zero" }, { status: 422 })
    if (!TYPES.includes(tipo as (typeof TYPES)[number])) return NextResponse.json({ error: "tipo_cobranca inválido" }, { status: 422 })
    const rows = await transaction([{ text: `INSERT INTO cobrancas (administradora_id, beneficiario_id, conta_receber_id, tipo_cobranca, status, valor_original, valor_atual, responsavel_id, canal_contato, observacoes, historico, data_inicio) VALUES ($1,$2,$3,$4,'pendente',$5,$5,$6,$7,$8,$9::jsonb,CURRENT_DATE) RETURNING id`, params: [auth.administradoraId, body.beneficiario_id || null, body.conta_receber_id || null, tipo, valorOriginal, auth.userId, body.canal_contato || "email", body.observacoes || null, JSON.stringify([{ data: new Date().toISOString(), acao: "Início da cobrança", responsavel_id: auth.userId }])] }])
    return NextResponse.json({ message: "Cobrança criada com sucesso", id: rows[0]?.[0]?.id }, { status: 201 })
  } catch (error) { console.error("[v0] Erro ao criar cobrança:", error); return errorResponse(error, "Erro ao criar cobrança") }
}

export async function PATCH(request: NextRequest) {
  try {
    const auth = await getAuthContext()
    if (!auth) return NextResponse.json({ error: "Não autenticado" }, { status: 401 })
    const body = await request.json()
    const id = Number(body.id)
    const status = body.status
    if (!Number.isInteger(id) || id <= 0 || !isCobrancaStatus(status)) return NextResponse.json({ error: "id ou status inválido" }, { status: 422 })

    const currentRows = await query<{ id: number; status: string }>(
      `SELECT id, status FROM cobrancas WHERE id = $1 AND administradora_id = $2 AND deleted_at IS NULL`,
      [id, auth.administradoraId],
    )
    const current = currentRows[0]
    if (!current) return NextResponse.json({ error: "Cobrança não encontrada" }, { status: 404 })
    if (!isCobrancaStatus(current.status)) return NextResponse.json({ error: "Cobrança possui status inconsistente" }, { status: 409 })
    if (!canTransitionCobranca(current.status, status)) {
      return NextResponse.json({ error: `Transição inválida: ${current.status} para ${status}` }, { status: 409 })
    }
    if (current.status === status) return NextResponse.json({ message: "Status já está atualizado", data: current })

    const evento = JSON.stringify([{ data: new Date().toISOString(), acao: `Status alterado de ${current.status} para ${status}`, responsavel_id: auth.userId }])
    const rows = await query(
      `UPDATE cobrancas SET status = $1, updated_at = NOW(), historico = COALESCE(historico, '[]'::jsonb) || $2::jsonb WHERE id = $3 AND administradora_id = $4 AND deleted_at IS NULL AND status = $5 RETURNING id, status`,
      [status, evento, id, auth.administradoraId, current.status],
    )
    if (!rows.length) return NextResponse.json({ error: "Cobrança foi alterada por outra operação" }, { status: 409 })
    return NextResponse.json({ message: "Status atualizado", data: rows[0] })
  } catch (error) { console.error("[v0] Erro ao atualizar cobrança:", error); return errorResponse(error, "Erro ao atualizar cobrança") }
}
