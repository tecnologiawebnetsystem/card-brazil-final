import { type NextRequest, NextResponse } from "next/server"
import { getAuthContext } from "@/lib/api-auth"
import { query } from "@/lib/database"

export async function GET() {
  const auth = await getAuthContext()
  if (!auth) return NextResponse.json({ error: "Não autenticado" }, { status: 401 })
  const data = await query("SELECT * FROM configuracoes_cobranca WHERE administradora_id = $1 AND deleted_at IS NULL ORDER BY ativo DESC, nome", [auth.administradoraId])
  return NextResponse.json({ data })
}

export async function POST(request: NextRequest) {
  const auth = await getAuthContext()
  if (!auth) return NextResponse.json({ error: "Não autenticado" }, { status: 401 })
  const body = await request.json()
  if (!String(body.nome || "").trim()) return NextResponse.json({ error: "Nome é obrigatório" }, { status: 422 })
  const rows = await query("INSERT INTO configuracoes_cobranca (administradora_id, nome, banco_codigo, agencia, conta, carteira, convenio, ambiente, ativo, preferencias) VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10) RETURNING *", [auth.administradoraId, body.nome.trim(), body.banco_codigo || null, body.agencia || null, body.conta || null, body.carteira || null, body.convenio || null, body.ambiente || "homologacao", body.ativo !== false, JSON.stringify(body.preferencias || {})])
  return NextResponse.json({ data: rows[0] }, { status: 201 })
}

export async function PATCH(request: NextRequest) {
  const auth = await getAuthContext()
  if (!auth) return NextResponse.json({ error: "Não autenticado" }, { status: 401 })
  const body = await request.json()
  const id = Number(body.id)
  if (!Number.isInteger(id)) return NextResponse.json({ error: "id inválido" }, { status: 422 })
  const rows = await query("UPDATE configuracoes_cobranca SET nome = COALESCE($1,nome), banco_codigo = COALESCE($2,banco_codigo), agencia = COALESCE($3,agencia), conta = COALESCE($4,conta), carteira = COALESCE($5,carteira), convenio = COALESCE($6,convenio), ambiente = COALESCE($7,ambiente), ativo = COALESCE($8,ativo), preferencias = COALESCE($9,preferencias), updated_at = NOW() WHERE id = $10 AND administradora_id = $11 AND deleted_at IS NULL RETURNING *", [body.nome || null, body.banco_codigo || null, body.agencia || null, body.conta || null, body.carteira || null, body.convenio || null, body.ambiente || null, body.ativo ?? null, body.preferencias ? JSON.stringify(body.preferencias) : null, id, auth.administradoraId])
  if (!rows.length) return NextResponse.json({ error: "Configuração não encontrada" }, { status: 404 })
  return NextResponse.json({ data: rows[0] })
}

export async function DELETE(request: NextRequest) {
  const auth = await getAuthContext()
  if (!auth) return NextResponse.json({ error: "Não autenticado" }, { status: 401 })
  const id = Number(request.nextUrl.searchParams.get("id"))
  const rows = await query("UPDATE configuracoes_cobranca SET deleted_at = NOW(), ativo = false, updated_at = NOW() WHERE id = $1 AND administradora_id = $2 AND deleted_at IS NULL RETURNING id", [id, auth.administradoraId])
  if (!rows.length) return NextResponse.json({ error: "Configuração não encontrada" }, { status: 404 })
  return NextResponse.json({ message: "Configuração desativada" })
} 

export async function PUT(request: NextRequest) { return PATCH(request) }

export async function OPTIONS() { return NextResponse.json({ methods: ["GET", "POST", "PATCH", "PUT", "DELETE"] }) }

export const dynamic = "force-dynamic"

type TemplateBody = { configuracao_id: number; tipo: string; meio: string; layout: string; versao?: string; encoding?: string; delimitador?: string; template?: Record<string, unknown> }
export async function createTemplate(authId: number, body: TemplateBody) {
  return query("INSERT INTO templates_arquivos_bancarios (configuracao_id, administradora_id, tipo, meio, layout, versao, encoding, delimitador, template) VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9) RETURNING *", [body.configuracao_id, authId, body.tipo, body.meio, body.layout, body.versao || "1.0", body.encoding || "UTF-8", body.delimitador || null, JSON.stringify(body.template || {})])
} 
