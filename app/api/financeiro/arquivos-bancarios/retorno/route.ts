import { NextResponse } from "next/server"
import { apiAuthError, requireFinanceiroAccess } from "@/back-end/lib/api-auth"

export async function POST() {
  try {
    await requireFinanceiroAccess("edit")
    return NextResponse.json(
      { error: "Processamento de retorno bancário bloqueado: falta validar o layout da instituição, a origem das transações e a atomicidade do vínculo contábil. Nenhuma baixa foi registrada." },
      { status: 501 },
    )
  } catch (error) {
    const auth = apiAuthError(error)
    return NextResponse.json(
      { error: auth?.message || "Erro ao autorizar processamento de retorno bancário" },
      { status: auth?.status || 500 },
    )
  }
}
