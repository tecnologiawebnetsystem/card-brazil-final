import { type NextRequest, NextResponse } from "next/server"
import { mockProcessosJudiciais } from "@/lib/mock-data"

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams
    const status = searchParams.get("status")
    const fase = searchParams.get("fase")
    const advogado_id = searchParams.get("advogado_id")
    const beneficiario_id = searchParams.get("beneficiario_id")

    let resultado = [...mockProcessosJudiciais]

    if (status) {
      resultado = resultado.filter(pj => pj.status === status)
    }

    if (fase) {
      resultado = resultado.filter(pj => pj.fase_processual === fase)
    }

    if (advogado_id) {
      resultado = resultado.filter(pj => pj.advogado_id === Number.parseInt(advogado_id))
    }

    if (beneficiario_id) {
      resultado = resultado.filter(pj => pj.beneficiario_id === Number.parseInt(beneficiario_id))
    }

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

    const [result] = await pool.execute(
      `INSERT INTO processos_judiciais (
        id_administradora, beneficiario_id, advogado_id, tribunal_id, conta_receber_id,
        numero_processo, tipo_acao, valor_causa,
        data_distribuicao, data_citacao, data_audiencia, data_sentenca, data_transito_julgado,
        status, fase_processual, resultado,
        valor_sentenca, valor_acordo, valor_recuperado,
        observacoes, historico, created_by
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        body.id_administradora || 1,
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

    return NextResponse.json({ id: result.insertId, message: "Processo judicial criado com sucesso" }, { status: 201 })
  } catch (error: any) {
    console.error("[v0] Erro ao criar processo:", error)
    return NextResponse.json({ error: "Erro ao criar processo", details: error.message }, { status: 500 })
  }
}
