"use client"

import Link from "next/link"
import useSWR from "swr"
import {
  ArrowRight,
  Building2,
  BriefcaseBusiness,
  CheckCircle2,
  CircleUserRound,
  ContactRound,
  FileSpreadsheet,
  Layers3,
  Network,
  Package,
  PersonStanding,
  Plus,
  ShieldCheck,
  UsersRound,
} from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"

const fetcher = async (url: string) => {
  const response = await fetch(url)
  if (!response.ok) throw new Error("Não foi possível carregar os dados")
  return response.json()
}

type Cadastro = {
  title: string
  description: string
  href: string
  icon: typeof Building2
  endpoint?: string
  tone: "blue" | "teal" | "violet" | "coral"
}

const cadastros: Cadastro[] = [
  { title: "Administradora", description: "Dados institucionais, identidade e configurações", href: "/dashboard/cadastros/administradora", icon: Building2, endpoint: "/api/administradoras", tone: "blue" },
  { title: "Pessoas", description: "Base de pessoas físicas e jurídicas", href: "/dashboard/pessoas", icon: CircleUserRound, endpoint: "/api/pessoas?status=ativo", tone: "teal" },
  { title: "Operadores", description: "Usuários e acessos à plataforma", href: "/dashboard/configuracoes/usuarios", icon: UsersRound, endpoint: "/api/configuracoes/usuarios", tone: "violet" },
  { title: "Agenciadores", description: "Relacionamento e produção comercial", href: "/dashboard/cadastros/agenciador", icon: Network, endpoint: "/api/agenciadores", tone: "coral" },
  { title: "Corretores", description: "Parceiros e canais de distribuição", href: "/dashboard/cadastros/corretor", icon: ContactRound, endpoint: "/api/corretores", tone: "blue" },
  { title: "Estipulantes", description: "Empresas e contratos coletivos", href: "/dashboard/cadastros/estipulante", icon: BriefcaseBusiness, endpoint: "/api/estipulantes", tone: "teal" },
  { title: "Produtos", description: "Linhas de produtos comercializados", href: "/dashboard/cadastros/produtos", icon: Package, endpoint: "/api/produtos", tone: "violet" },
  { title: "Planos", description: "Planos, coberturas e regras comerciais", href: "/dashboard/cadastros/planos-saude", icon: Layers3, endpoint: "/api/planos", tone: "coral" },
  { title: "Planos por faixa", description: "Valores e composição por idade", href: "/dashboard/cadastros/planos-faixa", icon: FileSpreadsheet, endpoint: "/api/planos-faixas", tone: "blue" },
  { title: "Beneficiários", description: "Titulares, dependentes e carteira ativa", href: "/dashboard/beneficiarios/consulta", icon: PersonStanding, endpoint: "/api/beneficiarios", tone: "teal" },
]

function CadastroCard({ cadastro }: { cadastro: Cadastro }) {
  const { data, isLoading } = useSWR(cadastro.endpoint, fetcher, { revalidateOnFocus: false })
  const Icon = cadastro.icon
  const count = Array.isArray(data?.data) ? data.data.length : null
  const iconTone = {
    blue: "bg-accent text-primary",
    teal: "bg-secondary text-secondary-foreground",
    violet: "bg-muted text-foreground",
    coral: "bg-primary/10 text-primary",
  }[cadastro.tone]

  return (
    <Link href={cadastro.href} className="group block h-full focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2">
      <Card className="relative h-full overflow-hidden border-border/70 bg-card shadow-sm transition-all duration-200 group-hover:-translate-y-0.5 group-hover:border-primary/30 group-hover:shadow-md">
        <CardContent className="flex h-full flex-col p-5">
          <div className="flex items-start justify-between gap-4">
            <div className={`flex h-11 w-11 items-center justify-center rounded-xl ${iconTone}`}>
              <Icon className="h-5 w-5" aria-hidden="true" />
            </div>
            {cadastro.endpoint && (
              <Badge variant="secondary" className="gap-1.5 font-normal">
                <span className={`h-1.5 w-1.5 rounded-full ${isLoading ? "animate-pulse bg-muted-foreground" : "bg-success"}`} />
                {isLoading ? "Carregando" : count === null ? "Consultar" : `${count} registros`}
              </Badge>
            )}
          </div>
          <div className="mt-5 flex-1">
            <h2 className="font-heading text-lg font-semibold tracking-tight text-foreground">{cadastro.title}</h2>
            <p className="mt-1 text-sm leading-5 text-muted-foreground">{cadastro.description}</p>
          </div>
          <div className="mt-5 flex items-center gap-1.5 text-sm font-medium text-primary">
            Abrir cadastro <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
          </div>
        </CardContent>
      </Card>
    </Link>
  )
}

export function CadastrosHub() {
  const totalEndpoints = cadastros.filter((item) => item.endpoint)
  const { data: beneficiarios } = useSWR("/api/beneficiarios", fetcher, { revalidateOnFocus: false })
  const { data: planos } = useSWR("/api/planos", fetcher, { revalidateOnFocus: false })
  const { data: pessoas } = useSWR("/api/pessoas?status=ativo", fetcher, { revalidateOnFocus: false })

  const metrics = [
    { label: "Pessoas ativas", value: Array.isArray(pessoas?.data) ? pessoas.data.length : "—", icon: CircleUserRound },
    { label: "Beneficiários", value: Array.isArray(beneficiarios?.data) ? beneficiarios.data.length : "—", icon: PersonStanding },
    { label: "Planos cadastrados", value: Array.isArray(planos?.data) ? planos.data.length : "—", icon: Layers3 },
    { label: "Módulos disponíveis", value: totalEndpoints.length, icon: ShieldCheck },
  ]

  return (
    <main className="module-page flex-1 space-y-8 p-4 md:p-6 lg:p-8">
      <header className="flex flex-col justify-between gap-5 border-b border-border/70 pb-7 lg:flex-row lg:items-end">
        <div className="max-w-2xl">
          <div className="mb-3 flex items-center gap-2 text-sm font-medium text-primary"><ShieldCheck className="h-4 w-4" /> Gestão cadastral</div>
          <h1 className="font-heading text-3xl font-semibold tracking-tight text-foreground sm:text-4xl">Cadastros</h1>
          <p className="mt-2 text-base leading-6 text-muted-foreground">Centralize os dados que sustentam sua operação. Escolha um módulo para consultar, cadastrar e manter informações atualizadas.</p>
        </div>
        <Button asChild className="shrink-0"><Link href="/dashboard/pessoas"><Plus className="mr-2 h-4 w-4" /> Novo cadastro</Link></Button>
      </header>

      <section aria-label="Resumo dos cadastros" className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
        {metrics.map(({ label, value, icon: Icon }) => (
          <Card key={label} className="border-border/70 shadow-sm">
            <CardContent className="flex items-center gap-4 p-5">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-secondary text-secondary-foreground"><Icon className="h-5 w-5" aria-hidden="true" /></div>
              <div><p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">{label}</p><p className="mt-1 font-heading text-2xl font-semibold text-foreground">{value}</p></div>
            </CardContent>
          </Card>
        ))}
      </section>

      <section>
        <div className="mb-4 flex items-end justify-between gap-4"><div><h2 className="font-heading text-xl font-semibold text-foreground">Módulos de cadastro</h2><p className="mt-1 text-sm text-muted-foreground">Acesse rapidamente cada base de dados.</p></div><p className="hidden text-sm text-muted-foreground sm:block">{cadastros.length} módulos</p></div>
        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">{cadastros.map((cadastro) => <CadastroCard key={cadastro.title} cadastro={cadastro} />)}</div>
      </section>
    </main>
  )
}
