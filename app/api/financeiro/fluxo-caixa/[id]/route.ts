import { type NextRequest, NextResponse } from "next/server"
import { mockFluxoCaixa } from "@/lib/mock-data"

export async function GET(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const id = Number.parseInt(params.id)

    const movimentacao = mockFluxoCaixa.find(fc => fc.id === id)

    if (!movimentacao) {
      return NextResponse.json({ error: "Movimentação não encontrada" }, { status: 404 })
    }

    return NextResponse.json(movimentacao)
  } catch (error: any) {
    console.error("[v0] Erro ao buscar movimentação:", error)
    return NextResponse.json({ error: "Erro ao buscar movimentação", details: error.message }, { status: 500 })
  }
}

export async function PUT(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const id = Number.parseInt(params.id)
    const body = await request.json()

    const movimentacao = mockFluxoCaixa.find(fc => fc.id === id)

    if (!movimentacao) {
      return NextResponse.json({ error: "Movimentação não encontrada" }, { status: 404 })
    }

    const updated = { ...movimentacao, ...body, updated_at: new Date().toISOString() }
    return NextResponse.json({ message: "Movimentação atualizada com sucesso", data: updated })
  } catch (error: any) {
    console.error("[v0] Erro ao atualizar movimentação:", error)
    return NextResponse.json({ error: "Erro ao atualizar movimentação", details: error.message }, { status: 500 })
  }
}

export async function DELETE(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const id = Number.parseInt(params.id)

    const movimentacao = mockFluxoCaixa.find(fc => fc.id === id)

    if (!movimentacao) {
      return NextResponse.json({ error: "Movimentação não encontrada" }, { status: 404 })
    }

    return NextResponse.json({ message: "Movimentação excluída com sucesso" })
  } catch (error: any) {
    console.error("[v0] Erro ao excluir movimentação:", error)
    return NextResponse.json({ error: "Erro ao excluir movimentação", details: error.message }, { status: 500 })
  }
}
