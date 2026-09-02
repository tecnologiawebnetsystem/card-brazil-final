import type { NextRequest } from "next/server"
import { apiResponse, apiError } from "@/lib/api-response"
import { query } from "@/lib/database"

export async function GET(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const { id } = params
    const pessoaId = Number.parseInt(id)
    const pessoaRows = await query(`SELECT * FROM pessoas WHERE id = $1 AND deleted_at IS NULL`, [pessoaId])
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
    return apiError(error.message, 500)
  }
}

export async function PUT(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const { id } = params
    const body = await request.json()
    const pessoaId = Number.parseInt(id, 10)
    const allowed = ["tipo_pessoa", "nome_completo", "cpf", "rg", "email", "telefone_principal", "razao_social", "nome_fantasia", "cnpj", "status"]
    const entries = Object.entries(body).filter(([key]) => allowed.includes(key))
    if (!entries.length) return apiError("Nenhum campo válido para atualizar", 400)
    const values = entries.map(([, value]) => value)
    const updates = entries.map(([key], index) => `${key} = $${index + 1}`)
    values.push(pessoaId)
    const rows = await query(`UPDATE pessoas SET ${updates.join(", ")}, updated_at = CURRENT_TIMESTAMP WHERE id = $${values.length} AND deleted_at IS NULL RETURNING *`, values)
    if (!rows.length) return apiError("Pessoa não encontrada", 404)
    return apiResponse(rows[0], "Pessoa atualizada com sucesso")
  } catch (error: any) {
    console.error("[v0] Erro ao atualizar pessoa:", error)
    return apiError(error.message, 500)
  }
}

export async function DELETE(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const { id } = params
    const pessoaId = Number.parseInt(id, 10)
    const rows = await query(`UPDATE pessoas SET deleted_at = CURRENT_TIMESTAMP, updated_at = CURRENT_TIMESTAMP WHERE id = $1 AND deleted_at IS NULL RETURNING id`, [pessoaId])
    if (!rows.length) return apiError("Pessoa não encontrada", 404)
    return apiResponse(null, "Pessoa excluída com sucesso")
  } catch (error: any) {
    console.error("[v0] Erro ao excluir pessoa:", error)
    return apiError(error.message, 500)
  }
}
