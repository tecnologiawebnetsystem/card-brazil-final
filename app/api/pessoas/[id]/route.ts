import type { NextRequest } from "next/server"
import { sql } from "@/lib/database"
import { apiResponse, apiError } from "@/lib/api-response"

export async function GET(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const { id } = params

    const pessoa = await sql(
      `SELECT p.*, 
        (SELECT json_agg(json_build_object(
          'id', e.id,
          'tipo_endereco', e.tipo_endereco,
          'is_principal', e.is_principal,
          'cep', e.cep,
          'logradouro', e.logradouro,
          'numero', e.numero,
          'complemento', e.complemento,
          'bairro', e.bairro,
          'cidade', e.cidade,
          'estado', e.estado,
          'pais', e.pais
        )) FROM enderecos e WHERE e.pessoa_id = p.id AND e.deleted_at IS NULL) as enderecos,
        (SELECT json_agg(json_build_object(
          'id', db.id,
          'is_principal', db.is_principal,
          'banco_codigo', db.banco_codigo,
          'banco_nome', db.banco_nome,
          'agencia', db.agencia,
          'agencia_digito', db.agencia_digito,
          'conta', db.conta,
          'conta_digito', db.conta_digito,
          'tipo_conta', db.tipo_conta,
          'pix_tipo', db.pix_tipo,
          'pix_chave', db.pix_chave
        )) FROM dados_bancarios db WHERE db.pessoa_id = p.id AND db.deleted_at IS NULL) as dados_bancarios
      FROM pessoas p 
      WHERE p.id = $1 AND p.deleted_at IS NULL`,
      [id],
    )

    if (!pessoa || pessoa.length === 0) {
      return apiError("Pessoa não encontrada", 404)
    }

    return apiResponse(pessoa[0], "Pessoa encontrada com sucesso")
  } catch (error: any) {
    console.error("[v0] Erro ao buscar pessoa:", error)
    return apiError(error.message, 500)
  }
}

export async function PUT(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const { id } = params
    const body = await request.json()

    const pessoa = await sql("SELECT * FROM pessoas WHERE id = $1 AND deleted_at IS NULL", [id])
    if (!pessoa || pessoa.length === 0) {
      return apiError("Pessoa não encontrada", 404)
    }

    const allowedFields = [
      "tipo_pessoa",
      "nome_completo",
      "cpf",
      "rg",
      "data_nascimento",
      "sexo",
      "estado_civil",
      "nome_mae",
      "nome_pai",
      "razao_social",
      "nome_fantasia",
      "cnpj",
      "inscricao_estadual",
      "inscricao_municipal",
      "email",
      "telefone_principal",
      "telefone_secundario",
      "profissao",
      "renda_mensal",
      "observacoes",
      "status",
    ]

    const updates: string[] = []
    const values: any[] = []
    let paramCount = 1

    Object.keys(body).forEach((key) => {
      if (allowedFields.includes(key)) {
        updates.push(`${key} = $${paramCount}`)
        values.push(body[key])
        paramCount++
      }
    })

    if (updates.length === 0) {
      return apiError("Nenhum campo válido para atualizar", 400)
    }

    updates.push(`updated_at = CURRENT_TIMESTAMP`)
    values.push(id)

    await sql(`UPDATE pessoas SET ${updates.join(", ")} WHERE id = $${paramCount}`, values)

    const updated = await sql("SELECT * FROM pessoas WHERE id = $1", [id])
    return apiResponse(updated[0], "Pessoa atualizada com sucesso")
  } catch (error: any) {
    console.error("[v0] Erro ao atualizar pessoa:", error)
    if (error.code === "23505") {
      return apiError("CPF ou CNPJ já cadastrado", 409)
    }
    return apiError(error.message, 500)
  }
}

export async function DELETE(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const { id } = params

    const pessoa = await sql("SELECT * FROM pessoas WHERE id = $1 AND deleted_at IS NULL", [id])
    if (!pessoa || pessoa.length === 0) {
      return apiError("Pessoa não encontrada", 404)
    }

    await sql("UPDATE pessoas SET deleted_at = CURRENT_TIMESTAMP WHERE id = $1", [id])

    return apiResponse(null, "Pessoa excluída com sucesso")
  } catch (error: any) {
    console.error("[v0] Erro ao excluir pessoa:", error)
    return apiError(error.message, 500)
  }
}
