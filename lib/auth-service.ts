import bcrypt from "bcryptjs"
import jwt from "jsonwebtoken"
import crypto from "node:crypto"
import { query, queryOne } from "./database"
import { Resend } from "resend"

function getJwtSecret() {
  const secret = process.env.JWT_SECRET
  if (!secret || secret.length < 32) {
    throw new Error("JWT_SECRET deve estar configurado com pelo menos 32 caracteres")
  }
  return secret
}
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
        getJwtSecret(),
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

  static async requestPasswordReset(email: string, ipAddress?: string) {
    const generic = { success: true, message: "Se o e-mail estiver cadastrado, um link de recuperação foi gerado." }
    const normalizedEmail = email.trim().toLowerCase()
    const recent = await queryOne<{ total: number }>(
      "SELECT COUNT(*)::int AS total FROM tokens_recuperacao_senha WHERE criado_em > CURRENT_TIMESTAMP - INTERVAL '15 minutes' AND (ip_address = $1 OR usuario_id IN (SELECT id FROM usuarios WHERE LOWER(email) = $2))",
      [ipAddress || "unknown", normalizedEmail],
    )
    if ((recent?.total || 0) >= 5) return generic

    const usuario = await queryOne<{ id: number }>(
      "SELECT id FROM usuarios WHERE LOWER(email) = $1 AND ativo = TRUE",
      [normalizedEmail],
    )
    if (!usuario) return generic

    const rawToken = crypto.randomBytes(32).toString("hex")
    const tokenHash = crypto.createHash("sha256").update(rawToken).digest("hex")
    await query("UPDATE tokens_recuperacao_senha SET usado_em = CURRENT_TIMESTAMP WHERE usuario_id = $1 AND usado_em IS NULL", [usuario.id])
    await query(
      "INSERT INTO tokens_recuperacao_senha (usuario_id, token_hash, expira_em, ip_address) VALUES ($1, $2, CURRENT_TIMESTAMP + INTERVAL '30 minutes', $3)",
      [usuario.id, tokenHash, ipAddress || "unknown"],
    )
    const baseUrl = process.env.BETTER_AUTH_URL || process.env.VERCEL_PROJECT_PRODUCTION_URL || process.env.VERCEL_URL || process.env.V0_RUNTIME_URL
    const recoveryUrl = `${baseUrl?.startsWith("http") ? baseUrl : `https://${baseUrl || "localhost:3000"}`}/esqueci-senha?token=${rawToken}`
    const resend = new Resend(process.env.RESEND_API_KEY)
    const senderDomain = process.env.RESEND_EMAIL_DOMAIN
    const from = senderDomain ? `Segurança Talent Health <no-reply@${senderDomain}>` : "Talent Health <onboarding@resend.dev>"
    const { error } = await resend.emails.send(
      {
        from,
        to: [normalizedEmail],
        subject: "Seu acesso Talent: crie uma nova senha",
        html: `<div style="margin:0;background:#f4f7fb;padding:40px 16px;font-family:Arial,Helvetica,sans-serif;color:#102a43"><div style="max-width:580px;margin:auto;background:#fff;border:1px solid #dce5ee;border-radius:24px;overflow:hidden;box-shadow:0 12px 36px rgba(16,42,67,.10)"><div style="background:#102a43;padding:28px 34px;color:#fff"><div style="font-size:22px;font-weight:700;letter-spacing:-.04em">Talent</div><div style="margin-top:8px;font-size:12px;letter-spacing:.14em;text-transform:uppercase;color:#a9c5d8">Gestão que move pessoas</div></div><div style="padding:36px 34px"><div style="display:inline-block;background:#e9f5f4;color:#137b78;padding:8px 12px;border-radius:999px;font-size:12px;font-weight:700">SEGURANÇA DA CONTA</div><h1 style="margin:22px 0 12px;font-size:30px;line-height:1.1;letter-spacing:-.04em">Vamos recuperar seu acesso.</h1><p style="font-size:16px;line-height:1.7;color:#52677a">Recebemos uma solicitação para criar uma nova senha para sua conta Talent. Clique no botão abaixo para continuar.</p><div style="margin:30px 0"><a href="${recoveryUrl}" style="display:inline-block;background:#e56b4f;color:#fff;padding:15px 22px;text-decoration:none;border-radius:12px;font-weight:700">Criar nova senha &rarr;</a></div><p style="font-size:13px;line-height:1.7;color:#718496">Este link expira em <strong>30 minutos</strong> e só pode ser usado uma vez. Se você não solicitou esta alteração, ignore este e-mail.</p></div><div style="border-top:1px solid #edf1f5;padding:22px 34px;font-size:12px;line-height:1.6;color:#718496">Por segurança, nunca compartilhe este link. Este é um e-mail automático da Talent.</div></div></div>`,
      },
      { idempotencyKey: `password-reset/${usuario.id}/${tokenHash}` },
    )
    if (error) {
      console.error("[v0] Falha ao enviar recuperação:", error.message)
      return generic
    }
    return generic
  }

  static async resetPassword(rawToken: string, senha: string) {
    const tokenHash = crypto.createHash("sha256").update(rawToken).digest("hex")
    const senhaHash = await bcrypt.hash(senha, 12)
    const token = await queryOne<{ usuario_id: number }>(
      "UPDATE tokens_recuperacao_senha SET usado_em = CURRENT_TIMESTAMP WHERE token_hash = $1 AND usado_em IS NULL AND expira_em > CURRENT_TIMESTAMP RETURNING usuario_id",
      [tokenHash],
    )
    if (!token) return { success: false, message: "Link inválido ou expirado." }
    await query("UPDATE usuarios SET senha_hash = $1, updated_at = CURRENT_TIMESTAMP, tentativas_login = 0, bloqueado_ate = NULL WHERE id = $2 AND ativo = TRUE", [senhaHash, token.usuario_id])
    await query("DELETE FROM sessoes_usuario WHERE usuario_id = $1", [token.usuario_id])
    return { success: true, message: "Senha atualizada com sucesso." }
  }

  static async logout(token: string): Promise<{ success: boolean; message: string }> {
    try {
      jwt.verify(token, getJwtSecret())
      return { success: true, message: "Logout realizado com sucesso" }
    } catch (error) {
      return { success: false, message: "Token inválido" }
    }
  }

  static async verifyToken(token: string): Promise<any> {
    try {
      const decoded = jwt.verify(token, getJwtSecret())
      return decoded
    } catch (error) {
      return null
    }
  }

  static async getUserById(userId: number, administradoraId?: number): Promise<Omit<Usuario, "senha_hash"> | null> {
    try {
      const usuario = await queryOne<Usuario>(
        administradoraId === undefined
          ? "SELECT * FROM usuarios WHERE id = $1 AND status = 'ativo'"
          : "SELECT * FROM usuarios WHERE id = $1 AND administradora_id = $2 AND status = 'ativo'",
        administradoraId === undefined ? [userId] : [userId, administradoraId],
      )

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
