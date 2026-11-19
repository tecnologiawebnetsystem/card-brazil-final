import { query } from "@/back-end/lib/database"
import type { AuthorizationContext } from "@/back-end/security/authorization"

export async function recordAuthorizationDenied(
  context: AuthorizationContext,
  resource: string,
  action: string,
) {
  try {
    await query(
      `INSERT INTO auditoria_cadastros
        (administradora_id, usuario_id, acao, tabela, registro_id, dados_novos)
       VALUES ($1, $2, $3, $4, $5, $6::jsonb)`,
      [
        context.administradoraId,
        context.userId,
        "access_denied",
        "autorizacao",
        context.userId,
        JSON.stringify({ resource, action }),
      ],
    )
  } catch {
    // A auditoria nunca deve impedir a resposta de autorização.
  }
}
