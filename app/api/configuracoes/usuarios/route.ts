import { NextResponse } from "next/server"
import { query } from "@/lib/database"

export async function GET() {
  try {
    const users = await query(`
      SELECT u.id, u.nome, u.email, u.perfil, u.departamento, u.telefone,
             u.avatar_url, u.ultimo_acesso, u.status
      FROM usuarios u
      ORDER BY u.nome ASC
    `)
    return NextResponse.json(users)
  } catch (error) {
    console.error("[v0] Erro ao carregar usuários", error)
    return NextResponse.json({ error: "Não foi possível carregar os usuários." }, { status: 500 })
  }
}
