import { type NextRequest, NextResponse } from "next/server"
import { mockProcessosJudiciais } from "@/lib/mock-data"

export async function GET(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const id = Number.parseInt(params.id)

    const processo = mockProcessosJudiciais.find(pj => pj.id === id)

    if (!processo) {
      return NextResponse.json({ error: "Processo não encontrado" }, { status: 404 })
    }

    return NextResponse.json(processo)
  } catch (error: any) {
    console.error("[v0] Erro ao buscar processo:", error)
    return NextResponse.json({ error: "Erro ao buscar processo", details: error.message }, { status: 500 })
  }
}

export async function PUT(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const id = Number.parseInt(params.id)
    const body = await request.json()

    const processo = mockProcessosJudiciais.find(pj => pj.id === id)

    if (!processo) {
      return NextResponse.json({ error: "Processo não encontrado" }, { status: 404 })
    }

    const updated = { ...processo, ...body, updated_at: new Date().toISOString() }
    return NextResponse.json({ message: "Processo atualizado com sucesso", data: updated })
  } catch (error: any) {
    console.error("[v0] Erro ao atualizar processo:", error)
    return NextResponse.json({ error: "Erro ao atualizar processo", details: error.message }, { status: 500 })
  }
}

export async function DELETE(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const id = Number.parseInt(params.id)

    const processo = mockProcessosJudiciais.find(pj => pj.id === id)

    if (!processo) {
      return NextResponse.json({ error: "Processo não encontrado" }, { status: 404 })
    }

    return NextResponse.json({ message: "Processo excluído com sucesso" })
  } catch (error: any) {
    console.error("[v0] Erro ao excluir processo:", error)
    return NextResponse.json({ error: "Erro ao excluir processo", details: error.message }, { status: 500 })
  }
}
