import { NextResponse } from "next/server"
import { getAuthContext } from "@/lib/api-auth"
import { query } from "@/lib/database"

export async function POST(request: Request) {
  const auth = await getAuthContext()
  if (!auth) return NextResponse.json({ error: "Não autenticado" }, { status: 401 })
  const body = await request.json()
  const config = await query("SELECT id FROM configuracoes_cobranca WHERE id = $1 AND administradora_id = $2 AND ativo = true AND deleted_at IS NULL", [body.configuracao_id, auth.administradoraId])
  if (!config.length) return NextResponse.json({ error: "Configure um convênio ativo antes de gerar a remessa" }, { status: 422 })
  const template = await query("SELECT id, layout FROM templates_arquivos_bancarios WHERE id = $1 AND administradora_id = $2 AND tipo = 'remessa' AND ativo = true", [body.template_id, auth.administradoraId])
  if (!template.length) return NextResponse.json({ error: "Template de remessa ativo não encontrado" }, { status: 422 })
  const faturas = await query("SELECT id, valor_total, vencimento FROM faturas_mensais WHERE administradora_id = $1 AND status IN ('aberta','enviada','vencida') AND deleted_at IS NULL ORDER BY vencimento, id", [auth.administradoraId])
  if (!faturas.length) return NextResponse.json({ error: "Nenhuma fatura elegível para remessa" }, { status: 422 })
  const lines = faturas.map((item, index) => `${String(index + 1).padStart(6, "0")};${item.id};${Number(item.valor_total).toFixed(2)};${item.vencimento}`).join("\n")
  const fileName = `REMESSA_${new Date().toISOString().slice(0, 10).replaceAll("-", "")}_${Date.now()}.txt`
  const total = faturas.reduce((sum, item) => sum + Number(item.valor_total), 0)
  const files = await query("INSERT INTO arquivos_bancarios (administradora_id, configuracao_id, template_id, tipo, meio, nome_arquivo, conteudo, status, total_itens, valor_total, resumo) VALUES ($1,$2,$3,'remessa',$4,$5,$6,'gerado',$7,$8,$9) RETURNING *", [auth.administradoraId, body.configuracao_id, template[0].id, body.meio || "boleto", fileName, lines, faturas.length, total, JSON.stringify({ layout: template[0].layout })])
  for (const item of faturas) await query("INSERT INTO arquivo_bancario_itens (arquivo_id, fatura_id, administradora_id, valor, status) VALUES ($1,$2,$3,$4,'gerado')", [files[0].id, item.id, auth.administradoraId, item.valor_total])
  return NextResponse.json({ data: files[0], download: `/api/financeiro/arquivos-bancarios/${files[0].id}/download`, message: `${faturas.length} faturas incluídas na remessa` }, { status: 201 })
}
