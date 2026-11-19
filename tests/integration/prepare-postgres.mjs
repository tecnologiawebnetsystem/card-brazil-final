import assert from "node:assert/strict"
import fs from "node:fs/promises"
import { Client } from "pg"

const connectionString = process.env.TEST_DATABASE_URL
const operationalVariables = [
  "DATABASE_URL",
  "DATABASE_URL_UNPOOLED",
  "NEON_DATABASE_URL",
  "POSTGRES_URL",
  "POSTGRES_URL_NON_POOLING",
  "POSTGRES_PRISMA_URL",
]

assert.equal(process.env.CARD_BRAZIL_TEST_DB, "1", "O modo de teste isolado precisa estar habilitado")
assert.ok(connectionString, "TEST_DATABASE_URL é obrigatória")
for (const name of operationalVariables) {
  assert.equal(process.env[name] || "", "", `${name} operacional não pode estar definido no harness`)
}

const target = new URL(connectionString)
assert.ok(["postgres:", "postgresql:"].includes(target.protocol), "Somente PostgreSQL é aceito")
assert.ok(["127.0.0.1", "localhost", "::1", "[::1]"].includes(target.hostname), "O destino deve ser loopback local")
assert.ok(Number(target.port) >= 32768 && Number(target.port) <= 65535, "A conexão deve usar porta dinâmica efêmera")
assert.equal(target.username, "card_brazil_ci", "Usuário exclusivo de teste obrigatório")
assert.equal(decodeURIComponent(target.pathname), "/card_brazil_test", "Banco exclusivo de teste obrigatório")
assert.equal(target.search, "", "Parâmetros de conexão inesperados")
assert.equal(target.hash, "", "Fragmentos de conexão inesperados")

if (process.env.CARD_BRAZIL_CI_POSTGRES === "1") {
  assert.equal(process.env.GITHUB_ACTIONS, "true", "O serviço CI só pode ser usado dentro do GitHub Actions")
}

const client = new Client({ connectionString, application_name: "card-brazil-disposable-integration" })
await client.connect()
try {
  const identity = await client.query(`
    SELECT current_database() AS database_name,
           current_user AS database_user,
           pg_is_in_recovery() AS is_replica
  `)
  assert.equal(identity.rows[0].database_name, "card_brazil_test")
  assert.equal(identity.rows[0].database_user, "card_brazil_ci")
  assert.equal(identity.rows[0].is_replica, false)

  const existingObjects = await client.query(`
    SELECT COUNT(*)::integer AS count
    FROM information_schema.tables
    WHERE table_schema = 'public' AND table_type = 'BASE TABLE'
  `)
  assert.equal(existingObjects.rows[0].count, 0, "O banco descartável precisa estar vazio antes da preparação")

  const fixture = await fs.readFile(new URL("./postgres-fixture.sql", import.meta.url), "utf8")
  await client.query(fixture)
  for (const migration of [
    "../../sql/banco-dados_migrations_005_integridade_cobranca_financeira.sql",
    "../../sql/banco-dados_migrations_007_integracao_fluxo_principal.sql",
  ]) {
    await client.query(await fs.readFile(new URL(migration, import.meta.url), "utf8"))
  }

  const requiredTables = await client.query(`
    SELECT table_name
    FROM information_schema.tables
    WHERE table_schema = 'public' AND table_type = 'BASE TABLE'
      AND table_name IN ('faturas_mensais', 'pagamentos_faturas', 'cobranca_parcelas', 'cobranca_pagamentos')
  `)
  assert.equal(requiredTables.rowCount, 4, "O schema PostgreSQL financeiro não foi preparado integralmente")
  process.stdout.write("Schema PostgreSQL de teste preparado no banco card_brazil_test isolado.\n")
} finally {
  await client.end()
}
