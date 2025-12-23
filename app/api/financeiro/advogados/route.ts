import { type NextRequest, NextResponse } from "next/server"
import { pool } from "@/lib/database"
import type { RowDataPacket, ResultSetHeader } from "mysql2/promise"

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams
    const ativo = searchParams.get("ativo")
    const oab_uf = searchParams.get("oab_uf")

    let query = `SELECT * FROM advogados WHERE deleted_at IS NULL`
    const params: any[] = []

    if (ativo !== null) {
      query += ` AND ativo = ?`
      params.push(ativo === "true" ? 1 : 0)
    }

    if (oab_uf) {
      query += ` AND oab_uf = ?`
      params.push(oab_uf)
    }

    query += ` ORDER BY nome ASC`

    const [rows] = await pool.execute<RowDataPacket[]>(query, params)
    return NextResponse.json(rows)
  } catch (error: any) {
    console.error("[v0] Erro ao buscar advogados:", error)
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

    const [result] = await pool.execute<ResultSetHeader>(
      `INSERT INTO advogados (
        id_administradora, nome, oab, oab_uf, cpf,
        email, telefone, celular,
        cep, logradouro, numero, complemento, bairro, cidade, uf,
        ativo, observacoes
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
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

    return NextResponse.json({ id: result.insertId, message: "Advogado cadastrado com sucesso" }, { status: 201 })
  } catch (error: any) {
    console.error("[v0] Erro ao cadastrar advogado:", error)
    return NextResponse.json({ error: "Erro ao cadastrar advogado", details: error.message }, { status: 500 })
  }
}
