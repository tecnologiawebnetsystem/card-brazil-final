import { type NextRequest, NextResponse } from "next/server"
import { successResponse, errorResponse } from "@/lib/api-response"
import { query } from "@/lib/database"

export async function GET(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const rows = await query(`SELECT * FROM estipulantes WHERE id = $1`, [Number.parseInt((await params).id, 10)])
    const estipulante = rows[0]
    if (!estipulante) return NextResponse.json(errorResponse("Estipulante não encontrado"), { status: 404 })
    return NextResponse.json(successResponse(estipulante))
  } catch (error) {
    return NextResponse.json({ success: false, message: "Erro interno" }, { status: 500 })
  }
}

export async function PUT(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const body = await request.json()
    const id = Number.parseInt((await params).id, 10)
    const allowed = ["nome", "razao_social", "cnpj", "cpf_cnpj", "email", "telefone", "endereco", "cidade", "uf", "ativo", "observacoes"]
    const entries = Object.entries(body).filter(([key]) => allowed.includes(key))
    if (!entries.length) return NextResponse.json(errorResponse("Nenhum campo válido para atualizar"), { status: 400 })
    const values = entries.map(([, value]) => value)
    const updates = entries.map(([key], index) => `${key} = $${index + 1}`)
    values.push(id)
    const rows = await query(`UPDATE estipulantes SET ${updates.join(", ")}, updated_at = CURRENT_TIMESTAMP WHERE id = $${values.length} RETURNING *`, values)
    if (!rows.length) return NextResponse.json(errorResponse("Estipulante não encontrado"), { status: 404 })
    return NextResponse.json(successResponse(rows[0], "Estipulante atualizado com sucesso"))
  } catch (error) {
    return NextResponse.json({ success: false, message: "Erro interno" }, { status: 500 })
  }
}

export async function DELETE(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const rows = await query(`DELETE FROM estipulantes WHERE id = $1 RETURNING id`, [Number.parseInt((await params).id, 10)])
    if (!rows.length) return NextResponse.json(errorResponse("Estipulante não encontrado"), { status: 404 })
    return NextResponse.json(successResponse(null, "Estipulante excluído com sucesso"))
  } catch (error) {
    return NextResponse.json({ success: false, message: "Erro interno" }, { status: 500 })
  }
}
