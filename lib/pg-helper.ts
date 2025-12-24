/**
 * Converte queries com placeholders MySQL (?) para PostgreSQL ($1, $2, etc)
 */
export function convertMySQLToPostgreSQL(query: string, params: any[]): { query: string; params: any[] } {
  let paramIndex = 1
  const convertedQuery = query.replace(/\?/g, () => `$${paramIndex++}`)

  // Converter NOW() para CURRENT_TIMESTAMP
  const finalQuery = convertedQuery.replace(/NOW$$$$/gi, "CURRENT_TIMESTAMP")

  return {
    query: finalQuery,
    params,
  }
}

/**
 * Helper para executar queries com conversão automática
 */
export async function executeQuery<T = any>(sql: any, query: string, params: any[] = []): Promise<T[]> {
  const { query: pgQuery, params: pgParams } = convertMySQLToPostgreSQL(query, params)
  const result = await sql(pgQuery, pgParams)
  return result as T[]
}
