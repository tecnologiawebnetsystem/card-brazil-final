import { type NextRequest, NextResponse } from "next/server"
import { CrudService } from "@/lib/crud-service"
import { successResponse, handleApiError } from "@/lib/api-response"

const contratosService = new CrudService("contratos")

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams
    const status = searchParams.get("status")
    const estipulante_id = searchParams.get("estipulante_id")
    const operadora_id = searchParams.get("operadora_id")

    const filters: Record<string, any> = {}
    if (status) filters.status = status
    if (estipulante_id) filters.estipulante_id = Number.parseInt(estipulante_id)
    if (operadora_id) filters.operadora_id = Number.parseInt(operadora_id)

    const contratos = await contratosService.findAll(filters)
    return NextResponse.json(successResponse(contratos))
  } catch (error) {
    return NextResponse.json(handleApiError(error), { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()

    const id = await contratosService.create({
      ...body,
      created_at: new Date(),
      updated_at: new Date(),
    })

    const contrato = await contratosService.findById(id)
    return NextResponse.json(successResponse(contrato, "Contrato criado com sucesso"), { status: 201 })
  } catch (error) {
    return NextResponse.json(handleApiError(error), { status: 500 })
  }
}
