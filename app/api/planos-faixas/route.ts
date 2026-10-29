import { type NextRequest, NextResponse } from "next/server"
import { query } from "@/back-end/lib/database"
import { apiAuthError, requireCadastroAccess } from "@/back-end/lib/api-auth"
import { apiError, successResponse } from "@/back-end/lib/api-response"

function validId(value: unknown): value is number {
  return Number.isInteger(value) && Number(value) > 0
}

function parsePayload(body: Record<string, unknown>) {
  const planoId = Number(body.plano_id)
  const idadeMinima = Number(body.idade_minima)
  const idadeMaxima = Number(body.idade_maxima)
  const valor = Number(body.valor)
  const inicio = typeof body.vigencia_inicio === "string" ? body.vigencia_inicio : ""
  const fim = typeof body.vigencia_fim === "string" ? body.vigencia_fim : ""
  if (!validId(planoId) || !Number.isInteger(idadeMinima) || idadeMinima < 0 || idadeMinima > 150 || !Number.isInteger(idadeMaxima) || idadeMaxima < idadeMinima || idadeMaxima > 150 || !Number.isFinite(valor) || valor < 0 || !/^\d{4}-\d{2}-\d{2}$/.test(inicio) || !/^\d{4}-\d{2}-\d{2}$/.test(fim) || fim < inicio) return null
  return { planoId, idadeMinima, idadeMaxima, valor, inicio, fim }
}

export async function GET(request: NextRequest) {
  try {
    const { administradoraId } = await requireCadastroAccess("view")
    const planoParam = request.nextUrl.searchParams.get("plano_id")
    const params: unknown[] = [administradoraId]
    let filter = ""
    if (planoParam !== null) {
      const planoId = Number(planoParam)
      if (!validId(planoId)) return apiError("plano_id inválido", 400)
      params.push(planoId)
      filter = " AND f.plano_id = $2"
    }
    const rows = await query(`SELECT f.id, f.plano_id, f.idade_minima, f.idade_maxima, f.valor, f.vigencia_inicio, f.vigencia_fim, f.created_at, f.updated_at, p.nome AS plano_nome FROM planos_faixas_etarias f JOIN planos p ON p.id = f.plano_id AND p.administradora_id = $1 AND p.deleted_at IS NULL WHERE TRUE${filter} ORDER BY f.plano_id, f.id`, params)
    return NextResponse.json(successResponse(rows))
  } catch (error) {
    const auth = apiAuthError(error)
    if (auth) return apiError(auth.message, auth.status)
    console.error("[v0] Erro ao listar faixas etárias", error)
    return apiError("Não foi possível carregar as faixas etárias", 500)
  }
}

export async function POST(request: NextRequest) {
  try {
    const { administradoraId } = await requireCadastroAccess("create")
    const parsed = parsePayload(await request.json())
    if (!parsed) return apiError("Dados da faixa inválidos", 422)
    const plano = await query("SELECT id FROM planos WHERE id = $1 AND administradora_id = $2 AND deleted_at IS NULL", [parsed.planoId, administradoraId])
    if (!plano.length) return apiError("Plano não encontrado", 404)
    const duplicate = await query("SELECT id FROM planos_faixas_etarias WHERE plano_id = $1 AND idade_minima = $2 AND idade_maxima = $3 AND vigencia_inicio = $4 AND vigencia_fim = $5 LIMIT 1", [parsed.planoId, parsed.idadeMinima, parsed.idadeMaxima, parsed.inicio, parsed.fim])
    if (duplicate.length) return apiError("Faixa já cadastrada para este plano", 409)
    const rows = await query("INSERT INTO planos_faixas_etarias (plano_id, idade_minima, idade_maxima, valor, vigencia_inicio, vigencia_fim) VALUES ($1,$2,$3,$4,$5,$6) RETURNING id, plano_id, idade_minima, idade_maxima, valor, vigencia_inicio, vigencia_fim, created_at, updated_at", [parsed.planoId, parsed.idadeMinima, parsed.idadeMaxima, parsed.valor, parsed.inicio, parsed.fim])
    return NextResponse.json(successResponse(rows[0], "Faixa criada com sucesso"), { status: 201 })
  } catch (error) {
    const auth = apiAuthError(error)
    if (auth) return apiError(auth.message, auth.status)
    console.error("[v0] Erro ao criar faixa etária", error)
    return apiError("Não foi possível criar a faixa etária", 500)
  }
}
