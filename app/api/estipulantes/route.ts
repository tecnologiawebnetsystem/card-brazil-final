import { type NextRequest, NextResponse } from "next/server"
import { successResponse } from "@/lib/api-response"
import { mockEstipulantes, filterMockData } from "@/lib/mock-data"

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams
    const ativo = searchParams.get("ativo")

    const filters: Record<string, any> = {}
    if (ativo !== null) filters.ativo = ativo === "true"

    const estipulantes = filterMockData(mockEstipulantes, filters)
    return NextResponse.json(successResponse(estipulantes))
  } catch (error) {
    return NextResponse.json({ success: false, message: "Erro interno" }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const novoEstipulante = {
      id: mockEstipulantes.length + 1,
      ...body,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    }
    return NextResponse.json(successResponse(novoEstipulante, "Estipulante criado com sucesso"), { status: 201 })
  } catch (error) {
    return NextResponse.json({ success: false, message: "Erro interno" }, { status: 500 })
  }
}
