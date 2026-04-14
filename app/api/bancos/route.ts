import { type NextRequest, NextResponse } from "next/server"
import { mockBancos } from "@/lib/mock-data"

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams
    const search = searchParams.get("search") || ""
    const tipo = searchParams.get("tipo") || ""
    const status = searchParams.get("status") || "Ativo"

    let bancos = [...mockBancos]

    if (status) {
      bancos = bancos.filter(b => b.status === status)
    }

    if (tipo) {
      bancos = bancos.filter(b => b.tipo === tipo)
    }

    if (search) {
      const searchLower = search.toLowerCase()
      bancos = bancos.filter(b => 
        b.codigo.toLowerCase().includes(searchLower) ||
        b.nome.toLowerCase().includes(searchLower) ||
        b.nome_curto.toLowerCase().includes(searchLower)
      )
    }

    return NextResponse.json(bancos)
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const novoBanco = {
      id: mockBancos.length + 1,
      ...body,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    }
    return NextResponse.json(novoBanco, { status: 201 })
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}
