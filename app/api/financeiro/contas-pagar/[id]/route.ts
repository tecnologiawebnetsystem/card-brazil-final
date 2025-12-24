import { type NextRequest, NextResponse } from "next/server"
import { pool } from "@/lib/database"

export async function GET(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const id = params.id

    const [rows] = await pool.execute(
      `SELECT 
        cp.*,
        f.nome as fornecedor_nome,
        f.cpf_cnpj as fornecedor_cpf_cnpj,
        b.nome as beneficiario_nome,
        p.nome as pessoa_nome,
        p.cpf,
        pr.numero_proposta
      FROM contas_pagar cp
      LEFT JOIN pessoas f ON cp.fornecedor_id = f.id
      LEFT JOIN beneficiarios b ON cp.beneficiario_id = b.id
      LEFT JOIN pessoas p ON b.pessoa_id = p.id
      LEFT JOIN propostas pr ON cp.proposta_id = pr.id
      WHERE cp.id = ? AND cp.deleted_at IS NULL`,
      [id],
    )

    if (rows.length === 0) {
      return NextResponse.json({ error: "Conta a pagar não encontrada" }, { status: 404 })
    }

    return NextResponse.json(rows[0])
  } catch (error: any) {
    console.error("[v0] Erro ao buscar conta a pagar:", error)
    return NextResponse.json({ error: "Erro ao buscar conta a pagar", details: error.message }, { status: 500 })
  }
}

export async function PUT(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const id = params.id
    const body = await request.json()

    // Recalcular valor total se necessário
    if (body.valor_original || body.valor_multa || body.valor_juros || body.valor_desconto) {
      const [current] = await pool.execute(`SELECT * FROM contas_pagar WHERE id = ?`, [id])

      if (current.length === 0) {
        return NextResponse.json({ error: "Conta a pagar não encontrada" }, { status: 404 })
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

    const [result] = await pool.execute(`UPDATE contas_pagar SET ${setClause} WHERE id = ?`, [...values, id])

    if (result.affectedRows === 0) {
      return NextResponse.json({ error: "Conta a pagar não encontrada" }, { status: 404 })
    }

    return NextResponse.json({ message: "Conta a pagar atualizada com sucesso" })
  } catch (error: any) {
    console.error("[v0] Erro ao atualizar conta a pagar:", error)
    return NextResponse.json({ error: "Erro ao atualizar conta a pagar", details: error.message }, { status: 500 })
  }
}

export async function DELETE(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const id = params.id

    // Soft delete
    const [result] = await pool.execute(`UPDATE contas_pagar SET deleted_at = NOW() WHERE id = ?`, [id])

    if (result.affectedRows === 0) {
      return NextResponse.json({ error: "Conta a pagar não encontrada" }, { status: 404 })
    }

    return NextResponse.json({ message: "Conta a pagar excluída com sucesso" })
  } catch (error: any) {
    console.error("[v0] Erro ao excluir conta a pagar:", error)
    return NextResponse.json({ error: "Erro ao excluir conta a pagar", details: error.message }, { status: 500 })
  }
}
