import { NextResponse } from "next/server"
import { query } from "@/back-end/lib/database"
import { authErrorStatus, getAuthContext } from "@/back-end/lib/api-auth"

export async function GET() {
  try {
    const context = await getAuthContext()
    if (!context) return NextResponse.json({ error: "Não autenticado" }, { status: 401 })
    const { administradoraId } = context
    const rows = await query(`
  SELECT m.id,
  m.slug,
  CASE WHEN m.slug IN ('inicio', 'dashboard') THEN 'Dashboard' WHEN m.slug = 'planos' THEN 'Planos Faixa' WHEN m.slug = 'agenciador' THEN 'Agenciadores' WHEN m.slug = 'perfis-usuario' THEN 'Perfis de usuário' ELSE m.titulo END AS titulo,
  CASE WHEN m.slug = 'planos' THEN '/dashboard/cadastros/planos-faixa' WHEN m.slug = 'perfis-usuario' THEN '/dashboard/sistema/perfis' ELSE m.rota END AS rota,
  CASE WHEN m.slug = 'planos' THEN 'file-spreadsheet' ELSE m.icone END AS icone, m.ordem,
  m.menu_pai_id AS "menuPaiId", mo.slug AS "moduloSlug", CASE WHEN mo.slug = 'inicio' THEN 'Dashboard' ELSE mo.nome END AS "moduloNome",
  COALESCE(mc.ativo_global, TRUE) AS "ativoGlobal"
      FROM sistemas_menus m
      JOIN sistemas_modulos mo ON mo.id = m.modulo_id
      LEFT JOIN sistema_menu_configuracoes mc ON mc.menu_id = m.id AND mc.administradora_id = $1
      WHERE m.ativo = TRUE AND mo.ativo = TRUE
    AND m.slug NOT IN ('cadastros', 'planos-saude', 'database-manager', 'subestipulante', 'subestipulantes')
    AND COALESCE(mc.ativo_global, TRUE) = TRUE
        AND NOT EXISTS (
          SELECT 1
          FROM sistemas_menus parent
          LEFT JOIN sistema_menu_configuracoes parent_config ON parent_config.menu_id = parent.id AND parent_config.administradora_id = $1
          WHERE parent.id = m.menu_pai_id AND COALESCE(parent_config.ativo_global, TRUE) = FALSE
        )

      ORDER BY CASE mo.slug WHEN 'inicio' THEN 1 WHEN 'cadastros' THEN 2 WHEN 'propostas' THEN 3 WHEN 'beneficiarios' THEN 4 WHEN 'cobranca' THEN 5 WHEN 'financeiro' THEN 6 WHEN 'tabelas' THEN 7 WHEN 'sistemas' THEN 8 ELSE 99 END, CASE WHEN mo.slug = 'cadastros' THEN CASE m.slug WHEN 'administradora' THEN 1 WHEN 'pessoas' THEN 2 WHEN 'operadora' THEN 3 WHEN 'estipulante' THEN 4 WHEN 'agenciador' THEN 5 WHEN 'corretor' THEN 6 WHEN 'produtos' THEN 7 WHEN 'planos' THEN 8 WHEN 'planos-faixa' THEN 9 ELSE 99 END ELSE m.ordem END, m.id
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
