import { type NextRequest, NextResponse } from "next/server"
import { successResponse, errorResponse } from "@/lib/api-response"
import { mockAgenciadores, findMockById } from "@/lib/mock-data"

export async function GET(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const agenciador = findMockById(mockAgenciadores, Number.parseInt(params.id))

    if (!agenciador) {
      return NextResponse.json(errorResponse("Agenciador não encontrado"), { status: 404 })
    }

    return NextResponse.json(successResponse(agenciador))
  } catch (error) {
    return NextResponse.json({ success: false, message: "Erro interno" }, { status: 500 })
  }
}

export async function PUT(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const body = await request.json()
    const id = Number.parseInt(params.id)
    const agenciador = findMockById(mockAgenciadores, id)

    if (!agenciador) {
      return NextResponse.json(errorResponse("Agenciador não encontrado"), { status: 404 })
    }

    const updated = { ...agenciador, ...body, updated_at: new Date().toISOString() }
    return NextResponse.json(successResponse(updated, "Agenciador atualizado com sucesso"))
  } catch (error) {
    return NextResponse.json({ success: false, message: "Erro interno" }, { status: 500 })
  }
}

export async function DELETE(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const agenciador = findMockById(mockAgenciadores, Number.parseInt(params.id))

    if (!agenciador) {
      return NextResponse.json(errorResponse("Agenciador não encontrado"), { status: 404 })
    }

    return NextResponse.json(successResponse(null, "Agenciador excluído com sucesso"))
  } catch (error) {
    return NextResponse.json({ success: false, message: "Erro interno" }, { status: 500 })
  }
}
