import { type NextRequest, NextResponse } from "next/server"
import { query } from "@/lib/database"
import { requireCadastroAccess, apiAuthError } from "@/lib/api-auth"

export async function GET(request: NextRequest) {
  try {
    const { administradoraId } = await requireCadastroAccess("view")
    const searchParams = request.nextUrl.searchParams
    const search = searchParams.get("search") || ""
    const tipo = searchParams.get("tipo") || ""
    const status = searchParams.get("status") || "Ativo"
    const params: unknown[] = [administradoraId]
    const conditions = ["administradora_id = $1"]
    if (status) { params.push(status); conditions.push(`status = $${params.length}`) }
    if (tipo) { params.push(tipo); conditions.push(`tipo = $${params.length}`) }
    if (search) { params.push(`%${search}%`); conditions.push(`(codigo ILIKE $${params.length} OR nome ILIKE $${params.length} OR nome_curto ILIKE $${params.length})`) }
    const rows = await query(`SELECT * FROM bancos WHERE ${conditions.join(" AND ")} ORDER BY nome ASC`, params)
    return NextResponse.json(rows)
  } catch (error) {
    const auth = apiAuthError(error)
    return NextResponse.json(auth ? { error: auth.message } : { error: error instanceof Error ? error.message : "Erro interno" }, { status: auth?.status || 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const { administradoraId } = await requireCadastroAccess("create")
    const body = await request.json()
    if (!String(body.codigo || "").trim() || !String(body.nome || "").trim()) return NextResponse.json({ error: "Código e nome são obrigatórios" }, { status: 400 })
    const rows = await query(
      `INSERT INTO bancos (administradora_id, codigo, nome, nome_curto, tipo, cnpj, site, telefone, email, status, ativo) VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11) RETURNING *`,
      [administradoraId, String(body.codigo).trim(), String(body.nome).trim(), body.nome_curto || null, body.tipo || null, body.cnpj || null, body.site || null, body.telefone || null, body.email || null, body.status || "Ativo", body.status !== "Inativo"],
    )
    return NextResponse.json(rows[0], { status: 201 })
  } catch (error) {
    const auth = apiAuthError(error)
    return NextResponse.json(auth ? { error: auth.message } : { error: error instanceof Error ? error.message : "Erro interno" }, { status: auth?.status || 500 })
  }
}
