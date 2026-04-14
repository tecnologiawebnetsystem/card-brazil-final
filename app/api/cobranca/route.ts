import { type NextRequest, NextResponse } from "next/server"
import { mockCobrancas } from "@/lib/mock-data"

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams
    const status = searchParams.get("status")
    const tipo_cobranca = searchParams.get("tipo_cobranca")
    const beneficiario_id = searchParams.get("beneficiario_id")

    let resultado = [...mockCobrancas]

    if (status) {
      resultado = resultado.filter(c => c.status === status)
    }

    if (tipo_cobranca) {
      resultado = resultado.filter(c => c.tipo_cobranca === tipo_cobranca)
    }

    if (beneficiario_id) {
      resultado = resultado.filter(c => c.beneficiario_id === Number.parseInt(beneficiario_id))
    }

    return NextResponse.json(resultado)
  } catch (error: any) {
    console.error("[v0] Erro ao buscar cobranças:", error)
    return NextResponse.json({ error: "Erro ao buscar cobranças", details: error.message }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()

    const novaCobranca = {
      id: mockCobrancas.length + 1,
      id_administradora: 1,
      beneficiario_id: body.beneficiario_id,
      conta_receber_id: body.conta_receber_id || null,
      tipo_cobranca: body.tipo_cobranca || "amigavel",
      status: "em_andamento",
      data_inicio: new Date().toISOString().split('T')[0],
      data_fim: null,
      valor_original: body.valor_original,
      valor_atual: body.valor_original,
      valor_negociado: null,
      desconto_concedido: null,
      parcelas: null,
      responsavel_id: body.responsavel_id || 1,
      responsavel_nome: "Administrador Sistema",
      canal_contato: body.canal_contato || "email",
      resultado: null,
      observacoes: body.observacoes || null,
      historico: JSON.stringify([
        { data: new Date().toISOString().split('T')[0], acao: "Início da cobrança", responsavel: "Sistema", detalhes: "Cobrança iniciada" },
      ]),
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    }

    return NextResponse.json(
      { message: "Cobrança criada com sucesso", id: novaCobranca.id },
      { status: 201 },
    )
  } catch (error: any) {
    console.error("[v0] Erro ao criar cobrança:", error)
    return NextResponse.json({ error: "Erro ao criar cobrança", details: error.message }, { status: 500 })
  }
}
