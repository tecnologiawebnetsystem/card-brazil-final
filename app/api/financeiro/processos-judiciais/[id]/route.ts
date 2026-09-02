import { type NextRequest, NextResponse } from "next/server"
import { query } from "@/lib/database"

export async function GET(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const id = Number.parseInt(params.id)

    const rows = await query(`SELECT * FROM processos_judiciais WHERE id = $1`, [id])
    const processo = rows[0]
    if (!processo) return NextResponse.json({ error: "Processo não encontrado" }, { status: 404 })
    return NextResponse.json(processo)
  } catch (error: any) {
    console.error("[v0] Erro ao buscar processo:", error)
    return NextResponse.json({ error: "Erro ao buscar processo", details: error.message }, { status: 500 })
  }
}

export async function PUT(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const id = Number.parseInt(params.id)
    const body = await request.json()

    const allowed = ["numero_processo", "tribunal_id", "advogado_id", "fase_processual", "status", "valor_causa", "observacoes"]
    const entries = Object.entries(body).filter(([key]) => allowed.includes(key))
    if (!entries.length) return NextResponse.json({ error: "Nenhum campo válido para atualizar" }, { status: 400 })
    const values = entries.map(([, value]) => value)
    const updates = entries.map(([key], index) => `${key} = $${index + 1}`)
    values.push(id)
    const rows = await query(`UPDATE processos_judiciais SET ${updates.join(", ")}, updated_at = CURRENT_TIMESTAMP WHERE id = $${values.length} RETURNING *`, values)
    if (!rows.length) return NextResponse.json({ error: "Processo não encontrado" }, { status: 404 })
    return NextResponse.json({ message: "Processo atualizado com sucesso", data: rows[0] })
  } catch (error: any) {
    console.error("[v0] Erro ao atualizar processo:", error)
    return NextResponse.json({ error: "Erro ao atualizar processo", details: error.message }, { status: 500 })
  }
}

export async function DELETE(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const id = Number.parseInt(params.id)

    const rows = await query(`DELETE FROM processos_judiciais WHERE id = $1 RETURNING id`, [id])
    if (!rows.length) return NextResponse.json({ error: "Processo não encontrado" }, { status: 404 })
    return NextResponse.json({ message: "Processo excluído com sucesso" })
  } catch (error: any) {
    console.error("[v0] Erro ao excluir processo:", error)
    return NextResponse.json({ error: "Erro ao excluir processo", details: error.message }, { status: 500 })
  }
}
