import { type NextRequest, NextResponse } from "next/server"
import { CrudService } from "@/lib/crud-service"
import { successResponse, errorResponse, handleApiError } from "@/lib/api-response"

const operadorasService = new CrudService("operadoras")

export async function GET(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const operadora = await operadorasService.findById(Number.parseInt(params.id))

    if (!operadora) {
      return NextResponse.json(errorResponse("Operadora não encontrada"), { status: 404 })
    }

    return NextResponse.json(successResponse(operadora))
  } catch (error) {
    return NextResponse.json(handleApiError(error), { status: 500 })
  }
}

export async function PUT(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const body = await request.json()
    const id = Number.parseInt(params.id)

    const updated = await operadorasService.update(id, {
      ...body,
      updated_at: new Date(),
    })

    if (!updated) {
      return NextResponse.json(errorResponse("Operadora não encontrada"), { status: 404 })
    }

    const operadora = await operadorasService.findById(id)
    return NextResponse.json(successResponse(operadora, "Operadora atualizada com sucesso"))
  } catch (error) {
    return NextResponse.json(handleApiError(error), { status: 500 })
  }
}

export async function DELETE(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const deleted = await operadorasService.softDelete(Number.parseInt(params.id))

    if (!deleted) {
      return NextResponse.json(errorResponse("Operadora não encontrada"), { status: 404 })
    }

    return NextResponse.json(successResponse(null, "Operadora excluída com sucesso"))
  } catch (error) {
    return NextResponse.json(handleApiError(error), { status: 500 })
  }
}
