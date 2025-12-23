import { type NextRequest, NextResponse } from "next/server"
import { CrudService } from "@/lib/crud-service"
import { successResponse, errorResponse, handleApiError } from "@/lib/api-response"

const administradorasService = new CrudService("administradoras")

export async function GET(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const administradora = await administradorasService.findById(Number.parseInt(params.id))

    if (!administradora) {
      return NextResponse.json(errorResponse("Administradora não encontrada"), { status: 404 })
    }

    return NextResponse.json(successResponse(administradora))
  } catch (error) {
    return NextResponse.json(handleApiError(error), { status: 500 })
  }
}

export async function PUT(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const body = await request.json()
    const id = Number.parseInt(params.id)

    const updated = await administradorasService.update(id, {
      ...body,
      updated_at: new Date(),
    })

    if (!updated) {
      return NextResponse.json(errorResponse("Administradora não encontrada"), { status: 404 })
    }

    const administradora = await administradorasService.findById(id)
    return NextResponse.json(successResponse(administradora, "Administradora atualizada com sucesso"))
  } catch (error) {
    return NextResponse.json(handleApiError(error), { status: 500 })
  }
}

export async function DELETE(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const deleted = await administradorasService.softDelete(Number.parseInt(params.id))

    if (!deleted) {
      return NextResponse.json(errorResponse("Administradora não encontrada"), { status: 404 })
    }

    return NextResponse.json(successResponse(null, "Administradora excluída com sucesso"))
  } catch (error) {
    return NextResponse.json(handleApiError(error), { status: 500 })
  }
}
