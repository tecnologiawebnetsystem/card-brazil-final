import { type NextRequest, NextResponse } from "next/server"
import { successResponse } from "@/lib/api-response"
import { query } from "@/lib/database"

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams
    const ativo = searchParams.get("ativo")

    const params: unknown[] = []
    const where = ativo !== null ? " WHERE status = $1" : ""
    if (ativo !== null) params.push(ativo === "true" ? "ativo" : "inativo")
    const agenciadores = await query(`SELECT * FROM agenciadores${where} ORDER BY created_at DESC NULLS LAST`, params)
    return NextResponse.json(successResponse(agenciadores))
  } catch (error) {
    return NextResponse.json({ success: false, message: "Erro interno" }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const novoAgenciador = {
      id: mockAgenciadores.length + 1,
      ...body,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    }
    return NextResponse.json(successResponse(novoAgenciador, "Agenciador criado com sucesso"), { status: 201 })
  } catch (error) {
    return NextResponse.json({ success: false, message: "Erro interno" }, { status: 500 })
  }
}
