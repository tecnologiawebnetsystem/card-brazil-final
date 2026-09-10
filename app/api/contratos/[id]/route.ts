import { type NextRequest, NextResponse } from "next/server"
import { query } from "@/lib/database"
import { requireCadastroAccess, apiAuthError } from "@/lib/api-auth"
import { successResponse, errorResponse, handleApiError } from "@/lib/api-response"

export async function GET(_: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { administradoraId } = await requireCadastroAccess("view")
    const id = Number.parseInt((await params).id, 10)
    const rows = await query("SELECT *, numero_contrato AS numero FROM contratos WHERE id = $1 AND administradora_id = $2 AND deleted_at IS NULL", [id, administradoraId])
    return rows[0]
      ? NextResponse.json(successResponse(rows[0]))
      : NextResponse.json(errorResponse("Contrato não encontrado"), { status: 404 })
  } catch (error) {
    const auth = apiAuthError(error)
    return NextResponse.json(auth ? { success: false, message: auth.message } : handleApiError(error), { status: auth?.status || 500 })
  }
}

export async function PUT(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { administradoraId } = await requireCadastroAccess("update")
    const id = Number.parseInt((await params).id, 10)
    const body = await request.json()
    const numeroContrato = String(body.numero_contrato || body.numero || "").trim()
    if (!body.operadora_id || !numeroContrato || !body.data_inicio) {
      return NextResponse.json({ success: false, message: "operadora_id, número do contrato e data de início são obrigatórios" }, { status: 400 })
    }
    const rows = await query(
      `UPDATE contratos SET operadora_id = $1, estipulante_id = $2, numero_contrato = $3, data_inicio = $4, data_fim = $5, quantidade_vidas = $6, status = $7, updated_at = NOW()
       WHERE id = $8 AND administradora_id = $9 AND deleted_at IS NULL
       RETURNING *, numero_contrato AS numero`,
      [body.operadora_id, body.estipulante_id || null, numeroContrato, body.data_inicio, body.data_fim || null, body.quantidade_vidas || 0, String(body.status || "ativo").toLowerCase(), id, administradoraId],
    )
    return rows[0]
      ? NextResponse.json(successResponse(rows[0], "Contrato atualizado com sucesso"))
      : NextResponse.json(errorResponse("Contrato não encontrado"), { status: 404 })
  } catch (error) {
    const auth = apiAuthError(error)
    return NextResponse.json(auth ? { success: false, message: auth.message } : handleApiError(error), { status: auth?.status || 500 })
  }
}

export async function DELETE(_: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { administradoraId } = await requireCadastroAccess("delete")
    const id = Number.parseInt((await params).id, 10)
    const rows = await query("UPDATE contratos SET deleted_at = NOW(), updated_at = NOW() WHERE id = $1 AND administradora_id = $2 AND deleted_at IS NULL RETURNING id", [id, administradoraId])
    return rows[0]
      ? NextResponse.json(successResponse(null, "Contrato excluído com sucesso"))
      : NextResponse.json(errorResponse("Contrato não encontrado"), { status: 404 })
  } catch (error) {
    const auth = apiAuthError(error)
    return NextResponse.json(auth ? { success: false, message: auth.message } : handleApiError(error), { status: auth?.status || 500 })
  }
}
