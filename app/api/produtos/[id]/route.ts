import { type NextRequest, NextResponse } from "next/server"
import { CrudService } from "@/lib/crud-service"
import { successResponse, errorResponse, handleApiError } from "@/lib/api-response"

const produtosService = new CrudService("produtos")

export async function GET(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const produto = await produtosService.findById(Number.parseInt(params.id))

    if (!produto) {
      return NextResponse.json(errorResponse("Produto não encontrado"), { status: 404 })
    }

    return NextResponse.json(successResponse(produto))
  } catch (error) {
    return NextResponse.json(handleApiError(error), { status: 500 })
  }
}

export async function PUT(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const body = await request.json()
    const id = Number.parseInt(params.id)

    const updated = await produtosService.update(id, {
      ...body,
      updated_at: new Date(),
    })

    if (!updated) {
      return NextResponse.json(errorResponse("Produto não encontrado"), { status: 404 })
    }

    const produto = await produtosService.findById(id)
    return NextResponse.json(successResponse(produto, "Produto atualizado com sucesso"))
  } catch (error) {
    return NextResponse.json(handleApiError(error), { status: 500 })
  }
}

export async function DELETE(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const deleted = await produtosService.softDelete(Number.parseInt(params.id))

    if (!deleted) {
      return NextResponse.json(errorResponse("Produto não encontrado"), { status: 404 })
    }

    return NextResponse.json(successResponse(null, "Produto excluído com sucesso"))
  } catch (error) {
    return NextResponse.json(handleApiError(error), { status: 500 })
  }
}
