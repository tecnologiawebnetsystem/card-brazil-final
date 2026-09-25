import { NextResponse } from "next/server"
import { query } from "@/lib/database"
import { authErrorStatus, requireCadastroAccess } from "@/lib/api-auth"

export async function GET() {
  try {
    const { administradoraId } = await requireCadastroAccess("view")
    const [beneficiarios, propostas, recebiveis, pagamentos, contratos, usuarios] = await Promise.all([
      query<{ total: string; ativos: string; titulares: string; dependentes: string }>(`SELECT COUNT(*)::int AS total, COUNT(*) FILTER (WHERE status = 'ativo')::int AS ativos, COUNT(*) FILTER (WHERE tipo_beneficiario = 'titular')::int AS titulares, COUNT(*) FILTER (WHERE tipo_beneficiario = 'dependente')::int AS dependentes FROM beneficiarios WHERE administradora_id = $1`, [administradoraId]),
      query<{ total: string; pendentes: string; aprovadas: string; rejeitadas: string }>(`SELECT COUNT(*)::int AS total, COUNT(*) FILTER (WHERE status IN ('pendente','em_analise'))::int AS pendentes, COUNT(*) FILTER (WHERE status = 'aprovada')::int AS aprovadas, COUNT(*) FILTER (WHERE status = 'rejeitada')::int AS rejeitadas FROM propostas WHERE administradora_id = $1 AND deleted_at IS NULL`, [administradoraId]),
      query<{ aberto: string; vencido: string; recebido: string }>(`SELECT COALESCE(SUM(valor_total) FILTER (WHERE status IN ('pendente','vencida')),0)::numeric AS aberto, COALESCE(SUM(valor_total) FILTER (WHERE status = 'vencida'),0)::numeric AS vencido, COALESCE(SUM(valor_pago),0)::numeric AS recebido FROM contas_receber WHERE administradora_id = $1`, [administradoraId]),
      query<{ total: string; pago: string }>(`SELECT COUNT(*)::int AS total, COUNT(*) FILTER (WHERE status IN ('pago','liquidado'))::int AS pago FROM contas_pagar WHERE administradora_id = $1`, [administradoraId]),
      query<{ total: string; ativos: string }>(`SELECT COUNT(*)::int AS total, COUNT(*) FILTER (WHERE status IN ('ativo','vigente'))::int AS ativos FROM contratos WHERE administradora_id = $1`, [administradoraId]),
      query<{ total: string; ativos: string }>(`SELECT COUNT(*)::int AS total, COUNT(*) FILTER (WHERE status = 'ativo')::int AS ativos FROM usuarios WHERE administradora_id = $1 AND deleted_at IS NULL`, [administradoraId]),
    ])
    return NextResponse.json({ success: true, data: { beneficiarios: beneficiarios[0] || {}, propostas: propostas[0] || {}, recebiveis: recebiveis[0] || {}, pagamentos: pagamentos[0] || {}, contratos: contratos[0] || {}, usuarios: usuarios[0] || {} } })
  } catch (error) {
    console.error("[v0] Erro ao carregar visão BI:", error)
    return NextResponse.json({ success: false, error: "Não foi possível carregar os indicadores." }, { status: authErrorStatus(error) })
  }
}
