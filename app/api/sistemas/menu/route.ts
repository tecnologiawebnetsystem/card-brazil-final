import { NextResponse } from "next/server"
import { query } from "@/back-end/lib/database"
import { requireCadastroAccess, authErrorStatus } from "@/back-end/lib/api-auth"

export async function GET() {
  try {
    const { administradoraId, userId } = await requireCadastroAccess("view")
    const rows = await query(`
      SELECT m.id, m.slug, m.titulo, m.rota, m.icone, m.ordem,
             m.menu_pai_id AS "menuPaiId", mo.slug AS "moduloSlug", mo.nome AS "moduloNome"
      FROM sistemas_menus m
      JOIN sistemas_modulos mo ON mo.id = m.modulo_id
      LEFT JOIN sistema_menu_configuracoes mc ON mc.menu_id = m.id AND mc.administradora_id = $2
      WHERE m.ativo = TRUE AND mo.ativo = TRUE AND COALESCE(mc.ativo_global, TRUE) = TRUE
        AND NOT EXISTS (
          SELECT 1 FROM sistema_menu_perfis mp
          JOIN sistema_usuario_perfis up ON up.administradora_id = mp.administradora_id
            AND up.perfil_nome = mp.perfil_nome AND up.usuario_id = $1 AND up.ativo = TRUE
          WHERE mp.administradora_id = $2 AND mp.menu_id = m.id AND mp.permitido = FALSE
        )
      ORDER BY mo.ordem, m.ordem, m.id
    `, [userId, administradoraId])
    return NextResponse.json({ menus: rows })
  } catch (error) {
    return NextResponse.json({ error: "Não foi possível carregar o menu parametrizado." }, { status: authErrorStatus(error) })
  }
}
