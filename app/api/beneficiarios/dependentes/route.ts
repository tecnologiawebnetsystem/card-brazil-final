import { type NextRequest, NextResponse } from "next/server"
import { query } from "@/back-end/lib/database"
import { apiAuthError, requireCadastroAccess } from "@/back-end/lib/api-auth"

export async function GET(request: NextRequest) {
  try {
    const { administradoraId } = await requireCadastroAccess("view")
    const searchParams = request.nextUrl.searchParams
    const ativo = searchParams.get("ativo")
    const titular_id = searchParams.get("titular_id")
    const search = searchParams.get("search")

    const params: unknown[] = [administradoraId]
    const conditions = [`b.administradora_id = $1`, `b.tipo_beneficiario = 'dependente'`]
    if (ativo !== null) { params.push(ativo === "true" ? "ativo" : "inativo"); conditions.push(`b.status = $${params.length}`) }
    if (titular_id) { params.push(Number.parseInt(titular_id, 10)); conditions.push(`b.titular_id = $${params.length}`) }
    if (search) { params.push(`%${search}%`); conditions.push(`(p.nome_completo ILIKE $${params.length} OR pf.cpf ILIKE $${params.length} OR tp.nome_completo ILIKE $${params.length})`) }
    const dependentes = await query(`SELECT b.*, p.nome_completo AS nome, pf.cpf, p.email, tp.nome_completo AS titular_nome FROM beneficiarios b LEFT JOIN pessoas p ON p.id = b.pessoa_id AND p.administradora_id = b.administradora_id LEFT JOIN pessoas_fisicas pf ON pf.pessoa_id = p.id LEFT JOIN beneficiarios t ON t.id = b.titular_id AND t.administradora_id = b.administradora_id LEFT JOIN pessoas tp ON tp.id = t.pessoa_id WHERE ${conditions.join(" AND ")} ORDER BY b.created_at DESC NULLS LAST`, params)

    return NextResponse.json({
      success: true,
      data: dependentes,
      count: dependentes.length,
    })
  } catch (error) {
    const auth = apiAuthError(error)
    if (auth) return NextResponse.json({ success: false, message: auth.message }, { status: auth.status })
    console.error("[v0] Erro ao buscar dependentes:", error)
    return NextResponse.json({ success: false, message: "Erro ao buscar dependentes" }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const { administradoraId } = await requireCadastroAccess("create")
    const body = await request.json()

    // Validações básicas
    if (!body.beneficiario_titular_id) {
      return NextResponse.json(
        { success: false, message: "beneficiario_titular_id é obrigatório" },
        { status: 400 },
      )
    }

    const titularRows = await query(`SELECT id, administradora_id, contrato_id, plano_id FROM beneficiarios WHERE id = $1 AND administradora_id = $2 AND tipo_beneficiario = 'titular' AND status = 'ativo' AND deleted_at IS NULL`, [body.beneficiario_titular_id, administradoraId])
    const titular = titularRows[0]
    if (!titular) return NextResponse.json({ success: false, message: "Titular não encontrado" }, { status: 404 })
    const pessoa = await query(`SELECT id FROM pessoas WHERE id = $1 AND administradora_id = $2 AND deleted_at IS NULL`, [body.pessoa_id, administradoraId])
    if (!pessoa.length) return NextResponse.json({ success: false, message: "Pessoa não encontrada nesta administradora" }, { status: 404 })
    const rows = await query(`INSERT INTO beneficiarios (administradora_id, pessoa_id, contrato_id, plano_id, tipo_beneficiario, titular_id, data_inclusao, status) VALUES ($1,$2,$3,$4,'dependente',$5,$6,$7) RETURNING *`, [administradoraId, body.pessoa_id, titular.contrato_id, titular.plano_id, titular.id, body.data_inclusao || new Date().toISOString().split("T")[0], body.status || "ativo"])
    return NextResponse.json({ success: true, data: rows[0], message: "Dependente criado com sucesso" }, { status: 201 })
  } catch (error) {
    const auth = apiAuthError(error)
    if (auth) return NextResponse.json({ success: false, message: auth.message }, { status: auth.status })
    console.error("[v0] Erro ao criar dependente:", error)
    return NextResponse.json({ success: false, message: "Erro ao criar dependente" }, { status: 500 })
  }
}
