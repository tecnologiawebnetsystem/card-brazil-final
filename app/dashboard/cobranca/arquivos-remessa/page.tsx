"use client"

import { useEffect, useState } from "react"
import { Upload, FileOutput, RefreshCw, CheckCircle2, AlertTriangle } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"

type Arquivo = { id: number; nome_arquivo: string; tipo: string; meio: string; status: string; total_itens: number; valor_total: number; created_at: string }

export default function ArquivosRemessaPage() {
  const [arquivos, setArquivos] = useState<Arquivo[]>([])
  const [file, setFile] = useState<File | null>(null)
  const [meio, setMeio] = useState("boleto")
  const [loading, setLoading] = useState(true)
  const [message, setMessage] = useState("")

  async function load() {
    setLoading(true)
    const response = await fetch("/api/financeiro/arquivos-bancarios")
    const data = await response.json()
    setArquivos(data.data || [])
    setLoading(false)
  }

  useEffect(() => { void load() }, [])

  async function processReturn() {
    if (!file) return
    const content = await file.text()
    const response = await fetch("/api/financeiro/arquivos-bancarios/retorno", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ nome_arquivo: file.name, conteudo: content, meio }) })
    const data = await response.json()
    setMessage(response.ok ? `Retorno processado: ${data.resumo?.baixadas || 0} baixas e ${data.resumo?.rejeitadas || 0} rejeições.` : data.error || "Não foi possível processar o retorno.")
    if (response.ok) { setFile(null); await load() }
  }

  return <main className="module-page flex-1 space-y-6 p-4 md:p-6">
    <header className="flex flex-col gap-3 border-b border-border pb-5 md:flex-row md:items-end md:justify-between"><div><p className="font-mono text-xs uppercase tracking-[0.2em] text-primary">Financeiro / Bancário</p><h1 className="text-3xl font-semibold tracking-tight">Remessas e retornos</h1><p className="mt-1 text-muted-foreground">Arquivos configuráveis para faturas mensais, com histórico de processamento.</p></div><Button variant="outline" onClick={() => void load()}><RefreshCw className="mr-2 size-4" />Atualizar</Button></header>
    {message && <div className="border-l-2 border-primary bg-primary/5 px-4 py-3 text-sm">{message}</div>}
    <section className="grid gap-4 lg:grid-cols-2"><Card><CardHeader><CardTitle className="flex items-center gap-2"><FileOutput className="size-5 text-primary" />Gerar remessa</CardTitle></CardHeader><CardContent className="space-y-4"><p className="text-sm text-muted-foreground">A geração usa a configuração ativa e seleciona faturas mensais elegíveis. O arquivo e seus itens ficam auditáveis.</p><Button onClick={() => setMessage("Configure um convênio e template ativo para gerar uma remessa.")}><FileOutput className="mr-2 size-4" />Nova remessa</Button></CardContent></Card><Card><CardHeader><CardTitle className="flex items-center gap-2"><Upload className="size-5 text-primary" />Processar retorno</CardTitle></CardHeader><CardContent className="space-y-4"><div className="space-y-2"><Label htmlFor="meio">Meio de cobrança</Label><select id="meio" value={meio} onChange={(event) => setMeio(event.target.value)} className="h-10 w-full border border-input bg-background px-3 text-sm"><option value="boleto">Boleto</option><option value="pix">PIX</option><option value="debito_automatico">Débito automático</option><option value="cartao_credito">Cartão de crédito</option><option value="cartao_debito">Cartão de débito</option></select></div><Input type="file" accept=".txt,.rem,.ret,.csv" onChange={(event) => setFile(event.target.files?.[0] || null)} /><Button variant="outline" disabled={!file} onClick={() => void processReturn()}><Upload className="mr-2 size-4" />Processar retorno</Button></CardContent></Card></section>
    <Card><CardHeader><CardTitle>Histórico de arquivos</CardTitle></CardHeader><CardContent>{loading ? <p className="text-sm text-muted-foreground">Carregando histórico...</p> : arquivos.length === 0 ? <div className="flex items-center gap-3 py-8 text-sm text-muted-foreground"><AlertTriangle className="size-5" />Nenhum arquivo bancário registrado.</div> : <div className="divide-y divide-border">{arquivos.map((arquivo) => <div key={arquivo.id} className="flex flex-col gap-3 py-4 md:flex-row md:items-center md:justify-between"><div><p className="font-medium">{arquivo.nome_arquivo}</p><p className="text-sm text-muted-foreground">{arquivo.tipo} · {arquivo.meio} · {arquivo.total_itens} itens · {new Date(arquivo.created_at).toLocaleString("pt-BR")}</p></div><Badge variant={arquivo.status === "processado" ? "default" : "secondary"}>{arquivo.status === "processado" ? <CheckCircle2 className="mr-1 size-3" /> : null}{arquivo.status}</Badge></div>)}</div>}</CardContent></Card>
  </main>
}
