import { NextResponse } from "next/server"
import { authErrorStatus, requireFinanceiroAccess } from "@/lib/api-auth"
import { query } from "@/lib/database"

export async function GET() {
  try {
    const { administradoraId } = await requireFinanceiroAccess("view")
    const logs = await query(`
      SELECT a.id, a.created_at AS timestamp,
             COALESCE(u.nome_completo, 'Sistema') AS usuario,
             a.acao AS action,
             CASE WHEN a.acao IN ('reject', 'delete') THEN 'Alto' ELSE 'Info' END AS severity,
             CASE WHEN a.acao IN ('reject', 'delete') THEN 'Atenção' ELSE 'Sucesso' END AS status,
             CONCAT('Tabela: ', a.tabela, ' · Registro ', a.registro_id) AS details
      FROM auditoria_cadastros a
      LEFT JOIN usuarios u ON u.id = a.usuario_id
      WHERE a.administradora_id = $1
      ORDER BY a.created_at DESC
      LIMIT 500
    `, [administradoraId])
    return NextResponse.json(logs)
  } catch (error) {
    console.error("[v0] Erro ao carregar logs de segurança", error)
    return NextResponse.json({ error: "Não foi possível carregar os logs reais." }, { status: authErrorStatus(error) })
  }
}
