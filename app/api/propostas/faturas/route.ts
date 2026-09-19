import { type NextRequest, NextResponse } from "next/server"
import { query } from "@/lib/database"
import { getAuthContext } from "@/lib/api-auth"

export async function GET(request: NextRequest) {
  const auth = await getAuthContext()
  if (!auth) return NextResponse.json({ error: "Não autenticado" }, { status: 401 })
  const propostaId = Number(request.nextUrl.searchParams.get("proposta_id"))
  const status = request.nextUrl.searchParams.get("status")
  const values: unknown[] = [auth.administradoraId]
  const conditions = ["administradora_id = $1", "deleted_at IS NULL"]
  if (Number.isInteger(propostaId)) { values.push(propostaId); conditions.push(`proposta_id = $${values.length}`) }
  if (status) { values.push(status); conditions.push(`status = $${values.length}`) }
  const rows = await query(`SELECT * FROM faturas_mensais WHERE ${conditions.join(" AND ")} ORDER BY competencia DESC`, values)
  return NextResponse.json({ data: rows })
}

export async function POST(request: NextRequest) {
  const auth = await getAuthContext()
  if (!auth) return NextResponse.json({ error: "Não autenticado" }, { status: 401 })
  const body = await request.json()
  const valorBase = Number(body.valor_base)
  if (!body.proposta_id || !body.competencia || !body.vencimento || !Number.isFinite(valorBase) || valorBase < 0) return NextResponse.json({ error: "proposta_id, competência, vencimento e valor_base são obrigatórios" }, { status: 422 })
  const total = valorBase + Number(body.valor_multa || 0) + Number(body.valor_juros || 0) - Number(body.valor_desconto || 0)
  const rows = await query("INSERT INTO faturas_mensais (administradora_id, proposta_id, competencia, vencimento, valor_base, valor_multa, valor_juros, valor_desconto, valor_total, numero_documento, observacoes) VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11) RETURNING *", [auth.administradoraId, body.proposta_id, body.competencia, body.vencimento, valorBase, Number(body.valor_multa || 0), Number(body.valor_juros || 0), Number(body.valor_desconto || 0), total, body.numero_documento || null, body.observacoes || null])
  return NextResponse.json({ data: rows[0], message: "Fatura mensal gerada" }, { status: 201 })
}

export async function PATCH(request: NextRequest) {
  const auth = await getAuthContext()
  if (!auth) return NextResponse.json({ error: "Não autenticado" }, { status: 401 })
  const body = await request.json()
  const allowed = ["aberta", "enviada", "paga", "vencida", "cancelada"]
  const id = Number(body.id)
  if (!Number.isInteger(id) || id <= 0) return NextResponse.json({ error: "id inválido" }, { status: 422 })
  if (body.status && !allowed.includes(body.status)) return NextResponse.json({ error: "status inválido" }, { status: 422 })
  const current = await query("SELECT id, valor_base, valor_multa, valor_juros, valor_desconto, status FROM faturas_mensais WHERE id = $1 AND administradora_id = $2 AND deleted_at IS NULL", [id, auth.administradoraId])
  if (!current.length) return NextResponse.json({ error: "Fatura não encontrada" }, { status: 404 })
  const item = current[0]
  const base = body.valor_base === undefined ? Number(item.valor_base) : Number(body.valor_base)
  const multa = body.valor_multa === undefined ? Number(item.valor_multa || 0) : Number(body.valor_multa || 0)
  const juros = body.valor_juros === undefined ? Number(item.valor_juros || 0) : Number(body.valor_juros || 0)
  const desconto = body.valor_desconto === undefined ? Number(item.valor_desconto || 0) : Number(body.valor_desconto || 0)
  if (![base, multa, juros, desconto].every(Number.isFinite) || base < 0 || multa < 0 || juros < 0 || desconto < 0) return NextResponse.json({ error: "Valores da fatura inválidos" }, { status: 422 })
  const status = body.status || item.status
  const rows = await query("UPDATE faturas_mensais SET status = $1, valor_base = $2, valor_multa = $3, valor_juros = $4, valor_desconto = $5, valor_total = $2 + $3 + $4 - $5, vencimento = COALESCE($6, vencimento), observacoes = COALESCE($7, observacoes), data_pagamento = CASE WHEN $1 = 'paga' THEN COALESCE(data_pagamento, CURRENT_DATE) ELSE NULL END, updated_at = NOW() WHERE id = $8 AND administradora_id = $9 AND deleted_at IS NULL RETURNING *", [status, base, multa, juros, desconto, body.vencimento || null, body.observacoes || null, id, auth.administradoraId])
  return NextResponse.json({ data: rows[0], message: "Fatura atualizada" })
}

export async function DELETE(request: NextRequest) {
  const auth = await getAuthContext()
  if (!auth) return NextResponse.json({ error: "Não autenticado" }, { status: 401 })
  const id = Number(request.nextUrl.searchParams.get("id"))
  if (!Number.isInteger(id) || id <= 0) return NextResponse.json({ error: "id inválido" }, { status: 422 })
  const rows = await query("UPDATE faturas_mensais SET deleted_at = NOW(), updated_at = NOW(), status = 'cancelada' WHERE id = $1 AND administradora_id = $2 AND deleted_at IS NULL RETURNING id", [id, auth.administradoraId])
  if (!rows.length) return NextResponse.json({ error: "Fatura não encontrada" }, { status: 404 })
  return NextResponse.json({ message: "Fatura cancelada" })
}
