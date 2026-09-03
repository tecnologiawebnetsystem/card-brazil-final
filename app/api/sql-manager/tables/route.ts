import { NextResponse } from "next/server"
import { query } from "@/lib/database"

export async function GET() {
  try {
    const tables = await query<{ table_name: string; row_count: number }>(`SELECT t.table_name, COALESCE(s.n_live_tup, 0)::int AS row_count FROM information_schema.tables t LEFT JOIN pg_stat_user_tables s ON s.relname = t.table_name WHERE t.table_schema = 'public' AND t.table_type = 'BASE TABLE' ORDER BY t.table_name`)
    return NextResponse.json({ success: true, tables })
  } catch (error) {
    console.error('[v0] SQL Manager tables error', error)
    return NextResponse.json({ error: 'Não foi possível carregar as tabelas.' }, { status: 500 })
  }
}
