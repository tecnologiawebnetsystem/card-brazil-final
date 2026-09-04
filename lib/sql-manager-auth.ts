import { cookies } from "next/headers"
import { AuthService } from "./auth-service"

export async function requireSqlManagerAccess() {
  const token = (await cookies()).get("auth-token")?.value
  if (!token) throw new Error("UNAUTHORIZED")
  const session = await AuthService.verifyToken(token)
  if (!session?.userId) throw new Error("UNAUTHORIZED")
  const user = await AuthService.getUserById(Number(session.userId), Number(session.administradoraId))
  if (!user || !["admin", "administrador", "superadmin"].includes(String(user.tipo_usuario).toLowerCase())) throw new Error("FORBIDDEN")
  return user
}

export function accessError(error: unknown) {
  const status = error instanceof Error && error.message === "FORBIDDEN" ? 403 : 401
  return new Response(JSON.stringify({ success: false, error: status === 403 ? "Acesso restrito a administradores." : "Sessão não autenticada." }), { status, headers: { "content-type": "application/json" } })
}

export function safeIdentifier(value: string) {
  return /^[a-zA-Z_][a-zA-Z0-9_]*$/.test(value) ? value : null
}

export function normalizeSql(sql: string) {
  return sql.trim().replace(/;\s*$/, "")
}

export function getSqlKind(sql: string) {
  return normalizeSql(sql).match(/^([a-z]+)/i)?.[1]?.toUpperCase() || ""
}
