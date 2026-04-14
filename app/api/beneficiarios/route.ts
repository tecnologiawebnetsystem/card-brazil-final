import { type NextRequest, NextResponse } from "next/server"
import { mockBeneficiarios, mockDependentes } from "@/lib/mock-data"

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams
    const ativo = searchParams.get("ativo")
    const tipo_beneficiario = searchParams.get("tipo_beneficiario")
    const titular_id = searchParams.get("titular_id")

    // Combina titulares e dependentes
    let result = [...mockBeneficiarios, ...mockDependentes]

    if (ativo !== null) {
      result = result.filter(b => b.ativo === (ativo === "true"))
    }

    if (tipo_beneficiario) {
      result = result.filter(b => b.tipo_beneficiario === tipo_beneficiario)
    }

    if (titular_id) {
      result = result.filter(b => b.beneficiario_titular_id === Number.parseInt(titular_id))
    }

    return NextResponse.json({
      success: true,
      data: result,
      count: result.length,
    })
  } catch (error) {
    console.error("[v0] Erro ao buscar beneficiários:", error)
    return NextResponse.json(
      {
        success: false,
        message: "Erro ao buscar beneficiários",
        error: error instanceof Error ? error.message : "Erro desconhecido",
      },
      { status: 500 },
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()

    // Validações básicas
    if (!body.pessoa_id) {
      return NextResponse.json(
        { success: false, message: "pessoa_id é obrigatório" },
        { status: 400 },
      )
    }

    if (!body.tipo_beneficiario || !["titular", "dependente"].includes(body.tipo_beneficiario)) {
      return NextResponse.json(
        { success: false, message: "tipo_beneficiario deve ser 'titular' ou 'dependente'" },
        { status: 400 },
      )
    }

    // Mock: criar novo beneficiário
    const novoBeneficiario = {
      id: mockBeneficiarios.length + mockDependentes.length + 1,
      pessoa_id: body.pessoa_id,
      tipo_beneficiario: body.tipo_beneficiario,
      proposta_id: body.proposta_id || null,
      beneficiario_titular_id: body.beneficiario_titular_id || null,
      parentesco: body.parentesco || null,
      plano_id: body.plano_id || null,
      operadora_id: body.operadora_id || null,
      data_adesao: body.data_adesao || new Date().toISOString().split('T')[0],
      status: body.status || "ativo",
      ativo: body.ativo !== undefined ? body.ativo : true,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
      nome: "Novo Beneficiário",
      cpf: null,
      telefone: null,
      email: null,
      data_nascimento: null,
      sexo: null,
      titular_nome: null,
      plano_nome: null,
      operadora_nome: null,
    }

    return NextResponse.json(
      { success: true, data: novoBeneficiario, message: "Beneficiário criado com sucesso" },
      { status: 201 },
    )
  } catch (error) {
    console.error("[v0] Erro ao criar beneficiário:", error)
    return NextResponse.json(
      { success: false, message: "Erro ao criar beneficiário", error: error instanceof Error ? error.message : "Erro desconhecido" },
      { status: 500 },
    )
  }
}
