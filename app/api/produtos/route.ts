import { type NextRequest, NextResponse } from "next/server"
import { CrudService } from "@/lib/crud-service"
import { successResponse, handleApiError } from "@/lib/api-response"

const produtosService = new CrudService("produtos")

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams
    const ativo = searchParams.get("ativo")
    const operadora_id = searchParams.get("operadora_id")

    const filters: Record<string, any> = {}
    if (ativo !== null) filters.ativo = ativo === "true"
    if (operadora_id) filters.operadora_id = Number.parseInt(operadora_id)

    const produtos = await produtosService.findAll(filters)
    return NextResponse.json(successResponse(produtos))
  } catch (error) {
    return NextResponse.json(handleApiError(error), { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()

    const id = await produtosService.create({
      ...body,
      created_at: new Date(),
      updated_at: new Date(),
    })

    const produto = await produtosService.findById(id)
    return NextResponse.json(successResponse(produto, "Produto criado com sucesso"), { status: 201 })
  } catch (error) {
    return NextResponse.json(handleApiError(error), { status: 500 })
  }
}
