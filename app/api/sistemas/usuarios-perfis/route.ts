import { NextRequest, NextResponse } from "next/server"
import { query, transaction } from "@/back-end/lib/database"
import { apiAuthError, authErrorStatus, requireCadastroAccess } from "@/back-end/lib/api-auth"
import { recordCadastroAudit } from "@/back-end/lib/cadastro-audit"

export async function GET() {
  try {
    const { administradoraId } = await requireCadastroAccess("view")
    const users = await query(`
      SELECT u.id, COALESCE(u.nome_completo, u.nome) AS nome, u.email,
             COALESCE(u.tipo_usuario, 'usuario') AS "perfilLegado",
             COALESCE(json_agg(json_build_object('nome', up.perfil_nome, 'ativo', up.ativo)
               ORDER BY up.perfil_nome) FILTER (WHERE up.id IS NOT NULL), '[]') AS perfis
      FROM usuarios u
      LEFT JOIN sistema_usuario_perfis up ON up.usuario_id = u.id
        AND up.administradora_id = u.administradora_id AND up.ativo = TRUE
      WHERE u.administradora_id = $1 AND u.deleted_at IS NULL
      GROUP BY u.id, u.nome_completo, u.nome, u.email, u.tipo_usuario
      ORDER BY COALESCE(u.nome_completo, u.nome)
    `, [administradoraId])
    const profiles = await query(`
      SELECT DISTINCT perfil_nome AS nome
      FROM sistema_usuario_perfis
      WHERE administradora_id = $1 AND ativo = TRUE
      UNION SELECT DISTINCT COALESCE(tipo_usuario, 'usuario') FROM usuarios
      WHERE administradora_id = $1 AND deleted_at IS NULL
      ORDER BY nome
    `, [administradoraId])
    return NextResponse.json({ users, profiles })
  } catch (error) {
    const auth = apiAuthError(error)
    return NextResponse.json({ error: auth?.message || "Não foi possível carregar os vínculos." }, { status: auth?.status || 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const { administradoraId, userId } = await requireCadastroAccess("edit")
    const body = await request.json()
    const usuarioId = Number(body.usuarioId)
    const perfis = Array.isArray(body.perfis) ? [...new Set(body.perfis.map((perfil: unknown) => String(perfil).trim()).filter(Boolean))] : []
    if (!Number.isInteger(usuarioId) || usuarioId <= 0 || perfis.length === 0) {
      return NextResponse.json({ error: "Informe um usuário e ao menos um perfil." }, { status: 400 })
    }
    const user = await query("SELECT id FROM usuarios WHERE id = $1 AND administradora_id = $2 AND deleted_at IS NULL", [usuarioId, administradoraId])
    if (!user[0]) return NextResponse.json({ error: "Usuário não encontrado." }, { status: 404 })
    const previous = await query("SELECT perfil_nome FROM sistema_usuario_perfis WHERE usuario_id = $1 AND administradora_id = $2 AND ativo = TRUE ORDER BY perfil_nome", [usuarioId, administradoraId])
    const statements = [
      { text: "UPDATE sistema_usuario_perfis SET ativo = FALSE WHERE usuario_id = $1 AND administradora_id = $2", params: [usuarioId, administradoraId] },
      ...perfis.map((perfil) => ({
        text: `INSERT INTO sistema_usuario_perfis (administradora_id, usuario_id, perfil_nome, ativo)
               VALUES ($1, $2, $3, TRUE)
               ON CONFLICT (administradora_id, usuario_id, perfil_nome) DO UPDATE SET ativo = TRUE`,
        params: [administradoraId, usuarioId, perfil],
      })),
    ]
    await transaction(statements)
    await recordCadastroAudit({ administradoraId, userId, action: "permission_change", tableName: "sistema_usuario_perfis", recordId: usuarioId, before: previous.map((row) => row.perfil_nome), after: perfis })
    return NextResponse.json({ success: true, perfis })
  } catch (error) {
    return NextResponse.json({ error: "Não foi possível salvar os vínculos." }, { status: authErrorStatus(error) })
  }
}
