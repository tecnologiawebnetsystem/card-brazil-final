import { NextRequest, NextResponse } from "next/server"
import { query } from "@/lib/database"
import { requireCadastroAccess, apiAuthError } from "@/lib/api-auth"

export async function GET() {
  try {
    await requireCadastroAccess("view")
    const rows = await query("SELECT id, nome, descricao, modulo, ativo FROM permissoes WHERE deleted_at IS NULL ORDER BY modulo, nome")
    return NextResponse.json(rows)
  } catch (error: any) {
    const auth = apiAuthError(error)
    console.error("[v0] Erro ao carregar permissões", error)
    return NextResponse.json({ error: auth?.message || "Não foi possível carregar as permissões." }, { status: auth?.status || 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const { administradoraId } = await requireCadastroAccess("edit")
    const body = await request.json()
    const usuarioId = Number(body.usuarioId)
    const permissaoIds = Array.isArray(body.permissaoIds) ? body.permissaoIds.map(Number).filter(Number.isInteger) : []
    if (!Number.isInteger(usuarioId) || usuarioId <= 0) {
      return NextResponse.json({ error: "Usuário inválido." }, { status: 400 })
    }
    await query("DELETE FROM usuario_permissoes WHERE usuario_id = $1 AND administradora_id = $2", [usuarioId, administradoraId])
    for (const permissaoId of permissaoIds) {
      await query("INSERT INTO usuario_permissoes (administradora_id, usuario_id, permissao_id) VALUES ($1, $2, $3)", [administradoraId, usuarioId, permissaoId])
    }
    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("[v0] Erro ao salvar permissões", error)
    return NextResponse.json({ error: "Não foi possível salvar as permissões." }, { status: 500 })
  }
}
