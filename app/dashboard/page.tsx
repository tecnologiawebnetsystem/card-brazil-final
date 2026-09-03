"use client"

import useSWR from "swr"
import { Activity, ArrowUpRight, BriefcaseBusiness, FileText, HeartPulse, Users } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { DateRangePicker } from "@/components/dashboard/date-range-picker"
import { InteractiveChart } from "@/components/dashboard/interactive-chart"
import { useState } from "react"

const fetcher = (url: string) => fetch(url, { credentials: "include" }).then((r) => r.json())

export default function DashboardPage() {
  const { data } = useSWR("/api/auth/me", fetcher)
  const [dateRange, setDateRange] = useState({ from: new Date(new Date().getFullYear(), 0, 1), to: new Date() })
  const userName = data?.user?.nome || data?.user?.nome_completo || "gestor"
  const initials = userName.split(" ").map((part: string) => part[0]).join("").slice(0, 2).toUpperCase()
  const chartData = [
    { name: "Jan", value: 42, comparison: 34 }, { name: "Fev", value: 55, comparison: 43 },
    { name: "Mar", value: 48, comparison: 45 }, { name: "Abr", value: 68, comparison: 51 },
    { name: "Mai", value: 74, comparison: 58 }, { name: "Jun", value: 86, comparison: 64 },
  ]

  return (
    <div className="mx-auto w-full max-w-[1500px] space-y-6">
      <section className="flex flex-col justify-between gap-4 border-b border-border pb-6 md:flex-row md:items-end">
        <div>
          <p className="mb-2 text-sm font-medium uppercase tracking-[0.18em] text-primary">Talent · Visão geral</p>
          <h1 className="text-3xl font-semibold tracking-tight text-foreground md:text-4xl">Bom dia, {userName.split(" ")[0]}</h1>
          <p className="mt-2 text-muted-foreground">Acompanhe a operação e tome decisões com clareza.</p>
        </div>
        <DateRangePicker value={dateRange} onChange={setDateRange} />
      </section>

      <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        {[
          { label: "Beneficiários ativos", value: "12.486", change: "+8,4%", icon: Users, tone: "text-primary" },
          { label: "Propostas no mês", value: "284", change: "+12,8%", icon: FileText, tone: "text-info" },
          { label: "Taxa de conversão", value: "68,2%", change: "+4,1%", icon: Activity, tone: "text-success" },
          { label: "Carteira vigente", value: "R$ 1,84 mi", change: "+9,6%", icon: BriefcaseBusiness, tone: "text-warning" },
        ].map(({ label, value, change, icon: Icon, tone }) => (
          <Card key={label} className="border-border/70 bg-card shadow-sm transition hover:-translate-y-0.5 hover:shadow-md">
            <CardContent className="p-5">
              <div className="flex items-start justify-between"><span className={`rounded-lg bg-muted p-2.5 ${tone}`}><Icon className="h-5 w-5" /></span><Badge variant="secondary" className="text-success">{change}</Badge></div>
              <p className="mt-5 text-sm text-muted-foreground">{label}</p><p className="mt-1 text-2xl font-semibold tracking-tight">{value}</p>
            </CardContent>
          </Card>
        ))}
      </section>

      <section className="grid gap-6 xl:grid-cols-[1.6fr_1fr]">
        <InteractiveChart title="Crescimento da carteira" data={chartData} type="bar" dataKeys={[{ key: "value", label: "Atual", color: "hsl(var(--primary))" }, { key: "comparison", label: "Período anterior", color: "hsl(var(--muted-foreground))" }]} />
        <Card className="border-border/70 shadow-sm"><CardHeader className="flex flex-row items-center justify-between"><CardTitle className="text-base">Acompanhe agora</CardTitle><Button variant="ghost" size="sm" asChild><a href="/dashboard/propostas/pendentes">Ver tudo <ArrowUpRight className="ml-1 h-4 w-4" /></a></Button></CardHeader><CardContent className="space-y-4">
          {[{ title: "Propostas aguardando análise", value: "18", href: "/dashboard/propostas/pendentes", icon: FileText }, { title: "Novos beneficiários", value: "42", href: "/dashboard/pessoas", icon: Users }, { title: "Contratos a revisar", value: "07", href: "/dashboard/propostas/aprovadas", icon: HeartPulse }].map(({ title, value, href, icon: Icon }) => <a href={href} key={title} className="flex items-center gap-3 rounded-lg border border-border/60 p-3 transition hover:bg-muted"><span className="rounded-md bg-primary/10 p-2 text-primary"><Icon className="h-4 w-4" /></span><span className="flex-1 text-sm text-muted-foreground">{title}</span><strong>{value}</strong><ArrowUpRight className="h-4 w-4 text-muted-foreground" /></a>)}
        </CardContent></Card>
      </section>

      <section className="grid gap-4 md:grid-cols-3"><Card className="border-border/70 bg-primary text-primary-foreground md:col-span-2"><CardContent className="flex flex-col justify-between gap-4 p-6 sm:flex-row sm:items-center"><div><p className="text-sm font-medium text-primary-foreground/70">Próximo passo</p><h2 className="mt-1 text-xl font-semibold">Revise as propostas pendentes</h2><p className="mt-1 text-sm text-primary-foreground/75">Mantenha sua operação em dia e acelere as aprovações.</p></div><Button variant="secondary" asChild><a href="/dashboard/propostas/pendentes">Abrir pendências</a></Button></CardContent></Card><Card className="border-border/70 shadow-sm"><CardContent className="flex items-center gap-4 p-6"><div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary text-lg font-semibold text-primary-foreground">{initials}</div><div><p className="text-sm text-muted-foreground">Seu acesso</p><p className="font-semibold">{data?.user?.role_nome || "Gestor"}</p><a className="text-sm text-primary hover:underline" href="/dashboard/perfil">Editar perfil</a></div></CardContent></Card></section>
    </div>
  )
}
