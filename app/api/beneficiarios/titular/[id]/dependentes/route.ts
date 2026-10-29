import { type NextRequest, NextResponse } from "next/server"
import { query } from "@/lib/database"
import { apiAuthError, requireCadastroAccess } from "@/lib/api-auth"

export async function GET(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { administradoraId } = await requireCadastroAccess("view")
    const { id } = await params
    const titularId = Number.parseInt(id, 10)

    const titularRows = await query(`SELECT id FROM beneficiarios WHERE id = $1 AND administradora_id = $2 AND tipo_beneficiario = 'titular' AND deleted_at IS NULL`, [titularId, administradoraId])
    if (!titularRows.length) return NextResponse.json({ success: false, message: "Titular não encontrado ou inválido" }, { status: 404 })
    const dependentes = await query(`SELECT b.*, p.nome_completo AS nome, pf.cpf FROM beneficiarios b LEFT JOIN pessoas p ON p.id = b.pessoa_id AND p.administradora_id = b.administradora_id LEFT JOIN pessoas_fisicas pf ON pf.pessoa_id = p.id WHERE b.titular_id = $1 AND b.administradora_id = $2 AND b.deleted_at IS NULL ORDER BY b.created_at DESC NULLS LAST`, [titularId, administradoraId])

    return NextResponse.json({
      success: true,
      data: dependentes,
      count: dependentes.length,
    })
  } catch (error) {
    const auth = apiAuthError(error)
    if (auth) return NextResponse.json({ success: false, message: auth.message }, { status: auth.status })
    console.error("[v0] Erro ao buscar dependentes:", error)
    return NextResponse.json({ success: false, message: "Erro ao buscar dependentes" }, { status: 500 })
  }
}
