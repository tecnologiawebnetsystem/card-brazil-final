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
      conditions.push(`(nome ILIKE $${params.length} OR razao_social ILIKE $${params.length} OR cpf ILIKE $${params.length} OR cnpj ILIKE $${params.length} OR email ILIKE $${params.length})`)
    }
    const where = conditions.length ? ` WHERE ${conditions.join(" AND ")}` : ""
    const resultado = await query(`SELECT p.*, COALESCE(p.nome, p.razao_social, p.nome_fantasia, '') AS nome_exibicao FROM pessoas p${where ? where.replace(/\b(nome_completo|razao_social|cpf|cnpj|email)\b/g, 'p.$1').replace(/nome_completo/g, 'nome') : ''} ORDER BY p.created_at DESC NULLS LAST`, params)
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

    if (body.tipo_pessoa === "fisica" && !body.nome) {
      return apiError("Nome completo é obrigatório para pessoa física", 400)
    }

    if (body.tipo_pessoa === "juridica" && !body.razao_social) {
      return apiError("Razão social é obrigatória para pessoa jurídica", 400)
    }

    const novaPessoa = await query(`
      INSERT INTO pessoas (id_administradora, tipo_pessoa, nome, cpf, rg, data_nascimento, genero, estado_civil, nome_mae, nome_pai, razao_social, nome_fantasia, cnpj, email, telefone, celular, observacoes, status)
      VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13,$14,$15,$16,$17,$18)
      RETURNING *`, [body.id_administradora || body.administradora_id || 1, body.tipo_pessoa, body.nome || null, body.cpf || null, body.rg || null, body.data_nascimento || null, body.genero || null, body.estado_civil || null, body.nome_mae || null, body.nome_pai || null, body.razao_social || null, body.nome_fantasia || null, body.cnpj || null, body.email || null, body.telefone || null, body.celular || null, body.observacoes || null, body.status || "ativo"])
    return apiResponse(novaPessoa[0], "Pessoa criada com sucesso", 201)
  } catch (error: any) {
    console.error("[v0] Erro ao criar pessoa:", error)
    return apiError(error.message, 500)
  }
}
