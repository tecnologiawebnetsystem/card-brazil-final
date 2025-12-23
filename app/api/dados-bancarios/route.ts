import type { NextRequest } from "next/server"
import { query } from "@/lib/database"
import { apiResponse, apiError } from "@/lib/api-response"

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams
    const pessoa_id = searchParams.get("pessoa_id")
    const id_administradora = searchParams.get("id_administradora")

    let sql = "SELECT * FROM dados_bancarios WHERE deleted_at IS NULL"
    const params: any[] = []

    if (pessoa_id) {
      sql += " AND pessoa_id = ?"
      params.push(pessoa_id)
    }

    if (id_administradora) {
      sql += " AND id_administradora = ?"
      params.push(id_administradora)
    }

    sql += " ORDER BY principal DESC, created_at DESC"

    const contas = await query(sql, params)
    return apiResponse(contas, "Contas bancárias listadas com sucesso")
  } catch (error: any) {
    console.error("[v0] Erro ao listar contas bancárias:", error)
    return apiError(error.message, 500)
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const {
      id_administradora,
      pessoa_id,
      principal = false,
      banco_codigo,
      banco_nome,
      agencia,
      agencia_digito,
      conta,
      conta_digito,
      tipo_conta,
      pix_tipo,
      pix_chave,
      observacoes,
      status = "ativo",
    } = body

    if (
      !id_administradora ||
      !pessoa_id ||
      !banco_codigo ||
      !banco_nome ||
      !agencia ||
      !conta ||
      !conta_digito ||
      !tipo_conta
    ) {
      return apiError("Campos obrigatórios faltando", 400)
    }

    // Se for principal, remove principal das outras contas
    if (principal) {
      await query("UPDATE dados_bancarios SET principal = FALSE WHERE pessoa_id = ? AND id_administradora = ?", [
        pessoa_id,
        id_administradora,
      ])
    }

    const result = await query(
      `INSERT INTO dados_bancarios (
        id_administradora, pessoa_id, principal, banco_codigo, banco_nome, agencia, agencia_digito,
        conta, conta_digito, tipo_conta, pix_tipo, pix_chave, observacoes, status
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        id_administradora,
        pessoa_id,
        principal,
        banco_codigo,
        banco_nome,
        agencia,
        agencia_digito,
        conta,
        conta_digito,
        tipo_conta,
        pix_tipo,
        pix_chave,
        observacoes,
        status,
      ],
    )

    const conta_bancaria = await query("SELECT * FROM dados_bancarios WHERE id = ?", [result.insertId])
    return apiResponse(conta_bancaria[0], "Conta bancária criada com sucesso", 201)
  } catch (error: any) {
    console.error("[v0] Erro ao criar conta bancária:", error)
    return apiError(error.message, 500)
  }
}
