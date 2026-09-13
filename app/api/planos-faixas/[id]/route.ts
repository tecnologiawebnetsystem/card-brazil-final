import { type NextRequest, NextResponse } from "next/server"
import { query } from "@/lib/database"
import { requireCadastroAccess, apiAuthError } from "@/lib/api-auth"

export async function PUT(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { administradoraId } = await requireCadastroAccess("update")
    const { id } = await params
    const body = await request.json()
    const rows = await query(
      `UPDATE planos_faixas_etarias f SET idade_minima=$1, idade_maxima=$2, valor=$3, updated_at=CURRENT_TIMESTAMP
       FROM planos p WHERE f.id=$4 AND f.plano_id=p.id AND p.administradora_id=$5 AND f.deleted_at IS NULL RETURNING f.*`,
      [body.idade_minima, body.idade_maxima, body.valor, Number(id), administradoraId],
    )
    return rows.length ? NextResponse.json({ success: true, data: rows[0] }) : NextResponse.json({ success: false, message: "Faixa não encontrada" }, { status: 404 })
  } catch (error) {
    const auth = apiAuthError(error)
    return NextResponse.json({ success: false, message: auth?.message || "Erro ao atualizar faixa" }, { status: auth?.status || 500 })
  }
}

export async function DELETE(_: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { administradoraId } = await requireCadastroAccess("delete")
    const { id } = await params
    const rows = await query(
      `UPDATE planos_faixas_etarias f SET deleted_at=CURRENT_TIMESTAMP, updated_at=CURRENT_TIMESTAMP, status='inativo'
       FROM planos p WHERE f.id=$1 AND f.plano_id=p.id AND p.administradora_id=$2 AND f.deleted_at IS NULL RETURNING f.id`,
      [Number(id), administradoraId],
    )
    return rows.length ? NextResponse.json({ success: true }) : NextResponse.json({ success: false, message: "Faixa não encontrada" }, { status: 404 })
  } catch (error) {
    const auth = apiAuthError(error)
    return NextResponse.json({ success: false, message: auth?.message || "Erro ao excluir faixa" }, { status: auth?.status || 500 })
  }
}
