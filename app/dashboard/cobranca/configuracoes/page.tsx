"use client"

import { useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

type Config = { id: number; nome: string; banco_codigo?: string; agencia?: string; conta?: string; carteira?: string; convenio?: string; ambiente: string; ativo: boolean }

export default function ConfiguracoesCobrancaPage() {
  const [configs, setConfigs] = useState<Config[]>([])
  const [form, setForm] = useState({ nome: "Convênio principal", banco_codigo: "", agencia: "", conta: "", carteira: "", convenio: "", ambiente: "homologacao" })
  const [message, setMessage] = useState("")
  async function load() { const response = await fetch("/api/financeiro/configuracoes-cobranca"); const data = await response.json(); setConfigs(data.data || []) }
  useEffect(() => { void load() }, [])
  async function save(event: React.FormEvent) { event.preventDefault(); const response = await fetch("/api/financeiro/configuracoes-cobranca", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(form) }); const data = await response.json(); setMessage(response.ok ? "Convênio salvo. Agora cadastre um template CNAB para gerar remessas." : data.error || "Não foi possível salvar."); if (response.ok) void load() }
  return <main className="module-page flex-1 space-y-6 p-4 md:p-6"><header className="border-b border-border pb-5"><p className="font-mono text-xs uppercase tracking-[0.2em] text-primary">Cobrança / Configuração</p><h1 className="text-3xl font-semibold tracking-tight">Convênios e layouts bancários</h1><p className="mt-1 text-muted-foreground">Defina banco, carteira, convênio e ambiente antes de gerar arquivos de fatura.</p></header>{message && <div className="border-l-2 border-primary bg-primary/5 px-4 py-3 text-sm">{message}</div>}<div className="grid gap-6 lg:grid-cols-[1fr_0.8fr]"><Card><CardHeader><CardTitle>Novo convênio</CardTitle></CardHeader><CardContent><form onSubmit={save} className="grid gap-4 sm:grid-cols-2">{([["nome","Nome"],["banco_codigo","Código do banco"],["agencia","Agência"],["conta","Conta"],["carteira","Carteira"],["convenio","Convênio"]] as const).map(([key,label]) => <div key={key} className="space-y-2"><Label htmlFor={key}>{label}</Label><Input id={key} value={form[key]} onChange={(event) => setForm({ ...form, [key]: event.target.value })} required={key === "nome"} /></div>)}<div className="space-y-2"><Label htmlFor="ambiente">Ambiente</Label><select id="ambiente" value={form.ambiente} onChange={(event) => setForm({ ...form, ambiente: event.target.value })} className="h-10 w-full border border-input bg-background px-3 text-sm"><option value="homologacao">Homologação</option><option value="producao">Produção</option></select></div><div className="sm:col-span-2"><Button type="submit">Salvar configuração</Button></div></form></CardContent></Card><Card><CardHeader><CardTitle>Configurações ativas</CardTitle></CardHeader><CardContent className="space-y-3">{configs.length === 0 ? <p className="text-sm text-muted-foreground">Nenhum convênio configurado.</p> : configs.map((config) => <div key={config.id} className="border-b border-border pb-3"><p className="font-medium">{config.nome}</p><p className="text-sm text-muted-foreground">Banco {config.banco_codigo || "não informado"} · {config.ambiente}</p></div>)}</CardContent></Card></div></main>
}
