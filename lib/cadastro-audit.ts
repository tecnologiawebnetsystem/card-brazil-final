import { query } from "@/lib/database"

export type CadastroAuditAction = "create" | "update" | "delete" | "toggle"

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
      JSON.stringify(input.before ?? null),
      JSON.stringify(input.after ?? null),
    ],
  )
}
