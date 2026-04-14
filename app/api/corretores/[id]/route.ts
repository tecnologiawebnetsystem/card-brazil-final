import { type NextRequest, NextResponse } from "next/server"
import { successResponse, errorResponse } from "@/lib/api-response"
import { mockCorretores, findMockById } from "@/lib/mock-data"

export async function GET(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const corretor = findMockById(mockCorretores, Number.parseInt(params.id))

    if (!corretor) {
      return NextResponse.json(errorResponse("Corretor não encontrado"), { status: 404 })
    }

    return NextResponse.json(successResponse(corretor))
  } catch (error) {
    return NextResponse.json({ success: false, message: "Erro interno" }, { status: 500 })
  }
}

export async function PUT(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const body = await request.json()
    const id = Number.parseInt(params.id)
    const corretor = findMockById(mockCorretores, id)

    if (!corretor) {
      return NextResponse.json(errorResponse("Corretor não encontrado"), { status: 404 })
    }

    const updated = { ...corretor, ...body, updated_at: new Date().toISOString() }
    return NextResponse.json(successResponse(updated, "Corretor atualizado com sucesso"))
  } catch (error) {
    return NextResponse.json({ success: false, message: "Erro interno" }, { status: 500 })
  }
}

export async function DELETE(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const corretor = findMockById(mockCorretores, Number.parseInt(params.id))

    if (!corretor) {
      return NextResponse.json(errorResponse("Corretor não encontrado"), { status: 404 })
    }

    return NextResponse.json(successResponse(null, "Corretor excluído com sucesso"))
  } catch (error) {
    return NextResponse.json({ success: false, message: "Erro interno" }, { status: 500 })
  }
}
