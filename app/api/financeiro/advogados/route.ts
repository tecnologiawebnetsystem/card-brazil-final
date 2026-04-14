import { type NextRequest, NextResponse } from "next/server"
import { mockAdvogados } from "@/lib/mock-data"

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams
    const ativo = searchParams.get("ativo")
    const oab_uf = searchParams.get("oab_uf")

    let resultado = [...mockAdvogados]

    if (ativo !== null) {
      resultado = resultado.filter(a => a.ativo === (ativo === "true"))
    }

    if (oab_uf) {
      resultado = resultado.filter(a => a.oab_uf === oab_uf)
    }

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

    const rows = await sql(
      `INSERT INTO advogados (
        id_administradora, nome, oab, oab_uf, cpf,
        email, telefone, celular,
        cep, logradouro, numero, complemento, bairro, cidade, uf,
        ativo, observacoes
      ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16, $17)
      RETURNING id`,
      [
        body.id_administradora || 1,
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
