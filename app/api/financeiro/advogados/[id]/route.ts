import { type NextRequest, NextResponse } from "next/server"
import { pool } from "@/lib/database"
import type { RowDataPacket, ResultSetHeader } from "mysql2/promise"

export async function GET(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const id = params.id

    const [rows] = await pool.execute<RowDataPacket[]>(`SELECT * FROM advogados WHERE id = ? AND deleted_at IS NULL`, [
      id,
    ])

    if (rows.length === 0) {
      return NextResponse.json({ error: "Advogado não encontrado" }, { status: 404 })
    }

    return NextResponse.json(rows[0])
  } catch (error: any) {
    console.error("[v0] Erro ao buscar advogado:", error)
    return NextResponse.json({ error: "Erro ao buscar advogado", details: error.message }, { status: 500 })
  }
}

export async function PUT(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const id = params.id
    const body = await request.json()

    const keys = Object.keys(body)
    const values = Object.values(body)
    const setClause = keys.map((key) => `${key} = ?`).join(", ")

    const [result] = await pool.execute<ResultSetHeader>(`UPDATE advogados SET ${setClause} WHERE id = ?`, [
      ...values,
      id,
    ])

    if (result.affectedRows === 0) {
      return NextResponse.json({ error: "Advogado não encontrado" }, { status: 404 })
    }

    return NextResponse.json({ message: "Advogado atualizado com sucesso" })
  } catch (error: any) {
    console.error("[v0] Erro ao atualizar advogado:", error)
    return NextResponse.json({ error: "Erro ao atualizar advogado", details: error.message }, { status: 500 })
  }
}

export async function DELETE(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const id = params.id

    const [result] = await pool.execute<ResultSetHeader>(`UPDATE advogados SET deleted_at = NOW() WHERE id = ?`, [id])

    if (result.affectedRows === 0) {
      return NextResponse.json({ error: "Advogado não encontrado" }, { status: 404 })
    }

    return NextResponse.json({ message: "Advogado excluído com sucesso" })
  } catch (error: any) {
    console.error("[v0] Erro ao excluir advogado:", error)
    return NextResponse.json({ error: "Erro ao excluir advogado", details: error.message }, { status: 500 })
  }
}
