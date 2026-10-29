import assert from "node:assert/strict"
import fs from "node:fs"
import test from "node:test"

const root = new URL("../", import.meta.url)
const read = (path) => fs.readFileSync(new URL(path, root), "utf8")

test("faturas exigem chave idempotente normalizada e escopada", () => {
  const route = read("app/api/financeiro/faturas/[id]/pagamentos/route.ts")

  assert.match(route, /request\.headers\.get\("idempotency-key"\) \|\| body\.idempotency_key/)
  assert.match(route, /\.trim\(\)/)
  assert.match(route, /!key \|\| key\.length > 160/)
  assert.match(route, /administradora_id = \$1 AND idempotency_key = \$2/)
})

test("repetição sequencial de fatura compara parâmetros e retorna conflito", () => {
  const route = read("app/api/financeiro/faturas/[id]/pagamentos/route.ts")

  assert.match(route, /previous\.fatura_id !== id/)
  assert.match(route, /previous\.meio !== meio/)
  assert.match(route, /Number\(previous\.valor\) !== valor/)
  assert.match(route, /Idempotency-Key já utilizada com parâmetros incompatíveis/)
  assert.match(route, /status: 409/)
  assert.match(route, /idempotent: true/)
})

test("schema versionado não comprova unicidade de pagamentos de faturas", () => {
  const ddl = read("banco-dados/DDL/10_faturamento_bancario.sql")
  const migrations = read("banco-dados/migrations/005_integridade_cobranca_financeira.sql")
  const pagamentosTable = ddl.match(/CREATE TABLE IF NOT EXISTS pagamentos_faturas \(([^;]+)\);/)?.[1] ?? ""

  assert.match(pagamentosTable, /idempotency_key VARCHAR\(160\) NOT NULL/)
  assert.match(pagamentosTable, /UNIQUE \(administradora_id, idempotency_key\)/)
  assert.doesNotMatch(migrations, /uq_.*pagamentos_faturas.*idempotency/i)
})

test("pagamento de fatura depende de leitura prévia antes da transação", () => {
  const route = read("app/api/financeiro/faturas/[id]/pagamentos/route.ts")
  const existingPosition = route.indexOf("const existing = await query")
  const transactionPosition = route.indexOf("const result = await transaction")

  assert.ok(existingPosition >= 0)
  assert.ok(transactionPosition > existingPosition)
})

test("auditoria financeira da parcela entra na lista da mesma transação", () => {
  const route = read("app/api/cobranca/pagamentos/route.ts")
  const database = read("lib/cadastro-audit.ts")

  assert.match(route, /WITH parcela_atualizada AS \([\s\S]*pagamento_criado AS \([\s\S]*evento_criado AS \([\s\S]*auditoria_criada AS \(/)
  assert.match(route, /FROM pagamento_criado pc/)
  assert.doesNotMatch(route, /EXISTS \(\s*SELECT 1 FROM cobranca_pagamentos/)
  assert.match(database, /export function createCadastroAuditStatement\(/)
  assert.match(database, /export async function recordCadastroAudit\(/)
  assert.match(database, /await query\(statement\.text, statement\.params\)/)
})

test("auditoria financeira da fatura entra na mesma transação", () => {
  const route = read("app/api/financeiro/faturas/[id]/pagamentos/route.ts")
  assert.match(route, /WITH fatura_atualizada AS \([\s\S]*pagamento_criado AS \([\s\S]*evento_criado AS \([\s\S]*auditoria_criada AS \(/)
  assert.match(route, /FROM pagamento_criado pc/)
  assert.doesNotMatch(route, /EXISTS \(SELECT 1 FROM pagamentos_faturas/)
  assert.doesNotMatch(route, /await recordCadastroAudit\(/)
})

test("não há outbox ou recuperação persistente identificada para auditoria", () => {
  const audit = read("lib/cadastro-audit.ts")
  const paymentRoute = read("app/api/cobranca/pagamentos/route.ts")

  assert.doesNotMatch(audit, /outbox|pending|retry|tentativa/i)
  assert.doesNotMatch(paymentRoute, /auditoria.*pendente|retry.*audit|outbox/i)
})

// Estes testes são estruturais: não comprovam concorrência, rollback ou constraints aplicadas no PostgreSQL.
// A validação comportamental permanece pendente de um banco de homologação isolado e autorizado.
