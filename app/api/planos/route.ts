import { type NextRequest, NextResponse } from "next/server"
import { successResponse } from "@/lib/api-response"
import { query } from "@/lib/database"

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams
    const ativo = searchParams.get("ativo")
    const produto_id = searchParams.get("produto_id")

    const params: unknown[] = []
    const conditions: string[] = []
    if (ativo !== null) { params.push(ativo === "true" ? "ativo" : "inativo"); conditions.push(`status = $${params.length}`) }
    if (produto_id) { params.push(Number.parseInt(produto_id, 10)); conditions.push(`operadora_id = $${params.length}`) }
    const where = conditions.length ? ` WHERE ${conditions.join(" AND ")}` : ""
    const planos = await query(`SELECT * FROM planos${where} ORDER BY created_at DESC NULLS LAST`, params)
    return NextResponse.json(successResponse(planos))
  } catch (error) {
    return NextResponse.json({ success: false, message: "Erro interno" }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    if (!body.operadora_id || !body.nome || !body.tipo_plano) return NextResponse.json({ success: false, message: "operadora_id, nome e tipo_plano são obrigatórios" }, { status: 400 })
    const rows = await query(`INSERT INTO planos (administradora_id, operadora_id, nome, codigo_ans, tipo_plano, valor_base, descricao, status) VALUES ($1,$2,$3,$4,$5,$6,$7,$8) RETURNING *`, [body.administradora_id || 1, body.operadora_id, body.nome, body.codigo_ans || null, body.tipo_plano, body.valor_base || null, body.descricao || null, body.status || "ativo"])
    return NextResponse.json(successResponse(rows[0], "Plano criado com sucesso"), { status: 201 })
  } catch (error) {
    return NextResponse.json({ success: false, message: "Erro interno" }, { status: 500 })
  }
}
