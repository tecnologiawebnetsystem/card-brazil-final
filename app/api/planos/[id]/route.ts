import { type NextRequest, NextResponse } from "next/server"
import { CrudService } from "@/lib/crud-service"
import { successResponse, errorResponse, handleApiError } from "@/lib/api-response"

const planosService = new CrudService("planos_saude")

export async function GET(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const plano = await planosService.findById(Number.parseInt(params.id))

    if (!plano) {
      return NextResponse.json(errorResponse("Plano não encontrado"), { status: 404 })
    }

    return NextResponse.json(successResponse(plano))
  } catch (error) {
    return NextResponse.json(handleApiError(error), { status: 500 })
  }
}

export async function PUT(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const body = await request.json()
    const id = Number.parseInt(params.id)

    const updated = await planosService.update(id, {
      ...body,
      updated_at: new Date(),
    })

    if (!updated) {
      return NextResponse.json(errorResponse("Plano não encontrado"), { status: 404 })
    }

    const plano = await planosService.findById(id)
    return NextResponse.json(successResponse(plano, "Plano atualizado com sucesso"))
  } catch (error) {
    return NextResponse.json(handleApiError(error), { status: 500 })
  }
}

export async function DELETE(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const deleted = await planosService.softDelete(Number.parseInt(params.id))

    if (!deleted) {
      return NextResponse.json(errorResponse("Plano não encontrado"), { status: 404 })
    }

    return NextResponse.json(successResponse(null, "Plano excluído com sucesso"))
  } catch (error) {
    return NextResponse.json(handleApiError(error), { status: 500 })
  }
}
