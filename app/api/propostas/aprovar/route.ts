import { type NextRequest, NextResponse } from "next/server"
import { requireCadastroAccess, apiAuthError } from "@/back-end/lib/api-auth"

export async function POST(_request: NextRequest) {
  try {
    await requireCadastroAccess("edit")
    return NextResponse.json(
      { error: "Aprovação bloqueada: o fluxo depende de colunas e decisões de negócio (plano, condições comerciais e contrato) que não podem ser confirmadas no schema ativo. Nenhuma alteração foi gravada." },
      { status: 501 },
    )
  } catch (error) {
    const auth = apiAuthError(error)
    if (auth) return NextResponse.json({ error: auth.message }, { status: auth.status })
    console.error("[v0] Erro ao aprovar proposta:", error)
    return NextResponse.json({ error: "Erro ao autorizar a operação" }, { status: 500 })
  }
}
