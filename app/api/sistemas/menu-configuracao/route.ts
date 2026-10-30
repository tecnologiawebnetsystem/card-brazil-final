import { NextResponse } from "next/server"
import { query, transaction, type DatabaseStatement } from "@/back-end/lib/database"
import { getAuthContext, authErrorStatus } from "@/back-end/lib/api-auth"
import { createCadastroAuditStatement } from "@/back-end/lib/cadastro-audit"

function isAdmin(context: Awaited<ReturnType<typeof getAuthContext>>) {
  return Boolean(context && ["admin", "administrador"].includes(String(context.profile.tipo_usuario).toLowerCase()))
}

function forbidden() {
  return NextResponse.json({ error: "Apenas administradores podem configurar a navegação." }, { status: 403 })
}

export async function GET(request: Request) {
  try {
    const context = await getAuthContext()
    if (!context) return NextResponse.json({ error: "Não autenticado" }, { status: 401 })
    if (!isAdmin(context)) return forbidden()

    const url = new URL(request.url)
    if (url.searchParams.get("view") === "history") {
      const history = await query(`
        SELECT id, registro_id AS "registroId", acao, tabela,
               dados_anteriores AS "dadosAnteriores", dados_novos AS "dadosNovos", created_at AS "createdAt"
        FROM auditoria_cadastros
        WHERE administradora_id = $1 AND tabela = 'sistema_menu_configuracoes'
        ORDER BY created_at DESC, id DESC
        LIMIT 100
      `, [context.administradoraId])
      return NextResponse.json({ history })
    }

    const menus = await query(`
      SELECT m.id, m.slug, m.titulo, m.rota, m.icone, m.ordem,
             m.menu_pai_id AS "menuPaiId", m.modulo_id AS "moduloId",
             mo.slug AS "moduloSlug", mo.nome AS "moduloNome", mo.descricao AS "moduloDescricao",
             COALESCE(mc.ativo_global, TRUE) AS "ativoGlobal"
      FROM sistemas_menus m
      JOIN sistemas_modulos mo ON mo.id = m.modulo_id
      LEFT JOIN sistema_menu_configuracoes mc ON mc.menu_id = m.id AND mc.administradora_id = $1
      WHERE m.ativo = TRUE AND mo.ativo = TRUE
      ORDER BY mo.ordem, m.ordem, m.id
    `, [context.administradoraId])
    const modules = await query(`
      SELECT mo.id, mo.slug, mo.nome, mo.descricao, mo.ordem,
             COUNT(m.id)::int AS "totalMenus",
             COUNT(m.id) FILTER (WHERE COALESCE(mc.ativo_global, TRUE))::int AS "activeMenus"
      FROM sistemas_modulos mo
      LEFT JOIN sistemas_menus m ON m.modulo_id = mo.id AND m.ativo = TRUE
      LEFT JOIN sistema_menu_configuracoes mc ON mc.menu_id = m.id AND mc.administradora_id = $1
      WHERE mo.ativo = TRUE
      GROUP BY mo.id
      ORDER BY mo.ordem, mo.id
    `, [context.administradoraId])
    return NextResponse.json({ menus, modules })
  } catch (error) {
    return NextResponse.json({ error: "Não foi possível carregar a configuração da navegação." }, { status: authErrorStatus(error) })
  }
}

export async function POST(request: Request) {
  try {
    const context = await getAuthContext()
    if (!context) return NextResponse.json({ error: "Não autenticado" }, { status: 401 })
    if (!isAdmin(context)) return forbidden()
    const body = await request.json()
    const requestedItems = Array.isArray(body.items)
      ? body.items
      : Number.isInteger(Number(body.menuId)) && typeof body.ativoGlobal === "boolean"
        ? [{ menuId: Number(body.menuId), ativoGlobal: body.ativoGlobal }]
        : []

    let items = requestedItems
      .map((item: { menuId?: unknown; ativoGlobal?: unknown }) => ({ menuId: Number(item.menuId), ativoGlobal: item.ativoGlobal }))
      .filter((item: { menuId: number; ativoGlobal: unknown }) => Number.isInteger(item.menuId) && item.menuId > 0 && typeof item.ativoGlobal === "boolean")

    if (Number.isInteger(Number(body.moduleId)) && typeof body.ativoGlobal === "boolean") {
      const moduleMenus = await query<{ id: number }>("SELECT id FROM sistemas_menus WHERE modulo_id = $1 AND ativo = TRUE", [Number(body.moduleId)])
      items = moduleMenus.map((menu) => ({ menuId: menu.id, ativoGlobal: body.ativoGlobal }))
    }
    const uniqueItems: Array<{ menuId: number; ativoGlobal: boolean }> = Array.from(new Map<number, { menuId: number; ativoGlobal: boolean }>(items.map((item: { menuId: number; ativoGlobal: boolean }) => [item.menuId, item])).values())
    if (uniqueItems.length === 0 || uniqueItems.length > 250) return NextResponse.json({ error: "Informe entre 1 e 250 itens válidos." }, { status: 400 })

    const ids = uniqueItems.map((item: { menuId: number }) => item.menuId)
    const current = await query<{ id: number; titulo: string; ativoGlobal: boolean }>(`
      SELECT m.id, m.titulo, COALESCE(mc.ativo_global, TRUE) AS "ativoGlobal"
      FROM sistemas_menus m
      JOIN sistemas_modulos mo ON mo.id = m.modulo_id AND mo.ativo = TRUE
      LEFT JOIN sistema_menu_configuracoes mc ON mc.menu_id = m.id AND mc.administradora_id = $1
      WHERE m.id = ANY($2::int[]) AND m.ativo = TRUE
    `, [context.administradoraId, ids])
    const currentById = new Map(current.map((item) => [item.id, item]))
    const statements: DatabaseStatement[] = []
    const changed: number[] = []
    for (const item of uniqueItems) {
      const previous = currentById.get(item.menuId)
      if (!previous || previous.ativoGlobal === item.ativoGlobal) continue
      statements.push({ text: `INSERT INTO sistema_menu_configuracoes (administradora_id, menu_id, ativo_global, atualizado_por) VALUES ($1, $2, $3, $4) ON CONFLICT (administradora_id, menu_id) DO UPDATE SET ativo_global = EXCLUDED.ativo_global, atualizado_por = EXCLUDED.atualizado_por, updated_at = CURRENT_TIMESTAMP`, params: [context.administradoraId, item.menuId, item.ativoGlobal, context.userId] })
      statements.push(createCadastroAuditStatement({ administradoraId: context.administradoraId, userId: context.userId, action: "parameter_change", tableName: "sistema_menu_configuracoes", recordId: item.menuId, before: { ativoGlobal: previous.ativoGlobal, titulo: previous.titulo }, after: { ativoGlobal: item.ativoGlobal, titulo: previous.titulo } }))
      changed.push(item.menuId)
    }
    if (statements.length > 0) await transaction(statements)
    return NextResponse.json({ ok: true, updated: changed.length, menuIds: changed })
  } catch (error) {
    return NextResponse.json({ error: "Não foi possível salvar a configuração da navegação." }, { status: authErrorStatus(error) })
  }
}

export async function DELETE() {
  try {
    const context = await getAuthContext()
    if (!context) return NextResponse.json({ error: "Não autenticado" }, { status: 401 })
    if (!isAdmin(context)) return forbidden()
    const current = await query<{ menuId: number; ativoGlobal: boolean }>(`SELECT menu_id AS "menuId", ativo_global AS "ativoGlobal" FROM sistema_menu_configuracoes WHERE administradora_id = $1`, [context.administradoraId])
    const statements: DatabaseStatement[] = [{ text: "DELETE FROM sistema_menu_configuracoes WHERE administradora_id = $1", params: [context.administradoraId] }]
    for (const item of current) statements.push(createCadastroAuditStatement({ administradoraId: context.administradoraId, userId: context.userId, action: "parameter_change", tableName: "sistema_menu_configuracoes", recordId: item.menuId, before: { ativoGlobal: item.ativoGlobal }, after: { ativoGlobal: true, restored: true } }))
    if (statements.length > 1) await transaction(statements)
    return NextResponse.json({ ok: true, restored: current.length })
  } catch (error) {
    return NextResponse.json({ error: "Não foi possível restaurar a configuração padrão." }, { status: authErrorStatus(error) })
  }
}
