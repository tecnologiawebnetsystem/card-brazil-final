import { type NextRequest, NextResponse } from "next/server"
import { query } from "@/lib/database"

export async function GET(request: NextRequest) {
  const operadoraId = request.nextUrl.searchParams.get("operadora_id")
  const params = operadoraId ? [Number(operadoraId)] : []
  const where = operadoraId ? " WHERE c.operadora_id = $1" : ""
  const rows = await query(`SELECT c.*, p.nome AS pessoa_nome FROM convenios c JOIN pessoas p ON p.id = c.pessoa_id${where} ORDER BY c.created_at DESC`, params)
  return NextResponse.json({ success: true, data: rows })
}

export async function POST(request: NextRequest) {
  const body = await request.json()
  if (!body.operadora_id || !body.pessoa_id || !body.tipo_prestador) return NextResponse.json({ success: false, message: "operadora_id, pessoa_id e tipo_prestador são obrigatórios" }, { status: 400 })
  const rows = await query("INSERT INTO convenios (operadora_id, pessoa_id, codigo_convenio, tipo_prestador, especialidades, data_inicio, data_fim, ativo) VALUES ($1,$2,$3,$4,$5,$6,$7,$8) RETURNING *", [body.operadora_id, body.pessoa_id, body.codigo_convenio || null, body.tipo_prestador, body.especialidades || null, body.data_inicio || null, body.data_fim || null, body.ativo !== false])
  return NextResponse.json({ success: true, data: rows[0] }, { status: 201 })
}
