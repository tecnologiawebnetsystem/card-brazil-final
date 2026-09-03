import { type NextRequest, NextResponse } from "next/server"
import { query } from "@/lib/database"

export async function GET(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params
    const propostaId = Number.parseInt(id)

    const rows = await query(`SELECT * FROM propostas WHERE id = $1 AND deleted_at IS NULL`, [propostaId])
    const proposta = rows[0]

    if (!proposta) {
      return NextResponse.json({ error: "Proposta não encontrada" }, { status: 404 })
    }

    return NextResponse.json(proposta)
  } catch (error: any) {
    console.error("[v0] Erro ao buscar proposta:", error)
    return NextResponse.json({ error: "Erro ao buscar proposta", details: error.message }, { status: 500 })
  }
}

export async function PUT(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params
    const body = await request.json()

    const {
      nome_proponente,
      cpf_cnpj,
      email,
      telefone,
      empresa,
      numero_funcionarios,
      tipo_plano,
      valor_proposto,
      observacoes,
      status,
      parecer,
      analisado_por,
      score_financeiro,
      score_documentacao,
      score_historico,
    } = body

    let sql = `UPDATE propostas SET `
    const updates: string[] = []
    const updateParams: any[] = []

    if (nome_proponente !== undefined) {
      updates.push(`nome_proponente = $${updateParams.length + 1}`)
      updateParams.push(nome_proponente)
    }
    if (cpf_cnpj !== undefined) {
      updates.push(`cpf_cnpj = $${updateParams.length + 1}`)
      updateParams.push(cpf_cnpj)
    }
    if (email !== undefined) {
      updates.push(`email = $${updateParams.length + 1}`)
      updateParams.push(email)
    }
    if (telefone !== undefined) {
      updates.push(`telefone = $${updateParams.length + 1}`)
      updateParams.push(telefone)
    }
    if (empresa !== undefined) {
      updates.push(`empresa = $${updateParams.length + 1}`)
      updateParams.push(empresa)
    }
    if (numero_funcionarios !== undefined) {
      updates.push(`numero_funcionarios = $${updateParams.length + 1}`)
      updateParams.push(numero_funcionarios)
    }
    if (tipo_plano !== undefined) {
      updates.push(`tipo_plano = $${updateParams.length + 1}`)
      updateParams.push(tipo_plano)
    }
    if (valor_proposto !== undefined) {
      updates.push(`valor_proposto = $${updateParams.length + 1}`)
      updateParams.push(valor_proposto)
    }
    if (observacoes !== undefined) {
      updates.push(`observacoes = $${updateParams.length + 1}`)
      updateParams.push(observacoes)
    }
    if (status !== undefined) {
      updates.push(`status = $${updateParams.length + 1}`)
      updateParams.push(status)

      // Se mudou para aprovada ou rejeitada, adicionar data de análise
      if (status === "aprovada" || status === "rejeitada") {
        updates.push("data_analise = NOW()")
      }
    }
    if (parecer !== undefined) {
      updates.push(`parecer = $${updateParams.length + 1}`)
      updateParams.push(parecer)
    }
    if (analisado_por !== undefined) {
      updates.push(`analisado_por = $${updateParams.length + 1}`)
      updateParams.push(analisado_por)
    }
    if (score_financeiro !== undefined) {
      updates.push(`score_financeiro = $${updateParams.length + 1}`)
      updateParams.push(score_financeiro)
    }
    if (score_documentacao !== undefined) {
      updates.push(`score_documentacao = $${updateParams.length + 1}`)
      updateParams.push(score_documentacao)
    }
    if (score_historico !== undefined) {
      updates.push(`score_historico = $${updateParams.length + 1}`)
      updateParams.push(score_historico)
    }

    if (updates.length === 0) {
      return NextResponse.json({ error: "Nenhum campo para atualizar" }, { status: 400 })
    }

    sql += updates.join(", ")
    sql += ` WHERE id = $${updateParams.length + 1} AND deleted_at IS NULL`
    updateParams.push(id)

    await query(sql, updateParams)

    return NextResponse.json({ message: "Proposta atualizada com sucesso" })
  } catch (error: any) {
    console.error("[v0] Erro ao atualizar proposta:", error)
    return NextResponse.json({ error: "Erro ao atualizar proposta", details: error.message }, { status: 500 })
  }
}

export async function DELETE(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params

    // Soft delete
    const sql = `UPDATE propostas SET deleted_at = NOW() WHERE id = ? AND deleted_at IS NULL`

    await query(sql, [id])

    return NextResponse.json({ message: "Proposta excluída com sucesso" })
  } catch (error: any) {
    console.error("[v0] Erro ao excluir proposta:", error)
    return NextResponse.json({ error: "Erro ao excluir proposta", details: error.message }, { status: 500 })
  }
}
