import { NextResponse } from "next/server"
import { query } from "@/lib/database"

export async function GET() {
  try {
    const rows = await query(`SELECT id, tipo, status, registros_enviados, registros_recebidos, mensagem, iniciado_em, finalizado_em, created_at, updated_at FROM ans_sincronizacoes ORDER BY created_at DESC LIMIT 50`)
    return NextResponse.json(rows)
  } catch (error) {
    console.error("[v0] Erro ao consultar sincronizações ANS:", error)
    return NextResponse.json({ error: "Não foi possível carregar o histórico ANS." }, { status: 500 })
  }
}

export async function POST() {
  try {
    const rows = await query(`INSERT INTO ans_sincronizacoes (tipo, status, iniciado_em) VALUES ($1, $2, CURRENT_TIMESTAMP) RETURNING id, tipo, status, registros_enviados, registros_recebidos, mensagem, iniciado_em, finalizado_em, created_at`, ["manual", "em_andamento"])
    return NextResponse.json(rows[0], { status: 201 })
  } catch (error) {
    console.error("[v0] Erro ao iniciar sincronização ANS:", error)
    return NextResponse.json({ error: "Não foi possível iniciar a sincronização ANS." }, { status: 500 })
  }
}

export async function PATCH(request: Request) {
  try {
    const body = await request.json()
    const id = Number(body.id)
    if (!Number.isInteger(id) || !body.status) return NextResponse.json({ error: "id e status são obrigatórios." }, { status: 400 })
    const rows = await query(`UPDATE ans_sincronizacoes SET status = $1, registros_enviados = COALESCE($2, registros_enviados), registros_recebidos = COALESCE($3, registros_recebidos), mensagem = $4, finalizado_em = CASE WHEN $1 IN ('sucesso', 'erro') THEN CURRENT_TIMESTAMP ELSE finalizado_em END, updated_at = CURRENT_TIMESTAMP WHERE id = $5 RETURNING *`, [body.status, body.registros_enviados ?? null, body.registros_recebidos ?? null, body.mensagem ?? null, id])
    if (!rows.length) return NextResponse.json({ error: "Sincronização não encontrada." }, { status: 404 })
    return NextResponse.json(rows[0])
  } catch (error) {
    console.error("[v0] Erro ao atualizar sincronização ANS:", error)
    return NextResponse.json({ error: "Não foi possível atualizar a sincronização ANS." }, { status: 500 })
  }
}
