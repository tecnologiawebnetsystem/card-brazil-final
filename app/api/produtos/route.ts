import { type NextRequest, NextResponse } from "next/server"
import { successResponse } from "@/lib/api-response"
import { mockProdutos } from "@/lib/mock-data"

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams
    const ativo = searchParams.get("ativo")
    const operadora_id = searchParams.get("operadora_id")

    let produtos = [...mockProdutos]
    
    if (ativo !== null) {
      produtos = produtos.filter(p => p.ativo === (ativo === "true"))
    }
    if (operadora_id) {
      produtos = produtos.filter(p => p.operadora_id === Number.parseInt(operadora_id))
    }

    return NextResponse.json(successResponse(produtos))
  } catch (error) {
    return NextResponse.json({ success: false, message: "Erro interno" }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const novoProduto = {
      id: mockProdutos.length + 1,
      ...body,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    }
    return NextResponse.json(successResponse(novoProduto, "Produto criado com sucesso"), { status: 201 })
  } catch (error) {
    return NextResponse.json({ success: false, message: "Erro interno" }, { status: 500 })
  }
}
