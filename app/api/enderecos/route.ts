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
    const pessoaId = sp.get("pessoa_id") || sp.get("id_administradora")
    if (pessoaId) {
      params.push(Number.parseInt(pessoaId, 10))
      conditions.push(`e.pessoa_id = $${params.length}`)
    }
    return apiResponse(
      await query(
        `SELECT e.*
           FROM enderecos e
           JOIN pessoas p ON p.id = e.pessoa_id
          WHERE ${conditions.join(" AND ")}
          ORDER BY e.id DESC`,
        params,
      ),
      "Endereços listados com sucesso",
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
    const rows = await query(`INSERT INTO enderecos (pessoa_id, tipo_endereco, cep, logradouro, numero, complemento, bairro, cidade, estado, pais, is_principal) VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11) RETURNING *`, [body.pessoa_id, body.tipo_endereco || "residencial", body.cep || null, body.logradouro || null, body.numero || null, body.complemento || null, body.bairro || null, body.cidade || null, body.estado || null, body.pais || "Brasil", body.is_principal ?? body.principal ?? false])
    return apiResponse(rows[0], "Endereço criado com sucesso", 201)
  } catch (error: any) { return apiError(error.message, 500) }
}
