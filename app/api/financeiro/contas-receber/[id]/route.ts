import { type NextRequest, NextResponse } from "next/server"
import { query } from "@/lib/database"

const fields = ["descricao", "categoria", "valor", "data_vencimento", "data_pagamento", "status", "observacoes"]

export async function GET(_request: NextRequest, { params }: { params: { id: string } }) {
  const rows = await query("SELECT * FROM contas_receber WHERE id = $1", [Number.parseInt(params.id, 10)])
  if (!rows.length) return NextResponse.json({ error: "Conta a receber não encontrada" }, { status: 404 })
  return NextResponse.json(rows[0])
}

export async function PUT(request: NextRequest, { params }: { params: { id: string } }) {
  const body = await request.json()
  const entries = Object.entries(body).filter(([key]) => fields.includes(key))
  if (!entries.length) return NextResponse.json({ error: "Nenhum campo válido para atualizar" }, { status: 400 })
  const values = entries.map(([, value]) => value)
  const updates = entries.map(([key], index) => `${key} = $${index + 1}`)
  values.push(Number.parseInt(params.id, 10))
  const rows = await query(`UPDATE contas_receber SET ${updates.join(", ")}, updated_at = CURRENT_TIMESTAMP WHERE id = $${values.length} RETURNING *`, values)
  if (!rows.length) return NextResponse.json({ error: "Conta a receber não encontrada" }, { status: 404 })
  return NextResponse.json({ message: "Conta a receber atualizada com sucesso", data: rows[0] })
}

export async function DELETE(_request: NextRequest, { params }: { params: { id: string } }) {
  const rows = await query("DELETE FROM contas_receber WHERE id = $1 RETURNING id", [Number.parseInt(params.id, 10)])
  if (!rows.length) return NextResponse.json({ error: "Conta a receber não encontrada" }, { status: 404 })
  return NextResponse.json({ message: "Conta a receber excluída com sucesso" })
}
