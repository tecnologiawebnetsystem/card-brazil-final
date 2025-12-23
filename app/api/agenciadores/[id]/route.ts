import { type NextRequest, NextResponse } from "next/server"
import { CrudService } from "@/lib/crud-service"
import { successResponse, errorResponse, handleApiError } from "@/lib/api-response"

const agenciadoresService = new CrudService("agenciadores")

export async function GET(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const agenciador = await agenciadoresService.findById(Number.parseInt(params.id))

    if (!agenciador) {
      return NextResponse.json(errorResponse("Agenciador não encontrado"), { status: 404 })
    }

    return NextResponse.json(successResponse(agenciador))
  } catch (error) {
    return NextResponse.json(handleApiError(error), { status: 500 })
  }
}

export async function PUT(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const body = await request.json()
    const id = Number.parseInt(params.id)

    const updated = await agenciadoresService.update(id, {
      ...body,
      updated_at: new Date(),
    })

    if (!updated) {
      return NextResponse.json(errorResponse("Agenciador não encontrado"), { status: 404 })
    }

    const agenciador = await agenciadoresService.findById(id)
    return NextResponse.json(successResponse(agenciador, "Agenciador atualizado com sucesso"))
  } catch (error) {
    return NextResponse.json(handleApiError(error), { status: 500 })
  }
}

export async function DELETE(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const deleted = await agenciadoresService.softDelete(Number.parseInt(params.id))

    if (!deleted) {
      return NextResponse.json(errorResponse("Agenciador não encontrado"), { status: 404 })
    }

    return NextResponse.json(successResponse(null, "Agenciador excluído com sucesso"))
  } catch (error) {
    return NextResponse.json(handleApiError(error), { status: 500 })
  }
}
