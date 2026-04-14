import { type NextRequest, NextResponse } from "next/server"
import { mockAdvogados } from "@/lib/mock-data"

export async function GET(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const id = Number.parseInt(params.id)

    const advogado = mockAdvogados.find(a => a.id === id)

    if (!advogado) {
      return NextResponse.json({ error: "Advogado não encontrado" }, { status: 404 })
    }

    return NextResponse.json(advogado)
  } catch (error: any) {
    console.error("Erro ao buscar advogado:", error)
    return NextResponse.json({ error: "Erro ao buscar advogado", details: error.message }, { status: 500 })
  }
}

export async function PUT(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const id = Number.parseInt(params.id)
    const body = await request.json()

    const advogado = mockAdvogados.find(a => a.id === id)

    if (!advogado) {
      return NextResponse.json({ error: "Advogado não encontrado" }, { status: 404 })
    }

    const updated = { ...advogado, ...body, updated_at: new Date().toISOString() }
    return NextResponse.json({ message: "Advogado atualizado com sucesso", data: updated })
  } catch (error: any) {
    console.error("Erro ao atualizar advogado:", error)
    return NextResponse.json({ error: "Erro ao atualizar advogado", details: error.message }, { status: 500 })
  }
}

export async function DELETE(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const id = Number.parseInt(params.id)

    const advogado = mockAdvogados.find(a => a.id === id)

    if (!advogado) {
      return NextResponse.json({ error: "Advogado não encontrado" }, { status: 404 })
    }

    return NextResponse.json({ message: "Advogado excluído com sucesso" })
  } catch (error: any) {
    console.error("Erro ao excluir advogado:", error)
    return NextResponse.json({ error: "Erro ao excluir advogado", details: error.message }, { status: 500 })
  }
}
