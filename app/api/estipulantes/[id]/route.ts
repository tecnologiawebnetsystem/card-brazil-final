import { type NextRequest, NextResponse } from "next/server"
import { successResponse, errorResponse } from "@/lib/api-response"
import { mockEstipulantes, findMockById } from "@/lib/mock-data"

export async function GET(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const estipulante = findMockById(mockEstipulantes, Number.parseInt(params.id))

    if (!estipulante) {
      return NextResponse.json(errorResponse("Estipulante não encontrado"), { status: 404 })
    }

    return NextResponse.json(successResponse(estipulante))
  } catch (error) {
    return NextResponse.json({ success: false, message: "Erro interno" }, { status: 500 })
  }
}

export async function PUT(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const body = await request.json()
    const id = Number.parseInt(params.id)
    const estipulante = findMockById(mockEstipulantes, id)

    if (!estipulante) {
      return NextResponse.json(errorResponse("Estipulante não encontrado"), { status: 404 })
    }

    const updated = { ...estipulante, ...body, updated_at: new Date().toISOString() }
    return NextResponse.json(successResponse(updated, "Estipulante atualizado com sucesso"))
  } catch (error) {
    return NextResponse.json({ success: false, message: "Erro interno" }, { status: 500 })
  }
}

export async function DELETE(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const estipulante = findMockById(mockEstipulantes, Number.parseInt(params.id))

    if (!estipulante) {
      return NextResponse.json(errorResponse("Estipulante não encontrado"), { status: 404 })
    }

    return NextResponse.json(successResponse(null, "Estipulante excluído com sucesso"))
  } catch (error) {
    return NextResponse.json({ success: false, message: "Erro interno" }, { status: 500 })
  }
}
