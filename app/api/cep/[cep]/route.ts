import { type NextRequest, NextResponse } from "next/server"

// API ViaCEP para consulta de CEP
// https://viacep.com.br/
export async function GET(request: NextRequest, { params }: { params: { cep: string } }) {
  try {
    const cep = params.cep.replace(/\D/g, "")

    if (cep.length !== 8) {
      return NextResponse.json({ error: "CEP inválido" }, { status: 400 })
    }

    const response = await fetch(`https://viacep.com.br/ws/${cep}/json/`)

    if (!response.ok) {
      throw new Error("Erro ao buscar CEP")
    }

    const data = await response.json()

    if (data.erro) {
      return NextResponse.json({ error: "CEP não encontrado" }, { status: 404 })
    }

    return NextResponse.json({
      cep: data.cep,
      logradouro: data.logradouro,
      complemento: data.complemento,
      bairro: data.bairro,
      cidade: data.localidade,
      uf: data.uf,
      ibge: data.ibge,
      gia: data.gia,
      ddd: data.ddd,
      siafi: data.siafi,
    })
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}
