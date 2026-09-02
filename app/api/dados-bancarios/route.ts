import type { NextRequest } from "next/server"
import { apiResponse, apiError } from "@/lib/api-response"
import { query } from "@/lib/database"

export async function GET(request: NextRequest) {
  try {
    const sp = request.nextUrl.searchParams
    const params: unknown[] = []
    const conditions: string[] = []
    for (const key of ["pessoa_id"]) { const value = sp.get(key); if (value) { params.push(Number.parseInt(value, 10)); conditions.push(`${key} = $${params.length}`) } }
    const where = conditions.length ? ` WHERE ${conditions.join(" AND ")}` : ""
    return apiResponse(await query(`SELECT id, pessoa_id, banco_codigo, banco_nome, agencia, agencia_digito, conta, conta_digito, tipo_conta, pix_tipo, pix_chave, is_principal, created_at, updated_at FROM dados_bancarios${where} ORDER BY id DESC`, params), "Contas bancárias listadas com sucesso")
  } catch (error: any) { return apiError(error.message, 500) }
}
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    if (!body.pessoa_id) return apiError("pessoa_id é obrigatório", 400)
    const rows = await query(`INSERT INTO dados_bancarios (pessoa_id, banco_codigo, banco_nome, agencia, agencia_digito, conta, conta_digito, tipo_conta, pix_tipo, pix_chave, is_principal) VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11) RETURNING id, pessoa_id, banco_codigo, banco_nome, agencia, agencia_digito, conta, conta_digito, tipo_conta, pix_tipo, pix_chave, is_principal`, [body.pessoa_id, body.banco_codigo || null, body.banco_nome || null, body.agencia || null, body.agencia_digito || null, body.conta || null, body.conta_digito || null, body.tipo_conta || null, body.pix_tipo || null, body.pix_chave || null, body.is_principal ?? body.principal ?? false])
    return apiResponse(rows[0], "Conta bancária criada com sucesso", 201)
  } catch (error: any) { return apiError(error.message, 500) }
}
