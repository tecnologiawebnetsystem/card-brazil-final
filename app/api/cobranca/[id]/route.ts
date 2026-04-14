import { type NextRequest, NextResponse } from "next/server"
import { mockCobrancas } from "@/lib/mock-data"

export async function GET(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const id = Number.parseInt(params.id)

    const cobranca = mockCobrancas.find(c => c.id === id)

    if (!cobranca) {
      return NextResponse.json({ error: "Cobrança não encontrada" }, { status: 404 })
    }

    return NextResponse.json(cobranca)
  } catch (error: any) {
    console.error("[v0] Erro ao buscar cobrança:", error)
    return NextResponse.json({ error: "Erro ao buscar cobrança", details: error.message }, { status: 500 })
  }
}

export async function PUT(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const id = Number.parseInt(params.id)
    const body = await request.json()

    const cobranca = mockCobrancas.find(c => c.id === id)

    if (!cobranca) {
      return NextResponse.json({ error: "Cobrança não encontrada" }, { status: 404 })
    }

    const updated = { ...cobranca, ...body, updated_at: new Date().toISOString() }
    return NextResponse.json({ message: "Cobrança atualizada com sucesso", data: updated })
  } catch (error: any) {
    console.error("[v0] Erro ao atualizar cobrança:", error)
    return NextResponse.json({ error: "Erro ao atualizar cobrança", details: error.message }, { status: 500 })
  }
}

export async function DELETE(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const id = Number.parseInt(params.id)

    const cobranca = mockCobrancas.find(c => c.id === id)

    if (!cobranca) {
      return NextResponse.json({ error: "Cobrança não encontrada" }, { status: 404 })
    }

    return NextResponse.json({ message: "Cobrança excluída com sucesso" })
  } catch (error: any) {
    console.error("[v0] Erro ao excluir cobrança:", error)
    return NextResponse.json({ error: "Erro ao excluir cobrança", details: error.message }, { status: 500 })
  }
}
