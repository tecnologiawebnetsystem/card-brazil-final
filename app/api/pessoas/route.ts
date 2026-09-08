import type { NextRequest } from "next/server"
import { apiResponse, apiError } from "@/lib/api-response"
import { query } from "@/lib/database"
import { authErrorStatus, requireCadastroAccess } from "@/lib/api-auth"
import { pessoaSchema, zodFieldErrors } from "@/lib/validation"
import { recordCadastroAudit } from "@/lib/cadastro-audit"

export async function GET(request: NextRequest) {
  try {
    const { administradoraId } = await requireCadastroAccess("view")
    const searchParams = request.nextUrl.searchParams
    const tipo_pessoa = searchParams.get("tipo_pessoa")
    const status = searchParams.get("status")
    const search = searchParams.get("search")

    const conditions: string[] = [`p.administradora_id = $1`]
    const params: unknown[] = [administradoraId]
    if (tipo_pessoa) { params.push(tipo_pessoa); conditions.push(`tipo_pessoa = $${params.length}`) }
    if (status) { params.push(status); conditions.push(`status = $${params.length}`) }
    if (search) {
      params.push(`%${search}%`)
      conditions.push(`(nome_completo ILIKE $${params.length} OR razao_social ILIKE $${params.length} OR nome_fantasia ILIKE $${params.length} OR cpf ILIKE $${params.length} OR cnpj ILIKE $${params.length} OR email ILIKE $${params.length} OR telefone_principal ILIKE $${params.length} OR telefone_secundario ILIKE $${params.length})`)
    }
    const where = ` WHERE ${conditions.join(" AND ")}`
    const resultado = await query(`SELECT p.*, COALESCE(p.nome_completo, p.razao_social, p.nome_fantasia, '') AS nome_exibicao FROM pessoas p${where} ORDER BY p.created_at DESC NULLS LAST`, params)
    return apiResponse(resultado, "Pessoas listadas com sucesso")
  } catch (error: any) {
    console.error("[v0] Erro ao listar pessoas:", error)
    return apiError(error instanceof Error && (error.message === "UNAUTHENTICATED" || error.message === "FORBIDDEN") ? (error.message === "UNAUTHENTICATED" ? "Não autenticado" : "Sem permissão para este cadastro") : "Não foi possível processar a pessoa", authErrorStatus(error))
  }
}

export async function POST(request: NextRequest) {
  try {
    const { administradoraId } = await requireCadastroAccess("create")
    const body = await request.json()
    const parsed = pessoaSchema.safeParse(body)
    if (!parsed.success) return apiError("Dados da pessoa inválidos", 400, zodFieldErrors(parsed.error))
    const pessoa = parsed.data

    if (!body.tipo_pessoa) {
      return apiError("Campo obrigatório: tipo_pessoa", 400)
    }

    if (body.tipo_pessoa === "fisica" && !body.nome_completo) {
      return apiError("Nome completo é obrigatório para pessoa física", 400)
    }

    if (body.tipo_pessoa === "juridica" && !body.razao_social) {
      return apiError("Razão social é obrigatória para pessoa jurídica", 400)
    }

    const novaPessoa = await query(`
      INSERT INTO pessoas (administradora_id, tipo_pessoa, nome_completo, cpf, rg, data_nascimento, sexo, estado_civil, nome_mae, nome_pai, razao_social, nome_fantasia, cnpj, email, telefone_principal, telefone_secundario, profissao, observacoes, status)
      VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13,$14,$15,$16,$17,$18,$19)
      RETURNING *`, [administradoraId, pessoa.tipo_pessoa, pessoa.nome_completo || null, pessoa.cpf || null, pessoa.rg || null, pessoa.data_nascimento || null, pessoa.sexo || null, pessoa.estado_civil || null, pessoa.nome_mae || null, pessoa.nome_pai || null, pessoa.razao_social || null, pessoa.nome_fantasia || null, pessoa.cnpj || null, pessoa.email || null, pessoa.telefone_principal || null, pessoa.telefone_secundario || null, pessoa.profissao || null, pessoa.observacoes || null, pessoa.status || "ativo"])
    await recordCadastroAudit({ administradoraId, userId: (await requireCadastroAccess("create")).userId, action: "create", tableName: "pessoas", recordId: novaPessoa[0].id, after: novaPessoa[0] })
    return apiResponse(novaPessoa[0], "Pessoa criada com sucesso", 201)
  } catch (error: any) {
    console.error("[v0] Erro ao criar pessoa:", error)
    return apiError(error instanceof Error && (error.message === "UNAUTHENTICATED" || error.message === "FORBIDDEN") ? (error.message === "UNAUTHENTICATED" ? "Não autenticado" : "Sem permissão para este cadastro") : "Não foi possível processar a pessoa", authErrorStatus(error))
  }
}
