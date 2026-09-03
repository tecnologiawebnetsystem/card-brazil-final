"use client"

import { useCallback, useEffect, useState } from "react"
import { Activity, Calendar, CheckCircle, Clock, Database, Download, RefreshCw, Upload } from "lucide-react"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"

type Sync = { id: number; tipo: string; status: string; registros_enviados: number; registros_recebidos: number; mensagem?: string; iniciado_em?: string; finalizado_em?: string; created_at: string }

const formatDate = (value?: string) => value ? new Date(value).toLocaleString("pt-BR") : "—"

export default function SincronizacaoANSPage() {
  const [history, setHistory] = useState<Sync[]>([])
  const [loading, setLoading] = useState(true)
  const [syncing, setSyncing] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const load = useCallback(async () => {
    setLoading(true)
    try {
      const response = await fetch("/api/sistemas/sincronizacao-ans")
      const data = await response.json()
      if (!response.ok) throw new Error(data.error)
      setHistory(Array.isArray(data) ? data : [])
      setError(null)
    } catch (cause) { setError(cause instanceof Error ? cause.message : "Não foi possível carregar o histórico ANS.") } finally { setLoading(false) }
  }, [])

  useEffect(() => { load() }, [load])

  const startSync = async () => {
    setSyncing(true)
    try {
      const response = await fetch("/api/sistemas/sincronizacao-ans", { method: "POST" })
      const data = await response.json()
      if (!response.ok) throw new Error(data.error)
      setHistory((current) => [data, ...current])
    } catch (cause) { setError(cause instanceof Error ? cause.message : "Não foi possível iniciar a sincronização.") } finally { setSyncing(false) }
  }

  const latest = history[0]
  const sent = history.reduce((total, item) => total + Number(item.registros_enviados || 0), 0)
  const received = history.reduce((total, item) => total + Number(item.registros_recebidos || 0), 0)

  return <main className="flex-1 space-y-6 p-6">
    <header className="flex items-center justify-between gap-4"><div><h1 className="text-3xl font-bold tracking-tight">Sincronização ANS</h1><p className="text-muted-foreground">Histórico real das sincronizações com a Agência Nacional de Saúde Suplementar.</p></div><Button onClick={startSync} disabled={syncing} className="gap-2"><RefreshCw className={syncing ? "h-4 w-4 animate-spin" : "h-4 w-4"} />{syncing ? "Iniciando..." : "Sincronizar Agora"}</Button></header>
    {error && <Alert variant="destructive"><AlertDescription>{error}</AlertDescription></Alert>}
    <div className="grid gap-6 md:grid-cols-4">
      <Card><CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2"><CardTitle className="text-sm font-medium">Última sincronização</CardTitle><Clock className="h-4 w-4 text-muted-foreground" /></CardHeader><CardContent><div className="text-xl font-bold">{latest ? formatDate(latest.created_at) : "—"}</div><p className="text-xs text-muted-foreground">{history.length} registros de histórico</p></CardContent></Card>
      <Card><CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2"><CardTitle className="text-sm font-medium">Status</CardTitle><CheckCircle className="h-4 w-4 text-muted-foreground" /></CardHeader><CardContent><div className="text-xl font-bold">{latest?.status || "Sem execução"}</div><p className="text-xs text-muted-foreground">Status da última execução</p></CardContent></Card>
      <Card><CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2"><CardTitle className="text-sm font-medium">Registros enviados</CardTitle><Upload className="h-4 w-4 text-muted-foreground" /></CardHeader><CardContent><div className="text-2xl font-bold">{sent.toLocaleString("pt-BR")}</div><p className="text-xs text-muted-foreground">Total registrado</p></CardContent></Card>
      <Card><CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2"><CardTitle className="text-sm font-medium">Registros recebidos</CardTitle><Download className="h-4 w-4 text-muted-foreground" /></CardHeader><CardContent><div className="text-2xl font-bold">{received.toLocaleString("pt-BR")}</div><p className="text-xs text-muted-foreground">Total registrado</p></CardContent></Card>
    </div>
    {syncing && <Alert><Activity className="h-4 w-4" /><AlertDescription>Solicitação de sincronização registrada no banco.<Progress value={100} className="mt-2" /></AlertDescription></Alert>}
    <Card><CardHeader><CardTitle>Histórico de sincronizações</CardTitle><CardDescription>Dados persistidos em ans_sincronizacoes.</CardDescription></CardHeader><CardContent>{loading ? <p className="text-sm text-muted-foreground">Carregando histórico...</p> : history.length === 0 ? <div className="flex flex-col items-center gap-2 py-12 text-center"><Database className="h-8 w-8 text-muted-foreground" /><p className="font-medium">Nenhuma sincronização registrada</p><p className="text-sm text-muted-foreground">Use “Sincronizar Agora” para registrar uma execução real.</p></div> : <div className="space-y-3">{history.map((item) => <div key={item.id} className="flex flex-wrap items-center justify-between gap-3 rounded-lg border p-3"><div className="flex items-center gap-3"><Calendar className="h-4 w-4 text-muted-foreground" /><div><p className="text-sm font-medium">{formatDate(item.created_at)}</p><p className="text-xs text-muted-foreground">{item.tipo} · {item.mensagem || "Sem mensagem"}</p></div></div><div className="flex items-center gap-3 text-sm"><span>{Number(item.registros_enviados || 0)} enviados</span><span>{Number(item.registros_recebidos || 0)} recebidos</span><Badge variant={item.status === "sucesso" ? "default" : item.status === "erro" ? "destructive" : "secondary"}>{item.status}</Badge></div></div>)}</div>}</CardContent></Card>
  </main>
}
