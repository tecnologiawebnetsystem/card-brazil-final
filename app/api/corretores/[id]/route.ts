import { type NextRequest, NextResponse } from "next/server"
import { CrudService } from "@/lib/crud-service"
import { successResponse, errorResponse, handleApiError } from "@/lib/api-response"

const corretoresService = new CrudService("corretores")

export async function GET(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const corretor = await corretoresService.findById(Number.parseInt(params.id))

    if (!corretor) {
      return NextResponse.json(errorResponse("Corretor não encontrado"), { status: 404 })
    }

    return NextResponse.json(successResponse(corretor))
  } catch (error) {
    return NextResponse.json(handleApiError(error), { status: 500 })
  }
}

export async function PUT(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const body = await request.json()
    const id = Number.parseInt(params.id)

    const updated = await corretoresService.update(id, {
      ...body,
      updated_at: new Date(),
    })

    if (!updated) {
      return NextResponse.json(errorResponse("Corretor não encontrado"), { status: 404 })
    }

    const corretor = await corretoresService.findById(id)
    return NextResponse.json(successResponse(corretor, "Corretor atualizado com sucesso"))
  } catch (error) {
    return NextResponse.json(handleApiError(error), { status: 500 })
  }
}

export async function DELETE(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const deleted = await corretoresService.softDelete(Number.parseInt(params.id))

    if (!deleted) {
      return NextResponse.json(errorResponse("Corretor não encontrado"), { status: 404 })
    }

    return NextResponse.json(successResponse(null, "Corretor excluído com sucesso"))
  } catch (error) {
    return NextResponse.json(handleApiError(error), { status: 500 })
  }
}
