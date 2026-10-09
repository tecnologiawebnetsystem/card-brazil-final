import { type NextRequest, NextResponse } from "next/server"
import { requireCadastroAccess, authErrorStatus } from "@/lib/api-auth"
import { query } from "@/lib/database"

export async function GET(request: NextRequest) {
  try {
    const { administradoraId } = await requireCadastroAccess("view")
    const pendentes = await query(`SELECT * FROM propostas WHERE administradora_id = $1 AND status IN ('pendente', 'em_analise') ORDER BY created_at DESC NULLS LAST`, [administradoraId])

    return NextResponse.json({
      success: true,
      data: pendentes,
      count: pendentes.length,
    })
  } catch (error: any) {
    const status = authErrorStatus(error)
    if (status !== 500) return NextResponse.json({ error: status === 401 ? "Não autenticado" : "Sem permissão" }, { status })
    console.error("[v0] Erro ao buscar propostas pendentes:", error)
    return NextResponse.json({ error: "Erro ao buscar propostas pendentes" }, { status: 500 })
  }
}
