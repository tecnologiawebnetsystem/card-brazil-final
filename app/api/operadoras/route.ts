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
    const operadoras = await query(`SELECT * FROM operadoras${where} ORDER BY created_at DESC NULLS LAST`, params)
    return NextResponse.json(successResponse(operadoras))
  } catch (error) {
    return NextResponse.json({ success: false, message: "Erro interno" }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const rows = await query(`INSERT INTO operadoras (administradora_id, nome, registro_ans, cnpj, status) VALUES ($1,$2,$3,$4,$5) RETURNING *`, [body.administradora_id || 1, body.nome, body.registro_ans || null, body.cnpj || null, body.status || "ativo"])
    return NextResponse.json(successResponse(rows[0], "Operadora criada com sucesso"), { status: 201 })
  } catch (error) {
    return NextResponse.json({ success: false, message: "Erro interno" }, { status: 500 })
  }
}
