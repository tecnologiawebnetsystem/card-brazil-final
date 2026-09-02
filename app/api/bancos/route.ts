import { type NextRequest, NextResponse } from "next/server"
import { query } from "@/lib/database"

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams
    const search = searchParams.get("search") || ""
    const tipo = searchParams.get("tipo") || ""
    const status = searchParams.get("status") || "Ativo"

    const params: unknown[] = []
    const conditions: string[] = []
    if (status) { params.push(status); conditions.push(`status = $${params.length}`) }
    if (tipo) { params.push(tipo); conditions.push(`tipo = $${params.length}`) }
    if (search) { params.push(`%${search}%`); conditions.push(`(codigo ILIKE $${params.length} OR nome ILIKE $${params.length} OR nome_curto ILIKE $${params.length})`) }
    const where = conditions.length ? ` WHERE ${conditions.join(" AND ")}` : ""
    const bancos = await query(`SELECT * FROM bancos${where} ORDER BY nome ASC`, params)
    return NextResponse.json(bancos)
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const rows = await query(`INSERT INTO bancos (administradora_id, codigo, nome, nome_curto, tipo, status) VALUES ($1,$2,$3,$4,$5,$6) RETURNING *`, [body.administradora_id || 1, body.codigo, body.nome, body.nome_curto || null, body.tipo || null, body.status || "Ativo"])
    return NextResponse.json(rows[0], { status: 201 })
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}
