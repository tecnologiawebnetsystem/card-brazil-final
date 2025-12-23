import { type NextRequest, NextResponse } from "next/server"
import { CrudService } from "@/lib/crud-service"
import { successResponse, handleApiError } from "@/lib/api-response"

const corretoresService = new CrudService("corretores")

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams
    const ativo = searchParams.get("ativo")

    const filters: Record<string, any> = {}
    if (ativo !== null) filters.ativo = ativo === "true"

    const corretores = await corretoresService.findAll(filters)
    return NextResponse.json(successResponse(corretores))
  } catch (error) {
    return NextResponse.json(handleApiError(error), { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()

    const id = await corretoresService.create({
      ...body,
      created_at: new Date(),
      updated_at: new Date(),
    })

    const corretor = await corretoresService.findById(id)
    return NextResponse.json(successResponse(corretor, "Corretor criado com sucesso"), { status: 201 })
  } catch (error) {
    return NextResponse.json(handleApiError(error), { status: 500 })
  }
}
