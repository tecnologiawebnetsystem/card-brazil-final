import { NextRequest, NextResponse } from "next/server"
import { getAuthContext, hasPermission } from "@/lib/api-auth"
import { query, transaction } from "@/lib/database"

export async function GET(request: NextRequest) {
  const auth = await getAuthContext()
  if (!auth) return NextResponse.json({ error: "Não autenticado" }, { status: 401 })
  if (!hasPermission(auth, "cobranca", "view")) return NextResponse.json({ error: "Sem permissão para consultar inadimplência" }, { status: 403 })
  const status = request.nextUrl.searchParams.get("status")
  const rows = await query(
    `SELECT i.*, p.data_vencimento, p.valor_total, p.valor_pago, p.cobranca_id
       FROM inadimplencia_casos i
       JOIN cobranca_parcelas p ON p.id = i.parcela_id AND p.administradora_id = i.administradora_id
      WHERE i.administradora_id = $1
        AND ($2::text IS NULL OR i.status = $2)
      ORDER BY i.dias_atraso DESC, i.opened_at ASC
      LIMIT 200`,
    [auth.administradoraId, status],
  )
  return NextResponse.json({ data: rows })
}

export async function POST(request: NextRequest) {
  const auth = await getAuthContext()
  if (!auth) return NextResponse.json({ error: "Não autenticado" }, { status: 401 })
  if (!hasPermission(auth, "cobranca", "create")) return NextResponse.json({ error: "Sem permissão para registrar inadimplência" }, { status: 403 })
  const body = await request.json()
  const parcelaId = Number(body.parcela_id)
  if (!Number.isInteger(parcelaId) || parcelaId <= 0) return NextResponse.json({ error: "parcela_id é obrigatório" }, { status: 422 })

  const parcela = await query<{ id: number; data_vencimento: string; valor_total: number; valor_pago: number; status: string; cobranca_id: number | null }>(
    `SELECT id, data_vencimento, valor_total, valor_pago, status, cobranca_id
       FROM cobranca_parcelas
      WHERE id = $1 AND administradora_id = $2`,
    [parcelaId, auth.administradoraId],
  )
  if (!parcela.length) return NextResponse.json({ error: "Parcela não encontrada" }, { status: 404 })
  const saldo = Number(parcela[0].valor_total) - Number(parcela[0].valor_pago)
  const diasAtraso = Math.max(0, Math.floor((Date.now() - new Date(`${parcela[0].data_vencimento}T00:00:00Z`).getTime()) / 86400000))
  if (saldo <= 0 || diasAtraso <= 0 || ["paga", "cancelada", "renegociada"].includes(parcela[0].status)) return NextResponse.json({ error: "A parcela não caracteriza inadimplência" }, { status: 409 })

  const regra = await query<{ id: number; versao: number; dias_para_notificar: number; dias_para_procedimento: number | null }>(
    `SELECT id, versao, dias_para_notificar, dias_para_procedimento
       FROM regras_inadimplencia
      WHERE administradora_id = $1 AND ativo = true AND vigencia_inicio <= CURRENT_DATE AND (vigencia_fim IS NULL OR vigencia_fim >= CURRENT_DATE)
      ORDER BY vigencia_inicio DESC, versao DESC LIMIT 1`,
    [auth.administradoraId],
  )
  const regraAtual = regra[0] ?? null
  const caso = await transaction([{
    text: `INSERT INTO inadimplencia_casos (administradora_id, parcela_id, regra_id, status, dias_atraso, saldo, dados_considerados)
      VALUES ($1,$2,$3,'aberta',$4,$5,$6::jsonb)
      ON CONFLICT (administradora_id, parcela_id) DO UPDATE SET dias_atraso = EXCLUDED.dias_atraso, saldo = EXCLUDED.saldo, dados_considerados = EXCLUDED.dados_considerados
      RETURNING *`,
    params: [auth.administradoraId, parcelaId, regraAtual?.id ?? null, diasAtraso, saldo, JSON.stringify({ vencimento: parcela[0].data_vencimento, status_parcela: parcela[0].status, regra_id: regraAtual?.id ?? null, regra_versao: regraAtual?.versao ?? null })],
  }, {
    text: `INSERT INTO auditoria_inadimplencia (administradora_id, caso_id, regra_id, acao, dados_novos, usuario_id)
      SELECT $1, id, $3, 'caso_avaliado', $4::jsonb, $5 FROM inadimplencia_casos WHERE administradora_id = $1 AND parcela_id = $2`,
    params: [auth.administradoraId, parcelaId, regraAtual?.id ?? null, JSON.stringify({ dias_atraso: diasAtraso, saldo, notificacao_cabivel: regraAtual ? diasAtraso >= regraAtual.dias_para_notificar : false, procedimento_cabivel: regraAtual?.dias_para_procedimento ? diasAtraso >= regraAtual.dias_para_procedimento : false }), auth.userId],
  }])
  return NextResponse.json({ data: caso[0]?.[0], regra: regraAtual }, { status: 201 })
}
