import { type NextRequest, NextResponse } from "next/server"
import { query } from "@/lib/database"

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams
    const ativo = searchParams.get("ativo")
    const titular_id = searchParams.get("titular_id")
    const search = searchParams.get("search")

    const params: unknown[] = []
    const conditions = [`b.tipo_beneficiario = 'dependente'`]
    if (ativo !== null) { params.push(ativo === "true" ? "ativo" : "inativo"); conditions.push(`b.status = $${params.length}`) }
    if (titular_id) { params.push(Number.parseInt(titular_id, 10)); conditions.push(`b.titular_id = $${params.length}`) }
    if (search) { params.push(`%${search}%`); conditions.push(`(p.nome_completo ILIKE $${params.length} OR p.cpf ILIKE $${params.length} OR tp.nome_completo ILIKE $${params.length})`) }
    const dependentes = await query(`SELECT b.*, p.nome_completo AS nome, p.cpf, p.email, tp.nome_completo AS titular_nome FROM beneficiarios b LEFT JOIN pessoas p ON p.id = b.pessoa_id LEFT JOIN beneficiarios t ON t.id = b.titular_id LEFT JOIN pessoas tp ON tp.id = t.pessoa_id WHERE ${conditions.join(" AND ")} ORDER BY b.created_at DESC NULLS LAST`, params)

    return NextResponse.json({
      success: true,
      data: dependentes,
      count: dependentes.length,
    })
  } catch (error) {
    console.error("[v0] Erro ao buscar dependentes:", error)
    return NextResponse.json(
      { success: false, message: "Erro ao buscar dependentes", error: error instanceof Error ? error.message : "Erro desconhecido" },
      { status: 500 },
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()

    // Validações básicas
    if (!body.beneficiario_titular_id) {
      return NextResponse.json(
        { success: false, message: "beneficiario_titular_id é obrigatório" },
        { status: 400 },
      )
    }

    const titularRows = await query(`SELECT id, proposta_id, plano_id, operadora_id FROM beneficiarios WHERE id = $1 AND tipo_beneficiario = 'titular'`, [body.beneficiario_titular_id])
    const titular = titularRows[0]
    if (!titular) return NextResponse.json({ success: false, message: "Titular não encontrado" }, { status: 404 })
    if (!body.parentesco) return NextResponse.json({ success: false, message: "parentesco é obrigatório" }, { status: 400 })
    const rows = await query(`INSERT INTO beneficiarios (administradora_id, pessoa_id, proposta_id, contrato_id, plano_id, operadora_id, tipo_beneficiario, titular_id, parentesco, data_inclusao, status) VALUES ($1,$2,$3,$4,$5,$6,'dependente',$7,$8,$9,$10) RETURNING *`, [body.administradora_id || 1, body.pessoa_id || null, titular.proposta_id || null, body.contrato_id || null, titular.plano_id, titular.operadora_id, titular.id, body.parentesco, body.data_inclusao || new Date().toISOString().split('T')[0], body.status || 'ativo'])
    return NextResponse.json({ success: true, data: rows[0], message: "Dependente criado com sucesso" }, { status: 201 })
  } catch (error) {
    console.error("[v0] Erro ao criar dependente:", error)
    return NextResponse.json(
      { success: false, message: "Erro ao criar dependente", error: error instanceof Error ? error.message : "Erro desconhecido" },
      { status: 500 },
    )
  }
}
