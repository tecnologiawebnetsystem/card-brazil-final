import type { NextRequest } from "next/server"
import { apiResponse, apiError } from "@/lib/api-response"
import { query } from "@/lib/database"

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams
    const tipo_pessoa = searchParams.get("tipo_pessoa")
    const status = searchParams.get("status")
    const search = searchParams.get("search")

    const conditions: string[] = []
    const params: unknown[] = []
    if (tipo_pessoa) { params.push(tipo_pessoa); conditions.push(`tipo_pessoa = $${params.length}`) }
    if (status) { params.push(status); conditions.push(`status = $${params.length}`) }
    if (search) {
      params.push(`%${search}%`)
      conditions.push(`(nome_completo ILIKE $${params.length} OR razao_social ILIKE $${params.length} OR cpf ILIKE $${params.length} OR cnpj ILIKE $${params.length} OR email ILIKE $${params.length})`)
    }
    const where = conditions.length ? ` WHERE ${conditions.join(" AND ")}` : ""
    const resultado = await query(`SELECT * FROM pessoas${where} ORDER BY created_at DESC NULLS LAST`, params)
    return apiResponse(resultado, "Pessoas listadas com sucesso")
  } catch (error: any) {
    console.error("[v0] Erro ao listar pessoas:", error)
    return apiError(error.message, 500)
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()

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
      INSERT INTO pessoas (administradora_id, tipo_pessoa, nome_completo, cpf, rg, data_nascimento, sexo, estado_civil, nome_mae, nome_pai, razao_social, nome_fantasia, cnpj, email, telefone_principal, telefone_secundario, profissao, renda_mensal, observacoes, status)
      VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13,$14,$15,$16,$17,$18,$19,$20)
      RETURNING *`, [body.administradora_id || 1, body.tipo_pessoa, body.nome_completo || null, body.cpf || null, body.rg || null, body.data_nascimento || null, body.sexo || null, body.estado_civil || null, body.nome_mae || null, body.nome_pai || null, body.razao_social || null, body.nome_fantasia || null, body.cnpj || null, body.email || null, body.telefone_principal || null, body.telefone_secundario || null, body.profissao || null, body.renda_mensal || null, body.observacoes || null, body.status || "ativo"])
    return apiResponse(novaPessoa[0], "Pessoa criada com sucesso", 201)
  } catch (error: any) {
    console.error("[v0] Erro ao criar pessoa:", error)
    return apiError(error.message, 500)
  }
}
