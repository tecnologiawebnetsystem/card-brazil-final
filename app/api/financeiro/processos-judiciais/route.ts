import { type NextRequest, NextResponse } from "next/server"
import { pool } from "@/lib/database"

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams
    const status = searchParams.get("status")
    const fase = searchParams.get("fase")
    const advogado_id = searchParams.get("advogado_id")
    const beneficiario_id = searchParams.get("beneficiario_id")

    let query = `
      SELECT 
        pj.*,
        b.nome as beneficiario_nome,
        p.nome as pessoa_nome,
        p.cpf,
        a.nome as advogado_nome,
        a.oab,
        t.nome as tribunal_nome,
        t.sigla as tribunal_sigla,
        cr.numero_documento as conta_receber_documento
      FROM processos_judiciais pj
      INNER JOIN beneficiarios b ON pj.beneficiario_id = b.id
      INNER JOIN pessoas p ON b.pessoa_id = p.id
      LEFT JOIN advogados a ON pj.advogado_id = a.id
      LEFT JOIN tribunais t ON pj.tribunal_id = t.id
      LEFT JOIN contas_receber cr ON pj.conta_receber_id = cr.id
      WHERE pj.deleted_at IS NULL
    `
    const params: any[] = []

    if (status) {
      query += ` AND pj.status = ?`
      params.push(status)
    }

    if (fase) {
      query += ` AND pj.fase_processual = ?`
      params.push(fase)
    }

    if (advogado_id) {
      query += ` AND pj.advogado_id = ?`
      params.push(advogado_id)
    }

    if (beneficiario_id) {
      query += ` AND pj.beneficiario_id = ?`
      params.push(beneficiario_id)
    }

    query += ` ORDER BY pj.data_distribuicao DESC`

    const [rows] = await pool.execute(query, params)
    return NextResponse.json(rows)
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
