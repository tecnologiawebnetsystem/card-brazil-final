import { type NextRequest, NextResponse } from "next/server"
import { query } from "@/back-end/lib/database"
import { apiAuthError, requireCadastroAccess } from "@/back-end/lib/api-auth"

export const dynamic = "force-dynamic"

export async function GET(request: NextRequest) {
  try {
    const { administradoraId } = await requireCadastroAccess("view")
    const searchParams = request.nextUrl.searchParams
    const ativo = searchParams.get("ativo")
    const search = searchParams.get("search")

    const params: unknown[] = [administradoraId]
    const conditions = [`b.administradora_id = $1`, `b.tipo_beneficiario = 'titular'`]
    if (ativo !== null) { params.push(ativo === "true" ? "ativo" : "inativo"); conditions.push(`b.status = $${params.length}`) }
    if (search) { params.push(`%${search}%`); conditions.push(`(p.nome_completo ILIKE $${params.length} OR pf.cpf ILIKE $${params.length} OR p.email ILIKE $${params.length})`) }
    const titularesComDependentes = await query(`SELECT b.*, p.nome_completo AS nome, pf.cpf, p.email, COUNT(d.id)::int AS quantidade_dependentes, COUNT(d.id) FILTER (WHERE d.status = 'ativo')::int AS dependentes_ativos FROM beneficiarios b LEFT JOIN pessoas p ON p.id = b.pessoa_id AND p.administradora_id = b.administradora_id LEFT JOIN pessoas_fisicas pf ON pf.pessoa_id = p.id LEFT JOIN beneficiarios d ON d.titular_id = b.id AND d.administradora_id = b.administradora_id WHERE ${conditions.join(" AND ")} GROUP BY b.id, p.nome_completo, pf.cpf, p.email ORDER BY b.created_at DESC NULLS LAST`, params)

    return NextResponse.json({
      success: true,
      data: titularesComDependentes,
      count: titularesComDependentes.length,
    })
  } catch (error) {
    const auth = apiAuthError(error)
    if (auth) return NextResponse.json({ success: false, message: auth.message }, { status: auth.status })
    console.error("[v0] Erro ao buscar titulares:", error)
    return NextResponse.json({ success: false, message: "Erro ao buscar titulares" }, { status: 500 })
  }
}
