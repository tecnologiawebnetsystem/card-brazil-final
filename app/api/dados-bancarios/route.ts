import type { NextRequest } from "next/server"
import { apiResponse, apiError } from "@/lib/api-response"
import { query } from "@/lib/database"
import { apiAuthError, requireCadastroAccess } from "@/lib/api-auth"

export async function GET(request: NextRequest) {
  try {
    const { administradoraId } = await requireCadastroAccess("view")
    const sp = request.nextUrl.searchParams
    const params: unknown[] = [administradoraId]
    const conditions: string[] = ["p.administradora_id = $1", "p.deleted_at IS NULL"]
    const pessoaId = sp.get("pessoa_id")
    if (pessoaId) {
      params.push(Number.parseInt(pessoaId, 10))
      conditions.push(`db.pessoa_id = $${params.length}`)
    }
    return apiResponse(
      await query(
        `SELECT db.id, db.pessoa_id, db.banco_codigo, db.banco_nome, db.agencia, db.agencia_digito, db.conta, db.conta_digito, db.tipo_conta, db.pix_tipo, db.pix_chave, db.is_principal, db.created_at, db.updated_at
           FROM dados_bancarios db
           JOIN pessoas p ON p.id = db.pessoa_id
          WHERE ${conditions.join(" AND ")}
          ORDER BY db.id DESC`,
        params,
      ),
      "Contas bancárias listadas com sucesso",
    )
  } catch (error: any) { return apiError(error.message, 500) }
}
export async function POST(request: NextRequest) {
  try {
    const { administradoraId } = await requireCadastroAccess("create")
    const body = await request.json()
    if (!body.pessoa_id) return apiError("pessoa_id é obrigatório", 400)
    const pessoa = await query("SELECT id FROM pessoas WHERE id = $1 AND administradora_id = $2 AND deleted_at IS NULL", [body.pessoa_id, administradoraId])
    if (!pessoa.length) return apiError("Pessoa não encontrada para esta administradora", 404)
    const rows = await query(`INSERT INTO dados_bancarios (pessoa_id, banco_codigo, banco_nome, agencia, agencia_digito, conta, conta_digito, tipo_conta, pix_tipo, pix_chave, is_principal) VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11) RETURNING id, pessoa_id, banco_codigo, banco_nome, agencia, agencia_digito, conta, conta_digito, tipo_conta, pix_tipo, pix_chave, is_principal`, [body.pessoa_id, body.banco_codigo || null, body.banco_nome || null, body.agencia || null, body.agencia_digito || null, body.conta || null, body.conta_digito || null, body.tipo_conta || null, body.pix_tipo || null, body.pix_chave || null, body.is_principal ?? body.principal ?? false])
    return apiResponse(rows[0], "Conta bancária criada com sucesso", 201)
  } catch (error: any) { return apiError(error.message, 500) }
}
