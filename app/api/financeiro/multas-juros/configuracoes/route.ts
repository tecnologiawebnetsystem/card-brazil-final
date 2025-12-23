import { type NextRequest, NextResponse } from "next/server"
import { pool } from "@/lib/database"
import type { RowDataPacket, ResultSetHeader } from "mysql2/promise"

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams
    const ativo = searchParams.get("ativo")
    const padrao = searchParams.get("padrao")

    let query = `SELECT * FROM configuracoes_multas_juros WHERE deleted_at IS NULL`
    const params: any[] = []

    if (ativo !== null) {
      query += ` AND ativo = ?`
      params.push(ativo === "true" ? 1 : 0)
    }

    if (padrao !== null) {
      query += ` AND padrao = ?`
      params.push(padrao === "true" ? 1 : 0)
    }

    query += ` ORDER BY padrao DESC, nome ASC`

    const [rows] = await pool.execute<RowDataPacket[]>(query, params)
    return NextResponse.json(rows)
  } catch (error: any) {
    console.error("[v0] Erro ao buscar configurações:", error)
    return NextResponse.json({ error: "Erro ao buscar configurações", details: error.message }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()

    if (!body.nome || body.percentual_multa === undefined || body.percentual_juros_mensal === undefined) {
      return NextResponse.json({ error: "Campos obrigatórios faltando" }, { status: 400 })
    }

    // Se for configuração padrão, desmarcar outras
    if (body.padrao) {
      await pool.execute(`UPDATE configuracoes_multas_juros SET padrao = FALSE WHERE id_administradora = ?`, [
        body.id_administradora || 1,
      ])
    }

    const [result] = await pool.execute<ResultSetHeader>(
      `INSERT INTO configuracoes_multas_juros (
        id_administradora, nome, descricao,
        percentual_multa, valor_fixo_multa,
        percentual_juros_mensal, percentual_juros_diario, tipo_calculo_juros,
        dias_carencia, aplicar_multa, aplicar_juros,
        texto_padrao_boleto, texto_padrao_pix,
        pix_chave, pix_tipo_chave, pix_nome_recebedor, pix_cidade,
        ativo, padrao, created_by
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        body.id_administradora || 1,
        body.nome,
        body.descricao || null,
        body.percentual_multa,
        body.valor_fixo_multa || 0,
        body.percentual_juros_mensal,
        body.percentual_juros_diario || null,
        body.tipo_calculo_juros || "simples",
        body.dias_carencia || 0,
        body.aplicar_multa !== undefined ? body.aplicar_multa : true,
        body.aplicar_juros !== undefined ? body.aplicar_juros : true,
        body.texto_padrao_boleto || null,
        body.texto_padrao_pix || null,
        body.pix_chave || null,
        body.pix_tipo_chave || null,
        body.pix_nome_recebedor || null,
        body.pix_cidade || null,
        body.ativo !== undefined ? body.ativo : true,
        body.padrao || false,
        body.created_by || 1,
      ],
    )

    return NextResponse.json({ id: result.insertId, message: "Configuração criada com sucesso" }, { status: 201 })
  } catch (error: any) {
    console.error("[v0] Erro ao criar configuração:", error)
    return NextResponse.json({ error: "Erro ao criar configuração", details: error.message }, { status: 500 })
  }
}
