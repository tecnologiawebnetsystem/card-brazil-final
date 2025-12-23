import { type NextRequest, NextResponse } from "next/server"
import { AuthService } from "@/lib/auth-service"

/**
 * @swagger
 * /api/auth/logout:
 *   post:
 *     summary: Realizar logout do usuário
 *     tags: [Autenticação]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Logout realizado com sucesso
 *       401:
 *         description: Token inválido
 */
export async function POST(request: NextRequest) {
  try {
    const token =
      request.cookies.get("auth-token")?.value || request.headers.get("authorization")?.replace("Bearer ", "")

    if (!token) {
      return NextResponse.json({ success: false, message: "Token não fornecido" }, { status: 401 })
    }

    const result = await AuthService.logout(token)

    const response = NextResponse.json(result)

    // Limpar cookies
    response.cookies.delete("auth-token")
    response.cookies.delete("refresh-token")

    return response
  } catch (error) {
    console.error("Erro na API de logout:", error)
    return NextResponse.json({ success: false, message: "Erro interno do servidor" }, { status: 500 })
  }
}
