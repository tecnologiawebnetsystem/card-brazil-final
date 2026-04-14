import type { NextRequest } from "next/server"
import { apiResponse, apiError } from "@/lib/api-response"
import { mockPessoas, mockEnderecos, mockDadosBancarios, findMockById } from "@/lib/mock-data"

export async function GET(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const { id } = params
    const pessoaId = Number.parseInt(id)
    const pessoa = findMockById(mockPessoas, pessoaId)

    if (!pessoa) {
      return apiError("Pessoa não encontrada", 404)
    }

    // Adiciona endereços e dados bancários relacionados
    const enderecos = mockEnderecos.filter(e => e.pessoa_id === pessoaId)
    const dados_bancarios = mockDadosBancarios.filter(db => db.pessoa_id === pessoaId)

    return apiResponse({ ...pessoa, enderecos, dados_bancarios }, "Pessoa encontrada com sucesso")
  } catch (error: any) {
    console.error("[v0] Erro ao buscar pessoa:", error)
    return apiError(error.message, 500)
  }
}

export async function PUT(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const { id } = params
    const body = await request.json()
    const pessoa = findMockById(mockPessoas, Number.parseInt(id))

    if (!pessoa) {
      return apiError("Pessoa não encontrada", 404)
    }

    const updated = { ...pessoa, ...body, updated_at: new Date().toISOString() }
    return apiResponse(updated, "Pessoa atualizada com sucesso")
  } catch (error: any) {
    console.error("[v0] Erro ao atualizar pessoa:", error)
    return apiError(error.message, 500)
  }
}

export async function DELETE(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const { id } = params
    const pessoa = findMockById(mockPessoas, Number.parseInt(id))

    if (!pessoa) {
      return apiError("Pessoa não encontrada", 404)
    }

    return apiResponse(null, "Pessoa excluída com sucesso")
  } catch (error: any) {
    console.error("[v0] Erro ao excluir pessoa:", error)
    return apiError(error.message, 500)
  }
}
