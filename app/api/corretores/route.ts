import { type NextRequest, NextResponse } from "next/server"
import { successResponse } from "@/lib/api-response"
import { query } from "@/lib/database"

export async function GET(request: NextRequest) {
  try {
    const corretores = await query("SELECT c.*, COALESCE(c.nome, p.nome_completo, p.razao_social, p.nome_fantasia, '') AS nome_exibicao, p.cpf AS pessoa_cpf, p.cnpj AS pessoa_cnpj FROM corretores c LEFT JOIN pessoas p ON p.id = c.pessoa_id ORDER BY c.created_at DESC NULLS LAST")
    return NextResponse.json(successResponse(corretores))
  } catch (error) {
    return NextResponse.json({ success: false, message: "Erro interno" }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const rows = await query(`INSERT INTO corretores (administradora_id, nome, cpf_cnpj, email, telefone, celular, percentual_comissao, ativo, observacoes) VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9) RETURNING *`, [body.administradora_id || 1, body.nome, body.cpf_cnpj || null, body.email || null, body.telefone || null, body.celular || null, body.percentual_comissao || 0, body.ativo !== false, body.observacoes || null])
    return NextResponse.json(successResponse(rows[0], "Corretor criado com sucesso"), { status: 201 })
  } catch (error) {
    return NextResponse.json({ success: false, message: "Erro interno" }, { status: 500 })
  }
}
