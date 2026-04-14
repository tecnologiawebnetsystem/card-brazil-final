import { type NextRequest, NextResponse } from "next/server"
import { successResponse, errorResponse } from "@/lib/api-response"
import { mockOperadoras, findMockById } from "@/lib/mock-data"

export async function GET(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const operadora = findMockById(mockOperadoras, Number.parseInt(params.id))

    if (!operadora) {
      return NextResponse.json(errorResponse("Operadora não encontrada"), { status: 404 })
    }

    return NextResponse.json(successResponse(operadora))
  } catch (error) {
    return NextResponse.json({ success: false, message: "Erro interno" }, { status: 500 })
  }
}

export async function PUT(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const body = await request.json()
    const id = Number.parseInt(params.id)
    const operadora = findMockById(mockOperadoras, id)

    if (!operadora) {
      return NextResponse.json(errorResponse("Operadora não encontrada"), { status: 404 })
    }

    const updated = { ...operadora, ...body, updated_at: new Date().toISOString() }
    return NextResponse.json(successResponse(updated, "Operadora atualizada com sucesso"))
  } catch (error) {
    return NextResponse.json({ success: false, message: "Erro interno" }, { status: 500 })
  }
}

export async function DELETE(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const operadora = findMockById(mockOperadoras, Number.parseInt(params.id))

    if (!operadora) {
      return NextResponse.json(errorResponse("Operadora não encontrada"), { status: 404 })
    }

    return NextResponse.json(successResponse(null, "Operadora excluída com sucesso"))
  } catch (error) {
    return NextResponse.json({ success: false, message: "Erro interno" }, { status: 500 })
  }
}
