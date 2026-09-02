import { type NextRequest, NextResponse } from "next/server"
import { query } from "@/lib/database"

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams
    const status = searchParams.get("status")
    const tipo_cobranca = searchParams.get("tipo_cobranca")
    const beneficiario_id = searchParams.get("beneficiario_id")
    const limit = Math.min(Math.max(Number.parseInt(searchParams.get("limit") || "50", 10) || 50, 1), 100)
    const offset = Math.max(Number.parseInt(searchParams.get("offset") || "0", 10) || 0, 0)

    const params: unknown[] = []
    const conditions: string[] = []
    if (status) { params.push(status); conditions.push(`status = $${params.length}`) }
    if (tipo_cobranca) { params.push(tipo_cobranca); conditions.push(`tipo_cobranca = $${params.length}`) }
    if (beneficiario_id) { params.push(Number.parseInt(beneficiario_id, 10)); conditions.push(`beneficiario_id = $${params.length}`) }
    const where = conditions.length ? ` WHERE ${conditions.join(" AND ")}` : ""
    params.push(limit, offset)
    const resultado = await query(`SELECT * FROM cobrancas${where} ORDER BY created_at DESC LIMIT $${params.length - 1} OFFSET $${params.length}`, params)
    return NextResponse.json({ data: resultado, pagination: { limit, offset, count: resultado.length } })
  } catch (error: any) {
    console.error("[v0] Erro ao buscar cobranças:", error)
    return NextResponse.json({ error: "Erro ao buscar cobranças" }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const valorOriginal = Number(body.valor_original)
    if (!Number.isFinite(valorOriginal) || valorOriginal < 0) {
      return NextResponse.json({ error: "valor_original deve ser um número não negativo" }, { status: 422 })
    }

    const rows = await query(`INSERT INTO cobrancas (administradora_id, beneficiario_id, conta_receber_id, tipo_cobranca, valor_original, valor_atual, responsavel_id, canal_contato, observacoes, historico) VALUES ($1,$2,$3,$4,$5,$5,$6,$7,$8,$9::jsonb) RETURNING id`, [body.administradora_id || 1, body.beneficiario_id || null, body.conta_receber_id || null, body.tipo_cobranca || "amigavel", valorOriginal, body.responsavel_id || null, body.canal_contato || "email", body.observacoes || null, JSON.stringify([{ data: new Date().toISOString().split('T')[0], acao: "Início da cobrança", responsavel: "Sistema" }])])
    return NextResponse.json({ message: "Cobrança criada com sucesso", id: rows[0].id }, { status: 201 })

  } catch (error: any) {
    console.error("[v0] Erro ao criar cobrança:", error)
    return NextResponse.json({ error: "Erro ao criar cobrança" }, { status: 500 })
  }
}
