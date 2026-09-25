import { type NextRequest, NextResponse } from "next/server"
import { query } from "@/lib/database"
import { requireCadastroAccess, apiAuthError } from "@/lib/api-auth"
import { recordCadastroAudit } from "@/lib/cadastro-audit"

function authFailure(error: unknown) {
  const auth = apiAuthError(error)
  return auth ? { body: { success: false, message: auth.message }, status: auth.status } : null
}

export async function GET(_: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { administradoraId } = await requireCadastroAccess("view")
    const { id } = await params
    const rows = await query(
      `SELECT b.*, p.nome_completo AS nome, p.cpf, p.cnpj, p.email, p.telefone_principal AS telefone
       FROM beneficiarios b LEFT JOIN pessoas p ON p.id = b.pessoa_id
       WHERE b.id = $1 AND b.administradora_id = $2 AND b.deleted_at IS NULL`,
      [Number.parseInt(id, 10), administradoraId],
    )
    return rows[0]
      ? NextResponse.json({ success: true, data: rows[0] })
      : NextResponse.json({ success: false, message: "Beneficiário não encontrado" }, { status: 404 })
  } catch (error) {
    const auth = authFailure(error)
    return NextResponse.json(auth?.body || { success: false, message: "Erro ao buscar beneficiário" }, { status: auth?.status || 500 })
  }
}

export async function PUT(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { administradoraId, userId } = await requireCadastroAccess("edit")
    const { id } = await params
    const body = await request.json()
    const allowed = ["plano_id", "contrato_id", "numero_carteirinha", "parentesco", "data_inclusao", "data_exclusao", "valor_mensalidade", "status"]
    const entries = Object.entries(body).filter(([key]) => allowed.includes(key))
    if (!entries.length) return NextResponse.json({ success: false, message: "Nenhum campo válido para atualizar" }, { status: 400 })
    const current = await query(`SELECT * FROM beneficiarios WHERE id = $1 AND administradora_id = $2 AND deleted_at IS NULL`, [Number.parseInt(id, 10), administradoraId])
    if (!current[0]) return NextResponse.json({ success: false, message: "Beneficiário não encontrado" }, { status: 404 })
    const values = entries.map(([, value]) => value)
    const updates = entries.map(([key], index) => `${key} = $${index + 1}`)
    values.push(Number.parseInt(id, 10), administradoraId)
    const rows = await query(
      `UPDATE beneficiarios SET ${updates.join(", ")}, updated_at = CURRENT_TIMESTAMP
       WHERE id = $${values.length - 1} AND administradora_id = $${values.length} AND deleted_at IS NULL RETURNING *`,
      values,
    )
    if (rows[0]) await recordCadastroAudit({ administradoraId, userId: userId, action: "update", tableName: "beneficiarios", recordId: rows[0].id, before: current[0], after: rows[0] })
    return rows[0]
      ? NextResponse.json({ success: true, data: rows[0], message: "Beneficiário atualizado com sucesso" })
      : NextResponse.json({ success: false, message: "Beneficiário não encontrado" }, { status: 404 })
  } catch (error) {
    const auth = authFailure(error)
    return NextResponse.json(auth?.body || { success: false, message: "Erro ao atualizar beneficiário" }, { status: auth?.status || 500 })
  }
}

export async function DELETE(_: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { administradoraId, userId } = await requireCadastroAccess("delete")
    const { id } = await params
    const current = await query(`SELECT * FROM beneficiarios WHERE id = $1 AND administradora_id = $2 AND deleted_at IS NULL`, [Number.parseInt(id, 10), administradoraId])
    const rows = await query(
      "UPDATE beneficiarios SET deleted_at = CURRENT_TIMESTAMP, updated_at = CURRENT_TIMESTAMP, status = 'inativo' WHERE id = $1 AND administradora_id = $2 AND deleted_at IS NULL RETURNING *",
      [Number.parseInt(id, 10), administradoraId],
    )
    if (rows[0]) await recordCadastroAudit({ administradoraId, userId: userId, action: "delete", tableName: "beneficiarios", recordId: rows[0].id, before: current[0], after: rows[0] })
    return rows[0]
      ? NextResponse.json({ success: true, data: null, message: "Beneficiário excluído com sucesso" })
      : NextResponse.json({ success: false, message: "Beneficiário não encontrado" }, { status: 404 })
  } catch (error) {
    const auth = authFailure(error)
    return NextResponse.json(auth?.body || { success: false, message: "Erro ao excluir beneficiário" }, { status: auth?.status || 500 })
  }
}
