import { type NextRequest, NextResponse } from "next/server"
import { getAuthContext } from "@/lib/api-auth"
import { query, transaction } from "@/lib/database"
import { parseMoney } from "@/lib/cobranca-state"

export async function POST(request: NextRequest) {
  const auth = await getAuthContext()
  if (!auth) return NextResponse.json({ error: "Não autenticado" }, { status: 401 })
  const permissions = (auth.profile.permissions ?? {}) as Record<string, boolean>
  const isAdmin = auth.profile.tipo_usuario === "admin" || auth.profile.tipo_usuario === "administrador"
  if (!isAdmin && permissions["cobranca.create"] !== true) return NextResponse.json({ error: "Sem permissão para registrar pagamentos" }, { status: 403 })

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
      `SELECT id, parcela_id, valor_pago, forma_pagamento, status FROM cobranca_pagamentos WHERE administradora_id = $1 AND idempotency_key = $2`,
      [auth.administradoraId, idempotencyKey],
    )
    if (existing.length) {
      const previous = existing[0]
      if (previous.parcela_id !== parcelaId || Number(previous.valor_pago) !== valorPago || previous.forma_pagamento !== formaPagamento) {
        return NextResponse.json({ error: "Idempotency-Key já utilizada com parâmetros incompatíveis" }, { status: 409 })
      }
      return NextResponse.json({ data: previous, idempotent: true })
    }

    const parcela = await query<{ id: number; valor_total: number; valor_pago: number; status: string }>(
      `SELECT id, valor_total, valor_pago, status FROM cobranca_parcelas WHERE id = $1 AND administradora_id = $2`,
      [parcelaId, auth.administradoraId],
    )
    if (!parcela[0]) return NextResponse.json({ error: "Parcela não encontrada" }, { status: 404 })
    if (["paga", "cancelada", "renegociada"].includes(parcela[0].status)) return NextResponse.json({ error: "Parcela não aceita pagamento" }, { status: 409 })
    const saldo = Number(parcela[0].valor_total) - Number(parcela[0].valor_pago)
    if (valorPago > saldo) return NextResponse.json({ error: "Pagamento superior ao saldo da parcela" }, { status: 422 })

    const result = await transaction([
      {
        text: `WITH parcela_atualizada AS (
          UPDATE cobranca_parcelas
            SET valor_pago = ROUND(valor_pago + $1, 2),
                status = CASE WHEN ROUND(valor_pago + $1, 2) >= valor_total THEN 'paga' ELSE status END,
                data_pagamento = CASE WHEN ROUND(valor_pago + $1, 2) >= valor_total THEN CURRENT_DATE ELSE data_pagamento END,
                updated_at = CURRENT_TIMESTAMP
            WHERE id = $2
              AND administradora_id = $3
              AND status NOT IN ('paga', 'cancelada', 'renegociada')
              AND ROUND(valor_pago + $1, 2) <= ROUND(valor_total, 2)
            RETURNING id, valor_pago, status
        ), pagamento_criado AS (
          INSERT INTO cobranca_pagamentos (administradora_id, parcela_id, idempotency_key, valor_pago, data_pagamento, forma_pagamento)
            SELECT $3, id, $4, $1, CURRENT_TIMESTAMP, $5
            FROM parcela_atualizada
            RETURNING id, parcela_id, valor_pago
        ), evento_criado AS (
          INSERT INTO cobranca_eventos (administradora_id, parcela_id, tipo, status_novo, payload, usuario_id)
            SELECT $3, pc.parcela_id, 'pagamento_registrado', pa.status, $6::jsonb, $7
            FROM pagamento_criado pc
            JOIN parcela_atualizada pa ON pa.id = pc.parcela_id
            RETURNING id
        ), auditoria_criada AS (
          INSERT INTO auditoria_cadastros
            (administradora_id, usuario_id, acao, tabela, registro_id, dados_anteriores, dados_novos)
            SELECT $3, $7, CASE WHEN pa.status = 'paga' THEN 'settlement' ELSE 'payment' END,
              'cobranca_parcelas', pa.id, $8::jsonb,
              jsonb_build_object('valor_pago', pa.valor_pago, 'idempotency_key', $4, 'forma_pagamento', $5, 'valor', $1)
            FROM pagamento_criado pc
            JOIN parcela_atualizada pa ON pa.id = pc.parcela_id
            RETURNING registro_id
        )
        SELECT pc.id, pc.parcela_id, pc.valor_pago, pa.status
        FROM pagamento_criado pc
        JOIN parcela_atualizada pa ON pa.id = pc.parcela_id`,
        params: [
          valorPago,
          parcelaId,
          auth.administradoraId,
          idempotencyKey,
          formaPagamento,
          JSON.stringify({ valor_pago: valorPago, forma_pagamento: formaPagamento, origem: "cobranca_parcela" }),
          auth.userId,
          JSON.stringify({ valor_pago: parcela[0].valor_pago, status: parcela[0].status }),
        ],
      },
    ])
    const pagamento = result[0]?.[0]
    if (!pagamento) return NextResponse.json({ error: "Parcela não aceita este pagamento ou saldo insuficiente" }, { status: 409 })
    return NextResponse.json({ data: pagamento, parcela: { id: parcelaId, valor_pago: pagamento.valor_pago, status: pagamento.status } }, { status: 201 })
  } catch (error) {
    console.error("[v0] Erro ao registrar pagamento:", error)
    return NextResponse.json({ error: "Erro ao registrar pagamento" }, { status: 500 })
  }
}

