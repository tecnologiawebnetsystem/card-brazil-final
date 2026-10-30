"use client"

import { useEffect, useMemo, useState } from "react"
import { AlertCircle, Check, Loader2, Menu, Power, ShieldCheck } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Switch } from "@/components/ui/switch"

type MenuConfig = {
  id: number
  titulo: string
  rota: string | null
  modulo_nome: string
  ativo_global: boolean
}

type ApiState = "loading" | "ready" | "forbidden" | "error"

export default function ControleAcessoPage() {
  const [menus, setMenus] = useState<MenuConfig[]>([])
  const [search, setSearch] = useState("")
  const [state, setState] = useState<ApiState>("loading")
  const [error, setError] = useState<string | null>(null)
  const [savingId, setSavingId] = useState<number | null>(null)
  const [message, setMessage] = useState<string | null>(null)

  async function loadMenus() {
    setState("loading")
    setError(null)
    try {
      const response = await fetch("/api/sistemas/menu-configuracao", { credentials: "same-origin", cache: "no-store" })
      const data = await response.json()
      if (response.status === 403) {
        setState("forbidden")
        return
      }
      if (!response.ok) throw new Error(data.error || "Não foi possível carregar os menus.")
      setMenus(data.menus || [])
      setState("ready")
    } catch (cause) {
      setState("error")
      setError(cause instanceof Error ? cause.message : "Não foi possível carregar os menus.")
    }
  }

  useEffect(() => { void loadMenus() }, [])

  async function toggleMenu(menu: MenuConfig) {
    setSavingId(menu.id)
    setError(null)
    setMessage(null)
    try {
      const response = await fetch("/api/sistemas/menu-configuracao", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "same-origin",
        body: JSON.stringify({ menuId: menu.id, ativoGlobal: !menu.ativo_global }),
      })
      const data = await response.json()
      if (response.status === 403) {
        setState("forbidden")
        return
      }
      if (!response.ok) throw new Error(data.error || "Não foi possível atualizar o menu.")
      setMenus((current) => current.map((item) => item.id === menu.id ? { ...item, ativo_global: !item.ativo_global } : item))
      setMessage(`“${menu.titulo}” foi ${menu.ativo_global ? "desativado" : "ativado"}.`)
    } catch (cause) {
      setError(cause instanceof Error ? cause.message : "Não foi possível atualizar o menu.")
    } finally {
      setSavingId(null)
    }
  }

  const filteredMenus = useMemo(() => {
    const term = search.trim().toLowerCase()
    if (!term) return menus
    return menus.filter((menu) => `${menu.titulo} ${menu.modulo_nome} ${menu.rota || ""}`.toLowerCase().includes(term))
  }, [menus, search])
  const groupedMenus = useMemo(() => Array.from(new Map(filteredMenus.map((menu) => [menu.modulo_nome, filteredMenus.filter((item) => item.modulo_nome === menu.modulo_nome)])).entries()), [filteredMenus])
  const activeCount = menus.filter((menu) => menu.ativo_global).length

  if (state === "forbidden") {
    return <main className="flex min-h-full flex-1 items-center justify-center p-6"><Card className="max-w-md border-destructive/20"><CardContent className="flex flex-col items-center p-8 text-center"><AlertCircle className="h-10 w-10 text-destructive" /><h1 className="mt-4 font-heading text-xl font-semibold">Acesso restrito</h1><p className="mt-2 text-sm leading-6 text-muted-foreground">Somente o Administrador do Sistema pode ativar ou desativar itens do menu.</p></CardContent></Card></main>
  }

  if (state === "error") {
    return <main className="flex min-h-full flex-1 items-center justify-center p-6"><Card className="max-w-md"><CardContent className="flex flex-col items-center p-8 text-center"><AlertCircle className="h-10 w-10 text-destructive" /><h1 className="mt-4 font-heading text-xl font-semibold">Não foi possível carregar</h1><p className="mt-2 text-sm text-muted-foreground">{error}</p><Button className="mt-5" onClick={() => void loadMenus()}>Tentar novamente</Button></CardContent></Card></main>
  }

  return <main className="module-page flex-1 space-y-6 p-4 md:p-6 lg:p-8">
    <header className="flex flex-col justify-between gap-5 border-b border-border/70 pb-7 lg:flex-row lg:items-end">
      <div className="max-w-2xl"><p className="mb-2 flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.18em] text-primary"><ShieldCheck className="h-4 w-4" /> Administração do sistema</p><h1 className="font-heading text-3xl font-semibold tracking-tight text-foreground sm:text-4xl">Ativação de menus</h1><p className="mt-2 text-sm leading-6 text-muted-foreground sm:text-base">Ative ou desative itens do menu globalmente durante a implantação e os testes de produção.</p></div>
      <Badge variant="secondary" className="w-fit gap-2 px-3 py-2"><Power className="h-4 w-4 text-primary" /> {activeCount} de {menus.length} ativos</Badge>
    </header>

    {message && <div role="status" className="flex items-center gap-2 rounded-lg border border-primary/20 bg-primary/5 px-4 py-3 text-sm text-foreground"><Check className="h-4 w-4 text-primary" />{message}</div>}
    {error && <div role="alert" className="rounded-lg border border-destructive/20 bg-destructive/5 px-4 py-3 text-sm text-destructive">{error}</div>}

    <Card className="border-border/70 shadow-sm"><CardHeader className="gap-4 border-b border-border/70"><div className="flex items-start gap-3"><div className="flex h-10 w-10 items-center justify-center rounded-xl bg-accent text-primary"><Menu className="h-5 w-5" /></div><div><CardTitle>Itens disponíveis</CardTitle><CardDescription>Essa alteração vale para todos os usuários da administradora. Permissões de perfil continuam sendo aplicadas separadamente.</CardDescription></div></div><Input value={search} onChange={(event) => setSearch(event.target.value)} placeholder="Buscar por nome, módulo ou rota..." aria-label="Buscar item do menu" /></CardHeader><CardContent className="space-y-6 p-4 sm:p-6">
      {state === "loading" && <div className="flex items-center justify-center gap-2 py-12 text-sm text-muted-foreground"><Loader2 className="h-4 w-4 animate-spin" /> Carregando menus...</div>}
      {state === "ready" && groupedMenus.map(([moduleName, moduleMenus]) => <section key={moduleName}><div className="mb-2 flex items-center justify-between"><h2 className="text-sm font-semibold text-foreground">{moduleName}</h2><span className="text-xs text-muted-foreground">{moduleMenus.filter((menu) => menu.ativo_global).length}/{moduleMenus.length} ativos</span></div><div className="divide-y rounded-xl border border-border/70">{moduleMenus.map((menu) => <div key={menu.id} className="flex items-center justify-between gap-4 px-4 py-4"><div className="min-w-0"><p className="truncate text-sm font-medium text-foreground">{menu.titulo}</p><p className="truncate text-xs text-muted-foreground">{menu.rota || "Item agrupador"}</p></div><div className="flex shrink-0 items-center gap-3"><span className={`hidden text-xs font-medium sm:inline ${menu.ativo_global ? "text-primary" : "text-muted-foreground"}`}>{menu.ativo_global ? "Ativo" : "Desativado"}</span><Switch checked={menu.ativo_global} disabled={savingId === menu.id} onCheckedChange={() => void toggleMenu(menu)} aria-label={`${menu.ativo_global ? "Desativar" : "Ativar"} ${menu.titulo}`} /></div></div>)}</div></section>)}
      {state === "ready" && filteredMenus.length === 0 && <div className="py-12 text-center text-sm text-muted-foreground">Nenhum item encontrado para “{search}”.</div>}
    </CardContent></Card>
  </main>
}
