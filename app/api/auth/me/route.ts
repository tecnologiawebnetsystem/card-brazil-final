import { NextResponse } from "next/server"
import { cookies } from "next/headers"
import jwt from "jsonwebtoken"

const JWT_SECRET = process.env.JWT_SECRET || "your-secret-key-change-in-production"

// Usuário admin mockado
const MOCK_ADMIN_USER = {
  id: 1,
  administradora_id: 1,
  nome_completo: "Administrador Sistema",
  email: "admin@talenthealth.com.br",
  tipo_usuario: "admin",
  status: "ativo",
  ultimo_acesso: new Date().toISOString(),
}

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

    // Verificar token mockado
    try {
      const decoded = jwt.verify(token, JWT_SECRET) as { userId: number }
      
      if (!decoded || !decoded.userId) {
        return NextResponse.json({ success: false, message: "Invalid token" }, { status: 401 })
      }

      // Retornar usuário mockado
      return NextResponse.json({
        success: true,
        user: MOCK_ADMIN_USER,
      })
    } catch {
      return NextResponse.json({ success: false, message: "Invalid token" }, { status: 401 })
    }
  } catch (error) {
    console.error("[v0] Auth check error:", error)
    return NextResponse.json({ success: false, message: "Internal server error" }, { status: 500 })
  }
}
