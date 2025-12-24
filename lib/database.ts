import { neon } from "@neondatabase/serverless"
import type { NeonQueryFunction } from "@neondatabase/serverless"

if (!process.env.DATABASE_URL) {
  throw new Error("DATABASE_URL environment variable is not set")
}

export const sql: NeonQueryFunction<false, false> = neon(process.env.DATABASE_URL)

export const pool = {
  execute: async <T = any>(query: string, params?: any[]) => {
    const result = await sql(query, params || [])
    return [result] as [T[]]
  },
}

export async function query<T = any>(text: string, params?: any[]): Promise<T[]> {
  try {
    const result = await sql(text, params || [])
    return result as T[]
  } catch (error) {
    console.error("Database query error:", error)
    throw error
  }
}

export async function queryOne<T = any>(text: string, params?: any[]): Promise<T | null> {
  try {
    const result = await sql(text, params || [])
    return result.length > 0 ? (result[0] as T) : null
  } catch (error) {
    console.error("Database query error:", error)
    throw error
  }
}
