import { type NextRequest, NextResponse } from "next/server"
import { query } from "@/lib/database"
import { apiAuthError, requireCadastroAccess } from "@/lib/api-auth"

export async function GET(_: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { administradoraId } = await requireCadastroAccess("view")
    const { id } = await params
    const rows = await query("SELECT * FROM subestipulantes WHERE id = $1 AND administradora_id = $2 AND deleted_at IS NULL", [Number(id), administradoraId])
    return rows[0] ? NextResponse.json({ success: true, data: rows[0] }) : NextResponse.json({ success: false, error: "Subestipulante não encontrado" }, { status: 404 })
  } catch (error: any) {
    const auth = apiAuthError(error)
    return NextResponse.json({ success: false, error: auth?.message || error.message }, { status: auth?.status || 500 })
  }
}

export async function PUT(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { administradoraId } = await requireCadastroAccess("edit")
    const { id } = await params
    const body = await request.json()
    const allowed = ["nome", "estipulante", "contrato", "status", "segurados", "responsavel", "telefone"]
    const entries = Object.entries(body).filter(([key]) => allowed.includes(key))
    if (!entries.length) return NextResponse.json({ success: false, error: "Nenhum campo válido para atualizar" }, { status: 400 })
    const values = entries.map(([, value]) => value)
    const updates = entries.map(([key], index) => `${key} = $${index + 1}`)
    values.push(Number(id), administradoraId)
    const rows = await query(`UPDATE subestipulantes SET ${updates.join(", ")}, updated_at = CURRENT_TIMESTAMP WHERE id = $${values.length - 1} AND administradora_id = $${values.length} AND deleted_at IS NULL RETURNING *`, values)
    return rows[0] ? NextResponse.json({ success: true, data: rows[0] }) : NextResponse.json({ success: false, error: "Subestipulante não encontrado" }, { status: 404 })
  } catch (error: any) {
    const auth = apiAuthError(error)
    return NextResponse.json({ success: false, error: auth?.message || error.message }, { status: auth?.status || 500 })
  }
}

export async function DELETE(_: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { administradoraId } = await requireCadastroAccess("delete")
    const { id } = await params
    const rows = await query("UPDATE subestipulantes SET deleted_at = CURRENT_TIMESTAMP, updated_at = CURRENT_TIMESTAMP WHERE id = $1 AND administradora_id = $2 AND deleted_at IS NULL RETURNING id", [Number(id), administradoraId])
    return rows[0] ? NextResponse.json({ success: true, message: "Subestipulante excluído com sucesso" }) : NextResponse.json({ success: false, error: "Subestipulante não encontrado" }, { status: 404 })
  } catch (error: any) {
    const auth = apiAuthError(error)
    return NextResponse.json({ success: false, error: auth?.message || error.message }, { status: auth?.status || 500 })
  }
}
