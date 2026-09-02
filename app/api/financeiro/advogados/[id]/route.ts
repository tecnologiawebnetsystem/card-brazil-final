import { type NextRequest, NextResponse } from "next/server"
import { query } from "@/lib/database"

export async function GET(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const id = Number.parseInt(params.id)

    const rows = await query(`SELECT * FROM advogados WHERE id = $1`, [id])
    const advogado = rows[0]
    if (!advogado) return NextResponse.json({ error: "Advogado não encontrado" }, { status: 404 })
    return NextResponse.json(advogado)
  } catch (error: any) {
    console.error("Erro ao buscar advogado:", error)
    return NextResponse.json({ error: "Erro ao buscar advogado", details: error.message }, { status: 500 })
  }
}

export async function PUT(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const id = Number.parseInt(params.id)
    const body = await request.json()

    const allowed = ["nome", "oab", "oab_uf", "cpf", "email", "telefone", "celular", "ativo", "observacoes"]
    const entries = Object.entries(body).filter(([key]) => allowed.includes(key))
    if (!entries.length) return NextResponse.json({ error: "Nenhum campo válido para atualizar" }, { status: 400 })
    const values = entries.map(([, value]) => value)
    const updates = entries.map(([key], index) => `${key} = $${index + 1}`)
    values.push(id)
    const rows = await query(`UPDATE advogados SET ${updates.join(", ")}, updated_at = CURRENT_TIMESTAMP WHERE id = $${values.length} RETURNING *`, values)
    if (!rows.length) return NextResponse.json({ error: "Advogado não encontrado" }, { status: 404 })
    return NextResponse.json({ message: "Advogado atualizado com sucesso", data: rows[0] })
  } catch (error: any) {
    console.error("Erro ao atualizar advogado:", error)
    return NextResponse.json({ error: "Erro ao atualizar advogado", details: error.message }, { status: 500 })
  }
}

export async function DELETE(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const id = Number.parseInt(params.id)

    const rows = await query(`DELETE FROM advogados WHERE id = $1 RETURNING id`, [id])
    if (!rows.length) return NextResponse.json({ error: "Advogado não encontrado" }, { status: 404 })
    return NextResponse.json({ message: "Advogado excluído com sucesso" })
  } catch (error: any) {
    console.error("Erro ao excluir advogado:", error)
    return NextResponse.json({ error: "Erro ao excluir advogado", details: error.message }, { status: 500 })
  }
}
