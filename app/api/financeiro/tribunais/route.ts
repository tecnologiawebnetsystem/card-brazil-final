import { type NextRequest, NextResponse } from "next/server"
import { pool } from "@/lib/database"
import type { RowDataPacket, ResultSetHeader } from "mysql2/promise"

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams
    const tipo = searchParams.get("tipo")
    const uf = searchParams.get("uf")
    const ativo = searchParams.get("ativo")

    let query = `SELECT * FROM tribunais WHERE 1=1`
    const params: any[] = []

    if (tipo) {
      query += ` AND tipo = ?`
      params.push(tipo)
    }

    if (uf) {
      query += ` AND uf = ?`
      params.push(uf)
    }

    if (ativo !== null) {
      query += ` AND ativo = ?`
      params.push(ativo === "true" ? 1 : 0)
    }

    query += ` ORDER BY nome ASC`

    const [rows] = await pool.execute<RowDataPacket[]>(query, params)
    return NextResponse.json(rows)
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

    const [result] = await pool.execute<ResultSetHeader>(
      `INSERT INTO tribunais (
        id_administradora, nome, sigla, tipo, instancia, uf, cidade,
        telefone, email, site, cep, logradouro, numero, complemento, bairro, ativo
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        body.id_administradora || 1,
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

    return NextResponse.json({ id: result.insertId, message: "Tribunal cadastrado com sucesso" }, { status: 201 })
  } catch (error: any) {
    console.error("[v0] Erro ao cadastrar tribunal:", error)
    return NextResponse.json({ error: "Erro ao cadastrar tribunal", details: error.message }, { status: 500 })
  }
}
