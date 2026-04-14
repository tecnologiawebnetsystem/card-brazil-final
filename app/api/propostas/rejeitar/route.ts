import { type NextRequest, NextResponse } from "next/server"
import { mockPropostas } from "@/lib/mock-data"

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    
    if (!body.proposta_id) {
      return NextResponse.json({ error: "ID da proposta é obrigatório" }, { status: 400 })
    }

    if (!body.motivo) {
      return NextResponse.json({ error: "Motivo da rejeição é obrigatório" }, { status: 400 })
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

    // Simular rejeição
    const rejeicao = {
      proposta_id: body.proposta_id,
      status: "rejeitada",
      parecer: body.motivo,
      analisado_por: body.analisado_por || 1,
      data_analise: new Date().toISOString(),
    }

    return NextResponse.json({
      success: true,
      message: "Proposta rejeitada",
      data: rejeicao,
    })
  } catch (error: any) {
    console.error("[v0] Erro ao rejeitar proposta:", error)
    return NextResponse.json({ error: "Erro ao rejeitar proposta", details: error.message }, { status: 500 })
  }
}
