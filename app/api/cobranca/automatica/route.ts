import { NextResponse } from "next/server"
import { query } from "@/lib/database"
import { getAuthContext, apiAuthError } from "@/lib/api-auth"

export async function GET(request: Request) {
  try {
    const auth = await getAuthContext()
    if (!auth) return NextResponse.json({ error: "Não autenticado" }, { status: 401 })
    const { searchParams } = new URL(request.url)
    const status = searchParams.get("status")
    const rows = await query(
      `SELECT p.id, p.cobranca_id, p.numero_parcela, p.valor_total, p.valor_pago,
              p.data_vencimento, p.status, p.forma_pagamento, p.created_at
         FROM cobranca_parcelas p
        WHERE p.administradora_id = $1
          AND p.status IN ('pendente', 'emitida', 'vencida')
          AND ($2::text IS NULL OR p.status = $2)
        ORDER BY p.data_vencimento ASC
        LIMIT 200`,
      [auth.administradoraId, status],
    )
    return NextResponse.json({ data: rows, total: rows.length })
  } catch (error) {
    const authError = apiAuthError(error)
    if (authError) return NextResponse.json({ error: authError.message }, { status: authError.status })
    return NextResponse.json({ error: "Não foi possível carregar as cobranças programadas" }, { status: 500 })
  }
}
