import { neon } from "@neondatabase/serverless"
import type { NeonQueryFunction } from "@neondatabase/serverless"

let sql: NeonQueryFunction<false, false> | null = null

function getSql() {
  if (!process.env.DATABASE_URL) {
    throw new Error("DATABASE_URL não está configurada")
  }
  if (!sql) sql = neon(process.env.DATABASE_URL)
  return sql
}

export { sql }

export const pool = {
  execute: async <T = any>(query: string, params?: any[]) => {
    const result = await getSql()(query, params || [])
    return [result] as [T[]]
  },
}

function normalizePostgresQuery(text: string) {
  let index = 0
  return text.replace(/\?/g, () => `$${++index}`)
}

export async function query<T = any>(text: string, params?: any[]): Promise<T[]> {
  try {
    const result = await getSql()(normalizePostgresQuery(text), params || [])
    return result as T[]
  } catch (error) {
    console.error("Database query error:", error)
    throw error
  }
}

export async function queryOne<T = any>(text: string, params?: any[]): Promise<T | null> {
  try {
    const result = await getSql()(text, params || [])
    return result.length > 0 ? (result[0] as T) : null
  } catch (error) {
    console.error("Database query error:", error)
    throw error
  }
}
