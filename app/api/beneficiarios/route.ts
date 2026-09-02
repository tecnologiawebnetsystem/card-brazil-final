import { type NextRequest, NextResponse } from "next/server"
import { query } from "@/lib/database"

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams
    const ativo = searchParams.get("ativo")
    const tipo_beneficiario = searchParams.get("tipo_beneficiario")
    const titular_id = searchParams.get("titular_id")
    const limit = Math.min(Math.max(Number.parseInt(searchParams.get("limit") || "50", 10) || 50, 1), 100)
    const offset = Math.max(Number.parseInt(searchParams.get("offset") || "0", 10) || 0, 0)

    const params: unknown[] = []
    const conditions: string[] = []
    if (ativo !== null) { params.push(ativo === "true" ? "ativo" : "inativo"); conditions.push(`status = $${params.length}`) }
    if (tipo_beneficiario) { params.push(tipo_beneficiario); conditions.push(`tipo_beneficiario = $${params.length}`) }
    if (titular_id) { params.push(Number.parseInt(titular_id, 10)); conditions.push(`titular_id = $${params.length}`) }
    const where = conditions.length ? ` WHERE ${conditions.join(" AND ")}` : ""
    params.push(limit, offset)
    const result = await query(`SELECT * FROM beneficiarios${where} ORDER BY created_at DESC NULLS LAST LIMIT $${params.length - 1} OFFSET $${params.length}`, params)
    return NextResponse.json({ success: true, data: result, count: result.length, pagination: { limit, offset } })
  } catch (error) {
    console.error("[v0] Erro ao buscar beneficiários:", error)
    return NextResponse.json(
      {
        success: false,
        message: "Erro ao buscar beneficiários",
        error: "Falha ao consultar beneficiários",
      },
      { status: 500 },
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()

    // Validações básicas
    if (!body.pessoa_id) {
      return NextResponse.json(
        { success: false, message: "pessoa_id é obrigatório" },
        { status: 400 },
      )
    }

    if (!body.tipo_beneficiario || !["titular", "dependente"].includes(body.tipo_beneficiario)) {
      return NextResponse.json(
        { success: false, message: "tipo_beneficiario deve ser 'titular' ou 'dependente'" },
        { status: 400 },
      )
    }

    if (!body.contrato_id || !body.plano_id || !body.numero_carteirinha || !body.data_inclusao) {
      return NextResponse.json({ success: false, message: "contrato_id, plano_id, numero_carteirinha e data_inclusao são obrigatórios" }, { status: 400 })
    }
    const rows = await query(`INSERT INTO beneficiarios (administradora_id, pessoa_id, contrato_id, plano_id, numero_carteirinha, tipo_beneficiario, titular_id, data_inclusao, valor_mensalidade, status) VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10) RETURNING *`, [body.administradora_id || 1, body.pessoa_id, body.contrato_id, body.plano_id, body.numero_carteirinha, body.tipo_beneficiario, body.titular_id || null, body.data_inclusao, body.valor_mensalidade || null, body.status || "ativo"])
    return NextResponse.json({ success: true, data: rows[0], message: "Beneficiário criado com sucesso" }, { status: 201 })
  } catch (error) {
    console.error("[v0] Erro ao criar beneficiário:", error)
    return NextResponse.json(
      { success: false, message: "Erro ao criar beneficiário", error: error instanceof Error ? error.message : "Erro desconhecido" },
      { status: 500 },
    )
  }
}
