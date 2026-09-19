import { type NextRequest, NextResponse } from "next/server"
import { getAuthContext } from "@/lib/api-auth"
import { query } from "@/lib/database"

export async function POST(request: NextRequest) {
  const auth = await getAuthContext()
  if (!auth) return NextResponse.json({ error: "Não autenticado" }, { status: 401 })
  const body = await request.json()
  const content = String(body.conteudo || "")
  if (!content.trim() || !body.nome_arquivo || !body.meio) return NextResponse.json({ error: "Arquivo, conteúdo e meio são obrigatórios" }, { status: 422 })
  const lines = content.split(/\r?\n/).filter(Boolean)
  const file = await query("INSERT INTO arquivos_bancarios (administradora_id, configuracao_id, template_id, tipo, meio, nome_arquivo, conteudo, status, total_itens, resumo) VALUES ($1,$2,$3,'retorno',$4,$5,$6,'processando',$7,$8) RETURNING *", [auth.administradoraId, body.configuracao_id || null, body.template_id || null, body.meio, body.nome_arquivo, content, lines.length, JSON.stringify({ layout: body.layout || "configurável" })])
  let baixadas = 0
  let rejeitadas = 0
  for (const line of lines) {
    const parts = line.split(/[;|,]/).map((part) => part.trim())
    const faturaId = Number(parts[1])
    const valor = Number(String(parts[2] || "0").replace(",", "."))
    const ocorrencia = parts[3] || "processado"
    const fatura = Number.isInteger(faturaId) ? await query("SELECT id, status, valor_total FROM faturas_mensais WHERE id = $1 AND administradora_id = $2 AND deleted_at IS NULL", [faturaId, auth.administradoraId]) : []
    const accepted = fatura.length && ["pago", "pagamento", "baixado", "processado"].includes(ocorrencia.toLowerCase())
    await query("INSERT INTO arquivo_bancario_itens (arquivo_id, fatura_id, administradora_id, codigo_ocorrencia, valor, linha_original, status, mensagem) VALUES ($1,$2,$3,$4,$5,$6,$7,$8)", [file[0].id, fatura[0]?.id || null, auth.administradoraId, ocorrencia, Number.isFinite(valor) ? valor : null, line, accepted ? "processado" : "rejeitado", accepted ? null : "Fatura ou ocorrência não elegível"])
    if (accepted) { baixadas += 1; await query("UPDATE faturas_mensais SET status = 'paga', data_pagamento = COALESCE(data_pagamento, CURRENT_DATE), updated_at = NOW() WHERE id = $1 AND administradora_id = $2", [faturaId, auth.administradoraId]); await query("INSERT INTO fatura_eventos (fatura_id, administradora_id, tipo, status_anterior, status_novo, origem, payload, usuario_id) VALUES ($1,$2,'retorno_processado',$3,'paga','retorno',$4,$5)", [faturaId, auth.administradoraId, fatura[0].status, JSON.stringify({ arquivo_id: file[0].id, ocorrencia, valor }), auth.userId]) } else rejeitadas += 1
  }
  const updated = await query("UPDATE arquivos_bancarios SET status = 'processado', processed_at = NOW(), resumo = $1 WHERE id = $2 AND administradora_id = $3 RETURNING *", [JSON.stringify({ total: lines.length, baixadas, rejeitadas }), file[0].id, auth.administradoraId])
  return NextResponse.json({ data: updated[0], resumo: { total: lines.length, baixadas, rejeitadas } }, { status: 201 })
}
