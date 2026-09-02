import { type NextRequest, NextResponse } from "next/server"
import { query } from "@/lib/database"

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams
    const status = searchParams.get("status")
    const tipo_cobranca = searchParams.get("tipo_cobranca")
    const beneficiario_id = searchParams.get("beneficiario_id")

    const params: unknown[] = []
    const conditions: string[] = []
    if (status) { params.push(status); conditions.push(`status = $${params.length}`) }
    if (tipo_cobranca) { params.push(tipo_cobranca); conditions.push(`tipo_cobranca = $${params.length}`) }
    if (beneficiario_id) { params.push(Number.parseInt(beneficiario_id, 10)); conditions.push(`beneficiario_id = $${params.length}`) }
    const where = conditions.length ? ` WHERE ${conditions.join(" AND ")}` : ""
    const resultado = await query(`SELECT * FROM cobrancas${where} ORDER BY created_at DESC`, params)
    return NextResponse.json(resultado)
  } catch (error: any) {
    console.error("[v0] Erro ao buscar cobranças:", error)
    return NextResponse.json({ error: "Erro ao buscar cobranças", details: error.message }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()

    const rows = await query(`INSERT INTO cobrancas (administradora_id, beneficiario_id, conta_receber_id, tipo_cobranca, valor_original, valor_atual, responsavel_id, canal_contato, observacoes, historico) VALUES ($1,$2,$3,$4,$5,$5,$6,$7,$8,$9::jsonb) RETURNING id`, [body.administradora_id || 1, body.beneficiario_id || null, body.conta_receber_id || null, body.tipo_cobranca || "amigavel", body.valor_original || 0, body.responsavel_id || null, body.canal_contato || "email", body.observacoes || null, JSON.stringify([{ data: new Date().toISOString().split('T')[0], acao: "Início da cobrança", responsavel: "Sistema" }])])
    return NextResponse.json({ message: "Cobrança criada com sucesso", id: rows[0].id }, { status: 201 })

  } catch (error: any) {
    console.error("[v0] Erro ao criar cobrança:", error)
    return NextResponse.json({ error: "Erro ao criar cobrança", details: error.message }, { status: 500 })
  }
}
