import { cookies } from "next/headers"
import { AuthService } from "@/back-end/lib/auth-service"
import { query } from "@/back-end/lib/database"

export type CadastroPermission = "view" | "create" | "edit" | "toggle" | "delete"
export type FinanceiroPermission = CadastroPermission
export type CobrancaPermission = CadastroPermission

export interface AuthContext {
  userId: number
  administradoraId: number
  profile: Record<string, unknown>
}

export async function getAuthContext(): Promise<AuthContext | null> {
  const token = (await cookies()).get("auth-token")?.value
  if (!token) return null
  const decoded = await AuthService.verifyToken(token)
  const userId = Number(decoded?.userId)
  const administradoraId = Number(decoded?.administradoraId)
  if (!Number.isInteger(userId) || userId <= 0 || !Number.isInteger(administradoraId) || administradoraId <= 0) return null
  const profile = await AuthService.getUserById(userId, administradoraId)
  if (!profile) return null
  return { userId, administradoraId, profile: profile as unknown as Record<string, unknown> }
}

export async function requireCobrancaAccess(permission: CadastroPermission = "view") {
  const context = await getAuthContext()
  if (!context) throw new Error("UNAUTHENTICATED")
  const permissions = (context.profile.permissions ?? {}) as Record<string, boolean>
  const isAdmin = context.profile.tipo_usuario === "admin" || context.profile.tipo_usuario === "administrador"
  const key = `cobranca.${permission}`
  if (!isAdmin && permissions[key] !== true) throw new Error("FORBIDDEN")
  return context
}

export async function requireFinanceiroAccess(permission: CadastroPermission = "view") {
  const context = await getAuthContext()
  if (!context) throw new Error("UNAUTHENTICATED")
  const permissions = (context.profile.permissions ?? {}) as Record<string, boolean>
  const isAdmin = context.profile.tipo_usuario === "admin" || context.profile.tipo_usuario === "administrador"
  const key = `financeiro.${permission}`
  if (!isAdmin && permissions[key] !== true) throw new Error("FORBIDDEN")
  return context
}

export async function requireCadastroAccess(permission: CadastroPermission = "view") {
  const context = await getAuthContext()
  if (!context) throw new Error("UNAUTHENTICATED")
  const permissions = (context.profile.permissions ?? {}) as Record<string, boolean>
  const isAdmin = context.profile.tipo_usuario === "admin" || context.profile.tipo_usuario === "administrador"
  if (isAdmin) return context
  try {
    const rows = await query(`
      SELECT 1
      FROM sistema_usuario_perfis up
      JOIN sistema_perfil_permissoes pp ON pp.administradora_id = up.administradora_id
        AND pp.perfil_nome = up.perfil_nome AND pp.permitido = TRUE
      JOIN sistemas_recursos r ON r.id = pp.recurso_id AND r.slug IN ('cadastros', 'sistemas') AND r.ativo = TRUE
      JOIN sistemas_acoes a ON a.id = pp.acao_id AND a.slug = $3 AND a.ativo = TRUE
      WHERE up.administradora_id = $1 AND up.usuario_id = $2 AND up.ativo = TRUE
        AND (up.vigencia_inicio IS NULL OR up.vigencia_inicio <= CURRENT_DATE)
        AND (up.vigencia_fim IS NULL OR up.vigencia_fim >= CURRENT_DATE)
      LIMIT 1
    `, [context.administradoraId, context.userId, permission === "toggle" ? "editar" : permission])
    if (rows[0]) return context
  } catch {
    // Instalações sem a migração usam as permissões legadas durante a transição.
  }
  const key = `cadastros.${permission}`
  if (permissions[key] !== true) throw new Error("FORBIDDEN")
  return context
}

export function hasPermission(context: AuthContext, domain: "financeiro" | "cobranca" | "cadastros", permission: CadastroPermission) {
  const isAdmin = context.profile.tipo_usuario === "admin" || context.profile.tipo_usuario === "administrador"
  if (isAdmin) return true
  const permissions = (context.profile.permissions ?? {}) as Record<string, boolean>
  return permissions[`${domain}.${permission}`] === true
}

export function apiAuthError(error: unknown) {
  if (error instanceof Error && error.message === "UNAUTHENTICATED") return { message: "Não autenticado", status: 401 }
  if (error instanceof Error && error.message === "FORBIDDEN") return { message: "Sem permissão para este cadastro", status: 403 }
  return null
}

export function authErrorStatus(error: unknown) {
  if (error instanceof Error && error.message === "UNAUTHENTICATED") return 401
  if (error instanceof Error && error.message === "FORBIDDEN") return 403
  return 500
}

export function isScopedColumn(column: string) {
  return column === "administradora_id" || column === "id_administradora"
}
