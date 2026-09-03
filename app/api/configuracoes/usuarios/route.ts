import { NextResponse } from "next/server"
import { query } from "@/lib/database"

export async function GET() {
  try {
    const users = await query(`
      SELECT u.id,
             u.nome_completo AS nome,
             u.email,
             u.tipo_usuario AS perfil,
             NULL::text AS departamento,
             u.telefone,
             u.foto_perfil_url AS avatar_url,
             u.ultimo_acesso,
             u.status
      FROM usuarios u
      WHERE u.deleted_at IS NULL
      ORDER BY u.nome_completo ASC NULLS LAST
    `)
    return NextResponse.json(users)
  } catch (error) {
    console.error("[v0] Erro ao carregar usuários", error)
    return NextResponse.json({ error: "Não foi possível carregar os usuários." }, { status: 500 })
  }
}
