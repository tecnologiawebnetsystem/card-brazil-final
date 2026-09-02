import { type NextRequest, NextResponse } from "next/server"
import { successResponse } from "@/lib/api-response"
import { query } from "@/lib/database"

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams
    const ativo = searchParams.get("ativo")
    const operadora_id = searchParams.get("operadora_id")

    const params: unknown[] = []
    const conditions: string[] = []
    if (ativo !== null) { params.push(ativo === "true" ? "ativo" : "inativo"); conditions.push(`status = $${params.length}`) }
    if (operadora_id) { params.push(Number.parseInt(operadora_id, 10)); conditions.push(`p.plano_id IN (SELECT id FROM planos WHERE operadora_id = $${params.length})`) }
    const where = conditions.length ? ` WHERE ${conditions.join(" AND ")}` : ""
    const produtos = await query(`SELECT p.* FROM produtos p${where} ORDER BY p.created_at DESC NULLS LAST`, params)
    return NextResponse.json(successResponse(produtos))
  } catch (error) {
    return NextResponse.json({ success: false, message: "Erro interno" }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    if (!body.plano_id || !body.nome) return NextResponse.json({ success: false, message: "plano_id e nome são obrigatórios" }, { status: 400 })
    const rows = await query(`INSERT INTO produtos (administradora_id, plano_id, nome, codigo_produto, valor_mensalidade, idade_minima, idade_maxima, status) VALUES ($1,$2,$3,$4,$5,$6,$7,$8) RETURNING *`, [body.administradora_id || 1, body.plano_id, body.nome, body.codigo_produto || null, body.valor_mensalidade || null, body.idade_minima || null, body.idade_maxima || null, body.status || "ativo"])
    return NextResponse.json(successResponse(rows[0], "Produto criado com sucesso"), { status: 201 })
  } catch (error) {
    return NextResponse.json({ success: false, message: "Erro interno" }, { status: 500 })
  }
}
