import { type NextRequest, NextResponse } from "next/server"
import { query } from "@/lib/database"

export async function PUT(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params; const body = await request.json()
  const rows = await query("UPDATE convenios SET codigo_convenio=$1, tipo_prestador=$2, especialidades=$3, data_inicio=$4, data_fim=$5, ativo=$6, updated_at=CURRENT_TIMESTAMP WHERE id=$7 RETURNING *", [body.codigo_convenio || null, body.tipo_prestador, body.especialidades || null, body.data_inicio || null, body.data_fim || null, body.ativo !== false, Number(id)])
  return rows.length ? NextResponse.json({ success: true, data: rows[0] }) : NextResponse.json({ success: false, message: "Convênio não encontrado" }, { status: 404 })
}
export async function DELETE(_: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params; const rows = await query("DELETE FROM convenios WHERE id=$1 RETURNING id", [Number(id)])
  return rows.length ? NextResponse.json({ success: true }) : NextResponse.json({ success: false, message: "Convênio não encontrado" }, { status: 404 })
}
