"use client"

import dynamic from "next/dynamic"
import Link from "next/link"
import useSWR from "swr"
import { Activity, ArrowUpRight, BriefcaseBusiness, FileText, Landmark, Users, CalendarDays, Sparkles, CircleCheck } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { DateRangePicker } from "@/components/dashboard/date-range-picker"
import { useAuth } from "@/contexts/auth-context"
import { useState } from "react"

const InteractiveChart = dynamic(() => import("@/components/dashboard/interactive-chart").then((module) => module.InteractiveChart), {
  ssr: false,
  loading: () => <div className="h-[390px] animate-pulse rounded-xl border border-border bg-muted/40" aria-label="Carregando gráfico" />,
})

const fetcher = (url: string) => fetch(url, { credentials: "include" }).then((response) => {
  if (!response.ok) throw new Error("Falha ao carregar os indicadores")
  return response.json()
})
const number = (value: unknown) => new Intl.NumberFormat("pt-BR").format(Number(value || 0))
const money = (value: unknown) => new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL", maximumFractionDigits: 0 }).format(Number(value || 0))

export default function DashboardPage() {
  const { user } = useAuth()
  const { data: overview, error } = useSWR("/api/dashboard/overview", fetcher, {
    revalidateOnFocus: false,
    dedupingInterval: 30_000,
    keepPreviousData: true,
  })
  const [dateRange, setDateRange] = useState({ from: new Date(new Date().getFullYear(), 0, 1), to: new Date() })
  const userName = user?.nome_completo || "gestor"
  const kpis = overview?.data
  const chartData = [
    { name: "Beneficiários", value: Number(kpis?.beneficiarios?.ativos || 0) },
    { name: "Propostas", value: Number(kpis?.propostas?.total || 0) },
    { name: "Contratos", value: Number(kpis?.contratos?.ativos || 0) },
    { name: "Usuários", value: Number(kpis?.usuarios?.ativos || 0) },
  ]
  const cards = [
    { label: "Beneficiários ativos", value: number(kpis?.beneficiarios?.ativos), detail: `${number(kpis?.beneficiarios?.titulares)} titulares · ${number(kpis?.beneficiarios?.dependentes)} dependentes`, icon: Users, tone: "text-primary" },
    { label: "Propostas pendentes", value: number(kpis?.propostas?.pendentes), detail: `${number(kpis?.propostas?.aprovadas)} aprovadas · ${number(kpis?.propostas?.rejeitadas)} rejeitadas`, icon: FileText, tone: "text-info" },
    { label: "Recebíveis em aberto", value: money(kpis?.recebiveis?.aberto), detail: `${money(kpis?.recebiveis?.vencido)} vencidos`, icon: Landmark, tone: "text-warning" },
    { label: "Contratos vigentes", value: number(kpis?.contratos?.ativos), detail: `${number(kpis?.contratos?.total)} contratos cadastrados`, icon: BriefcaseBusiness, tone: "text-success" },
  ]

  return (
    <div className="mx-auto w-full max-w-[1500px] space-y-8">
      <section className="relative flex flex-col justify-between gap-6 overflow-hidden rounded-2xl border border-primary/15 bg-card p-6 shadow-sm md:flex-row md:items-center md:p-7">
        <div className="absolute inset-y-0 left-0 w-1 bg-primary" />
        <div className="pl-2"><div className="mb-2 flex items-center gap-2 text-sm font-semibold text-primary"><Sparkles className="h-4 w-4" />Visão executiva</div><h1 className="text-3xl font-semibold tracking-tight text-foreground md:text-4xl">Bom dia, {userName.split(" ")[0]}</h1><p className="mt-2 max-w-2xl text-muted-foreground">Acompanhe o que precisa de atenção na operação da administradora.</p></div>
        <div className="flex items-center gap-2 rounded-xl border border-border/70 bg-muted/30 p-1"><CalendarDays className="ml-3 h-4 w-4 text-muted-foreground" /><DateRangePicker value={dateRange} onChange={setDateRange} /></div>
      </section>

      {error && <div className="rounded-lg border border-destructive/30 bg-destructive/10 px-4 py-3 text-sm text-destructive">Não foi possível atualizar os indicadores. Verifique sua sessão e tente novamente.</div>}
      <section aria-label="Indicadores principais" className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">{cards.map(({ label, value, detail, icon: Icon, tone }) => <Card key={label} className="group h-full border-border/70 bg-card shadow-sm transition-all hover:-translate-y-0.5 hover:border-primary/25 hover:shadow-md"><CardContent className="p-5"><div className="flex items-center justify-between gap-3"><div className="flex items-center gap-3"><span className={`rounded-xl bg-muted p-2.5 ${tone}`}><Icon className="h-4 w-4" /></span><p className="text-sm font-medium text-muted-foreground">{label}</p></div><ArrowUpRight className="h-4 w-4 text-muted-foreground/50 transition-colors group-hover:text-primary" /></div><p className="mt-6 text-2xl font-semibold tracking-tight text-foreground">{value}</p><p className="mt-1 text-xs text-muted-foreground">{detail}</p></CardContent></Card>)}</section>

      <section className="grid gap-6 xl:grid-cols-[1.6fr_1fr]"><InteractiveChart className="border-border/70 shadow-sm" title="Base operacional atual" data={chartData} type="bar" dataKeys={[{ key: "value", label: "Registros", color: "var(--primary)" }]} /><Card className="border-border/70 shadow-sm"><CardHeader className="flex flex-row items-center justify-between border-b border-border/60 bg-muted/20"><div><CardTitle className="text-base">Acompanhe agora</CardTitle><p className="mt-1 text-xs text-muted-foreground">Itens que merecem sua atenção</p></div><Activity className="h-4 w-4 text-primary" /></CardHeader><CardContent className="space-y-3 p-5">{[{ title: "Propostas aguardando análise", value: number(kpis?.propostas?.pendentes), href: "/dashboard/propostas/pendentes", icon: FileText }, { title: "Recebíveis vencidos", value: money(kpis?.recebiveis?.vencido), href: "/dashboard/financeiro/contas-receber", icon: Landmark }, { title: "Contas a pagar liquidadas", value: `${number(kpis?.pagamentos?.pago)} de ${number(kpis?.pagamentos?.total)}`, href: "/dashboard/financeiro/contas-pagar", icon: BriefcaseBusiness }].map(({ title, value, href, icon: Icon }) => <Link href={href} key={title} className="group flex items-center gap-3 rounded-xl border border-border/60 bg-background p-3.5 transition-all hover:border-primary/25 hover:bg-primary/[0.03]"><span className="rounded-md bg-primary/10 p-2 text-primary"><Icon className="h-4 w-4" /></span><span className="flex-1 text-sm text-muted-foreground">{title}</span><strong className="text-sm">{value}</strong><ArrowUpRight className="h-4 w-4 text-muted-foreground" /></Link>)}</CardContent></Card></section>

      <section className="grid gap-4 md:grid-cols-3"><Card className="border-primary/20 bg-primary text-primary-foreground shadow-md md:col-span-2"><CardContent className="flex flex-col justify-between gap-5 p-6 sm:flex-row sm:items-center sm:p-7"><div className="flex items-start gap-4"><div className="rounded-xl bg-primary-foreground/15 p-2.5"><CircleCheck className="h-5 w-5" /></div><div><p className="text-sm font-medium text-primary-foreground/70">Leitura executiva</p><h2 className="mt-1 text-xl font-semibold">Acompanhe o ciclo completo da operação</h2><p className="mt-1 text-sm text-primary-foreground/75">Da proposta ao beneficiário, contrato e recebimento.</p></div></div><Button variant="secondary" asChild><a href="/dashboard/relatorios/inteligentes">Abrir análises <ArrowUpRight className="ml-2 h-4 w-4" /></a></Button></CardContent></Card><Card className="border-border/70 shadow-sm"><CardContent className="flex items-center gap-4 p-6"><div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary text-lg font-semibold text-primary-foreground">{userName.split(" ").map((part: string) => part[0]).join("").slice(0, 2).toUpperCase()}</div><div><p className="text-sm text-muted-foreground">Seu acesso</p><p className="font-semibold">{user?.tipo_usuario || "Gestor"}</p><a className="text-sm text-primary hover:underline" href="/dashboard/perfil">Editar perfil</a></div></CardContent></Card></section>
    </div>
  )
}
