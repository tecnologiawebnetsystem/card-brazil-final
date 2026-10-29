import { type NextRequest, NextResponse } from "next/server"
import { handleApiError, successResponse } from "@/lib/api-response"
import { query } from "@/lib/database"
import { apiAuthError, requireCadastroAccess } from "@/lib/api-auth"

const allowedStatuses = new Set(["ativo", "inativo", "suspenso", "cancelado", "vencido", "encerrado"])

function isIsoDate(value: unknown): value is string {
  return typeof value === "string" && /^\d{4}-\d{2}-\d{2}$/.test(value)
}

function parseOptionalId(value: unknown) {
  if (value === undefined || value === null || value === "") return null
  const parsed = Number(value)
  return Number.isInteger(parsed) && parsed > 0 ? parsed : undefined
}

function errorResponse(message: string, status = 400) {
  return NextResponse.json({ success: false, message }, { status })
}

export async function GET(request: NextRequest) {
  try {
    const { administradoraId } = await requireCadastroAccess("view")
    const searchParams = request.nextUrl.searchParams
    const status = searchParams.get("status")?.trim().toLowerCase()
    const estipulanteId = parseOptionalId(searchParams.get("estipulante_id"))
    const operadoraId = parseOptionalId(searchParams.get("operadora_id"))

    if (estipulanteId === undefined || operadoraId === undefined) return errorResponse("Filtros de estipulante e operadora inválidos")
    if (status && !allowedStatuses.has(status)) return errorResponse("Status de contrato inválido")

    const params: unknown[] = [administradoraId]
    const conditions = ["administradora_id = $1", "deleted_at IS NULL"]
    if (status) { params.push(status); conditions.push(`status = $${params.length}`) }
    if (estipulanteId !== null) { params.push(estipulanteId); conditions.push(`estipulante_id = $${params.length}`) }
    if (operadoraId !== null) { params.push(operadoraId); conditions.push(`operadora_id = $${params.length}`) }

    const contratos = await query(
      `SELECT id, administradora_id, operadora_id, estipulante_id, numero_contrato, numero_contrato AS numero,
              data_inicio, data_fim, quantidade_vidas, status, created_at, updated_at, deleted_at
       FROM contratos
       WHERE ${conditions.join(" AND ")}
       ORDER BY created_at DESC NULLS LAST`,
      params,
    )
    return NextResponse.json(successResponse(contratos))
  } catch (error) {
    const auth = apiAuthError(error)
    return NextResponse.json(auth ? { success: false, message: auth.message } : handleApiError(error), { status: auth?.status || 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const { administradoraId } = await requireCadastroAccess("create")
    const body = await request.json()
    const numeroContrato = String(body.numero_contrato || body.numero || "").trim()
    const operadoraId = parseOptionalId(body.operadora_id)
    const estipulanteId = parseOptionalId(body.estipulante_id)
    const dataInicio = body.data_inicio
    const dataFim = body.data_fim || null
    const quantidadeVidas = body.quantidade_vidas === undefined || body.quantidade_vidas === null || body.quantidade_vidas === ""
      ? 0
      : Number(body.quantidade_vidas)
    const status = String(body.status || "ativo").trim().toLowerCase()

    if (!numeroContrato || numeroContrato.length > 100 || operadoraId === null || operadoraId === undefined || !isIsoDate(dataInicio) || (dataFim !== null && !isIsoDate(dataFim)) || estipulanteId === undefined || !Number.isInteger(quantidadeVidas) || quantidadeVidas < 0 || !allowedStatuses.has(status)) {
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
      `INSERT INTO contratos (administradora_id, operadora_id, estipulante_id, numero_contrato, data_inicio, data_fim, quantidade_vidas, status)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
       RETURNING id, administradora_id, operadora_id, estipulante_id, numero_contrato, numero_contrato AS numero,
                 data_inicio, data_fim, quantidade_vidas, status, created_at, updated_at, deleted_at`,
      [administradoraId, operadoraId, estipulanteId, numeroContrato, dataInicio, dataFim, quantidadeVidas, status],
    )
    return NextResponse.json(successResponse(rows[0], "Contrato criado com sucesso"), { status: 201 })
  } catch (error) {
    const auth = apiAuthError(error)
    const response = auth ? { success: false, message: auth.message } : handleApiError(error)
    const status = auth?.status || (response.code === "CONFLICT" ? 409 : response.code === "REFERENCE_ERROR" ? 422 : 500)
    return NextResponse.json(response, { status })
  }
}
