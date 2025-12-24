import bcrypt from "bcryptjs"
import jwt from "jsonwebtoken"
import { query, queryOne } from "./database"

const JWT_SECRET = process.env.JWT_SECRET || "your-secret-key-change-in-production"
const JWT_EXPIRES_IN = "24h"
const REFRESH_TOKEN_EXPIRES_IN = "7d"

interface Usuario {
  id: number
  administradora_id: number
  nome_completo: string
  email: string
  senha_hash: string
  tipo_usuario: string
  status: string
  ultimo_acesso?: Date
}

interface PerfilUsuario {
  id: number
  nome: string
  cpf?: string
}

interface Role {
  id: number
  nome: string
  descricao?: string
}

export interface LoginResponse {
  success: boolean
  message: string
  data?: {
    usuario: Omit<Usuario, "senha_hash">
    token: string
  }
}

export class AuthService {
  static async login(email: string, senha: string): Promise<LoginResponse> {
    try {
      const usuario = await queryOne<Usuario>(
        "SELECT * FROM usuarios WHERE LOWER(email) = LOWER($1) AND status = 'ativo'",
        [email],
      )

      if (!usuario) {
        return { success: false, message: "Credenciais inválidas" }
      }

      const senhaValida = await bcrypt.compare(senha, usuario.senha_hash)
      if (!senhaValida) {
        return { success: false, message: "Credenciais inválidas" }
      }

      await query(
        "UPDATE usuarios SET ultimo_acesso = CURRENT_TIMESTAMP, updated_at = CURRENT_TIMESTAMP WHERE id = $1",
        [usuario.id],
      )

      const token = jwt.sign(
        {
          userId: usuario.id,
          email: usuario.email,
          administradoraId: usuario.administradora_id,
          tipoUsuario: usuario.tipo_usuario,
        },
        JWT_SECRET,
        { expiresIn: JWT_EXPIRES_IN },
      )

      const { senha_hash, ...usuarioSemSenha } = usuario

      return {
        success: true,
        message: "Login realizado com sucesso",
        data: {
          usuario: usuarioSemSenha,
          token,
        },
      }
    } catch (error) {
      console.error("[v0] Erro no login:", error)
      return { success: false, message: "Erro interno do servidor" }
    }
  }

  static async logout(token: string): Promise<{ success: boolean; message: string }> {
    try {
      jwt.verify(token, JWT_SECRET)
      return { success: true, message: "Logout realizado com sucesso" }
    } catch (error) {
      return { success: false, message: "Token inválido" }
    }
  }

  static async verifyToken(token: string): Promise<any> {
    try {
      const decoded = jwt.verify(token, JWT_SECRET)
      return decoded
    } catch (error) {
      return null
    }
  }

  static async getUserById(userId: number): Promise<Omit<Usuario, "senha_hash"> | null> {
    try {
      const usuario = await queryOne<Usuario>("SELECT * FROM usuarios WHERE id = $1 AND status = 'ativo'", [userId])

      if (!usuario) {
        return null
      }

      const { senha_hash, ...usuarioSemSenha } = usuario
      return usuarioSemSenha
    } catch (error) {
      console.error("[v0] Erro ao buscar usuário:", error)
      return null
    }
  }

  private static async logAuthEvent(
    usuarioId: number | null,
    email: string,
    acao: string,
    ipAddress?: string,
    userAgent?: string,
    detalhes?: string | null,
  ) {
    try {
      let idAdministradora = 1
      if (usuarioId) {
        const usuario = await queryOne<{ administradora_id: number }>(
          "SELECT administradora_id FROM usuarios WHERE id = $1",
          [usuarioId],
        )
        if (usuario) {
          idAdministradora = usuario.administradora_id
        }
      }

      await query(
        `INSERT INTO logs_autenticacao (administradora_id, usuario_id, email, acao, ip_address, user_agent, detalhes) 
         VALUES ($1, $2, $3, $4, $5, $6, $7)`,
        [idAdministradora, usuarioId, email, acao, ipAddress, userAgent, detalhes],
      )
    } catch (error) {
      console.error("Erro ao registrar log de autenticação:", error)
    }
  }
}

export default AuthService
