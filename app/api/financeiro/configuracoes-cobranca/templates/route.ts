import { type NextRequest, NextResponse } from "next/server"
import { getAuthContext } from "@/lib/api-auth"
import { query } from "@/lib/database"

export async function GET(request: NextRequest) {
  const auth = await getAuthContext()
  if (!auth) return NextResponse.json({ error: "Não autenticado" }, { status: 401 })
  const configuracaoId = Number(request.nextUrl.searchParams.get("configuracao_id"))
  const params: unknown[] = [auth.administradoraId]
  const where = configuracaoId ? " AND configuracao_id = $2" : ""
  if (configuracaoId) params.push(configuracaoId)
  return NextResponse.json({ data: await query(`SELECT * FROM templates_arquivos_bancarios WHERE administradora_id = $1 AND ativo = true${where} ORDER BY meio, tipo, layout`, params) })
}

export async function POST(request: NextRequest) {
  const auth = await getAuthContext()
  if (!auth) return NextResponse.json({ error: "Não autenticado" }, { status: 401 })
  const body = await request.json()
  const required = ["configuracao_id", "tipo", "meio", "layout"]
  if (required.some((key) => !body[key])) return NextResponse.json({ error: "Configuração, tipo, meio e layout são obrigatórios" }, { status: 422 })
  const config = await query("SELECT id FROM configuracoes_cobranca WHERE id = $1 AND administradora_id = $2 AND ativo = true AND deleted_at IS NULL", [body.configuracao_id, auth.administradoraId])
  if (!config.length) return NextResponse.json({ error: "Configuração não encontrada" }, { status: 404 })
  const rows = await query("INSERT INTO templates_arquivos_bancarios (configuracao_id, administradora_id, tipo, meio, layout, versao, encoding, delimitador, template) VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9) RETURNING *", [body.configuracao_id, auth.administradoraId, body.tipo, body.meio, body.layout, body.versao || "1.0", body.encoding || "UTF-8", body.delimitador || null, JSON.stringify(body.template || {})])
  return NextResponse.json({ data: rows[0] }, { status: 201 })
}

export async function DELETE(request: NextRequest) {
  const auth = await getAuthContext()
  if (!auth) return NextResponse.json({ error: "Não autenticado" }, { status: 401 })
  const id = Number(request.nextUrl.searchParams.get("id"))
  const rows = await query("UPDATE templates_arquivos_bancarios SET ativo = false, updated_at = NOW() WHERE id = $1 AND administradora_id = $2 RETURNING id", [id, auth.administradoraId])
  if (!rows.length) return NextResponse.json({ error: "Template não encontrado" }, { status: 404 })
  return NextResponse.json({ message: "Template desativado" })
}
