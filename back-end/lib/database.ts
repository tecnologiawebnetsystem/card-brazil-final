import { neon } from "@neondatabase/serverless"
import type { NeonQueryFunction } from "@neondatabase/serverless"

let sql: NeonQueryFunction<false, false> | null = null
let testPool: import("pg").Pool | null = null

function isIsolatedPostgresTest() {
  return process.env.CARD_BRAZIL_TEST_DB === "1"
}

async function getTestPool() {
  if (!isIsolatedPostgresTest()) throw new Error("O driver PostgreSQL de teste só pode ser usado pelo harness isolado")
  for (const name of ["DATABASE_URL", "DATABASE_URL_UNPOOLED", "NEON_DATABASE_URL", "POSTGRES_URL", "POSTGRES_URL_NON_POOLING", "POSTGRES_PRISMA_URL"]) {
    if (process.env[name]) throw new Error(`${name} operacional não pode estar definido no harness isolado`)
  }
  const connectionString = process.env.TEST_DATABASE_URL
  if (!connectionString) throw new Error("TEST_DATABASE_URL é obrigatória no modo de teste isolado")

  const target = new URL(connectionString)
  const localHost = ["localhost", "127.0.0.1", "::1", "[::1]"].includes(target.hostname)
  const ephemeralPort = Number(target.port) >= 32768 && Number(target.port) <= 65535
  const isolatedDatabase = target.pathname === "/card_brazil_test" && target.username === "card_brazil_ci"
  const noConnectionOverrides = !target.search && !target.hash
  if (!( ["postgres:", "postgresql:"].includes(target.protocol) && localHost && ephemeralPort && isolatedDatabase && noConnectionOverrides)) {
    throw new Error("O harness aceita exclusivamente card_brazil_ci no banco efêmero card_brazil_test em loopback local e porta dinâmica")
  }

  if (!testPool) {
    const { Pool } = await import("pg")
    testPool = new Pool({ connectionString, max: 5 })
  }
  return testPool
}

export async function closeTestDatabasePool() {
  if (!testPool) return
  await testPool.end()
  testPool = null
}

function getSql() {
  if (!process.env.DATABASE_URL) {
    throw new Error("DATABASE_URL não está configurada")
  }
  if (!sql) sql = neon(process.env.DATABASE_URL)
  return sql
}

export { sql }

export const pool = {
  execute: async <T = any>(queryText: string, params?: any[]) => {
    if (isIsolatedPostgresTest()) {
      const result = await (await getTestPool()).query(queryText, params || [])
      return [result.rows] as [T[]]
    }
    const result = await getSql().query(queryText, params || [])
    return [result] as [T[]]
  },
}

function normalizePostgresQuery(text: string) {
  let index = 0
  return text.replace(/\?/g, () => `$${++index}`)
}

export async function query<T = any>(text: string, params?: any[]): Promise<T[]> {
  try {
    const normalized = normalizePostgresQuery(text)
    if (isIsolatedPostgresTest()) {
      const result = await (await getTestPool()).query(normalized, params || [])
      return result.rows as T[]
    }
    const result = await getSql().query(normalized, params || [])
    return result as T[]
  } catch (error) {
    console.error("Database query error:", error)
    throw error
  }
}

export type DatabaseStatement = { text: string; params?: any[] }

export function isUniqueConstraintViolation(error: unknown) {
  if (!error || typeof error !== "object") return false
  const databaseError = error as { code?: unknown; cause?: { code?: unknown } }
  return databaseError.code === "23505" || databaseError.cause?.code === "23505"
}

export async function transaction<T = any>(statements: DatabaseStatement[]): Promise<T[][]> {
  if (isIsolatedPostgresTest()) {
    const client = await (await getTestPool()).connect()
    try {
      await client.query("BEGIN")
      const results: T[][] = []
      for (const statement of statements) {
        const result = await client.query(normalizePostgresQuery(statement.text), statement.params || [])
        results.push(result.rows as T[])
      }
      await client.query("COMMIT")
      return results
    } catch (error) {
      await client.query("ROLLBACK")
      throw error
    } finally {
      client.release()
    }
  }
  const connection = getSql()
  const queries = statements.map(({ text, params }) => connection.query(normalizePostgresQuery(text), params || []))
  return (await connection.transaction(queries)) as T[][]
}

export async function queryOne<T = any>(text: string, params?: any[]): Promise<T | null> {
  const rows = await query<T>(text, params)
  return rows[0] ?? null
}
