import { cookies } from "next/headers"
import { AuthService } from "@/lib/auth-service"

export type CadastroPermission = "view" | "create" | "edit" | "toggle" | "delete"

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

export async function requireCadastroAccess(permission: CadastroPermission = "view") {
  const context = await getAuthContext()
  if (!context) throw new Error("UNAUTHENTICATED")
  const permissions = (context.profile.permissions ?? {}) as Record<string, boolean>
  const isAdmin = context.profile.tipo_usuario === "admin" || context.profile.tipo_usuario === "administrador"
  const key = `cadastros.${permission}`
  if (!isAdmin && permissions[key] === false) throw new Error("FORBIDDEN")
  return context
}

export function authErrorStatus(error: unknown) {
  if (error instanceof Error && error.message === "UNAUTHENTICATED") return 401
  if (error instanceof Error && error.message === "FORBIDDEN") return 403
  return 500
}

export function isScopedColumn(column: string) {
  return column === "administradora_id" || column === "id_administradora"
}
