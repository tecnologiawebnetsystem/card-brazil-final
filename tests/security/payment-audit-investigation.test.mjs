import assert from "node:assert/strict"
import fs from "node:fs"
import test from "node:test"

const root = new URL("../../", import.meta.url)
const read = (path) => fs.readFileSync(new URL(path, root), "utf8")

test("faturas exigem chave idempotente normalizada e escopada", () => {
  const route = read("app/api/financeiro/faturas/[id]/pagamentos/route.ts")

  assert.match(route, /request\.headers\.get\("idempotency-key"\) \|\| body\.idempotency_key/)
  assert.match(route, /\.trim\(\)/)
  assert.match(route, /!key \|\| key\.length > 160/)
  assert.match(route, /administradora_id = \$1 AND idempotency_key = \$2/)
})

test("repetição de fatura compara parâmetros e retorna conflito idempotente", () => {
  const route = read("app/api/financeiro/faturas/[id]/pagamentos/route.ts")

  assert.match(route, /Number\(previous\.fatura_id\) !== id/)
  assert.match(route, /previous\.meio !== meio/)
  assert.match(route, /Number\(previous\.valor\) !== valor/)
  assert.match(route, /Idempotency-Key já utilizada com parâmetros incompatíveis/)
  assert.match(route, /status: 409/)
  assert.match(route, /idempotent: true/)
  assert.match(route, /isUniqueConstraintViolation\(error\)/)
  assert.match(route, /if \(!previous\) throw error/)
})

test("schema versionado não comprova unicidade de pagamentos de faturas", () => {
  const ddl = read("sql/banco-dados_DDL_10_faturamento_bancario.sql")
  const migrations = read("sql/banco-dados_migrations_005_integridade_cobranca_financeira.sql")
  const pagamentosTable = ddl.match(/CREATE TABLE IF NOT EXISTS pagamentos_faturas \(([^;]+)\);/)?.[1] ?? ""

  assert.match(pagamentosTable, /idempotency_key VARCHAR\(160\) NOT NULL/)
  assert.match(pagamentosTable, /UNIQUE \(administradora_id, idempotency_key\)/)
  assert.doesNotMatch(migrations, /uq_.*pagamentos_faturas.*idempotency/i)
})

test("pagamento de fatura serializa a chave e bloqueia saldo antes da gravação", () => {
  const route = read("app/api/financeiro/faturas/[id]/pagamentos/route.ts")
  const transactionPosition = route.indexOf("result = await transaction")
  const advisoryLockPosition = route.indexOf("pg_advisory_xact_lock", transactionPosition)
  const rowLockPosition = route.indexOf("FOR UPDATE", advisoryLockPosition)
  const updatePosition = route.indexOf("WITH fatura_atualizada", rowLockPosition)

  assert.ok(transactionPosition >= 0)
  assert.ok(advisoryLockPosition > transactionPosition)
  assert.ok(rowLockPosition > advisoryLockPosition)
  assert.ok(updatePosition > rowLockPosition)
  assert.match(route, /NOT EXISTS \(SELECT 1 FROM pagamentos_faturas p WHERE p\.administradora_id = \$3 AND p\.idempotency_key = \$5\)/)
})

test("auditoria financeira da parcela entra na lista da mesma transação", () => {
  const route = read("app/api/cobranca/pagamentos/route.ts")
  const database = read("back-end/lib/cadastro-audit.ts")

  assert.match(route, /WITH parcela_atualizada AS \([\s\S]*pagamento_criado AS \([\s\S]*evento_criado AS \([\s\S]*auditoria_criada AS \(/)
  assert.match(route, /FROM pagamento_criado pc/)
  assert.match(route, /pg_advisory_xact_lock[\s\S]*?FOR UPDATE[\s\S]*?WITH parcela_atualizada/)
  assert.match(route, /NOT EXISTS \(SELECT 1 FROM cobranca_pagamentos cp WHERE cp\.administradora_id = \$3 AND cp\.idempotency_key = \$4\)/)
  assert.match(database, /export function createCadastroAuditStatement\(/)
  assert.match(database, /export async function recordCadastroAudit\(/)
  assert.match(database, /await query\(statement\.text, statement\.params\)/)
})

test("auditoria financeira da fatura entra na mesma transação", () => {
  const route = read("app/api/financeiro/faturas/[id]/pagamentos/route.ts")
  assert.match(route, /WITH fatura_atualizada AS \([\s\S]*pagamento_criado AS \([\s\S]*evento_criado AS \([\s\S]*auditoria_criada AS \(/)
  assert.match(route, /FROM pagamento_criado pc/)
  assert.match(route, /NOT EXISTS \(SELECT 1 FROM pagamentos_faturas p WHERE p\.administradora_id = \$3 AND p\.idempotency_key = \$5\)/)
  assert.doesNotMatch(route, /await recordCadastroAudit\(/)
})

test("não há outbox ou recuperação persistente identificada para auditoria", () => {
  const audit = read("back-end/lib/cadastro-audit.ts")
  const paymentRoute = read("app/api/cobranca/pagamentos/route.ts")

  assert.doesNotMatch(audit, /outbox|pending|retry|tentativa/i)
  assert.doesNotMatch(paymentRoute, /auditoria.*pendente|retry.*audit|outbox/i)
})

// Estes testes são estruturais: não comprovam concorrência, rollback ou constraints aplicadas no PostgreSQL.
// A validação comportamental permanece pendente de um banco de homologação isolado e autorizado.
