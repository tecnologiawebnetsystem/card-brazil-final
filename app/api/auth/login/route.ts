import { type NextRequest, NextResponse } from "next/server"
import { z } from "zod"
import { AuthService } from "@/back-end/lib/auth-service"

const credentialsSchema = z.object({
  email: z.string().trim().email().max(254),
  codigo: z.string().regex(/^\d{6}$/),
})

export async function POST(request: NextRequest) {
  const parsed = credentialsSchema.safeParse(await request.json().catch(() => null))
  if (!parsed.success) {
    return NextResponse.json({ success: false, message: "Informe um e-mail e um código de seis dígitos válidos." }, { status: 400 })
  }

  try {
    const result = await AuthService.verifyLoginCode(parsed.data.email, parsed.data.codigo)
    if (!result.success || !result.data) {
      return NextResponse.json({ success: false, message: "Código inválido ou expirado." }, { status: 401 })
    }

    const response = NextResponse.json({ success: true, message: "Login realizado com sucesso", data: { usuario: result.data.usuario } }, { headers: { "Cache-Control": "no-store" } })
    response.cookies.set("auth-token", result.data.token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 24 * 60 * 60,
      path: "/",
    })
    return response
  } catch (error) {
    console.error("[v0] Erro na API de login:", error)
    return NextResponse.json({ success: false, message: "Erro interno do servidor" }, { status: 500, headers: { "Cache-Control": "no-store" } })
  }
}
