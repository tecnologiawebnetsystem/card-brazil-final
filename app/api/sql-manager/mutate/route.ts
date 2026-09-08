import { NextRequest, NextResponse } from "next/server"
import { query } from "@/lib/database"
import { accessError, requireSqlManagerAccess, safeIdentifier } from "@/lib/sql-manager-auth"

const MAX_COLUMNS = 80

function reject(error: string, status = 400) {
  return NextResponse.json({ success: false, error }, { status })
}

function quoteIdentifier(value: string) {
  return `"${value.replaceAll('"', '""')}"`
}

async function getTableMetadata(table: string) {
  const safeTable = safeIdentifier(table)
  if (!safeTable) throw new Error("Tabela inválida.")
  const exists = await query<{ table_name: string }>(
    `SELECT table_name FROM information_schema.tables WHERE table_schema = 'public' AND table_type = 'BASE TABLE' AND table_name = $1`,
    [safeTable],
  )
  if (!exists.length) throw new Error("Tabela não encontrada.")
  const columns = await query<{ column_name: string; is_primary_key: boolean; is_identity: string; column_default: string | null }>(
    `SELECT c.column_name, c.column_default, c.is_identity,
      EXISTS (SELECT 1 FROM pg_constraint pc JOIN pg_attribute pa ON pa.attrelid = pc.conrelid AND pa.attnum = ANY(pc.conkey) WHERE pc.contype = 'p' AND pc.conrelid = to_regclass(format('%I.%I', c.table_schema, c.table_name)) AND pa.attname = c.column_name) AS is_primary_key
     FROM information_schema.columns c WHERE c.table_schema = 'public' AND c.table_name = $1 ORDER BY c.ordinal_position`,
    [safeTable],
  )
  if (!columns.length || columns.length > MAX_COLUMNS) throw new Error("A tabela não possui uma estrutura editável compatível.")
  return { table: safeTable, columns }
}

export async function POST(request: NextRequest) {
  try {
    const user = await requireSqlManagerAccess()
    const body = await request.json()
    const operation = body.operation as string
    if (!["insert", "update", "delete"].includes(operation)) return reject("Operação inválida.")
    const metadata = await getTableMetadata(body.table)
    const allowed = new Set(metadata.columns.map(column => column.column_name))
    const primaryKey = metadata.columns.find(column => column.is_primary_key)?.column_name
    if (!primaryKey) return reject("Esta tabela não possui chave primária para edição pelo grid.", 409)

    if (operation === "delete") {
      const key = body.primaryKeyValue
      if (key === undefined || key === null || key === "") return reject("A chave primária é obrigatória.")
      const rows = await query<Record<string, unknown>>(`DELETE FROM ${quoteIdentifier(metadata.table)} WHERE ${quoteIdentifier(primaryKey)} = $1 RETURNING ${quoteIdentifier(primaryKey)}`, [key])
      if (!rows.length) return reject("Registro não encontrado.", 404)
      return NextResponse.json({ success: true, operation, affectedRows: rows.length, message: "Registro excluído com sucesso." })
    }

    const values = body.values && typeof body.values === "object" && !Array.isArray(body.values) ? body.values as Record<string, unknown> : {}
    const entries = Object.entries(values).filter(([column, value]) => allowed.has(column) && value !== undefined)
    if (!entries.length) return reject("Informe pelo menos um campo válido.")
    if (entries.length > MAX_COLUMNS) return reject("Quantidade de campos inválida.")

    if (operation === "insert") {
      const columns = entries.map(([column]) => column)
      const params = entries.map(([, value]) => value === "NULL" ? null : value)
      const placeholders = params.map((_, index) => `$${index + 1}`).join(", ")
      const rows = await query<Record<string, unknown>>(`INSERT INTO ${quoteIdentifier(metadata.table)} (${columns.map(quoteIdentifier).join(", ")}) VALUES (${placeholders}) RETURNING *`, params)
      await query(`INSERT INTO logs_sistema (usuario_id, administradora_id, nivel, modulo, acao, mensagem, detalhes) VALUES ($1,$2,'INFO','SQL Manager','INSERT','Inserção pelo grid',$3::jsonb)`, [user.id, user.administradora_id, JSON.stringify({ table: metadata.table })]).catch(() => [])
      return NextResponse.json({ success: true, operation, row: rows[0], message: "Registro inserido com sucesso." }, { status: 201 })
    }

    const key = body.primaryKeyValue
    if (key === undefined || key === null || key === "") return reject("A chave primária é obrigatória.")
    const updateEntries = entries.filter(([column]) => column !== primaryKey)
    if (!updateEntries.length) return reject("A chave primária não pode ser alterada pelo grid.")
    const params = updateEntries.map(([, value]) => value === "NULL" ? null : value)
    const setClause = updateEntries.map(([column], index) => `${quoteIdentifier(column)} = $${index + 1}`).join(", ")
    const rows = await query<Record<string, unknown>>(`UPDATE ${quoteIdentifier(metadata.table)} SET ${setClause} WHERE ${quoteIdentifier(primaryKey)} = $${params.length + 1} RETURNING *`, [...params, key])
    if (!rows.length) return reject("Registro não encontrado.", 404)
    await query(`INSERT INTO logs_sistema (usuario_id, administradora_id, nivel, modulo, acao, mensagem, detalhes) VALUES ($1,$2,'INFO','SQL Manager','UPDATE','Atualização pelo grid',$3::jsonb)`, [user.id, user.administradora_id, JSON.stringify({ table: metadata.table, primaryKey })]).catch(() => [])
    return NextResponse.json({ success: true, operation, row: rows[0], message: "Registro atualizado com sucesso." })
  } catch (error) {
    console.error("[v0] SQL Manager mutation error:", error)
    if (error instanceof Error && (error.message === "UNAUTHORIZED" || error.message === "FORBIDDEN")) return accessError(error)
    return reject(error instanceof Error ? error.message : "Não foi possível alterar o registro.", 400)
  }
}
