import { NextResponse } from "next/server"
import { cookies } from "next/headers"
import AuthService from "@/lib/auth-service"
import { query } from "@/lib/database"

export const dynamic = "force-dynamic"

async function getAuthenticatedUser() {
  const cookieStore = await cookies()
  const token = cookieStore.get("auth-token")?.value
  if (!token) return null
  const decoded = await AuthService.verifyToken(token)
  if (!decoded?.userId) return null
  return { id: Number(decoded.userId), administradoraId: Number(decoded.administradoraId) }
}

export async function GET() {
  try {
    const authUser = await getAuthenticatedUser()
    if (!authUser) return NextResponse.json({ success: false, message: "Não autenticado" }, { status: 401 })
    const user = await AuthService.getUserById(authUser.id, authUser.administradoraId)
    if (!user) return NextResponse.json({ success: false, message: "Usuário não encontrado" }, { status: 401 })
    return NextResponse.json({ success: true, user })
  } catch (error) {
    console.error("[v0] Auth check error:", error)
    return NextResponse.json({ success: false, message: "Erro interno" }, { status: 500 })
  }
}

export async function PATCH(request: Request) {
  try {
    const authUser = await getAuthenticatedUser()
    if (!authUser) return NextResponse.json({ success: false, message: "Não autenticado" }, { status: 401 })
    const body = await request.json()
    const nome = typeof body.nome === "string" ? body.nome.trim() : ""
    const email = typeof body.email === "string" ? body.email.trim().toLowerCase() : ""
    if (!nome || !email || !email.includes("@")) return NextResponse.json({ success: false, message: "Nome e e-mail válidos são obrigatórios" }, { status: 400 })
    await query("UPDATE usuarios SET nome_completo = $1, email = $2, updated_at = CURRENT_TIMESTAMP WHERE id = $3 AND administradora_id = $4", [nome, email, authUser.id, authUser.administradoraId])
    const user = await AuthService.getUserById(authUser.id, authUser.administradoraId)
    return NextResponse.json({ success: true, user })
  } catch (error) {
    console.error("[v0] Profile update error:", error)
    return NextResponse.json({ success: false, message: "Não foi possível atualizar o perfil" }, { status: 500 })
  }
}
