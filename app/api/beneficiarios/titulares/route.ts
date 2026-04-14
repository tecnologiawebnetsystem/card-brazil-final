import { type NextRequest, NextResponse } from "next/server"
import { mockBeneficiarios, mockDependentes } from "@/lib/mock-data"

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams
    const ativo = searchParams.get("ativo")
    const search = searchParams.get("search")

    // Filtrar apenas titulares
    let titulares = mockBeneficiarios.filter(b => b.tipo_beneficiario === "titular")

    if (ativo !== null) {
      titulares = titulares.filter(b => b.ativo === (ativo === "true"))
    }

    if (search) {
      const searchLower = search.toLowerCase()
      titulares = titulares.filter(b => 
        b.nome?.toLowerCase().includes(searchLower) ||
        b.cpf?.includes(search) ||
        b.email?.toLowerCase().includes(searchLower)
      )
    }

    // Adicionar contagem de dependentes para cada titular
    const titularesComDependentes = titulares.map(titular => {
      const dependentes = mockDependentes.filter(d => d.beneficiario_titular_id === titular.id)
      return {
        ...titular,
        quantidade_dependentes: dependentes.length,
        dependentes_ativos: dependentes.filter(d => d.ativo).length,
      }
    })

    return NextResponse.json({
      success: true,
      data: titularesComDependentes,
      count: titularesComDependentes.length,
    })
  } catch (error) {
    console.error("[v0] Erro ao buscar titulares:", error)
    return NextResponse.json(
      { success: false, message: "Erro ao buscar titulares", error: error instanceof Error ? error.message : "Erro desconhecido" },
      { status: 500 },
    )
  }
}
