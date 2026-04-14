import type { NextRequest } from "next/server"
import { apiResponse, apiError } from "@/lib/api-response"
import { mockEnderecos } from "@/lib/mock-data"

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams
    const pessoa_id = searchParams.get("pessoa_id")
    const id_administradora = searchParams.get("id_administradora")

    let enderecos = [...mockEnderecos]

    if (pessoa_id) {
      enderecos = enderecos.filter(e => e.pessoa_id === Number.parseInt(pessoa_id))
    }

    if (id_administradora) {
      enderecos = enderecos.filter(e => e.id_administradora === Number.parseInt(id_administradora))
    }

    return apiResponse(enderecos, "Endereços listados com sucesso")
  } catch (error: any) {
    console.error("[v0] Erro ao listar endereços:", error)
    return apiError(error.message, 500)
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()

    const novoEndereco = {
      id: mockEnderecos.length + 1,
      id_administradora: body.id_administradora || 1,
      pessoa_id: body.pessoa_id,
      tipo_endereco: body.tipo_endereco,
      principal: body.principal || false,
      cep: body.cep,
      logradouro: body.logradouro,
      numero: body.numero,
      complemento: body.complemento || null,
      bairro: body.bairro,
      cidade: body.cidade,
      estado: body.estado,
      pais: body.pais || "Brasil",
      observacoes: body.observacoes || null,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
      deleted_at: null,
    }

    return apiResponse(novoEndereco, "Endereço criado com sucesso", 201)
  } catch (error: any) {
    console.error("[v0] Erro ao criar endereço:", error)
    return apiError(error.message, 500)
  }
}
