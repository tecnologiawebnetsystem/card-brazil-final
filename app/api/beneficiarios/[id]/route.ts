import { type NextRequest, NextResponse } from "next/server"
import { mockBeneficiarios, mockDependentes } from "@/lib/mock-data"

export async function GET(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const { id } = params
    const beneficiarioId = Number.parseInt(id)

    // Busca em titulares e dependentes
    const todos = [...mockBeneficiarios, ...mockDependentes]
    const beneficiario = todos.find(b => b.id === beneficiarioId)

    if (!beneficiario) {
      return NextResponse.json(
        { success: false, message: "Beneficiário não encontrado" },
        { status: 404 },
      )
    }

    return NextResponse.json({ success: true, data: beneficiario })
  } catch (error) {
    console.error("[v0] Erro ao buscar beneficiário:", error)
    return NextResponse.json(
      { success: false, message: "Erro ao buscar beneficiário", error: error instanceof Error ? error.message : "Erro desconhecido" },
      { status: 500 },
    )
  }
}

export async function PUT(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const body = await request.json()
    const { id } = params
    const beneficiarioId = Number.parseInt(id)

    const todos = [...mockBeneficiarios, ...mockDependentes]
    const beneficiario = todos.find(b => b.id === beneficiarioId)

    if (!beneficiario) {
      return NextResponse.json(
        { success: false, message: "Beneficiário não encontrado" },
        { status: 404 },
      )
    }

    const updated = { ...beneficiario, ...body, updated_at: new Date().toISOString() }
    return NextResponse.json({ success: true, data: updated, message: "Beneficiário atualizado com sucesso" })
  } catch (error) {
    console.error("[v0] Erro ao atualizar beneficiário:", error)
    return NextResponse.json(
      { success: false, message: "Erro ao atualizar beneficiário", error: error instanceof Error ? error.message : "Erro desconhecido" },
      { status: 500 },
    )
  }
}

export async function DELETE(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const { id } = params
    const beneficiarioId = Number.parseInt(id)

    const todos = [...mockBeneficiarios, ...mockDependentes]
    const beneficiario = todos.find(b => b.id === beneficiarioId)

    if (!beneficiario) {
      return NextResponse.json(
        { success: false, message: "Beneficiário não encontrado" },
        { status: 404 },
      )
    }

    return NextResponse.json({ success: true, data: null, message: "Beneficiário excluído com sucesso" })
  } catch (error) {
    console.error("[v0] Erro ao excluir beneficiário:", error)
    return NextResponse.json(
      { success: false, message: "Erro ao excluir beneficiário", error: error instanceof Error ? error.message : "Erro desconhecido" },
      { status: 500 },
    )
  }
}
