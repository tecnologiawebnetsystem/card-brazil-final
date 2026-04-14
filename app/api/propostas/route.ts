import { type NextRequest, NextResponse } from "next/server"
import { mockPropostas } from "@/lib/mock-data"

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams
    const status = searchParams.get("status")
    const search = searchParams.get("search")
    const tipo_plano = searchParams.get("tipo_plano")

    let propostas = [...mockPropostas]

    if (status) {
      propostas = propostas.filter(p => p.status === status)
    }

    if (tipo_plano) {
      propostas = propostas.filter(p => p.tipo_plano === tipo_plano)
    }

    if (search) {
      const searchLower = search.toLowerCase()
      propostas = propostas.filter(p => 
        p.numero_proposta.toLowerCase().includes(searchLower) ||
        p.observacoes?.toLowerCase().includes(searchLower) ||
        p.nome_proponente?.toLowerCase().includes(searchLower) ||
        p.empresa?.toLowerCase().includes(searchLower) ||
        p.cpf_cnpj?.includes(search)
      )
    }

    return NextResponse.json(propostas)
  } catch (error: any) {
    console.error("[v0] Erro ao buscar propostas:", error)
    return NextResponse.json({ error: "Erro ao buscar propostas", details: error.message }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()

    const novaProposta = {
      id: mockPropostas.length + 1,
      numero_proposta: `PROP-2024-${String(mockPropostas.length + 1).padStart(4, '0')}`,
      estipulante_id: body.estipulante_id || 1,
      corretor_id: body.corretor_id || 1,
      operadora_id: body.operadora_id || 1,
      produto_id: body.produto_id || 1,
      data_proposta: new Date().toISOString().split('T')[0],
      data_vigencia: body.data_vigencia || null,
      valor_total: body.valor_total || 0,
      quantidade_vidas: body.quantidade_vidas || 0,
      status: "pendente",
      observacoes: body.observacoes || null,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    }

    return NextResponse.json(
      { message: "Proposta criada com sucesso", id: novaProposta.id },
      { status: 201 },
    )
  } catch (error: any) {
    console.error("[v0] Erro ao criar proposta:", error)
    return NextResponse.json({ error: "Erro ao criar proposta", details: error.message }, { status: 500 })
  }
}
