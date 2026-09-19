import { type NextRequest, NextResponse } from "next/server"
import { getAuthContext } from "@/lib/api-auth"
import { query, transaction } from "@/lib/database"

export async function GET(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const auth = await getAuthContext()
  if (!auth) return NextResponse.json({ error: "Não autenticado" }, { status: 401 })
  const id = Number((await params).id)
  return NextResponse.json({ data: await query("SELECT * FROM pagamentos_faturas WHERE fatura_id = $1 AND administradora_id = $2 ORDER BY created_at DESC", [id, auth.administradoraId]) })
}

export async function POST(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const auth = await getAuthContext()
  if (!auth) return NextResponse.json({ error: "Não autenticado" }, { status: 401 })
  const id = Number((await params).id)
  const body = await request.json()
  const meio = String(body.meio || "").trim()
  const key = String(request.headers.get("idempotency-key") || body.idempotency_key || "").trim()
  const valor = Number(body.valor)
  if (!["boleto", "pix", "debito_automatico", "cartao_credito", "cartao_debito"].includes(meio)) return NextResponse.json({ error: "Meio de pagamento inválido" }, { status: 422 })
  if (!key || key.length > 160) return NextResponse.json({ error: "Idempotency-Key é obrigatório" }, { status: 422 })
  if (!Number.isFinite(valor) || valor <= 0) return NextResponse.json({ error: "Valor inválido" }, { status: 422 })
  const existing = await query("SELECT * FROM pagamentos_faturas WHERE administradora_id = $1 AND idempotency_key = $2", [auth.administradoraId, key])
  if (existing.length) return NextResponse.json({ data: existing[0], idempotent: true })
  const fatura = await query("SELECT id, valor_total, status FROM faturas_mensais WHERE id = $1 AND administradora_id = $2 AND deleted_at IS NULL", [id, auth.administradoraId])
  if (!fatura.length) return NextResponse.json({ error: "Fatura não encontrada" }, { status: 404 })
  if (["paga", "cancelada"].includes(fatura[0].status)) return NextResponse.json({ error: "Fatura não aceita pagamento" }, { status: 409 })
  if (valor > Number(fatura[0].valor_total)) return NextResponse.json({ error: "Pagamento superior ao valor da fatura" }, { status: 422 })
  const result = await transaction([
    { text: "INSERT INTO pagamentos_faturas (fatura_id, administradora_id, meio, idempotency_key, valor, identificador_externo, retorno_bruto, usuario_id) VALUES ($1,$2,$3,$4,$5,$6,$7,$8) RETURNING *", params: [id, auth.administradoraId, meio, key, valor, body.identificador_externo || null, JSON.stringify(body.retorno_bruto || {}), auth.userId] },
    { text: "UPDATE faturas_mensais SET status = CASE WHEN $1 >= valor_total THEN 'paga' ELSE status END, data_pagamento = CASE WHEN $1 >= valor_total THEN CURRENT_DATE ELSE data_pagamento END, updated_at = NOW() WHERE id = $2 AND administradora_id = $3", params: [valor, id, auth.administradoraId] },
    { text: "INSERT INTO fatura_eventos (fatura_id, administradora_id, tipo, status_anterior, status_novo, origem, payload, usuario_id) VALUES ($1,$2,'pagamento_confirmado',$3,CASE WHEN $4 >= $5 THEN 'paga' ELSE $3 END,$6,$7,$8)", params: [id, auth.administradoraId, fatura[0].status, valor, Number(fatura[0].valor_total), meio, JSON.stringify({ meio, valor, idempotency_key: key }), auth.userId] },
  ])
  return NextResponse.json({ data: result[0]?.[0], message: "Pagamento registrado e histórico criado" }, { status: 201 })
}
