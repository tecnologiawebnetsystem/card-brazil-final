import { type NextRequest, NextResponse } from "next/server"
import { successResponse } from "@/lib/api-response"
import { query } from "@/lib/database"
import { requireCadastroAccess } from "@/lib/api-auth"

export async function GET(request: NextRequest) {
  try {
    const { administradoraId } = await requireCadastroAccess("view")
    const searchParams = request.nextUrl.searchParams
    const status = searchParams.get("status")
    const estipulante_id = searchParams.get("estipulante_id")
    const operadora_id = searchParams.get("operadora_id")

    const params: unknown[] = [administradoraId]
    const conditions: string[] = ["administradora_id = $1", "deleted_at IS NULL"]
    if (status) { params.push(status); conditions.push(`status = $${params.length}`) }
    if (estipulante_id) { params.push(Number.parseInt(estipulante_id, 10)); conditions.push(`estipulante_id = $${params.length}`) }
    if (operadora_id) { params.push(Number.parseInt(operadora_id, 10)); conditions.push(`operadora_id = $${params.length}`) }
    const where = conditions.length ? ` WHERE ${conditions.join(" AND ")}` : ""
    const contratos = await query(`SELECT *, numero_contrato AS numero FROM contratos${where} ORDER BY created_at DESC NULLS LAST`, params)
    return NextResponse.json(successResponse(contratos))
  } catch (error) {
    return NextResponse.json({ success: false, message: "Erro interno" }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const { administradoraId } = await requireCadastroAccess("create")
    const body = await request.json()
    const numeroContrato = String(body.numero_contrato || body.numero || "").trim()
    const status = String(body.status || "ativo").toLowerCase()
    const planoId = Number(body.plano_id)
    const estipulanteId = Number(body.estipulante_id)
    const dataVencimento = Number(body.data_vencimento)
    const valorTotal = Number(body.valor_total)
    const formasPagamento = ["boleto", "debito_automatico", "cartao_credito", "pix"]
    const formaPagamento = String(body.forma_pagamento || "")
    if (!Number.isInteger(planoId) || !Number.isInteger(estipulanteId) || !numeroContrato || !body.data_inicio || !Number.isInteger(dataVencimento) || dataVencimento < 1 || dataVencimento > 31 || !Number.isFinite(valorTotal) || valorTotal < 0 || !formasPagamento.includes(formaPagamento)) {
      return NextResponse.json({ success: false, message: "plano_id, estipulante_id, número, início, vencimento, valor_total e forma_pagamento válidos são obrigatórios" }, { status: 400 })
    }
    const dependencias = await query(`SELECT p.id FROM planos p JOIN estipulantes e ON e.id = $2 WHERE p.id = $1 AND p.id_administradora = $3 AND p.deleted_at IS NULL AND p.status = 'ativo' AND e.id_administradora = $3 AND e.ativo = true`, [planoId, estipulanteId, administradoraId])
    if (!dependencias.length) return NextResponse.json({ success: false, message: "Plano ou estipulante não pertence à administradora ou está inativo" }, { status: 422 })
    const rows = await query(`INSERT INTO contratos (administradora_id, operadora_id, estipulante_id, plano_id, numero_contrato, data_inicio, data_fim, data_vencimento, valor_total, forma_pagamento, quantidade_vidas, status) SELECT $1, p.operadora_id, $2, p.id, $3, $4, $5, $6, $7, $8, $9, $10 FROM planos p WHERE p.id = $11 AND p.id_administradora = $1 RETURNING *, numero_contrato AS numero`, [administradoraId, estipulanteId, numeroContrato, body.data_inicio, body.data_fim || null, dataVencimento, valorTotal, formaPagamento, Number(body.quantidade_vidas || 0), planoId])
    return NextResponse.json(successResponse(rows[0], "Contrato criado com sucesso"), { status: 201 })
  } catch (error) {
    return NextResponse.json({ success: false, message: "Erro interno" }, { status: 500 })
  }
}
