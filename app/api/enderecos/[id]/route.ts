import type { NextRequest } from "next/server"
import { query } from "@/lib/database"
import { apiResponse, apiError } from "@/lib/api-response"

export async function PUT(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const { id } = params
    const body = await request.json()

    const endereco = await query("SELECT * FROM enderecos WHERE id = ? AND deleted_at IS NULL", [id])
    if (!endereco || endereco.length === 0) {
      return apiError("Endereço não encontrado", 404)
    }

    // Se for principal, remove principal dos outros endereços
    if (body.principal) {
      await query("UPDATE enderecos SET principal = FALSE WHERE pessoa_id = ? AND id_administradora = ? AND id != ?", [
        endereco[0].pessoa_id,
        endereco[0].id_administradora,
        id,
      ])
    }

    const fields = Object.keys(body)
      .filter((key) => key !== "id" && key !== "created_at" && key !== "updated_at")
      .map((key) => `${key} = ?`)
      .join(", ")

    const values = Object.keys(body)
      .filter((key) => key !== "id" && key !== "created_at" && key !== "updated_at")
      .map((key) => body[key])

    await query(`UPDATE enderecos SET ${fields} WHERE id = ?`, [...values, id])

    const updated = await query("SELECT * FROM enderecos WHERE id = ?", [id])
    return apiResponse(updated[0], "Endereço atualizado com sucesso")
  } catch (error: any) {
    console.error("[v0] Erro ao atualizar endereço:", error)
    return apiError(error.message, 500)
  }
}

export async function DELETE(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const { id } = params

    const endereco = await query("SELECT * FROM enderecos WHERE id = ? AND deleted_at IS NULL", [id])
    if (!endereco || endereco.length === 0) {
      return apiError("Endereço não encontrado", 404)
    }

    await query("UPDATE enderecos SET deleted_at = NOW() WHERE id = ?", [id])
    return apiResponse(null, "Endereço excluído com sucesso")
  } catch (error: any) {
    console.error("[v0] Erro ao excluir endereço:", error)
    return apiError(error.message, 500)
  }
}
