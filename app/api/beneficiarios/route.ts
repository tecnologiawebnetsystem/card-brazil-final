import { type NextRequest, NextResponse } from "next/server"
import { query } from "@/lib/database"

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams
    const ativo = searchParams.get("ativo")
    const tipo_beneficiario = searchParams.get("tipo_beneficiario")
    const titular_id = searchParams.get("titular_id")

    let sql = `
      SELECT 
        b.id,
        b.pessoa_id,
        b.tipo_beneficiario,
        b.proposta_id,
        b.beneficiario_titular_id,
        b.parentesco,
        b.plano_id,
        b.operadora_id,
        b.data_adesao,
        b.status,
        b.ativo,
        b.created_at,
        b.updated_at,
        p.nome,
        p.cpf,
        p.telefone,
        p.email,
        p.data_nascimento,
        p.sexo,
        titular_pessoa.nome as titular_nome,
        pl.nome as plano_nome,
        op.nome as operadora_nome
      FROM beneficiarios b
      LEFT JOIN pessoas p ON b.pessoa_id = p.id
      LEFT JOIN beneficiarios titular ON b.beneficiario_titular_id = titular.id
      LEFT JOIN pessoas titular_pessoa ON titular.pessoa_id = titular_pessoa.id
      LEFT JOIN planos pl ON b.plano_id = pl.id
      LEFT JOIN operadoras op ON b.operadora_id = op.id
      WHERE 1=1
    `

    const params: any[] = []

    if (ativo !== null) {
      sql += ` AND b.ativo = ?`
      params.push(ativo === "true" ? 1 : 0)
    }

    if (tipo_beneficiario) {
      sql += ` AND b.tipo_beneficiario = ?`
      params.push(tipo_beneficiario)
    }

    if (titular_id) {
      sql += ` AND b.beneficiario_titular_id = ?`
      params.push(Number.parseInt(titular_id))
    }

    sql += ` ORDER BY b.id ASC`

    const result = await query(sql, params)

    return NextResponse.json({
      success: true,
      data: result,
      count: result.length,
    })
  } catch (error) {
    console.error("[v0] Erro ao buscar beneficiários:", error)
    return NextResponse.json(
      {
        success: false,
        message: "Erro ao buscar beneficiários",
        error: error instanceof Error ? error.message : "Erro desconhecido",
      },
      { status: 500 },
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()

    // Validações básicas
    if (!body.pessoa_id) {
      return NextResponse.json(
        {
          success: false,
          message: "pessoa_id é obrigatório",
        },
        { status: 400 },
      )
    }

    if (!body.tipo_beneficiario || !["titular", "dependente"].includes(body.tipo_beneficiario)) {
      return NextResponse.json(
        {
          success: false,
          message: "tipo_beneficiario deve ser 'titular' ou 'dependente'",
        },
        { status: 400 },
      )
    }

    // Validações específicas para dependentes
    if (body.tipo_beneficiario === "dependente") {
      if (!body.beneficiario_titular_id) {
        return NextResponse.json(
          {
            success: false,
            message: "beneficiario_titular_id é obrigatório para dependentes",
          },
          { status: 400 },
        )
      }

      if (!body.parentesco) {
        return NextResponse.json(
          {
            success: false,
            message: "parentesco é obrigatório para dependentes",
          },
          { status: 400 },
        )
      }
    }

    const insertSql = `
      INSERT INTO beneficiarios (
        pessoa_id,
        tipo_beneficiario,
        proposta_id,
        beneficiario_titular_id,
        parentesco,
        plano_id,
        operadora_id,
        data_adesao,
        status,
        ativo
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `

    const insertParams = [
      body.pessoa_id,
      body.tipo_beneficiario,
      body.proposta_id || null,
      body.beneficiario_titular_id || null,
      body.parentesco || null,
      body.plano_id || null,
      body.operadora_id || null,
      body.data_adesao || null,
      body.status || "ativo",
      body.ativo !== undefined ? body.ativo : true,
    ]

    const result: any = await query(insertSql, insertParams)
    const beneficiarioId = result.insertId

    // Busca o beneficiário criado com todos os dados
    const selectSql = `
      SELECT 
        b.id,
        b.pessoa_id,
        b.tipo_beneficiario,
        b.proposta_id,
        b.beneficiario_titular_id,
        b.parentesco,
        b.plano_id,
        b.operadora_id,
        b.data_adesao,
        b.status,
        b.ativo,
        b.created_at,
        b.updated_at,
        p.nome,
        p.cpf,
        p.telefone,
        p.email,
        titular_pessoa.nome as titular_nome,
        pl.nome as plano_nome,
        op.nome as operadora_nome
      FROM beneficiarios b
      LEFT JOIN pessoas p ON b.pessoa_id = p.id
      LEFT JOIN beneficiarios titular ON b.beneficiario_titular_id = titular.id
      LEFT JOIN pessoas titular_pessoa ON titular.pessoa_id = titular_pessoa.id
      LEFT JOIN planos pl ON b.plano_id = pl.id
      LEFT JOIN operadoras op ON b.operadora_id = op.id
      WHERE b.id = ?
    `

    const beneficiario = await query(selectSql, [beneficiarioId])

    return NextResponse.json(
      {
        success: true,
        data: beneficiario[0],
        message: "Beneficiário criado com sucesso",
      },
      { status: 201 },
    )
  } catch (error) {
    console.error("[v0] Erro ao criar beneficiário:", error)
    return NextResponse.json(
      {
        success: false,
        message: "Erro ao criar beneficiário",
        error: error instanceof Error ? error.message : "Erro desconhecido",
      },
      { status: 500 },
    )
  }
}
