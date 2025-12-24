import { type NextRequest, NextResponse } from "next/server"
import { pool } from "@/lib/database"

export async function GET(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const id = params.id

    const [rows] = await pool.execute(
      `SELECT 
        pj.*,
        b.nome as beneficiario_nome,
        p.nome as pessoa_nome,
        p.cpf,
        p.telefone,
        p.email,
        a.nome as advogado_nome,
        a.oab,
        a.oab_uf,
        a.telefone as advogado_telefone,
        a.email as advogado_email,
        t.nome as tribunal_nome,
        t.sigla as tribunal_sigla,
        t.tipo as tribunal_tipo,
        cr.numero_documento as conta_receber_documento,
        cr.valor_total as conta_receber_valor
      FROM processos_judiciais pj
      INNER JOIN beneficiarios b ON pj.beneficiario_id = b.id
      INNER JOIN pessoas p ON b.pessoa_id = p.id
      LEFT JOIN advogados a ON pj.advogado_id = a.id
      LEFT JOIN tribunais t ON pj.tribunal_id = t.id
      LEFT JOIN contas_receber cr ON pj.conta_receber_id = cr.id
      WHERE pj.id = ? AND pj.deleted_at IS NULL`,
      [id],
    )

    if (rows.length === 0) {
      return NextResponse.json({ error: "Processo não encontrado" }, { status: 404 })
    }

    return NextResponse.json(rows[0])
  } catch (error: any) {
    console.error("[v0] Erro ao buscar processo:", error)
    return NextResponse.json({ error: "Erro ao buscar processo", details: error.message }, { status: 500 })
  }
}

export async function PUT(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const id = params.id
    const body = await request.json()

    // Se historico for array, converter para JSON
    if (body.historico && Array.isArray(body.historico)) {
      body.historico = JSON.stringify(body.historico)
    }

    const keys = Object.keys(body)
    const values = Object.values(body)
    const setClause = keys.map((key) => `${key} = ?`).join(", ")

    const [result] = await pool.execute(`UPDATE processos_judiciais SET ${setClause} WHERE id = ?`, [...values, id])

    if (result.affectedRows === 0) {
      return NextResponse.json({ error: "Processo não encontrado" }, { status: 404 })
    }

    return NextResponse.json({ message: "Processo atualizado com sucesso" })
  } catch (error: any) {
    console.error("[v0] Erro ao atualizar processo:", error)
    return NextResponse.json({ error: "Erro ao atualizar processo", details: error.message }, { status: 500 })
  }
}

export async function DELETE(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const id = params.id

    const [result] = await pool.execute(`UPDATE processos_judiciais SET deleted_at = NOW() WHERE id = ?`, [id])

    if (result.affectedRows === 0) {
      return NextResponse.json({ error: "Processo não encontrado" }, { status: 404 })
    }

    return NextResponse.json({ message: "Processo excluído com sucesso" })
  } catch (error: any) {
    console.error("[v0] Erro ao excluir processo:", error)
    return NextResponse.json({ error: "Erro ao excluir processo", details: error.message }, { status: 500 })
  }
}
