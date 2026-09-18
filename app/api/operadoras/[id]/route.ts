import { type NextRequest, NextResponse } from "next/server"
import { query } from "@/lib/database"
import { requireCadastroAccess, apiAuthError } from "@/lib/api-auth"
import { successResponse, errorResponse, handleApiError, apiError } from "@/lib/api-response"
export async function GET(_: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { administradoraId } = await requireCadastroAccess("view")
    const { id } = await params
    const rows = await query(
      `SELECT op.*, (op.status = 'ativo') AS ativo,
              COALESCE(p.nome_completo, p.razao_social, p.nome_fantasia) AS pessoa_nome,
              pf.cpf AS pessoa_cpf,
              pj.cnpj AS pessoa_cnpj
         FROM operadoras op
         JOIN pessoas p ON p.id = op.pessoa_id AND p.administradora_id = op.administradora_id
         LEFT JOIN pessoas_fisicas pf ON pf.pessoa_id = p.id
         LEFT JOIN pessoas_juridicas pj ON pj.pessoa_id = p.id
        WHERE op.id = $1 AND op.administradora_id = $2 AND op.deleted_at IS NULL`,
      [Number(id), administradoraId],
    )
    return rows[0] ? NextResponse.json(successResponse(rows[0])) : NextResponse.json(errorResponse("Operadora não encontrada"), { status: 404 })
  } catch (error) {
    const auth = apiAuthError(error)
    return NextResponse.json(auth ? { success: false, message: auth.message } : handleApiError(error), { status: auth?.status || 500 })
  }
}

export async function PUT(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { administradoraId } = await requireCadastroAccess("edit")
    const { id } = await params
    const body = await request.json()
    const naturezaOperadora = String(body.natureza_operadora || "").trim()
    const registroANS = String(body.registro_ans || "").trim()
    if (!naturezaOperadora || !registroANS) return apiError("Natureza e registro ANS são obrigatórios", 400)
    const rows = await query(
      `UPDATE operadoras SET natureza_operadora = $1, registro_ans = $2, status = $3, updated_at = NOW()
       WHERE id = $4 AND administradora_id = $5 AND deleted_at IS NULL
       RETURNING *, (status = 'ativo') AS ativo`,
      [naturezaOperadora, registroANS, body.ativo === false ? "inativo" : "ativo", Number(id), administradoraId],
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
