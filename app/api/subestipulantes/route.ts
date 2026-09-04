import { type NextRequest, NextResponse } from "next/server"
import { query } from "@/lib/database"

export async function GET(request: NextRequest) {
  try {
    const search = request.nextUrl.searchParams.get("search") || ""
    const status = request.nextUrl.searchParams.get("status") || ""
    const params: unknown[] = []
    const conditions = ["deleted_at IS NULL"]
    if (search) { params.push(`%${search}%`); conditions.push(`(nome ILIKE $${params.length} OR estipulante ILIKE $${params.length} OR contrato ILIKE $${params.length} OR responsavel ILIKE $${params.length})`) }
    if (status) { params.push(status); conditions.push(`status = $${params.length}`) }
    const rows = await query(`SELECT * FROM subestipulantes WHERE ${conditions.join(" AND ")} ORDER BY created_at DESC, id DESC`, params)
    return NextResponse.json({ success: true, data: rows })
  } catch (error: any) { return NextResponse.json({ success: false, error: error.message }, { status: 500 }) }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const required = ["nome", "estipulante", "contrato", "responsavel"]
    if (required.some((field) => !String(body[field] || "").trim())) return NextResponse.json({ success: false, error: "Preencha os campos obrigatórios" }, { status: 400 })
    const rows = await query(`INSERT INTO subestipulantes (administradora_id, nome, estipulante, contrato, status, segurados, responsavel, telefone) VALUES ($1,$2,$3,$4,$5,$6,$7,$8) RETURNING *`, [body.administradora_id || 1, body.nome, body.estipulante, body.contrato, body.status || "Ativo", Number(body.segurados) || 0, body.responsavel, body.telefone || null])
    return NextResponse.json({ success: true, data: rows[0] }, { status: 201 })
  } catch (error: any) { return NextResponse.json({ success: false, error: error.message }, { status: 500 }) }
}
