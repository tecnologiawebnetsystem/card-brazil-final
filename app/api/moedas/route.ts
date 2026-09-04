import { type NextRequest, NextResponse } from "next/server"
import { createServerClient } from "@/lib/supabase-server"

export async function GET(request: NextRequest) {
  try {
    const supabase = createServerClient()
    const searchParams = request.nextUrl.searchParams
    const search = searchParams.get("search") || ""
    const status = searchParams.get("status") || "Ativa"

    let query = supabase.from("moedas").select("*").eq("ativo", true).order("codigo", { ascending: true })

    if (status) {
      query = query.eq("status", status)
    }

    if (search) {
      query = query.or(`codigo.ilike.%${search}%,nome.ilike.%${search}%`)
    }

    const { data, error } = await query

    if (error) throw error

    return NextResponse.json(data ?? [])
  } catch (error: any) {
    if (request.method === "GET") {
      const moedasPadrao = [
        { id: 1, codigo: "USD", nome: "Dólar Americano", simbolo: "$", pais: "Estados Unidos", cotacao_compra: null, cotacao_venda: null, variacao_percentual: null, data_cotacao: null, status: "Ativa" },
        { id: 2, codigo: "EUR", nome: "Euro", simbolo: "€", pais: "União Europeia", cotacao_compra: null, cotacao_venda: null, variacao_percentual: null, data_cotacao: null, status: "Ativa" },
        { id: 3, codigo: "GBP", nome: "Libra Esterlina", simbolo: "£", pais: "Reino Unido", cotacao_compra: null, cotacao_venda: null, variacao_percentual: null, data_cotacao: null, status: "Ativa" },
        { id: 4, codigo: "ARS", nome: "Peso Argentino", simbolo: "$", pais: "Argentina", cotacao_compra: null, cotacao_venda: null, variacao_percentual: null, data_cotacao: null, status: "Ativa" },
        { id: 5, codigo: "CAD", nome: "Dólar Canadense", simbolo: "$", pais: "Canadá", cotacao_compra: null, cotacao_venda: null, variacao_percentual: null, data_cotacao: null, status: "Ativa" },
      ]
      return NextResponse.json(moedasPadrao)
    }
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const supabase = createServerClient()
    const body = await request.json()

    const { data, error } = await supabase.from("moedas").insert([body]).select().single()

    if (error) throw error

    return NextResponse.json(data, { status: 201 })
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}
