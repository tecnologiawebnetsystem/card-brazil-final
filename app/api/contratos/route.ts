import { type NextRequest, NextResponse } from "next/server"
import { successResponse } from "@/lib/api-response"
import { query } from "@/lib/database"

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams
    const status = searchParams.get("status")
    const estipulante_id = searchParams.get("estipulante_id")
    const operadora_id = searchParams.get("operadora_id")

    const params: unknown[] = []
    const conditions: string[] = []
    if (status) { params.push(status); conditions.push(`status = $${params.length}`) }
    if (estipulante_id) { params.push(Number.parseInt(estipulante_id, 10)); conditions.push(`estipulante_id = $${params.length}`) }
    if (operadora_id) { params.push(Number.parseInt(operadora_id, 10)); conditions.push(`operadora_id = $${params.length}`) }
    const where = conditions.length ? ` WHERE ${conditions.join(" AND ")}` : ""
    const contratos = await query(`SELECT * FROM contratos${where} ORDER BY created_at DESC NULLS LAST`, params)
    return NextResponse.json(successResponse(contratos))
  } catch (error) {
    return NextResponse.json({ success: false, message: "Erro interno" }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    if (!body.operadora_id || !body.numero_contrato || !body.data_inicio) return NextResponse.json({ success: false, message: "operadora_id, numero_contrato e data_inicio são obrigatórios" }, { status: 400 })
    const rows = await query(`INSERT INTO contratos (administradora_id, operadora_id, estipulante_id, numero_contrato, data_inicio, data_fim, quantidade_vidas, status) VALUES ($1,$2,$3,$4,$5,$6,$7,$8) RETURNING *`, [body.administradora_id || 1, body.operadora_id, body.estipulante_id || null, body.numero_contrato, body.data_inicio, body.data_fim || null, body.quantidade_vidas || 0, body.status || "ativo"])
    return NextResponse.json(successResponse(rows[0], "Contrato criado com sucesso"), { status: 201 })
  } catch (error) {
    return NextResponse.json({ success: false, message: "Erro interno" }, { status: 500 })
  }
}
