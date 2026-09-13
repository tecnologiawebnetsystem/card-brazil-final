import type { NextRequest } from "next/server"
import { apiResponse, apiError } from "@/lib/api-response"
import { apiAuthError, requireCadastroAccess } from "@/lib/api-auth"
import { idSchema, pessoaUpdateSchema, zodFieldErrors } from "@/lib/validation"
import { getPessoa, savePessoaDetalhe } from "@/lib/pessoas-repository"
import { query } from "@/lib/database"

function normalizePayload(body: Record<string, any>) {
  return { ...body, nome_completo: body.nome_completo ?? body.nome ?? null, telefone_principal: body.telefone_principal ?? body.telefone ?? null, telefone_secundario: body.telefone_secundario ?? body.celular ?? null, nome_fantasia: body.nome_fantasia ?? body.razao_abreviada ?? null, data_fundacao: body.data_fundacao ?? body.data_abertura ?? null }
}

export async function GET(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { administradoraId } = await requireCadastroAccess("view")
    const pessoaId = idSchema.parse((await params).id)
    const pessoa = await getPessoa(pessoaId, administradoraId)
    if (!pessoa) return apiError("Pessoa não encontrada", 404)
    const [enderecos, dados_bancarios] = await Promise.all([query(`SELECT * FROM enderecos WHERE pessoa_id = $1 ORDER BY id`, [pessoaId]), query(`SELECT id, pessoa_id, banco_id, agencia, conta, tipo_conta, pix, status FROM dados_bancarios WHERE pessoa_id = $1 ORDER BY id`, [pessoaId])])
    return apiResponse({ ...pessoa, enderecos, dados_bancarios }, "Pessoa encontrada com sucesso")
  } catch (error: any) {
    const authError = apiAuthError(error)
    return authError ? apiError(authError.message, authError.status) : apiError("Não foi possível processar a pessoa", 500)
  }
}

export async function PUT(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { administradoraId } = await requireCadastroAccess("edit")
    const pessoaId = idSchema.parse((await params).id)
    const parsed = pessoaUpdateSchema.safeParse(normalizePayload(await request.json()))
    if (!parsed.success) return apiError("Dados da pessoa inválidos", 400, zodFieldErrors(parsed.error))
    const safeBody = parsed.data as Record<string, any>
    const allowed = ["tipo_pessoa", "nome_completo", "email", "telefone_principal", "telefone_secundario", "telefone_comercial", "foto_url", "observacoes", "status"]
    const entries = Object.entries(safeBody).filter(([key]) => allowed.includes(key))
    if (!entries.length) return apiError("Nenhum campo válido para atualizar", 400)
    const values = entries.map(([, value]) => value)
    values.push(pessoaId, administradoraId)
    const updates = entries.map(([key], index) => `${key} = $${index + 1}`)
    const rows = await query(`UPDATE pessoas SET ${updates.join(", ")}, updated_at = CURRENT_TIMESTAMP WHERE id = $${values.length - 1} AND administradora_id = $${values.length} AND deleted_at IS NULL RETURNING id`, values)
    if (!rows.length) return apiError("Pessoa não encontrada", 404)
    await savePessoaDetalhe(pessoaId, safeBody)
    return apiResponse(await getPessoa(pessoaId, administradoraId), "Pessoa atualizada com sucesso")
  } catch (error: any) {
    const authError = apiAuthError(error)
    return authError ? apiError(authError.message, authError.status) : apiError("Não foi possível processar a pessoa", 500)
  }
}

export async function DELETE(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { administradoraId } = await requireCadastroAccess("delete")
    const pessoaId = idSchema.parse((await params).id)
    const rows = await query(`UPDATE pessoas SET deleted_at = CURRENT_TIMESTAMP, updated_at = CURRENT_TIMESTAMP WHERE id = $1 AND administradora_id = $2 AND deleted_at IS NULL RETURNING id`, [pessoaId, administradoraId])
    if (!rows.length) return apiError("Pessoa não encontrada", 404)
    return apiResponse(null, "Pessoa excluída com sucesso")
  } catch (error: any) {
    const authError = apiAuthError(error)
    return authError ? apiError(authError.message, authError.status) : apiError("Não foi possível processar a pessoa", 500)
  }
}
