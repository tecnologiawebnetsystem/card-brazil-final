import { neon } from "@neondatabase/serverless"
import type { NeonQueryFunction } from "@neondatabase/serverless"

const DATABASE_URL = process.env.DATABASE_URL || "postgresql://placeholder:placeholder@placeholder:5432/placeholder"

let sql: NeonQueryFunction<false, false>

try {
  sql = neon(DATABASE_URL)
} catch (error) {
  console.error("Failed to initialize database connection:", error)
  // Create a dummy function that throws on actual use
  sql = (() => {
    throw new Error("DATABASE_URL is not configured. Please set it in your .env.local file.")
  }) as any
}

export { sql }

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
