import { type NextRequest, NextResponse } from "next/server"
import { AuthService } from "@/lib/auth-service"

/**
 * @swagger
 * /api/auth/login:
 *   post:
 *     summary: Realizar login do usuário
 *     tags: [Autenticação]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *               - senha
 *             properties:
 *               email:
 *                 type: string
 *                 format: email
 *                 example: admin@cardbrazil.com.br
 *               senha:
 *                 type: string
 *                 example: admin123
 *     responses:
 *       200:
 *         description: Login realizado com sucesso
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 message:
 *                   type: string
 *                 data:
 *                   type: object
 *                   properties:
 *                     usuario:
 *                       $ref: '#/components/schemas/Usuario'
 *                     token:
 *                       type: string
 *                     refreshToken:
 *                       type: string
 *       400:
 *         description: Dados inválidos
 *       401:
 *         description: Credenciais inválidas
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { email, senha } = body

    if (!email || !senha) {
      return NextResponse.json({ success: false, message: "Email e senha são obrigatórios" }, { status: 400 })
    }

    const ipAddress = request.ip || request.headers.get("x-forwarded-for") || "unknown"
    const userAgent = request.headers.get("user-agent") || "unknown"

    const result = await AuthService.login(email, senha, ipAddress, userAgent)

    if (!result.success) {
      return NextResponse.json(result, { status: 401 })
    }

    // Definir cookies httpOnly para os tokens
    const response = NextResponse.json(result)

    response.cookies.set("auth-token", result.data!.token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      maxAge: 24 * 60 * 60, // 24 horas
    })

    response.cookies.set("refresh-token", result.data!.refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      maxAge: 7 * 24 * 60 * 60, // 7 dias
    })

    return response
  } catch (error) {
    console.error("Erro na API de login:", error)
    return NextResponse.json({ success: false, message: "Erro interno do servidor" }, { status: 500 })
  }
}
