import { type NextRequest, NextResponse } from "next/server"
import { query } from "@/lib/database"

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams
    const status = searchParams.get("status")
    const search = searchParams.get("search")

    let sql = `
      SELECT 
        p.*,
        u.nome as analisado_por_nome
      FROM propostas p
      LEFT JOIN usuarios u ON p.analisado_por = u.id
      WHERE p.deleted_at IS NULL
    `
    const params: any[] = []

    if (status) {
      sql += ` AND p.status = ?`
      params.push(status)
    }

    if (search) {
      sql += ` AND (p.nome_proponente LIKE ? OR p.cpf_cnpj LIKE ? OR p.empresa LIKE ?)`
      params.push(`%${search}%`, `%${search}%`, `%${search}%`)
    }

    sql += ` ORDER BY p.created_at DESC`

    const propostas = await query(sql, params)

    return NextResponse.json(propostas)
  } catch (error: any) {
    console.error("[v0] Erro ao buscar propostas:", error)
    return NextResponse.json({ error: "Erro ao buscar propostas", details: error.message }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const {
      nome_proponente,
      cpf_cnpj,
      email,
      telefone,
      empresa,
      numero_funcionarios,
      tipo_plano,
      valor_proposto,
      observacoes,
      id_administradora = 1, // Default para primeira administradora
    } = body

    // Validação
    if (!nome_proponente || !cpf_cnpj || !tipo_plano) {
      return NextResponse.json({ error: "Campos obrigatórios: nome_proponente, cpf_cnpj, tipo_plano" }, { status: 400 })
    }

    const sql = `
      INSERT INTO propostas (
        id_administradora,
        nome_proponente,
        cpf_cnpj,
        email,
        telefone,
        empresa,
        numero_funcionarios,
        tipo_plano,
        valor_proposto,
        observacoes,
        status
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 'pendente')
    `

    const result: any = await query(sql, [
      id_administradora,
      nome_proponente,
      cpf_cnpj,
      email,
      telefone,
      empresa,
      numero_funcionarios,
      tipo_plano,
      valor_proposto,
      observacoes,
    ])

    return NextResponse.json(
      {
        message: "Proposta criada com sucesso",
        id: result.insertId,
      },
      { status: 201 },
    )
  } catch (error: any) {
    console.error("[v0] Erro ao criar proposta:", error)
    return NextResponse.json({ error: "Erro ao criar proposta", details: error.message }, { status: 500 })
  }
}
