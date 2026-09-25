import { type NextRequest, NextResponse } from "next/server"
import { query } from "@/lib/database"
import { apiAuthError, requireCadastroAccess } from "@/lib/api-auth"
import { apiError, handleApiError } from "@/lib/api-response"

function apiErrorFromUnknown(error: unknown) {
  const auth = error instanceof Error && (error.message === "UNAUTHORIZED" || error.message === "FORBIDDEN") ? error.message : null
  if (auth) return apiError(auth === "UNAUTHORIZED" ? "Não autenticado." : "Acesso negado.", auth === "UNAUTHORIZED" ? 401 : 403, undefined, auth === "UNAUTHORIZED" ? "UNAUTHENTICATED" : "FORBIDDEN")
  const payload = handleApiError(error)
  return apiError(payload.error || "Não foi possível concluir a operação.", 500, payload.errors, payload.code)
}

export async function GET(request: NextRequest) {
  try {
    const { administradoraId } = await requireCadastroAccess("view")
    const search = request.nextUrl.searchParams.get("search") || ""
    const status = request.nextUrl.searchParams.get("status") || ""
    const params: unknown[] = [administradoraId]
    const conditions = ["deleted_at IS NULL", "administradora_id = $1"]
    if (search) { params.push(`%${search}%`); conditions.push(`(nome ILIKE $${params.length} OR estipulante ILIKE $${params.length} OR contrato ILIKE $${params.length} OR responsavel ILIKE $${params.length})`) }
    if (status) { params.push(status); conditions.push(`status = $${params.length}`) }
    const rows = await query(`SELECT * FROM subestipulantes WHERE ${conditions.join(" AND ")} ORDER BY created_at DESC, id DESC`, params)
    return NextResponse.json({ success: true, data: rows })
  } catch (error) { return apiErrorFromUnknown(error) }
}

export async function POST(request: NextRequest) {
  try {
    const { administradoraId } = await requireCadastroAccess("create")
    const body = await request.json()
    const required = ["nome", "estipulante", "contrato", "responsavel"]
    if (required.some((field) => !String(body[field] || "").trim())) return NextResponse.json({ success: false, error: "Preencha os campos obrigatórios" }, { status: 400 })
    const rows = await query(`INSERT INTO subestipulantes (administradora_id, nome, estipulante, contrato, status, segurados, responsavel, telefone) VALUES ($1,$2,$3,$4,$5,$6,$7,$8) RETURNING *`, [administradoraId, body.nome, body.estipulante, body.contrato, body.status || "Ativo", Number(body.segurados) || 0, body.responsavel, body.telefone || null])
    return NextResponse.json({ success: true, data: rows[0] }, { status: 201 })
  } catch (error) { return apiErrorFromUnknown(error) }
}
