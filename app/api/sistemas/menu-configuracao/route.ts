import { NextResponse } from "next/server"
import { query } from "@/lib/database"
import { getAuthContext, authErrorStatus } from "@/lib/api-auth"

function isAdmin(context: Awaited<ReturnType<typeof getAuthContext>>) {
  return Boolean(context && ["admin", "administrador"].includes(String(context.profile.tipo_usuario).toLowerCase()))
}

export async function GET() {
  try {
    const context = await getAuthContext()
    if (!context) return NextResponse.json({ error: "Não autenticado" }, { status: 401 })
    if (!isAdmin(context)) return NextResponse.json({ error: "Apenas administradores podem configurar o menu." }, { status: 403 })
    const menus = await query(`
      SELECT m.id, m.slug, m.titulo, m.rota, m.icone, m.ordem,
             mo.nome AS modulo_nome,
             COALESCE(mc.ativo_global, TRUE) AS ativo_global
      FROM sistemas_menus m
      JOIN sistemas_modulos mo ON mo.id = m.modulo_id
      LEFT JOIN sistema_menu_configuracoes mc ON mc.menu_id = m.id AND mc.administradora_id = $1
      WHERE mo.ativo = TRUE
      ORDER BY mo.ordem, m.ordem, m.id
    `, [context.administradoraId])
    return NextResponse.json({ menus })
  } catch (error) {
    return NextResponse.json({ error: "Não foi possível carregar a configuração global dos menus." }, { status: authErrorStatus(error) })
  }
}

export async function POST(request: Request) {
  try {
    const context = await getAuthContext()
    if (!context) return NextResponse.json({ error: "Não autenticado" }, { status: 401 })
    if (!isAdmin(context)) return NextResponse.json({ error: "Apenas administradores podem configurar o menu." }, { status: 403 })
    const body = await request.json()
    const menuId = Number(body.menuId)
    if (!Number.isInteger(menuId) || menuId <= 0 || typeof body.ativoGlobal !== "boolean") {
      return NextResponse.json({ error: "Menu e status global são obrigatórios." }, { status: 400 })
    }
    await query(`
      INSERT INTO sistema_menu_configuracoes (administradora_id, menu_id, ativo_global, atualizado_por)
      SELECT $1, m.id, $3, $4 FROM sistemas_menus m WHERE m.id = $2
      ON CONFLICT (administradora_id, menu_id) DO UPDATE SET ativo_global = EXCLUDED.ativo_global, atualizado_por = EXCLUDED.atualizado_por, updated_at = CURRENT_TIMESTAMP
    `, [context.administradoraId, menuId, body.ativoGlobal, context.userId])
    return NextResponse.json({ ok: true })
  } catch (error) {
    return NextResponse.json({ error: "Não foi possível atualizar o menu." }, { status: authErrorStatus(error) })
  }
}
