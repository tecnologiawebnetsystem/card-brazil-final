import { type NextRequest, NextResponse } from "next/server"
import { mockDependentes, mockBeneficiarios } from "@/lib/mock-data"

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams
    const ativo = searchParams.get("ativo")
    const titular_id = searchParams.get("titular_id")
    const search = searchParams.get("search")

    // Filtrar dependentes
    let dependentes = [...mockDependentes]

    if (ativo !== null) {
      dependentes = dependentes.filter(d => d.ativo === (ativo === "true"))
    }

    if (titular_id) {
      dependentes = dependentes.filter(d => d.beneficiario_titular_id === Number.parseInt(titular_id))
    }

    if (search) {
      const searchLower = search.toLowerCase()
      dependentes = dependentes.filter(d => 
        d.nome?.toLowerCase().includes(searchLower) ||
        d.cpf?.includes(search) ||
        d.titular_nome?.toLowerCase().includes(searchLower)
      )
    }

    return NextResponse.json({
      success: true,
      data: dependentes,
      count: dependentes.length,
    })
  } catch (error) {
    console.error("[v0] Erro ao buscar dependentes:", error)
    return NextResponse.json(
      { success: false, message: "Erro ao buscar dependentes", error: error instanceof Error ? error.message : "Erro desconhecido" },
      { status: 500 },
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()

    // Validações básicas
    if (!body.beneficiario_titular_id) {
      return NextResponse.json(
        { success: false, message: "beneficiario_titular_id é obrigatório" },
        { status: 400 },
      )
    }

    // Verificar se o titular existe
    const titular = mockBeneficiarios.find(b => b.id === body.beneficiario_titular_id)
    if (!titular) {
      return NextResponse.json(
        { success: false, message: "Titular não encontrado" },
        { status: 404 },
      )
    }

    if (!body.parentesco) {
      return NextResponse.json(
        { success: false, message: "parentesco é obrigatório" },
        { status: 400 },
      )
    }

    // Mock: criar novo dependente
    const novoDependente = {
      id: mockBeneficiarios.length + mockDependentes.length + 1,
      pessoa_id: body.pessoa_id || null,
      tipo_beneficiario: "dependente",
      proposta_id: titular.proposta_id,
      beneficiario_titular_id: body.beneficiario_titular_id,
      parentesco: body.parentesco,
      plano_id: titular.plano_id,
      operadora_id: titular.operadora_id,
      data_adesao: body.data_adesao || new Date().toISOString().split('T')[0],
      status: body.status || "ativo",
      ativo: body.ativo !== undefined ? body.ativo : true,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
      nome: body.nome || "Novo Dependente",
      cpf: body.cpf || null,
      telefone: body.telefone || null,
      email: body.email || null,
      data_nascimento: body.data_nascimento || null,
      sexo: body.sexo || null,
      titular_nome: titular.nome,
      plano_nome: titular.plano_nome,
      operadora_nome: titular.operadora_nome,
    }

    return NextResponse.json(
      { success: true, data: novoDependente, message: "Dependente criado com sucesso" },
      { status: 201 },
    )
  } catch (error) {
    console.error("[v0] Erro ao criar dependente:", error)
    return NextResponse.json(
      { success: false, message: "Erro ao criar dependente", error: error instanceof Error ? error.message : "Erro desconhecido" },
      { status: 500 },
    )
  }
}
