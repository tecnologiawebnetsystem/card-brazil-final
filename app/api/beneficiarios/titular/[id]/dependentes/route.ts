import { type NextRequest, NextResponse } from "next/server"
import { mockBeneficiarios, mockDependentes } from "@/lib/mock-data"

export async function GET(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const { id } = params
    const titularId = Number.parseInt(id)

    // Verifica se o titular existe
    const titular = mockBeneficiarios.find(b => b.id === titularId)

    if (!titular) {
      return NextResponse.json(
        { success: false, message: "Titular não encontrado" },
        { status: 404 },
      )
    }

    if (titular.tipo_beneficiario !== "titular") {
      return NextResponse.json(
        { success: false, message: "O beneficiário informado não é um titular" },
        { status: 400 },
      )
    }

    // Busca os dependentes deste titular
    const dependentes = mockDependentes.filter(d => d.beneficiario_titular_id === titularId)

    return NextResponse.json({
      success: true,
      data: dependentes,
      count: dependentes.length,
    })
  } catch (error) {
    console.error("[v0] Erro ao buscar dependentes:", error)
    return NextResponse.json(
      { success: false, message: "Erro ao buscar dependentes", error: error instanceof Error ? error.message : "Erro desconhecido" },
      { status: 500 },
    )
  }
}
