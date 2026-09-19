"use client"

import useSWR from "swr"
import { useMemo, useState } from "react"
import { CalendarClock, CheckCircle2, FilePlus2, QrCode, RefreshCw, Search, Send, XCircle } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { apiFetch } from "@/lib/api-client"

type Fatura = { id: number; proposta_id: number; competencia: string; vencimento: string; valor_total: number; valor_base: number; status: string; numero_documento?: string | null; data_pagamento?: string | null }
const fetcher = (url: string) => apiFetch<{ data: Fatura[] }>(url)
const money = new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL" })
const date = (value: string) => new Intl.DateTimeFormat("pt-BR").format(new Date(`${value}T12:00:00`))
const statusLabel: Record<string, string> = { aberta: "Aberta", enviada: "Enviada", paga: "Paga", vencida: "Vencida", cancelada: "Cancelada" }

export default function FaturasMensaisPage() {
  const [search, setSearch] = useState("")
  const [status, setStatus] = useState("todos")
  const query = new URLSearchParams(status !== "todos" ? { status } : {}).toString()
  const { data, error, isLoading, mutate } = useSWR(`/api/propostas/faturas?${query}`, fetcher)
  const faturas = useMemo(() => (data?.data ?? []).filter((item) => `${item.id} ${item.proposta_id} ${item.numero_documento ?? ""}`.toLowerCase().includes(search.toLowerCase())), [data?.data, search])
  const abertas = faturas.filter((item) => ["aberta", "enviada"].includes(item.status))
  const vencidas = faturas.filter((item) => item.status === "vencida")
  const total = faturas.filter((item) => item.status !== "cancelada").reduce((sum, item) => sum + Number(item.valor_total || 0), 0)

  async function updateStatus(id: number, nextStatus: string) {
    await apiFetch("/api/propostas/faturas", { method: "PATCH", body: JSON.stringify({ id, status: nextStatus }) })
    mutate()
  }

  async function cancel(id: number) {
    if (!window.confirm("Cancelar esta fatura mensal?")) return
    await apiFetch(`/api/propostas/faturas?id=${id}`, { method: "DELETE" })
    mutate()
  }

  const indicators: Array<{ label: string; value: string | number; Icon: typeof Send }> = [
    { label: "Em aberto", value: abertas.length, Icon: Send },
    { label: "Vencidas", value: vencidas.length, Icon: CalendarClock },
    { label: "Carteira mensal", value: money.format(total), Icon: CheckCircle2 },
    { label: "Pagas", value: faturas.filter((item) => item.status === "paga").length, Icon: CheckCircle2 },
  ]

  return <main className="module-page flex-1 space-y-6 p-4 md:p-6">
    <header className="flex flex-col justify-between gap-4 md:flex-row md:items-center">
      <div><div className="mb-2 flex items-center gap-2 text-sm text-muted-foreground"><CalendarClock className="size-4 text-primary" /> Saúde suplementar / faturamento</div><h1 className="text-3xl font-bold tracking-tight">Faturas mensais</h1><p className="text-muted-foreground">Acompanhe competências, vencimentos, pagamentos e emissão de cobrança.</p></div>
      <Button onClick={() => window.location.assign("/dashboard/propostas/lista")}><FilePlus2 data-icon="inline-start" /> Gerar nova fatura</Button>
    </header>
    <section className="grid gap-4 md:grid-cols-4">{indicators.map(({ label, value, Icon }) => <Card key={label}><CardContent className="flex items-center justify-between p-5"><div><p className="text-sm text-muted-foreground">{label}</p><p className="mt-1 text-2xl font-semibold">{value}</p></div><Icon className="size-5 text-primary" /></CardContent></Card>)}</section>
    <Card>{error && <div className="border-b border-destructive/30 bg-destructive/10 p-4 text-sm text-destructive">Não foi possível carregar as faturas mensais.</div>}<CardHeader className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between"><CardTitle>Guia de faturas por competência</CardTitle><div className="flex flex-col gap-2 sm:flex-row"><div className="relative"><Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" /><Input className="pl-9" value={search} onChange={(event) => setSearch(event.target.value)} placeholder="Proposta ou documento" /></div><Select value={status} onValueChange={setStatus}><SelectTrigger className="w-full sm:w-40"><SelectValue /></SelectTrigger><SelectContent><SelectItem value="todos">Todos</SelectItem><SelectItem value="aberta">Aberta</SelectItem><SelectItem value="enviada">Enviada</SelectItem><SelectItem value="vencida">Vencida</SelectItem><SelectItem value="paga">Paga</SelectItem><SelectItem value="cancelada">Cancelada</SelectItem></SelectContent></Select><Button variant="outline" size="icon" onClick={() => mutate()} aria-label="Atualizar"><RefreshCw className="size-4" /></Button></div></CardHeader><CardContent><div className="overflow-x-auto"><table className="w-full text-sm"><thead><tr className="border-b text-left text-muted-foreground"><th className="p-3">Fatura</th><th className="p-3">Competência</th><th className="p-3">Vencimento</th><th className="p-3">Valor</th><th className="p-3">Status</th><th className="p-3 text-right">Ações</th></tr></thead><tbody>{isLoading ? <tr><td colSpan={6} className="p-10 text-center text-muted-foreground">Carregando faturas...</td></tr> : faturas.map((item) => <tr key={item.id} className="border-b last:border-0 hover:bg-muted/40"><td className="p-3"><div className="font-medium">FAT-{String(item.id).padStart(6, "0")}</div><div className="text-xs text-muted-foreground">PROP-{String(item.proposta_id).padStart(4, "0")}{item.numero_documento ? ` · ${item.numero_documento}` : ""}</div></td><td className="p-3 capitalize">{new Intl.DateTimeFormat("pt-BR", { month: "long", year: "numeric" }).format(new Date(`${item.competencia}T12:00:00`))}</td><td className="p-3">{date(item.vencimento)}</td><td className="p-3 font-medium">{money.format(Number(item.valor_total || 0))}</td><td className="p-3"><Badge variant={item.status === "paga" ? "default" : item.status === "vencida" ? "destructive" : "outline"}>{statusLabel[item.status] || item.status}</Badge></td><td className="p-3"><div className="flex justify-end gap-1"><Button variant="ghost" size="icon" title="Gerar PIX" aria-label="Gerar PIX"><QrCode className="size-4" /></Button>{["aberta", "vencida"].includes(item.status) && <Button variant="ghost" size="icon" title="Marcar enviada" aria-label="Marcar enviada" onClick={() => updateStatus(item.id, "enviada")}><Send className="size-4" /></Button>}{item.status !== "paga" && item.status !== "cancelada" && <Button variant="ghost" size="icon" title="Marcar paga" aria-label="Marcar paga" onClick={() => updateStatus(item.id, "paga")}><CheckCircle2 className="size-4" /></Button>}{item.status !== "cancelada" && <Button variant="ghost" size="icon" title="Cancelar fatura" aria-label="Cancelar fatura" onClick={() => cancel(item.id)}><XCircle className="size-4" /></Button>}</div></td></tr>)}{!isLoading && !faturas.length && <tr><td colSpan={6} className="p-10 text-center text-muted-foreground">Nenhuma fatura mensal encontrada.</td></tr>}</tbody></table></div></CardContent></Card>
  </main>
}
