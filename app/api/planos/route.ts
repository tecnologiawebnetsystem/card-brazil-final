import { type NextRequest, NextResponse } from "next/server"
import { successResponse } from "@/lib/api-response"
import { mockPlanos } from "@/lib/mock-data"

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams
    const ativo = searchParams.get("ativo")
    const produto_id = searchParams.get("produto_id")

    let planos = [...mockPlanos]
    
    if (ativo !== null) {
      planos = planos.filter(p => p.ativo === (ativo === "true"))
    }
    if (produto_id) {
      planos = planos.filter(p => p.produto_id === Number.parseInt(produto_id))
    }

    return NextResponse.json(successResponse(planos))
  } catch (error) {
    return NextResponse.json({ success: false, message: "Erro interno" }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const novoPlano = {
      id: mockPlanos.length + 1,
      ...body,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    }
    return NextResponse.json(successResponse(novoPlano, "Plano criado com sucesso"), { status: 201 })
  } catch (error) {
    return NextResponse.json({ success: false, message: "Erro interno" }, { status: 500 })
  }
}
