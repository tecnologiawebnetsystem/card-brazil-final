import { type NextRequest, NextResponse } from "next/server"
import { query } from "@/lib/database"

export async function GET(request: NextRequest) {
  try {
    const pendentes = await query(`SELECT * FROM propostas WHERE status IN ('pendente', 'em_analise') ORDER BY created_at DESC NULLS LAST`)

    return NextResponse.json({
      success: true,
      data: pendentes,
      count: pendentes.length,
    })
  } catch (error: any) {
    console.error("[v0] Erro ao buscar propostas pendentes:", error)
    return NextResponse.json({ error: "Erro ao buscar propostas pendentes", details: error.message }, { status: 500 })
  }
}
