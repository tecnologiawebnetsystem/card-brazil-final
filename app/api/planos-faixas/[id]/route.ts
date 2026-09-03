import { type NextRequest, NextResponse } from "next/server"
import { query } from "@/lib/database"

export async function PUT(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params; const body = await request.json()
  const rows = await query("UPDATE planos_faixas_etarias SET idade_minima=$1, idade_maxima=$2, valor=$3, updated_at=CURRENT_TIMESTAMP WHERE id=$4 RETURNING *", [body.idade_minima, body.idade_maxima, body.valor, Number(id)])
  return rows.length ? NextResponse.json({ success: true, data: rows[0] }) : NextResponse.json({ success: false, message: "Faixa não encontrada" }, { status: 404 })
}
export async function DELETE(_: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params; const rows = await query("DELETE FROM planos_faixas_etarias WHERE id=$1 RETURNING id", [Number(id)])
  return rows.length ? NextResponse.json({ success: true }) : NextResponse.json({ success: false, message: "Faixa não encontrada" }, { status: 404 })
}
