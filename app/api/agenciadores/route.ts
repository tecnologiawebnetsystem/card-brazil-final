import { type NextRequest, NextResponse } from "next/server"
import { CrudService } from "@/lib/crud-service"
import { successResponse, handleApiError } from "@/lib/api-response"

const agenciadoresService = new CrudService("agenciadores")

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams
    const ativo = searchParams.get("ativo")

    const filters: Record<string, any> = {}
    if (ativo !== null) filters.ativo = ativo === "true"

    const agenciadores = await agenciadoresService.findAll(filters)
    return NextResponse.json(successResponse(agenciadores))
  } catch (error) {
    return NextResponse.json(handleApiError(error), { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()

    const id = await agenciadoresService.create({
      ...body,
      created_at: new Date(),
      updated_at: new Date(),
    })

    const agenciador = await agenciadoresService.findById(id)
    return NextResponse.json(successResponse(agenciador, "Agenciador criado com sucesso"), { status: 201 })
  } catch (error) {
    return NextResponse.json(handleApiError(error), { status: 500 })
  }
}
