import type { NextRequest } from "next/server"
import { query } from "@/lib/database"
import { apiResponse, apiError } from "@/lib/api-response"

export async function GET(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const { id } = params

    const pessoa = await query(
      `SELECT p.*, 
        (SELECT JSON_ARRAYAGG(JSON_OBJECT(
          'id', e.id,
          'tipo_endereco', e.tipo_endereco,
          'principal', e.principal,
          'cep', e.cep,
          'logradouro', e.logradouro,
          'numero', e.numero,
          'complemento', e.complemento,
          'bairro', e.bairro,
          'cidade', e.cidade,
          'estado', e.estado,
          'pais', e.pais
        )) FROM enderecos e WHERE e.pessoa_id = p.id AND e.deleted_at IS NULL) as enderecos,
        (SELECT JSON_ARRAYAGG(JSON_OBJECT(
          'id', db.id,
          'principal', db.principal,
          'banco_codigo', db.banco_codigo,
          'banco_nome', db.banco_nome,
          'agencia', db.agencia,
          'agencia_digito', db.agencia_digito,
          'conta', db.conta,
          'conta_digito', db.conta_digito,
          'tipo_conta', db.tipo_conta,
          'pix_tipo', db.pix_tipo,
          'pix_chave', db.pix_chave,
          'status', db.status
        )) FROM dados_bancarios db WHERE db.pessoa_id = p.id AND db.deleted_at IS NULL) as dados_bancarios
      FROM pessoas p 
      WHERE p.id = ? AND p.deleted_at IS NULL`,
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

    const pessoa = await query("SELECT * FROM pessoas WHERE id = ? AND deleted_at IS NULL", [id])
    if (!pessoa || pessoa.length === 0) {
      return apiError("Pessoa não encontrada", 404)
    }

    const fields = Object.keys(body)
      .filter((key) => key !== "id" && key !== "created_at" && key !== "updated_at")
      .map((key) => `${key} = ?`)
      .join(", ")

    const values = Object.keys(body)
      .filter((key) => key !== "id" && key !== "created_at" && key !== "updated_at")
      .map((key) => body[key])

    await query(`UPDATE pessoas SET ${fields} WHERE id = ?`, [...values, id])

    const updated = await query("SELECT * FROM pessoas WHERE id = ?", [id])
    return apiResponse(updated[0], "Pessoa atualizada com sucesso")
  } catch (error: any) {
    console.error("[v0] Erro ao atualizar pessoa:", error)
    if (error.code === "ER_DUP_ENTRY") {
      return apiError("CPF ou CNPJ já cadastrado", 409)
    }
    return apiError(error.message, 500)
  }
}

export async function DELETE(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const { id } = params

    const pessoa = await query("SELECT * FROM pessoas WHERE id = ? AND deleted_at IS NULL", [id])
    if (!pessoa || pessoa.length === 0) {
      return apiError("Pessoa não encontrada", 404)
    }

    await query("UPDATE pessoas SET deleted_at = NOW() WHERE id = ?", [id])

    return apiResponse(null, "Pessoa excluída com sucesso")
  } catch (error: any) {
    console.error("[v0] Erro ao excluir pessoa:", error)
    return apiError(error.message, 500)
  }
}
