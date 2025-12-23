import { type NextRequest, NextResponse } from "next/server"
import { query } from "@/lib/database"

export async function GET(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const { id } = params

    const sql = `
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
      WHERE b.id = ?
    `

    const result = await query(sql, [id])

    if (result.length === 0) {
      return NextResponse.json(
        {
          success: false,
          message: "Beneficiário não encontrado",
        },
        { status: 404 },
      )
    }

    return NextResponse.json({
      success: true,
      data: result[0],
    })
  } catch (error) {
    console.error("[v0] Erro ao buscar beneficiário:", error)
    return NextResponse.json(
      {
        success: false,
        message: "Erro ao buscar beneficiário",
        error: error instanceof Error ? error.message : "Erro desconhecido",
      },
      { status: 500 },
    )
  }
}

export async function PUT(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const body = await request.json()
    const { id } = params

    const checkSql = `SELECT id FROM beneficiarios WHERE id = ?`
    const existing = await query(checkSql, [id])

    if (existing.length === 0) {
      return NextResponse.json(
        {
          success: false,
          message: "Beneficiário não encontrado",
        },
        { status: 404 },
      )
    }

    const updateFields: string[] = []
    const updateValues: any[] = []

    if (body.pessoa_id !== undefined) {
      updateFields.push("pessoa_id = ?")
      updateValues.push(body.pessoa_id)
    }
    if (body.tipo_beneficiario !== undefined) {
      updateFields.push("tipo_beneficiario = ?")
      updateValues.push(body.tipo_beneficiario)
    }
    if (body.proposta_id !== undefined) {
      updateFields.push("proposta_id = ?")
      updateValues.push(body.proposta_id)
    }
    if (body.beneficiario_titular_id !== undefined) {
      updateFields.push("beneficiario_titular_id = ?")
      updateValues.push(body.beneficiario_titular_id)
    }
    if (body.parentesco !== undefined) {
      updateFields.push("parentesco = ?")
      updateValues.push(body.parentesco)
    }
    if (body.plano_id !== undefined) {
      updateFields.push("plano_id = ?")
      updateValues.push(body.plano_id)
    }
    if (body.operadora_id !== undefined) {
      updateFields.push("operadora_id = ?")
      updateValues.push(body.operadora_id)
    }
    if (body.data_adesao !== undefined) {
      updateFields.push("data_adesao = ?")
      updateValues.push(body.data_adesao)
    }
    if (body.status !== undefined) {
      updateFields.push("status = ?")
      updateValues.push(body.status)
    }
    if (body.ativo !== undefined) {
      updateFields.push("ativo = ?")
      updateValues.push(body.ativo)
    }

    updateFields.push("updated_at = CURRENT_TIMESTAMP")
    updateValues.push(id)

    const updateSql = `
      UPDATE beneficiarios
      SET ${updateFields.join(", ")}
      WHERE id = ?
    `

    await query(updateSql, updateValues)

    // Busca o beneficiário atualizado com todos os dados
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

    const beneficiario = await query(selectSql, [id])

    return NextResponse.json({
      success: true,
      data: beneficiario[0],
      message: "Beneficiário atualizado com sucesso",
    })
  } catch (error) {
    console.error("[v0] Erro ao atualizar beneficiário:", error)
    return NextResponse.json(
      {
        success: false,
        message: "Erro ao atualizar beneficiário",
        error: error instanceof Error ? error.message : "Erro desconhecido",
      },
      { status: 500 },
    )
  }
}

export async function DELETE(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const { id } = params

    const checkSql = `SELECT id, tipo_beneficiario FROM beneficiarios WHERE id = ?`
    const existing = await query(checkSql, [id])

    if (existing.length === 0) {
      return NextResponse.json(
        {
          success: false,
          message: "Beneficiário não encontrado",
        },
        { status: 404 },
      )
    }

    // Se for titular, verifica se tem dependentes
    if (existing[0].tipo_beneficiario === "titular") {
      const countSql = `
        SELECT COUNT(*) as count 
        FROM beneficiarios 
        WHERE beneficiario_titular_id = ? AND ativo = 1
      `
      const dependentes = await query(countSql, [id])

      if (dependentes[0].count > 0) {
        return NextResponse.json(
          {
            success: false,
            message: "Não é possível excluir um titular que possui dependentes ativos",
          },
          { status: 400 },
        )
      }
    }

    const deleteSql = `
      UPDATE beneficiarios
      SET ativo = 0, status = 'cancelado', updated_at = CURRENT_TIMESTAMP
      WHERE id = ?
    `
    await query(deleteSql, [id])

    return NextResponse.json({
      success: true,
      data: null,
      message: "Beneficiário excluído com sucesso",
    })
  } catch (error) {
    console.error("[v0] Erro ao excluir beneficiário:", error)
    return NextResponse.json(
      {
        success: false,
        message: "Erro ao excluir beneficiário",
        error: error instanceof Error ? error.message : "Erro desconhecido",
      },
      { status: 500 },
    )
  }
}
