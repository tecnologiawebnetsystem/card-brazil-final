import { NextResponse } from "next/server"
import { query } from "@/back-end/lib/database"
import { authErrorStatus, getAuthContext } from "@/back-end/lib/api-auth"

export async function GET() {
  try {
    const context = await getAuthContext()
    if (!context) return NextResponse.json({ error: "Não autenticado" }, { status: 401 })
    const { administradoraId } = context
    const rows = await query(`
  SELECT m.id, m.slug, m.titulo, m.rota, m.icone, m.ordem,
  m.menu_pai_id AS "menuPaiId", mo.slug AS "moduloSlug", mo.nome AS "moduloNome",
  COALESCE(mc.ativo_global, TRUE) AS "ativoGlobal"
      FROM sistemas_menus m
      JOIN sistemas_modulos mo ON mo.id = m.modulo_id
      LEFT JOIN sistema_menu_configuracoes mc ON mc.menu_id = m.id AND mc.administradora_id = $1
      WHERE m.ativo = TRUE AND mo.ativo = TRUE
    AND m.slug NOT IN ('cadastros', 'planos-saude', 'database-manager')
    AND COALESCE(mc.ativo_global, TRUE) = TRUE
        AND NOT EXISTS (
          SELECT 1
          FROM sistemas_menus parent
          LEFT JOIN sistema_menu_configuracoes parent_config ON parent_config.menu_id = parent.id AND parent_config.administradora_id = $1
          WHERE parent.id = m.menu_pai_id AND COALESCE(parent_config.ativo_global, TRUE) = FALSE
        )

      ORDER BY mo.ordem, m.ordem, m.id
    `, [administradoraId])
    return NextResponse.json({
      menus: rows,
      meta: {
        administradoraId,
        activeMenuCount: rows.length,
      },
    })
  } catch (error) {
    return NextResponse.json({ error: "Não foi possível carregar o menu parametrizado." }, { status: authErrorStatus(error) })
  }
}
