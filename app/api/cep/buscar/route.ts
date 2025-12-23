import { type NextRequest, NextResponse } from "next/server"

// API ViaCEP para busca por endereço
// https://viacep.com.br/
export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams
    const uf = searchParams.get("uf")
    const cidade = searchParams.get("cidade")
    const logradouro = searchParams.get("logradouro")

    if (!uf || !cidade || !logradouro) {
      return NextResponse.json({ error: "Parâmetros inválidos. Informe UF, cidade e logradouro" }, { status: 400 })
    }

    if (logradouro.length < 3) {
      return NextResponse.json({ error: "Logradouro deve ter no mínimo 3 caracteres" }, { status: 400 })
    }

    const response = await fetch(`https://viacep.com.br/ws/${uf}/${cidade}/${logradouro}/json/`)

    if (!response.ok) {
      throw new Error("Erro ao buscar endereços")
    }

    const data = await response.json()

    if (Array.isArray(data) && data.length === 0) {
      return NextResponse.json({ error: "Nenhum endereço encontrado" }, { status: 404 })
    }

    const enderecos = Array.isArray(data)
      ? data.map((item) => ({
          cep: item.cep,
          logradouro: item.logradouro,
          complemento: item.complemento,
          bairro: item.bairro,
          cidade: item.localidade,
          uf: item.uf,
          ibge: item.ibge,
        }))
      : []

    return NextResponse.json(enderecos)
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}
