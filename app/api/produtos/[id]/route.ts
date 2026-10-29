import { type NextRequest, NextResponse } from "next/server"
import { apiError, handleApiError, successResponse } from "@/back-end/lib/api-response"
import { apiAuthError, requireCadastroAccess } from "@/back-end/lib/api-auth"
import { query } from "@/back-end/lib/database"
import { produtoSchema, zodFieldErrors } from "@/back-end/lib/validation"

function parseId(value: string) {
  const id = Number(value)
  return Number.isInteger(id) && id > 0 ? id : null
}

function mutationError(error: unknown) {
  const response = handleApiError(error)
  return response.code === "CONFLICT" ? 409 : response.code === "REFERENCE_ERROR" ? 422 : 500
}

async function getProduto(id: number, administradoraId: number) {
  const rows = await query(
    `SELECT p.id, p.administradora_id, p.plano_id, p.nome, p.codigo_produto AS codigo, p.valor_mensalidade AS valor,
            p.idade_minima, p.idade_maxima, p.status, (p.status = 'ativo') AS ativo, p.created_at, p.updated_at, p.deleted_at,
            pl.nome AS plano_nome
     FROM produtos p JOIN planos pl ON pl.id = p.plano_id AND pl.administradora_id = p.administradora_id
     WHERE p.id = $1 AND p.administradora_id = $2 AND p.deleted_at IS NULL`,
    [id, administradoraId],
  )
  return rows[0]
}

export async function GET(_request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { administradoraId } = await requireCadastroAccess("view")
    const id = parseId((await params).id)
    if (!id) return apiError("Identificador inválido", 400)
    const produto = await getProduto(id, administradoraId)
    return produto ? NextResponse.json(successResponse(produto)) : apiError("Produto não encontrado", 404)
  } catch (error) {
    const auth = apiAuthError(error)
    if (auth) return apiError(auth.message, auth.status)
    console.error("[v0] Erro ao consultar produto", error)
    return apiError("Não foi possível consultar o produto", 500)
  }
}

export async function PUT(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { administradoraId } = await requireCadastroAccess("edit")
    const id = parseId((await params).id)
    if (!id) return apiError("Identificador inválido", 400)
    const parsed = produtoSchema.partial().safeParse(await request.json())
    if (!parsed.success) return apiError("Dados do produto inválidos", 422, zodFieldErrors(parsed.error))
    const data = parsed.data
    const entries: Array<[string, unknown]> = []
    if (data.nome !== undefined) entries.push(["nome", data.nome])
    if (data.codigo !== undefined) entries.push(["codigo_produto", data.codigo])
    if (data.valor !== undefined || data.valor_mensalidade !== undefined) entries.push(["valor_mensalidade", data.valor_mensalidade ?? data.valor])
    if (data.idade_minima !== undefined) entries.push(["idade_minima", data.idade_minima])
    if (data.idade_maxima !== undefined) entries.push(["idade_maxima", data.idade_maxima])
    if (data.status !== undefined) entries.push(["status", data.status])
    if (data.plano_id !== undefined) {
      if (!data.plano_id) return apiError("Plano é obrigatório", 422)
      const plano = await query("SELECT id FROM planos WHERE id = $1 AND administradora_id = $2 AND deleted_at IS NULL", [data.plano_id, administradoraId])
      if (!plano.length) return apiError("Plano não encontrado", 404)
      entries.push(["plano_id", data.plano_id])
    }
    if (!entries.length) return apiError("Nenhum campo válido para atualizar", 400)
    const values = entries.map(([, value]) => value)
    const updates = entries.map(([column], index) => `${column} = $${index + 1}`)
    values.push(id, administradoraId)
    const rows = await query(`UPDATE produtos SET ${updates.join(", ")}, updated_at = CURRENT_TIMESTAMP WHERE id = $${values.length - 1} AND administradora_id = $${values.length} AND deleted_at IS NULL RETURNING id`, values)
    if (!rows.length) return apiError("Produto não encontrado", 404)
    return NextResponse.json(successResponse(await getProduto(id, administradoraId), "Produto atualizado com sucesso"))
  } catch (error) {
    const auth = apiAuthError(error)
    if (auth) return apiError(auth.message, auth.status)
    console.error("[v0] Erro ao atualizar produto", error)
    return apiError("Não foi possível atualizar o produto", mutationError(error))
  }
}

export async function DELETE(_request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { administradoraId } = await requireCadastroAccess("delete")
    const id = parseId((await params).id)
    if (!id) return apiError("Identificador inválido", 400)
    const rows = await query("UPDATE produtos SET deleted_at = CURRENT_TIMESTAMP, status = 'inativo', updated_at = CURRENT_TIMESTAMP WHERE id = $1 AND administradora_id = $2 AND deleted_at IS NULL RETURNING id", [id, administradoraId])
    return rows.length ? NextResponse.json(successResponse(null, "Produto excluído com sucesso")) : apiError("Produto não encontrado", 404)
  } catch (error) {
    const auth = apiAuthError(error)
    if (auth) return apiError(auth.message, auth.status)
    console.error("[v0] Erro ao excluir produto", error)
    return apiError("Não foi possível excluir o produto", mutationError(error))
  }
}
