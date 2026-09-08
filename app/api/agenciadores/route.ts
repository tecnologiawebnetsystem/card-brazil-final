import { type NextRequest, NextResponse } from "next/server"
import { successResponse } from "@/lib/api-response"
import { query } from "@/lib/database"
import { requireCadastroAccess } from "@/lib/api-auth"
import { exigirDependenciasCadastro } from "@/lib/cadastro-dependencias"
export async function GET() {
  try {
    const { administradoraId } = await requireCadastroAccess("view")
    const agenciadores = await query(`
      SELECT a.*, p.tipo_pessoa, p.nome_completo, p.razao_social, p.nome_fantasia,
        p.cpf AS pessoa_cpf, p.cnpj AS pessoa_cnpj, p.email, p.telefone_principal,
        COALESCE(p.nome_completo, p.razao_social, p.nome_fantasia, '') AS nome_exibicao
      FROM agenciadores a
      INNER JOIN pessoas p ON p.id = a.pessoa_id
      WHERE a.deleted_at IS NULL AND p.deleted_at IS NULL AND a.administradora_id = $1
      ORDER BY a.created_at DESC NULLS LAST`, [administradoraId])
    return NextResponse.json(successResponse(agenciadores))
  } catch (error) {
    return NextResponse.json({ success: false, message: "Não foi possível consultar os agenciadores no Neon" }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const pessoaId = await exigirDependenciasCadastro(body.pessoa_id)
    if (!body.administradora_id) {
      return NextResponse.json({ success: false, message: "Administradora é obrigatória" }, { status: 400 })
    }
    const rows = await query(`INSERT INTO agenciadores (administradora_id, pessoa_id, codigo_interno, comissao_percentual, observacoes, status) VALUES ($1,$2,$3,$4,$5,$6) RETURNING *`, [body.administradora_id, pessoaId, body.codigo_interno || null, body.comissao_percentual || 0, body.observacoes || null, body.status || "Ativo"])
    return NextResponse.json(successResponse(rows[0], "Agenciador criado com sucesso"), { status: 201 })
  } catch (error) {
    const message = error instanceof Error ? error.message : "Erro interno"
    const status = message.startsWith("Cadastre") || message.startsWith("A pessoa") ? 400 : 500
    return NextResponse.json({ success: false, message }, { status })
  }
}
