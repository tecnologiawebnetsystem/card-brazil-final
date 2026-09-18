import { type NextRequest, NextResponse } from "next/server"
import { successResponse, apiError } from "@/lib/api-response"
import { query } from "@/lib/database"
import { requireCadastroAccess, apiAuthError } from "@/lib/api-auth"
import { exigirDependenciasCadastro } from "@/lib/cadastro-dependencias"

export async function GET(request: NextRequest) {
  try {
    const { administradoraId } = await requireCadastroAccess("view")
    const searchParams = request.nextUrl.searchParams
    const ativo = searchParams.get("ativo")

    const params: unknown[] = [administradoraId]
    const conditions = ["administradora_id = $1", "deleted_at IS NULL"]
    if (ativo !== null) {
      params.push(ativo === "true" ? "ativo" : "inativo")
      conditions.push(`status = $${params.length}`)
    }
    const operadoras = await query(
      `SELECT op.*, (op.status = 'ativo') AS ativo,
              COALESCE(p.nome, pj.razao_social) AS pessoa_nome,
              pf.cpf AS pessoa_cpf,
              pj.cnpj AS pessoa_cnpj
         FROM operadoras op
         JOIN pessoas p ON p.id = op.pessoa_id AND p.administradora_id = op.administradora_id
         LEFT JOIN pessoas_fisicas pf ON pf.pessoa_id = p.id
         LEFT JOIN pessoas_juridicas pj ON pj.pessoa_id = p.id
        WHERE op.${conditions.join(" AND op.")}
        ORDER BY op.created_at DESC NULLS LAST`,
      params,
    )
    return NextResponse.json(successResponse(operadoras))
  } catch (error) {
    console.error("[v0] Erro ao consultar operadoras:", error)
    return NextResponse.json({ success: false, message: "Erro ao consultar operadoras" }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const { administradoraId } = await requireCadastroAccess("create")
    const body = await request.json()
    const pessoaId = Number(body.pessoa_id)
    const naturezaOperadora = String(body.natureza_operadora || "").trim()
    const registroANS = String(body.registro_ans || "").trim()
    const status = body.ativo === false ? "inativo" : "ativo"
    if (!pessoaId || !naturezaOperadora || !registroANS) return apiError("Pessoa, natureza e registro ANS são obrigatórios", 400)
    await exigirDependenciasCadastro(pessoaId)
    const rows = await query(
      `INSERT INTO operadoras (pessoa_id, administradora_id, natureza_operadora, registro_ans, status)
       VALUES ($1, $2, $3, $4, $5) RETURNING *, (status = 'ativo') AS ativo`,
      [pessoaId, administradoraId, naturezaOperadora, registroANS, status],
    )
    return NextResponse.json(successResponse(rows[0], "Operadora criada com sucesso"), { status: 201 })
  } catch (error) {
    const auth = apiAuthError(error)
    if (auth) return apiError(auth.message, auth.status)
    return apiError("Não foi possível criar a operadora", 500)
  }
}
