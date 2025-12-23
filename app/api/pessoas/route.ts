import type { NextRequest } from "next/server"
import { query } from "@/lib/database"
import { apiResponse, apiError } from "@/lib/api-response"

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams
    const id_administradora = searchParams.get("id_administradora")
    const tipo_pessoa = searchParams.get("tipo_pessoa")
    const status = searchParams.get("status")
    const search = searchParams.get("search")

    let sql = `
      SELECT 
        p.*,
        COUNT(DISTINCT e.id) as total_enderecos,
        COUNT(DISTINCT db.id) as total_contas
      FROM pessoas p
      LEFT JOIN enderecos e ON e.pessoa_id = p.id AND e.deleted_at IS NULL
      LEFT JOIN dados_bancarios db ON db.pessoa_id = p.id AND db.deleted_at IS NULL
      WHERE p.deleted_at IS NULL
    `
    const params: any[] = []

    if (id_administradora) {
      sql += ` AND p.id_administradora = ?`
      params.push(id_administradora)
    }

    if (tipo_pessoa) {
      sql += ` AND p.tipo_pessoa = ?`
      params.push(tipo_pessoa)
    }

    if (status) {
      sql += ` AND p.status = ?`
      params.push(status)
    }

    if (search) {
      sql += ` AND (p.nome LIKE ? OR p.razao_social LIKE ? OR p.cpf LIKE ? OR p.cnpj LIKE ? OR p.email LIKE ?)`
      const searchTerm = `%${search}%`
      params.push(searchTerm, searchTerm, searchTerm, searchTerm, searchTerm)
    }

    sql += ` GROUP BY p.id ORDER BY p.created_at DESC`

    const pessoas = await query(sql, params)
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
      id_administradora,
      tipo_pessoa,
      nome,
      cpf,
      rg,
      data_nascimento,
      genero,
      estado_civil,
      nome_mae,
      nome_pai,
      razao_social,
      nome_fantasia,
      cnpj,
      inscricao_estadual,
      inscricao_municipal,
      data_fundacao,
      telefone,
      celular,
      email,
      site,
      observacoes,
      status = "ativo",
    } = body

    if (!id_administradora || !tipo_pessoa) {
      return apiError("Campos obrigatórios: id_administradora, tipo_pessoa", 400)
    }

    if (tipo_pessoa === "fisica") {
      if (!nome) return apiError("Nome é obrigatório para pessoa física", 400)
      if (!cpf) return apiError("CPF é obrigatório para pessoa física", 400)
    }

    if (tipo_pessoa === "juridica") {
      if (!razao_social) return apiError("Razão social é obrigatória para pessoa jurídica", 400)
      if (!cnpj) return apiError("CNPJ é obrigatório para pessoa jurídica", 400)
    }

    const result = await query(
      `INSERT INTO pessoas (
        id_administradora, tipo_pessoa, nome, cpf, rg, data_nascimento, genero, estado_civil,
        nome_mae, nome_pai, razao_social, nome_fantasia, cnpj, inscricao_estadual,
        inscricao_municipal, data_fundacao, telefone, celular, email, site, observacoes, status
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        id_administradora,
        tipo_pessoa,
        nome || null,
        cpf || null,
        rg || null,
        data_nascimento || null,
        genero || null,
        estado_civil || null,
        nome_mae || null,
        nome_pai || null,
        razao_social || null,
        nome_fantasia || null,
        cnpj || null,
        inscricao_estadual || null,
        inscricao_municipal || null,
        data_fundacao || null,
        telefone || null,
        celular || null,
        email || null,
        site || null,
        observacoes || null,
        status,
      ],
    )

    const pessoa = await query("SELECT * FROM pessoas WHERE id = ?", [result.insertId])

    return apiResponse(pessoa[0], "Pessoa criada com sucesso", 201)
  } catch (error: any) {
    console.error("[v0] Erro ao criar pessoa:", error)
    if (error.code === "ER_DUP_ENTRY") {
      return apiError("CPF ou CNPJ já cadastrado", 409)
    }
    return apiError(error.message, 500)
  }
}
