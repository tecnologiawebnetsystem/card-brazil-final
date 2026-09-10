import { type NextRequest, NextResponse } from "next/server"
import { query } from "@/lib/database"
import { requireCobrancaAccess, apiAuthError } from "@/lib/api-auth"
import { apiError, apiResponse } from "@/lib/api-response"

function failure(error: unknown) { const auth = apiAuthError(error); return auth ? apiError(auth.message, auth.status) : apiError("Não foi possível processar a cobrança", 500) }

export async function GET(_: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try { const { administradoraId } = await requireCobrancaAccess("view"); const { id } = await params; const rows = await query("SELECT * FROM cobrancas WHERE id = $1 AND administradora_id = $2", [Number(id), administradoraId]); return rows[0] ? apiResponse(rows[0]) : apiError("Cobrança não encontrada", 404) } catch (error) { return failure(error) }
}

export async function PUT(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { administradoraId } = await requireCobrancaAccess("edit"); const { id } = await params; const body = await request.json()
    const allowed = ["status", "data_fim", "valor_atual", "valor_negociado", "desconto_concedido", "parcelas", "canal_contato", "resultado", "observacoes", "historico"]
    const entries = Object.entries(body).filter(([key]) => allowed.includes(key)); if (!entries.length) return apiError("Nenhum campo válido para atualizar", 400)
    const values = entries.map(([key, value]) => key === "historico" ? JSON.stringify(value) : value); const updates = entries.map(([key], index) => `${key} = $${index + 1}${key === "historico" ? "::jsonb" : ""}`); values.push(Number(id), administradoraId)
    const rows = await query(`UPDATE cobrancas SET ${updates.join(", ")}, updated_at = CURRENT_TIMESTAMP WHERE id = $${values.length - 1} AND administradora_id = $${values.length} RETURNING *`, values)
    return rows[0] ? apiResponse(rows[0], "Cobrança atualizada com sucesso") : apiError("Cobrança não encontrada", 404)
  } catch (error) { return failure(error) }
}

export async function DELETE(_: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try { const { administradoraId } = await requireCobrancaAccess("delete"); const { id } = await params; const rows = await query("DELETE FROM cobrancas WHERE id = $1 AND administradora_id = $2 RETURNING id", [Number(id), administradoraId]); return rows[0] ? apiResponse(null, "Cobrança excluída com sucesso") : apiError("Cobrança não encontrada", 404) } catch (error) { return failure(error) }
}
