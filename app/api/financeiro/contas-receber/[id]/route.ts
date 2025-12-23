import { type NextRequest, NextResponse } from "next/server"
import { pool } from "@/lib/database"
import type { RowDataPacket, ResultSetHeader } from "mysql2/promise"

export async function GET(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const id = params.id

    const [rows] = await pool.execute<RowDataPacket[]>(
      `SELECT 
        cr.*,
        b.nome as beneficiario_nome,
        p.nome as pessoa_nome,
        p.cpf,
        pr.numero_proposta,
        c.numero_contrato
      FROM contas_receber cr
      LEFT JOIN beneficiarios b ON cr.beneficiario_id = b.id
      LEFT JOIN pessoas p ON b.pessoa_id = p.id
      LEFT JOIN propostas pr ON cr.proposta_id = pr.id
      LEFT JOIN contratos c ON cr.contrato_id = c.id
      WHERE cr.id = ? AND cr.deleted_at IS NULL`,
      [id],
    )

    if (rows.length === 0) {
      return NextResponse.json({ error: "Conta a receber não encontrada" }, { status: 404 })
    }

    return NextResponse.json(rows[0])
  } catch (error: any) {
    console.error("[v0] Erro ao buscar conta a receber:", error)
    return NextResponse.json({ error: "Erro ao buscar conta a receber", details: error.message }, { status: 500 })
  }
}

export async function PUT(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const id = params.id
    const body = await request.json()

    // Recalcular valor total se necessário
    if (body.valor_original || body.valor_multa || body.valor_juros || body.valor_desconto) {
      const [current] = await pool.execute<RowDataPacket[]>(`SELECT * FROM contas_receber WHERE id = ?`, [id])

      if (current.length === 0) {
        return NextResponse.json({ error: "Conta a receber não encontrada" }, { status: 404 })
      }

      const currentData = current[0]
      const valor_original = body.valor_original ?? currentData.valor_original
      const valor_multa = body.valor_multa ?? currentData.valor_multa
      const valor_juros = body.valor_juros ?? currentData.valor_juros
      const valor_desconto = body.valor_desconto ?? currentData.valor_desconto

      body.valor_total = valor_original + valor_multa + valor_juros - valor_desconto
    }

    // Atualizar status se pagamento total
    if (body.valor_pago && body.valor_total && body.valor_pago >= body.valor_total) {
      body.status = "pago"
      body.data_pagamento = new Date().toISOString().split("T")[0]
    } else if (body.valor_pago && body.valor_pago > 0) {
      body.status = "parcial"
    }

    const keys = Object.keys(body)
    const values = Object.values(body)
    const setClause = keys.map((key) => `${key} = ?`).join(", ")

    const [result] = await pool.execute<ResultSetHeader>(`UPDATE contas_receber SET ${setClause} WHERE id = ?`, [
      ...values,
      id,
    ])

    if (result.affectedRows === 0) {
      return NextResponse.json({ error: "Conta a receber não encontrada" }, { status: 404 })
    }

    return NextResponse.json({ message: "Conta a receber atualizada com sucesso" })
  } catch (error: any) {
    console.error("[v0] Erro ao atualizar conta a receber:", error)
    return NextResponse.json({ error: "Erro ao atualizar conta a receber", details: error.message }, { status: 500 })
  }
}

export async function DELETE(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const id = params.id

    // Soft delete
    const [result] = await pool.execute<ResultSetHeader>(`UPDATE contas_receber SET deleted_at = NOW() WHERE id = ?`, [
      id,
    ])

    if (result.affectedRows === 0) {
      return NextResponse.json({ error: "Conta a receber não encontrada" }, { status: 404 })
    }

    return NextResponse.json({ message: "Conta a receber excluída com sucesso" })
  } catch (error: any) {
    console.error("[v0] Erro ao excluir conta a receber:", error)
    return NextResponse.json({ error: "Erro ao excluir conta a receber", details: error.message }, { status: 500 })
  }
}
