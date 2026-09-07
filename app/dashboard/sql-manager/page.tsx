"use client"

import { useEffect, useMemo, useState } from "react"
import { Database, Download, Loader2, Play, RefreshCw, Search, ShieldCheck, Table2, Terminal, X } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Separator } from "@/components/ui/separator"
import { Textarea } from "@/components/ui/textarea"
import { toast } from "sonner"

type TableInfo = { table_name: string; row_count: number }
type ColumnInfo = { column_name: string; data_type: string; udt_name?: string; is_nullable: string; column_default: string | null; is_primary_key: boolean; is_foreign_key: boolean; references_table: string | null; references_column: string | null }
type Result = { columns: string[]; rows: Record<string, unknown>[]; executionTime?: number; affectedRows?: number }

function download(text: string, name: string, type: string) { const anchor = document.createElement("a"); anchor.href = URL.createObjectURL(new Blob([text], { type })); anchor.download = name; anchor.click(); URL.revokeObjectURL(anchor.href) }
function csv(result: Result) { return [result.columns.join(","), ...result.rows.map(row => result.columns.map(column => JSON.stringify(row[column] ?? "")).join(","))].join("\n") }

export default function SqlManagerPage() {
  const [tables, setTables] = useState<TableInfo[]>([])
  const [filter, setFilter] = useState("")
  const [selected, setSelected] = useState("")
  const [schema, setSchema] = useState<ColumnInfo[]>([])
  const [detail, setDetail] = useState<Result | null>(null)
  const [result, setResult] = useState<Result | null>(null)
  const [sql, setSql] = useState("SELECT * FROM usuarios LIMIT 50")
  const [busy, setBusy] = useState(false)
  const [tablesLoading, setTablesLoading] = useState(false)
  const [tablesError, setTablesError] = useState("")

  const loadTables = async () => {
    setTablesLoading(true)
    setTablesError("")
    try {
      const response = await fetch("/api/sql-manager/tables", { cache: "no-store" })
      const data = await response.json()
      if (!response.ok) throw new Error(data.error || "Não foi possível carregar as tabelas.")
      setTables(data.tables || [])
    } catch (error) {
      const message = error instanceof Error ? error.message : "Não foi possível carregar as tabelas."
      setTablesError(message)
      toast.error(message)
    } finally { setTablesLoading(false) }
  }

  useEffect(() => { void loadTables() }, [])

  const openTable = async (name: string) => {
    setSelected(name); setBusy(true); setResult(null)
    try {
      const response = await fetch(`/api/sql-manager/query?table=${encodeURIComponent(name)}`, { cache: "no-store" })
      const data = await response.json()
      if (!response.ok) throw new Error(data.error || "Não foi possível abrir a tabela.")
      setSchema(data.columns || [])
      setDetail({ columns: (data.columns || []).map((column: ColumnInfo) => column.column_name), rows: data.rows || [] })
      setSql(`SELECT * FROM ${name} LIMIT 50`)
    } catch (error) { toast.error(error instanceof Error ? error.message : "Não foi possível abrir a tabela.") }
    finally { setBusy(false) }
  }

  const execute = async () => {
    const kind = sql.trim().split(/\s+/)[0]?.toUpperCase()
    const isWrite = ["INSERT", "UPDATE", "DELETE"].includes(kind)
    if (!sql.trim()) return
    if (isWrite && !window.confirm(`Confirmar operação ${kind}? Esta ação altera dados do banco.`)) return
    setBusy(true)
    try {
      const response = await fetch("/api/sql-manager/query", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ sql, confirmWrite: isWrite }) })
      const data = await response.json()
      if (!response.ok) throw new Error(data.error || "Erro ao executar SQL.")
      setResult(data); toast.success(`${kind} executado com sucesso`); void loadTables()
    } catch (error) { toast.error(error instanceof Error ? error.message : "Erro ao executar SQL.") }
    finally { setBusy(false) }
  }

  const active = result || detail
  const visibleTables = useMemo(() => tables.filter(table => table.table_name.toLowerCase().includes(filter.toLowerCase())), [tables, filter])

  return <div className="flex min-h-full flex-col gap-6">
    <header className="relative overflow-hidden rounded-3xl border border-border bg-primary p-6 text-primary-foreground shadow-xl shadow-primary/10 sm:p-8">
      <div className="absolute -right-16 -top-20 size-64 rounded-full border-[24px] border-primary-foreground/10" />
      <div className="relative flex flex-wrap items-start justify-between gap-6">
        <div><div className="flex items-center gap-2 text-primary-foreground/70"><Database className="size-5" /><span className="font-mono text-xs font-semibold uppercase tracking-widest">Developer workspace</span></div><h1 className="mt-3 text-3xl font-semibold tracking-tight">SQL Manager</h1><p className="mt-2 max-w-2xl text-sm leading-6 text-primary-foreground/70">Explore tabelas, consulte registros e execute operações administrativas com segurança, rastreabilidade e contexto.</p></div>
        <div className="flex items-center gap-2"><Badge variant="outline" className="gap-1.5 px-3 py-1.5"><ShieldCheck className="size-3.5" />Acesso administrativo</Badge><Button variant="outline" size="sm" onClick={() => void loadTables()} disabled={tablesLoading}><RefreshCw className="size-4" data-icon="inline-start" />Atualizar</Button></div>
      </div>
    </header>
    <div className="grid min-h-[650px] flex-1 gap-5 xl:grid-cols-[260px_minmax(0,1fr)]">
      <Card className="overflow-hidden"><CardHeader className="border-b bg-muted/30 pb-4"><CardTitle className="flex items-center gap-2 text-sm"><Table2 className="size-4 text-primary" />Tabelas <Badge variant="secondary" className="ml-auto">{tables.length}</Badge></CardTitle><div className="relative mt-3"><Search className="absolute left-3 top-2.5 size-4 text-muted-foreground" /><Input className="pl-9" placeholder="Filtrar tabelas" value={filter} onChange={event => setFilter(event.target.value)} /></div></CardHeader><CardContent className="max-h-[570px] overflow-auto p-2">
        {tablesLoading ? <div className="flex items-center justify-center gap-2 py-10 text-sm text-muted-foreground"><Loader2 className="size-4 animate-spin" />Carregando tabelas…</div> : tablesError ? <div className="flex flex-col items-center gap-3 px-3 py-10 text-center"><p className="text-sm text-destructive">{tablesError}</p><Button variant="outline" size="sm" onClick={() => void loadTables()}>Tentar novamente</Button></div> : <div className="flex flex-col gap-1">{visibleTables.map(table => <button key={table.table_name} onClick={() => void openTable(table.table_name)} className={`flex items-center justify-between rounded-md px-3 py-2 text-left text-sm transition-colors hover:bg-accent ${selected === table.table_name ? "bg-primary/10 text-primary" : "text-foreground"}`}><span className="flex min-w-0 items-center gap-2"><Table2 className="size-3.5 shrink-0" /><span className="truncate font-mono">{table.table_name}</span></span><span className="text-xs text-muted-foreground">{table.row_count}</span></button>)}</div>}
      </CardContent></Card>
      <div className="flex min-w-0 flex-col gap-5">
        {selected && <Card><CardHeader className="border-b pb-3"><CardTitle className="flex items-center gap-2 text-sm"><Table2 className="size-4 text-primary" />Estrutura · <span className="font-mono">{selected}</span><Badge variant="secondary" className="ml-auto">{schema.length} campos</Badge></CardTitle></CardHeader><CardContent className="p-0"><div className="grid divide-y sm:grid-cols-2 sm:divide-x sm:divide-y-0 lg:grid-cols-3">{schema.map(column => <button key={column.column_name} type="button" title="Copiar nome do campo" onClick={() => { void navigator.clipboard.writeText(column.column_name); setSql(value => `${value} ${column.column_name}`); toast.success(`Campo ${column.column_name} copiado`) }} className="flex min-w-0 flex-col gap-1 px-4 py-3 text-left transition-colors hover:bg-muted/60"><span className="flex items-center gap-2"><span className="truncate font-mono text-xs font-semibold">{column.column_name}</span>{column.is_primary_key && <Badge className="border-primary/30 bg-primary/10 text-primary">PK</Badge>}{column.is_foreign_key && <Badge variant="outline">FK</Badge>}</span><span className="truncate text-[11px] text-muted-foreground">{column.data_type} · {column.is_nullable === "NO" ? "obrigatório" : "opcional"}{column.references_table ? ` · → ${column.references_table}.${column.references_column}` : ""}</span></button>)}</div></CardContent></Card>}
        <Card><CardHeader className="border-b pb-3"><CardTitle className="flex items-center gap-2 text-sm"><Terminal className="size-4 text-primary" />Editor SQL <span className="ml-auto font-mono text-xs font-normal text-muted-foreground">PostgreSQL · sem ponto e vírgula</span></CardTitle></CardHeader><CardContent className="p-4"><Textarea value={sql} onChange={event => setSql(event.target.value)} onKeyDown={event => { if ((event.ctrlKey || event.metaKey) && event.key === "Enter") { event.preventDefault(); void execute() } }} className="min-h-32 resize-y bg-muted/30 font-mono text-sm leading-6" aria-label="Editor de comandos SQL" /><p className="mt-2 text-xs text-muted-foreground">Dica: use Ctrl+Enter ou Cmd+Enter para executar rapidamente.</p><div className="mt-3 flex flex-wrap items-center justify-between gap-3"><span className="text-xs text-muted-foreground">Consultas SELECT precisam incluir LIMIT.</span><Button onClick={() => void execute()} disabled={busy || !sql.trim()}>{busy ? <Loader2 className="size-4 animate-spin" data-icon="inline-start" /> : <Play className="size-4" data-icon="inline-start" />}{busy ? "Executando…" : "Executar"}</Button></div></CardContent></Card>
        <Card className="min-h-0 flex-1 overflow-hidden"><CardHeader className="flex-row items-center border-b py-3"><CardTitle className="text-sm">{active ? `Resultado${selected ? ` · ${selected}` : ""}` : "Resultado da consulta"}</CardTitle>{active && <div className="ml-auto flex gap-2"><Button variant="outline" size="sm" onClick={() => download(csv(active), "sql-result.csv", "text/csv")}><Download className="size-4" data-icon="inline-start" />CSV</Button><Button variant="outline" size="sm" onClick={() => download(JSON.stringify(active.rows, null, 2), "sql-result.json", "application/json")}><Download className="size-4" data-icon="inline-start" />JSON</Button><Button variant="ghost" size="icon" onClick={() => { setResult(null); setDetail(null) }} aria-label="Limpar resultado"><X className="size-4" /></Button></div>}</CardHeader><CardContent className="overflow-auto p-0">{active ? active.rows.length ? <table className="w-full min-w-max text-left text-sm"><thead className="bg-muted/50 text-xs uppercase text-muted-foreground"><tr>{active.columns.map(column => <th key={column} className="whitespace-nowrap px-4 py-3 font-mono font-medium">{column}</th>)}</tr></thead><tbody>{active.rows.map((row, index) => <tr key={index} className="border-t hover:bg-muted/30">{active.columns.map(column => <td key={column} className="max-w-64 whitespace-nowrap px-4 py-3 font-mono text-xs">{row[column] === null ? <span className="text-muted-foreground">NULL</span> : String(row[column])}</td>)}</tr>)}</tbody></table> : <div className="flex min-h-64 items-center justify-center p-8 text-sm text-muted-foreground">Consulta executada sem registros.</div> : <div className="flex min-h-64 flex-col items-center justify-center gap-2 p-8 text-center text-muted-foreground"><Terminal className="size-8 opacity-40" /><p className="text-sm">Selecione uma tabela ou execute um comando SQL</p></div>}</CardContent>{active && <><Separator /><div className="px-4 py-2 text-xs text-muted-foreground">{active.rows.length} registro(s) exibido(s){result?.executionTime ? ` · ${result.executionTime} ms` : ""}{result?.affectedRows !== undefined ? ` · ${result.affectedRows} afetado(s)` : ""}</div></>}</Card>
      </div>
    </div>
  </div>
}
