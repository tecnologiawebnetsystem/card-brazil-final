import type { NextRequest } from "next/server"
import { sql } from "@/lib/database"
import { apiResponse, apiError } from "@/lib/api-response"

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams
    const administradora_id = searchParams.get("administradora_id") || "1"
    const tipo_pessoa = searchParams.get("tipo_pessoa")
    const status = searchParams.get("status")
    const search = searchParams.get("search")

    let query = `
      SELECT 
        p.*,
        COUNT(DISTINCT e.id) as total_enderecos,
        COUNT(DISTINCT db.id) as total_contas
      FROM pessoas p
      LEFT JOIN enderecos e ON e.pessoa_id = p.id AND e.deleted_at IS NULL
      LEFT JOIN dados_bancarios db ON db.pessoa_id = p.id AND db.deleted_at IS NULL
      WHERE p.deleted_at IS NULL AND p.administradora_id = $1
    `
    const params: any[] = [administradora_id]
    let paramCount = 2

    if (tipo_pessoa) {
      query += ` AND p.tipo_pessoa = $${paramCount}`
      params.push(tipo_pessoa)
      paramCount++
    }

    if (status) {
      query += ` AND p.status = $${paramCount}`
      params.push(status)
      paramCount++
    }

    if (search) {
      query += ` AND (p.nome_completo ILIKE $${paramCount} OR p.razao_social ILIKE $${paramCount} OR p.cpf LIKE $${paramCount} OR p.cnpj LIKE $${paramCount} OR p.email ILIKE $${paramCount})`
      const searchTerm = `%${search}%`
      params.push(searchTerm)
      paramCount++
    }

    query += ` GROUP BY p.id ORDER BY p.created_at DESC`

    const pessoas = await sql(query, params)
    return apiResponse(pessoas, "Pessoas listadas com sucesso")
  } catch (error: any) {
    console.error("[v0] Erro ao listar pessoas:", error)
    return apiError(error.message, 500)
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const {
      administradora_id = 1,
      tipo_pessoa,
      nome_completo,
      cpf,
      rg,
      data_nascimento,
      sexo,
      estado_civil,
      nome_mae,
      nome_pai,
      razao_social,
      nome_fantasia,
      cnpj,
      inscricao_estadual,
      inscricao_municipal,
      email,
      telefone_principal,
      telefone_secundario,
      profissao,
      renda_mensal,
      observacoes,
      status = "ativo",
    } = body

    if (!tipo_pessoa) {
      return apiError("Campo obrigatório: tipo_pessoa", 400)
    }

    if (tipo_pessoa === "fisica" && !nome_completo) {
      return apiError("Nome completo é obrigatório para pessoa física", 400)
    }

    if (tipo_pessoa === "juridica" && !razao_social) {
      return apiError("Razão social é obrigatória para pessoa jurídica", 400)
    }

    const result = await sql(
      `INSERT INTO pessoas (
        administradora_id, tipo_pessoa, nome_completo, cpf, rg, data_nascimento, sexo, estado_civil,
        nome_mae, nome_pai, razao_social, nome_fantasia, cnpj, inscricao_estadual,
        inscricao_municipal, email, telefone_principal, telefone_secundario, profissao, 
        renda_mensal, observacoes, status
      ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16, $17, $18, $19, $20, $21, $22)
      RETURNING *`,
      [
        administradora_id,
        tipo_pessoa,
        nome_completo || null,
        cpf || null,
        rg || null,
        data_nascimento || null,
        sexo || null,
        estado_civil || null,
        nome_mae || null,
        nome_pai || null,
        razao_social || null,
        nome_fantasia || null,
        cnpj || null,
        inscricao_estadual || null,
        inscricao_municipal || null,
        email || null,
        telefone_principal || null,
        telefone_secundario || null,
        profissao || null,
        renda_mensal || null,
        observacoes || null,
        status,
      ],
    )

    return apiResponse(result[0], "Pessoa criada com sucesso", 201)
  } catch (error: any) {
    console.error("[v0] Erro ao criar pessoa:", error)
    if (error.code === "23505") {
      // unique_violation
      return apiError("CPF ou CNPJ já cadastrado", 409)
    }
    return apiError(error.message, 500)
  }
}
