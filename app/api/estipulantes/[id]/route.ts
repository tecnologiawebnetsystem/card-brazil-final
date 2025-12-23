import { type NextRequest, NextResponse } from "next/server"
import { CrudService } from "@/lib/crud-service"
import { successResponse, errorResponse, handleApiError } from "@/lib/api-response"

const estipulantesService = new CrudService("estipulantes")

export async function GET(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const estipulante = await estipulantesService.findById(Number.parseInt(params.id))

    if (!estipulante) {
      return NextResponse.json(errorResponse("Estipulante não encontrado"), { status: 404 })
    }

    return NextResponse.json(successResponse(estipulante))
  } catch (error) {
    return NextResponse.json(handleApiError(error), { status: 500 })
  }
}

export async function PUT(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const body = await request.json()
    const id = Number.parseInt(params.id)

    const updated = await estipulantesService.update(id, {
      ...body,
      updated_at: new Date(),
    })

    if (!updated) {
      return NextResponse.json(errorResponse("Estipulante não encontrado"), { status: 404 })
    }

    const estipulante = await estipulantesService.findById(id)
    return NextResponse.json(successResponse(estipulante, "Estipulante atualizado com sucesso"))
  } catch (error) {
    return NextResponse.json(handleApiError(error), { status: 500 })
  }
}

export async function DELETE(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const deleted = await estipulantesService.softDelete(Number.parseInt(params.id))

    if (!deleted) {
      return NextResponse.json(errorResponse("Estipulante não encontrado"), { status: 404 })
    }

    return NextResponse.json(successResponse(null, "Estipulante excluído com sucesso"))
  } catch (error) {
    return NextResponse.json(handleApiError(error), { status: 500 })
  }
}
