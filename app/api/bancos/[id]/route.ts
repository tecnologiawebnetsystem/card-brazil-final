import { type NextRequest, NextResponse } from "next/server"
import { query } from "@/lib/database"
import { requireCadastroAccess, apiAuthError } from "@/lib/api-auth"

export async function GET(_: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { administradoraId } = await requireCadastroAccess("view")
    const rows = await query("SELECT * FROM bancos WHERE id = $1 AND administradora_id = $2", [Number((await params).id), administradoraId])
    return rows[0] ? NextResponse.json(rows[0]) : NextResponse.json({ error: "Banco não encontrado" }, { status: 404 })
  } catch (error) {
    const auth = apiAuthError(error)
    return NextResponse.json(auth ? { error: auth.message } : { error: error instanceof Error ? error.message : "Erro interno" }, { status: auth?.status || 500 })
  }
}

export async function PUT(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { administradoraId } = await requireCadastroAccess("update")
    const body = await request.json()
    const id = Number((await params).id)
    const rows = await query(
      `UPDATE bancos SET codigo = $1, nome = $2, nome_curto = $3, tipo = $4, cnpj = $5, site = $6, telefone = $7, email = $8, status = $9, ativo = $10, updated_at = NOW()
       WHERE id = $11 AND administradora_id = $12 RETURNING *`,
      [String(body.codigo || "").trim(), String(body.nome || "").trim(), body.nome_curto || null, body.tipo || null, body.cnpj || null, body.site || null, body.telefone || null, body.email || null, body.status || "Ativo", body.status !== "Inativo", id, administradoraId],
    )
    return rows[0] ? NextResponse.json(rows[0]) : NextResponse.json({ error: "Banco não encontrado" }, { status: 404 })
  } catch (error) {
    const auth = apiAuthError(error)
    return NextResponse.json(auth ? { error: auth.message } : { error: error instanceof Error ? error.message : "Erro interno" }, { status: auth?.status || 500 })
  }
}

export async function DELETE(_: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { administradoraId } = await requireCadastroAccess("delete")
    const rows = await query("DELETE FROM bancos WHERE id = $1 AND administradora_id = $2 RETURNING id", [Number((await params).id), administradoraId])
    return rows[0] ? NextResponse.json({ message: "Banco excluído com sucesso" }) : NextResponse.json({ error: "Banco não encontrado" }, { status: 404 })
  } catch (error) {
    const auth = apiAuthError(error)
    return NextResponse.json(auth ? { error: auth.message } : { error: error instanceof Error ? error.message : "Erro interno" }, { status: auth?.status || 500 })
  }
}
