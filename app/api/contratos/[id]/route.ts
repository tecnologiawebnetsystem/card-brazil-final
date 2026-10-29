import { type NextRequest, NextResponse } from "next/server"
import { query } from "@/back-end/lib/database"
import { apiAuthError, requireCadastroAccess } from "@/back-end/lib/api-auth"
import { handleApiError, successResponse } from "@/back-end/lib/api-response"

const allowedStatuses = new Set(["ativo", "inativo", "suspenso", "cancelado", "vencido", "encerrado"])

function isIsoDate(value: unknown): value is string {
  return typeof value === "string" && /^\d{4}-\d{2}-\d{2}$/.test(value)
}

function parseId(value: unknown) {
  const parsed = Number(value)
  return Number.isInteger(parsed) && parsed > 0 ? parsed : null
}

function parseOptionalId(value: unknown) {
  if (value === undefined || value === null || value === "") return null
  return parseId(value)
}

function errorResponse(message: string, status = 400) {
  return NextResponse.json({ success: false, message }, { status })
}

function mapError(error: unknown) {
  const auth = apiAuthError(error)
  if (auth) return { body: { success: false, message: auth.message }, status: auth.status }
  const body = handleApiError(error)
  return { body, status: body.code === "CONFLICT" ? 409 : body.code === "REFERENCE_ERROR" ? 422 : 500 }
}

export async function GET(_: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { administradoraId } = await requireCadastroAccess("view")
    const id = parseId((await params).id)
    if (id === null) return errorResponse("Identificador inválido")
    const rows = await query(
      `SELECT id, administradora_id, operadora_id, estipulante_id, numero_contrato, numero_contrato AS numero,
              data_inicio, data_fim, quantidade_vidas, status, created_at, updated_at, deleted_at
       FROM contratos WHERE id = $1 AND administradora_id = $2 AND deleted_at IS NULL`,
      [id, administradoraId],
    )
    return rows[0]
      ? NextResponse.json(successResponse(rows[0]))
      : errorResponse("Contrato não encontrado", 404)
  } catch (error) {
    const response = mapError(error)
    return NextResponse.json(response.body, { status: response.status })
  }
}

export async function PUT(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { administradoraId } = await requireCadastroAccess("edit")
    const id = parseId((await params).id)
    if (id === null) return errorResponse("Identificador inválido")
    const body = await request.json()
    const numeroContrato = String(body.numero_contrato || body.numero || "").trim()
    const operadoraId = parseOptionalId(body.operadora_id)
    const estipulanteId = parseOptionalId(body.estipulante_id)
    const dataFim = body.data_fim || null
    const quantidadeVidas = body.quantidade_vidas === undefined || body.quantidade_vidas === null || body.quantidade_vidas === ""
      ? 0
      : Number(body.quantidade_vidas)
    const status = String(body.status || "ativo").trim().toLowerCase()

    if (!numeroContrato || numeroContrato.length > 100 || operadoraId === null || operadoraId === undefined || !isIsoDate(body.data_inicio) || (dataFim !== null && !isIsoDate(dataFim)) || estipulanteId === undefined || !Number.isInteger(quantidadeVidas) || quantidadeVidas < 0 || !allowedStatuses.has(status)) {
      return errorResponse("operadora_id, número, início, quantidade de vidas e status válidos são obrigatórios")
    }

    const dependencies = await query(
      `SELECT o.id AS operadora_id, e.id AS estipulante_id
       FROM operadoras o
       LEFT JOIN estipulantes e ON e.id = $2 AND e.administradora_id = $3 AND e.deleted_at IS NULL
       WHERE o.id = $1 AND o.administradora_id = $3 AND o.deleted_at IS NULL`,
      [operadoraId, estipulanteId, administradoraId],
    )
    if (!dependencies.length || (estipulanteId !== null && dependencies[0].estipulante_id === null)) {
      return errorResponse("Operadora ou estipulante não pertence à administradora", 422)
    }

    const rows = await query(
      `UPDATE contratos SET operadora_id = $1, estipulante_id = $2, numero_contrato = $3,
              data_inicio = $4, data_fim = $5, quantidade_vidas = $6, status = $7, updated_at = NOW()
       WHERE id = $8 AND administradora_id = $9 AND deleted_at IS NULL
       RETURNING id, administradora_id, operadora_id, estipulante_id, numero_contrato, numero_contrato AS numero,
                 data_inicio, data_fim, quantidade_vidas, status, created_at, updated_at, deleted_at`,
      [operadoraId, estipulanteId, numeroContrato, body.data_inicio, dataFim, quantidadeVidas, status, id, administradoraId],
    )
    return rows[0]
      ? NextResponse.json(successResponse(rows[0], "Contrato atualizado com sucesso"))
      : errorResponse("Contrato não encontrado", 404)
  } catch (error) {
    const response = mapError(error)
    return NextResponse.json(response.body, { status: response.status })
  }
}

export async function DELETE(_: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { administradoraId } = await requireCadastroAccess("delete")
    const id = parseId((await params).id)
    if (id === null) return errorResponse("Identificador inválido")
    const rows = await query(
      `UPDATE contratos SET deleted_at = NOW(), updated_at = NOW()
       WHERE id = $1 AND administradora_id = $2 AND deleted_at IS NULL
       RETURNING id`,
      [id, administradoraId],
    )
    return rows[0]
      ? NextResponse.json(successResponse(null, "Contrato excluído com sucesso"))
      : errorResponse("Contrato não encontrado", 404)
  } catch (error) {
    const response = mapError(error)
    return NextResponse.json(response.body, { status: response.status })
  }
}
