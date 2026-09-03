import { NextResponse } from "next/server"

const SGS_IPCA = "https://api.bcb.gov.br/dados/serie/bcdata.sgs.433/dados?formato=json"

export async function GET() {
  try {
    const response = await fetch(SGS_IPCA, { next: { revalidate: 3600 } })
    if (!response.ok) throw new Error("Não foi possível consultar o IPCA no BCB")

    const dados = (await response.json()) as Array<{ data: string; valor: string }>
    const historico = dados.slice(-60).map((item) => ({
      data: item.data,
      valor: Number(item.valor),
      fonte: "Banco Central do Brasil (SGS 433)",
    }))

    return NextResponse.json({ indicador: "IPCA", unidade: "% a.m.", fonte: "BCB", dados: historico })
  } catch (error) {
    return NextResponse.json({ error: error instanceof Error ? error.message : "Erro ao consultar IPCA" }, { status: 502 })
  }
}
