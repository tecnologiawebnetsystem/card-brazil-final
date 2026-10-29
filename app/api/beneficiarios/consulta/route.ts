import { type NextRequest, NextResponse } from "next/server"
import { query } from "@/back-end/lib/database"
import { apiAuthError, requireCadastroAccess } from "@/back-end/lib/api-auth"

export const dynamic = "force-dynamic"

export async function GET(request: NextRequest) {
  try {
    const { administradoraId } = await requireCadastroAccess("view")
    const searchParams = request.nextUrl.searchParams
    const cpf = searchParams.get("cpf")
    const nome = searchParams.get("nome")
    const email = searchParams.get("email")
    const id = searchParams.get("id")

    if (!cpf && !nome && !email && !id) {
      return NextResponse.json(
        { success: false, message: "Informe pelo menos um critério de busca (cpf, nome, email ou id)" },
        { status: 400 },
      )
    }

    const params: unknown[] = []
    const conditions: string[] = []
    if (id) { params.push(Number.parseInt(id, 10)); conditions.push(`b.id = $${params.length}`) }
    if (cpf) { params.push(`%${cpf.replace(/\D/g, '')}%`); conditions.push(`regexp_replace(COALESCE(pf.cpf, ''), '\\D', '', 'g') LIKE $${params.length}`) }
    if (nome) { params.push(`%${nome}%`); conditions.push(`p.nome_completo ILIKE $${params.length}`) }
    if (email) { params.push(`%${email}%`); conditions.push(`p.email ILIKE $${params.length}`) }
    params.unshift(administradoraId)
    conditions.unshift(`b.administradora_id = $1`, `b.deleted_at IS NULL`)
    const resultadoEnriquecido = await query(`SELECT b.*, p.nome_completo AS nome, pf.cpf, p.email, p.telefone_principal AS telefone, pl.nome AS plano_nome, COALESCE(opj.nome_fantasia, opj.razao_social, opp.nome_completo) AS operadora_nome FROM beneficiarios b LEFT JOIN pessoas p ON p.id = b.pessoa_id AND p.administradora_id = b.administradora_id LEFT JOIN pessoas_fisicas pf ON pf.pessoa_id = p.id LEFT JOIN planos pl ON pl.id = b.plano_id AND pl.administradora_id = b.administradora_id LEFT JOIN operadoras o ON o.id = pl.operadora_id AND o.administradora_id = b.administradora_id LEFT JOIN pessoas opp ON opp.id = o.pessoa_id LEFT JOIN pessoas_juridicas opj ON opj.pessoa_id = o.pessoa_id WHERE ${conditions.join(" AND ")} ORDER BY b.created_at DESC NULLS LAST`, params)
    /* Os relacionamentos detalhados são carregados por suas APIs próprias. */
    const resultado = resultadoEnriquecido

    const resultadoEnriquecidoFinal = resultado

    return NextResponse.json({
      success: true,
      data: resultadoEnriquecidoFinal,
      count: resultadoEnriquecidoFinal.length,
    })
  } catch (error) {
    const auth = apiAuthError(error)
    if (auth) return NextResponse.json({ success: false, message: auth.message }, { status: auth.status })
    console.error("[v0] Erro ao consultar beneficiário:", error)
    return NextResponse.json({ success: false, message: "Erro ao consultar beneficiário" }, { status: 500 })
  }
}
