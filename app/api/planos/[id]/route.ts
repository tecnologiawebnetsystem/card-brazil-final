import { type NextRequest, NextResponse } from "next/server"
import { successResponse, errorResponse } from "@/lib/api-response"
import { mockPlanos, findMockById } from "@/lib/mock-data"

export async function GET(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const plano = findMockById(mockPlanos, Number.parseInt(params.id))

    if (!plano) {
      return NextResponse.json(errorResponse("Plano não encontrado"), { status: 404 })
    }

    return NextResponse.json(successResponse(plano))
  } catch (error) {
    return NextResponse.json({ success: false, message: "Erro interno" }, { status: 500 })
  }
}

export async function PUT(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const body = await request.json()
    const id = Number.parseInt(params.id)
    const plano = findMockById(mockPlanos, id)

    if (!plano) {
      return NextResponse.json(errorResponse("Plano não encontrado"), { status: 404 })
    }

    const updated = { ...plano, ...body, updated_at: new Date().toISOString() }
    return NextResponse.json(successResponse(updated, "Plano atualizado com sucesso"))
  } catch (error) {
    return NextResponse.json({ success: false, message: "Erro interno" }, { status: 500 })
  }
}

export async function DELETE(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const plano = findMockById(mockPlanos, Number.parseInt(params.id))

    if (!plano) {
      return NextResponse.json(errorResponse("Plano não encontrado"), { status: 404 })
    }

    return NextResponse.json(successResponse(null, "Plano excluído com sucesso"))
  } catch (error) {
    return NextResponse.json({ success: false, message: "Erro interno" }, { status: 500 })
  }
}
