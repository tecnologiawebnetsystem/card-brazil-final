import { type NextRequest, NextResponse } from "next/server"
import { getAuthContext, hasPermission } from "@/lib/api-auth"
import { query, transaction } from "@/lib/database"

export async function GET(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const auth = await getAuthContext()
  if (!auth) return NextResponse.json({ error: "Não autenticado" }, { status: 401 })
  if (!hasPermission(auth, "financeiro", "view")) return NextResponse.json({ error: "Sem permissão para consultar pagamentos" }, { status: 403 })
  const id = Number((await params).id)
  return NextResponse.json({ data: await query("SELECT * FROM pagamentos_faturas WHERE fatura_id = $1 AND administradora_id = $2 ORDER BY created_at DESC", [id, auth.administradoraId]) })
}

export async function POST(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const auth = await getAuthContext()
  if (!auth) return NextResponse.json({ error: "Não autenticado" }, { status: 401 })
  if (!hasPermission(auth, "financeiro", "create")) return NextResponse.json({ error: "Sem permissão para registrar pagamentos" }, { status: 403 })
  const id = Number((await params).id)
  const body = await request.json()
  const meio = String(body.meio || "").trim()
  const key = String(request.headers.get("idempotency-key") || body.idempotency_key || "").trim()
  const valor = Number(body.valor)
  if (!["boleto", "pix", "debito_automatico", "cartao_credito", "cartao_debito"].includes(meio)) return NextResponse.json({ error: "Meio de pagamento inválido" }, { status: 422 })
  if (!key || key.length > 160) return NextResponse.json({ error: "Idempotency-Key é obrigatório" }, { status: 422 })
  if (!Number.isFinite(valor) || valor <= 0) return NextResponse.json({ error: "Valor inválido" }, { status: 422 })
  const existing = await query<{ fatura_id: number; meio: string; idempotency_key: string; valor: number }>("SELECT fatura_id, meio, idempotency_key, valor FROM pagamentos_faturas WHERE administradora_id = $1 AND idempotency_key = $2", [auth.administradoraId, key])
  if (existing.length) {
    const previous = existing[0]
    if (previous.fatura_id !== id || previous.meio !== meio || Number(previous.valor) !== valor) {
      return NextResponse.json({ error: "Idempotency-Key já utilizada com parâmetros incompatíveis" }, { status: 409 })
    }
    return NextResponse.json({ data: previous, idempotent: true })
  }
  const fatura = await query("SELECT id, valor_total, status FROM faturas_mensais WHERE id = $1 AND administradora_id = $2 AND deleted_at IS NULL", [id, auth.administradoraId])
  if (!fatura.length) return NextResponse.json({ error: "Fatura não encontrada" }, { status: 404 })
  if (["paga", "cancelada"].includes(fatura[0].status)) return NextResponse.json({ error: "Fatura não aceita pagamento" }, { status: 409 })
  const result = await transaction([
    {
      text: `WITH fatura_atualizada AS (
        UPDATE faturas_mensais f
        SET status = CASE WHEN ROUND((COALESCE((SELECT SUM(p.valor) FROM pagamentos_faturas p WHERE p.fatura_id = f.id AND p.administradora_id = f.administradora_id), 0) + $1)::numeric, 2) >= f.valor_total THEN 'paga' ELSE f.status END,
            data_pagamento = CASE WHEN ROUND((COALESCE((SELECT SUM(p.valor) FROM pagamentos_faturas p WHERE p.fatura_id = f.id AND p.administradora_id = f.administradora_id), 0) + $1)::numeric, 2) >= f.valor_total THEN CURRENT_DATE ELSE f.data_pagamento END,
            updated_at = NOW()
        WHERE f.id = $2
          AND f.administradora_id = $3
          AND f.deleted_at IS NULL
          AND f.status NOT IN ('paga', 'cancelada')
          AND ROUND((f.valor_total - COALESCE((SELECT SUM(p.valor) FROM pagamentos_faturas p WHERE p.fatura_id = f.id AND p.administradora_id = f.administradora_id), 0))::numeric, 2) >= ROUND($1::numeric, 2)
        RETURNING f.id, f.administradora_id, f.status, f.valor_total
      ), pagamento_criado AS (
        INSERT INTO pagamentos_faturas (fatura_id, administradora_id, meio, idempotency_key, valor, identificador_externo, retorno_bruto, usuario_id)
        SELECT id, $3, $4, $5, $1, $6, $7::jsonb, $8 FROM fatura_atualizada
        RETURNING id, fatura_id, administradora_id, meio, valor
      ), evento_criado AS (
        INSERT INTO fatura_eventos (fatura_id, administradora_id, tipo, status_anterior, status_novo, origem, payload, usuario_id)
        SELECT fc.fatura_id, fc.administradora_id, 'pagamento_confirmado', $9, fa.status, $4, $10::jsonb, $8
        FROM pagamento_criado fc
        JOIN fatura_atualizada fa ON fa.id = fc.fatura_id
        RETURNING id
      ), auditoria_criada AS (
        INSERT INTO auditoria_cadastros
          (administradora_id, usuario_id, acao, tabela, registro_id, dados_anteriores, dados_novos)
        SELECT $3, $8, CASE WHEN fa.status = 'paga' THEN 'settlement' ELSE 'payment' END,
          'faturas_mensais', fa.id, $11::jsonb,
          jsonb_build_object('status', fa.status, 'valor', pc.valor, 'idempotency_key', $5, 'meio', pc.meio)
        FROM pagamento_criado pc
        JOIN fatura_atualizada fa ON fa.id = pc.fatura_id
        RETURNING registro_id
      )
      SELECT pc.id, pc.fatura_id, pc.administradora_id, pc.meio, pc.valor
      FROM pagamento_criado pc`,
      params: [
        valor,
        id,
        auth.administradoraId,
        meio,
        key,
        body.identificador_externo || null,
        JSON.stringify(body.retorno_bruto || {}),
        auth.userId,
        fatura[0].status,
        JSON.stringify({ meio, valor, idempotency_key: key }),
        JSON.stringify({ status: fatura[0].status, valor_total: fatura[0].valor_total }),
      ],
    },
  ])
  const pagamento = result[0]?.[0]
  if (!pagamento) return NextResponse.json({ error: "Fatura não aceita este pagamento ou saldo insuficiente" }, { status: 409 })
  return NextResponse.json({ data: pagamento, message: "Pagamento registrado e histórico criado" }, { status: 201 })
}
