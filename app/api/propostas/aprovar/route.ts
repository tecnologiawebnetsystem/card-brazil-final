import { type NextRequest, NextResponse } from "next/server"
import { query } from "@/lib/database"

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    
    if (!body.proposta_id) {
      return NextResponse.json({ error: "ID da proposta é obrigatório" }, { status: 400 })
    }

    const rows = await query(`UPDATE propostas SET status = 'aprovada', observacoes = COALESCE($2, observacoes), updated_at = CURRENT_TIMESTAMP WHERE id = $1 AND status NOT IN ('aprovada', 'rejeitada') RETURNING *`, [body.proposta_id, body.parecer || "Proposta aprovada após análise."])
    if (!rows.length) return NextResponse.json({ error: "Proposta não encontrada ou já finalizada" }, { status: 404 })
    const aprovacao = { proposta_id: body.proposta_id, status: rows[0].status, parecer: body.parecer || "Proposta aprovada após análise.", analisado_por: body.analisado_por || 1, data_analise: new Date().toISOString(), data_vigencia: body.data_vigencia || new Date().toISOString().split('T')[0] }

    return NextResponse.json({
      success: true,
      message: "Proposta aprovada com sucesso",
      data: aprovacao,
    })
  } catch (error: any) {
    console.error("[v0] Erro ao aprovar proposta:", error)
    return NextResponse.json({ error: "Erro ao aprovar proposta", details: error.message }, { status: 500 })
  }
}
