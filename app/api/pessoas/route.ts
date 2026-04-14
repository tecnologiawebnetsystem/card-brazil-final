import type { NextRequest } from "next/server"
import { apiResponse, apiError } from "@/lib/api-response"
import { mockPessoas } from "@/lib/mock-data"

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams
    const tipo_pessoa = searchParams.get("tipo_pessoa")
    const status = searchParams.get("status")
    const search = searchParams.get("search")

    let resultado = [...mockPessoas]

    if (tipo_pessoa) {
      resultado = resultado.filter(p => p.tipo_pessoa === tipo_pessoa)
    }

    if (status) {
      resultado = resultado.filter(p => p.status === status)
    }

    if (search) {
      const searchLower = search.toLowerCase()
      resultado = resultado.filter(p => 
        p.nome_completo?.toLowerCase().includes(searchLower) ||
        p.razao_social?.toLowerCase().includes(searchLower) ||
        p.cpf?.includes(search) ||
        p.cnpj?.includes(search) ||
        p.email?.toLowerCase().includes(searchLower)
      )
    }

    return apiResponse(resultado, "Pessoas listadas com sucesso")
  } catch (error: any) {
    console.error("[v0] Erro ao listar pessoas:", error)
    return apiError(error.message, 500)
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()

    if (!body.tipo_pessoa) {
      return apiError("Campo obrigatório: tipo_pessoa", 400)
    }

    if (body.tipo_pessoa === "fisica" && !body.nome_completo) {
      return apiError("Nome completo é obrigatório para pessoa física", 400)
    }

    if (body.tipo_pessoa === "juridica" && !body.razao_social) {
      return apiError("Razão social é obrigatória para pessoa jurídica", 400)
    }

    const novaPessoa = {
      id: mockPessoas.length + 1,
      administradora_id: body.administradora_id || 1,
      tipo_pessoa: body.tipo_pessoa,
      nome_completo: body.nome_completo || null,
      cpf: body.cpf || null,
      rg: body.rg || null,
      data_nascimento: body.data_nascimento || null,
      sexo: body.sexo || null,
      estado_civil: body.estado_civil || null,
      nome_mae: body.nome_mae || null,
      nome_pai: body.nome_pai || null,
      razao_social: body.razao_social || null,
      nome_fantasia: body.nome_fantasia || null,
      cnpj: body.cnpj || null,
      inscricao_estadual: body.inscricao_estadual || null,
      inscricao_municipal: body.inscricao_municipal || null,
      email: body.email || null,
      telefone_principal: body.telefone_principal || null,
      telefone_secundario: body.telefone_secundario || null,
      profissao: body.profissao || null,
      renda_mensal: body.renda_mensal || null,
      observacoes: body.observacoes || null,
      status: body.status || "ativo",
      total_enderecos: 0,
      total_contas: 0,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
      deleted_at: null,
    }

    return apiResponse(novaPessoa, "Pessoa criada com sucesso", 201)
  } catch (error: any) {
    console.error("[v0] Erro ao criar pessoa:", error)
    return apiError(error.message, 500)
  }
}
