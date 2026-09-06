import { type NextRequest, NextResponse } from "next/server"
import { successResponse } from "@/lib/api-response"
import { query } from "@/lib/database"

export async function GET(request: NextRequest) {
  try {
    const estipulantes = await query(`
      SELECT e.*, p.id AS pessoa_id, p.tipo_pessoa, p.nome_completo, p.razao_social, p.nome_fantasia,
        p.cpf AS pessoa_cpf, p.cnpj AS pessoa_cnpj, p.email, p.telefone_principal,
        COALESCE(p.nome_completo, p.razao_social, p.nome_fantasia, '') AS nome_exibicao,
        e.situacao AS status
      FROM estipulantes e
      INNER JOIN pessoas p ON p.id = e.pessoa_id
      WHERE p.deleted_at IS NULL
      ORDER BY e.created_at DESC NULLS LAST`)
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
    const rows = await query(`INSERT INTO estipulantes (pessoa_id, operadora_id, codigo_estipulante, situacao) VALUES ($1,$2,$3,$4) RETURNING *`, [body.pessoa_id, body.operadora_id || null, body.codigo_estipulante || null, body.situacao || "ativo"])
    return NextResponse.json(successResponse(rows[0], "Estipulante criado com sucesso"), { status: 201 })
  } catch (error) {
    return NextResponse.json({ success: false, message: "Erro interno" }, { status: 500 })
  }
}
