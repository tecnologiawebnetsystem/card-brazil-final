import { type NextRequest, NextResponse } from "next/server"
import { successResponse } from "@/lib/api-response"
import { query } from "@/lib/database"

export async function GET(request: NextRequest) {
  try {
    const agenciadores = await query(`
      SELECT a.*, p.id AS pessoa_id, p.tipo_pessoa, p.nome_completo, p.razao_social, p.nome_fantasia,
        p.cpf AS pessoa_cpf, p.cnpj AS pessoa_cnpj, p.email, p.telefone_principal,
        COALESCE(p.nome_completo, p.razao_social, p.nome_fantasia, '') AS nome_exibicao,
        a.situacao AS status
      FROM agenciadores a
      INNER JOIN pessoas p ON p.id = a.pessoa_id
      WHERE p.deleted_at IS NULL
      ORDER BY a.created_at DESC NULLS LAST`)
    return NextResponse.json(successResponse(agenciadores))
  } catch (error) {
    return NextResponse.json({ success: false, message: "Erro interno" }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const rows = await query(`INSERT INTO agenciadores (pessoa_id, corretor_id, comissao_percentual, situacao) VALUES ($1,$2,$3,$4) RETURNING *`, [body.pessoa_id, body.corretor_id || null, body.comissao_percentual || 0, body.situacao || "ativo"])
    return NextResponse.json(successResponse(rows[0], "Agenciador criado com sucesso"), { status: 201 })
  } catch (error) {
    return NextResponse.json({ success: false, message: "Erro interno" }, { status: 500 })
  }
}
