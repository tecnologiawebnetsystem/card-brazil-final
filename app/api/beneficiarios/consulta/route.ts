import { type NextRequest, NextResponse } from "next/server"
import { query } from "@/lib/database"

export const dynamic = "force-dynamic"

export async function GET(request: NextRequest) {
  try {
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
    if (cpf) { params.push(`%${cpf.replace(/\D/g, '')}%`); conditions.push(`regexp_replace(COALESCE(p.cpf, ''), '\\D', '', 'g') LIKE $${params.length}`) }
    if (nome) { params.push(`%${nome}%`); conditions.push(`p.nome_completo ILIKE $${params.length}`) }
    if (email) { params.push(`%${email}%`); conditions.push(`p.email ILIKE $${params.length}`) }
    const resultadoEnriquecido = await query(`SELECT b.*, p.nome_completo AS nome, p.cpf, p.email, p.telefone_principal AS telefone, pl.nome AS plano_nome, o.nome AS operadora_nome FROM beneficiarios b LEFT JOIN pessoas p ON p.id = b.pessoa_id LEFT JOIN planos pl ON pl.id = b.plano_id LEFT JOIN operadoras o ON o.id = b.operadora_id WHERE ${conditions.join(" AND ")} ORDER BY b.created_at DESC NULLS LAST`, params)
    /* Os relacionamentos detalhados são carregados por suas APIs próprias. */
    const resultado = resultadoEnriquecido

    const resultadoEnriquecidoFinal = resultado

    return NextResponse.json({
      success: true,
      data: resultadoEnriquecidoFinal,
      count: resultadoEnriquecidoFinal.length,
    })
  } catch (error) {
    console.error("[v0] Erro ao consultar beneficiário:", error)
    return NextResponse.json(
      { success: false, message: "Erro ao consultar beneficiário", error: error instanceof Error ? error.message : "Erro desconhecido" },
      { status: 500 },
    )
  }
}
