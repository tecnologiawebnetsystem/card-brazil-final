import type { NextRequest } from "next/server"
import { apiResponse, apiError } from "@/lib/api-response"
import { query } from "@/lib/database"
import { apiAuthError, requireCadastroAccess } from "@/lib/api-auth"
import { idSchema, pessoaSchema, zodFieldErrors } from "@/lib/validation"

export async function GET(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { administradoraId } = await requireCadastroAccess("view")
    const { id } = await params
    const pessoaId = idSchema.parse(id)
    const pessoaRows = await query(`SELECT * FROM pessoas WHERE id = $1 AND administradora_id = $2 AND deleted_at IS NULL`, [pessoaId, administradoraId])
    const pessoa = pessoaRows[0]

    if (!pessoa) {
      return apiError("Pessoa não encontrada", 404)
    }

    const [enderecos, dados_bancarios] = await Promise.all([
      query(`SELECT * FROM enderecos WHERE pessoa_id = $1 ORDER BY id`, [pessoaId]),
      query(`SELECT id, pessoa_id, banco_id, agencia, conta, tipo_conta, pix, status FROM dados_bancarios WHERE pessoa_id = $1 ORDER BY id`, [pessoaId]),
    ])

    return apiResponse({ ...pessoa, enderecos, dados_bancarios }, "Pessoa encontrada com sucesso")
  } catch (error: any) {
    console.error("[v0] Erro ao buscar pessoa:", error)
    const authError = apiAuthError(error)
    return authError ? apiError(authError.message, authError.status) : apiError("Não foi possível processar a pessoa", 500)
  }
}

export async function PUT(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { administradoraId } = await requireCadastroAccess("edit")
    const { id } = await params
    const body = await request.json()
    const pessoaId = idSchema.parse(id)
    const parsed = pessoaSchema.partial().safeParse(body)
    if (!parsed.success) return apiError("Dados da pessoa inválidos", 400, zodFieldErrors(parsed.error))
    const safeBody = parsed.data
    const allowed = ["tipo_pessoa", "nome_completo", "cpf", "rg", "email", "telefone_principal", "telefone_secundario", "telefone_comercial", "data_nascimento", "sexo", "estado_civil", "nome_mae", "nome_pai", "profissao", "renda_mensal", "razao_social", "nome_fantasia", "cnpj", "observacoes", "status"]
    const entries = Object.entries(safeBody).filter(([key]) => allowed.includes(key))
    if (!entries.length) return apiError("Nenhum campo válido para atualizar", 400)
    const values = entries.map(([, value]) => value)
    const updates = entries.map(([key], index) => `${key} = $${index + 1}`)
    values.push(pessoaId, administradoraId)
    const rows = await query(`UPDATE pessoas SET ${updates.join(", ")}, updated_at = CURRENT_TIMESTAMP WHERE id = $${values.length - 1} AND administradora_id = $${values.length} AND deleted_at IS NULL RETURNING *`, values)
    if (!rows.length) return apiError("Pessoa não encontrada", 404)
    return apiResponse(rows[0], "Pessoa atualizada com sucesso")
  } catch (error: any) {
    console.error("[v0] Erro ao atualizar pessoa:", error)
    const authError = apiAuthError(error)
    return authError ? apiError(authError.message, authError.status) : apiError("Não foi possível processar a pessoa", 500)
  }
}

export async function DELETE(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { administradoraId } = await requireCadastroAccess("delete")
    const { id } = await params
    const pessoaId = idSchema.parse(id)
    const rows = await query(`UPDATE pessoas SET deleted_at = CURRENT_TIMESTAMP, updated_at = CURRENT_TIMESTAMP WHERE id = $1 AND administradora_id = $2 AND deleted_at IS NULL RETURNING id`, [pessoaId, administradoraId])
    if (!rows.length) return apiError("Pessoa não encontrada", 404)
    return apiResponse(null, "Pessoa excluída com sucesso")
  } catch (error: any) {
    console.error("[v0] Erro ao excluir pessoa:", error)
    const authError = apiAuthError(error)
    return authError ? apiError(authError.message, authError.status) : apiError("Não foi possível processar a pessoa", 500)
  }
}
