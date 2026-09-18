import { type NextRequest, NextResponse } from "next/server"
import { successResponse } from "@/lib/api-response"
import { query } from "@/lib/database"
import { requireCadastroAccess } from "@/lib/api-auth"
import { exigirDependenciasCadastro } from "@/lib/cadastro-dependencias"
export async function GET() {
  try {
    const { administradoraId } = await requireCadastroAccess("view")
    const corretores = await query(`
      SELECT c.*, c.status AS situacao, p.tipo_pessoa, p.nome_completo, pj.razao_social, pj.nome_fantasia,
        pf.cpf AS pessoa_cpf, pj.cnpj AS pessoa_cnpj, p.email, p.telefone_principal,
        COALESCE(p.nome_completo, pj.nome_fantasia, pj.razao_social, '') AS nome_exibicao
      FROM corretores c
      INNER JOIN pessoas p ON p.id = c.pessoa_id
      LEFT JOIN pessoas_fisicas pf ON pf.pessoa_id = p.id
      LEFT JOIN pessoas_juridicas pj ON pj.pessoa_id = p.id
      WHERE c.deleted_at IS NULL AND p.deleted_at IS NULL AND c.administradora_id = $1
      ORDER BY c.created_at DESC NULLS LAST`, [administradoraId])
    return NextResponse.json(successResponse(corretores))
  } catch (error) {
    return NextResponse.json({ success: false, message: "Não foi possível consultar os corretores no Neon" }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const { administradoraId } = await requireCadastroAccess("create")
    const body = await request.json()
    const pessoaId = await exigirDependenciasCadastro(body.pessoa_id)
    if (!body.registro_susep) {
      return NextResponse.json({ success: false, message: "Registro SUSEP é obrigatório" }, { status: 400 })
    }
    const rows = await query(`INSERT INTO corretores (administradora_id, pessoa_id, registro_susep, codigo_interno, comissao_percentual, observacoes, status) VALUES ($1,$2,$3,$4,$5,$6,$7) RETURNING *`, [administradoraId, pessoaId, body.registro_susep, body.codigo_interno || null, body.comissao_percentual || 0, body.observacoes || null, body.status || "ativo"])
    return NextResponse.json(successResponse(rows[0], "Corretor criado com sucesso"), { status: 201 })
  } catch (error) {
    const message = error instanceof Error ? error.message : "Erro interno"
    const status = message.startsWith("Cadastre") || message.startsWith("A pessoa") ? 400 : 500
    return NextResponse.json({ success: false, message }, { status })
  }
}
