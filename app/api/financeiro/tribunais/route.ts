import { type NextRequest, NextResponse } from "next/server"
import { query } from "@/lib/database"

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams
    const tipo = searchParams.get("tipo")
    const uf = searchParams.get("uf")
    const ativo = searchParams.get("ativo")

    const params: unknown[] = []
    const conditions: string[] = []
    if (tipo) { params.push(tipo); conditions.push(`tipo = $${params.length}`) }
    if (uf) { params.push(uf); conditions.push(`uf = $${params.length}`) }
    if (ativo !== null) { params.push(ativo === "true"); conditions.push(`ativo = $${params.length}`) }
    const where = conditions.length ? ` WHERE ${conditions.join(" AND ")}` : ""
    const resultado = await query(`SELECT * FROM tribunais${where} ORDER BY nome ASC`, params)
    return NextResponse.json(resultado)
  } catch (error: any) {
    console.error("[v0] Erro ao buscar tribunais:", error)
    return NextResponse.json({ error: "Erro ao buscar tribunais", details: error.message }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()

    if (!body.nome || !body.tipo || !body.instancia || !body.uf) {
      return NextResponse.json({ error: "Campos obrigatórios faltando" }, { status: 400 })
    }

    const rows = await query(
      `INSERT INTO tribunais (
        administradora_id, nome, sigla, tipo, instancia, uf, cidade,
        telefone, email, site, cep, logradouro, numero, complemento, bairro, ativo
      ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16)
      RETURNING id`,
      [
        body.administradora_id || 1,
        body.nome,
        body.sigla || null,
        body.tipo,
        body.instancia,
        body.uf,
        body.cidade || null,
        body.telefone || null,
        body.email || null,
        body.site || null,
        body.cep || null,
        body.logradouro || null,
        body.numero || null,
        body.complemento || null,
        body.bairro || null,
        body.ativo !== undefined ? body.ativo : true,
      ],
    )

    return NextResponse.json({ id: rows[0].id, message: "Tribunal cadastrado com sucesso" }, { status: 201 })
  } catch (error: any) {
    console.error("[v0] Erro ao cadastrar tribunal:", error)
    return NextResponse.json({ error: "Erro ao cadastrar tribunal", details: error.message }, { status: 500 })
  }
}
