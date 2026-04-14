import type { NextRequest } from "next/server"
import { apiResponse, apiError } from "@/lib/api-response"
import { mockDadosBancarios } from "@/lib/mock-data"

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams
    const pessoa_id = searchParams.get("pessoa_id")
    const id_administradora = searchParams.get("id_administradora")

    let contas = [...mockDadosBancarios]

    if (pessoa_id) {
      contas = contas.filter(c => c.pessoa_id === Number.parseInt(pessoa_id))
    }

    if (id_administradora) {
      contas = contas.filter(c => c.id_administradora === Number.parseInt(id_administradora))
    }

    return apiResponse(contas, "Contas bancárias listadas com sucesso")
  } catch (error: any) {
    console.error("[v0] Erro ao listar contas bancárias:", error)
    return apiError(error.message, 500)
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()

    const novaConta = {
      id: mockDadosBancarios.length + 1,
      id_administradora: body.id_administradora || 1,
      pessoa_id: body.pessoa_id,
      principal: body.principal || false,
      banco_codigo: body.banco_codigo,
      banco_nome: body.banco_nome,
      agencia: body.agencia,
      agencia_digito: body.agencia_digito || null,
      conta: body.conta,
      conta_digito: body.conta_digito,
      tipo_conta: body.tipo_conta,
      pix_tipo: body.pix_tipo || null,
      pix_chave: body.pix_chave || null,
      observacoes: body.observacoes || null,
      status: body.status || "ativo",
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
      deleted_at: null,
    }

    return apiResponse(novaConta, "Conta bancária criada com sucesso", 201)
  } catch (error: any) {
    console.error("[v0] Erro ao criar conta bancária:", error)
    return apiError(error.message, 500)
  }
}
