"use client"

import useSWR from "swr"
import { useState } from "react"
import { Calendar, Download, RefreshCw, TrendingUp, AlertTriangle, CircleDollarSign, FileText } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Skeleton } from "@/components/ui/skeleton"
import { apiFetch } from "@/lib/api-client"

type Report = { total: number; faturado: number; recebido: number; aberto: number; vencidas: number; taxa_recebimento: number }
const money = new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL" })
const fetcher = (url: string) => apiFetch<{ data: Report }>(url)

export default function RelatoriosCobrancaPage() {
  const [from, setFrom] = useState("")
  const [to, setTo] = useState("")
  const query = new URLSearchParams({ ...(from ? { from } : {}), ...(to ? { to } : {}) }).toString()
  const { data, error, isLoading, mutate } = useSWR(`/api/cobranca/relatorios?${query}`, fetcher)
  const report = data?.data
  const cards = [
    { label: "Total faturado", value: money.format(Number(report?.faturado ?? 0)), icon: FileText },
    { label: "Total recebido", value: money.format(Number(report?.recebido ?? 0)), icon: CircleDollarSign },
    { label: "Em aberto", value: money.format(Number(report?.aberto ?? 0)), icon: TrendingUp },
    { label: "Inadimplência", value: String(report?.vencidas ?? 0), icon: AlertTriangle },
  ]

  return (
    <main className="min-h-screen bg-background">
      <div className="container mx-auto flex flex-col gap-6 px-4 py-6 md:px-6">
        <header className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div><p className="text-sm text-muted-foreground">Análise financeira</p><h1 className="text-2xl font-semibold tracking-tight">Relatórios de cobrança</h1><p className="text-muted-foreground">Indicadores calculados diretamente da carteira financeira.</p></div>
          <Button variant="outline" onClick={() => mutate()}><RefreshCw data-icon="inline-start" /> Atualizar</Button>
        </header>
        <Card><CardHeader><CardTitle>Período de análise</CardTitle><CardDescription>Use as datas para delimitar os indicadores.</CardDescription></CardHeader><CardContent className="flex flex-col gap-3 sm:flex-row sm:items-end"><label className="flex flex-col gap-2 text-sm font-medium">De<Input type="date" value={from} onChange={(event) => setFrom(event.target.value)} /></label><label className="flex flex-col gap-2 text-sm font-medium">Até<Input type="date" value={to} onChange={(event) => setTo(event.target.value)} /></label><Button variant="secondary" onClick={() => mutate()}><Calendar data-icon="inline-start" /> Aplicar período</Button></CardContent></Card>
        {error && <div className="rounded-lg border border-destructive/30 bg-destructive/10 p-4 text-sm text-destructive">Não foi possível carregar o relatório.</div>}
        <section aria-label="Indicadores financeiros" className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">{cards.map(({ label, value, icon: Icon }) => <Card key={label}><CardContent className="flex items-center gap-3 p-5"><div className="rounded-lg bg-primary/10 p-2 text-primary"><Icon className="size-5" /></div><div><p className="text-sm text-muted-foreground">{label}</p>{isLoading ? <Skeleton className="mt-1 h-7 w-32" /> : <p className="text-xl font-semibold">{value}</p>}</div></CardContent></Card>)}</section>
        <Card><CardHeader><CardTitle>Resumo executivo</CardTitle><CardDescription>{report?.total ?? 0} cobranças no período selecionado</CardDescription></CardHeader><CardContent className="grid gap-4 md:grid-cols-2"><div className="rounded-lg border p-4"><p className="text-sm text-muted-foreground">Taxa de recebimento</p><p className="mt-1 text-2xl font-semibold">{report?.taxa_recebimento ?? 0}%</p></div><div className="rounded-lg border p-4"><p className="text-sm text-muted-foreground">Cobranças vencidas</p><p className="mt-1 text-2xl font-semibold">{report?.vencidas ?? 0}</p></div></CardContent></Card>
      </div>
    </main>
  )
}
