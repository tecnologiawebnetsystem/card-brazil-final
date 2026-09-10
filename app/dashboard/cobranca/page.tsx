"use client"

import useSWR from "swr"
import { useMemo, useState } from "react"
import { AlertCircle, ArrowUpRight, CalendarClock, CircleDollarSign, Filter, RefreshCw, Search, Send, ShieldCheck } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Skeleton } from "@/components/ui/skeleton"
import { apiFetch } from "@/lib/api-client"

type Cobranca = {
  id: number
  tipo_cobranca: string
  status: string
  valor_original: number
  valor_atual: number
  desconto_concedido: number | null
  data_inicio: string
  data_fim: string | null
  parcelas: number | null
  beneficiario_id: number | null
  conta_receber_id: number | null
  canal_contato: string | null
  created_at: string
}

type CobrancasResponse = { data: Cobranca[]; pagination: { count: number; total: number; limit: number; offset: number }; metrics: { em_atraso: number; em_cobranca: number; recuperado: number; taxa_recuperacao: number } }

const fetcher = (url: string) => apiFetch<CobrancasResponse>(url)
const money = new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL" })
const date = new Intl.DateTimeFormat("pt-BR")

function statusVariant(status: string) {
  if (status === "paga" || status === "encerrada") return "secondary" as const
  if (status === "em_cobranca") return "default" as const
  return "destructive" as const
}

export default function CobrancaPage() {
  const [search, setSearch] = useState("")
  const [status, setStatus] = useState("todos")
  const query = new URLSearchParams({ limit: "50", ...(status !== "todos" ? { status } : {}) }).toString()
  const { data, error, isLoading, mutate } = useSWR(`/api/cobranca?${query}`, fetcher)
  const cobrancas = useMemo(() => (data?.data ?? []).filter((item) => `${item.id} ${item.tipo_cobranca} ${item.status}`.toLowerCase().includes(search.toLowerCase())), [data?.data, search])

  return (
    <main className="min-h-screen bg-background">
      <div className="container mx-auto flex min-w-0 flex-col gap-5 px-3 py-4 sm:gap-6 sm:px-4 sm:py-6 md:px-6">
        <header className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div className="flex flex-col gap-1">
            <div className="flex items-center gap-2 text-sm text-muted-foreground"><ShieldCheck className="size-4" /> Operação financeira</div>
            <h1 className="text-2xl font-semibold tracking-tight text-foreground">Cobrança</h1>
            <p className="text-muted-foreground">Acompanhe títulos vencidos, negociações e recuperação de receita.</p>
          </div>
          <Button onClick={() => mutate()} variant="outline"><RefreshCw data-icon="inline-start" /> Atualizar dados</Button>
        </header>

        {error && <div className="flex items-center gap-2 rounded-lg border border-destructive/30 bg-destructive/10 p-4 text-sm text-destructive"><AlertCircle className="size-4" /> Não foi possível carregar a carteira de cobrança.</div>}

        <section aria-label="Indicadores de cobrança" className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          {[{ label: "Em atraso", value: money.format(data?.metrics.em_atraso ?? 0), icon: AlertCircle }, { label: "Em cobrança", value: String(data?.metrics.em_cobranca ?? 0), icon: Send }, { label: "Recuperado", value: money.format(data?.metrics.recuperado ?? 0), icon: CircleDollarSign }, { label: "Taxa de recuperação", value: `${data?.metrics.taxa_recuperacao ?? 0}%`, icon: ArrowUpRight }].map(({ label, value, icon: Icon }) => (
            <Card key={label}><CardContent className="flex items-center gap-3 p-5"><div className="rounded-lg bg-primary/10 p-2 text-primary"><Icon className="size-5" /></div><div><p className="text-sm text-muted-foreground">{label}</p><p className="text-xl font-semibold">{isLoading ? <Skeleton className="h-6 w-24" /> : value}</p></div></CardContent></Card>
          ))}
        </section>

        <Card>
          <CardHeader className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between"><div><CardTitle>Carteira ativa</CardTitle><CardDescription>{data?.pagination.total ?? 0} registros encontrados</CardDescription></div><div className="flex flex-col gap-2 sm:flex-row"><div className="relative"><Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" /><Input value={search} onChange={(event) => setSearch(event.target.value)} placeholder="Buscar por código ou status" className="pl-9" /></div><Select value={status} onValueChange={setStatus}><SelectTrigger className="w-full sm:w-44"><Filter data-icon="inline-start" /><SelectValue /></SelectTrigger><SelectContent><SelectItem value="todos">Todos os status</SelectItem><SelectItem value="pendente">Pendente</SelectItem><SelectItem value="em_cobranca">Em cobrança</SelectItem><SelectItem value="paga">Paga</SelectItem><SelectItem value="encerrada">Encerrada</SelectItem></SelectContent></Select></div></CardHeader>
          <CardContent><div className="overflow-x-auto"><table className="w-full text-sm"><thead><tr className="border-b text-left text-muted-foreground"><th className="p-3 font-medium">Cobrança</th><th className="p-3 font-medium">Vencimento</th><th className="p-3 font-medium">Valor atual</th><th className="p-3 font-medium">Canal</th><th className="p-3 font-medium">Status</th></tr></thead><tbody>{isLoading ? Array.from({ length: 4 }).map((_, index) => <tr key={index}><td className="p-3" colSpan={5}><Skeleton className="h-8 w-full" /></td></tr>) : cobrancas.length === 0 ? <tr><td className="p-10 text-center text-muted-foreground" colSpan={5}><CalendarClock className="mx-auto mb-2 size-6" />Nenhuma cobrança encontrada.</td></tr> : cobrancas.map((item) => <tr key={item.id} className="border-b last:border-0 hover:bg-muted/40"><td className="p-3"><div className="font-medium">COB-{String(item.id).padStart(6, "0")}</div><div className="text-xs text-muted-foreground">{item.tipo_cobranca}</div></td><td className="p-3">{item.data_fim ? date.format(new Date(item.data_fim)) : "—"}</td><td className="p-3 font-medium">{money.format(Number(item.valor_atual ?? item.valor_original))}</td><td className="p-3 capitalize">{item.canal_contato ?? "—"}</td><td className="p-3"><Badge variant={statusVariant(item.status)}>{item.status.replaceAll("_", " ")}</Badge></td></tr>)}</tbody></table></div></CardContent>
        </Card>
      </div>
    </main>
  )
}
