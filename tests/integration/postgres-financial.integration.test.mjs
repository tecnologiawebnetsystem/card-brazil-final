import assert from "node:assert/strict"
import test, { after, beforeEach } from "node:test"
import { Pool } from "pg"

process.env.CARD_BRAZIL_TEST_DB = "1"
const databaseUrl = process.env.TEST_DATABASE_URL
const database = await import("../../back-end/lib/database.ts")

const invoicePaymentSql = `
  WITH fatura_atualizada AS (
    UPDATE faturas_mensais f
    SET status = CASE
          WHEN ROUND((COALESCE((SELECT SUM(p.valor) FROM pagamentos_faturas p WHERE p.fatura_id = f.id AND p.administradora_id = f.administradora_id), 0) + $1)::numeric, 2) >= f.valor_total
          THEN 'paga' ELSE f.status END,
        data_pagamento = CASE
          WHEN ROUND((COALESCE((SELECT SUM(p.valor) FROM pagamentos_faturas p WHERE p.fatura_id = f.id AND p.administradora_id = f.administradora_id), 0) + $1)::numeric, 2) >= f.valor_total
          THEN CURRENT_DATE ELSE f.data_pagamento END,
        updated_at = NOW()
    WHERE f.id = $2 AND f.administradora_id = $3 AND f.deleted_at IS NULL
      AND f.status NOT IN ('paga', 'cancelada')
      AND NOT EXISTS (SELECT 1 FROM pagamentos_faturas p WHERE p.administradora_id = $3 AND p.idempotency_key = $5)
      AND ROUND((f.valor_total - COALESCE((SELECT SUM(p.valor) FROM pagamentos_faturas p WHERE p.fatura_id = f.id AND p.administradora_id = f.administradora_id), 0))::numeric, 2) >= ROUND($1::numeric, 2)
    RETURNING f.id, f.administradora_id, f.status
  ), pagamento_criado AS (
    INSERT INTO pagamentos_faturas (fatura_id, administradora_id, meio, idempotency_key, valor, usuario_id)
    SELECT id, $3, $4, $5, $1, 1 FROM fatura_atualizada
    RETURNING id, fatura_id, administradora_id, meio, valor
  )
  SELECT id, fatura_id, valor FROM pagamento_criado
`

async function payInvoice({ invoiceId, administratorId = 41, key, amount }) {
  const results = await database.transaction([
    { text: "SELECT pg_advisory_xact_lock(hashtextextended($1::text, 0))", params: [`${administratorId}:fatura:${key}`] },
    { text: "SELECT id FROM faturas_mensais WHERE id = $1 AND administradora_id = $2 AND deleted_at IS NULL FOR UPDATE", params: [invoiceId, administratorId] },
    { text: invoicePaymentSql, params: [amount, invoiceId, administratorId, "pix", key] },
  ])
  const inserted = results[2]?.[0]
  if (inserted) return { id: Number(inserted.id), created: true, rechecked: false }

  const [existing] = await database.query(
    "SELECT id, fatura_id, valor FROM pagamentos_faturas WHERE administradora_id = $1 AND idempotency_key = $2",
    [administratorId, key],
  )
  if (existing && Number(existing.fatura_id) === invoiceId && Number(existing.valor) === amount) {
    return { id: Number(existing.id), created: false, rechecked: true }
  }
  return { id: null, created: false, rechecked: true }
}

async function payInstallment({ installmentId, administratorId = 41, key, amount }) {
  const results = await database.transaction([
    { text: "SELECT pg_advisory_xact_lock(hashtextextended($1::text, 0))", params: [`${administratorId}:cobranca-pagamento:${key}`] },
    { text: "SELECT id FROM cobranca_parcelas WHERE id = $1 AND administradora_id = $2 FOR UPDATE", params: [installmentId, administratorId] },
    {
      text: `WITH parcela_atualizada AS (
        UPDATE cobranca_parcelas
        SET valor_pago = ROUND(valor_pago + $1, 2),
            status = CASE WHEN ROUND(valor_pago + $1, 2) >= valor_total THEN 'paga' ELSE status END,
            data_pagamento = CASE WHEN ROUND(valor_pago + $1, 2) >= valor_total THEN CURRENT_DATE ELSE data_pagamento END,
            updated_at = CURRENT_TIMESTAMP
        WHERE id = $2 AND administradora_id = $3
          AND status NOT IN ('paga', 'cancelada', 'renegociada')
          AND NOT EXISTS (SELECT 1 FROM cobranca_pagamentos WHERE administradora_id = $3 AND idempotency_key = $4)
          AND ROUND(valor_pago + $1, 2) <= ROUND(valor_total, 2)
        RETURNING id, valor_pago, status
      ), pagamento_criado AS (
        INSERT INTO cobranca_pagamentos (administradora_id, parcela_id, idempotency_key, valor_pago, forma_pagamento)
        SELECT $3, id, $4, $1, $5 FROM parcela_atualizada
        RETURNING id, parcela_id, valor_pago
      )
      SELECT id, parcela_id, valor_pago FROM pagamento_criado`,
      params: [amount, installmentId, administratorId, key, "pix"],
    },
  ])
  return results[2]?.[0] ?? null
}

async function resetTables() {
  await database.query(`
    TRUNCATE TABLE auditoria_cadastros, fatura_eventos, pagamentos_faturas,
      faturas_mensais, cobranca_eventos, cobranca_pagamentos, cobranca_parcelas,
      cobrancas, contas_receber RESTART IDENTITY CASCADE
  `)
}

beforeEach(async () => {
  if (databaseUrl) await resetTables()
})

test("dois pagamentos simultâneos da mesma fatura não ultrapassam o saldo persistido", { skip: !databaseUrl }, async () => {
  const [invoice] = await database.query(
    "INSERT INTO faturas_mensais (administradora_id, proposta_id, competencia, valor_total) VALUES (41, 10, '2026-01-01', 100) RETURNING id",
  )
  const results = await Promise.all([
    payInvoice({ invoiceId: Number(invoice.id), key: "invoice-a", amount: 60 }),
    payInvoice({ invoiceId: Number(invoice.id), key: "invoice-b", amount: 60 }),
  ])
  assert.equal(results.filter((result) => result.created).length, 1)
  assert.equal(results.filter((result) => result.id === null).length, 1)

  const [state] = await database.query(`
    SELECT f.status, f.valor_total, COALESCE(SUM(p.valor), 0) AS paid,
           COUNT(p.id)::integer AS payment_count
    FROM faturas_mensais f LEFT JOIN pagamentos_faturas p ON p.fatura_id = f.id
    WHERE f.id = $1 GROUP BY f.id`, [invoice.id])
  assert.equal(Number(state.paid), 60)
  assert.equal(state.payment_count, 1)
  assert.equal(state.status, "pendente")
  assert.ok(Number(state.paid) <= Number(state.valor_total))
})

test("requisições simultâneas com a mesma chave idempotente recuperam o pagamento persistido", { skip: !databaseUrl }, async () => {
  const [invoice] = await database.query(
    "INSERT INTO faturas_mensais (administradora_id, proposta_id, competencia, valor_total) VALUES (41, 11, '2026-02-01', 100) RETURNING id",
  )
  const results = await Promise.all([
    payInvoice({ invoiceId: Number(invoice.id), key: "same-key", amount: 35 }),
    payInvoice({ invoiceId: Number(invoice.id), key: "same-key", amount: 35 }),
  ])
  assert.equal(results[0].id, results[1].id)
  assert.equal(results.filter((result) => result.created).length, 1)
  assert.equal(results.filter((result) => result.rechecked).length, 1)

  const [state] = await database.query(
    "SELECT COUNT(*)::integer AS count, SUM(valor) AS paid FROM pagamentos_faturas WHERE administradora_id = 41 AND idempotency_key = 'same-key'",
  )
  assert.equal(state.count, 1)
  assert.equal(Number(state.paid), 35)
})

test("pagamentos concorrentes de parcelas mantêm saldo e unicidade no PostgreSQL", { skip: !databaseUrl }, async () => {
  const [installment] = await database.query(
    "INSERT INTO cobranca_parcelas (administradora_id, valor_original, valor_total) VALUES (41, 100, 100) RETURNING id",
  )
  const results = await Promise.all([
    payInstallment({ installmentId: Number(installment.id), key: "installment-a", amount: 70 }),
    payInstallment({ installmentId: Number(installment.id), key: "installment-b", amount: 50 }),
  ])
  assert.equal(results.filter(Boolean).length, 1)

  const [state] = await database.query(`
    SELECT cp.valor_total, cp.valor_pago, cp.status, COUNT(p.id)::integer AS payment_count,
           COALESCE(SUM(p.valor_pago), 0) AS payment_sum
    FROM cobranca_parcelas cp LEFT JOIN cobranca_pagamentos p ON p.parcela_id = cp.id
    WHERE cp.id = $1 GROUP BY cp.id`, [installment.id])
  assert.ok([70, 50].includes(Number(state.valor_pago)))
  assert.equal(Number(state.valor_pago), Number(state.payment_sum))
  assert.equal(state.payment_count, 1)
  assert.ok(Number(state.valor_pago) <= Number(state.valor_total))
})

test("locks advisory e FOR UPDATE bloqueiam concorrência na linha financeira", { skip: !databaseUrl }, async () => {
  const [invoice] = await database.query(
    "INSERT INTO faturas_mensais (administradora_id, proposta_id, competencia, valor_total) VALUES (41, 12, '2026-03-01', 100) RETURNING id",
  )
  const directPool = new Pool({ connectionString: databaseUrl, max: 2 })
  const first = await directPool.connect()
  const second = await directPool.connect()
  try {
    await first.query("BEGIN")
    await first.query("SELECT pg_advisory_xact_lock(hashtextextended($1::text, 0))", ["lock-verification"])
    const advisory = await second.query("SELECT pg_try_advisory_xact_lock(hashtextextended($1::text, 0)) AS acquired", ["lock-verification"])
    assert.equal(advisory.rows[0].acquired, false)

    await first.query("SELECT id FROM faturas_mensais WHERE id = $1 FOR UPDATE", [invoice.id])
    await assert.rejects(
      second.query("SELECT id FROM faturas_mensais WHERE id = $1 FOR UPDATE NOWAIT", [invoice.id]),
      (error) => error.code === "55P03",
    )
  } finally {
    await first.query("ROLLBACK")
    first.release()
    second.release()
    await directPool.end()
  }
})

test("falha durante a transação reverte pagamento e atualização condicional", { skip: !databaseUrl }, async () => {
  const [invoice] = await database.query(
    "INSERT INTO faturas_mensais (administradora_id, proposta_id, competencia, valor_total) VALUES (41, 13, '2026-04-01', 100) RETURNING id",
  )
  await assert.rejects(database.transaction([
    {
      text: "UPDATE faturas_mensais SET status = 'paga', data_pagamento = CURRENT_DATE WHERE id = $1 AND status NOT IN ('paga', 'cancelada') AND valor_total >= $2 RETURNING id",
      params: [invoice.id, 100],
    },
    {
      text: "INSERT INTO pagamentos_faturas (fatura_id, administradora_id, meio, idempotency_key, valor, usuario_id) VALUES ($1, 41, 'pix', 'rollback-key', 100, 1)",
      params: [invoice.id],
    },
    {
      text: "INSERT INTO auditoria_cadastros (administradora_id, usuario_id, acao, tabela, registro_id) VALUES (41, 1, 'invalid-action', 'faturas_mensais', $1)",
      params: [invoice.id],
    },
  ]), /check constraint/i)

  const [state] = await database.query(`
    SELECT f.status, COUNT(p.id)::integer AS payment_count
    FROM faturas_mensais f LEFT JOIN pagamentos_faturas p ON p.fatura_id = f.id
    WHERE f.id = $1 GROUP BY f.id`, [invoice.id])
  assert.equal(state.status, "pendente")
  assert.equal(state.payment_count, 0)
})

test("constraints do PostgreSQL impedem pagamento duplicado e saldos inconsistentes", { skip: !databaseUrl }, async () => {
  const [invoice] = await database.query(
    "INSERT INTO faturas_mensais (administradora_id, proposta_id, competencia, valor_total) VALUES (41, 14, '2026-05-01', 100) RETURNING id",
  )
  await payInvoice({ invoiceId: Number(invoice.id), key: "unique-key", amount: 100 })
  await assert.rejects(
    database.query("INSERT INTO pagamentos_faturas (fatura_id, administradora_id, meio, idempotency_key, valor, usuario_id) VALUES ($1, 41, 'pix', 'unique-key', 1, 1)", [invoice.id]),
    (error) => error.code === "23505",
  )
  const [state] = await database.query(`
    SELECT f.status, f.valor_total, COALESCE(SUM(p.valor), 0) AS paid,
           COUNT(p.id)::integer AS payment_count
    FROM faturas_mensais f LEFT JOIN pagamentos_faturas p ON p.fatura_id = f.id
    WHERE f.id = $1 GROUP BY f.id`, [invoice.id])
  assert.equal(state.status, "paga")
  assert.equal(Number(state.paid), 100)
  assert.equal(state.payment_count, 1)
  assert.ok(Number(state.paid) <= Number(state.valor_total))
})

after(async () => {
  await database.closeTestDatabasePool()
})
