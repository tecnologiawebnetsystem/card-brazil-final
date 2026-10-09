import { type NextRequest, NextResponse } from "next/server"
import { getAuthContext, hasPermission } from "@/lib/api-auth"
import { query } from "@/lib/database"

const fields = ["tipo", "categoria", "descricao", "valor", "data_movimentacao", "data_competencia", "status", "conta_origem", "conta_destino", "observacoes"]

export async function GET(_request: NextRequest, { params }: { params: { id: string } }) {
  const auth = await getAuthContext()
  if (!auth) return NextResponse.json({ error: "Não autenticado" }, { status: 401 })
  if (!hasPermission(auth, "financeiro", "view")) return NextResponse.json({ error: "Sem permissão" }, { status: 403 })
  const rows = await query("SELECT * FROM fluxo_caixa WHERE id = $1 AND administradora_id = $2 AND deleted_at IS NULL", [Number.parseInt(params.id, 10), auth.administradoraId])
  if (!rows.length) return NextResponse.json({ error: "Movimentação não encontrada" }, { status: 404 })
  return NextResponse.json(rows[0])
}

export async function PUT(request: NextRequest, { params }: { params: { id: string } }) {
  const auth = await getAuthContext()
  if (!auth) return NextResponse.json({ error: "Não autenticado" }, { status: 401 })
  if (!hasPermission(auth, "financeiro", "edit")) return NextResponse.json({ error: "Sem permissão" }, { status: 403 })
  const body = await request.json()
  const entries = Object.entries(body).filter(([key]) => fields.includes(key))
  if (!entries.length) return NextResponse.json({ error: "Nenhum campo válido para atualizar" }, { status: 400 })
  const values = entries.map(([, value]) => value)
  const updates = entries.map(([key], index) => `${key} = $${index + 1}`)
  values.push(Number.parseInt(params.id, 10), auth.administradoraId)
  const rows = await query(`UPDATE fluxo_caixa SET ${updates.join(", ")}, updated_at = CURRENT_TIMESTAMP WHERE id = $${values.length - 1} AND administradora_id = $${values.length} RETURNING *`, values)
  if (!rows.length) return NextResponse.json({ error: "Movimentação não encontrada" }, { status: 404 })
  return NextResponse.json({ message: "Movimentação atualizada com sucesso", data: rows[0] })
}

export async function DELETE(_request: NextRequest, { params }: { params: { id: string } }) {
  const auth = await getAuthContext()
  if (!auth) return NextResponse.json({ error: "Não autenticado" }, { status: 401 })
  if (!hasPermission(auth, "financeiro", "delete")) return NextResponse.json({ error: "Sem permissão" }, { status: 403 })
  const rows = await query("UPDATE fluxo_caixa SET deleted_at = CURRENT_TIMESTAMP, status = 'cancelada', updated_at = CURRENT_TIMESTAMP WHERE id = $1 AND administradora_id = $2 AND deleted_at IS NULL RETURNING id", [Number.parseInt(params.id, 10), auth.administradoraId])
  if (!rows.length) return NextResponse.json({ error: "Movimentação não encontrada" }, { status: 404 })
  return NextResponse.json({ message: "Movimentação excluída com sucesso" })
}
