import { type NextRequest, NextResponse } from "next/server"
import { query } from "@/lib/database"

export async function GET(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const id = Number.parseInt(params.id)

    const rows = await query(`SELECT * FROM cobrancas WHERE id = $1`, [id])
    const cobranca = rows[0]
    if (!cobranca) return NextResponse.json({ error: "Cobrança não encontrada" }, { status: 404 })
    return NextResponse.json(cobranca)
  } catch (error: any) {
    console.error("[v0] Erro ao buscar cobrança:", error)
    return NextResponse.json({ error: "Erro ao buscar cobrança", details: error.message }, { status: 500 })
  }
}

export async function PUT(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const id = Number.parseInt(params.id)
    const body = await request.json()

    const allowed = ["status", "data_fim", "valor_atual", "valor_negociado", "desconto_concedido", "parcelas", "canal_contato", "resultado", "observacoes", "historico"]
    const entries = Object.entries(body).filter(([key]) => allowed.includes(key))
    if (!entries.length) return NextResponse.json({ error: "Nenhum campo válido para atualizar" }, { status: 400 })
    const values = entries.map(([key, value]) => key === "historico" ? JSON.stringify(value) : value)
    const updates = entries.map(([key], index) => `${key} = $${index + 1}${key === "historico" ? "::jsonb" : ""}`)
    values.push(id)
    const rows = await query(`UPDATE cobrancas SET ${updates.join(", ")}, updated_at = CURRENT_TIMESTAMP WHERE id = $${values.length} RETURNING *`, values)
    if (!rows.length) return NextResponse.json({ error: "Cobrança não encontrada" }, { status: 404 })
    return NextResponse.json({ message: "Cobrança atualizada com sucesso", data: rows[0] })
  } catch (error: any) {
    console.error("[v0] Erro ao atualizar cobrança:", error)
    return NextResponse.json({ error: "Erro ao atualizar cobrança", details: error.message }, { status: 500 })
  }
}

export async function DELETE(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const id = Number.parseInt(params.id)

    const rows = await query(`DELETE FROM cobrancas WHERE id = $1 RETURNING id`, [id])
    if (!rows.length) return NextResponse.json({ error: "Cobrança não encontrada" }, { status: 404 })
    return NextResponse.json({ message: "Cobrança excluída com sucesso" })
  } catch (error: any) {
    console.error("[v0] Erro ao excluir cobrança:", error)
    return NextResponse.json({ error: "Erro ao excluir cobrança", details: error.message }, { status: 500 })
  }
}
