import { type NextRequest, NextResponse } from "next/server"
import { mockConfiguracoesMJ } from "@/lib/mock-data"

export async function GET(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const id = Number.parseInt(params.id)

    const config = mockConfiguracoesMJ.find(c => c.id === id)

    if (!config) {
      return NextResponse.json({ error: "Configuração não encontrada" }, { status: 404 })
    }

    return NextResponse.json(config)
  } catch (error: any) {
    console.error("[v0] Erro ao buscar configuração:", error)
    return NextResponse.json({ error: "Erro ao buscar configuração", details: error.message }, { status: 500 })
  }
}

export async function PUT(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const id = Number.parseInt(params.id)
    const body = await request.json()

    const config = mockConfiguracoesMJ.find(c => c.id === id)

    if (!config) {
      return NextResponse.json({ error: "Configuração não encontrada" }, { status: 404 })
    }

    const updated = { ...config, ...body, updated_at: new Date().toISOString() }
    return NextResponse.json({ message: "Configuração atualizada com sucesso", data: updated })
  } catch (error: any) {
    console.error("[v0] Erro ao atualizar configuração:", error)
    return NextResponse.json({ error: "Erro ao atualizar configuração", details: error.message }, { status: 500 })
  }
}

export async function DELETE(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const id = Number.parseInt(params.id)

    const config = mockConfiguracoesMJ.find(c => c.id === id)

    if (!config) {
      return NextResponse.json({ error: "Configuração não encontrada" }, { status: 404 })
    }

    return NextResponse.json({ message: "Configuração excluída com sucesso" })
  } catch (error: any) {
    console.error("[v0] Erro ao excluir configuração:", error)
    return NextResponse.json({ error: "Erro ao excluir configuração", details: error.message }, { status: 500 })
  }
}
