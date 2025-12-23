import { type NextRequest, NextResponse } from "next/server"
import { query } from "@/lib/database"

export async function GET(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const { id } = params

    const checkSql = `
      SELECT id, tipo_beneficiario 
      FROM beneficiarios 
      WHERE id = ?
    `
    const titular = await query(checkSql, [id])

    if (titular.length === 0) {
      return NextResponse.json(
        {
          success: false,
          message: "Titular não encontrado",
        },
        { status: 404 },
      )
    }

    if (titular[0].tipo_beneficiario !== "titular") {
      return NextResponse.json(
        {
          success: false,
          message: "O beneficiário informado não é um titular",
        },
        { status: 400 },
      )
    }

    // Busca os dependentes
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
        p.data_nascimento,
        p.sexo,
        pl.nome as plano_nome,
        op.nome as operadora_nome
      FROM beneficiarios b
      LEFT JOIN pessoas p ON b.pessoa_id = p.id
      LEFT JOIN planos pl ON b.plano_id = pl.id
      LEFT JOIN operadoras op ON b.operadora_id = op.id
      WHERE b.beneficiario_titular_id = ?
      ORDER BY b.id ASC
    `
    const result = await query(selectSql, [id])

    return NextResponse.json({
      success: true,
      data: result,
      count: result.length,
    })
  } catch (error) {
    console.error("[v0] Erro ao buscar dependentes:", error)
    return NextResponse.json(
      {
        success: false,
        message: "Erro ao buscar dependentes",
        error: error instanceof Error ? error.message : "Erro desconhecido",
      },
      { status: 500 },
    )
  }
}
