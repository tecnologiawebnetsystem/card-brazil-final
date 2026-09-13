import { NextRequest, NextResponse } from "next/server"
import { getPessoaByDocumento } from "@/lib/pessoas-repository"

function normalizeDocumento(value: string) {
  return value.replace(/\D/g, "")
}

export async function GET(request: NextRequest) {
  try {
    const documento = normalizeDocumento(request.nextUrl.searchParams.get("documento") || "")
    if (documento.length !== 11 && documento.length !== 14) {
      return NextResponse.json({ success: false, message: "Informe um CPF ou CNPJ válido." }, { status: 400 })
    }

    const pessoa = await getPessoaByDocumento(documento)
    return NextResponse.json({ success: true, found: Boolean(pessoa), data: pessoa })
  } catch (error) {
    console.error("Erro ao consultar pessoa por documento:", error)
    return NextResponse.json({ success: false, message: "Não foi possível consultar o documento." }, { status: 500 })
  }
}
