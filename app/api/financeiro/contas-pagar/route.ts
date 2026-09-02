import { type NextRequest, NextResponse } from "next/server"
import { query } from "@/lib/database"

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams
    const status = searchParams.get("status")
    const categoria = searchParams.get("categoria")
    const tipo_conta = searchParams.get("tipo_conta")
    const fornecedor_id = searchParams.get("fornecedor_id")
    const beneficiario_id = searchParams.get("beneficiario_id")

    const params: unknown[] = []
    const conditions: string[] = []
    if (status) { params.push(status); conditions.push(`status = $${params.length}`) }
    if (categoria) { params.push(categoria); conditions.push(`categoria = $${params.length}`) }
    if (tipo_conta) { params.push(tipo_conta); conditions.push(`tipo_conta = $${params.length}`) }
    if (fornecedor_id) { params.push(Number.parseInt(fornecedor_id, 10)); conditions.push(`fornecedor_id = $${params.length}`) }
    if (beneficiario_id) { params.push(Number.parseInt(beneficiario_id, 10)); conditions.push(`beneficiario_id = $${params.length}`) }
    const where = conditions.length ? ` WHERE ${conditions.join(" AND ")}` : ""
    const resultado = await query(`SELECT * FROM contas_pagar${where} ORDER BY data_vencimento ASC`, params)
    return NextResponse.json(resultado)
  } catch (error: any) {
    console.error("Erro ao buscar contas a pagar:", error)
    return NextResponse.json({ error: "Erro ao buscar contas a pagar", details: error.message }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()

    if (!body.numero_documento || !body.descricao || !body.categoria || !body.tipo_conta) {
      return NextResponse.json({ error: "Campos obrigatórios faltando" }, { status: 400 })
    }

    if (!body.valor_original || body.valor_original <= 0) {
      return NextResponse.json({ error: "Valor original inválido" }, { status: 400 })
    }

    if (!body.data_emissao || !body.data_vencimento) {
      return NextResponse.json({ error: "Datas obrigatórias faltando" }, { status: 400 })
    }

    const valor_multa = body.valor_multa || 0
    const valor_juros = body.valor_juros || 0
    const valor_desconto = body.valor_desconto || 0
    const valor_total = body.valor_original + valor_multa + valor_juros - valor_desconto

    const rows = await query(
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
      ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16, $17, $18, $19, $20, $21, $22, $23, $24, $25, $26, $27, $28, $29, $30, $31)
      RETURNING id`,
      [
        body.administradora_id || 1,
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

    return NextResponse.json({ id: rows[0].id, message: "Conta a pagar criada com sucesso" }, { status: 201 })
  } catch (error: any) {
    console.error("Erro ao criar conta a pagar:", error)
    return NextResponse.json({ error: "Erro ao criar conta a pagar", details: error.message }, { status: 500 })
  }
}
