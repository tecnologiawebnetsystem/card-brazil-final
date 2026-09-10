"use client"

import useSWR from "swr"
import { RefreshCw, CheckCircle2, FileSpreadsheet } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Skeleton } from "@/components/ui/skeleton"
import { apiFetch } from "@/lib/api-client"

type Conciliacao = { data: string; registros_conciliados: number; total_sistema: number }
const money = new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL" })
const fetcher = (url: string) => apiFetch<{ data: Conciliacao[] }>(url)

export default function ConciliacaoBancariaPage() {
  const { data, isLoading, error, mutate } = useSWR("/api/cobranca/conciliacao", fetcher)
  const rows = data?.data ?? []
  return (
    <main className="min-h-screen bg-background"><div className="container mx-auto flex flex-col gap-6 px-4 py-6 md:px-6">
      <header className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between"><div><p className="text-sm text-muted-foreground">Controle financeiro</p><h1 className="text-2xl font-semibold tracking-tight">Conciliação bancária</h1><p className="text-muted-foreground">Confira os pagamentos confirmados no sistema.</p></div><Button variant="outline" onClick={() => mutate()}><RefreshCw data-icon="inline-start" /> Atualizar</Button></header>
      <Card><CardHeader><CardTitle>Período</CardTitle><CardDescription>Filtre os recebimentos conciliados.</CardDescription></CardHeader><CardContent className="flex flex-col gap-3 sm:flex-row sm:items-end"><label className="flex flex-col gap-2 text-sm font-medium">De<Input type="date" /></label><label className="flex flex-col gap-2 text-sm font-medium">Até<Input type="date" /></label><Button variant="secondary" onClick={() => mutate()}><FileSpreadsheet data-icon="inline-start" /> Consultar</Button></CardContent></Card>
      {error && <div className="rounded-lg border border-destructive/30 bg-destructive/10 p-4 text-sm text-destructive">Não foi possível carregar a conciliação.</div>}
      <Card><CardHeader><CardTitle>Recebimentos conciliados</CardTitle><CardDescription>{rows.length} dias com movimentação registrada</CardDescription></CardHeader><CardContent><div className="overflow-x-auto"><table className="w-full text-sm"><thead><tr className="border-b text-left text-muted-foreground"><th className="p-3">Data</th><th className="p-3">Registros</th><th className="p-3">Total no sistema</th><th className="p-3">Situação</th></tr></thead><tbody>{isLoading ? Array.from({ length: 3 }).map((_, index) => <tr key={index}><td className="p-3" colSpan={4}><Skeleton className="h-8 w-full" /></td></tr>) : rows.length === 0 ? <tr><td className="p-8 text-center text-muted-foreground" colSpan={4}>Nenhum pagamento confirmado no período.</td></tr> : rows.map((row) => <tr key={row.data} className="border-b last:border-0"><td className="p-3">{new Date(row.data).toLocaleDateString("pt-BR")}</td><td className="p-3">{row.registros_conciliados}</td><td className="p-3 font-medium">{money.format(Number(row.total_sistema))}</td><td className="p-3"><span className="inline-flex items-center gap-1 text-emerald-600"><CheckCircle2 className="size-4" /> Conciliado</span></td></tr>)}</tbody></table></div></CardContent></Card>
    </div></main>
  )
}
