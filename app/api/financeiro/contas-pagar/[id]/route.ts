import { type NextRequest, NextResponse } from "next/server"
import { mockContasPagar } from "@/lib/mock-data"

export async function GET(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const id = Number.parseInt(params.id)

    const conta = mockContasPagar.find(cp => cp.id === id)

    if (!conta) {
      return NextResponse.json({ error: "Conta a pagar não encontrada" }, { status: 404 })
    }

    return NextResponse.json(conta)
  } catch (error: any) {
    console.error("[v0] Erro ao buscar conta a pagar:", error)
    return NextResponse.json({ error: "Erro ao buscar conta a pagar", details: error.message }, { status: 500 })
  }
}

export async function PUT(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const id = Number.parseInt(params.id)
    const body = await request.json()

    const conta = mockContasPagar.find(cp => cp.id === id)

    if (!conta) {
      return NextResponse.json({ error: "Conta a pagar não encontrada" }, { status: 404 })
    }

    const updated = { ...conta, ...body, updated_at: new Date().toISOString() }
    return NextResponse.json({ message: "Conta a pagar atualizada com sucesso", data: updated })
  } catch (error: any) {
    console.error("[v0] Erro ao atualizar conta a pagar:", error)
    return NextResponse.json({ error: "Erro ao atualizar conta a pagar", details: error.message }, { status: 500 })
  }
}

export async function DELETE(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const id = Number.parseInt(params.id)

    const conta = mockContasPagar.find(cp => cp.id === id)

    if (!conta) {
      return NextResponse.json({ error: "Conta a pagar não encontrada" }, { status: 404 })
    }

    return NextResponse.json({ message: "Conta a pagar excluída com sucesso" })
  } catch (error: any) {
    console.error("[v0] Erro ao excluir conta a pagar:", error)
    return NextResponse.json({ error: "Erro ao excluir conta a pagar", details: error.message }, { status: 500 })
  }
}
