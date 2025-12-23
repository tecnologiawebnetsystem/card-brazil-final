import { type NextRequest, NextResponse } from "next/server"
import { createServerClient } from "@/lib/supabase-server"

// API AwesomeAPI para cotações de moedas
// https://docs.awesomeapi.com.br/api-de-moedas
export async function POST(request: NextRequest) {
  try {
    const supabase = createServerClient()

    // Obter id_administradora do usuário logado
    const {
      data: { user },
    } = await supabase.auth.getUser()
    if (!user) throw new Error("Usuário não autenticado")

    const { data: userData } = await supabase.from("usuarios").select("id_administradora").eq("id", user.id).single()

    if (!userData) throw new Error("Usuário não encontrado")

    const id_administradora = userData.id_administradora

    // Buscar moedas cadastradas
    const { data: moedas, error: moedasError } = await supabase
      .from("moedas")
      .select("*")
      .eq("id_administradora", id_administradora)
      .eq("ativo", true)

    if (moedasError) throw moedasError

    if (!moedas || moedas.length === 0) {
      return NextResponse.json({ message: "Nenhuma moeda cadastrada para atualizar" })
    }

    // Buscar cotações da API
    const codigosMoedas = moedas.map((m) => m.codigo).join(",")
    const response = await fetch(`https://economia.awesomeapi.com.br/json/last/${codigosMoedas}-BRL`)

    if (!response.ok) {
      throw new Error("Erro ao buscar cotações")
    }

    const cotacoes = await response.json()

    // Atualizar cada moeda
    const updates = []
    const historico = []

    for (const moeda of moedas) {
      const key = `${moeda.codigo}BRL`
      const cotacao = cotacoes[key]

      if (cotacao) {
        const cotacaoCompra = Number.parseFloat(cotacao.bid)
        const cotacaoVenda = Number.parseFloat(cotacao.ask)
        const variacaoPercentual = Number.parseFloat(cotacao.pctChange)

        updates.push(
          supabase
            .from("moedas")
            .update({
              cotacao_compra: cotacaoCompra,
              cotacao_venda: cotacaoVenda,
              variacao_percentual: variacaoPercentual,
              data_cotacao: new Date().toISOString(),
              fonte_cotacao: "AwesomeAPI",
              data_atualizacao: new Date().toISOString(),
            })
            .eq("id", moeda.id),
        )

        historico.push({
          id_administradora,
          id_moeda: moeda.id,
          cotacao_compra: cotacaoCompra,
          cotacao_venda: cotacaoVenda,
          variacao_percentual: variacaoPercentual,
          data_cotacao: new Date().toISOString(),
          fonte: "AwesomeAPI",
        })
      }
    }

    // Executar todas as atualizações
    await Promise.all(updates)

    // Inserir histórico
    if (historico.length > 0) {
      await supabase.from("historico_cotacoes").insert(historico)
    }

    return NextResponse.json({
      message: `${historico.length} cotações atualizadas com sucesso`,
      total: historico.length,
    })
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}
