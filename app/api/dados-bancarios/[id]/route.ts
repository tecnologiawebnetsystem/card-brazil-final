import type { NextRequest } from "next/server"
import { query } from "@/lib/database"
import { apiResponse, apiError } from "@/lib/api-response"
import { apiAuthError, requireCadastroAccess } from "@/lib/api-auth"
import { idSchema } from "@/lib/validation"

const editableFields = ["banco_codigo", "banco_nome", "agencia", "agencia_digito", "conta", "conta_digito", "tipo_conta", "pix_tipo", "pix_chave", "is_principal"]

export async function PUT(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { administradoraId } = await requireCadastroAccess("edit")
    const id = idSchema.parse((await params).id)
    const body = await request.json()

    const conta = await query("SELECT db.* FROM dados_bancarios db JOIN pessoas p ON p.id = db.pessoa_id WHERE db.id = $1 AND p.administradora_id = $2 AND p.deleted_at IS NULL", [id, administradoraId])
    if (!conta || conta.length === 0) {
      return apiError("Conta bancária não encontrada", 404)
    }

    // Se for principal, remove principal das outras contas
    if ((body.is_principal ?? body.principal)) {
      await query(
        "UPDATE dados_bancarios SET is_principal = FALSE WHERE pessoa_id = $1 AND id != $2",
        [conta[0].pessoa_id, id],
      )
    }

    const fields = Object.keys(body)
      .filter((key) => editableFields.includes(key))
      .map((key) => `${key} = ${Object.keys(body).filter((candidate) => editableFields.includes(candidate)).indexOf(key) + 1}`)
      .join(", ")

    const values = Object.keys(body)
      .filter((key) => editableFields.includes(key))
      .map((key) => body[key])

    if (!fields) return apiError("Nenhum campo válido para atualizar", 400)
    await query(`UPDATE dados_bancarios SET ${fields} WHERE id = $${values.length + 1}`, [...values, id])

    const updated = await query("SELECT * FROM dados_bancarios WHERE id = $1", [id])
    return apiResponse(updated[0], "Conta bancária atualizada com sucesso")
  } catch (error: any) {
    const authError = apiAuthError(error)
    return authError ? apiError(authError.message, authError.status) : apiError("Não foi possível atualizar a conta bancária", 500)
  }
}

export async function DELETE(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { administradoraId } = await requireCadastroAccess("delete")
    const id = idSchema.parse((await params).id)

    const conta = await query("SELECT db.* FROM dados_bancarios db JOIN pessoas p ON p.id = db.pessoa_id WHERE db.id = $1 AND p.administradora_id = $2 AND p.deleted_at IS NULL", [id, administradoraId])
    if (!conta || conta.length === 0) {
      return apiError("Conta bancária não encontrada", 404)
    }

    await query("DELETE FROM dados_bancarios WHERE id = $1", [id])
    return apiResponse(null, "Conta bancária excluída com sucesso")
  } catch (error: any) {
    const authError = apiAuthError(error)
    return authError ? apiError(authError.message, authError.status) : apiError("Não foi possível excluir a conta bancária", 500)
  }
}
