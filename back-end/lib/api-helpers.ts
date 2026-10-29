// Helper para converter queries MySQL para PostgreSQL
export function convertMySQLToPostgres(query: string, params: any[]): { query: string; params: any[] } {
  let convertedQuery = query
  let paramIndex = 1

  // Substituir ? por $1, $2, etc.
  convertedQuery = convertedQuery.replace(/\?/g, () => `$${paramIndex++}`)

  // Converter NOW() para CURRENT_TIMESTAMP
  convertedQuery = convertedQuery.replace(/NOW$$$$/gi, "CURRENT_TIMESTAMP")

  // Converter deleted_at IS NULL para deleted_at IS NULL (já compatível)
  // Converter LIMIT para LIMIT (já compatível)

  return { query: convertedQuery, params }
}
