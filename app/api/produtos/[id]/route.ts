import { type NextRequest, NextResponse } from "next/server"
import { successResponse, errorResponse } from "@/lib/api-response"
import { query } from "@/lib/database"

export async function GET(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const rows = await query(`SELECT * FROM produtos WHERE id = $1`, [Number.parseInt(params.id, 10)])
    const produto = rows[0]
    if (!produto) return NextResponse.json(errorResponse("Produto não encontrado"), { status: 404 })
    return NextResponse.json(successResponse(produto))
  } catch (error) {
    return NextResponse.json({ success: false, message: "Erro interno" }, { status: 500 })
  }
}

export async function PUT(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const body = await request.json()
    const id = Number.parseInt(params.id)
    const allowed = ["nome", "codigo_produto", "valor_mensalidade", "idade_minima", "idade_maxima", "status"]
    const entries = Object.entries(body).filter(([key]) => allowed.includes(key))
    if (!entries.length) return NextResponse.json(errorResponse("Nenhum campo válido para atualizar"), { status: 400 })
    const values = entries.map(([, value]) => value)
    const updates = entries.map(([key], index) => `${key} = $${index + 1}`)
    values.push(id)
    const rows = await query(`UPDATE produtos SET ${updates.join(", ")}, updated_at = CURRENT_TIMESTAMP WHERE id = $${values.length} RETURNING *`, values)
    if (!rows.length) return NextResponse.json(errorResponse("Produto não encontrado"), { status: 404 })
    return NextResponse.json(successResponse(rows[0], "Produto atualizado com sucesso"))
  } catch (error) {
    return NextResponse.json({ success: false, message: "Erro interno" }, { status: 500 })
  }
}

export async function DELETE(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const rows = await query(`DELETE FROM produtos WHERE id = $1 RETURNING id`, [Number.parseInt(params.id, 10)])
    if (!rows.length) return NextResponse.json(errorResponse("Produto não encontrado"), { status: 404 })
    return NextResponse.json(successResponse(null, "Produto excluído com sucesso"))
  } catch (error) {
    return NextResponse.json({ success: false, message: "Erro interno" }, { status: 500 })
  }
}
