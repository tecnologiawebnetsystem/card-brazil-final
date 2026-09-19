import { type NextRequest, NextResponse } from "next/server"
import { query } from "@/lib/database"
import { getAuthContext } from "@/lib/api-auth"

export async function GET(request: NextRequest) {
  const auth = await getAuthContext()
  if (!auth) return NextResponse.json({ error: "Não autenticado" }, { status: 401 })
  const propostaId = Number(request.nextUrl.searchParams.get("proposta_id"))
  if (!Number.isInteger(propostaId)) return NextResponse.json({ error: "proposta_id inválido" }, { status: 422 })
  const rows = await query("SELECT * FROM proposta_saude_itens WHERE proposta_id = $1 AND administradora_id = $2 AND deleted_at IS NULL ORDER BY tipo_beneficiario, nome", [propostaId, auth.administradoraId])
  return NextResponse.json({ data: rows })
}

export async function POST(request: NextRequest) {
  const auth = await getAuthContext()
  if (!auth) return NextResponse.json({ error: "Não autenticado" }, { status: 401 })
  const body = await request.json()
  if (!body.proposta_id || !body.nome || !["titular", "dependente"].includes(body.tipo_beneficiario)) return NextResponse.json({ error: "proposta_id, nome e tipo_beneficiario são obrigatórios" }, { status: 422 })
  const rows = await query("INSERT INTO proposta_saude_itens (administradora_id, proposta_id, tipo_beneficiario, nome, cpf, data_nascimento, parentesco, valor_mensal) VALUES ($1,$2,$3,$4,$5,$6,$7,$8) RETURNING *", [auth.administradoraId, body.proposta_id, body.tipo_beneficiario, body.nome, body.cpf || null, body.data_nascimento || null, body.parentesco || null, Number(body.valor_mensal || 0)])
  return NextResponse.json({ data: rows[0], message: "Beneficiário incluído na proposta" }, { status: 201 })
}

export async function DELETE(request: NextRequest) {
  const auth = await getAuthContext()
  if (!auth) return NextResponse.json({ error: "Não autenticado" }, { status: 401 })
  const id = Number(request.nextUrl.searchParams.get("id"))
  const rows = await query("UPDATE proposta_saude_itens SET deleted_at = NOW(), updated_at = NOW() WHERE id = $1 AND administradora_id = $2 AND deleted_at IS NULL RETURNING id", [id, auth.administradoraId])
  if (!rows.length) return NextResponse.json({ error: "Beneficiário não encontrado" }, { status: 404 })
  return NextResponse.json({ success: true })
}
