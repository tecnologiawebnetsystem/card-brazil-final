import { type NextRequest, NextResponse } from "next/server"
import { query } from "@/lib/database"

export const dynamic = "force-dynamic"

export async function GET(request: NextRequest) {
  try {
    const params = new URLSearchParams(request.nextUrl.searchParams)
    const limit = Math.min(Math.max(Number.parseInt(params.get("limit") || "50", 10) || 50, 1), 100)
    const offset = Math.max(Number.parseInt(params.get("offset") || "0", 10) || 0, 0)
    const rows = await query(
      `SELECT id, plano_conta_id, centro_custo_id, numero_lancamento, data_lancamento, tipo, valor, historico, documento, origem, origem_id, status
       FROM lancamentos_contabeis ORDER BY data_lancamento DESC, id DESC LIMIT $1 OFFSET $2`,
      [limit, offset],
    )
    return NextResponse.json({ data: rows, pagination: { limit, offset, count: rows.length } })
  } catch (error) {
    console.error("[v0] Erro ao buscar lançamentos contábeis:", error)
    return NextResponse.json({ error: "Erro ao buscar lançamentos contábeis" }, { status: 500 })
  }
}
