import bcrypt from "bcryptjs"
import jwt from "jsonwebtoken"
import { query, queryOne } from "./database"
import type { Usuario, PerfilUsuario, Role } from "./database"

const JWT_SECRET = process.env.JWT_SECRET || "your-secret-key"
const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN || "1h"
const REFRESH_TOKEN_EXPIRES_IN = process.env.REFRESH_TOKEN_EXPIRES_IN || "7d"

export interface LoginRequest {
  email: string
  senha: string
}

export interface LoginResponse {
  success: boolean
  message: string
  data?: {
    usuario: Usuario & { perfil: PerfilUsuario; roles: Role[] }
    token: string
    refreshToken: string
  }
}

export class AuthService {
  static async login(email: string, senha: string, ipAddress?: string, userAgent?: string): Promise<LoginResponse> {
    try {
      // Buscar usuário por email
      const usuario = await queryOne<Usuario>("SELECT * FROM usuarios WHERE email = ? AND ativo = true", [
        email.toLowerCase(),
      ])

      if (!usuario) {
        await this.logAuthEvent(null, email, "login_falha", ipAddress, userAgent, { motivo: "usuario_nao_encontrado" })
        return { success: false, message: "Credenciais inválidas" }
      }

      // Verificar se usuário está bloqueado
      if (usuario.bloqueado_ate && new Date(usuario.bloqueado_ate) > new Date()) {
        await this.logAuthEvent(usuario.id, email, "login_falha", ipAddress, userAgent, { motivo: "usuario_bloqueado" })
        return { success: false, message: "Usuário temporariamente bloqueado" }
      }

      // Verificar senha
      const senhaValida = await bcrypt.compare(senha, usuario.senha_hash)
      if (!senhaValida) {
        // Incrementar tentativas de login
        const novasTentativas = usuario.tentativas_login + 1
        const bloqueadoAte = novasTentativas >= 5 ? new Date(Date.now() + 30 * 60 * 1000) : null

        await query("UPDATE usuarios SET tentativas_login = ?, bloqueado_ate = ? WHERE id = ?", [
          novasTentativas,
          bloqueadoAte,
          usuario.id,
        ])

        await this.logAuthEvent(usuario.id, email, "login_falha", ipAddress, userAgent, { motivo: "senha_incorreta" })
        return { success: false, message: "Credenciais inválidas" }
      }

      // Resetar tentativas de login
      await query("UPDATE usuarios SET tentativas_login = 0, bloqueado_ate = NULL WHERE id = ?", [usuario.id])

      // Buscar perfil do usuário
      const perfil = await queryOne<PerfilUsuario>("SELECT * FROM perfis_usuario WHERE usuario_id = ?", [usuario.id])

      // Buscar roles do usuário
      const roles = await query<Role>(
        `SELECT r.* FROM roles r 
         INNER JOIN usuario_roles ur ON r.id = ur.role_id 
         WHERE ur.usuario_id = ?`,
        [usuario.id],
      )

      // Gerar tokens
      const token = jwt.sign(
        {
          userId: usuario.id,
          email: usuario.email,
          roles: roles.map((r) => r.nome),
        },
        JWT_SECRET,
        { expiresIn: Number.parseInt(JWT_EXPIRES_IN) },
      )

      const refreshToken = jwt.sign({ userId: usuario.id, type: "refresh" }, JWT_SECRET, {
        expiresIn: Number.parseInt(REFRESH_TOKEN_EXPIRES_IN),
      })

      // Salvar sessão
      const tokenHash = await bcrypt.hash(token, 10)
      const refreshTokenHash = await bcrypt.hash(refreshToken, 10)
      const expiresAt = new Date(Date.now() + 60 * 60 * 1000) // 1 hora

      await query(
        `INSERT INTO sessoes_usuario (id, usuario_id, token_hash, refresh_token_hash, expires_at, ip_address, user_agent) 
         VALUES (UUID(), ?, ?, ?, ?, ?, ?)`,
        [usuario.id, tokenHash, refreshTokenHash, expiresAt, ipAddress, userAgent],
      )

      await this.logAuthEvent(usuario.id, email, "login_sucesso", ipAddress, userAgent)

      return {
        success: true,
        message: "Login realizado com sucesso",
        data: {
          usuario: { ...usuario, perfil: perfil!, roles },
          token,
          refreshToken,
        },
      }
    } catch (error) {
      console.error("Erro no login:", error)
      return { success: false, message: "Erro interno do servidor" }
    }
  }

  static async logout(token: string): Promise<{ success: boolean; message: string }> {
    try {
      const decoded = jwt.verify(token, JWT_SECRET) as any

      // Desativar sessão
      const tokenHash = await bcrypt.hash(token, 10)
      await query("UPDATE sessoes_usuario SET ativo = false WHERE token_hash = ?", [tokenHash])

      await this.logAuthEvent(decoded.userId, decoded.email, "logout")

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

  private static async logAuthEvent(
    usuarioId: string | null,
    email: string,
    tipoEvento: string,
    ipAddress?: string,
    userAgent?: string,
    detalhes?: any,
  ) {
    await query(
      `INSERT INTO logs_autenticacao (id, usuario_id, email, tipo_evento, ip_address, user_agent, detalhes) 
       VALUES (UUID(), ?, ?, ?, ?, ?, ?)`,
      [usuarioId, email, tipoEvento, ipAddress, userAgent, detalhes ? JSON.stringify(detalhes) : null],
    )
  }
}
