import { type NextRequest, NextResponse } from "next/server"
import { query } from "@/lib/database"

export const dynamic = "force-dynamic"

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams
    const data_inicio = searchParams.get("data_inicio")
    const data_fim = searchParams.get("data_fim")

    const params: unknown[] = []
    const conditions: string[] = []
    if (data_inicio) { params.push(data_inicio); conditions.push(`created_at::date >= $${params.length}`) }
    if (data_fim) { params.push(data_fim); conditions.push(`created_at::date <= $${params.length}`) }
    const where = conditions.length ? ` WHERE ${conditions.join(" AND ")}` : ""
    const propostas = await query(`SELECT status, COALESCE(valor_proposto, 0) AS valor_total, COALESCE(numero_funcionarios, 0) AS quantidade_vidas, tipo_plano FROM propostas${where}`, params)
    const total_propostas = propostas.length
    const aprovadas = propostas.filter((p: any) => p.status === "aprovada")
    const rejeitadas = propostas.filter((p: any) => p.status === "rejeitada")
    const pendentes = propostas.filter((p: any) => p.status === "pendente")
    const em_analise = propostas.filter((p: any) => p.status === "em_analise")
    const por_tipo_plano = Object.entries(propostas.reduce((acc: Record<string, number>, p: any) => { acc[p.tipo_plano] = (acc[p.tipo_plano] || 0) + 1; return acc }, {})).map(([tipo_plano, quantidade]) => ({ tipo_plano, quantidade }))

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
      por_tipo_plano,
      por_status: [
        { status: "aprovada", quantidade: aprovadas.length, percentual: total_propostas > 0 ? Math.round((aprovadas.length / total_propostas) * 100) : 0 },
        { status: "rejeitada", quantidade: rejeitadas.length, percentual: total_propostas > 0 ? Math.round((rejeitadas.length / total_propostas) * 100) : 0 },
        { status: "pendente", quantidade: pendentes.length, percentual: total_propostas > 0 ? Math.round((pendentes.length / total_propostas) * 100) : 0 },
        { status: "em_analise", quantidade: em_analise.length, percentual: total_propostas > 0 ? Math.round((em_analise.length / total_propostas) * 100) : 0 },
      ],
      evolucao_mensal: [],
    }

    return NextResponse.json(relatorio)
  } catch (error: any) {
    console.error("[v0] Erro ao gerar relatório de propostas:", error)
    return NextResponse.json({ error: "Erro ao gerar relatório" }, { status: 500 })
  }
}
