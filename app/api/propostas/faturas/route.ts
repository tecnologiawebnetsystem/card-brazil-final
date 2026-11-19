import { type NextRequest, NextResponse } from "next/server"
import { query } from "@/back-end/lib/database"
import { getAuthContext, hasPermission } from "@/back-end/lib/api-auth"

async function authorize(auth: Awaited<ReturnType<typeof getAuthContext>>, permission: "view" | "create" | "edit" | "delete") {
  if (!auth) return NextResponse.json({ error: "Não autenticado" }, { status: 401 })
  if (!(await hasPermission(auth, "financeiro", permission))) return NextResponse.json({ error: "Sem permissão para faturamento" }, { status: 403 })
  return null
}

export async function GET(request: NextRequest) {
  const auth = await getAuthContext()
  const denied = await authorize(auth, "view")
  if (denied) return denied
  const propostaId = Number(request.nextUrl.searchParams.get("proposta_id"))
  const status = request.nextUrl.searchParams.get("status")
  const values: unknown[] = [auth!.administradoraId]
  const conditions = ["administradora_id = $1", "deleted_at IS NULL"]
  if (Number.isInteger(propostaId) && propostaId > 0) { values.push(propostaId); conditions.push(`proposta_id = $${values.length}`) }
  if (status) { values.push(status); conditions.push(`status = $${values.length}`) }
  const rows = await query(`SELECT * FROM faturas_mensais WHERE ${conditions.join(" AND ")} ORDER BY competencia DESC`, values)
  return NextResponse.json({ data: rows })
}

export async function POST() {
  const auth = await getAuthContext()
  const denied = await authorize(auth, "create")
  if (denied) return denied
  return NextResponse.json({ error: "Emissão bloqueada: a categoria 'faturamento' não é aceita pelo schema atual de contas_receber. A operação permanecerá indisponível até aprovação da categoria oficial; nenhum registro foi gravado." }, { status: 501 })
}

export async function PATCH(request: NextRequest) {
  const auth = await getAuthContext()
  const denied = await authorize(auth, "edit")
  if (denied) return denied
  const body = await request.json()
  const allowed = ["aberta", "enviada", "paga", "vencida", "cancelada"]
  const id = Number(body.id)
  if (!Number.isInteger(id) || id <= 0) return NextResponse.json({ error: "id inválido" }, { status: 422 })
  if (body.status && !allowed.includes(body.status)) return NextResponse.json({ error: "status inválido" }, { status: 422 })
  const current = await query("SELECT id, valor_base, valor_multa, valor_juros, valor_desconto, status FROM faturas_mensais WHERE id = $1 AND administradora_id = $2 AND deleted_at IS NULL", [id, auth!.administradoraId])
  if (!current.length) return NextResponse.json({ error: "Fatura não encontrada" }, { status: 404 })
  const item = current[0]
  if (item.status === "paga" || body.status === "paga") {
    return NextResponse.json({ error: "Uma fatura liquidada não pode ser alterada por esta rota; use o fluxo de pagamento para registrar a liquidação." }, { status: 409 })
  }
  const base = body.valor_base === undefined ? Number(item.valor_base) : Number(body.valor_base)
  const multa = body.valor_multa === undefined ? Number(item.valor_multa || 0) : Number(body.valor_multa || 0)
  const juros = body.valor_juros === undefined ? Number(item.valor_juros || 0) : Number(body.valor_juros || 0)
  const desconto = body.valor_desconto === undefined ? Number(item.valor_desconto || 0) : Number(body.valor_desconto || 0)
  if (![base, multa, juros, desconto].every(Number.isFinite) || base < 0 || multa < 0 || juros < 0 || desconto < 0 || base + multa + juros - desconto <= 0) return NextResponse.json({ error: "Valores da fatura inválidos" }, { status: 422 })
  const status = body.status || item.status
  const rows = await query("UPDATE faturas_mensais SET status = $1, valor_base = $2, valor_multa = $3, valor_juros = $4, valor_desconto = $5, valor_total = $2 + $3 + $4 - $5, vencimento = COALESCE($6, vencimento), observacoes = COALESCE($7, observacoes), data_pagamento = CASE WHEN $1 = 'paga' THEN COALESCE(data_pagamento, CURRENT_DATE) ELSE NULL END, updated_at = NOW() WHERE id = $8 AND administradora_id = $9 AND deleted_at IS NULL RETURNING *", [status, base, multa, juros, desconto, body.vencimento || null, body.observacoes || null, id, auth!.administradoraId])
  return NextResponse.json({ data: rows[0], message: "Fatura atualizada" })
}

export async function DELETE(request: NextRequest) {
  const auth = await getAuthContext()
  const denied = await authorize(auth, "delete")
  if (denied) return denied
  const id = Number(request.nextUrl.searchParams.get("id"))
  if (!Number.isInteger(id) || id <= 0) return NextResponse.json({ error: "id inválido" }, { status: 422 })
  const rows = await query("UPDATE faturas_mensais SET deleted_at = NOW(), updated_at = NOW(), status = 'cancelada' WHERE id = $1 AND administradora_id = $2 AND deleted_at IS NULL AND status <> 'paga' RETURNING id", [id, auth!.administradoraId])
  if (!rows.length) return NextResponse.json({ error: "Fatura não encontrada ou já liquidada" }, { status: 404 })
  return NextResponse.json({ message: "Fatura cancelada" })
}
