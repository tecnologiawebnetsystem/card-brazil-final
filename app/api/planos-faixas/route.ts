import { type NextRequest, NextResponse } from "next/server"
import { query } from "@/lib/database"
import { apiAuthError, requireCadastroAccess } from "@/lib/api-auth"
import { apiError } from "@/lib/api-response"

export async function GET(request: NextRequest) {
  const { administradoraId } = await requireCadastroAccess("view")
  const planoId = request.nextUrl.searchParams.get("plano_id")
  const params = planoId ? [administradoraId, Number(planoId)] : [administradoraId]
  const where = planoId ? " WHERE p.administradora_id = $1 AND f.plano_id = $2" : " WHERE p.administradora_id = $1"
  const rows = await query(`SELECT f.*, p.nome AS plano_nome FROM planos_faixas_etarias f JOIN planos p ON p.id = f.plano_id${where} ORDER BY f.plano_id, f.id`, params)
  return NextResponse.json({ success: true, data: rows })
}

export async function POST(request: NextRequest) {
  const { administradoraId } = await requireCadastroAccess("create")
  const body = await request.json()
  let planoId = body.plano_id
  if (!planoId && body.plano_nome) {
    const planos = await query("SELECT id FROM planos WHERE nome = $1 AND administradora_id = $2 AND deleted_at IS NULL LIMIT 1", [body.plano_nome, administradoraId])
    planoId = planos[0]?.id
  }
  if (!planoId || body.idade_minima == null || body.idade_maxima == null || body.valor == null) return NextResponse.json({ success: false, message: "plano_id, idades e valor são obrigatórios" }, { status: 400 })
  const rows = await query("INSERT INTO planos_faixas_etarias (plano_id, idade_minima, idade_maxima, valor) SELECT $1,$2,$3,$4 WHERE EXISTS (SELECT 1 FROM planos WHERE id = $1 AND administradora_id = $5) RETURNING *", [planoId, body.idade_minima, body.idade_maxima, body.valor, administradoraId])
  return NextResponse.json({ success: true, data: rows[0] }, { status: 201 })
}
