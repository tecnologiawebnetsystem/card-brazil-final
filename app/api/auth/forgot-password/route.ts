import { NextRequest, NextResponse } from "next/server"
import AuthService from "@/lib/auth-service"

export async function POST(request: NextRequest) {
  try {
    const { email } = await request.json()
    if (typeof email !== "string" || !email.includes("@")) {
      return NextResponse.json({ success: true, message: "Se o e-mail estiver cadastrado, um link de recuperação foi gerado." })
    }
    const ip = request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() || "unknown"
    const result = await AuthService.requestPasswordReset(email, ip)
    return NextResponse.json(result)
  } catch (error) {
    console.error("[v0] Erro na solicitação de recuperação:", error)
    return NextResponse.json({ success: true, message: "Se o e-mail estiver cadastrado, um link de recuperação foi gerado." })
  }
}
