import { NextResponse } from "next/server"
import { cookies } from "next/headers"
import AuthService from "@/lib/auth-service"

export const dynamic = "force-dynamic"

async function getAuthenticatedUser() {
  const cookieStore = await cookies()
  const token = cookieStore.get("auth-token")?.value
  if (!token) return null
  const decoded = await AuthService.verifyToken(token)
  if (!decoded?.userId) return null
  return { id: Number(decoded.userId), administradoraId: Number(decoded.administradoraId) }
}

export async function POST(request: Request) {
  try {
    const authUser = await getAuthenticatedUser()
    if (!authUser) {
      return NextResponse.json({ success: false, message: "Não autenticado" }, { status: 401 })
    }

    const body = await request.json()
    const senhaAtual = typeof body.senhaAtual === "string" ? body.senhaAtual : ""
    const novaSenha = typeof body.novaSenha === "string" ? body.novaSenha : ""

    if (!senhaAtual || !novaSenha) {
      return NextResponse.json(
        { success: false, message: "Informe a senha atual e a nova senha." },
        { status: 400 },
      )
    }

    const result = await AuthService.changePassword(
      authUser.id,
      authUser.administradoraId,
      senhaAtual,
      novaSenha,
    )

    return NextResponse.json(result, { status: result.success ? 200 : 400 })
  } catch (error) {
    console.error("[v0] Erro ao alterar senha:", error)
    return NextResponse.json(
      { success: false, message: "Não foi possível alterar a senha." },
      { status: 500 },
    )
  }
}
