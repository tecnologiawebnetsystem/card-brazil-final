import { NextRequest, NextResponse } from "next/server"
import { query } from "@/lib/database"
import { accessError, getSqlKind, normalizeSql, requireSqlManagerAccess, safeIdentifier } from "@/lib/sql-manager-auth"

const READ = new Set(["SELECT", "SHOW", "DESCRIBE", "EXPLAIN"])
const WRITE = new Set(["INSERT", "UPDATE", "DELETE"])

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const sql = normalizeSql(typeof body.sql === "string" ? body.sql : "")
    const kind = getSqlKind(sql)
    if (!sql || (!READ.has(kind) && !WRITE.has(kind))) return NextResponse.json({ success: false, error: "Use apenas SELECT, SHOW, DESCRIBE, EXPLAIN, INSERT, UPDATE ou DELETE." }, { status: 400 })
    if (sql.includes(";") || /\b(DROP|TRUNCATE|ALTER|CREATE|GRANT|REVOKE|COPY|VACUUM)\b/i.test(sql)) return NextResponse.json({ success: false, error: "Comando bloqueado por segurança." }, { status: 403 })
    if (WRITE.has(kind)) {
      const user = await requireSqlManagerAccess()
      if (body.confirmWrite !== true) return NextResponse.json({ success: false, error: "Confirme a operação de alteração de dados." }, { status: 400 })
      const started = Date.now()
      const rows = await query<Record<string, unknown>>(sql)
      await query(`INSERT INTO logs_sistema (usuario_id, administradora_id, nivel, modulo, acao, mensagem, detalhes) VALUES ($1,$2,'INFO','SQL Manager',$3,$4,$5::jsonb)`, [user.id, user.administradora_id, kind, `Execução SQL: ${kind}`, JSON.stringify({ sql, rows: rows.length })]).catch(() => [])
      return NextResponse.json({ success: true, columns: rows[0] ? Object.keys(rows[0]) : [], rows, affectedRows: rows.length, executionTime: Date.now() - started })
    }
    if (kind === "SELECT" && !/\blimit\b/i.test(sql)) return NextResponse.json({ success: false, error: "Inclua LIMIT na consulta SELECT." }, { status: 400 })
    const started = Date.now()
    const rows = await query<Record<string, unknown>>(sql)
    return NextResponse.json({ success: true, columns: rows[0] ? Object.keys(rows[0]) : [], rows, affectedRows: rows.length, executionTime: Date.now() - started })
  } catch (error) { console.error("[v0] SQL Manager query error:", error); return error instanceof Error && error.message !== "UNAUTHORIZED" && error.message !== "FORBIDDEN" ? NextResponse.json({ success: false, error: "Erro ao executar SQL. Verifique a sintaxe e os campos." }, { status: 400 }) : accessError(error) }
}

export async function GET(request: NextRequest) {
  try {
    const table = safeIdentifier(request.nextUrl.searchParams.get("table") || "")
    if (!table) return NextResponse.json({ success: false, error: "Tabela inválida." }, { status: 400 })
    const columns = await query(`
      SELECT c.ordinal_position, c.column_name, c.data_type, c.udt_name,
             c.is_nullable, c.column_default, c.character_maximum_length,
             CASE WHEN pk.column_name IS NOT NULL THEN true ELSE false END AS is_primary_key,
             CASE WHEN fk.column_name IS NOT NULL THEN true ELSE false END AS is_foreign_key,
             fk.foreign_table_name AS references_table,
             fk.foreign_column_name AS references_column
      FROM information_schema.columns c
      LEFT JOIN (
        SELECT kcu.table_name, kcu.column_name
        FROM information_schema.table_constraints tc
        JOIN information_schema.key_column_usage kcu
          ON tc.constraint_name = kcu.constraint_name AND tc.table_schema = kcu.table_schema
        WHERE tc.table_schema = 'public' AND tc.constraint_type = 'PRIMARY KEY'
      ) pk ON pk.table_name = c.table_name AND pk.column_name = c.column_name
      LEFT JOIN (
        SELECT kcu.table_name, kcu.column_name,
               ccu.table_name AS foreign_table_name, ccu.column_name AS foreign_column_name
        FROM information_schema.table_constraints tc
        JOIN information_schema.key_column_usage kcu
          ON tc.constraint_name = kcu.constraint_name AND tc.table_schema = kcu.table_schema
        JOIN information_schema.constraint_column_usage ccu
          ON ccu.constraint_name = tc.constraint_name AND ccu.table_schema = tc.table_schema
        WHERE tc.table_schema = 'public' AND tc.constraint_type = 'FOREIGN KEY'
      ) fk ON fk.table_name = c.table_name AND fk.column_name = c.column_name
      WHERE c.table_schema='public' AND c.table_name=$1
      ORDER BY c.ordinal_position`, [table])
    const rows = await query(`SELECT * FROM "${table}" LIMIT 100`)
    return NextResponse.json({ success: true, table, columns, rows })
  } catch (error) { return accessError(error) }
}
