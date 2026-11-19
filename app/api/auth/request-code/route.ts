import { NextRequest, NextResponse } from "next/server"
import { z } from "zod"
import AuthService from "@/back-end/lib/auth-service"

const requestSchema = z.object({ email: z.string().trim().email().max(254) })

export async function POST(request: NextRequest) {
  const parsed = requestSchema.safeParse(await request.json().catch(() => null))
  if (!parsed.success) {
    return NextResponse.json({ success: false, message: "Informe um e-mail válido." }, { status: 400 })
  }

  try {
    const ip = request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() || "unknown"
    const result = await AuthService.requestLoginCode(parsed.data.email, ip)
    return NextResponse.json(result, { headers: { "Cache-Control": "no-store" } })
  } catch (error) {
    console.error("[v0] Erro ao solicitar código de acesso:", error)
    return NextResponse.json({ success: false, message: "Não foi possível enviar o código agora." }, { status: 500 })
  }
}
