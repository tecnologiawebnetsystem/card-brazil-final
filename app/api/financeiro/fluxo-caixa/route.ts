import { type NextRequest, NextResponse } from "next/server"
import { mockFluxoCaixa } from "@/lib/mock-data"

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams
    const tipo = searchParams.get("tipo")
    const status = searchParams.get("status")
    const categoria = searchParams.get("categoria")

    let resultado = [...mockFluxoCaixa]

    if (tipo) {
      resultado = resultado.filter(fc => fc.tipo === tipo)
    }

    if (status) {
      resultado = resultado.filter(fc => fc.status === status)
    }

    if (categoria) {
      resultado = resultado.filter(fc => fc.categoria === categoria)
    }

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

    const [result] = await pool.execute(
      `INSERT INTO fluxo_caixa (
        id_administradora, conta_receber_id, conta_pagar_id, conta_bancaria_id,
        tipo, categoria, descricao, valor,
        data_movimentacao, data_competencia, status,
        conta_origem, conta_destino, observacoes, created_by
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        body.id_administradora || 1,
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

    return NextResponse.json({ id: result.insertId, message: "Movimentação criada com sucesso" }, { status: 201 })
  } catch (error: any) {
    console.error("[v0] Erro ao criar movimentação:", error)
    return NextResponse.json({ error: "Erro ao criar movimentação", details: error.message }, { status: 500 })
  }
}
