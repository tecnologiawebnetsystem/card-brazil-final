import { type NextRequest, NextResponse } from "next/server"
import { query } from "@/back-end/lib/database"
import { requireCadastroAccess, apiAuthError } from "@/back-end/lib/api-auth"
import { recordCadastroAudit } from "@/back-end/lib/cadastro-audit"

function authFailure(error: unknown) {
  const auth = apiAuthError(error)
  return auth ? { body: { success: false, message: auth.message }, status: auth.status } : null
}

export async function GET(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { administradoraId } = await requireCadastroAccess("view")
    const { id } = await params
    const propostaId = Number.parseInt(id, 10)

    const rows = await query(`SELECT * FROM propostas WHERE id = $1 AND administradora_id = $2 AND deleted_at IS NULL`, [propostaId, administradoraId])
    const proposta = rows[0]

    if (!proposta) {
      return NextResponse.json({ error: "Proposta não encontrada" }, { status: 404 })
    }

    const historico = await query(`SELECT id, usuario_id, acao, dados_anteriores, dados_novos, created_at FROM auditoria_cadastros WHERE administradora_id = $1 AND tabela = 'propostas' AND registro_id = $2 ORDER BY created_at DESC`, [administradoraId, propostaId])
    return NextResponse.json({ success: true, data: { ...proposta, historico } })
  } catch (error: any) {
    const auth = authFailure(error)
    console.error("[v0] Erro ao buscar proposta:", error)
    return NextResponse.json(auth?.body || { error: "Erro ao buscar proposta", details: error.message }, { status: auth?.status || 500 })
  }
}

const EDITABLE_PROPOSAL_FIELDS = new Set([
  "nome_proponente",
  "cpf_cnpj",
  "email",
  "telefone",
  "estipulante_id",
  "empresa",
  "numero_funcionarios",
  "tipo_plano",
  "valor_proposto",
  "observacoes",
  "status",
  "parecer",
])

const ALLOWED_STATUS_TRANSITIONS: Record<string, readonly string[]> = {
  pendente: ["em_analise", "rejeitada"],
  em_analise: ["rejeitada"],
}

export async function PUT(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { administradoraId } = await requireCadastroAccess("edit")
    const { id } = await params
    const propostaId = Number.parseInt(id, 10)
    if (!Number.isSafeInteger(propostaId) || propostaId <= 0) {
      return NextResponse.json({ error: "ID da proposta inválido" }, { status: 400 })
    }

    const body = await request.json()
    if (!body || typeof body !== "object" || Array.isArray(body)) {
      return NextResponse.json({ error: "Dados da proposta inválidos" }, { status: 400 })
    }
    const receivedFields = Object.keys(body)
    const forbiddenFields = receivedFields.filter((field) => !EDITABLE_PROPOSAL_FIELDS.has(field))
    if (forbiddenFields.length > 0) {
      return NextResponse.json({ error: "A atualização contém campos reservados ou não permitidos", fields: forbiddenFields }, { status: 400 })
    }

    if (body.estipulante_id !== undefined) {
      const estipulanteId = Number(body.estipulante_id)
      if (!Number.isSafeInteger(estipulanteId) || estipulanteId <= 0) {
        return NextResponse.json({ error: "Estipulante inválido" }, { status: 400 })
      }
      const [estipulante] = await query(
        `SELECT COALESCE(p.nome_completo, pj.nome_fantasia, pj.razao_social, '') AS nome_empresa
         FROM estipulantes e
         INNER JOIN pessoas p ON p.id = e.pessoa_id
         LEFT JOIN pessoas_juridicas pj ON pj.pessoa_id = p.id
         WHERE e.id = $1 AND e.administradora_id = $2 AND e.status = 'ativo'
           AND e.deleted_at IS NULL AND p.deleted_at IS NULL`,
        [estipulanteId, administradoraId],
      )
      if (!estipulante) return NextResponse.json({ error: "Selecione um estipulante ativo válido." }, { status: 400 })
      body.estipulante_id = estipulanteId
      body.empresa = estipulante.nome_empresa || null
    }

    const updates: string[] = []
    const updateParams: unknown[] = []
    for (const field of EDITABLE_PROPOSAL_FIELDS) {
      if (field === "status" || body[field] === undefined) continue
      updateParams.push(body[field])
      updates.push(`${field} = $${updateParams.length}`)
    }

    if (body.status !== undefined) {
      if (typeof body.status !== "string") {
        return NextResponse.json({ error: "Status inválido" }, { status: 400 })
      }
      const currentStatuses = Object.entries(ALLOWED_STATUS_TRANSITIONS)
        .filter(([, allowed]) => allowed.includes(body.status))
        .map(([current]) => current)
      if (currentStatuses.length === 0) {
        return NextResponse.json(
          { error: "Esta transição não é permitida neste endpoint. Aprovação e geração de contrato devem usar seus fluxos próprios." },
          { status: 400 },
        )
      }
      updateParams.push(body.status)
      updates.push(`status = $${updateParams.length}`)
      if (body.status === "rejeitada") updates.push("data_analise = CURRENT_TIMESTAMP")
    }

    if (updates.length === 0) return NextResponse.json({ error: "Nenhum campo para atualizar" }, { status: 400 })

    updateParams.push(propostaId, administradoraId)
    const idParameter = updateParams.length - 1
    const tenantParameter = updateParams.length
    const transitionCondition = body.status === undefined
      ? ""
      : ` AND status IN (${Object.entries(ALLOWED_STATUS_TRANSITIONS)
          .filter(([, allowed]) => allowed.includes(body.status))
          .map(([status]) => `'${status}'`)
          .join(", ")})`
    const updatedRows = await query(
      `UPDATE propostas SET ${updates.join(", ")}, updated_at = CURRENT_TIMESTAMP WHERE id = $${idParameter} AND administradora_id = $${tenantParameter} AND deleted_at IS NULL${transitionCondition} RETURNING *`,
      updateParams,
    )
    if (!updatedRows[0]) return NextResponse.json({ error: "Proposta não encontrada ou transição concorrente não permitida" }, { status: 409 })
    return NextResponse.json({ success: true, data: updatedRows[0], message: "Proposta atualizada com sucesso" })
  } catch (error: any) {
    const auth = authFailure(error)
    console.error("[v0] Erro ao atualizar proposta:", error)
    return NextResponse.json(auth?.body || { error: "Erro ao atualizar proposta", details: error.message }, { status: auth?.status || 500 })
  }
}

export async function DELETE(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { administradoraId } = await requireCadastroAccess("delete")
    const { id } = await params

    // Soft delete
    const sql = `UPDATE propostas SET deleted_at = NOW(), updated_at = CURRENT_TIMESTAMP WHERE id = $1 AND deleted_at IS NULL`

    const rows = await query(`${sql} AND administradora_id = $2 RETURNING id`, [id, administradoraId])
    if (!rows.length) return NextResponse.json({ success: false, message: "Proposta não encontrada" }, { status: 404 })
    return NextResponse.json({ success: true, data: null, message: "Proposta excluída com sucesso" })
  } catch (error: any) {
    const auth = authFailure(error)
    console.error("[v0] Erro ao excluir proposta:", error)
    return NextResponse.json(auth?.body || { error: "Erro ao excluir proposta", details: error.message }, { status: auth?.status || 500 })
  }
}
