import { query } from "@/back-end/lib/database"
import type { AuthorizationContext } from "@/back-end/security/authorization"

export async function recordAuthorizationDenied(
  context: AuthorizationContext,
  resource: string,
  action: string,
) {
  try {
    await query(
      `INSERT INTO logs_autenticacao
        (administradora_id, usuario_id, email, acao, detalhes)
       VALUES ($1, $2, $3, $4, $5)`,
      [
        context.administradoraId,
        context.userId,
        String(context.profile.email ?? ""),
        "authorization_denied",
        JSON.stringify({ resource, action }),
      ],
    )
  } catch {
    // A auditoria nunca deve impedir a resposta de autorização.
  }
}
