import { type NextRequest, NextResponse } from "next/server"
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
 *                 example: admin@talenthealth.com.br
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

    // Login mockado - aceita qualquer credencial para demonstração
    const token = jwt.sign(
      {
        userId: MOCK_ADMIN_USER.id,
        email: MOCK_ADMIN_USER.email,
        administradoraId: MOCK_ADMIN_USER.administradora_id,
        tipoUsuario: MOCK_ADMIN_USER.tipo_usuario,
      },
      JWT_SECRET,
      { expiresIn: "24h" }
    )

    const result = {
      success: true,
      message: "Login realizado com sucesso",
      data: {
        usuario: MOCK_ADMIN_USER,
        token,
      },
    }

    const response = NextResponse.json(result)

    response.cookies.set("auth-token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      maxAge: 24 * 60 * 60, // 24 hours
      path: "/",
    })

    return response
  } catch (error) {
    console.error("[v0] Erro na API de login:", error)
    return NextResponse.json({ success: false, message: "Erro interno do servidor" }, { status: 500 })
  }
}
