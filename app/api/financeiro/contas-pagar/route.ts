import { type NextRequest, NextResponse } from "next/server"
import { pool } from "@/lib/database"
import type { RowDataPacket, ResultSetHeader } from "mysql2/promise"

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams
    const status = searchParams.get("status")
    const categoria = searchParams.get("categoria")
    const tipo_conta = searchParams.get("tipo_conta")
    const fornecedor_id = searchParams.get("fornecedor_id")
    const beneficiario_id = searchParams.get("beneficiario_id")
    const data_inicio = searchParams.get("data_inicio")
    const data_fim = searchParams.get("data_fim")

    let query = `
      SELECT 
        cp.*,
        f.nome as fornecedor_nome,
        b.nome as beneficiario_nome,
        p.nome as pessoa_nome,
        pr.numero_proposta
      FROM contas_pagar cp
      LEFT JOIN pessoas f ON cp.fornecedor_id = f.id
      LEFT JOIN beneficiarios b ON cp.beneficiario_id = b.id
      LEFT JOIN pessoas p ON b.pessoa_id = p.id
      LEFT JOIN propostas pr ON cp.proposta_id = pr.id
      WHERE cp.deleted_at IS NULL
    `
    const params: any[] = []

    if (status) {
      query += ` AND cp.status = ?`
      params.push(status)
    }

    if (categoria) {
      query += ` AND cp.categoria = ?`
      params.push(categoria)
    }

    if (tipo_conta) {
      query += ` AND cp.tipo_conta = ?`
      params.push(tipo_conta)
    }

    if (fornecedor_id) {
      query += ` AND cp.fornecedor_id = ?`
      params.push(fornecedor_id)
    }

    if (beneficiario_id) {
      query += ` AND cp.beneficiario_id = ?`
      params.push(beneficiario_id)
    }

    if (data_inicio && data_fim) {
      query += ` AND cp.data_vencimento BETWEEN ? AND ?`
      params.push(data_inicio, data_fim)
    }

    query += ` ORDER BY cp.data_vencimento DESC, cp.created_at DESC`

    const [rows] = await pool.execute<RowDataPacket[]>(query, params)
    return NextResponse.json(rows)
  } catch (error: any) {
    console.error("[v0] Erro ao buscar contas a pagar:", error)
    return NextResponse.json({ error: "Erro ao buscar contas a pagar", details: error.message }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()

    // Validações
    if (!body.numero_documento || !body.descricao || !body.categoria || !body.tipo_conta) {
      return NextResponse.json({ error: "Campos obrigatórios faltando" }, { status: 400 })
    }

    if (!body.valor_original || body.valor_original <= 0) {
      return NextResponse.json({ error: "Valor original inválido" }, { status: 400 })
    }

    if (!body.data_emissao || !body.data_vencimento) {
      return NextResponse.json({ error: "Datas obrigatórias faltando" }, { status: 400 })
    }

    // Calcular valor total
    const valor_multa = body.valor_multa || 0
    const valor_juros = body.valor_juros || 0
    const valor_desconto = body.valor_desconto || 0
    const valor_total = body.valor_original + valor_multa + valor_juros - valor_desconto

    const [result] = await pool.execute<ResultSetHeader>(
      `INSERT INTO contas_pagar (
        id_administradora, fornecedor_id, beneficiario_id, proposta_id,
        numero_documento, descricao, categoria, tipo_conta,
        valor_original, valor_multa, valor_juros, valor_desconto, valor_total, valor_pago,
        data_emissao, data_vencimento, data_pagamento,
        status, dias_atraso,
        forma_pagamento, conta_bancaria_id,
        favorecido_nome, favorecido_cpf_cnpj, favorecido_banco, favorecido_agencia, 
        favorecido_conta, favorecido_tipo_conta, favorecido_pix_chave,
        observacoes, motivo_restituicao, created_by
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        body.id_administradora || 1,
        body.fornecedor_id || null,
        body.beneficiario_id || null,
        body.proposta_id || null,
        body.numero_documento,
        body.descricao,
        body.categoria,
        body.tipo_conta,
        body.valor_original,
        valor_multa,
        valor_juros,
        valor_desconto,
        valor_total,
        body.valor_pago || 0,
        body.data_emissao,
        body.data_vencimento,
        body.data_pagamento || null,
        body.status || "pendente",
        body.dias_atraso || 0,
        body.forma_pagamento || null,
        body.conta_bancaria_id || null,
        body.favorecido_nome || null,
        body.favorecido_cpf_cnpj || null,
        body.favorecido_banco || null,
        body.favorecido_agencia || null,
        body.favorecido_conta || null,
        body.favorecido_tipo_conta || null,
        body.favorecido_pix_chave || null,
        body.observacoes || null,
        body.motivo_restituicao || null,
        body.created_by || 1,
      ],
    )

    return NextResponse.json({ id: result.insertId, message: "Conta a pagar criada com sucesso" }, { status: 201 })
  } catch (error: any) {
    console.error("[v0] Erro ao criar conta a pagar:", error)
    return NextResponse.json({ error: "Erro ao criar conta a pagar", details: error.message }, { status: 500 })
  }
}
