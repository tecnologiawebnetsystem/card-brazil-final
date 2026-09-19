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
  if (!Number.isInteger(Number(body.id)) || !allowed.includes(body.status)) return NextResponse.json({ error: "id ou status inválido" }, { status: 422 })
  const rows = await query("UPDATE faturas_mensais SET status = $1, data_pagamento = CASE WHEN $1 = 'paga' THEN CURRENT_DATE ELSE data_pagamento END, updated_at = NOW() WHERE id = $2 AND administradora_id = $3 AND deleted_at IS NULL RETURNING *", [body.status, body.id, auth.administradoraId])
  if (!rows.length) return NextResponse.json({ error: "Fatura não encontrada" }, { status: 404 })
  return NextResponse.json({ data: rows[0] })
}
