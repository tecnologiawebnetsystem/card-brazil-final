import { type NextRequest, NextResponse } from "next/server"
import { getAuthContext } from "@/lib/api-auth"
import { query, transaction } from "@/lib/database"
import { parseMoney } from "@/lib/cobranca-state"

export async function POST(request: NextRequest) {
  const auth = await getAuthContext()
  if (!auth) return NextResponse.json({ error: "Não autenticado" }, { status: 401 })
  const permissions = (auth.profile.permissions ?? {}) as Record<string, boolean>
  const isAdmin = auth.profile.tipo_usuario === "admin" || auth.profile.tipo_usuario === "administrador"
  if (!isAdmin && permissions["cobranca.create"] === false) return NextResponse.json({ error: "Sem permissão para registrar pagamentos" }, { status: 403 })

  try {
    const body = await request.json()
    const parcelaId = Number(body.parcela_id)
    const valorPago = parseMoney(body.valor_pago)
    const idempotencyKey = String(request.headers.get("idempotency-key") || body.idempotency_key || "").trim()
    const formaPagamento = String(body.forma_pagamento || "").trim()

    if (!Number.isInteger(parcelaId) || parcelaId <= 0) return NextResponse.json({ error: "parcela_id inválido" }, { status: 422 })
    if (valorPago === null || valorPago <= 0) return NextResponse.json({ error: "valor_pago deve ser maior que zero" }, { status: 422 })
    if (!idempotencyKey || idempotencyKey.length > 120) return NextResponse.json({ error: "Idempotency-Key é obrigatório" }, { status: 422 })
    if (!formaPagamento || formaPagamento.length > 30) return NextResponse.json({ error: "forma_pagamento inválida" }, { status: 422 })

    const existing = await query(
      `SELECT id, parcela_id, valor_pago, status FROM cobranca_pagamentos WHERE administradora_id = $1 AND idempotency_key = $2`,
      [auth.administradoraId, idempotencyKey],
    )
    if (existing.length) return NextResponse.json({ data: existing[0], idempotent: true })

    const parcela = await query<{ id: number; valor_total: number; valor_pago: number; status: string }>(
      `SELECT id, valor_total, valor_pago, status FROM cobranca_parcelas WHERE id = $1 AND administradora_id = $2`,
      [parcelaId, auth.administradoraId],
    )
    if (!parcela[0]) return NextResponse.json({ error: "Parcela não encontrada" }, { status: 404 })
    if (["paga", "cancelada", "renegociada"].includes(parcela[0].status)) return NextResponse.json({ error: "Parcela não aceita pagamento" }, { status: 409 })
    const saldo = Number(parcela[0].valor_total) - Number(parcela[0].valor_pago)
    if (valorPago > saldo) return NextResponse.json({ error: "Pagamento superior ao saldo da parcela" }, { status: 422 })

    const novoValorPago = Number((Number(parcela[0].valor_pago) + valorPago).toFixed(2))
    const novoStatus = novoValorPago >= Number(parcela[0].valor_total) ? "paga" : parcela[0].status
    const result = await transaction([
      { text: `INSERT INTO cobranca_pagamentos (administradora_id, parcela_id, idempotency_key, valor_pago, data_pagamento, forma_pagamento) VALUES ($1, $2, $3, $4, CURRENT_TIMESTAMP, $5) RETURNING id, parcela_id, valor_pago, status`, params: [auth.administradoraId, parcelaId, idempotencyKey, valorPago, formaPagamento] },
      { text: `UPDATE cobranca_parcelas SET valor_pago = $1, status = $2, data_pagamento = CASE WHEN $2 = 'paga' THEN CURRENT_DATE ELSE data_pagamento END, updated_at = CURRENT_TIMESTAMP WHERE id = $3 AND administradora_id = $4`, params: [novoValorPago, novoStatus, parcelaId, auth.administradoraId] },
      { text: `INSERT INTO cobranca_eventos (administradora_id, parcela_id, tipo, status_novo, payload, usuario_id) VALUES ($1, $2, 'pagamento_registrado', $3, $4::jsonb, $5)`, params: [auth.administradoraId, parcelaId, novoStatus, JSON.stringify({ valor_pago: valorPago, forma_pagamento: formaPagamento }), auth.userId] },
    ])
    return NextResponse.json({ data: result[0]?.[0], parcela: { id: parcelaId, valor_pago: novoValorPago, status: novoStatus } }, { status: 201 })
  } catch (error) {
    console.error("[v0] Erro ao registrar pagamento:", error)
    return NextResponse.json({ error: "Erro ao registrar pagamento" }, { status: 500 })
  }
}

