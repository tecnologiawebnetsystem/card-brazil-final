"use client"

import { useEffect, useMemo, useState } from "react"
import { useRouter } from "next/navigation"
import { Activity, ArrowRight, CalendarDays, FileText, Plus, RefreshCw, ShieldCheck, Users } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"

type Proposta = { id: number; nome_proponente: string; empresa?: string; tipo_plano: string; valor_proposto?: number; status: string; created_at: string }
type Fatura = { id: number; proposta_id: number; competencia: string; vencimento: string; valor_total: number; status: string }

const statusLabel: Record<string, string> = { pendente: "Pendente", em_analise: "Em análise", aprovada: "Aprovada", rejeitada: "Rejeitada", contrato_gerado: "Implantada" }
const money = (value: number) => `R$ ${Number(value || 0).toLocaleString("pt-BR", { minimumFractionDigits: 2 })}`

export default function ListaPropostasPage() {
  const router = useRouter()
  const [propostas, setPropostas] = useState<Proposta[]>([])
  const [faturas, setFaturas] = useState<Fatura[]>([])
  const [search, setSearch] = useState("")
  const [status, setStatus] = useState("todos")
  const [loading, setLoading] = useState(true)

  async function load() {
    setLoading(true)
    const params = new URLSearchParams()
    if (search) params.set("search", search)
    if (status !== "todos") params.set("status", status)
    const [propostasResponse, faturasResponse] = await Promise.all([fetch(`/api/propostas?${params}`), fetch("/api/propostas/faturas")])
    const propostasData = await propostasResponse.json()
    const faturasData = await faturasResponse.json()
    setPropostas(propostasData.data || [])
    setFaturas(faturasData.data || [])
    setLoading(false)
  }

  useEffect(() => { load() }, [status])
  const filtered = useMemo(() => propostas.filter((item) => `${item.nome_proponente} ${item.empresa || ""}`.toLowerCase().includes(search.toLowerCase())), [propostas, search])
  const abertas = faturas.filter((fatura) => ["aberta", "enviada", "vencida"].includes(fatura.status))
  const totalMensal = propostas.filter((p) => p.status === "aprovada").reduce((sum, p) => sum + Number(p.valor_proposto || 0), 0)
  const indicadores = [
    { label: "Propostas ativas", value: propostas.filter((p) => p.status !== "rejeitada").length, Icon: FileText },
    { label: "Vidas em análise", value: "—", Icon: Users },
    { label: "Mensalidade aprovada", value: money(totalMensal), Icon: ShieldCheck },
    { label: "Faturas em aberto", value: abertas.length, Icon: CalendarDays },
  ]

  return <main className="module-page flex-1 space-y-6 p-4 md:p-6">
    <header className="flex flex-col justify-between gap-4 md:flex-row md:items-center">
      <div><div className="mb-2 flex items-center gap-2 text-sm text-muted-foreground"><Activity className="size-4 text-primary" /> Operação de saúde suplementar</div><h1 className="text-3xl font-bold tracking-tight">Propostas de saúde</h1><p className="text-muted-foreground">Da cotação à implantação, com faturamento mensal por competência.</p></div>
      <Button onClick={() => router.push("/dashboard/propostas/nova")}><Plus data-icon="inline-start" /> Nova proposta</Button>
    </header>

    <section className="grid gap-4 md:grid-cols-4">
      {indicadores.map(({ label, value, Icon }) => <Card key={label}><CardContent className="flex items-center justify-between p-5"><div><p className="text-sm text-muted-foreground">{label}</p><p className="mt-1 text-2xl font-semibold">{value}</p></div><Icon className="size-5 text-primary" /></CardContent></Card>)}
    </section>

    <Card><CardHeader className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between"><div><CardTitle>Pipeline comercial</CardTitle><CardDescription>Acompanhe propostas, vidas e implantação sem parcelas.</CardDescription></div><div className="flex flex-col gap-2 sm:flex-row"><Input value={search} onChange={(event) => setSearch(event.target.value)} placeholder="Buscar empresa ou proponente" /><Select value={status} onValueChange={setStatus}><SelectTrigger className="w-full sm:w-44"><SelectValue placeholder="Status" /></SelectTrigger><SelectContent><SelectItem value="todos">Todos os status</SelectItem><SelectItem value="pendente">Pendente</SelectItem><SelectItem value="em_analise">Em análise</SelectItem><SelectItem value="aprovada">Aprovada</SelectItem><SelectItem value="rejeitada">Rejeitada</SelectItem></SelectContent></Select><Button variant="outline" size="icon" onClick={load} aria-label="Atualizar"><RefreshCw className="size-4" /></Button></div></CardHeader><CardContent>{loading ? <div className="py-12 text-center text-muted-foreground">Carregando operação...</div> : <Table><TableHeader><TableRow><TableHead>Proposta</TableHead><TableHead>Contratante</TableHead><TableHead>Produto de saúde</TableHead><TableHead>Mensalidade</TableHead><TableHead>Status</TableHead><TableHead className="text-right">Ação</TableHead></TableRow></TableHeader><TableBody>{filtered.map((item) => <TableRow key={item.id}><TableCell className="font-medium">PROP-{String(item.id).padStart(4, "0")}</TableCell><TableCell><div>{item.empresa || item.nome_proponente}</div><div className="text-xs text-muted-foreground">{item.nome_proponente}</div></TableCell><TableCell>{item.tipo_plano}</TableCell><TableCell>{money(Number(item.valor_proposto))}</TableCell><TableCell><Badge variant={item.status === "aprovada" ? "default" : "secondary"}>{statusLabel[item.status] || item.status}</Badge></TableCell><TableCell className="text-right"><Button variant="ghost" size="sm" onClick={() => router.push(`/dashboard/propostas/analise?id=${item.id}`)}>Abrir <ArrowRight data-icon="inline-end" /></Button></TableCell></TableRow>)}{!filtered.length && <TableRow><TableCell colSpan={6} className="py-12 text-center text-muted-foreground">Nenhuma proposta encontrada.</TableCell></TableRow>}</TableBody></Table>}</CardContent></Card>

    <Card><CardHeader><CardTitle>Faturamento mensal</CardTitle><CardDescription>Faturas por competência — não são parcelas.</CardDescription></CardHeader><CardContent><Table><TableHeader><TableRow><TableHead>Competência</TableHead><TableHead>Proposta</TableHead><TableHead>Vencimento</TableHead><TableHead>Valor</TableHead><TableHead>Status</TableHead></TableRow></TableHeader><TableBody>{faturas.slice(0, 8).map((fatura) => <TableRow key={fatura.id}><TableCell>{new Date(`${fatura.competencia}T12:00:00`).toLocaleDateString("pt-BR", { month: "long", year: "numeric" })}</TableCell><TableCell>PROP-{String(fatura.proposta_id).padStart(4, "0")}</TableCell><TableCell>{new Date(`${fatura.vencimento}T12:00:00`).toLocaleDateString("pt-BR")}</TableCell><TableCell>{money(Number(fatura.valor_total))}</TableCell><TableCell><Badge variant={fatura.status === "paga" ? "default" : "outline"}>{fatura.status}</Badge></TableCell></TableRow>)}{!faturas.length && <TableRow><TableCell colSpan={5} className="py-8 text-center text-muted-foreground">As faturas mensais aparecerão aqui após a aprovação da proposta.</TableCell></TableRow>}</TableBody></Table></CardContent></Card>
  </main>
}
