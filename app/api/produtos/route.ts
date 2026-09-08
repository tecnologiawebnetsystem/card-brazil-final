import { type NextRequest, NextResponse } from "next/server"
import { successResponse } from "@/lib/api-response"
import { query } from "@/lib/database"
import { apiAuthError, requireCadastroAccess } from "@/lib/api-auth"
import { apiError } from "@/lib/api-response"
import { produtoSchema, zodFieldErrors } from "@/lib/validation"

export async function GET(request: NextRequest) {
  try {
    const { administradoraId } = await requireCadastroAccess("view")
    const searchParams = request.nextUrl.searchParams
    const ativo = searchParams.get("ativo")
    const operadora_id = searchParams.get("operadora_id")

    const params: unknown[] = []
    const conditions: string[] = [`p.administradora_id = $1`]
    params.push(administradoraId)
    if (ativo !== null) { params.push(ativo === "true" ? "ativo" : "inativo"); conditions.push(`status = $${params.length}`) }
    if (operadora_id) { params.push(Number.parseInt(operadora_id, 10)); conditions.push(`p.plano_id IN (SELECT id FROM planos WHERE operadora_id = $${params.length})`) }
    const where = conditions.length ? ` WHERE ${conditions.join(" AND ")}` : ""
    const produtos = await query(`SELECT p.* FROM produtos p${where} ORDER BY p.created_at DESC NULLS LAST`, params)
    return NextResponse.json(successResponse(produtos))
  } catch (error) {
    return NextResponse.json({ success: false, message: "Erro interno" }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const { administradoraId } = await requireCadastroAccess("create")
    const parsed = produtoSchema.safeParse(await request.json())
    if (!parsed.success) return apiError("Dados do produto inválidos", 400, zodFieldErrors(parsed.error))
    const data = parsed.data
    const rows = await query(`INSERT INTO produtos (administradora_id, plano_id, nome, codigo_produto, valor_mensalidade, idade_minima, idade_maxima, status) VALUES ($1,$2,$3,$4,$5,$6,$7,$8) RETURNING *`, [administradoraId, data.plano_id, data.nome, data.codigo || null, data.valor_mensalidade || null, data.idade_minima || null, data.idade_maxima || null, data.status])
    return NextResponse.json(successResponse(rows[0], "Produto criado com sucesso"), { status: 201 })
  } catch (error) {
    const auth = apiAuthError(error)
    return auth ? apiError(auth.message, auth.status) : apiError("Não foi possível criar o produto", 500)
  }
}
