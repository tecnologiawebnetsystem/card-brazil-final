import { type NextRequest, NextResponse } from "next/server"
import { mockRelatorioPropostas, mockPropostas } from "@/lib/mock-data"

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams
    const data_inicio = searchParams.get("data_inicio")
    const data_fim = searchParams.get("data_fim")

    // Filtrar propostas por período se informado
    let propostas = [...mockPropostas]
    
    if (data_inicio && data_fim) {
      propostas = propostas.filter(p => {
        const dataProposta = new Date(p.data_proposta)
        return dataProposta >= new Date(data_inicio) && dataProposta <= new Date(data_fim)
      })
    }

    // Calcular relatório baseado nas propostas filtradas
    const total_propostas = propostas.length
    const aprovadas = propostas.filter(p => p.status === "aprovada")
    const rejeitadas = propostas.filter(p => p.status === "rejeitada")
    const pendentes = propostas.filter(p => p.status === "pendente")
    const em_analise = propostas.filter(p => p.status === "em_analise")

    const relatorio = {
      total_propostas,
      total_aprovadas: aprovadas.length,
      total_rejeitadas: rejeitadas.length,
      total_pendentes: pendentes.length,
      total_em_analise: em_analise.length,
      valor_total_propostas: propostas.reduce((sum, p) => sum + p.valor_total, 0),
      valor_aprovado: aprovadas.reduce((sum, p) => sum + p.valor_total, 0),
      quantidade_vidas_total: propostas.reduce((sum, p) => sum + p.quantidade_vidas, 0),
      quantidade_vidas_aprovadas: aprovadas.reduce((sum, p) => sum + p.quantidade_vidas, 0),
      por_tipo_plano: mockRelatorioPropostas.por_tipo_plano,
      por_status: [
        { status: "aprovada", quantidade: aprovadas.length, percentual: total_propostas > 0 ? Math.round((aprovadas.length / total_propostas) * 100) : 0 },
        { status: "rejeitada", quantidade: rejeitadas.length, percentual: total_propostas > 0 ? Math.round((rejeitadas.length / total_propostas) * 100) : 0 },
        { status: "pendente", quantidade: pendentes.length, percentual: total_propostas > 0 ? Math.round((pendentes.length / total_propostas) * 100) : 0 },
        { status: "em_analise", quantidade: em_analise.length, percentual: total_propostas > 0 ? Math.round((em_analise.length / total_propostas) * 100) : 0 },
      ],
      evolucao_mensal: mockRelatorioPropostas.evolucao_mensal,
    }

    return NextResponse.json(relatorio)
  } catch (error: any) {
    console.error("[v0] Erro ao gerar relatório de propostas:", error)
    return NextResponse.json({ error: "Erro ao gerar relatório", details: error.message }, { status: 500 })
  }
}
