import { type NextRequest, NextResponse } from "next/server"
import { query } from "@/lib/database"

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams
    const ativo = searchParams.get("ativo")
    const search = searchParams.get("search")

    const params: unknown[] = []
    const conditions = [`b.tipo_beneficiario = 'titular'`]
    if (ativo !== null) { params.push(ativo === "true" ? "ativo" : "inativo"); conditions.push(`b.status = $${params.length}`) }
    if (search) { params.push(`%${search}%`); conditions.push(`(p.nome_completo ILIKE $${params.length} OR p.cpf ILIKE $${params.length} OR p.email ILIKE $${params.length})`) }
    const titularesComDependentes = await query(`SELECT b.*, p.nome_completo AS nome, p.cpf, p.email, COUNT(d.id)::int AS quantidade_dependentes, COUNT(d.id) FILTER (WHERE d.status = 'ativo')::int AS dependentes_ativos FROM beneficiarios b LEFT JOIN pessoas p ON p.id = b.pessoa_id LEFT JOIN beneficiarios d ON d.titular_id = b.id WHERE ${conditions.join(" AND ")} GROUP BY b.id, p.nome_completo, p.cpf, p.email ORDER BY b.created_at DESC NULLS LAST`, params)

    return NextResponse.json({
      success: true,
      data: titularesComDependentes,
      count: titularesComDependentes.length,
    })
  } catch (error) {
    console.error("[v0] Erro ao buscar titulares:", error)
    return NextResponse.json(
      { success: false, message: "Erro ao buscar titulares", error: error instanceof Error ? error.message : "Erro desconhecido" },
      { status: 500 },
    )
  }
}
