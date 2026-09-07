import { type NextRequest, NextResponse } from "next/server"
import { successResponse, errorResponse } from "@/lib/api-response"
import { query } from "@/lib/database"

export async function GET(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id: rawId } = await params
    const rows = await query(`SELECT * FROM planos WHERE id = $1`, [Number.parseInt(rawId, 10)])
    const plano = rows[0]
    if (!plano) return NextResponse.json(errorResponse("Plano não encontrado"), { status: 404 })
    return NextResponse.json(successResponse(plano))
  } catch (error) {
    return NextResponse.json({ success: false, message: "Erro interno" }, { status: 500 })
  }
}

export async function PUT(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const body = await request.json()
    const { id: rawId } = await params
    const normalized = {
      nome: body.nome,
      codigo_ans: body.codigo_ans ?? body.codigo,
      tipo_plano: body.tipo_plano ?? body.tipo,
      valor_base: body.valor_base ?? body.valor,
      descricao: body.descricao ?? body.cobertura,
      status: body.status ?? (body.ativo === false ? "inativo" : "ativo"),
    }
    const id = Number.parseInt(rawId, 10)
    const allowed = ["nome", "codigo_ans", "tipo_plano", "valor_base", "descricao", "status"]
    const entries = Object.entries(normalized).filter(([key, value]) => allowed.includes(key) && value !== undefined)
    if (!entries.length) return NextResponse.json(errorResponse("Nenhum campo válido para atualizar"), { status: 400 })
    const values = entries.map(([, value]) => value)
    const updates = entries.map(([key], index) => `${key} = $${index + 1}`)
    values.push(id)
    const rows = await query(`UPDATE planos SET ${updates.join(", ")}, updated_at = CURRENT_TIMESTAMP WHERE id = $${values.length} RETURNING *`, values)
    if (!rows.length) return NextResponse.json(errorResponse("Plano não encontrado"), { status: 404 })
    return NextResponse.json(successResponse(rows[0], "Plano atualizado com sucesso"))
  } catch (error) {
    return NextResponse.json({ success: false, message: "Erro interno" }, { status: 500 })
  }
}

export async function DELETE(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id: rawId } = await params
    const rows = await query(`DELETE FROM planos WHERE id = $1 RETURNING id`, [Number.parseInt(rawId, 10)])
    if (!rows.length) return NextResponse.json(errorResponse("Plano não encontrado"), { status: 404 })
    return NextResponse.json(successResponse(null, "Plano excluído com sucesso"))
  } catch (error) {
    return NextResponse.json({ success: false, message: "Erro interno" }, { status: 500 })
  }
}
