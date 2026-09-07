import { type NextRequest, NextResponse } from "next/server"
import { successResponse, errorResponse } from "@/lib/api-response"
import { query } from "@/lib/database"

export async function GET(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const rows = await query(`SELECT * FROM agenciadores WHERE id = $1`, [Number.parseInt((await params).id, 10)])
    const agenciador = rows[0]
    if (!agenciador) return NextResponse.json(errorResponse("Agenciador não encontrado"), { status: 404 })
    return NextResponse.json(successResponse(agenciador))
  } catch (error) {
    return NextResponse.json({ success: false, message: "Erro interno" }, { status: 500 })
  }
}

export async function PUT(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const body = await request.json()
    const id = Number.parseInt((await params).id)
    const allowed = ["corretor_id", "comissao_percentual", "situacao"]
    const entries = Object.entries(body).filter(([key]) => allowed.includes(key))
    const pessoaFields = ["nome_completo", "cpf", "cnpj", "email", "telefone_principal", "telefone_secundario"]
    const pessoaEntries = Object.entries(body).filter(([key]) => pessoaFields.includes(key))
    if (!entries.length && !pessoaEntries.length) return NextResponse.json(errorResponse("Nenhum campo válido para atualizar"), { status: 400 })
    const current = await query(`SELECT pessoa_id FROM agenciadores WHERE id = $1`, [id])
    if (!current.length) return NextResponse.json(errorResponse("Agenciador não encontrado"), { status: 404 })
    if (pessoaEntries.length && current[0].pessoa_id) {
      const pessoaValues = pessoaEntries.map(([, value]) => value)
      const pessoaUpdates = pessoaEntries.map(([key], index) => `${key} = $${index + 1}`)
      await query(`UPDATE pessoas SET ${pessoaUpdates.join(", ")}, updated_at = CURRENT_TIMESTAMP WHERE id = $${pessoaValues.length + 1}`, [...pessoaValues, current[0].pessoa_id])
    }
    const values = entries.map(([, value]) => value)
    const updates = entries.map(([key], index) => `${key} = $${index + 1}`)
    values.push(id)
    const rows = await query(`UPDATE agenciadores SET ${updates.join(", ")}, updated_at = CURRENT_TIMESTAMP WHERE id = $${values.length} RETURNING *`, values)
    if (!rows.length) return NextResponse.json(errorResponse("Agenciador não encontrado"), { status: 404 })
    return NextResponse.json(successResponse(rows[0], "Agenciador atualizado com sucesso"))
  } catch (error) {
    return NextResponse.json({ success: false, message: "Erro interno" }, { status: 500 })
  }
}

export async function DELETE(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const rows = await query(`DELETE FROM agenciadores WHERE id = $1 RETURNING id`, [Number.parseInt((await params).id, 10)])
    if (!rows.length) return NextResponse.json(errorResponse("Agenciador não encontrado"), { status: 404 })
    return NextResponse.json(successResponse(null, "Agenciador excluído com sucesso"))
  } catch (error) {
    return NextResponse.json({ success: false, message: "Erro interno" }, { status: 500 })
  }
}
