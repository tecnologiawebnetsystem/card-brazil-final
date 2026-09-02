import { type NextRequest, NextResponse } from "next/server"
import { query } from "@/lib/database"

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams
    const ativo = searchParams.get("ativo")
    const padrao = searchParams.get("padrao")

    const params: unknown[] = []
    const conditions: string[] = ["deleted_at IS NULL"]
    if (ativo !== null) { params.push(ativo === "true"); conditions.push(`ativo = $${params.length}`) }
    if (padrao !== null) { params.push(padrao === "true"); conditions.push(`padrao = $${params.length}`) }
    const resultado = await query(`SELECT * FROM configuracoes_multas_juros WHERE ${conditions.join(" AND ")} ORDER BY nome ASC`, params)
    return NextResponse.json(resultado)
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
      await query(`UPDATE configuracoes_multas_juros SET padrao = FALSE WHERE administradora_id = ?`, [
        body.administradora_id || 1,
      ])
    }

    const rows = await query(
      `INSERT INTO configuracoes_multas_juros (
        administradora_id, nome, descricao,
        percentual_multa, valor_fixo_multa,
        percentual_juros_mensal, percentual_juros_diario, tipo_calculo_juros,
        dias_carencia, aplicar_multa, aplicar_juros,
        texto_padrao_boleto, texto_padrao_pix,
        pix_chave, pix_tipo_chave, pix_nome_recebedor, pix_cidade,
        ativo, padrao, created_by
      ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16, $17, $18, $19, $20) RETURNING id`,
      [
        body.administradora_id || 1,
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

    return NextResponse.json({ id: rows[0].id, message: "Configuração criada com sucesso" }, { status: 201 })
  } catch (error: any) {
    console.error("[v0] Erro ao criar configuração:", error)
    return NextResponse.json({ error: "Erro ao criar configuração", details: error.message }, { status: 500 })
  }
}
