import { type NextRequest, NextResponse } from "next/server"
import { successResponse, errorResponse, handleApiError } from "@/back-end/lib/api-response"
import { query } from "@/back-end/lib/database"
import { requireCadastroAccess, apiAuthError } from "@/back-end/lib/api-auth"

function failure(error: unknown) { const auth = apiAuthError(error); return { body: auth ? { success: false, message: auth.message } : handleApiError(error), status: auth?.status || 500 } }

export async function GET(_: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try { const { administradoraId } = await requireCadastroAccess("view"); const { id } = await params; const rows = await query("SELECT * FROM planos WHERE id = $1 AND administradora_id = $2 AND deleted_at IS NULL", [Number(id), administradoraId]); return rows[0] ? NextResponse.json(successResponse(rows[0])) : NextResponse.json(errorResponse("Plano não encontrado"), { status: 404 }) } catch (error) { const result = failure(error); return NextResponse.json(result.body, { status: result.status }) }
}

export async function PUT(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { administradoraId } = await requireCadastroAccess("edit")
    const { id } = await params
    if (!Number.isInteger(Number(id)) || Number(id) <= 0) return NextResponse.json(errorResponse("Identificador inválido"), { status: 400 })
    const body = await request.json()
    const normalized = { nome: body.nome, codigo_ans: body.codigo_ans ?? body.codigo, tipo_plano: body.tipo_plano ?? body.tipo, valor_base: body.valor_base ?? body.valor, descricao: body.descricao ?? body.cobertura, produto_id: body.produto_id, operadora_id: body.operadora_id, status: body.status ?? (body.ativo === false ? "inativo" : "ativo") }
    const entries = Object.entries(normalized).filter(([, value]) => value !== undefined)
    if (!entries.length) return NextResponse.json(errorResponse("Nenhum campo válido para atualizar"), { status: 400 })
    const planoAtual = await query("SELECT produto_id FROM planos WHERE id = $1 AND administradora_id = $2 AND deleted_at IS NULL", [Number(id), administradoraId])
    if (!planoAtual.length) return NextResponse.json(errorResponse("Plano não encontrado"), { status: 404 })
    const produtoId = Number(normalized.produto_id ?? planoAtual[0].produto_id)
    if (!Number.isInteger(produtoId) || produtoId <= 0) return NextResponse.json(errorResponse("Vincule um produto ao plano antes de atualizá-lo."), { status: 422 })
    const produto = await query("SELECT id FROM produtos WHERE id = $1 AND administradora_id = $2 AND deleted_at IS NULL", [produtoId, administradoraId])
    if (!produto.length) return NextResponse.json(errorResponse("Produto não encontrado"), { status: 422 })
    if (normalized.produto_id !== undefined) normalized.produto_id = produtoId
    if (normalized.operadora_id !== undefined) {
      const operadoraId = Number(normalized.operadora_id)
      if (!Number.isInteger(operadoraId) || operadoraId <= 0) return NextResponse.json(errorResponse("Selecione uma operadora cadastrada"), { status: 422 })
      const operadora = await query("SELECT id FROM operadoras WHERE id = $1 AND administradora_id = $2 AND deleted_at IS NULL", [operadoraId, administradoraId])
      if (!operadora.length) return NextResponse.json(errorResponse("Operadora não encontrada"), { status: 422 })
      normalized.operadora_id = operadoraId
    }
    const validEntries = Object.entries(normalized).filter(([, value]) => value !== undefined)
    const values = validEntries.map(([, value]) => value); const updates = validEntries.map(([key], index) => `${key} = $${index + 1}`); values.push(Number(id), administradoraId)
    const rows = await query(`UPDATE planos SET ${updates.join(", ")}, updated_at = CURRENT_TIMESTAMP WHERE id = $${values.length - 1} AND administradora_id = $${values.length} AND deleted_at IS NULL RETURNING *`, values)
    return rows[0] ? NextResponse.json(successResponse(rows[0], "Plano atualizado com sucesso")) : NextResponse.json(errorResponse("Plano não encontrado"), { status: 404 })
  } catch (error) { const result = failure(error); return NextResponse.json(result.body, { status: result.status }) }
}

export async function DELETE(_: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { administradoraId } = await requireCadastroAccess("delete")
    const { id: rawId } = await params
    const id = Number(rawId)
    if (!Number.isInteger(id) || id <= 0) return NextResponse.json(errorResponse("Identificador inválido"), { status: 400 })
    const faixas = await query("SELECT f.id FROM planos_faixas_etarias f JOIN planos p ON p.id = f.plano_id WHERE p.id = $1 AND p.administradora_id = $2 LIMIT 1", [id, administradoraId])
    if (faixas.length) return NextResponse.json(errorResponse("Não é possível excluir um plano que já possui faixas etárias cadastradas."), { status: 409 })
    const rows = await query("UPDATE planos SET deleted_at = CURRENT_TIMESTAMP, updated_at = CURRENT_TIMESTAMP WHERE id = $1 AND administradora_id = $2 AND deleted_at IS NULL RETURNING id", [id, administradoraId])
    return rows[0] ? NextResponse.json(successResponse(null, "Plano excluído com sucesso")) : NextResponse.json(errorResponse("Plano não encontrado"), { status: 404 })
  } catch (error) {
    const result = failure(error)
    return NextResponse.json(result.body, { status: result.status })
  }
}
