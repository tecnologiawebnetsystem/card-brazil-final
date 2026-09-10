import { type NextRequest, NextResponse } from "next/server"
import { getAuthContext } from "@/lib/api-auth"
import { query } from "@/lib/database"

export async function GET(request: NextRequest) {
  const auth = await getAuthContext()
  if (!auth) return NextResponse.json({ error: "Não autenticado" }, { status: 401 })
  const from = request.nextUrl.searchParams.get("from") || "1900-01-01"
  const to = request.nextUrl.searchParams.get("to") || "2999-12-31"
  const data = await query(
    `SELECT DATE(data_pagamento) AS data, COUNT(*)::int AS registros_conciliados, COALESCE(SUM(valor_pago), 0)::numeric AS total_sistema FROM cobranca_pagamentos WHERE administradora_id = $1 AND data_pagamento::date BETWEEN $2::date AND $3::date AND status = 'confirmado' GROUP BY DATE(data_pagamento) ORDER BY data DESC`,
    [auth.administradoraId, from, to],
  )
  return NextResponse.json({ data })
}
