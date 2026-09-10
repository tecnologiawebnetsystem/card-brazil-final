import { type NextRequest, NextResponse } from "next/server"
import { getAuthContext } from "@/lib/api-auth"
import { query } from "@/lib/database"

export async function GET(request: NextRequest) {
  const auth = await getAuthContext()
  if (!auth) return NextResponse.json({ error: "Não autenticado" }, { status: 401 })
  const from = request.nextUrl.searchParams.get("from") || "1900-01-01"
  const to = request.nextUrl.searchParams.get("to") || "2999-12-31"
  const rows = await query(
    `SELECT COUNT(*)::int AS total, COALESCE(SUM(valor_original), 0)::numeric AS faturado, COALESCE(SUM(CASE WHEN status IN ('paga','encerrada') THEN valor_atual ELSE 0 END), 0)::numeric AS recebido, COALESCE(SUM(CASE WHEN status NOT IN ('paga','encerrada') THEN valor_atual ELSE 0 END), 0)::numeric AS aberto, COUNT(*) FILTER (WHERE status = 'pendente' AND data_fim < CURRENT_DATE)::int AS vencidas FROM cobrancas WHERE administradora_id = $1 AND deleted_at IS NULL AND data_inicio BETWEEN $2::date AND $3::date`,
    [auth.administradoraId, from, to],
  )
  const summary = rows[0] || { total: 0, faturado: 0, recebido: 0, aberto: 0, vencidas: 0 }
  const faturado = Number(summary.faturado || 0)
  return NextResponse.json({ data: { ...summary, taxa_recebimento: faturado ? Number(((Number(summary.recebido) / faturado) * 100).toFixed(2)) : 0 }, periodo: { from, to } })
}
