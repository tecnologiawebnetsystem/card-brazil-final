import { type NextRequest, NextResponse } from "next/server"
import { query, transaction } from "@/lib/database"
import { requireCadastroAccess, authErrorStatus } from "@/lib/api-auth"
import { recordCadastroAudit } from "@/lib/cadastro-audit"

export async function POST(request: NextRequest) {
  try {
    const { administradoraId, userId } = await requireCadastroAccess("edit")
    const body = await request.json()
    
    if (!body.proposta_id) return NextResponse.json({ error: "ID da proposta é obrigatório" }, { status: 400 })
    const contrato = body.contrato
    const planoId = Number(contrato?.plano_id)
    const estipulanteId = Number(contrato?.estipulante_id)
    const valorTotal = Number(contrato?.valor_total)
    const dataVencimento = Number(contrato?.data_vencimento)
    const formasPagamento = ["boleto", "debito_automatico", "cartao_credito", "pix"]
    if (!Number.isInteger(planoId) || !Number.isInteger(estipulanteId) || !Number.isFinite(valorTotal) || valorTotal < 0 || !Number.isInteger(dataVencimento) || dataVencimento < 1 || dataVencimento > 31 || !formasPagamento.includes(String(contrato?.forma_pagamento)) || !contrato?.data_inicio || !String(contrato?.numero_contrato || "").trim()) {
      return NextResponse.json({ error: "A aprovação exige contrato com plano, estipulante, número, início, vencimento, valor e forma de pagamento" }, { status: 422 })
    }
    const dependencias = await query(`SELECT p.id FROM planos p JOIN estipulantes e ON e.id = $2 WHERE p.id = $1 AND p.administradora_id = $3 AND p.deleted_at IS NULL AND p.status = 'ativo' AND e.id_administradora = $3 AND e.ativo = true`, [planoId, estipulanteId, administradoraId])
    if (!dependencias.length) return NextResponse.json({ error: "Plano ou estipulante inválido para esta administradora" }, { status: 422 })

    const anterior = await query(`SELECT status, parecer, analisado_por FROM propostas WHERE id = $1 AND administradora_id = $2 AND deleted_at IS NULL`, [body.proposta_id, administradoraId])
    const rows = await transaction([
      { text: `UPDATE propostas SET status = 'contrato_gerado', parecer = COALESCE($2, parecer), analisado_por = $3, data_analise = CURRENT_TIMESTAMP, numero_contrato = $5, data_contrato = CURRENT_TIMESTAMP, updated_at = CURRENT_TIMESTAMP WHERE id = $1 AND administradora_id = $4 AND deleted_at IS NULL AND status IN ('pendente', 'em_analise', 'aprovada') RETURNING *`, params: [body.proposta_id, body.parecer || "Proposta aprovada após análise.", userId, administradoraId, contrato.numero_contrato] },
      { text: `INSERT INTO contratos (administradora_id, operadora_id, estipulante_id, plano_id, numero_contrato, data_inicio, data_fim, data_vencimento, valor_total, forma_pagamento, quantidade_vidas, status) SELECT $1, p.operadora_id, $2, p.id, $3, $4, $5, $6, $7, $8, $9, 'ativo' FROM planos p WHERE p.id = $10 AND p.administradora_id = $1 RETURNING id, numero_contrato`, params: [administradoraId, estipulanteId, contrato.numero_contrato, contrato.data_inicio, contrato.data_fim || null, dataVencimento, valorTotal, contrato.forma_pagamento, Number(contrato.quantidade_vidas || 0), planoId] },
    ])
    const propostaAtualizada = rows[0]?.[0]
    if (!propostaAtualizada || !rows[1]?.length) return NextResponse.json({ error: "Proposta não encontrada, já finalizada ou contrato não criado" }, { status: 409 })
    await recordCadastroAudit({
      administradoraId,
      userId,
      action: "approve",
      tableName: "propostas",
      recordId: Number(body.proposta_id),
      before: anterior[0] ?? null,
      after: { status: propostaAtualizada.status, parecer: propostaAtualizada.parecer, analisado_por: userId, contrato_id: rows[1][0].id },
    })
    const aprovacao = { proposta_id: body.proposta_id, contrato_id: rows[1][0].id, numero_contrato: rows[1][0].numero_contrato, status: propostaAtualizada.status, parecer: body.parecer || "Proposta aprovada após análise.", analisado_por: userId, data_analise: new Date().toISOString(), data_vigencia: body.data_vigencia || new Date().toISOString().split('T')[0] }

    return NextResponse.json({
      success: true,
      message: "Proposta aprovada com sucesso",
      data: aprovacao,
    })
  } catch (error: any) {
    console.error("[v0] Erro ao aprovar proposta:", error)
    return NextResponse.json({ error: "Erro ao aprovar proposta" }, { status: authErrorStatus(error) })
  }
}
