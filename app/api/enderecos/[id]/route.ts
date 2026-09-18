import type { NextRequest } from "next/server"
import { query } from "@/lib/database"
import { apiResponse, apiError } from "@/lib/api-response"
import { idSchema } from "@/lib/validation"

const editableFields = ["tipo_endereco", "cep", "logradouro", "numero", "complemento", "bairro", "cidade", "estado", "pais", "is_principal"]

export async function PUT(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const id = idSchema.parse((await params).id)
    const body = await request.json()

    const endereco = await query("SELECT * FROM enderecos WHERE id = $1", [id])
    if (!endereco || endereco.length === 0) {
      return apiError("Endereço não encontrado", 404)
    }

    // Se for principal, remove principal dos outros endereços
    if ((body.is_principal ?? body.principal)) {
      await query("UPDATE enderecos SET is_principal = FALSE WHERE pessoa_id = ? AND id != ?", [
        endereco[0].pessoa_id,
        id,
      ])
    }

    const fields = Object.keys(body)
      .filter((key) => editableFields.includes(key))
      .map((key, index) => `${key} = $${index + 1}`)
      .join(", ")

    const values = Object.keys(body)
      .filter((key) => editableFields.includes(key))
      .map((key) => body[key])

    if (!fields) return apiError("Nenhum campo válido para atualizar", 400)
    await query(`UPDATE enderecos SET ${fields} WHERE id = $${values.length + 1}`, [...values, id])

    const updated = await query("SELECT * FROM enderecos WHERE id = $1", [id])
    return apiResponse(updated[0], "Endereço atualizado com sucesso")
  } catch (error: any) {
    console.error("[v0] Erro ao atualizar endereço:", error)
    return apiError(error.message, 500)
  }
}

export async function DELETE(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const id = idSchema.parse((await params).id)

    const endereco = await query("SELECT * FROM enderecos WHERE id = $1", [id])
    if (!endereco || endereco.length === 0) {
      return apiError("Endereço não encontrado", 404)
    }

    await query("DELETE FROM enderecos WHERE id = $1", [id])
    return apiResponse(null, "Endereço excluído com sucesso")
  } catch (error: any) {
    console.error("[v0] Erro ao excluir endereço:", error)
    return apiError(error.message, 500)
  }
}
