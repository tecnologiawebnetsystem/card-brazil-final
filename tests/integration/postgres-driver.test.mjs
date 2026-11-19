import assert from "node:assert/strict"
import test from "node:test"

const databaseUrl = process.env.TEST_DATABASE_URL
process.env.CARD_BRAZIL_TEST_DB = "1"

const database = await import("../../back-end/lib/database.ts")

test("modo de teste rejeita conexão que não seja loopback", async () => {
  const original = process.env.TEST_DATABASE_URL
  process.env.TEST_DATABASE_URL = "postgres://test:test@example.com/card_brazil_test"
  await assert.rejects(database.query("SELECT 1"), /loopback local/)
  if (original === undefined) delete process.env.TEST_DATABASE_URL
  else process.env.TEST_DATABASE_URL = original
})

test("consulta parametrizada usa o PostgreSQL efêmero", { skip: !databaseUrl }, async () => {
  const rows = await database.query("SELECT $1::text AS marcador", ["card-brazil-test"])
  assert.deepEqual(rows, [{ marcador: "card-brazil-test" }])
})

test("transação executa statements em ordem e retorna seus resultados", { skip: !databaseUrl }, async () => {
  const results = await database.transaction([
    { text: "SELECT $1::integer AS numero", params: [17] },
    { text: "SELECT $1::text AS estado", params: ["commit"] },
  ])
  assert.deepEqual(results, [[{ numero: 17 }], [{ estado: "commit" }]])
})

test("transação faz rollback quando um statement falha", { skip: !databaseUrl }, async () => {
  await assert.rejects(
    database.transaction([
      { text: "SELECT 1 AS antes" },
      { text: "SELECT 1 / 0 AS erro" },
    ]),
    /division by zero/i,
  )
})

test.after(async () => {
  await database.closeTestDatabasePool()
})
