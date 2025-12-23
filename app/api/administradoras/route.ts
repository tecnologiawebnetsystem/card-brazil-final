import { type NextRequest, NextResponse } from "next/server"
import { CrudService } from "@/lib/crud-service"
import { successResponse, handleApiError } from "@/lib/api-response"

const administradorasService = new CrudService("administradoras")

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams
    const ativo = searchParams.get("ativo")

    const filters: Record<string, any> = {}
    if (ativo !== null) filters.ativo = ativo === "true"

    const administradoras = await administradorasService.findAll(filters)
    return NextResponse.json(successResponse(administradoras))
  } catch (error) {
    return NextResponse.json(handleApiError(error), { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()

    const id = await administradorasService.create({
      ...body,
      created_at: new Date(),
      updated_at: new Date(),
    })

    const administradora = await administradorasService.findById(id)
    return NextResponse.json(successResponse(administradora, "Administradora criada com sucesso"), { status: 201 })
  } catch (error) {
    return NextResponse.json(handleApiError(error), { status: 500 })
  }
}
