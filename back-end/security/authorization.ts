import { query } from "@/back-end/lib/database"
import { recordAuthorizationDenied } from "@/back-end/security/audit"

export type PermissionAction = "view" | "create" | "edit" | "toggle" | "delete" | "approve" | "export"
export type PermissionResource = "cadastros" | "sistemas" | "financeiro" | "cobranca" | "usuarios" | "perfis" | "alçadas" | "relatorios"
export type PermissionKey = `${PermissionResource}.${PermissionAction}`

export interface AuthorizationContext {
  userId: number
  administradoraId: number
  profile: Record<string, unknown>
}

export interface AuthorizationResult {
  allowed: boolean
  reason: "admin" | "assigned" | "legacy" | "denied"
  scope: "tenant" | "own" | "team" | "all"
}

const RESOURCE_ALIASES: Record<string, PermissionResource> = {
  cadastro: "cadastros",
  cadastros: "cadastros",
  sistema: "sistemas",
  sistemas: "sistemas",
  usuario: "usuarios",
  usuarios: "usuarios",
  perfil: "perfis",
  perfis: "perfis",
  alçada: "alçadas",
  alcada: "alçadas",
  financeiro: "financeiro",
  cobranca: "cobranca",
  cobrança: "cobranca",
  relatorio: "relatorios",
  relatorios: "relatorios",
}

function isAdministrator(context: AuthorizationContext) {
  const role = String(context.profile.tipo_usuario ?? context.profile.role ?? "").toLowerCase()
  return role === "admin" || role === "administrador"
}

function getLegacyPermissions(context: AuthorizationContext) {
  return (context.profile.permissions ?? {}) as Record<string, boolean>
}

function normalizeKey(resource: string, action: PermissionAction): PermissionKey {
  const normalized = RESOURCE_ALIASES[resource.toLowerCase()] ?? resource
  return `${normalized}.${action}` as PermissionKey
}

function getScope(context: AuthorizationContext): AuthorizationResult["scope"] {
  const scope = String(context.profile.permission_scope ?? context.profile.escopo ?? "tenant").toLowerCase()
  if (scope === "all" || scope === "own" || scope === "team") return scope
  return "tenant"
}

export async function authorize(
  context: AuthorizationContext,
  resource: string,
  action: PermissionAction,
): Promise<AuthorizationResult> {
  if (isAdministrator(context)) return { allowed: true, reason: "admin", scope: "all" }

  const key = normalizeKey(resource, action)
  const legacyPermissions = getLegacyPermissions(context)
  if (legacyPermissions[key] === true) {
    return { allowed: true, reason: "legacy", scope: getScope(context) }
  }

  try {
    const rows = await query<{ permitido: boolean; escopo: string | null }>(
      `SELECT pp.permitido, pp.escopo
       FROM sistema_usuario_perfis up
       JOIN sistema_perfil_permissoes pp
         ON pp.administradora_id = up.administradora_id
        AND pp.perfil_nome = up.perfil_nome
       JOIN sistemas_recursos r ON r.id = pp.recurso_id AND r.ativo = TRUE
       JOIN sistemas_acoes a ON a.id = pp.acao_id AND a.ativo = TRUE
       WHERE up.administradora_id = $1
         AND up.usuario_id = $2
         AND up.ativo = TRUE
         AND r.slug = $3
         AND a.slug = $4
         AND (up.vigencia_inicio IS NULL OR up.vigencia_inicio <= CURRENT_DATE)
         AND (up.vigencia_fim IS NULL OR up.vigencia_fim >= CURRENT_DATE)
       LIMIT 1`,
      [context.administradoraId, context.userId, key.split(".")[0], action === "toggle" ? "editar" : action],
    )
    if (rows[0]?.permitido) {
      const scope = rows[0].escopo === "all" || rows[0].escopo === "own" || rows[0].escopo === "team" ? rows[0].escopo : "tenant"
      return { allowed: true, reason: "assigned", scope }
    }
  } catch {
    // Permissões legadas continuam válidas durante a migração do modelo atual.
  }

  return { allowed: false, reason: "denied", scope: "tenant" }
}

export async function requirePermission(context: AuthorizationContext, resource: string, action: PermissionAction) {
  const result = await authorize(context, resource, action)
  if (!result.allowed) {
    await recordAuthorizationDenied(context, resource, action)
    throw new Error("FORBIDDEN")
  }
  return { context, authorization: result }
}

export function hasPermission(context: AuthorizationContext, resource: string, action: PermissionAction) {
  if (isAdministrator(context)) return true
  return getLegacyPermissions(context)[normalizeKey(resource, action)] === true
}
