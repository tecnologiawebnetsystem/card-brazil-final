import { NextResponse } from "next/server"
import { query } from "@/lib/database"

export async function GET() {
  try {
    const profiles = await query(`
      SELECT u.tipo_usuario AS nome,
             COUNT(DISTINCT u.id)::int AS usuarios,
             0::int AS permissoes
      FROM usuarios u
      WHERE u.deleted_at IS NULL
      GROUP BY u.tipo_usuario
      ORDER BY u.tipo_usuario
    `)
    const permissions: { modulo: string; total: number }[] = []
    return NextResponse.json({ profiles, permissions })
  } catch (error) {
    console.error("[v0] Erro ao carregar perfis e permissões", error)
    return NextResponse.json({ error: "Não foi possível carregar perfis e permissões." }, { status: 500 })
  }
}
