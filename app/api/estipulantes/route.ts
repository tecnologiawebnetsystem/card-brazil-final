import { type NextRequest, NextResponse } from "next/server"
import { successResponse } from "@/lib/api-response"
import { query } from "@/lib/database"

export async function GET(request: NextRequest) {
  try {
    const estipulantes = await query("SELECT * FROM estipulantes ORDER BY created_at DESC NULLS LAST")
    return NextResponse.json(successResponse(estipulantes))
  } catch (error) {
    return NextResponse.json({ success: false, message: "Erro interno" }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    if (!body.pessoa_id && !body.nome) {
      return NextResponse.json({ success: false, message: "Pessoa ou nome é obrigatório" }, { status: 400 })
    }
    const rows = await query(`INSERT INTO estipulantes (administradora_id, pessoa_id, nome, cnpj, cpf, email, telefone, status) VALUES ($1,$2,$3,$4,$5,$6,$7,$8) RETURNING *`, [body.administradora_id || 1, body.pessoa_id || null, body.nome || null, body.cnpj || null, body.cpf || null, body.email || null, body.telefone || null, body.status || "ativo"])
    return NextResponse.json(successResponse(rows[0], "Estipulante criado com sucesso"), { status: 201 })
  } catch (error) {
    return NextResponse.json({ success: false, message: "Erro interno" }, { status: 500 })
  }
}
