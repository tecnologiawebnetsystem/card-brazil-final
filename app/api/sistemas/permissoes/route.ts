import { NextRequest, NextResponse } from "next/server"
import { query } from "@/lib/database"

export async function GET() {
  try {
    // O banco atual ainda não possui tabelas de permissões; retornar uma lista real e explícita.
    return NextResponse.json([])
  } catch (error) {
    console.error("[v0] Erro ao carregar permissões", error)
    return NextResponse.json({ error: "Não foi possível carregar as permissões." }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const usuarioId = Number(body.usuarioId)
    const permissaoIds = Array.isArray(body.permissaoIds) ? body.permissaoIds.map(Number).filter(Number.isInteger) : []
    if (!Number.isInteger(usuarioId) || usuarioId <= 0) {
      return NextResponse.json({ error: "Usuário inválido." }, { status: 400 })
    }
    await query("DELETE FROM usuario_permissoes WHERE usuario_id = ?", [usuarioId])
    for (const permissaoId of permissaoIds) {
      await query("INSERT INTO usuario_permissoes (usuario_id, permissao_id) VALUES (?, ?)", [usuarioId, permissaoId])
    }
    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("[v0] Erro ao salvar permissões", error)
    return NextResponse.json({ error: "Não foi possível salvar as permissões." }, { status: 500 })
  }
}
