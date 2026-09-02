import type { NextRequest } from "next/server"
import { apiResponse, apiError } from "@/lib/api-response"
import { query } from "@/lib/database"

export async function GET(request: NextRequest) {
  try {
    const sp = request.nextUrl.searchParams
    const params: unknown[] = []
    const conditions: string[] = []
    for (const key of ["pessoa_id", "id_administradora"]) { const value = sp.get(key); if (value) { params.push(Number.parseInt(value, 10)); conditions.push(`${key === "id_administradora" ? "administradora_id" : key} = $${params.length}`) } }
    const where = conditions.length ? ` WHERE ${conditions.join(" AND ")}` : ""
    return apiResponse(await query(`SELECT * FROM enderecos${where} ORDER BY id DESC`, params), "Endereços listados com sucesso")
  } catch (error: any) { return apiError(error.message, 500) }
}
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    if (!body.pessoa_id) return apiError("pessoa_id é obrigatório", 400)
    const rows = await query(`INSERT INTO enderecos (pessoa_id, tipo_endereco, cep, logradouro, numero, complemento, bairro, cidade, estado, pais, is_principal) VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11) RETURNING *`, [body.pessoa_id, body.tipo_endereco || "residencial", body.cep || null, body.logradouro || null, body.numero || null, body.complemento || null, body.bairro || null, body.cidade || null, body.estado || null, body.pais || "Brasil", body.is_principal ?? body.principal ?? false])
    return apiResponse(rows[0], "Endereço criado com sucesso", 201)
  } catch (error: any) { return apiError(error.message, 500) }
}
