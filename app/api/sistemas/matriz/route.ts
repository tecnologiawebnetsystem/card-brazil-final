import { NextRequest, NextResponse } from "next/server"
import { query, transaction } from "@/back-end/lib/database"
import { apiAuthError, authErrorStatus, requireCadastroAccess } from "@/back-end/lib/api-auth"
import { recordCadastroAudit } from "@/back-end/lib/cadastro-audit"

export async function GET() {
  try {
    const { administradoraId } = await requireCadastroAccess("view")
    const [profiles, resources, actions, grants] = await Promise.all([
      query(`SELECT DISTINCT perfil_nome AS nome FROM sistema_usuario_perfis WHERE administradora_id = $1 AND ativo = TRUE UNION SELECT DISTINCT COALESCE(tipo_usuario, 'usuario') FROM usuarios WHERE administradora_id = $1 AND deleted_at IS NULL ORDER BY nome`, [administradoraId]),
      query(`SELECT id, slug, nome FROM sistemas_recursos WHERE ativo = TRUE ORDER BY nome`),
      query(`SELECT id, slug, nome FROM sistemas_acoes WHERE ativo = TRUE ORDER BY ordem, nome`),
      query(`SELECT p.perfil_nome, r.slug AS recurso, a.slug AS acao, p.permitido FROM sistema_perfil_permissoes p JOIN sistemas_recursos r ON r.id = p.recurso_id JOIN sistemas_acoes a ON a.id = p.acao_id WHERE p.administradora_id = $1`, [administradoraId]),
    ])
    return NextResponse.json({ profiles, resources, actions, grants })
  } catch (error) {
    const auth = apiAuthError(error)
    return NextResponse.json({ error: auth?.message || "Não foi possível carregar a matriz." }, { status: auth?.status || 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const { administradoraId, userId } = await requireCadastroAccess("edit")
    const body = await request.json()
    const perfil = String(body.perfil || "").trim()
    const grants = Array.isArray(body.grants) ? body.grants : []
    if (!perfil) return NextResponse.json({ error: "Perfil inválido." }, { status: 400 })
    const valid: [string, string, boolean][] = grants.filter((item: any) => item?.recurso && item?.acao).map((item: any) => [String(item.recurso), String(item.acao), item.permitido !== false])
    const resources = await query("SELECT id, slug FROM sistemas_recursos WHERE ativo = TRUE AND slug = ANY($1::text[])", [valid.map((item) => item[0])])
    const actions = await query("SELECT id, slug FROM sistemas_acoes WHERE ativo = TRUE AND slug = ANY($1::text[])", [valid.map((item) => item[1])])
    const resourceMap = new Map(resources.map((item) => [item.slug, item.id]))
    const actionMap = new Map(actions.map((item) => [item.slug, item.id]))
    const previous = await query("SELECT recurso_id, acao_id, permitido FROM sistema_perfil_permissoes WHERE administradora_id = $1 AND perfil_nome = $2", [administradoraId, perfil])
    const statements = [{ text: "DELETE FROM sistema_perfil_permissoes WHERE administradora_id = $1 AND perfil_nome = $2", params: [administradoraId, perfil] }, ...valid.filter((item) => resourceMap.has(item[0]) && actionMap.has(item[1])).map((item) => ({ text: `INSERT INTO sistema_perfil_permissoes (administradora_id, perfil_nome, recurso_id, acao_id, permitido) VALUES ($1, $2, $3, $4, $5)`, params: [administradoraId, perfil, resourceMap.get(item[0]), actionMap.get(item[1]), item[2]] }))]
    await transaction(statements)
    await recordCadastroAudit({ administradoraId, userId, action: "permission_change", tableName: "sistema_perfil_permissoes", recordId: 0, before: previous, after: valid })
    return NextResponse.json({ success: true })
  } catch (error) {
    return NextResponse.json({ error: "Não foi possível salvar a matriz." }, { status: authErrorStatus(error) })
  }
}
