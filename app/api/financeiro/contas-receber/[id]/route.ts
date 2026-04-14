import { type NextRequest, NextResponse } from "next/server"
import { mockContasReceber } from "@/lib/mock-data"

export async function GET(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const id = Number.parseInt(params.id)

    const conta = mockContasReceber.find(cr => cr.id === id)

    if (!conta) {
      return NextResponse.json({ error: "Conta a receber não encontrada" }, { status: 404 })
    }

    return NextResponse.json(conta)
  } catch (error: any) {
    console.error("[v0] Erro ao buscar conta a receber:", error)
    return NextResponse.json({ error: "Erro ao buscar conta a receber", details: error.message }, { status: 500 })
  }
}

export async function PUT(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const id = Number.parseInt(params.id)
    const body = await request.json()

    const conta = mockContasReceber.find(cr => cr.id === id)

    if (!conta) {
      return NextResponse.json({ error: "Conta a receber não encontrada" }, { status: 404 })
    }

    const updated = { ...conta, ...body, updated_at: new Date().toISOString() }
    return NextResponse.json({ message: "Conta a receber atualizada com sucesso", data: updated })
  } catch (error: any) {
    console.error("[v0] Erro ao atualizar conta a receber:", error)
    return NextResponse.json({ error: "Erro ao atualizar conta a receber", details: error.message }, { status: 500 })
  }
}

export async function DELETE(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const id = Number.parseInt(params.id)

    const conta = mockContasReceber.find(cr => cr.id === id)

    if (!conta) {
      return NextResponse.json({ error: "Conta a receber não encontrada" }, { status: 404 })
    }

    return NextResponse.json({ message: "Conta a receber excluída com sucesso" })
  } catch (error: any) {
    console.error("[v0] Erro ao excluir conta a receber:", error)
    return NextResponse.json({ error: "Erro ao excluir conta a receber", details: error.message }, { status: 500 })
  }
}
