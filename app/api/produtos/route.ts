import { type NextRequest, NextResponse } from "next/server"
import { successResponse, apiError, handleApiError } from "@/lib/api-response"
import { apiAuthError, requireCadastroAccess } from "@/lib/api-auth"
import { query } from "@/lib/database"
import { produtoSchema, zodFieldErrors } from "@/lib/validation"

function parsePositiveId(value: string | null) {
  const id = Number(value)
  return Number.isInteger(id) && id > 0 ? id : null
}

function errorStatus(error: unknown) {
  const response = handleApiError(error)
  return response.code === "CONFLICT" ? 409 : response.code === "REFERENCE_ERROR" ? 422 : 500
}

export async function GET(request: NextRequest) {
  try {
    const { administradoraId } = await requireCadastroAccess("view")
    const params: unknown[] = [administradoraId]
    const conditions = ["p.administradora_id = $1", "p.deleted_at IS NULL"]
    const ativo = request.nextUrl.searchParams.get("ativo")
    const planoId = request.nextUrl.searchParams.get("plano_id")
    if (ativo !== null) {
      params.push(ativo === "true" ? "ativo" : "inativo")
      conditions.push(`p.status = $${params.length}`)
    }
    if (planoId !== null) {
      const parsedId = parsePositiveId(planoId)
      if (!parsedId) return apiError("plano_id inválido", 400)
      params.push(parsedId)
      conditions.push(`p.plano_id = $${params.length}`)
    }
    const rows = await query(
      `SELECT p.id, p.administradora_id, p.plano_id, p.nome, p.codigo_produto AS codigo, p.valor_mensalidade AS valor,
              p.idade_minima, p.idade_maxima, p.status, (p.status = 'ativo') AS ativo, p.created_at, p.updated_at,
              p.deleted_at, pl.nome AS plano_nome
       FROM produtos p
       JOIN planos pl ON pl.id = p.plano_id AND pl.administradora_id = p.administradora_id AND pl.deleted_at IS NULL
       WHERE ${conditions.join(" AND ")}
       ORDER BY p.created_at DESC NULLS LAST, p.id DESC`,
      params,
    )
    return NextResponse.json(successResponse(rows))
  } catch (error) {
    const auth = apiAuthError(error)
    if (auth) return apiError(auth.message, auth.status)
    console.error("[v0] Erro ao listar produtos", error)
    return apiError("Não foi possível carregar os produtos", 500)
  }
}

export async function POST(request: NextRequest) {
  try {
    const { administradoraId } = await requireCadastroAccess("create")
    const parsed = produtoSchema.safeParse(await request.json())
    if (!parsed.success) return apiError("Dados do produto inválidos", 422, zodFieldErrors(parsed.error))
    const data = parsed.data
    if (!data.plano_id) return apiError("Plano é obrigatório", 422, { plano_id: ["Informe um plano válido"] })
    const plano = await query("SELECT id FROM planos WHERE id = $1 AND administradora_id = $2 AND deleted_at IS NULL", [data.plano_id, administradoraId])
    if (!plano.length) return apiError("Plano não encontrado", 404)
    const rows = await query(
      `INSERT INTO produtos (administradora_id, plano_id, nome, codigo_produto, valor_mensalidade, idade_minima, idade_maxima, status)
       VALUES ($1,$2,$3,$4,$5,$6,$7,$8) RETURNING id, administradora_id, plano_id, nome, codigo_produto AS codigo, valor_mensalidade AS valor, idade_minima, idade_maxima, status, created_at, updated_at`,
      [administradoraId, data.plano_id, data.nome, data.codigo ?? null, data.valor_mensalidade ?? data.valor_base ?? null, data.idade_minima ?? null, data.idade_maxima ?? null, data.status ?? "ativo"],
    )
    return NextResponse.json(successResponse(rows[0], "Produto criado com sucesso"), { status: 201 })
  } catch (error) {
    const auth = apiAuthError(error)
    if (auth) return apiError(auth.message, auth.status)
    console.error("[v0] Erro ao criar produto", error)
    return apiError("Não foi possível criar o produto", errorStatus(error))
  }
}
