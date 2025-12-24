import { NextResponse } from "next/server"
import { AuthService } from "@/lib/auth-service"
import { cookies } from "next/headers"

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

    if (!decoded || !decoded.userId) {
      return NextResponse.json({ success: false, message: "Invalid token" }, { status: 401 })
    }

    const user = await AuthService.getUserById(decoded.userId)

    if (!user) {
      return NextResponse.json({ success: false, message: "User not found" }, { status: 404 })
    }

    return NextResponse.json({
      success: true,
      user: {
        id: user.id,
        nome_completo: user.nome_completo,
        email: user.email,
        administradora_id: user.administradora_id,
        tipo_usuario: user.tipo_usuario,
        status: user.status,
        ultimo_acesso: user.ultimo_acesso,
      },
    })
  } catch (error) {
    console.error("[v0] Auth check error:", error)
    return NextResponse.json({ success: false, message: "Internal server error" }, { status: 500 })
  }
}
