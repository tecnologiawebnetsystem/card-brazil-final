import { type NextRequest, NextResponse } from "next/server"
import { successResponse } from "@/lib/api-response"
import { query } from "@/lib/database"
import { exigirDependenciasCadastro } from "@/lib/cadastro-dependencias"
export async function GET() {
  try {
    const estipulantes = await query(`
      SELECT e.*, p.tipo_pessoa, p.nome_completo, p.razao_social, p.nome_fantasia,
        p.cpf AS pessoa_cpf, p.cnpj AS pessoa_cnpj, p.email, p.telefone_principal,
        COALESCE(p.nome_completo, p.razao_social, p.nome_fantasia, '') AS nome_exibicao
      FROM estipulantes e
      INNER JOIN pessoas p ON p.id = e.pessoa_id
      WHERE e.deleted_at IS NULL AND p.deleted_at IS NULL
      ORDER BY e.created_at DESC NULLS LAST`)
    return NextResponse.json(successResponse(estipulantes))
  } catch (error) {
    return NextResponse.json({ success: false, message: "Não foi possível consultar os estipulantes no Neon" }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const pessoaId = await exigirDependenciasCadastro(body.pessoa_id)
    if (!body.administradora_id) {
      return NextResponse.json({ success: false, message: "Administradora é obrigatória" }, { status: 400 })
    }
    const rows = await query(`INSERT INTO estipulantes (administradora_id, pessoa_id, codigo_interno, observacoes, status) VALUES ($1,$2,$3,$4,$5) RETURNING *`, [body.administradora_id, pessoaId, body.codigo_interno || null, body.observacoes || null, body.status || "Ativo"])
    return NextResponse.json(successResponse(rows[0], "Estipulante criado com sucesso"), { status: 201 })
  } catch (error) {
    const message = error instanceof Error ? error.message : "Erro interno"
    const status = message.startsWith("Cadastre") || message.startsWith("A pessoa") ? 400 : 500
    return NextResponse.json({ success: false, message }, { status })
  }
}
