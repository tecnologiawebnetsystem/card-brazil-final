import { type NextRequest, NextResponse } from "next/server"
import { query } from "@/lib/database"

export async function GET(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const { id } = params
    const beneficiarioId = Number.parseInt(id)

    const rows = await query(`SELECT b.*, p.nome_completo AS nome, p.cpf, p.email, p.telefone_principal AS telefone FROM beneficiarios b LEFT JOIN pessoas p ON p.id = b.pessoa_id WHERE b.id = $1`, [beneficiarioId])
    const beneficiario = rows[0]

    if (!beneficiario) {
      return NextResponse.json(
        { success: false, message: "Beneficiário não encontrado" },
        { status: 404 },
      )
    }

    return NextResponse.json({ success: true, data: beneficiario })
  } catch (error) {
    console.error("[v0] Erro ao buscar beneficiário:", error)
    return NextResponse.json(
      { success: false, message: "Erro ao buscar beneficiário", error: error instanceof Error ? error.message : "Erro desconhecido" },
      { status: 500 },
    )
  }
}

export async function PUT(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const body = await request.json()
    const { id } = params
    const beneficiarioId = Number.parseInt(id)

    const allowed = ["plano_id", "contrato_id", "numero_carteirinha", "parentesco", "data_inclusao", "data_exclusao", "valor_mensalidade", "status"]
    const entries = Object.entries(body).filter(([key]) => allowed.includes(key))
    if (!entries.length) return NextResponse.json({ success: false, message: "Nenhum campo válido para atualizar" }, { status: 400 })
    const values = entries.map(([, value]) => value)
    const updates = entries.map(([key], index) => `${key} = ${index + 1}`)
    values.push(beneficiarioId)
    const updatedRows = await query(`UPDATE beneficiarios SET ${updates.join(", ")}, updated_at = CURRENT_TIMESTAMP WHERE id = ${values.length} RETURNING *`, values)
    const beneficiario = updatedRows[0]

    if (!beneficiario) {
      return NextResponse.json(
        { success: false, message: "Beneficiário não encontrado" },
        { status: 404 },
      )
    }

    const updated = { ...beneficiario, ...body, updated_at: new Date().toISOString() }
    return NextResponse.json({ success: true, data: updated, message: "Beneficiário atualizado com sucesso" })
  } catch (error) {
    console.error("[v0] Erro ao atualizar beneficiário:", error)
    return NextResponse.json(
      { success: false, message: "Erro ao atualizar beneficiário", error: error instanceof Error ? error.message : "Erro desconhecido" },
      { status: 500 },
    )
  }
}

export async function DELETE(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const { id } = params
    const beneficiarioId = Number.parseInt(id, 10)

    const deletedRows = await query(`DELETE FROM beneficiarios WHERE id = $1 RETURNING id`, [beneficiarioId])
    const beneficiario = deletedRows[0]

    if (!beneficiario) {
      return NextResponse.json(
        { success: false, message: "Beneficiário não encontrado" },
        { status: 404 },
      )
    }

    return NextResponse.json({ success: true, data: null, message: "Beneficiário excluído com sucesso" })
  } catch (error) {
    console.error("[v0] Erro ao excluir beneficiário:", error)
    return NextResponse.json(
      { success: false, message: "Erro ao excluir beneficiário", error: error instanceof Error ? error.message : "Erro desconhecido" },
      { status: 500 },
    )
  }
}
