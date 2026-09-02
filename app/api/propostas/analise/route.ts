import { type NextRequest, NextResponse } from "next/server"
import { query } from "@/lib/database"

export async function GET(request: NextRequest) {
  try {
    const emAnalise = await query(`SELECT * FROM propostas WHERE status = 'em_analise' ORDER BY created_at DESC NULLS LAST`)

    return NextResponse.json({
      success: true,
      data: emAnalise,
      count: emAnalise.length,
    })
  } catch (error: any) {
    console.error("[v0] Erro ao buscar propostas em análise:", error)
    return NextResponse.json({ error: "Erro ao buscar propostas em análise", details: error.message }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    
    if (!body.proposta_id) {
      return NextResponse.json({ error: "ID da proposta é obrigatório" }, { status: 400 })
    }

    const propostaRows = await query(`SELECT id FROM propostas WHERE id = $1`, [body.proposta_id])
    if (!propostaRows.length) {
      return NextResponse.json({ error: "Proposta não encontrada" }, { status: 404 })
    }

    // Simular análise
    const analise = {
      proposta_id: body.proposta_id,
      score_financeiro: body.score_financeiro || Math.floor(Math.random() * 30) + 70,
      score_documentacao: body.score_documentacao || Math.floor(Math.random() * 30) + 70,
      score_historico: body.score_historico || Math.floor(Math.random() * 30) + 70,
      parecer: body.parecer || null,
      analisado_por: body.analisado_por || 1,
      data_analise: new Date().toISOString(),
    }

    const score_medio = (analise.score_financeiro + analise.score_documentacao + analise.score_historico) / 3

    return NextResponse.json({
      success: true,
      message: "Análise realizada com sucesso",
      data: {
        ...analise,
        score_medio,
        recomendacao: score_medio >= 70 ? "aprovar" : score_medio >= 50 ? "revisar" : "rejeitar",
      },
    })
  } catch (error: any) {
    console.error("[v0] Erro ao realizar análise:", error)
    return NextResponse.json({ error: "Erro ao realizar análise", details: error.message }, { status: 500 })
  }
}
