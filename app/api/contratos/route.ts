import { type NextRequest, NextResponse } from "next/server"
import { successResponse } from "@/lib/api-response"
import { mockContratos } from "@/lib/mock-data"

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams
    const status = searchParams.get("status")
    const estipulante_id = searchParams.get("estipulante_id")
    const operadora_id = searchParams.get("operadora_id")

    let contratos = [...mockContratos]

    if (status) {
      contratos = contratos.filter(c => c.status === status)
    }
    if (estipulante_id) {
      contratos = contratos.filter(c => c.estipulante_id === Number.parseInt(estipulante_id))
    }
    if (operadora_id) {
      contratos = contratos.filter(c => c.operadora_id === Number.parseInt(operadora_id))
    }

    return NextResponse.json(successResponse(contratos))
  } catch (error) {
    return NextResponse.json({ success: false, message: "Erro interno" }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const novoContrato = {
      id: mockContratos.length + 1,
      ...body,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    }
    return NextResponse.json(successResponse(novoContrato, "Contrato criado com sucesso"), { status: 201 })
  } catch (error) {
    return NextResponse.json({ success: false, message: "Erro interno" }, { status: 500 })
  }
}
