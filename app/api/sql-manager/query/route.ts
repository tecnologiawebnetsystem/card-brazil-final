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
    const columns = await query(`SELECT column_name, data_type, is_nullable, column_default, character_maximum_length FROM information_schema.columns WHERE table_schema='public' AND table_name=$1 ORDER BY ordinal_position`, [table])
    const rows = await query(`SELECT * FROM "${table}" LIMIT 100`)
    return NextResponse.json({ success: true, table, columns, rows })
  } catch (error) { return accessError(error) }
}
