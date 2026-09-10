import { type NextRequest, NextResponse } from "next/server"
import { successResponse, errorResponse, handleApiError } from "@/lib/api-response"
import { query } from "@/lib/database"
import { requireCadastroAccess, apiAuthError } from "@/lib/api-auth"

function failure(error: unknown) { const auth = apiAuthError(error); return { body: auth ? { success: false, message: auth.message } : handleApiError(error), status: auth?.status || 500 } }

export async function GET(_: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try { const { administradoraId } = await requireCadastroAccess("view"); const { id } = await params; const rows = await query("SELECT * FROM planos WHERE id = $1 AND administradora_id = $2 AND deleted_at IS NULL", [Number(id), administradoraId]); return rows[0] ? NextResponse.json(successResponse(rows[0])) : NextResponse.json(errorResponse("Plano não encontrado"), { status: 404 }) } catch (error) { const result = failure(error); return NextResponse.json(result.body, { status: result.status }) }
}

export async function PUT(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { administradoraId } = await requireCadastroAccess("edit")
    const { id } = await params
    const body = await request.json()
    const normalized = { nome: body.nome, codigo_ans: body.codigo_ans ?? body.codigo, tipo_plano: body.tipo_plano ?? body.tipo, valor_base: body.valor_base ?? body.valor, descricao: body.descricao ?? body.cobertura, status: body.status ?? (body.ativo === false ? "inativo" : "ativo") }
    const entries = Object.entries(normalized).filter(([, value]) => value !== undefined)
    if (!entries.length) return NextResponse.json(errorResponse("Nenhum campo válido para atualizar"), { status: 400 })
    const values = entries.map(([, value]) => value); const updates = entries.map(([key], index) => `${key} = $${index + 1}`); values.push(Number(id), administradoraId)
    const rows = await query(`UPDATE planos SET ${updates.join(", ")}, updated_at = CURRENT_TIMESTAMP WHERE id = $${values.length - 1} AND administradora_id = $${values.length} AND deleted_at IS NULL RETURNING *`, values)
    return rows[0] ? NextResponse.json(successResponse(rows[0], "Plano atualizado com sucesso")) : NextResponse.json(errorResponse("Plano não encontrado"), { status: 404 })
  } catch (error) { const result = failure(error); return NextResponse.json(result.body, { status: result.status }) }
}

export async function DELETE(_: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try { const { administradoraId } = await requireCadastroAccess("delete"); const { id } = await params; const rows = await query("UPDATE planos SET deleted_at = CURRENT_TIMESTAMP, updated_at = CURRENT_TIMESTAMP WHERE id = $1 AND administradora_id = $2 AND deleted_at IS NULL RETURNING id", [Number(id), administradoraId]); return rows[0] ? NextResponse.json(successResponse(null, "Plano excluído com sucesso")) : NextResponse.json(errorResponse("Plano não encontrado"), { status: 404 }) } catch (error) { const result = failure(error); return NextResponse.json(result.body, { status: result.status }) }
}
