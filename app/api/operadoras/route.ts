import { type NextRequest, NextResponse } from "next/server"
import { successResponse } from "@/lib/api-response"
import { query } from "@/lib/database"
import { requireCadastroAccess } from "@/lib/api-auth"
import { exigirDependenciasCadastro } from "@/lib/cadastro-dependencias"
import { apiAuthError } from "@/lib/api-auth"
import { papelCadastroSchema, zodFieldErrors } from "@/lib/validation"
import { apiError } from "@/lib/api-response"

export async function GET(request: NextRequest) {
  try {
    const { administradoraId } = await requireCadastroAccess("view")
    const searchParams = request.nextUrl.searchParams
    const ativo = searchParams.get("ativo")

    const params: unknown[] = []
    const where = ativo !== null ? " WHERE administradora_id = $1 AND status = $2" : " WHERE administradora_id = $1"
    params.push(administradoraId)
    if (ativo !== null) params.push(ativo === "true" ? "ativo" : "inativo")
    const operadoras = await query(`SELECT * FROM operadoras${where} ORDER BY created_at DESC NULLS LAST`, params)
    return NextResponse.json(successResponse(operadoras))
  } catch (error) {
    console.error("[v0] Erro ao consultar operadoras:", error)
    return NextResponse.json({ success: false, message: "Erro ao consultar operadoras" }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const { administradoraId } = await requireCadastroAccess("create")
    const parsed = papelCadastroSchema.safeParse(await request.json())
    if (!parsed.success) return apiError("Dados da operadora inválidos", 400, zodFieldErrors(parsed.error))
    const pessoaId = await exigirDependenciasCadastro(parsed.data.pessoa_id)
    const rows = await query(`INSERT INTO operadoras (pessoa_id, administradora_id, nome, registro_ans, status) VALUES ($1,$2,$3,$4,$5) RETURNING *`, [pessoaId, administradoraId, parsed.data.nome, parsed.data.registro_ans || null, parsed.data.status])
    return NextResponse.json(successResponse(rows[0], "Operadora criada com sucesso"), { status: 201 })
  } catch (error) {
    const auth = apiAuthError(error)
    if (auth) return apiError(auth.message, auth.status)
    return apiError("Não foi possível criar a operadora", 500)
  }
}
