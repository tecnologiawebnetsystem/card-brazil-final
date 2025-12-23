import { type NextRequest, NextResponse } from "next/server"
import { pool } from "@/lib/database"
import type { RowDataPacket, ResultSetHeader } from "mysql2/promise"

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams
    const tipo = searchParams.get("tipo")
    const status = searchParams.get("status")
    const categoria = searchParams.get("categoria")
    const data_inicio = searchParams.get("data_inicio")
    const data_fim = searchParams.get("data_fim")

    let query = `
      SELECT 
        fc.*,
        cr.numero_documento as conta_receber_documento,
        cp.numero_documento as conta_pagar_documento,
        b.nome as banco_nome
      FROM fluxo_caixa fc
      LEFT JOIN contas_receber cr ON fc.conta_receber_id = cr.id
      LEFT JOIN contas_pagar cp ON fc.conta_pagar_id = cp.id
      LEFT JOIN bancos b ON fc.conta_bancaria_id = b.id
      WHERE fc.deleted_at IS NULL
    `
    const params: any[] = []

    if (tipo) {
      query += ` AND fc.tipo = ?`
      params.push(tipo)
    }

    if (status) {
      query += ` AND fc.status = ?`
      params.push(status)
    }

    if (categoria) {
      query += ` AND fc.categoria = ?`
      params.push(categoria)
    }

    if (data_inicio && data_fim) {
      query += ` AND fc.data_movimentacao BETWEEN ? AND ?`
      params.push(data_inicio, data_fim)
    }

    query += ` ORDER BY fc.data_movimentacao DESC, fc.created_at DESC`

    const [rows] = await pool.execute<RowDataPacket[]>(query, params)
    return NextResponse.json(rows)
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

    const [result] = await pool.execute<ResultSetHeader>(
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
