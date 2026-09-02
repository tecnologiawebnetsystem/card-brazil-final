import { NextRequest, NextResponse } from "next/server"
import AuthService from "@/lib/auth-service"

export async function POST(request: NextRequest) {
  try {
    const { token, senha } = await request.json()
    if (typeof token !== "string" || typeof senha !== "string" || senha.length < 12) {
      return NextResponse.json({ success: false, message: "A senha deve ter pelo menos 12 caracteres." }, { status: 400 })
    }
    const result = await AuthService.resetPassword(token, senha)
    return NextResponse.json(result, { status: result.success ? 200 : 400 })
  } catch (error) {
    console.error("[v0] Erro ao redefinir senha:", error)
    return NextResponse.json({ success: false, message: "Não foi possível redefinir a senha." }, { status: 500 })
  }
}
