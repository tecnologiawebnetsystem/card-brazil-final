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
      SELECT
        c.ordinal_position,
        c.column_name,
        c.data_type,
        c.udt_name,
        c.is_nullable,
        c.column_default,
        c.character_maximum_length,
        EXISTS (
          SELECT 1
          FROM pg_constraint pc
          JOIN pg_attribute pa ON pa.attrelid = pc.conrelid AND pa.attnum = ANY(pc.conkey)
          WHERE pc.contype = 'p'
            AND pc.conrelid = to_regclass(format('%I.%I', c.table_schema, c.table_name))
            AND pa.attname = c.column_name
        ) AS is_primary_key,
        EXISTS (
          SELECT 1
          FROM pg_constraint pc
          JOIN pg_attribute pa ON pa.attrelid = pc.conrelid AND pa.attnum = ANY(pc.conkey)
          WHERE pc.contype = 'f'
            AND pc.conrelid = to_regclass(format('%I.%I', c.table_schema, c.table_name))
            AND pa.attname = c.column_name
        ) AS is_foreign_key,
        (
          SELECT cl.relname
          FROM pg_constraint pc
          JOIN pg_class cl ON cl.oid = pc.confrelid
          JOIN pg_attribute pa ON pa.attrelid = pc.conrelid AND pa.attnum = ANY(pc.conkey)
          WHERE pc.contype = 'f'
            AND pc.conrelid = to_regclass(format('%I.%I', c.table_schema, c.table_name))
            AND pa.attname = c.column_name
          LIMIT 1
        ) AS references_table,
        (
          SELECT array_to_string(ARRAY(
            SELECT att.attname
            FROM pg_attribute att
            WHERE att.attrelid = pc.confrelid AND att.attnum = ANY(pc.confkey)
            ORDER BY array_position(pc.confkey, att.attnum)
          ), ', ')
          FROM pg_constraint pc
          JOIN pg_attribute pa ON pa.attrelid = pc.conrelid AND pa.attnum = ANY(pc.conkey)
          WHERE pc.contype = 'f'
            AND pc.conrelid = to_regclass(format('%I.%I', c.table_schema, c.table_name))
            AND pa.attname = c.column_name
          LIMIT 1
        ) AS references_column
      FROM information_schema.columns c
      WHERE c.table_schema = 'public' AND c.table_name = $1
      ORDER BY c.ordinal_position`, [table])
    const rows = await query(`SELECT * FROM "${table}" LIMIT 100`)
    return NextResponse.json({ success: true, table, columns, rows })
  } catch (error) { return accessError(error) }
}
