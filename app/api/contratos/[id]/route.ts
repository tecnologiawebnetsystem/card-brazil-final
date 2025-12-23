import { type NextRequest, NextResponse } from "next/server"
import { CrudService } from "@/lib/crud-service"
import { successResponse, errorResponse, handleApiError } from "@/lib/api-response"

const contratosService = new CrudService("contratos")

export async function GET(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const contrato = await contratosService.findById(Number.parseInt(params.id))

    if (!contrato) {
      return NextResponse.json(errorResponse("Contrato não encontrado"), { status: 404 })
    }

    return NextResponse.json(successResponse(contrato))
  } catch (error) {
    return NextResponse.json(handleApiError(error), { status: 500 })
  }
}

export async function PUT(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const body = await request.json()
    const id = Number.parseInt(params.id)

    const updated = await contratosService.update(id, {
      ...body,
      updated_at: new Date(),
    })

    if (!updated) {
      return NextResponse.json(errorResponse("Contrato não encontrado"), { status: 404 })
    }

    const contrato = await contratosService.findById(id)
    return NextResponse.json(successResponse(contrato, "Contrato atualizado com sucesso"))
  } catch (error) {
    return NextResponse.json(handleApiError(error), { status: 500 })
  }
}

export async function DELETE(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const deleted = await contratosService.delete(Number.parseInt(params.id))

    if (!deleted) {
      return NextResponse.json(errorResponse("Contrato não encontrado"), { status: 404 })
    }

    return NextResponse.json(successResponse(null, "Contrato excluído com sucesso"))
  } catch (error) {
    return NextResponse.json(handleApiError(error), { status: 500 })
  }
}
