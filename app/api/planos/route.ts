import { type NextRequest, NextResponse } from "next/server"
import { CrudService } from "@/lib/crud-service"
import { successResponse, handleApiError } from "@/lib/api-response"

const planosService = new CrudService("planos_saude")

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams
    const ativo = searchParams.get("ativo")
    const produto_id = searchParams.get("produto_id")

    const filters: Record<string, any> = {}
    if (ativo !== null) filters.ativo = ativo === "true"
    if (produto_id) filters.produto_id = Number.parseInt(produto_id)

    const planos = await planosService.findAll(filters)
    return NextResponse.json(successResponse(planos))
  } catch (error) {
    return NextResponse.json(handleApiError(error), { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()

    const id = await planosService.create({
      ...body,
      created_at: new Date(),
      updated_at: new Date(),
    })

    const plano = await planosService.findById(id)
    return NextResponse.json(successResponse(plano, "Plano criado com sucesso"), { status: 201 })
  } catch (error) {
    return NextResponse.json(handleApiError(error), { status: 500 })
  }
}
