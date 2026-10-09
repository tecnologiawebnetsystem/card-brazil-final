import assert from "node:assert/strict"
import fs from "node:fs"
import test from "node:test"

const root = new URL("../", import.meta.url)
const read = (file) => fs.readFileSync(new URL(file, root), "utf8")

test("aprovação cria contrato na mesma transação", () => {
  const route = read("app/api/propostas/aprovar/route.ts")
  assert.match(route, /transaction\(\[/)
  assert.match(route, /UPDATE propostas SET status = 'contrato_gerado'/)
  assert.match(route, /INSERT INTO contratos/)
  assert.match(route, /contrato_id: rows\[1\]\[0\]\.id/)
})

test("faturamento exige proposta aprovada e cria conta a receber", () => {
  const route = read("app/api/propostas/faturas/route.ts")
  assert.match(route, /status !== ["']aprovada["']/)
  assert.match(route, /INSERT INTO contas_receber/)
  assert.match(route, /ON CONFLICT \(administradora_id, numero_documento\)/)
})

test("contrato exige plano, estipulante e condição financeira", () => {
  const route = read("app/api/contratos/route.ts")
  assert.match(route, /plano_id/)
  assert.match(route, /estipulante_id/)
  assert.match(route, /valor_total/)
  assert.match(route, /forma_pagamento/)
  assert.match(route, /p\.id_administradora = \$3/)
})

test("beneficiário só é vinculado ao plano do contrato", () => {
  const route = read("app/api/beneficiarios/route.ts")
  assert.match(route, /c\.plano_id = \$2/)
  assert.match(route, /c\.administradora_id = \$3/)
})

test("migration protege idempotência e isolamento do fluxo", () => {
  const migration = read("banco-dados/migrations/007_integracao_fluxo_principal.sql")
  assert.match(migration, /uq_faturas_mensais_admin_proposta_competencia/)
  assert.match(migration, /uq_contas_receber_admin_documento/)
  assert.match(migration, /idx_beneficiarios_admin_contrato_plano/)
})
