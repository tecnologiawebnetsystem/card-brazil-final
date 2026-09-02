import { NextResponse } from "next/server"
import { cookies } from "next/headers"
import AuthService from "@/lib/auth-service"

/**
 * @swagger
 * /api/auth/me:
 *   get:
 *     summary: Verificar usuário autenticado
 *     tags: [Autenticação]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Usuário autenticado
 *       401:
 *         description: Não autenticado
 */
export async function GET() {
  try {
    const cookieStore = await cookies()
    const token = cookieStore.get("auth-token")?.value

    if (!token) {
      return NextResponse.json({ success: false, message: "Not authenticated" }, { status: 401 })
    }

    const decoded = await AuthService.verifyToken(token)
    if (!decoded?.userId) {
      return NextResponse.json({ success: false, message: "Invalid token" }, { status: 401 })
    }

    const user = await AuthService.getUserById(Number(decoded.userId), Number(decoded.administradoraId))
    if (!user) {
      return NextResponse.json({ success: false, message: "Usuário não encontrado" }, { status: 401 })
    }

    return NextResponse.json({ success: true, user })
  } catch (error) {
    console.error("[v0] Auth check error:", error)
    return NextResponse.json({ success: false, message: "Internal server error" }, { status: 500 })
  }
}
