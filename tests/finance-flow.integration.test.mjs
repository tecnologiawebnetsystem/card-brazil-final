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

test("conciliação única persiste a parcela encontrada", () => {
  const route = read("app/api/cobranca/conciliacao/transacoes/route.ts")
  assert.match(route, /const parcelaId = match\?\.id \?\? null/)
  assert.match(route, /match \? \"sugerida\" : \"divergente\"/)
  assert.match(route, /parcelaId\],/)
})

test("conciliação ambígua ou sem correspondência não cria vínculo", () => {
  const route = read("app/api/cobranca/conciliacao/transacoes/route.ts")
  assert.match(route, /candidatos\.length > 1 \? \[\"duplicidade\"\]/)
  assert.match(route, /candidatos\.length === 0 \? \[\"titulo_inexistente\"\]/)
  assert.match(route, /const match = candidatos\.length === 1 \? candidatos\[0\] : null/)
})

test("conciliação é idempotente e escopada por administradora", () => {
  const route = read("app/api/cobranca/conciliacao/transacoes/route.ts")
  assert.match(route, /administradora_id = \$1 AND identificador_externo = \$2/)
  assert.match(route, /WHERE id = \$1 AND administradora_id = \$2/)
  assert.match(route, /administradora_id = \$3 AND status NOT IN/)
})

test("migration declara o vínculo da conciliação", () => {
  const migration = read("banco-dados/migrations/006_conciliacao_inadimplencia.sql")
  assert.match(migration, /parcela_id BIGINT/)
  assert.match(migration, /pagamento_id BIGINT/)
  assert.match(migration, /UNIQUE \(administradora_id, identificador_externo\)/)
})

test("pagamento de parcela exige permissão e saldo atômico", () => {
  const route = read("app/api/cobranca/pagamentos/route.ts")
  assert.match(route, /permissions\["cobranca\.create"\] !== true/)
  assert.match(route, /ROUND\(valor_pago \+ \$1, 2\) <= ROUND\(valor_total, 2\)/)
  assert.match(route, /WITH parcela_atualizada AS \(/)
  assert.match(route, /SELECT pc\.id, pc\.parcela_id, pc\.valor_pago, pa\.status/)
})

test("pagamento de fatura exige permissão e calcula saldo acumulado", () => {
  const route = read("app/api/financeiro/faturas\/\[id\]\/pagamentos\/route.ts")
  assert.match(route, /hasPermission\(auth, "financeiro", "create"\)/)
  assert.match(route, /SUM\(p\.valor\) FROM pagamentos_faturas/)
  assert.match(route, /f\.valor_total - COALESCE/)
  assert.match(route, /INSERT INTO pagamentos_faturas/)
})

test("idempotência rejeita a mesma chave com parâmetros diferentes", () => {
  const parcelaRoute = read("app/api/cobranca/pagamentos/route.ts")
  const faturaRoute = read("app/api/financeiro/faturas/[id]/pagamentos/route.ts")
  assert.match(parcelaRoute, /Idempotency-Key já utilizada com parâmetros incompatíveis/)
  assert.match(faturaRoute, /Idempotency-Key já utilizada com parâmetros incompatíveis/)
  assert.match(parcelaRoute, /status: 409/)
  assert.match(faturaRoute, /status: 409/)
})

test("migration protege idempotência e isolamento do fluxo", () => {
  const migration = read("banco-dados/migrations/007_integracao_fluxo_principal.sql")
  assert.match(migration, /uq_faturas_mensais_admin_proposta_competencia/)
  assert.match(migration, /uq_contas_receber_admin_documento/)
  assert.match(migration, /idx_beneficiarios_admin_contrato_plano/)
})
