import { type NextRequest, NextResponse } from "next/server"
import { mockPropostas } from "@/lib/mock-data"

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    
    if (!body.proposta_id) {
      return NextResponse.json({ error: "ID da proposta é obrigatório" }, { status: 400 })
    }

    const proposta = mockPropostas.find(p => p.id === body.proposta_id)
    
    if (!proposta) {
      return NextResponse.json({ error: "Proposta não encontrada" }, { status: 404 })
    }

    if (proposta.status === "aprovada") {
      return NextResponse.json({ error: "Proposta já está aprovada" }, { status: 400 })
    }

    if (proposta.status === "rejeitada") {
      return NextResponse.json({ error: "Proposta já foi rejeitada" }, { status: 400 })
    }

    // Simular aprovação
    const aprovacao = {
      proposta_id: body.proposta_id,
      status: "aprovada",
      parecer: body.parecer || "Proposta aprovada após análise.",
      analisado_por: body.analisado_por || 1,
      data_analise: new Date().toISOString(),
      data_vigencia: body.data_vigencia || new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
    }

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
