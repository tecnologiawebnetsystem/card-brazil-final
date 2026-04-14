import { type NextRequest, NextResponse } from "next/server"
import { mockContasReceber, mockConfiguracoesMJ } from "@/lib/mock-data"

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()

    if (!body.conta_receber_id) {
      return NextResponse.json({ error: "ID da conta a receber é obrigatório" }, { status: 400 })
    }

    // Buscar conta a receber
    const conta = mockContasReceber.find(cr => cr.id === body.conta_receber_id)

    if (!conta) {
      return NextResponse.json({ error: "Conta a receber não encontrada" }, { status: 404 })
    }

    // Buscar configuração (padrão ou específica)
    let config = null
    if (body.configuracao_id) {
      config = mockConfiguracoesMJ.find(c => c.id === body.configuracao_id && c.ativo)
    } else {
      config = mockConfiguracoesMJ.find(c => c.padrao && c.ativo)
    }

    if (!config) {
      return NextResponse.json({ error: "Configuração de multas e juros não encontrada" }, { status: 404 })
    }

    // Calcular dias de atraso
    const dataVencimento = new Date(conta.data_vencimento)
    const dataReferencia = body.data_referencia ? new Date(body.data_referencia) : new Date()
    const diasAtraso = Math.max(
      0,
      Math.floor((dataReferencia.getTime() - dataVencimento.getTime()) / (1000 * 60 * 60 * 24)),
    )

    // Aplicar carência
    const diasAtrasoComCarencia = Math.max(0, diasAtraso - config.dias_carencia)

    let valor_multa = 0
    let valor_juros = 0

    // Calcular multa
    if (config.aplicar_multa && diasAtrasoComCarencia > 0) {
      if (config.valor_fixo_multa > 0) {
        valor_multa = config.valor_fixo_multa
      } else {
        valor_multa = conta.valor_original * (config.percentual_multa / 100)
      }
    }

    // Calcular juros
    if (config.aplicar_juros && diasAtrasoComCarencia > 0) {
      if (config.tipo_calculo_juros === "simples") {
        // Juros simples
        const meses = diasAtrasoComCarencia / 30
        valor_juros = conta.valor_original * (config.percentual_juros_mensal / 100) * meses
      } else {
        // Juros compostos
        const meses = diasAtrasoComCarencia / 30
        valor_juros = conta.valor_original * (Math.pow(1 + config.percentual_juros_mensal / 100, meses) - 1)
      }
    }

    const valor_total = conta.valor_original + valor_multa + valor_juros - (conta.valor_desconto || 0)

    return NextResponse.json({
      message: "Multas e juros calculados com sucesso",
      calculo: {
        dias_atraso: diasAtraso,
        dias_atraso_com_carencia: diasAtrasoComCarencia,
        valor_original: conta.valor_original,
        valor_multa: valor_multa.toFixed(2),
        valor_juros: valor_juros.toFixed(2),
        valor_desconto: conta.valor_desconto || 0,
        valor_total: valor_total.toFixed(2),
        configuracao_utilizada: config.nome,
      },
    })
  } catch (error: any) {
    console.error("[v0] Erro ao calcular multas e juros:", error)
    return NextResponse.json({ error: "Erro ao calcular multas e juros", details: error.message }, { status: 500 })
  }
}
