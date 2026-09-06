import { NextRequest, NextResponse } from "next/server"
import { cookies } from "next/headers"
import { AuthService } from "@/lib/auth-service"
import { query, queryOne } from "@/lib/database"

const fallback = { tema: "cardbrazil", fundo: "#f5f7fa", menu: "#103f64" }

async function getUserId() {
  const token = (await cookies()).get("auth-token")?.value
  const session = token ? await AuthService.verifyToken(token) : null
  return session?.userId ? Number(session.userId) : null
}

async function ensureTable() {
  await query(`CREATE TABLE IF NOT EXISTS preferencias_tema_usuario (usuario_id INTEGER PRIMARY KEY REFERENCES usuarios(id) ON DELETE CASCADE, tema VARCHAR(40) NOT NULL DEFAULT 'cardbrazil', fundo VARCHAR(7) NOT NULL DEFAULT '#f5f7fa', menu VARCHAR(7) NOT NULL DEFAULT '#103f64', updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP)`)
}

export async function GET() {
  const usuarioId = await getUserId()
  if (!usuarioId) return NextResponse.json({ success: false, message: "Não autenticado" }, { status: 401 })
  try {
    await ensureTable()
    const preferencia = await queryOne(`SELECT tema, fundo, menu FROM preferencias_tema_usuario WHERE usuario_id = $1`, [usuarioId])
    return NextResponse.json({ success: true, data: preferencia || fallback })
  } catch { return NextResponse.json({ success: true, data: fallback }) }
}

export async function PUT(request: NextRequest) {
  const usuarioId = await getUserId()
  if (!usuarioId) return NextResponse.json({ success: false, message: "Não autenticado" }, { status: 401 })
  const body = await request.json()
  const values = { tema: String(body.tema || fallback.tema), fundo: String(body.fundo || fallback.fundo), menu: String(body.menu || fallback.menu) }
  if (!/^#[0-9a-f]{6}$/i.test(values.fundo) || !/^#[0-9a-f]{6}$/i.test(values.menu)) return NextResponse.json({ success: false, message: "Cores inválidas" }, { status: 400 })
  try {
    await ensureTable()
    const rows = await query(`INSERT INTO preferencias_tema_usuario (usuario_id, tema, fundo, menu) VALUES ($1,$2,$3,$4) ON CONFLICT (usuario_id) DO UPDATE SET tema = EXCLUDED.tema, fundo = EXCLUDED.fundo, menu = EXCLUDED.menu, updated_at = CURRENT_TIMESTAMP RETURNING tema, fundo, menu`, [usuarioId, values.tema, values.fundo, values.menu])
    return NextResponse.json({ success: true, data: rows[0] })
  } catch { return NextResponse.json({ success: false, message: "Não foi possível salvar o tema" }, { status: 500 }) }
}
