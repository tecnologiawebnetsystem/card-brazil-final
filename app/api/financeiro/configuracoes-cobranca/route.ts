import { type NextRequest, NextResponse } from "next/server"
import { requireFinanceiroAccess } from "@/lib/api-auth"
import { recordCadastroAudit } from "@/lib/cadastro-audit"
import { query } from "@/lib/database"

export async function GET() {
  const { administradoraId, userId } = await requireFinanceiroAccess("view")
  const data = await query("SELECT * FROM configuracoes_cobranca WHERE administradora_id = $1 AND deleted_at IS NULL ORDER BY ativo DESC, nome", [administradoraId])
  return NextResponse.json({ data })
}

export async function POST(request: NextRequest) {
  const { administradoraId, userId } = await requireFinanceiroAccess("create")
  const body = await request.json()
  if (!String(body.nome || "").trim()) return NextResponse.json({ error: "Nome é obrigatório" }, { status: 422 })
  const rows = await query("INSERT INTO configuracoes_cobranca (administradora_id, nome, banco_codigo, agencia, conta, carteira, convenio, ambiente, ativo, preferencias) VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10) RETURNING *", [administradoraId, body.nome.trim(), body.banco_codigo || null, body.agencia || null, body.conta || null, body.carteira || null, body.convenio || null, body.ambiente || "homologacao", body.ativo !== false, JSON.stringify(body.preferencias || {})])
  await recordCadastroAudit({ administradoraId, userId, action: "create", tableName: "configuracoes_cobranca", recordId: rows[0].id, after: rows[0] })
  return NextResponse.json({ data: rows[0] }, { status: 201 })
}

export async function PATCH(request: NextRequest) {
  const { administradoraId, userId } = await requireFinanceiroAccess("edit")
  const body = await request.json()
  const id = Number(body.id)
  if (!Number.isInteger(id)) return NextResponse.json({ error: "id inválido" }, { status: 422 })
  const current = await query("SELECT * FROM configuracoes_cobranca WHERE id = $1 AND administradora_id = $2 AND deleted_at IS NULL", [id, administradoraId])
  const rows = await query("UPDATE configuracoes_cobranca SET nome = COALESCE($1,nome), banco_codigo = COALESCE($2,banco_codigo), agencia = COALESCE($3,agencia), conta = COALESCE($4,conta), carteira = COALESCE($5,carteira), convenio = COALESCE($6,convenio), ambiente = COALESCE($7,ambiente), ativo = COALESCE($8,ativo), preferencias = COALESCE($9,preferencias), updated_at = NOW() WHERE id = $10 AND administradora_id = $11 AND deleted_at IS NULL RETURNING *", [body.nome || null, body.banco_codigo || null, body.agencia || null, body.conta || null, body.carteira || null, body.convenio || null, body.ambiente || null, body.ativo ?? null, body.preferencias ? JSON.stringify(body.preferencias) : null, id, administradoraId])
  if (!rows.length) return NextResponse.json({ error: "Configuração não encontrada" }, { status: 404 })
  await recordCadastroAudit({ administradoraId, userId, action: "update", tableName: "configuracoes_cobranca", recordId: id, before: current[0], after: rows[0] })
  return NextResponse.json({ data: rows[0] })
}

export async function DELETE(request: NextRequest) {
  const { administradoraId, userId } = await requireFinanceiroAccess("delete")
  const id = Number(request.nextUrl.searchParams.get("id"))
  const rows = await query("UPDATE configuracoes_cobranca SET deleted_at = NOW(), ativo = false, updated_at = NOW() WHERE id = $1 AND administradora_id = $2 AND deleted_at IS NULL RETURNING id", [id, administradoraId])
  if (!rows.length) return NextResponse.json({ error: "Configuração não encontrada" }, { status: 404 })
  await recordCadastroAudit({ administradoraId, userId, action: "delete", tableName: "configuracoes_cobranca", recordId: id, before: { id }, after: { deleted_at: "CURRENT_TIMESTAMP", ativo: false } })
  return NextResponse.json({ message: "Configuração desativada" })
} 

export async function PUT(request: NextRequest) { return PATCH(request) }

export async function OPTIONS() { return NextResponse.json({ methods: ["GET", "POST", "PATCH", "PUT", "DELETE"] }) }

export const dynamic = "force-dynamic"

