import { type NextRequest, NextResponse } from "next/server"
import { getAuthContext } from "@/lib/api-auth"
import { query } from "@/lib/database"

export async function POST(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const auth = await getAuthContext()
  if (!auth) return NextResponse.json({ error: "Não autenticado" }, { status: 401 })
  const faturaId = Number((await params).id)
  const body = await request.json().catch(() => ({}))
  const faturas = await query("SELECT id, status, valor_total, vencimento FROM faturas_mensais WHERE id = $1 AND administradora_id = $2 AND deleted_at IS NULL", [faturaId, auth.administradoraId])
  if (!faturas.length) return NextResponse.json({ error: "Fatura não encontrada" }, { status: 404 })
  const previous = await query("SELECT COALESCE(MAX(versao),0) AS versao FROM fatura_documentos WHERE fatura_id = $1 AND administradora_id = $2 AND meio = $3", [faturaId, auth.administradoraId, body.meio || "boleto"])
  const version = Number(previous[0]?.versao || 0) + 1
  const identifier = `${String(body.meio || "boleto").toUpperCase()}-${faturaId}-${version}-${Date.now()}`
  const documentRows = await query("INSERT INTO fatura_documentos (fatura_id, administradora_id, meio, versao, identificador, metadata) VALUES ($1,$2,$3,$4,$5,$6) RETURNING *", [faturaId, auth.administradoraId, body.meio || "boleto", version, identifier, JSON.stringify({ vencimento: body.vencimento || faturas[0].vencimento, origem: "segunda_via" })])
  await query("INSERT INTO fatura_eventos (fatura_id, administradora_id, tipo, status_anterior, status_novo, origem, payload, usuario_id) VALUES ($1,$2,'segunda_via', $3, $3, 'usuario', $4, $5)", [faturaId, auth.administradoraId, faturas[0].status, JSON.stringify({ meio: body.meio || "boleto", versao: version, identificador: identifier }), auth.userId])
  return NextResponse.json({ data: documentRows[0], message: "Segunda via gerada sem sobrescrever o documento anterior" }, { status: 201 })
}
