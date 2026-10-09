import { NextRequest, NextResponse } from "next/server"
import { getAuthContext } from "@/lib/api-auth"
import { query, transaction } from "@/lib/database"

export async function POST(request: NextRequest) {
  const auth = await getAuthContext()
  if (!auth) return NextResponse.json({ error: "Não autenticado" }, { status: 401 })
  const body = await request.json()
  const identificador = String(body.identificador_externo || "").trim()
  const valor = Number(body.valor)
  if (!identificador || !Number.isFinite(valor) || valor <= 0 || !body.data_transacao) return NextResponse.json({ error: "identificador, valor e data_transacao são obrigatórios" }, { status: 422 })

  const existente = await query("SELECT * FROM conciliacao_transacoes WHERE administradora_id = $1 AND identificador_externo = $2", [auth.administradoraId, identificador])
  if (existente.length) return NextResponse.json({ data: existente[0], idempotente: true })

  const candidatos = await query<{ id: number; valor_total: number; valor_pago: number; data_vencimento: string; conta_receber_id: number | null }>(
    `SELECT p.id, p.valor_total, p.valor_pago, p.data_vencimento, c.conta_receber_id
       FROM cobranca_parcelas p LEFT JOIN cobrancas c ON c.id = p.cobranca_id AND c.administradora_id = p.administradora_id
      WHERE p.administradora_id = $1 AND p.status NOT IN ('paga','cancelada','renegociada')
        AND ABS((p.valor_total - p.valor_pago) - $2::numeric) <= 0.01
        AND p.data_vencimento BETWEEN ($3::date - 5) AND ($3::date + 5)
      ORDER BY ABS(p.data_vencimento - $3::date), p.id LIMIT 2`,
    [auth.administradoraId, valor, body.data_transacao],
  )
  const match = candidatos.length === 1 ? candidatos[0] : null
  const divergencia = candidatos.length > 1 ? ["duplicidade"] : candidatos.length === 0 ? ["titulo_inexistente"] : []
  const rows = await transaction([{
    text: `INSERT INTO conciliacao_transacoes (administradora_id, arquivo_id, identificador_externo, nosso_numero, documento, pagador_documento, data_transacao, valor, dados, status, divergencia_tipo, divergencia_detalhe, parcela_id)
      VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9::jsonb,$10,$11,$12,$13) RETURNING *`,
    params: [auth.administradoraId, body.arquivo_id || null, identificador, body.nosso_numero || null, body.documento || null, body.pagador_documento || null, body.data_transacao, valor, JSON.stringify(body.dados || {}), match ? "sugerida" : "divergente", divergencia.join(",") || null, match ? null : "Nenhuma correspondência única e segura encontrada", match?.id ?? null],
  }])
  return NextResponse.json({ data: rows[0]?.[0], candidatos: candidatos.length }, { status: 201 })
}

export async function PATCH(request: NextRequest) {
  const auth = await getAuthContext()
  if (!auth) return NextResponse.json({ error: "Não autenticado" }, { status: 401 })
  const body = await request.json()
  const id = Number(body.id)
  const parcelaId = Number(body.parcela_id)
  const motivo = String(body.motivo || "").trim()
  if (!Number.isInteger(id) || !Number.isInteger(parcelaId) || !motivo) return NextResponse.json({ error: "id, parcela_id e motivo são obrigatórios" }, { status: 422 })
  const tx = await query<{ id: number; valor: number; status: string; dados: object }>("SELECT id, valor, status, dados FROM conciliacao_transacoes WHERE id = $1 AND administradora_id = $2", [id, auth.administradoraId])
  if (!tx.length) return NextResponse.json({ error: "Transação não encontrada" }, { status: 404 })
  if (tx[0].status === "conciliada") return NextResponse.json({ error: "Transação já conciliada" }, { status: 409 })
  const rows = await transaction([{
    text: `WITH parcela_atualizada AS (
      UPDATE cobranca_parcelas SET valor_pago = ROUND(valor_pago + $1, 2), status = CASE WHEN ROUND(valor_pago + $1, 2) >= valor_total THEN 'paga' ELSE status END, data_pagamento = CASE WHEN ROUND(valor_pago + $1, 2) >= valor_total THEN CURRENT_DATE ELSE data_pagamento END, updated_at = NOW()
      WHERE id = $2 AND administradora_id = $3 AND status NOT IN ('paga','cancelada','renegociada') AND valor_pago + $1 <= valor_total RETURNING id
    ), pagamento AS (
      INSERT INTO cobranca_pagamentos (administradora_id, parcela_id, idempotency_key, valor_pago, data_pagamento, forma_pagamento)
      SELECT $3, id, 'conciliacao:' || $6::text, $1, CURRENT_DATE, 'retorno_bancario' FROM parcela_atualizada
      ON CONFLICT (administradora_id, idempotency_key) DO NOTHING RETURNING id
    )
    UPDATE conciliacao_transacoes SET parcela_id = $2, pagamento_id = (SELECT id FROM pagamento), status = 'conciliada', conciliado_em = NOW(), conciliado_por = $4, dados = dados || $5::jsonb, updated_at = NOW()
    WHERE id = $6 AND administradora_id = $3 AND EXISTS (SELECT 1 FROM pagamento) RETURNING *`,
    params: [Number(tx[0].valor), parcelaId, auth.administradoraId, auth.userId, JSON.stringify({ conciliacao_manual: true, motivo }), id],
  }, {
    text: `INSERT INTO auditoria_inadimplencia (administradora_id, acao, dados_anteriores, dados_novos, origem, usuario_id) VALUES ($1,'conciliacao_manual',$2::jsonb,$3::jsonb,'usuario',$4)`,
    params: [auth.administradoraId, JSON.stringify({ status: tx[0].status, parcela_id: tx[0].dados }), JSON.stringify({ status: "conciliada", parcela_id: parcelaId, motivo }), auth.userId],
  }])
  if (!rows[0]?.length) return NextResponse.json({ error: "Parcela não aceita o valor ou a transação não foi conciliada" }, { status: 409 })
  return NextResponse.json({ data: rows[0][0] })
}

export async function GET(request: NextRequest) {
  const auth = await getAuthContext()
  if (!auth) return NextResponse.json({ error: "Não autenticado" }, { status: 401 })
  const status = request.nextUrl.searchParams.get("status")
  const rows = await query(`SELECT * FROM conciliacao_transacoes WHERE administradora_id = $1 AND ($2::text IS NULL OR status = $2) ORDER BY created_at DESC LIMIT 200`, [auth.administradoraId, status])
  return NextResponse.json({ data: rows })
}
