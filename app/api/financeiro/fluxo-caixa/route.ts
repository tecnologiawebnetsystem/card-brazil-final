import { type NextRequest, NextResponse } from "next/server"
import { query } from "@/lib/database"

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams
    const tipo = searchParams.get("tipo")
    const status = searchParams.get("status")
    const categoria = searchParams.get("categoria")

    const params: unknown[] = []
    const conditions: string[] = []
    if (tipo) { params.push(tipo); conditions.push(`tipo = $${params.length}`) }
    if (status) { params.push(status); conditions.push(`status = $${params.length}`) }
    if (categoria) { params.push(categoria); conditions.push(`categoria = $${params.length}`) }
    const where = conditions.length ? ` WHERE ${conditions.join(" AND ")}` : ""
    const resultado = await query(`SELECT * FROM fluxo_caixa${where} ORDER BY data_movimentacao DESC`, params)
    return NextResponse.json(resultado)
  } catch (error: any) {
    console.error("[v0] Erro ao buscar fluxo de caixa:", error)
    return NextResponse.json({ error: "Erro ao buscar fluxo de caixa", details: error.message }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()

    // Validações
    if (!body.tipo || !body.categoria || !body.descricao) {
      return NextResponse.json({ error: "Campos obrigatórios faltando" }, { status: 400 })
    }

    if (!body.valor || body.valor <= 0) {
      return NextResponse.json({ error: "Valor inválido" }, { status: 400 })
    }

    if (!body.data_movimentacao || !body.data_competencia) {
      return NextResponse.json({ error: "Datas obrigatórias faltando" }, { status: 400 })
    }

    const rows = await query(
      `INSERT INTO fluxo_caixa (
        administradora_id, conta_receber_id, conta_pagar_id, conta_bancaria_id,
        tipo, categoria, descricao, valor,
        data_movimentacao, data_competencia, status,
        conta_origem, conta_destino, observacoes, created_by
      ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15)
      RETURNING id`,
      [
        body.administradora_id || 1,
        body.conta_receber_id || null,
        body.conta_pagar_id || null,
        body.conta_bancaria_id || null,
        body.tipo,
        body.categoria,
        body.descricao,
        body.valor,
        body.data_movimentacao,
        body.data_competencia,
        body.status || "previsto",
        body.conta_origem || null,
        body.conta_destino || null,
        body.observacoes || null,
        body.created_by || 1,
      ],
    )

    return NextResponse.json({ id: rows[0].id, message: "Movimentação criada com sucesso" }, { status: 201 })
  } catch (error: any) {
    console.error("[v0] Erro ao criar movimentação:", error)
    return NextResponse.json({ error: "Erro ao criar movimentação", details: error.message }, { status: 500 })
  }
}
