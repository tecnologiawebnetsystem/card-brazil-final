import { type NextRequest, NextResponse } from "next/server"
import { query } from "@/lib/database"

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams
    const ativo = searchParams.get("ativo")
    const oab_uf = searchParams.get("oab_uf")

    const params: unknown[] = []
    const conditions: string[] = []
    if (ativo !== null) { params.push(ativo === "true"); conditions.push(`ativo = $${params.length}`) }
    if (oab_uf) { params.push(oab_uf); conditions.push(`oab_uf = $${params.length}`) }
    const where = conditions.length ? ` WHERE ${conditions.join(" AND ")}` : ""
    const resultado = await query(`SELECT * FROM advogados${where} ORDER BY nome ASC`, params)
    return NextResponse.json(resultado)
  } catch (error: any) {
    console.error("Erro ao buscar advogados:", error)
    return NextResponse.json({ error: "Erro ao buscar advogados", details: error.message }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()

    // Validações
    if (!body.nome || !body.oab || !body.oab_uf || !body.cpf) {
      return NextResponse.json({ error: "Campos obrigatórios faltando" }, { status: 400 })
    }

    const rows = await query(
      `INSERT INTO advogados (
        administradora_id, nome, oab, oab_uf, cpf,
        email, telefone, celular,
        cep, logradouro, numero, complemento, bairro, cidade, uf,
        ativo, observacoes
      ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16, $17)
      RETURNING id`,
      [
        body.administradora_id || 1,
        body.nome,
        body.oab,
        body.oab_uf,
        body.cpf,
        body.email || null,
        body.telefone || null,
        body.celular || null,
        body.cep || null,
        body.logradouro || null,
        body.numero || null,
        body.complemento || null,
        body.bairro || null,
        body.cidade || null,
        body.uf || null,
        body.ativo !== undefined ? body.ativo : true,
        body.observacoes || null,
      ],
    )

    return NextResponse.json({ id: rows[0].id, message: "Advogado cadastrado com sucesso" }, { status: 201 })
  } catch (error: any) {
    console.error("Erro ao cadastrar advogado:", error)
    return NextResponse.json({ error: "Erro ao cadastrar advogado", details: error.message }, { status: 500 })
  }
}
