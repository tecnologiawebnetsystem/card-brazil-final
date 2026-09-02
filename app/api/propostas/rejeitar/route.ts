import { type NextRequest, NextResponse } from "next/server"
import { query } from "@/lib/database"

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    
    if (!body.proposta_id) {
      return NextResponse.json({ error: "ID da proposta é obrigatório" }, { status: 400 })
    }

    if (!body.motivo) {
      return NextResponse.json({ error: "Motivo da rejeição é obrigatório" }, { status: 400 })
    }

    const rows = await query(`UPDATE propostas SET status = 'rejeitada', observacoes = $2, updated_at = CURRENT_TIMESTAMP WHERE id = $1 AND status NOT IN ('aprovada', 'rejeitada') RETURNING *`, [body.proposta_id, body.motivo])
    if (!rows.length) return NextResponse.json({ error: "Proposta não encontrada ou já finalizada" }, { status: 404 })
    const rejeicao = { proposta_id: body.proposta_id, status: rows[0].status, parecer: body.motivo, analisado_por: body.analisado_por || 1, data_analise: new Date().toISOString() }

    return NextResponse.json({
      success: true,
      message: "Proposta rejeitada",
      data: rejeicao,
    })
  } catch (error: any) {
    console.error("[v0] Erro ao rejeitar proposta:", error)
    return NextResponse.json({ error: "Erro ao rejeitar proposta" }, { status: 500 })
  }
}
