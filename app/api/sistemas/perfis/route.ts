import { NextResponse } from "next/server"
import { query } from "@/lib/database"

export async function GET() {
  try {
    const profiles = await query(`
      SELECT u.perfil AS nome,
             COUNT(DISTINCT u.id)::int AS usuarios,
             COUNT(DISTINCT up.permissao_id)::int AS permissoes
      FROM usuarios u
      LEFT JOIN usuario_permissoes up ON up.usuario_id = u.id
      GROUP BY u.perfil
      ORDER BY u.perfil
    `)
    const permissions = await query(`
      SELECT modulo, COUNT(*)::int AS total
      FROM permissoes
      GROUP BY modulo
      ORDER BY modulo
    `)
    return NextResponse.json({ profiles, permissions })
  } catch (error) {
    console.error("[v0] Erro ao carregar perfis e permissões", error)
    return NextResponse.json({ error: "Não foi possível carregar perfis e permissões." }, { status: 500 })
  }
}
