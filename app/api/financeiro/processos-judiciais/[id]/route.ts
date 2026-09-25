import { type NextRequest, NextResponse } from "next/server"
import { requireFinanceiroAccess, authErrorStatus } from "@/lib/api-auth"
import { recordCadastroAudit } from "@/lib/cadastro-audit"
import { query } from "@/lib/database"

export async function GET(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { administradoraId } = await requireFinanceiroAccess("view")
    const { id: rawId } = await params
    const id = Number.parseInt(rawId)

    const rows = await query(`SELECT * FROM processos_judiciais WHERE id = $1 AND administradora_id = $2 AND deleted_at IS NULL`, [id, administradoraId])
    const processo = rows[0]
    if (!processo) return NextResponse.json({ error: "Processo não encontrado" }, { status: 404 })
    return NextResponse.json(processo)
  } catch (error: any) {
    console.error("[v0] Erro ao buscar processo:", error)
    return NextResponse.json({ error: "Erro ao buscar processo" }, { status: authErrorStatus(error) })
  }
}

export async function PUT(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { administradoraId, userId } = await requireFinanceiroAccess("edit")
    const { id: rawId } = await params
    const id = Number.parseInt(rawId)
    const body = await request.json()

    const allowed = ["numero_processo", "tribunal_id", "advogado_id", "fase_processual", "status", "valor_causa", "observacoes"]
    const entries = Object.entries(body).filter(([key]) => allowed.includes(key))
    if (!entries.length) return NextResponse.json({ error: "Nenhum campo válido para atualizar" }, { status: 400 })
    const values = entries.map(([, value]) => value)
    const updates = entries.map(([key], index) => `${key} = $${index + 1}`)
    const current = await query(`SELECT * FROM processos_judiciais WHERE id = $1 AND administradora_id = $2 AND deleted_at IS NULL`, [id, administradoraId])
    values.push(id, administradoraId)
    const rows = await query(`UPDATE processos_judiciais SET ${updates.join(", ")}, updated_at = CURRENT_TIMESTAMP WHERE id = $${values.length - 1} AND administradora_id = $${values.length} AND deleted_at IS NULL RETURNING *`, values)
    if (!rows.length) return NextResponse.json({ error: "Processo não encontrado" }, { status: 404 })
    await recordCadastroAudit({ administradoraId, userId, action: "update", tableName: "processos_judiciais", recordId: id, before: current[0], after: rows[0] })
    return NextResponse.json({ message: "Processo atualizado com sucesso", data: rows[0] })
  } catch (error: any) {
    console.error("[v0] Erro ao atualizar processo:", error)
    return NextResponse.json({ error: "Erro ao atualizar processo" }, { status: authErrorStatus(error) })
  }
}

export async function DELETE(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { administradoraId, userId } = await requireFinanceiroAccess("delete")
    const { id: rawId } = await params
    const id = Number.parseInt(rawId)
    const current = await query(`SELECT * FROM processos_judiciais WHERE id = $1 AND administradora_id = $2 AND deleted_at IS NULL`, [id, administradoraId])
    const rows = await query(`UPDATE processos_judiciais SET deleted_at = CURRENT_TIMESTAMP, status = 'cancelado', updated_at = CURRENT_TIMESTAMP WHERE id = $1 AND administradora_id = $2 AND deleted_at IS NULL RETURNING id`, [id, administradoraId])
    if (!rows.length) return NextResponse.json({ error: "Processo não encontrado" }, { status: 404 })
    await recordCadastroAudit({ administradoraId, userId, action: "delete", tableName: "processos_judiciais", recordId: id, before: current[0], after: { status: "cancelado", deleted_at: "CURRENT_TIMESTAMP" } })
    return NextResponse.json({ message: "Processo excluído com sucesso" })
  } catch (error: any) {
    console.error("[v0] Erro ao excluir processo:", error)
    return NextResponse.json({ error: "Erro ao excluir processo" }, { status: authErrorStatus(error) })
  }
}
