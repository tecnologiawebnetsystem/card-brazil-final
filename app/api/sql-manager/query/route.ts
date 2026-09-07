import { NextRequest, NextResponse } from "next/server"
import { query } from "@/lib/database"
import { accessError, getSqlKind, normalizeSql, requireSqlManagerAccess, safeIdentifier } from "@/lib/sql-manager-auth"

const READ = new Set(["SELECT", "SHOW", "DESCRIBE", "EXPLAIN"])
const WRITE = new Set(["INSERT", "UPDATE", "DELETE"])
const MAX_ROWS = 500
const MAX_SQL_LENGTH = 20_000

function reject(message: string, status = 400) {
  return NextResponse.json({ success: false, error: message }, { status })
}

function validateSql(sql: string, kind: string) {
  if (!sql) return "Informe uma consulta SQL."
  if (sql.length > MAX_SQL_LENGTH) return `A consulta não pode ultrapassar ${MAX_SQL_LENGTH.toLocaleString("pt-BR")} caracteres.`
  if (sql.includes(";") || /(--|\/\*|\*\/)/.test(sql)) return "Múltiplas instruções e comentários SQL não são permitidos."
  if (!READ.has(kind) && !WRITE.has(kind)) return "Use apenas SELECT, SHOW, DESCRIBE, EXPLAIN, INSERT, UPDATE ou DELETE."
  if (/\b(DROP|TRUNCATE|ALTER|CREATE|GRANT|REVOKE|COPY|VACUUM|SET|RESET|DO|CALL)\b/i.test(sql)) return "Esse comando está bloqueado por segurança."
  if (READ.has(kind) && /\b(SELECT|SHOW|DESCRIBE|EXPLAIN)\b/i.test(sql) && kind === "SELECT") {
    const match = sql.match(/\bLIMIT\s+(\d+)/i)
    if (!match) return "Inclua LIMIT na consulta SELECT."
    if (Number(match[1]) > MAX_ROWS) return `O LIMIT máximo é ${MAX_ROWS}.`
  }
  if ((kind === "UPDATE" || kind === "DELETE") && !/\bWHERE\b/i.test(sql)) return `${kind} exige uma cláusula WHERE.`
  if (kind === "INSERT" && !/\bINTO\s+[a-zA-Z_][a-zA-Z0-9_]*\b/i.test(sql)) return "Informe uma tabela válida no INSERT."
  return null
}

async function audit(user: Awaited<ReturnType<typeof requireSqlManagerAccess>>, kind: string, sql: string, duration: number, rows: number) {
  await query(
    `INSERT INTO logs_sistema (usuario_id, administradora_id, nivel, modulo, acao, mensagem, detalhes)
     VALUES ($1,$2,'INFO','SQL Manager',$3,$4,$5::jsonb)`,
    [user.id, user.administradora_id, kind, `Execução SQL: ${kind}`, JSON.stringify({ sql: sql.slice(0, 2000), rows, duration })],
  ).catch(() => [])
}

export async function POST(request: NextRequest) {
  let user: Awaited<ReturnType<typeof requireSqlManagerAccess>> | null = null
  try {
    user = await requireSqlManagerAccess()
    const body = await request.json()
    const sql = normalizeSql(typeof body.sql === "string" ? body.sql : "")
    const kind = getSqlKind(sql)
    const validationError = validateSql(sql, kind)
    if (validationError) return reject(validationError, validationError.includes("bloqueado") ? 403 : 400)
    const isWrite = WRITE.has(kind)
    if (isWrite && body.confirmWrite !== true) return reject("Confirme explicitamente a operação de alteração de dados.")
    const started = Date.now()
    const rows = await query<Record<string, unknown>>(sql)
    const executionTime = Date.now() - started
    await audit(user, kind, sql, executionTime, rows.length)
    return NextResponse.json({ success: true, columns: rows[0] ? Object.keys(rows[0]) : [], rows: rows.slice(0, MAX_ROWS), affectedRows: rows.length, executionTime, truncated: rows.length > MAX_ROWS, maxRows: MAX_ROWS })
  } catch (error) {
    console.error("[v0] SQL Manager query error:", error)
    return error instanceof Error && (error.message === "UNAUTHORIZED" || error.message === "FORBIDDEN") ? accessError(error) : reject("Erro ao executar SQL. Verifique a sintaxe e os campos.")
  }
}

export async function GET(request: NextRequest) {
  try {
    await requireSqlManagerAccess()
    const table = safeIdentifier(request.nextUrl.searchParams.get("table") || "")
    const page = Math.max(1, Number(request.nextUrl.searchParams.get("page") || 1))
    const pageSize = Math.min(MAX_ROWS, Math.max(10, Number(request.nextUrl.searchParams.get("pageSize") || 50)))
    if (!table) return reject("Tabela inválida.")
    const exists = await query<{ table_name: string }>(`SELECT table_name FROM information_schema.tables WHERE table_schema = 'public' AND table_type = 'BASE TABLE' AND table_name = $1`, [table])
    if (!exists.length) return reject("Tabela não encontrada.", 404)
    const offset = (page - 1) * pageSize
    const columns = await query(`SELECT c.column_name, c.data_type, c.udt_name, c.is_nullable, c.column_default,
      EXISTS (SELECT 1 FROM pg_constraint pc JOIN pg_attribute pa ON pa.attrelid = pc.conrelid AND pa.attnum = ANY(pc.conkey) WHERE pc.contype = 'p' AND pc.conrelid = to_regclass(format('%I.%I', c.table_schema, c.table_name)) AND pa.attname = c.column_name) AS is_primary_key,
      EXISTS (SELECT 1 FROM pg_constraint pc JOIN pg_attribute pa ON pa.attrelid = pc.conrelid AND pa.attnum = ANY(pc.conkey) WHERE pc.contype = 'f' AND pc.conrelid = to_regclass(format('%I.%I', c.table_schema, c.table_name)) AND pa.attname = c.column_name) AS is_foreign_key,
      (SELECT cl.relname FROM pg_constraint pc JOIN pg_class cl ON cl.oid = pc.confrelid JOIN pg_attribute pa ON pa.attrelid = pc.conrelid AND pa.attnum = ANY(pc.conkey) WHERE pc.contype = 'f' AND pc.conrelid = to_regclass(format('%I.%I', c.table_schema, c.table_name)) AND pa.attname = c.column_name LIMIT 1) AS references_table,
      (SELECT string_agg(att.attname, ', ' ORDER BY array_position(pc.confkey, att.attnum)) FROM pg_constraint pc JOIN pg_attribute pa ON pa.attrelid = pc.conrelid AND pa.attnum = ANY(pc.conkey) JOIN pg_attribute att ON att.attrelid = pc.confrelid AND att.attnum = ANY(pc.confkey) WHERE pc.contype = 'f' AND pc.conrelid = to_regclass(format('%I.%I', c.table_schema, c.table_name)) AND pa.attname = c.column_name) AS references_column
      FROM information_schema.columns c WHERE c.table_schema = 'public' AND c.table_name = $1 ORDER BY c.ordinal_position`, [table])
    const rows = await query(`SELECT * FROM "${table}" LIMIT ${pageSize} OFFSET ${offset}`)
    const estimate = await query<{ row_count: number }>(`SELECT COALESCE(n_live_tup, 0)::int AS row_count FROM pg_stat_user_tables WHERE schemaname = 'public' AND relname = $1`, [table])
    const totalRows = estimate[0]?.row_count ?? 0
    return NextResponse.json({ success: true, table, columns, rows, pagination: { page, pageSize, totalRows, estimated: true, hasNextPage: offset + rows.length < totalRows } })
  } catch (error) {
    return accessError(error)
  }
}
