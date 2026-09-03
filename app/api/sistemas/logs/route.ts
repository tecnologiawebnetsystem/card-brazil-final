import { NextResponse } from "next/server"
import { query } from "@/lib/database"

export async function GET() {
  try {
    const logs = await query(`
      SELECT a.id, a.created_at AS timestamp,
             COALESCE(u.nome_completo, 'Sistema') AS usuario,
             a.acao AS action, COALESCE(a.ip_address, '—') AS ip,
             CASE WHEN a.acao = 'erro' THEN 'Falha' ELSE 'Sucesso' END AS status,
             CASE WHEN a.acao = 'erro' THEN 'Alto' WHEN a.acao IN ('login','logout') THEN 'Info' ELSE 'Médio' END AS severity,
             CONCAT('Tabela: ', a.tabela, CASE WHEN a.registro_id IS NULL THEN '' ELSE CONCAT(' · Registro ', a.registro_id) END) AS details
      FROM auditoria a
      LEFT JOIN usuarios u ON u.id = a.usuario_id
      ORDER BY a.created_at DESC
      LIMIT 500
    `)
    return NextResponse.json(logs)
  } catch (error) {
    console.error("[v0] Erro ao carregar logs de segurança", error)
    return NextResponse.json({ error: "Não foi possível carregar os logs reais." }, { status: 500 })
  }
}
