import { type NextRequest, NextResponse } from "next/server"
import { query } from "@/lib/database"

export async function GET(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const id = Number.parseInt(params.id)

    const rows = await query(`SELECT * FROM configuracoes_multas_juros WHERE id = $1 AND deleted_at IS NULL`, [id])
    const config = rows[0]
    if (!config) return NextResponse.json({ error: "Configuração não encontrada" }, { status: 404 })
    return NextResponse.json(config)
  } catch (error: any) {
    console.error("[v0] Erro ao buscar configuração:", error)
    return NextResponse.json({ error: "Erro ao buscar configuração", details: error.message }, { status: 500 })
  }
}

export async function PUT(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const id = Number.parseInt(params.id)
    const body = await request.json()

    const allowed = ["nome", "descricao", "percentual_multa", "valor_fixo_multa", "percentual_juros_mensal", "percentual_juros_diario", "tipo_calculo_juros", "dias_carencia", "aplicar_multa", "aplicar_juros", "ativo", "padrao"]
    const entries = Object.entries(body).filter(([key]) => allowed.includes(key))
    if (!entries.length) return NextResponse.json({ error: "Nenhum campo válido para atualizar" }, { status: 400 })
    const values = entries.map(([, value]) => value)
    const updates = entries.map(([key], index) => `${key} = $${index + 1}`)
    values.push(id)
    const rows = await query(`UPDATE configuracoes_multas_juros SET ${updates.join(", ")}, updated_at = CURRENT_TIMESTAMP WHERE id = $${values.length} AND deleted_at IS NULL RETURNING *`, values)
    if (!rows.length) return NextResponse.json({ error: "Configuração não encontrada" }, { status: 404 })
    return NextResponse.json({ message: "Configuração atualizada com sucesso", data: rows[0] })
  } catch (error: any) {
    console.error("[v0] Erro ao atualizar configuração:", error)
    return NextResponse.json({ error: "Erro ao atualizar configuração", details: error.message }, { status: 500 })
  }
}

export async function DELETE(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const id = Number.parseInt(params.id)

    const rows = await query(`UPDATE configuracoes_multas_juros SET deleted_at = CURRENT_TIMESTAMP, updated_at = CURRENT_TIMESTAMP WHERE id = $1 AND deleted_at IS NULL RETURNING id`, [id])
    if (!rows.length) return NextResponse.json({ error: "Configuração não encontrada" }, { status: 404 })
    return NextResponse.json({ message: "Configuração excluída com sucesso" })
  } catch (error: any) {
    console.error("[v0] Erro ao excluir configuração:", error)
    return NextResponse.json({ error: "Erro ao excluir configuração", details: error.message }, { status: 500 })
  }
}
