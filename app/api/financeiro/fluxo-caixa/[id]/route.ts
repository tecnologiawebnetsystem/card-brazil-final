import { type NextRequest, NextResponse } from "next/server"
import { query } from "@/lib/database"

const fields = ["tipo", "categoria", "descricao", "valor", "data_movimentacao", "data_competencia", "status", "conta_origem", "conta_destino", "observacoes"]

export async function GET(_request: NextRequest, { params }: { params: { id: string } }) {
  const rows = await query("SELECT * FROM fluxo_caixa WHERE id = $1", [Number.parseInt(params.id, 10)])
  if (!rows.length) return NextResponse.json({ error: "Movimentação não encontrada" }, { status: 404 })
  return NextResponse.json(rows[0])
}

export async function PUT(request: NextRequest, { params }: { params: { id: string } }) {
  const body = await request.json()
  const entries = Object.entries(body).filter(([key]) => fields.includes(key))
  if (!entries.length) return NextResponse.json({ error: "Nenhum campo válido para atualizar" }, { status: 400 })
  const values = entries.map(([, value]) => value)
  const updates = entries.map(([key], index) => `${key} = $${index + 1}`)
  values.push(Number.parseInt(params.id, 10))
  const rows = await query(`UPDATE fluxo_caixa SET ${updates.join(", ")}, updated_at = CURRENT_TIMESTAMP WHERE id = $${values.length} RETURNING *`, values)
  if (!rows.length) return NextResponse.json({ error: "Movimentação não encontrada" }, { status: 404 })
  return NextResponse.json({ message: "Movimentação atualizada com sucesso", data: rows[0] })
}

export async function DELETE(_request: NextRequest, { params }: { params: { id: string } }) {
  const rows = await query("DELETE FROM fluxo_caixa WHERE id = $1 RETURNING id", [Number.parseInt(params.id, 10)])
  if (!rows.length) return NextResponse.json({ error: "Movimentação não encontrada" }, { status: 404 })
  return NextResponse.json({ message: "Movimentação excluída com sucesso" })
}
