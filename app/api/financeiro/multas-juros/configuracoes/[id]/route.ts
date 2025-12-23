import { type NextRequest, NextResponse } from "next/server"
import { pool } from "@/lib/database"
import type { RowDataPacket, ResultSetHeader } from "mysql2/promise"

export async function GET(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const id = params.id

    const [rows] = await pool.execute<RowDataPacket[]>(
      `SELECT * FROM configuracoes_multas_juros WHERE id = ? AND deleted_at IS NULL`,
      [id],
    )

    if (rows.length === 0) {
      return NextResponse.json({ error: "Configuração não encontrada" }, { status: 404 })
    }

    return NextResponse.json(rows[0])
  } catch (error: any) {
    console.error("[v0] Erro ao buscar configuração:", error)
    return NextResponse.json({ error: "Erro ao buscar configuração", details: error.message }, { status: 500 })
  }
}

export async function PUT(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const id = params.id
    const body = await request.json()

    // Se for configuração padrão, desmarcar outras
    if (body.padrao) {
      const [current] = await pool.execute<RowDataPacket[]>(
        `SELECT id_administradora FROM configuracoes_multas_juros WHERE id = ?`,
        [id],
      )

      if (current.length > 0) {
        await pool.execute(
          `UPDATE configuracoes_multas_juros SET padrao = FALSE WHERE id_administradora = ? AND id != ?`,
          [current[0].id_administradora, id],
        )
      }
    }

    const keys = Object.keys(body)
    const values = Object.values(body)
    const setClause = keys.map((key) => `${key} = ?`).join(", ")

    const [result] = await pool.execute<ResultSetHeader>(
      `UPDATE configuracoes_multas_juros SET ${setClause} WHERE id = ?`,
      [...values, id],
    )

    if (result.affectedRows === 0) {
      return NextResponse.json({ error: "Configuração não encontrada" }, { status: 404 })
    }

    return NextResponse.json({ message: "Configuração atualizada com sucesso" })
  } catch (error: any) {
    console.error("[v0] Erro ao atualizar configuração:", error)
    return NextResponse.json({ error: "Erro ao atualizar configuração", details: error.message }, { status: 500 })
  }
}

export async function DELETE(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const id = params.id

    const [result] = await pool.execute<ResultSetHeader>(
      `UPDATE configuracoes_multas_juros SET deleted_at = NOW() WHERE id = ?`,
      [id],
    )

    if (result.affectedRows === 0) {
      return NextResponse.json({ error: "Configuração não encontrada" }, { status: 404 })
    }

    return NextResponse.json({ message: "Configuração excluída com sucesso" })
  } catch (error: any) {
    console.error("[v0] Erro ao excluir configuração:", error)
    return NextResponse.json({ error: "Erro ao excluir configuração", details: error.message }, { status: 500 })
  }
}
