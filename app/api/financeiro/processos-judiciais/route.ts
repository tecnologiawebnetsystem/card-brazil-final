import { type NextRequest, NextResponse } from "next/server"
import { query } from "@/lib/database"

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams
    const status = searchParams.get("status")
    const fase = searchParams.get("fase")
    const advogado_id = searchParams.get("advogado_id")
    const beneficiario_id = searchParams.get("beneficiario_id")

    const params: unknown[] = []
    const conditions: string[] = []
    if (status) { params.push(status); conditions.push(`status = $${params.length}`) }
    if (fase) { params.push(fase); conditions.push(`fase_processual = $${params.length}`) }
    if (advogado_id) { params.push(Number.parseInt(advogado_id, 10)); conditions.push(`advogado_id = $${params.length}`) }
    if (beneficiario_id) { params.push(Number.parseInt(beneficiario_id, 10)); conditions.push(`beneficiario_id = $${params.length}`) }
    const where = conditions.length ? ` WHERE ${conditions.join(" AND ")}` : ""
    const resultado = await query(`SELECT * FROM processos_judiciais${where} ORDER BY created_at DESC NULLS LAST`, params)
    return NextResponse.json(resultado)
  } catch (error: any) {
    console.error("[v0] Erro ao buscar processos:", error)
    return NextResponse.json({ error: "Erro ao buscar processos", details: error.message }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()

    if (
      !body.beneficiario_id ||
      !body.numero_processo ||
      !body.tipo_acao ||
      !body.valor_causa ||
      !body.data_distribuicao
    ) {
      return NextResponse.json({ error: "Campos obrigatórios faltando" }, { status: 400 })
    }

    const rows = await query(
      `INSERT INTO processos_judiciais (
        administradora_id, beneficiario_id, advogado_id, tribunal_id, conta_receber_id,
        numero_processo, tipo_acao, valor_causa,
        data_distribuicao, data_citacao, data_audiencia, data_sentenca, data_transito_julgado,
        status, fase_processual, resultado,
        valor_sentenca, valor_acordo, valor_recuperado,
        observacoes, historico, created_by
      ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16, $17, $18, $19, $20, $21, $22) RETURNING id`,
      [
        body.administradora_id || 1,
        body.beneficiario_id,
        body.advogado_id || null,
        body.tribunal_id || null,
        body.conta_receber_id || null,
        body.numero_processo,
        body.tipo_acao,
        body.valor_causa,
        body.data_distribuicao,
        body.data_citacao || null,
        body.data_audiencia || null,
        body.data_sentenca || null,
        body.data_transito_julgado || null,
        body.status || "em_andamento",
        body.fase_processual || "inicial",
        body.resultado || "em_andamento",
        body.valor_sentenca || null,
        body.valor_acordo || null,
        body.valor_recuperado || 0,
        body.observacoes || null,
        body.historico ? JSON.stringify(body.historico) : null,
        body.created_by || 1,
      ],
    )

    return NextResponse.json({ id: rows[0].id, message: "Processo judicial criado com sucesso" }, { status: 201 })
  } catch (error: any) {
    console.error("[v0] Erro ao criar processo:", error)
    return NextResponse.json({ error: "Erro ao criar processo", details: error.message }, { status: 500 })
  }
}
