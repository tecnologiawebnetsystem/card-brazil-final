import type { NextRequest } from "next/server"
import { query } from "@/lib/database"
import { apiResponse, apiError } from "@/lib/api-response"

export async function PUT(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const { id } = params
    const body = await request.json()

    const conta = await query("SELECT * FROM dados_bancarios WHERE id = ? AND deleted_at IS NULL", [id])
    if (!conta || conta.length === 0) {
      return apiError("Conta bancária não encontrada", 404)
    }

    // Se for principal, remove principal das outras contas
    if (body.principal) {
      await query(
        "UPDATE dados_bancarios SET principal = FALSE WHERE pessoa_id = ? AND id_administradora = ? AND id != ?",
        [conta[0].pessoa_id, conta[0].id_administradora, id],
      )
    }

    const fields = Object.keys(body)
      .filter((key) => key !== "id" && key !== "created_at" && key !== "updated_at")
      .map((key) => `${key} = ?`)
      .join(", ")

    const values = Object.keys(body)
      .filter((key) => key !== "id" && key !== "created_at" && key !== "updated_at")
      .map((key) => body[key])

    await query(`UPDATE dados_bancarios SET ${fields} WHERE id = ?`, [...values, id])

    const updated = await query("SELECT * FROM dados_bancarios WHERE id = ?", [id])
    return apiResponse(updated[0], "Conta bancária atualizada com sucesso")
  } catch (error: any) {
    console.error("[v0] Erro ao atualizar conta bancária:", error)
    return apiError(error.message, 500)
  }
}

export async function DELETE(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const { id } = params

    const conta = await query("SELECT * FROM dados_bancarios WHERE id = ? AND deleted_at IS NULL", [id])
    if (!conta || conta.length === 0) {
      return apiError("Conta bancária não encontrada", 404)
    }

    await query("UPDATE dados_bancarios SET deleted_at = NOW() WHERE id = ?", [id])
    return apiResponse(null, "Conta bancária excluída com sucesso")
  } catch (error: any) {
    console.error("[v0] Erro ao excluir conta bancária:", error)
    return apiError(error.message, 500)
  }
}
