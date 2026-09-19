import { type NextRequest, NextResponse } from "next/server"
import { getAuthContext } from "@/lib/api-auth"
import { query } from "@/lib/database"

export async function GET(request: NextRequest) {
  const auth = await getAuthContext()
  if (!auth) return NextResponse.json({ error: "Não autenticado" }, { status: 401 })
  const tipo = request.nextUrl.searchParams.get("tipo")
  const params: unknown[] = [auth.administradoraId]
  const where = tipo ? " AND tipo = $2" : ""
  if (tipo) params.push(tipo)
  return NextResponse.json({ data: await query(`SELECT * FROM arquivos_bancarios WHERE administradora_id = $1${where} ORDER BY created_at DESC`, params) })
}

export async function POST(request: NextRequest) {
  const auth = await getAuthContext()
  if (!auth) return NextResponse.json({ error: "Não autenticado" }, { status: 401 })
  const body = await request.json()
  if (!["remessa", "retorno"].includes(body.tipo) || !body.meio || !body.nome_arquivo) return NextResponse.json({ error: "Tipo, meio e nome do arquivo são obrigatórios" }, { status: 422 })
  const rows = await query("INSERT INTO arquivos_bancarios (administradora_id, configuracao_id, template_id, tipo, meio, nome_arquivo, conteudo, status, total_itens, valor_total, resumo) VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11) RETURNING *", [auth.administradoraId, body.configuracao_id || null, body.template_id || null, body.tipo, body.meio, body.nome_arquivo, body.conteudo || null, body.status || "recebido", Number(body.total_itens || 0), Number(body.valor_total || 0), JSON.stringify(body.resumo || {})])
  return NextResponse.json({ data: rows[0] }, { status: 201 })
}

export async function DELETE(request: NextRequest) {
  const auth = await getAuthContext()
  if (!auth) return NextResponse.json({ error: "Não autenticado" }, { status: 401 })
  const id = Number(request.nextUrl.searchParams.get("id"))
  const rows = await query("UPDATE arquivos_bancarios SET status = 'cancelado' WHERE id = $1 AND administradora_id = $2 RETURNING id", [id, auth.administradoraId])
  if (!rows.length) return NextResponse.json({ error: "Arquivo não encontrado" }, { status: 404 })
  return NextResponse.json({ message: "Arquivo cancelado" })
}
