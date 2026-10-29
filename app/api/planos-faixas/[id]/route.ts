import { type NextRequest, NextResponse } from "next/server"
import { query } from "@/back-end/lib/database"
import { apiAuthError, requireCadastroAccess } from "@/back-end/lib/api-auth"
import { apiError, successResponse } from "@/back-end/lib/api-response"

function parseId(value: string) {
  const id = Number(value)
  return Number.isInteger(id) && id > 0 ? id : null
}

function parseUpdate(body: Record<string, unknown>) {
  const idadeMinima = Number(body.idade_minima)
  const idadeMaxima = Number(body.idade_maxima)
  const valor = Number(body.valor)
  const inicio = typeof body.vigencia_inicio === "string" ? body.vigencia_inicio : ""
  const fim = typeof body.vigencia_fim === "string" ? body.vigencia_fim : ""
  if (!Number.isInteger(idadeMinima) || idadeMinima < 0 || idadeMinima > 150 || !Number.isInteger(idadeMaxima) || idadeMaxima < idadeMinima || idadeMaxima > 150 || !Number.isFinite(valor) || valor < 0 || !/^\d{4}-\d{2}-\d{2}$/.test(inicio) || !/^\d{4}-\d{2}-\d{2}$/.test(fim) || fim < inicio) return null
  return { idadeMinima, idadeMaxima, valor, inicio, fim }
}

export async function PUT(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { administradoraId } = await requireCadastroAccess("edit")
    const id = parseId((await params).id)
    if (!id) return apiError("Identificador inválido", 400)
    const parsed = parseUpdate(await request.json())
    if (!parsed) return apiError("Dados da faixa inválidos", 422)
    const duplicate = await query("SELECT id FROM planos_faixas_etarias f JOIN planos p ON p.id = f.plano_id WHERE f.plano_id = (SELECT plano_id FROM planos_faixas_etarias WHERE id = $1) AND f.id <> $1 AND p.administradora_id = $2 AND f.idade_minima = $3 AND f.idade_maxima = $4 AND f.vigencia_inicio = $5 AND f.vigencia_fim = $6 LIMIT 1", [id, administradoraId, parsed.idadeMinima, parsed.idadeMaxima, parsed.inicio, parsed.fim])
    if (duplicate.length) return apiError("Faixa já cadastrada para este plano", 409)
    const rows = await query("UPDATE planos_faixas_etarias f SET idade_minima=$1, idade_maxima=$2, valor=$3, vigencia_inicio=$4, vigencia_fim=$5, updated_at=CURRENT_TIMESTAMP FROM planos p WHERE f.id=$6 AND f.plano_id=p.id AND p.administradora_id=$7 RETURNING f.id, f.plano_id, f.idade_minima, f.idade_maxima, f.valor, f.vigencia_inicio, f.vigencia_fim, f.created_at, f.updated_at", [parsed.idadeMinima, parsed.idadeMaxima, parsed.valor, parsed.inicio, parsed.fim, id, administradoraId])
    return rows.length ? NextResponse.json(successResponse(rows[0], "Faixa atualizada com sucesso")) : apiError("Faixa não encontrada", 404)
  } catch (error) {
    const auth = apiAuthError(error)
    if (auth) return apiError(auth.message, auth.status)
    console.error("[v0] Erro ao atualizar faixa etária", error)
    return apiError("Não foi possível atualizar a faixa etária", 500)
  }
}

export async function DELETE(_request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { administradoraId } = await requireCadastroAccess("delete")
    const id = parseId((await params).id)
    if (!id) return apiError("Identificador inválido", 400)
    const rows = await query("DELETE FROM planos_faixas_etarias f USING planos p WHERE f.id = $1 AND f.plano_id = p.id AND p.administradora_id = $2 RETURNING f.id", [id, administradoraId])
    return rows.length ? NextResponse.json(successResponse(null, "Faixa excluída com sucesso")) : apiError("Faixa não encontrada", 404)
  } catch (error) {
    const auth = apiAuthError(error)
    if (auth) return apiError(auth.message, auth.status)
    console.error("[v0] Erro ao excluir faixa etária", error)
    return apiError("Não foi possível excluir a faixa etária", 500)
  }
}
