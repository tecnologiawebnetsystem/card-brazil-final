import { type NextRequest, NextResponse } from "next/server"
import { query } from "@/lib/database"
import { requireCadastroAccess, authErrorStatus } from "@/lib/api-auth"
import { recordCadastroAudit } from "@/lib/cadastro-audit"
import { beneficiarioSchema, zodFieldErrors } from "@/lib/validation"

export async function GET(request: NextRequest) {
  try {
    const { administradoraId } = await requireCadastroAccess("view")
    const searchParams = request.nextUrl.searchParams
    const ativo = searchParams.get("ativo")
    const tipo_beneficiario = searchParams.get("tipo_beneficiario") || searchParams.get("tipo")
    const titular_id = searchParams.get("titular_id")
    const limit = Math.min(Math.max(Number.parseInt(searchParams.get("limit") || "50", 10) || 50, 1), 100)
    const offset = Math.max(Number.parseInt(searchParams.get("offset") || "0", 10) || 0, 0)

    const params: unknown[] = [administradoraId]
    const conditions: string[] = ["b.administradora_id = $1"]
    if (ativo !== null) { params.push(ativo === "true" ? "ativo" : "inativo"); conditions.push(`status = $${params.length}`) }
    if (tipo_beneficiario) { params.push(tipo_beneficiario); conditions.push(`tipo_beneficiario = $${params.length}`) }
    if (titular_id) { params.push(Number.parseInt(titular_id, 10)); conditions.push(`titular_id = $${params.length}`) }
    const where = conditions.length ? ` WHERE ${conditions.join(" AND ")}` : ""
    params.push(limit, offset)
    const result = await query(`SELECT b.*, p.nome_completo AS nome, p.cpf, p.email, p.telefone_principal AS telefone, tp.nome_completo AS titular_nome, pl.nome AS plano_nome, o.nome_fantasia AS operadora_nome, COUNT(*) OVER() AS total_registros FROM beneficiarios b LEFT JOIN pessoas p ON p.id = b.pessoa_id LEFT JOIN beneficiarios tb ON tb.id = b.titular_id LEFT JOIN pessoas tp ON tp.id = tb.pessoa_id LEFT JOIN planos pl ON pl.id = b.plano_id LEFT JOIN operadoras op ON op.id = pl.operadora_id LEFT JOIN pessoas o ON o.id = op.pessoa_id${where.replaceAll("status", "b.status").replaceAll("tipo_beneficiario", "b.tipo_beneficiario").replaceAll("titular_id", "b.titular_id")} ORDER BY b.created_at DESC NULLS LAST LIMIT $${params.length - 1} OFFSET $${params.length}`, params)
    return NextResponse.json({ success: true, data: result, count: result.length, pagination: { limit, offset } })
  } catch (error) {
    console.error("[v0] Erro ao buscar beneficiários:", error)
    return NextResponse.json(
      {
        success: false,
        message: "Erro ao buscar beneficiários",
        error: "Falha ao consultar beneficiários",
      },
      { status: authErrorStatus(error) },
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const { administradoraId, userId } = await requireCadastroAccess("create")
    const parsed = beneficiarioSchema.safeParse(await request.json())
    if (!parsed.success) return NextResponse.json({ success: false, message: "Dados do beneficiário inválidos", fields: zodFieldErrors(parsed.error) }, { status: 400 })
    const body = parsed.data
    const pessoa = await query(`SELECT id FROM pessoas WHERE id = $1 AND administradora_id = $2 AND deleted_at IS NULL`, [body.pessoa_id, administradoraId])
    if (!pessoa.length) return NextResponse.json({ success: false, message: "Pessoa não encontrada nesta administradora" }, { status: 404 })
    if (body.tipo_beneficiario === "dependente") {
      const titular = await query(`SELECT id FROM beneficiarios WHERE id = $1 AND administradora_id = $2 AND status = 'ativo'`, [body.titular_id, administradoraId])
      if (!titular.length) return NextResponse.json({ success: false, message: "Titular ativo não encontrado" }, { status: 400 })
    }
    const rows = await query(`INSERT INTO beneficiarios (administradora_id, pessoa_id, contrato_id, plano_id, numero_carteirinha, tipo_beneficiario, titular_id, data_inclusao, valor_mensalidade, status) VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10) RETURNING *`, [administradoraId, body.pessoa_id, body.contrato_id, body.plano_id, body.numero_carteirinha, body.tipo_beneficiario, body.titular_id || null, body.data_inclusao, body.valor_mensalidade || null, body.status])
    await recordCadastroAudit({ administradoraId, userId, action: "create", tableName: "beneficiarios", recordId: rows[0].id, after: rows[0] })
    return NextResponse.json({ success: true, data: rows[0], message: "Beneficiário criado com sucesso" }, { status: 201 })
  } catch (error) {
    console.error("[v0] Erro ao criar beneficiário:", error)
    return NextResponse.json(
      { success: false, message: "Erro ao criar beneficiário", error: error instanceof Error ? error.message : "Erro desconhecido" },
      { status: authErrorStatus(error) },
    )
  }
}
