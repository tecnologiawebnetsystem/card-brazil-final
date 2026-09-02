import { type NextRequest, NextResponse } from "next/server"
import { query } from "@/lib/database"

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams
    const status = searchParams.get("status")
    const search = searchParams.get("search")
    const tipo_plano = searchParams.get("tipo_plano")

    const params: unknown[] = []
    const conditions: string[] = []
    if (status) { params.push(status); conditions.push(`status = $${params.length}`) }
    if (tipo_plano) { params.push(tipo_plano); conditions.push(`tipo_plano = $${params.length}`) }
    if (search) { params.push(`%${search}%`); conditions.push(`(nome_proponente ILIKE $${params.length} OR empresa ILIKE $${params.length} OR cpf_cnpj ILIKE $${params.length} OR observacoes ILIKE $${params.length})`) }
    const where = conditions.length ? ` WHERE ${conditions.join(" AND ")}` : ""
    const propostas = await query(`SELECT * FROM propostas${where} ORDER BY created_at DESC NULLS LAST`, params)
    return NextResponse.json(propostas)
  } catch (error: any) {
    console.error("[v0] Erro ao buscar propostas:", error)
    return NextResponse.json({ error: "Erro ao buscar propostas", details: error.message }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()

    if (!body.nome_proponente || !body.cpf_cnpj || !body.tipo_plano) {
      return NextResponse.json({ error: "nome_proponente, cpf_cnpj e tipo_plano são obrigatórios" }, { status: 400 })
    }
    const rows = await query(`INSERT INTO propostas (administradora_id, nome_proponente, cpf_cnpj, email, telefone, empresa, numero_funcionarios, tipo_plano, valor_proposto, observacoes, status) VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,'pendente') RETURNING id`, [body.administradora_id || 1, body.nome_proponente, body.cpf_cnpj, body.email || null, body.telefone || null, body.empresa || null, body.numero_funcionarios || null, body.tipo_plano, body.valor_proposto || null, body.observacoes || null])
    return NextResponse.json({ message: "Proposta criada com sucesso", id: rows[0].id }, { status: 201 })
  } catch (error: any) {
    console.error("[v0] Erro ao criar proposta:", error)
    return NextResponse.json({ error: "Erro ao criar proposta", details: error.message }, { status: 500 })
  }
}
