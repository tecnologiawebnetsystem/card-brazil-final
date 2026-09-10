import { type NextRequest, NextResponse } from "next/server"
import { query } from "@/lib/database"
import { requireCadastroAccess, apiAuthError } from "@/lib/api-auth"
import { successResponse, errorResponse, handleApiError, apiError } from "@/lib/api-response"
export async function GET(_: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { administradoraId } = await requireCadastroAccess("view")
    const { id } = await params
    const rows = await query("SELECT *, (status = 'ativo') AS ativo FROM operadoras WHERE id = $1 AND administradora_id = $2 AND deleted_at IS NULL", [Number(id), administradoraId])
    return rows[0] ? NextResponse.json(successResponse(rows[0])) : NextResponse.json(errorResponse("Operadora não encontrada"), { status: 404 })
  } catch (error) {
    const auth = apiAuthError(error)
    return NextResponse.json(auth ? { success: false, message: auth.message } : handleApiError(error), { status: auth?.status || 500 })
  }
}

export async function PUT(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { administradoraId } = await requireCadastroAccess("update")
    const { id } = await params
    const body = await request.json()
    const naturezaOperadora = String(body.natureza_operadora || "").trim()
    const registroANS = String(body.registro_ans || "").trim()
    const pessoaId = Number(body.pessoa_id)
    if (!pessoaId || !naturezaOperadora || !registroANS) return apiError("Pessoa, natureza e registro ANS são obrigatórios", 400)
    const rows = await query(
      `UPDATE operadoras SET pessoa_id = $1, natureza_operadora = $2, registro_ans = $3, status = $4, updated_at = NOW()
       WHERE id = $5 AND administradora_id = $6 AND deleted_at IS NULL
       RETURNING *, (status = 'ativo') AS ativo`,
      [pessoaId, naturezaOperadora, registroANS, body.ativo === false ? "inativo" : "ativo", Number(id), administradoraId],
    )
    return rows[0] ? NextResponse.json(successResponse(rows[0], "Operadora atualizada com sucesso")) : NextResponse.json(errorResponse("Operadora não encontrada"), { status: 404 })
  } catch (error) {
    const auth = apiAuthError(error)
    return NextResponse.json(auth ? { success: false, message: auth.message } : handleApiError(error), { status: auth?.status || 500 })
  }
}

export async function DELETE(_: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { administradoraId } = await requireCadastroAccess("delete")
    const { id } = await params
    const rows = await query("UPDATE operadoras SET deleted_at = NOW(), updated_at = NOW() WHERE id = $1 AND administradora_id = $2 AND deleted_at IS NULL RETURNING id", [Number(id), administradoraId])
    return rows[0] ? NextResponse.json(successResponse(null, "Operadora excluída com sucesso")) : NextResponse.json(errorResponse("Operadora não encontrada"), { status: 404 })
  } catch (error) {
    const auth = apiAuthError(error)
    return NextResponse.json(auth ? { success: false, message: auth.message } : handleApiError(error), { status: auth?.status || 500 })
  }
}
