"use client"

import { useEffect, useMemo, useState } from "react"
import { AlertCircle, ArchiveRestore, Check, ChevronDown, ChevronRight, Clock3, Eye, History, Loader2, Menu, Power, Save, Search, ShieldCheck, Sparkles } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Switch } from "@/components/ui/switch"

 type MenuConfig = { id: number; titulo: string; rota: string | null; moduloId: number; moduloNome: string; moduloDescricao: string | null; menuPaiId: number | null; ativoGlobal: boolean }
 type ModuleConfig = { id: number; nome: string; descricao: string | null; totalMenus: number; activeMenus: number }
 type HistoryItem = { id: number; registroId: number; acao: string; createdAt: string; dadosAnteriores: { ativoGlobal?: boolean } | null; dadosNovos: { ativoGlobal?: boolean; restored?: boolean } | null }
 type ApiState = "loading" | "ready" | "forbidden" | "error"
 type StatIcon = typeof Menu
 type Stat = { label: string; value: number; Icon: StatIcon }

export default function ControleAcessoPage() {
  const [menus, setMenus] = useState<MenuConfig[]>([])
  const [modules, setModules] = useState<ModuleConfig[]>([])
  const [draft, setDraft] = useState<Record<number, boolean>>({})
  const [expanded, setExpanded] = useState<Record<number, boolean>>({})
  const [search, setSearch] = useState("")
  const [state, setState] = useState<ApiState>("loading")
  const [error, setError] = useState<string | null>(null)
  const [message, setMessage] = useState<string | null>(null)
  const [busy, setBusy] = useState(false)
  const [view, setView] = useState<"modules" | "preview" | "history">("modules")
  const [history, setHistory] = useState<HistoryItem[]>([])

  async function loadMenus() {
    setState("loading"); setError(null)
    try {
      const response = await fetch("/api/sistemas/menu-configuracao", { credentials: "same-origin", cache: "no-store" })
      const data = await response.json()
      if (response.status === 403) { setState("forbidden"); return }
      if (!response.ok) throw new Error(data.error || "Não foi possível carregar a configuração.")
      setMenus(data.menus || []); setModules(data.modules || [])
      setDraft(Object.fromEntries((data.menus || []).map((item: MenuConfig) => [item.id, item.ativoGlobal])))
      setState("ready")
    } catch (cause) { setState("error"); setError(cause instanceof Error ? cause.message : "Não foi possível carregar a configuração.") }
  }

  async function loadHistory() {
    const response = await fetch("/api/sistemas/menu-configuracao?view=history", { credentials: "same-origin", cache: "no-store" })
    const data = await response.json()
    if (!response.ok) throw new Error(data.error || "Não foi possível carregar o histórico.")
    setHistory(data.history || [])
  }

  useEffect(() => { void loadMenus() }, [])
  useEffect(() => { if (view === "history") void loadHistory().catch((cause) => setError(cause instanceof Error ? cause.message : "Não foi possível carregar o histórico.")) }, [view])

  const filteredMenus = useMemo(() => {
    const term = search.trim().toLowerCase()
    if (!term) return menus
    return menus.filter((menu) => `${menu.titulo} ${menu.moduloNome} ${menu.rota || ""}`.toLowerCase().includes(term))
  }, [menus, search])
  const pendingCount = menus.filter((menu) => draft[menu.id] !== menu.ativoGlobal).length
  const activeCount = menus.filter((menu) => draft[menu.id]).length
  const moduleGroups = useMemo(() => modules.map((module) => ({ module, items: filteredMenus.filter((menu) => menu.moduloId === module.id) })).filter(({ items }) => items.length > 0 || !search), [filteredMenus, modules, search])

  function toggleMenu(id: number, value: boolean) { setDraft((current) => ({ ...current, [id]: value })); setMessage(null) }
  function toggleModule(module: ModuleConfig, value: boolean) { setDraft((current) => ({ ...current, ...Object.fromEntries(menus.filter((menu) => menu.moduloId === module.id).map((menu) => [menu.id, value])) })); setMessage(null) }

  async function save() {
    const items = menus.filter((menu) => draft[menu.id] !== menu.ativoGlobal).map((menu) => ({ menuId: menu.id, ativoGlobal: draft[menu.id] }))
    if (!items.length) return
    setBusy(true); setError(null); setMessage(null)
    try {
      const response = await fetch("/api/sistemas/menu-configuracao", { method: "POST", headers: { "Content-Type": "application/json" }, credentials: "same-origin", body: JSON.stringify({ items }) })
      const data = await response.json()
      if (!response.ok) throw new Error(data.error || "Não foi possível salvar as alterações.")
      setMenus((current) => current.map((menu) => ({ ...menu, ativoGlobal: draft[menu.id] })))
      setMessage(`${data.updated} alteração(ões) salvas. O menu global será atualizado no próximo carregamento.`)
    } catch (cause) { setError(cause instanceof Error ? cause.message : "Não foi possível salvar as alterações.") } finally { setBusy(false) }
  }

  async function restore() {
    if (!window.confirm("Restaurar toda a navegação desta administradora para o catálogo padrão? Essa ação será registrada no histórico.")) return
    setBusy(true); setError(null)
    try {
      const response = await fetch("/api/sistemas/menu-configuracao", { method: "DELETE", credentials: "same-origin" }); const data = await response.json()
      if (!response.ok) throw new Error(data.error || "Não foi possível restaurar a configuração.")
      setDraft(Object.fromEntries(menus.map((menu) => [menu.id, true]))); setMenus((current) => current.map((menu) => ({ ...menu, ativoGlobal: true }))); setMessage(`Configuração padrão restaurada para ${data.restored} item(ns).`)
    } catch (cause) { setError(cause instanceof Error ? cause.message : "Não foi possível restaurar a configuração.") } finally { setBusy(false) }
  }

  if (state === "forbidden") return <main className="flex min-h-full flex-1 items-center justify-center p-6"><Card className="max-w-md"><CardContent className="flex flex-col items-center p-8 text-center"><AlertCircle className="size-10 text-destructive" /><h1 className="mt-4 font-heading text-xl font-semibold">Acesso restrito</h1><p className="mt-2 text-sm leading-6 text-muted-foreground">Somente administradores podem gerenciar a navegação da administradora autenticada.</p></CardContent></Card></main>
  if (state === "error") return <main className="flex min-h-full flex-1 items-center justify-center p-6"><Card className="max-w-md"><CardContent className="flex flex-col items-center p-8 text-center"><AlertCircle className="size-10 text-destructive" /><h1 className="mt-4 font-heading text-xl font-semibold">Não foi possível carregar</h1><p className="mt-2 text-sm text-muted-foreground">{error}</p><Button className="mt-5" onClick={() => void loadMenus()}>Tentar novamente</Button></CardContent></Card></main>

  const stats: Stat[] = [
    { label: "Módulos", value: modules.length, Icon: Menu },
    { label: "Ativos", value: activeCount, Icon: Power },
    { label: "Inativos", value: menus.length - activeCount, Icon: AlertCircle },
    { label: "Funcionalidades", value: menus.length, Icon: Sparkles },
    { label: "Alterações pendentes", value: pendingCount, Icon: Clock3 },
  ]

  return <main className="module-page flex-1 space-y-6 p-4 md:p-6 lg:p-8">
    <header className="flex flex-col justify-between gap-5 border-b border-border/70 pb-7 lg:flex-row lg:items-end"><div className="max-w-3xl"><p className="mb-2 flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.18em] text-primary"><ShieldCheck className="size-4" /> Governança da plataforma</p><h1 className="font-heading text-3xl font-semibold tracking-tight text-foreground sm:text-4xl">Gestão de Módulos e Navegação</h1><p className="mt-2 text-sm leading-6 text-muted-foreground sm:text-base">Configure a disponibilidade do catálogo para a administradora autenticada sem alterar permissões individuais.</p></div><div className="flex flex-wrap gap-2"><Button variant="outline" onClick={restore} disabled={busy}><ArchiveRestore data-icon="inline-start" /> Restaurar padrão</Button><Button onClick={save} disabled={busy || pendingCount === 0}>{busy ? <Loader2 className="animate-spin" data-icon="inline-start" /> : <Save data-icon="inline-start" />} Salvar {pendingCount > 0 ? `(${pendingCount})` : ""}</Button></div></header>
    {message && <div role="status" className="flex items-center gap-2 rounded-lg border border-primary/20 bg-primary/5 px-4 py-3 text-sm"><Check className="size-4 text-primary" /> {message}</div>}
    {error && <div role="alert" className="rounded-lg border border-destructive/20 bg-destructive/5 px-4 py-3 text-sm text-destructive">{error}</div>}
    <section className="grid gap-3 sm:grid-cols-2 lg:grid-cols-5">{stats.map(({ label, value, Icon }) => <Card key={String(label)} className="border-border/70"><CardContent className="flex items-center justify-between p-4"><div><p className="text-xs text-muted-foreground">{label}</p><p className="mt-1 text-2xl font-semibold tracking-tight">{value}</p></div><div className="rounded-xl bg-accent p-2.5 text-primary"><Icon className="size-5" /></div></CardContent></Card>)}</section>
    <div className="flex flex-wrap items-center justify-between gap-3"><div className="flex gap-1 rounded-lg border border-border/70 bg-muted/30 p-1"><Button variant={view === "modules" ? "secondary" : "ghost"} size="sm" onClick={() => setView("modules")}>Módulos</Button><Button variant={view === "preview" ? "secondary" : "ghost"} size="sm" onClick={() => setView("preview")}><Eye data-icon="inline-start" /> Prévia</Button><Button variant={view === "history" ? "secondary" : "ghost"} size="sm" onClick={() => setView("history")}><History data-icon="inline-start" /> Histórico</Button></div><div className="relative w-full sm:w-80"><Search className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" /><Input className="pl-9" value={search} onChange={(event) => setSearch(event.target.value)} placeholder="Buscar módulo, item ou rota..." aria-label="Buscar módulo, item ou rota" /></div></div>
    {view === "history" ? <Card><CardHeader><CardTitle>Histórico de alterações</CardTitle><CardDescription>Registro somente leitura da administradora autenticada.</CardDescription></CardHeader><CardContent>{history.length === 0 ? <p className="py-10 text-center text-sm text-muted-foreground">Nenhuma alteração registrada.</p> : <div className="divide-y">{history.map((item) => <div className="flex items-center justify-between gap-4 py-3" key={item.id}><div><p className="text-sm font-medium">Item #{item.registroId} · {item.dadosNovos?.restored ? "restauração padrão" : "configuração alterada"}</p><p className="text-xs text-muted-foreground">{new Date(item.createdAt).toLocaleString("pt-BR")}</p></div><Badge variant="outline">{item.dadosAnteriores?.ativoGlobal ? "Ativo" : "Inativo"} → {item.dadosNovos?.ativoGlobal ? "Ativo" : "Inativo"}</Badge></div>)}</div>}</CardContent></Card> : <Card className="border-border/70 shadow-sm"><CardHeader className="border-b border-border/70"><div className="flex items-start gap-3"><div className="rounded-xl bg-accent p-2.5 text-primary"><Menu className="size-5" /></div><div><CardTitle>{view === "preview" ? "Pré-visualização do menu" : "Catálogo de módulos"}</CardTitle><CardDescription>{view === "preview" ? "Esta prévia considera as alterações pendentes e não altera a navegação real." : "Ative ou desative itens do catálogo real. Permissões de perfil continuam sendo verificadas separadamente."}</CardDescription></div></div></CardHeader><CardContent className="flex flex-col gap-4 p-4 sm:p-6">{state === "loading" ? <div className="flex items-center justify-center gap-2 py-12 text-sm text-muted-foreground"><Loader2 className="size-4 animate-spin" /> Carregando catálogo...</div> : moduleGroups.map(({ module, items }) => { const active = items.filter((item) => draft[item.id]).length; return <section key={module.id} className="overflow-hidden rounded-xl border border-border/70"><div className="flex items-center justify-between gap-3 bg-muted/20 px-4 py-3"><button className="flex min-w-0 items-center gap-2 text-left" onClick={() => setExpanded((current) => ({ ...current, [module.id]: !current[module.id] }))} aria-expanded={expanded[module.id] ?? true}>{expanded[module.id] ?? true ? <ChevronDown className="size-4" /> : <ChevronRight className="size-4" />}<span className="truncate text-sm font-semibold">{module.nome}</span><Badge variant="secondary">{active}/{items.length}</Badge></button><Switch checked={active === items.length} onCheckedChange={(value) => toggleModule(module, value)} aria-label={`${active === items.length ? "Desativar" : "Ativar"} módulo ${module.nome}`} /></div>{(expanded[module.id] ?? true) && <div className="divide-y">{items.map((menu) => <div key={menu.id} className="flex items-center justify-between gap-4 px-4 py-3.5"><div className="min-w-0 pl-6"><p className="truncate text-sm font-medium">{menu.titulo}</p><p className="truncate text-xs text-muted-foreground">{menu.rota || "Item agrupador"}{menu.menuPaiId ? " · submenu" : ""}</p></div>{view === "preview" ? <Badge variant={draft[menu.id] ? "default" : "outline"}>{draft[menu.id] ? "Visível" : "Oculto"}</Badge> : <div className="flex shrink-0 items-center gap-3"><span className="hidden text-xs text-muted-foreground sm:inline">{draft[menu.id] ? "Ativo" : "Inativo"}</span><Switch checked={draft[menu.id]} onCheckedChange={(value) => toggleMenu(menu.id, value)} aria-label={`${draft[menu.id] ? "Desativar" : "Ativar"} ${menu.titulo}`} /></div>}</div>)}</div>}</section> })}</CardContent></Card>}
  </main>
}
