import { type NextRequest, NextResponse } from "next/server"
import { successResponse, errorResponse, handleApiError } from "@/lib/api-response"
import { apiAuthError, requireCadastroAccess } from "@/lib/api-auth"
import { query } from "@/lib/database"

export async function GET(_request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { administradoraId } = await requireCadastroAccess("view")
    const { id: rawId } = await params
    const id = Number.parseInt(rawId, 10)
    if (!Number.isInteger(id) || id <= 0) return NextResponse.json(errorResponse("Identificador inválido"), { status: 400 })
    const rows = await query(
      `SELECT * FROM produtos WHERE id = $1 AND administradora_id = $2 AND deleted_at IS NULL`,
      [id, administradoraId],
    )
    const produto = rows[0]
    if (!produto) return NextResponse.json(errorResponse("Produto não encontrado"), { status: 404 })
    return NextResponse.json(successResponse(produto))
  } catch (error) {
    const auth = apiAuthError(error)
    return NextResponse.json(auth ? { success: false, message: auth.message } : handleApiError(error), { status: auth?.status || 500 })
  }
}

export async function PUT(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { administradoraId } = await requireCadastroAccess("edit")
    const body = await request.json()
    const { id: rawId } = await params
    const normalized = {
      nome: body.nome,
      codigo_produto: body.codigo_produto ?? body.codigo,
      valor_mensalidade: body.valor_mensalidade ?? body.valor,
      idade_minima: body.idade_minima,
      idade_maxima: body.idade_maxima,
      status: body.status ?? (body.ativo === false ? "inativo" : "ativo"),
      plano_id: body.plano_id,
    }
    const id = Number.parseInt(rawId, 10)
    const allowed = ["nome", "codigo_produto", "valor_mensalidade", "idade_minima", "idade_maxima", "status", "plano_id"]
    const entries = Object.entries(normalized).filter(([key, value]) => allowed.includes(key) && value !== undefined)
    if (!entries.length) return NextResponse.json(errorResponse("Nenhum campo válido para atualizar"), { status: 400 })
    const values = entries.map(([, value]) => value)
    const updates = entries.map(([key], index) => `${key} = $${index + 1}`)
    const idParam = values.length + 1
    const administradoraParam = values.length + 2
    values.push(id, administradoraId)
    const rows = await query(
      `UPDATE produtos SET ${updates.join(", ")}, updated_at = CURRENT_TIMESTAMP
       WHERE id = $${idParam} AND administradora_id = $${administradoraParam} AND deleted_at IS NULL
       RETURNING *`,
      values,
    )
    if (!rows.length) return NextResponse.json(errorResponse("Produto não encontrado"), { status: 404 })
    return NextResponse.json(successResponse(rows[0], "Produto atualizado com sucesso"))
  } catch (error) {
    const auth = apiAuthError(error)
    return NextResponse.json(auth ? { success: false, message: auth.message } : handleApiError(error), { status: auth?.status || 500 })
  }
}

export async function DELETE(_request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { administradoraId } = await requireCadastroAccess("delete")
    const { id: rawId } = await params
    const id = Number.parseInt(rawId, 10)
    if (!Number.isInteger(id) || id <= 0) return NextResponse.json(errorResponse("Identificador inválido"), { status: 400 })
    const rows = await query(
      `UPDATE produtos SET deleted_at = CURRENT_TIMESTAMP, status = 'inativo', updated_at = CURRENT_TIMESTAMP
       WHERE id = $1 AND administradora_id = $2 AND deleted_at IS NULL
       RETURNING id`,
      [id, administradoraId],
    )
    if (!rows.length) return NextResponse.json(errorResponse("Produto não encontrado"), { status: 404 })
    return NextResponse.json(successResponse(null, "Produto excluído com sucesso"))
  } catch (error) {
    const auth = apiAuthError(error)
    return NextResponse.json(auth ? { success: false, message: auth.message } : handleApiError(error), { status: auth?.status || 500 })
  }
}
