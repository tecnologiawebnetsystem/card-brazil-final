import { type NextRequest, NextResponse } from "next/server"
import { pool } from "@/lib/database"
import type { RowDataPacket, ResultSetHeader } from "mysql2/promise"

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams
    const status = searchParams.get("status")
    const categoria = searchParams.get("categoria")
    const beneficiario_id = searchParams.get("beneficiario_id")
    const data_inicio = searchParams.get("data_inicio")
    const data_fim = searchParams.get("data_fim")

    let query = `
      SELECT 
        cr.*,
        b.nome as beneficiario_nome,
        p.nome as pessoa_nome,
        pr.numero_proposta,
        c.numero_contrato
      FROM contas_receber cr
      LEFT JOIN beneficiarios b ON cr.beneficiario_id = b.id
      LEFT JOIN pessoas p ON b.pessoa_id = p.id
      LEFT JOIN propostas pr ON cr.proposta_id = pr.id
      LEFT JOIN contratos c ON cr.contrato_id = c.id
      WHERE cr.deleted_at IS NULL
    `
    const params: any[] = []

    if (status) {
      query += ` AND cr.status = ?`
      params.push(status)
    }

    if (categoria) {
      query += ` AND cr.categoria = ?`
      params.push(categoria)
    }

    if (beneficiario_id) {
      query += ` AND cr.beneficiario_id = ?`
      params.push(beneficiario_id)
    }

    if (data_inicio && data_fim) {
      query += ` AND cr.data_vencimento BETWEEN ? AND ?`
      params.push(data_inicio, data_fim)
    }

    query += ` ORDER BY cr.data_vencimento DESC, cr.created_at DESC`

    const [rows] = await pool.execute<RowDataPacket[]>(query, params)
    return NextResponse.json(rows)
  } catch (error: any) {
    console.error("[v0] Erro ao buscar contas a receber:", error)
    return NextResponse.json({ error: "Erro ao buscar contas a receber", details: error.message }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()

    // Validações
    if (!body.numero_documento || !body.descricao || !body.categoria) {
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
      `INSERT INTO contas_receber (
        id_administradora, beneficiario_id, proposta_id, contrato_id,
        numero_documento, descricao, categoria,
        valor_original, valor_multa, valor_juros, valor_desconto, valor_total, valor_pago,
        data_emissao, data_vencimento, data_pagamento,
        status, dias_atraso,
        forma_pagamento, codigo_barras, linha_digitavel, pix_qrcode, pix_chave,
        observacoes, created_by
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        body.id_administradora || 1,
        body.beneficiario_id || null,
        body.proposta_id || null,
        body.contrato_id || null,
        body.numero_documento,
        body.descricao,
        body.categoria,
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
        body.codigo_barras || null,
        body.linha_digitavel || null,
        body.pix_qrcode || null,
        body.pix_chave || null,
        body.observacoes || null,
        body.created_by || 1,
      ],
    )

    return NextResponse.json({ id: result.insertId, message: "Conta a receber criada com sucesso" }, { status: 201 })
  } catch (error: any) {
    console.error("[v0] Erro ao criar conta a receber:", error)
    return NextResponse.json({ error: "Erro ao criar conta a receber", details: error.message }, { status: 500 })
  }
}
