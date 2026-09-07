import { type NextRequest, NextResponse } from "next/server"
import { successResponse } from "@/lib/api-response"
import { query } from "@/lib/database"
import { exigirDependenciasCadastro } from "@/lib/cadastro-dependencias"

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams
    const ativo = searchParams.get("ativo")

    const params: unknown[] = []
    const where = ativo !== null ? " WHERE status = $1" : ""
    if (ativo !== null) params.push(ativo === "true" ? "ativo" : "inativo")
    const administradoras = await query(`SELECT * FROM administradoras${where} ORDER BY id DESC`, params)
    return NextResponse.json(successResponse(administradoras))
  } catch (error) {
    return NextResponse.json({ success: false, message: "Erro interno" }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const pessoaId = await exigirDependenciasCadastro(body.pessoa_id)
    if (!body.nome_fantasia && !body.razao_social) {
      return NextResponse.json({ success: false, message: "Nome ou razão social é obrigatório" }, { status: 400 })
    }
    const rows = await query(`INSERT INTO administradoras (pessoa_id, razao_social, nome_fantasia, cnpj, status) VALUES ($1, $2, $3, $4, $5) RETURNING *`, [pessoaId, body.razao_social || body.nome_fantasia, body.nome_fantasia || null, body.cnpj || null, body.status || "ativo"])
    return NextResponse.json(successResponse(rows[0], "Administradora criada com sucesso"), { status: 201 })
  } catch (error) {
    const message = error instanceof Error ? error.message : "Erro interno"
    const status = message.startsWith("Cadastre") || message.startsWith("A pessoa") ? 400 : 500
    return NextResponse.json({ success: false, message }, { status })
  }
}
