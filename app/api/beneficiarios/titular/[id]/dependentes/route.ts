import { type NextRequest, NextResponse } from "next/server"
import { query } from "@/lib/database"

export async function GET(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const { id } = params
    const titularId = Number.parseInt(id)

    const titularRows = await query(`SELECT id FROM beneficiarios WHERE id = $1 AND tipo_beneficiario = 'titular'`, [titularId])
    if (!titularRows.length) return NextResponse.json({ success: false, message: "Titular não encontrado ou inválido" }, { status: 404 })
    const dependentes = await query(`SELECT b.*, p.nome_completo AS nome, p.cpf FROM beneficiarios b LEFT JOIN pessoas p ON p.id = b.pessoa_id WHERE b.titular_id = $1 ORDER BY b.created_at DESC NULLS LAST`, [titularId])

    return NextResponse.json({
      success: true,
      data: dependentes,
      count: dependentes.length,
    })
  } catch (error) {
    console.error("[v0] Erro ao buscar dependentes:", error)
    return NextResponse.json(
      { success: false, message: "Erro ao buscar dependentes", error: error instanceof Error ? error.message : "Erro desconhecido" },
      { status: 500 },
    )
  }
}
