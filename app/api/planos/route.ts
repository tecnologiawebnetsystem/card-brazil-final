import { type NextRequest, NextResponse } from "next/server"
import { successResponse } from "@/lib/api-response"
import { query } from "@/lib/database"
import { apiAuthError, requireCadastroAccess } from "@/lib/api-auth"
import { apiError } from "@/lib/api-response"
import { planoSchema, zodFieldErrors } from "@/lib/validation"

export async function GET(request: NextRequest) {
  try {
    const { administradoraId } = await requireCadastroAccess("view")
    const searchParams = request.nextUrl.searchParams
    const ativo = searchParams.get("ativo")
    const produto_id = searchParams.get("produto_id")

    const params: unknown[] = []
    const conditions: string[] = [`administradora_id = $1`]
    params.push(administradoraId)
    if (ativo !== null) { params.push(ativo === "true" ? "ativo" : "inativo"); conditions.push(`status = $${params.length}`) }
    if (produto_id) { params.push(Number.parseInt(produto_id, 10)); conditions.push(`operadora_id = $${params.length}`) }
    const where = conditions.length ? ` WHERE ${conditions.join(" AND ")}` : ""
    const planos = await query(`SELECT * FROM planos${where} ORDER BY created_at DESC NULLS LAST`, params)
    return NextResponse.json(successResponse(planos))
  } catch (error) {
    return NextResponse.json({ success: false, message: "Erro interno" }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const { administradoraId } = await requireCadastroAccess("create")
    const parsed = planoSchema.safeParse(await request.json())
    if (!parsed.success) return apiError("Dados do plano inválidos", 400, zodFieldErrors(parsed.error))
    const data = parsed.data
    const rows = await query(`INSERT INTO planos (administradora_id, operadora_id, nome, codigo_ans, tipo_plano, valor_base, descricao, status) VALUES ($1,$2,$3,$4,$5,$6,$7,$8) RETURNING *`, [administradoraId, data.operadora_id, data.nome, data.codigo_ans || null, data.tipo_plano, data.valor_base || null, data.descricao || null, data.status])
    return NextResponse.json(successResponse(rows[0], "Plano criado com sucesso"), { status: 201 })
  } catch (error) {
    const auth = apiAuthError(error)
    return auth ? apiError(auth.message, auth.status) : apiError("Não foi possível criar o plano", 500)
  }
}
