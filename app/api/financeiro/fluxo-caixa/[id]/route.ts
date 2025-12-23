import { type NextRequest, NextResponse } from "next/server"
import { pool } from "@/lib/database"
import type { RowDataPacket, ResultSetHeader } from "mysql2/promise"

export async function GET(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const id = params.id

    const [rows] = await pool.execute<RowDataPacket[]>(
      `SELECT 
        fc.*,
        cr.numero_documento as conta_receber_documento,
        cp.numero_documento as conta_pagar_documento,
        b.nome as banco_nome
      FROM fluxo_caixa fc
      LEFT JOIN contas_receber cr ON fc.conta_receber_id = cr.id
      LEFT JOIN contas_pagar cp ON fc.conta_pagar_id = cp.id
      LEFT JOIN bancos b ON fc.conta_bancaria_id = b.id
      WHERE fc.id = ? AND fc.deleted_at IS NULL`,
      [id],
    )

    if (rows.length === 0) {
      return NextResponse.json({ error: "Movimentação não encontrada" }, { status: 404 })
    }

    return NextResponse.json(rows[0])
  } catch (error: any) {
    console.error("[v0] Erro ao buscar movimentação:", error)
    return NextResponse.json({ error: "Erro ao buscar movimentação", details: error.message }, { status: 500 })
  }
}

export async function PUT(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const id = params.id
    const body = await request.json()

    const keys = Object.keys(body)
    const values = Object.values(body)
    const setClause = keys.map((key) => `${key} = ?`).join(", ")

    const [result] = await pool.execute<ResultSetHeader>(`UPDATE fluxo_caixa SET ${setClause} WHERE id = ?`, [
      ...values,
      id,
    ])

    if (result.affectedRows === 0) {
      return NextResponse.json({ error: "Movimentação não encontrada" }, { status: 404 })
    }

    return NextResponse.json({ message: "Movimentação atualizada com sucesso" })
  } catch (error: any) {
    console.error("[v0] Erro ao atualizar movimentação:", error)
    return NextResponse.json({ error: "Erro ao atualizar movimentação", details: error.message }, { status: 500 })
  }
}

export async function DELETE(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const id = params.id

    const [result] = await pool.execute<ResultSetHeader>(`UPDATE fluxo_caixa SET deleted_at = NOW() WHERE id = ?`, [id])

    if (result.affectedRows === 0) {
      return NextResponse.json({ error: "Movimentação não encontrada" }, { status: 404 })
    }

    return NextResponse.json({ message: "Movimentação excluída com sucesso" })
  } catch (error: any) {
    console.error("[v0] Erro ao excluir movimentação:", error)
    return NextResponse.json({ error: "Erro ao excluir movimentação", details: error.message }, { status: 500 })
  }
}
