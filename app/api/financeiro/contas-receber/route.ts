import { type NextRequest, NextResponse } from "next/server"
import { mockContasReceber } from "@/lib/mock-data"

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams
    const status = searchParams.get("status")
    const categoria = searchParams.get("categoria")
    const beneficiario_id = searchParams.get("beneficiario_id")

    let resultado = [...mockContasReceber]

    if (status) {
      resultado = resultado.filter(cr => cr.status === status)
    }

    if (categoria) {
      resultado = resultado.filter(cr => cr.categoria === categoria)
    }

    if (beneficiario_id) {
      resultado = resultado.filter(cr => cr.beneficiario_id === Number.parseInt(beneficiario_id))
    }

    return NextResponse.json(resultado)
  } catch (error: any) {
    console.error("Erro ao buscar contas a receber:", error)
    return NextResponse.json({ error: "Erro ao buscar contas a receber", details: error.message }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()

    if (!body.numero_documento || !body.descricao || !body.categoria) {
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

    const rows = await sql(
      `INSERT INTO contas_receber (
        id_administradora, beneficiario_id, proposta_id, contrato_id,
        numero_documento, descricao, categoria,
        valor_original, valor_multa, valor_juros, valor_desconto, valor_total, valor_pago,
        data_emissao, data_vencimento, data_pagamento,
        status, dias_atraso,
        forma_pagamento, codigo_barras, linha_digitavel, pix_qrcode, pix_chave,
        observacoes, created_by
      ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16, $17, $18, $19, $20, $21, $22, $23, $24, $25)
      RETURNING id`,
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

    return NextResponse.json({ id: rows[0].id, message: "Conta a receber criada com sucesso" }, { status: 201 })
  } catch (error: any) {
    console.error("Erro ao criar conta a receber:", error)
    return NextResponse.json({ error: "Erro ao criar conta a receber", details: error.message }, { status: 500 })
  }
}
