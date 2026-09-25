"use client"

import useSWR from "swr"
import { Activity, ArrowUpRight, BriefcaseBusiness, FileText, Landmark, Users } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { DateRangePicker } from "@/components/dashboard/date-range-picker"
import { InteractiveChart } from "@/components/dashboard/interactive-chart"
import { useState } from "react"

const fetcher = (url: string) => fetch(url, { credentials: "include" }).then((response) => response.json())
const number = (value: unknown) => new Intl.NumberFormat("pt-BR").format(Number(value || 0))
const money = (value: unknown) => new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL", maximumFractionDigits: 0 }).format(Number(value || 0))

export default function DashboardPage() {
  const { data: session } = useSWR("/api/auth/me", fetcher)
  const { data: overview, error } = useSWR("/api/dashboard/overview", fetcher)
  const [dateRange, setDateRange] = useState({ from: new Date(new Date().getFullYear(), 0, 1), to: new Date() })
  const userName = session?.user?.nome || session?.user?.nome_completo || "gestor"
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
    <div className="mx-auto w-full max-w-[1500px] space-y-6">
      <section className="flex flex-col justify-between gap-4 border-b border-border pb-6 md:flex-row md:items-end">
        <div><p className="mb-2 text-sm font-medium uppercase tracking-[0.18em] text-primary">CardBrazil · Inteligência operacional</p><h1 className="text-3xl font-semibold tracking-tight text-foreground md:text-4xl">Bom dia, {userName.split(" ")[0]}</h1><p className="mt-2 text-muted-foreground">Visão consolidada da carteira, propostas, contratos e recebíveis da administradora.</p></div>
        <DateRangePicker value={dateRange} onChange={setDateRange} />
      </section>

      {error && <div className="rounded-lg border border-destructive/30 bg-destructive/10 px-4 py-3 text-sm text-destructive">Não foi possível atualizar os indicadores. Verifique sua sessão e tente novamente.</div>}
      <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">{cards.map(({ label, value, detail, icon: Icon, tone }) => <Card key={label} className="border-border/70 bg-card shadow-sm"><CardContent className="p-5"><div className="flex items-start justify-between"><span className={`rounded-lg bg-muted p-2.5 ${tone}`}><Icon className="h-5 w-5" /></span><Badge variant="secondary">Base atual</Badge></div><p className="mt-5 text-sm text-muted-foreground">{label}</p><p className="mt-1 text-2xl font-semibold tracking-tight">{value}</p><p className="mt-1 text-xs text-muted-foreground">{detail}</p></CardContent></Card>)}</section>

      <section className="grid gap-6 xl:grid-cols-[1.6fr_1fr]"><InteractiveChart title="Base operacional atual" data={chartData} type="bar" dataKeys={[{ key: "value", label: "Registros", color: "hsl(var(--primary))" }]} /><Card className="border-border/70 shadow-sm"><CardHeader className="flex flex-row items-center justify-between"><CardTitle className="text-base">Acompanhe agora</CardTitle><Activity className="h-4 w-4 text-muted-foreground" /></CardHeader><CardContent className="space-y-3">{[{ title: "Propostas aguardando análise", value: number(kpis?.propostas?.pendentes), href: "/dashboard/propostas/pendentes", icon: FileText }, { title: "Recebíveis vencidos", value: money(kpis?.recebiveis?.vencido), href: "/dashboard/financeiro/contas-receber", icon: Landmark }, { title: "Contas a pagar liquidadas", value: `${number(kpis?.pagamentos?.pago)} de ${number(kpis?.pagamentos?.total)}`, href: "/dashboard/financeiro/contas-pagar", icon: BriefcaseBusiness }].map(({ title, value, href, icon: Icon }) => <a href={href} key={title} className="flex items-center gap-3 rounded-lg border border-border/60 p-3 transition hover:bg-muted"><span className="rounded-md bg-primary/10 p-2 text-primary"><Icon className="h-4 w-4" /></span><span className="flex-1 text-sm text-muted-foreground">{title}</span><strong className="text-sm">{value}</strong><ArrowUpRight className="h-4 w-4 text-muted-foreground" /></a>)}</CardContent></Card></section>

      <section className="grid gap-4 md:grid-cols-3"><Card className="border-border/70 bg-primary text-primary-foreground md:col-span-2"><CardContent className="flex flex-col justify-between gap-4 p-6 sm:flex-row sm:items-center"><div><p className="text-sm font-medium text-primary-foreground/70">Leitura executiva</p><h2 className="mt-1 text-xl font-semibold">Acompanhe o ciclo completo da operação</h2><p className="mt-1 text-sm text-primary-foreground/75">Da proposta ao beneficiário, contrato e recebimento.</p></div><Button variant="secondary" asChild><a href="/dashboard/relatorios/inteligentes">Abrir análises</a></Button></CardContent></Card><Card className="border-border/70 shadow-sm"><CardContent className="flex items-center gap-4 p-6"><div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary text-lg font-semibold text-primary-foreground">{userName.split(" ").map((part: string) => part[0]).join("").slice(0, 2).toUpperCase()}</div><div><p className="text-sm text-muted-foreground">Seu acesso</p><p className="font-semibold">{session?.user?.role_nome || "Gestor"}</p><a className="text-sm text-primary hover:underline" href="/dashboard/perfil">Editar perfil</a></div></CardContent></Card></section>
    </div>
  )
}
