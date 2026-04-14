import { type NextRequest, NextResponse } from "next/server"
import { mockPropostas } from "@/lib/mock-data"

export async function GET(request: NextRequest) {
  try {
    // Filtrar propostas pendentes e em análise
    const pendentes = mockPropostas.filter(p => p.status === "pendente" || p.status === "em_analise")

    return NextResponse.json({
      success: true,
      data: pendentes,
      count: pendentes.length,
    })
  } catch (error: any) {
    console.error("[v0] Erro ao buscar propostas pendentes:", error)
    return NextResponse.json({ error: "Erro ao buscar propostas pendentes", details: error.message }, { status: 500 })
  }
}
