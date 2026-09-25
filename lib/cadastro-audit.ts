import { query } from "@/lib/database"

export type CadastroAuditAction = "create" | "update" | "delete" | "toggle" | "approve" | "reject" | "permission_change" | "payment" | "settlement" | "reconciliation" | "negotiation" | "parameter_change" | "bank_processing" | "integration" | "login" | "logout" | "login_failed"

const SENSITIVE_KEYS = new Set(["senha", "password", "token", "access_token", "refresh_token", "secret", "jwt_secret", "api_key", "resend_api_key"])

function sanitizeAuditValue(value: unknown): unknown {
  if (Array.isArray(value)) return value.map(sanitizeAuditValue)
  if (!value || typeof value !== "object") return value
  return Object.fromEntries(Object.entries(value as Record<string, unknown>).map(([key, nested]) => [key, SENSITIVE_KEYS.has(key.toLowerCase()) ? "[REDACTED]" : sanitizeAuditValue(nested)]))
}

export async function recordCadastroAudit(input: {
  administradoraId: number
  userId: number
  action: CadastroAuditAction
  tableName: string
  recordId: number
  before?: unknown
  after?: unknown
}) {
  await query(
    `INSERT INTO auditoria_cadastros
      (administradora_id, usuario_id, acao, tabela, registro_id, dados_anteriores, dados_novos)
     VALUES ($1, $2, $3, $4, $5, $6::jsonb, $7::jsonb)`,
    [
      input.administradoraId,
      input.userId,
      input.action,
      input.tableName,
      input.recordId,
      JSON.stringify(sanitizeAuditValue(input.before ?? null)),
      JSON.stringify(sanitizeAuditValue(input.after ?? null)),
    ],
  )
}
