import { type NextRequest, NextResponse } from "next/server"
import { sql } from "@/lib/database"

export async function GET(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const id = params.id

    const rows = await sql(`SELECT * FROM advogados WHERE id = $1 AND deleted_at IS NULL`, [id])

    if (rows.length === 0) {
      return NextResponse.json({ error: "Advogado não encontrado" }, { status: 404 })
    }

    return NextResponse.json(rows[0])
  } catch (error: any) {
    console.error("Erro ao buscar advogado:", error)
    return NextResponse.json({ error: "Erro ao buscar advogado", details: error.message }, { status: 500 })
  }
}

export async function PUT(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const id = params.id
    const body = await request.json()

    const keys = Object.keys(body)
    const values = Object.values(body)
    const setClause = keys.map((key, index) => `${key} = $${index + 1}`).join(", ")

    const rows = await sql(
      `UPDATE advogados SET ${setClause}, updated_at = CURRENT_TIMESTAMP WHERE id = $${keys.length + 1}`,
      [...values, id],
    )

    if (rows.length === 0) {
      return NextResponse.json({ error: "Advogado não encontrado" }, { status: 404 })
    }

    return NextResponse.json({ message: "Advogado atualizado com sucesso" })
  } catch (error: any) {
    console.error("Erro ao atualizar advogado:", error)
    return NextResponse.json({ error: "Erro ao atualizar advogado", details: error.message }, { status: 500 })
  }
}

export async function DELETE(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const id = params.id

    const rows = await sql(`UPDATE advogados SET deleted_at = CURRENT_TIMESTAMP WHERE id = $1`, [id])

    if (rows.length === 0) {
      return NextResponse.json({ error: "Advogado não encontrado" }, { status: 404 })
    }

    return NextResponse.json({ message: "Advogado excluído com sucesso" })
  } catch (error: any) {
    console.error("Erro ao excluir advogado:", error)
    return NextResponse.json({ error: "Erro ao excluir advogado", details: error.message }, { status: 500 })
  }
}
