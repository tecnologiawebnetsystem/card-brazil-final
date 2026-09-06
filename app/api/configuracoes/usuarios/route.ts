import { NextRequest, NextResponse } from "next/server"
import bcrypt from "bcryptjs"
import { query } from "@/lib/database"

const publicFields = `id, administradora_id, nome_completo AS nome, email, cpf, telefone, foto_perfil_url AS avatar_url, tipo_usuario AS perfil, ultimo_acesso, status, created_at`

export async function GET() {
  try {
    const users = await query(`SELECT ${publicFields} FROM usuarios WHERE deleted_at IS NULL ORDER BY nome_completo ASC NULLS LAST`)
    return NextResponse.json(users)
  } catch { return NextResponse.json({ error: "Não foi possível carregar os usuários." }, { status: 500 }) }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    if (!body.nome_completo || !body.email || !body.senha || !body.tipo_usuario) return NextResponse.json({ error: "Nome, e-mail, senha e perfil são obrigatórios." }, { status: 400 })
    if (String(body.senha).length < 12) return NextResponse.json({ error: "A senha deve conter pelo menos 12 caracteres." }, { status: 400 })
    const hash = await bcrypt.hash(body.senha, 12)
    const rows = await query(`INSERT INTO usuarios (administradora_id, nome_completo, email, senha_hash, cpf, telefone, tipo_usuario, status) VALUES ($1,$2,$3,$4,$5,$6,$7,$8) RETURNING ${publicFields}`, [body.administradora_id || 1, body.nome_completo, body.email, hash, body.cpf || null, body.telefone || null, body.tipo_usuario, body.status || "ativo"])
    return NextResponse.json(rows[0], { status: 201 })
  } catch (error: any) { return NextResponse.json({ error: error.code === "23505" ? "E-mail ou CPF já cadastrado." : "Não foi possível criar o usuário." }, { status: error.code === "23505" ? 409 : 500 }) }
}

export async function PATCH(request: NextRequest) {
  try {
    const body = await request.json()
    if (!body.id || !body.nome_completo || !body.email || !body.tipo_usuario) return NextResponse.json({ error: "Dados obrigatórios não informados." }, { status: 400 })
    const values: unknown[] = [body.nome_completo, body.email, body.tipo_usuario, body.status === "inativo" ? "inativo" : "ativo", body.id]
    let passwordSql = ""
    if (body.senha) { if (String(body.senha).length < 12) return NextResponse.json({ error: "A senha deve conter pelo menos 12 caracteres." }, { status: 400 }); values.splice(4, 0, await bcrypt.hash(body.senha, 12)); passwordSql = ", senha_hash = $5" }
    const idPosition = values.length
    const rows = await query(`UPDATE usuarios SET nome_completo=$1, email=$2, tipo_usuario=$3, status=$4${passwordSql}, updated_at=CURRENT_TIMESTAMP WHERE id=$${idPosition} AND deleted_at IS NULL RETURNING ${publicFields}`, values)
    return rows[0] ? NextResponse.json(rows[0]) : NextResponse.json({ error: "Usuário não encontrado." }, { status: 404 })
  } catch { return NextResponse.json({ error: "Não foi possível atualizar o usuário." }, { status: 500 }) }
}

export async function DELETE(request: NextRequest) {
  try { const id = Number(request.nextUrl.searchParams.get("id")); if (!id) return NextResponse.json({ error: "ID inválido." }, { status: 400 }); await query("UPDATE usuarios SET deleted_at=CURRENT_TIMESTAMP, status='inativo', updated_at=CURRENT_TIMESTAMP WHERE id=$1", [id]); return NextResponse.json({ success: true }) } catch { return NextResponse.json({ error: "Não foi possível excluir o usuário." }, { status: 500 }) }
}
