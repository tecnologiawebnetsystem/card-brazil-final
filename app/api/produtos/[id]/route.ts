import { type NextRequest, NextResponse } from "next/server"
import { successResponse, errorResponse } from "@/lib/api-response"
import { mockProdutos, findMockById } from "@/lib/mock-data"

export async function GET(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const produto = findMockById(mockProdutos, Number.parseInt(params.id))

    if (!produto) {
      return NextResponse.json(errorResponse("Produto não encontrado"), { status: 404 })
    }

    return NextResponse.json(successResponse(produto))
  } catch (error) {
    return NextResponse.json({ success: false, message: "Erro interno" }, { status: 500 })
  }
}

export async function PUT(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const body = await request.json()
    const id = Number.parseInt(params.id)
    const produto = findMockById(mockProdutos, id)

    if (!produto) {
      return NextResponse.json(errorResponse("Produto não encontrado"), { status: 404 })
    }

    const updated = { ...produto, ...body, updated_at: new Date().toISOString() }
    return NextResponse.json(successResponse(updated, "Produto atualizado com sucesso"))
  } catch (error) {
    return NextResponse.json({ success: false, message: "Erro interno" }, { status: 500 })
  }
}

export async function DELETE(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const produto = findMockById(mockProdutos, Number.parseInt(params.id))

    if (!produto) {
      return NextResponse.json(errorResponse("Produto não encontrado"), { status: 404 })
    }

    return NextResponse.json(successResponse(null, "Produto excluído com sucesso"))
  } catch (error) {
    return NextResponse.json({ success: false, message: "Erro interno" }, { status: 500 })
  }
}
