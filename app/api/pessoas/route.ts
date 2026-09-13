import type { NextRequest } from "next/server"
import { apiResponse, apiError } from "@/lib/api-response"
import { authErrorStatus, requireCadastroAccess } from "@/lib/api-auth"
import { pessoaSchema, zodFieldErrors } from "@/lib/validation"
import { recordCadastroAudit } from "@/lib/cadastro-audit"
import { createPessoa, listPessoas } from "@/lib/pessoas-repository"

function normalizePayload(body: Record<string, any>) {
  return {
    ...body,
    nome_completo: body.nome_completo ?? body.nome ?? null,
    telefone_principal: body.telefone_principal ?? body.telefone ?? null,
    telefone_secundario: body.telefone_secundario ?? body.celular ?? null,
    nome_fantasia: body.nome_fantasia ?? body.razao_abreviada ?? null,
    data_fundacao: body.data_fundacao ?? body.data_abertura ?? null,
  }
}

export async function GET(request: NextRequest) {
  try {
    const { administradoraId } = await requireCadastroAccess("view")
    const searchParams = request.nextUrl.searchParams
    const resultado = await listPessoas(administradoraId, {
      tipo: searchParams.get("tipo_pessoa"),
      status: searchParams.get("status"),
      search: searchParams.get("search"),
    })
    return apiResponse(resultado, "Pessoas listadas com sucesso")
  } catch (error: any) {
    console.error("[v0] Erro ao listar pessoas:", error)
    return apiError(error instanceof Error && (error.message === "UNAUTHENTICATED" || error.message === "FORBIDDEN") ? (error.message === "UNAUTHENTICATED" ? "Não autenticado" : "Sem permissão para este cadastro") : "Não foi possível processar a pessoa", authErrorStatus(error))
  }
}

export async function POST(request: NextRequest) {
  try {
    const access = await requireCadastroAccess("create")
    const parsed = pessoaSchema.safeParse(normalizePayload(await request.json()))
    if (!parsed.success) return apiError("Dados da pessoa inválidos", 400, zodFieldErrors(parsed.error))
    const pessoa = await createPessoa(access.administradoraId, parsed.data)
    await recordCadastroAudit({ administradoraId: access.administradoraId, userId: access.userId, action: "create", tableName: "pessoas", recordId: pessoa.id, after: pessoa })
    return apiResponse(pessoa, "Pessoa criada com sucesso", 201)
  } catch (error: any) {
    console.error("[v0] Erro ao criar pessoa:", error)
    return apiError(error instanceof Error && (error.message === "UNAUTHENTICATED" || error.message === "FORBIDDEN") ? (error.message === "UNAUTHENTICATED" ? "Não autenticado" : "Sem permissão para este cadastro") : "Não foi possível processar a pessoa", authErrorStatus(error))
  }
}
