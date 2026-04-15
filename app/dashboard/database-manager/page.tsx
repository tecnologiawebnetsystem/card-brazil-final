"use client"

import { useState, useCallback } from "react"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { ScrollArea } from "@/components/ui/scroll-area"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

// Icons
const DatabaseIcon = () => (
  <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <ellipse cx="12" cy="5" rx="9" ry="3" />
    <path d="M21 12c0 1.66-4 3-9 3s-9-1.34-9-3" />
    <path d="M3 5v14c0 1.66 4 3 9 3s9-1.34 9-3V5" />
  </svg>
)

const TableIcon = () => (
  <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M3 14h18m-9-4v8m-7 0h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
  </svg>
)

const ColumnIcon = () => (
  <svg className="h-3 w-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
  </svg>
)

const PlayIcon = () => (
  <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <polygon points="5 3 19 12 5 21 5 3" fill="currentColor" />
  </svg>
)

const RefreshIcon = () => (
  <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
  </svg>
)

const PlugIcon = () => (
  <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
  </svg>
)

const DisconnectIcon = () => (
  <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18.364 18.364A9 9 0 005.636 5.636m12.728 12.728A9 9 0 015.636 5.636m12.728 12.728L5.636 5.636" />
  </svg>
)

const KeyIcon = () => (
  <svg className="h-3 w-3 text-yellow-500" fill="currentColor" viewBox="0 0 24 24">
    <path d="M12.65 10A5.99 5.99 0 006 6c-3.31 0-6 2.69-6 6s2.69 6 6 6a5.99 5.99 0 006-4h6v4h4v-4h2v-4H12.65zM6 14c-1.1 0-2-.9-2-2s.9-2 2-2 2 .9 2 2-.9 2-2 2z"/>
  </svg>
)

const ChevronRightIcon = () => (
  <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
  </svg>
)

const ChevronDownIcon = () => (
  <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
  </svg>
)

interface ConnectionConfig {
  host: string
  port: string
  user: string
  password: string
  database: string
}

interface TableColumn {
  name: string
  type: string
  nullable: boolean
  key: string
  default: string | null
  extra: string
}

interface TableInfo {
  name: string
  columns: TableColumn[]
  rowCount: number
}

interface QueryResult {
  columns: string[]
  rows: Record<string, unknown>[]
  affectedRows?: number
  message?: string
  executionTime: number
}

export default function DatabaseManagerPage() {
  const [isConnected, setIsConnected] = useState(false)
  const [isConnecting, setIsConnecting] = useState(false)
  const [connectionConfig, setConnectionConfig] = useState<ConnectionConfig>({
    host: "",
    port: "3306",
    user: "",
    password: "",
    database: "",
  })
  const [databases, setDatabases] = useState<string[]>([])
  const [selectedDatabase, setSelectedDatabase] = useState<string>("")
  const [tables, setTables] = useState<TableInfo[]>([])
  const [selectedTable, setSelectedTable] = useState<string>("")
  const [expandedTables, setExpandedTables] = useState<Record<string, boolean>>({})
  const [sqlQuery, setSqlQuery] = useState("")
  const [queryResult, setQueryResult] = useState<QueryResult | null>(null)
  const [isExecuting, setIsExecuting] = useState(false)
  const [activeTab, setActiveTab] = useState("query")
  const [error, setError] = useState<string | null>(null)
  const [connectionDialogOpen, setConnectionDialogOpen] = useState(false)

  // Query templates
  const queryTemplates = {
    select: `SELECT * FROM ${selectedTable || "tabela"} LIMIT 100;`,
    selectWhere: `SELECT * FROM ${selectedTable || "tabela"} WHERE coluna = 'valor';`,
    insert: `INSERT INTO ${selectedTable || "tabela"} (coluna1, coluna2) VALUES ('valor1', 'valor2');`,
    update: `UPDATE ${selectedTable || "tabela"} SET coluna = 'novo_valor' WHERE id = 1;`,
    delete: `DELETE FROM ${selectedTable || "tabela"} WHERE id = 1;`,
    count: `SELECT COUNT(*) as total FROM ${selectedTable || "tabela"};`,
    describe: `DESCRIBE ${selectedTable || "tabela"};`,
  }

  const handleConnect = async () => {
    setIsConnecting(true)
    setError(null)
    
    try {
      const response = await fetch("/api/database/connect", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(connectionConfig),
      })
      
      const data = await response.json()
      
      if (!response.ok) {
        throw new Error(data.error || "Falha ao conectar")
      }
      
      setDatabases(data.databases || [])
      setIsConnected(true)
      setConnectionDialogOpen(false)
      
      if (connectionConfig.database) {
        setSelectedDatabase(connectionConfig.database)
        await loadTables(connectionConfig.database)
      }
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Erro ao conectar ao banco de dados")
    } finally {
      setIsConnecting(false)
    }
  }

  const handleDisconnect = () => {
    setIsConnected(false)
    setDatabases([])
    setSelectedDatabase("")
    setTables([])
    setSelectedTable("")
    setQueryResult(null)
    setSqlQuery("")
    setError(null)
  }

  const loadTables = async (dbName: string) => {
    try {
      const response = await fetch("/api/database/tables", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...connectionConfig, database: dbName }),
      })
      
      const data = await response.json()
      
      if (!response.ok) {
        throw new Error(data.error || "Falha ao carregar tabelas")
      }
      
      setTables(data.tables || [])
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Erro ao carregar tabelas")
    }
  }

  const handleDatabaseChange = async (dbName: string) => {
    setSelectedDatabase(dbName)
    setSelectedTable("")
    setTables([])
    await loadTables(dbName)
  }

  const handleTableSelect = (tableName: string) => {
    setSelectedTable(tableName)
    setSqlQuery(`SELECT * FROM ${tableName} LIMIT 100;`)
  }

  const toggleTableExpand = (tableName: string) => {
    setExpandedTables(prev => ({
      ...prev,
      [tableName]: !prev[tableName]
    }))
  }

  const executeQuery = async () => {
    if (!sqlQuery.trim()) return
    
    setIsExecuting(true)
    setError(null)
    setQueryResult(null)
    
    try {
      const response = await fetch("/api/database/query", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...connectionConfig,
          database: selectedDatabase,
          query: sqlQuery,
        }),
      })
      
      const data = await response.json()
      
      if (!response.ok) {
        throw new Error(data.error || "Falha ao executar query")
      }
      
      setQueryResult(data)
      setActiveTab("result")
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Erro ao executar query")
    } finally {
      setIsExecuting(false)
    }
  }

  const insertTemplate = (template: string) => {
    setSqlQuery(template)
  }

  const getColumnTypeColor = (type: string) => {
    const lowerType = type.toLowerCase()
    if (lowerType.includes("int") || lowerType.includes("decimal") || lowerType.includes("float") || lowerType.includes("double")) {
      return "text-blue-400"
    }
    if (lowerType.includes("varchar") || lowerType.includes("text") || lowerType.includes("char")) {
      return "text-green-400"
    }
    if (lowerType.includes("date") || lowerType.includes("time")) {
      return "text-purple-400"
    }
    if (lowerType.includes("bool")) {
      return "text-orange-400"
    }
    return "text-muted-foreground"
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-6 py-6">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-2xl font-bold text-foreground">Gerenciador de Banco de Dados</h1>
            <p className="text-muted-foreground">Conecte, visualize e gerencie seus bancos de dados MySQL</p>
          </div>
          <div className="flex items-center gap-3">
            {isConnected ? (
              <>
                <Badge variant="outline" className="border-green-500/50 bg-green-500/10 text-green-400">
                  <span className="mr-2 h-2 w-2 rounded-full bg-green-500 animate-pulse" />
                  Conectado
                </Badge>
                <Button variant="outline" size="sm" onClick={handleDisconnect}>
                  <DisconnectIcon />
                  <span className="ml-2">Desconectar</span>
                </Button>
              </>
            ) : (
              <Dialog open={connectionDialogOpen} onOpenChange={setConnectionDialogOpen}>
                <DialogTrigger asChild>
                  <Button className="bg-primary text-primary-foreground hover:bg-primary/90">
                    <PlugIcon />
                    <span className="ml-2">Conectar ao Banco</span>
                  </Button>
                </DialogTrigger>
                <DialogContent className="sm:max-w-md bg-card border-border">
                  <DialogHeader>
                    <DialogTitle className="text-foreground">Conectar ao MySQL</DialogTitle>
                    <DialogDescription className="text-muted-foreground">
                      Insira as credenciais de conexao do seu banco de dados MySQL
                    </DialogDescription>
                  </DialogHeader>
                  <div className="grid gap-4 py-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="host">Host</Label>
                        <Input
                          id="host"
                          placeholder="localhost"
                          value={connectionConfig.host}
                          onChange={(e) => setConnectionConfig(prev => ({ ...prev, host: e.target.value }))}
                          className="bg-input border-border"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="port">Porta</Label>
                        <Input
                          id="port"
                          placeholder="3306"
                          value={connectionConfig.port}
                          onChange={(e) => setConnectionConfig(prev => ({ ...prev, port: e.target.value }))}
                          className="bg-input border-border"
                        />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="user">Usuario</Label>
                      <Input
                        id="user"
                        placeholder="root"
                        value={connectionConfig.user}
                        onChange={(e) => setConnectionConfig(prev => ({ ...prev, user: e.target.value }))}
                        className="bg-input border-border"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="password">Senha</Label>
                      <Input
                        id="password"
                        type="password"
                        placeholder="********"
                        value={connectionConfig.password}
                        onChange={(e) => setConnectionConfig(prev => ({ ...prev, password: e.target.value }))}
                        className="bg-input border-border"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="database">Banco de Dados (opcional)</Label>
                      <Input
                        id="database"
                        placeholder="nome_do_banco"
                        value={connectionConfig.database}
                        onChange={(e) => setConnectionConfig(prev => ({ ...prev, database: e.target.value }))}
                        className="bg-input border-border"
                      />
                    </div>
                  </div>
                  {error && (
                    <div className="mb-4 p-3 rounded-lg bg-destructive/10 border border-destructive/20 text-destructive text-sm">
                      {error}
                    </div>
                  )}
                  <div className="flex justify-end">
                    <Button onClick={handleConnect} disabled={isConnecting} className="bg-primary text-primary-foreground">
                      {isConnecting ? (
                        <>
                          <RefreshIcon />
                          <span className="ml-2 animate-pulse">Conectando...</span>
                        </>
                      ) : (
                        <>
                          <PlugIcon />
                          <span className="ml-2">Conectar</span>
                        </>
                      )}
                    </Button>
                  </div>
                </DialogContent>
              </Dialog>
            )}
          </div>
        </div>

        {error && !connectionDialogOpen && (
          <div className="mb-6 p-4 rounded-lg bg-destructive/10 border border-destructive/20 text-destructive">
            {error}
          </div>
        )}

        {/* Main Content */}
        <div className="grid grid-cols-12 gap-6">
          {/* Sidebar - Database Explorer */}
          <div className="col-span-12 lg:col-span-3">
            <Card className="border-border bg-card h-[calc(100vh-220px)]">
              <CardHeader className="pb-3">
                <CardTitle className="text-base flex items-center gap-2">
                  <DatabaseIcon />
                  Explorador
                </CardTitle>
              </CardHeader>
              <CardContent className="p-0">
                {isConnected ? (
                  <div className="px-4 pb-4">
                    {/* Database Selector */}
                    <div className="mb-4">
                      <Label className="text-xs text-muted-foreground mb-2 block">Banco de Dados</Label>
                      <Select value={selectedDatabase} onValueChange={handleDatabaseChange}>
                        <SelectTrigger className="bg-input border-border">
                          <SelectValue placeholder="Selecione um banco" />
                        </SelectTrigger>
                        <SelectContent className="bg-popover border-border">
                          {databases.map((db) => (
                            <SelectItem key={db} value={db}>
                              {db}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>

                    {/* Tables Tree */}
                    {selectedDatabase && (
                      <div>
                        <div className="flex items-center justify-between mb-2">
                          <Label className="text-xs text-muted-foreground">Tabelas</Label>
                          <Button variant="ghost" size="sm" onClick={() => loadTables(selectedDatabase)} className="h-6 px-2">
                            <RefreshIcon />
                          </Button>
                        </div>
                        <ScrollArea className="h-[calc(100vh-420px)]">
                          <div className="space-y-1">
                            {tables.map((table) => (
                              <div key={table.name}>
                                <div
                                  className={`flex items-center gap-2 px-2 py-1.5 rounded-md cursor-pointer hover:bg-accent transition-colors ${
                                    selectedTable === table.name ? "bg-accent" : ""
                                  }`}
                                  onClick={() => handleTableSelect(table.name)}
                                >
                                  <button
                                    onClick={(e) => {
                                      e.stopPropagation()
                                      toggleTableExpand(table.name)
                                    }}
                                    className="hover:bg-muted rounded p-0.5"
                                  >
                                    {expandedTables[table.name] ? <ChevronDownIcon /> : <ChevronRightIcon />}
                                  </button>
                                  <TableIcon />
                                  <span className="text-sm flex-1 truncate">{table.name}</span>
                                  <Badge variant="secondary" className="text-xs">
                                    {table.rowCount}
                                  </Badge>
                                </div>
                                
                                {/* Columns */}
                                {expandedTables[table.name] && table.columns.length > 0 && (
                                  <div className="ml-8 mt-1 space-y-0.5">
                                    {table.columns.map((col) => (
                                      <div
                                        key={col.name}
                                        className="flex items-center gap-2 px-2 py-1 text-xs text-muted-foreground hover:bg-muted/50 rounded"
                                      >
                                        {col.key === "PRI" && <KeyIcon />}
                                        {col.key !== "PRI" && <ColumnIcon />}
                                        <span className="truncate">{col.name}</span>
                                        <span className={`ml-auto ${getColumnTypeColor(col.type)}`}>
                                          {col.type}
                                        </span>
                                      </div>
                                    ))}
                                  </div>
                                )}
                              </div>
                            ))}
                            {tables.length === 0 && selectedDatabase && (
                              <div className="text-center py-8 text-muted-foreground text-sm">
                                Nenhuma tabela encontrada
                              </div>
                            )}
                          </div>
                        </ScrollArea>
                      </div>
                    )}
                  </div>
                ) : (
                  <div className="flex flex-col items-center justify-center py-12 px-4 text-center">
                    <DatabaseIcon />
                    <p className="mt-3 text-sm text-muted-foreground">
                      Conecte-se a um banco de dados para explorar tabelas e colunas
                    </p>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Main Area - Query Editor & Results */}
          <div className="col-span-12 lg:col-span-9">
            <Card className="border-border bg-card h-[calc(100vh-220px)]">
              <CardContent className="p-0 h-full flex flex-col">
                <Tabs value={activeTab} onValueChange={setActiveTab} className="flex flex-col h-full">
                  <div className="flex items-center justify-between px-4 pt-4 border-b border-border">
                    <TabsList className="bg-muted">
                      <TabsTrigger value="query" className="data-[state=active]:bg-background">
                        Editor SQL
                      </TabsTrigger>
                      <TabsTrigger value="result" className="data-[state=active]:bg-background">
                        Resultados
                        {queryResult && (
                          <Badge variant="secondary" className="ml-2">
                            {queryResult.rows?.length || 0}
                          </Badge>
                        )}
                      </TabsTrigger>
                    </TabsList>
                    <div className="flex items-center gap-2">
                      <Button
                        onClick={executeQuery}
                        disabled={!isConnected || !sqlQuery.trim() || isExecuting}
                        className="bg-primary text-primary-foreground hover:bg-primary/90"
                      >
                        {isExecuting ? (
                          <>
                            <RefreshIcon />
                            <span className="ml-2">Executando...</span>
                          </>
                        ) : (
                          <>
                            <PlayIcon />
                            <span className="ml-2">Executar</span>
                          </>
                        )}
                      </Button>
                    </div>
                  </div>

                  <TabsContent value="query" className="flex-1 m-0 p-4">
                    <div className="h-full flex flex-col gap-4">
                      {/* Query Templates */}
                      <div className="flex flex-wrap gap-2">
                        <Label className="text-xs text-muted-foreground w-full mb-1">Templates:</Label>
                        <Button variant="outline" size="sm" onClick={() => insertTemplate(queryTemplates.select)}>
                          SELECT
                        </Button>
                        <Button variant="outline" size="sm" onClick={() => insertTemplate(queryTemplates.selectWhere)}>
                          SELECT WHERE
                        </Button>
                        <Button variant="outline" size="sm" onClick={() => insertTemplate(queryTemplates.insert)}>
                          INSERT
                        </Button>
                        <Button variant="outline" size="sm" onClick={() => insertTemplate(queryTemplates.update)}>
                          UPDATE
                        </Button>
                        <Button variant="outline" size="sm" onClick={() => insertTemplate(queryTemplates.delete)}>
                          DELETE
                        </Button>
                        <Button variant="outline" size="sm" onClick={() => insertTemplate(queryTemplates.count)}>
                          COUNT
                        </Button>
                        <Button variant="outline" size="sm" onClick={() => insertTemplate(queryTemplates.describe)}>
                          DESCRIBE
                        </Button>
                      </div>

                      {/* SQL Editor */}
                      <div className="flex-1 relative">
                        <textarea
                          value={sqlQuery}
                          onChange={(e) => setSqlQuery(e.target.value)}
                          placeholder="Digite sua query SQL aqui...

Exemplo:
SELECT * FROM usuarios WHERE ativo = 1 LIMIT 100;"
                          className="w-full h-full min-h-[300px] p-4 bg-[#0d0d0d] border border-border rounded-lg font-mono text-sm text-foreground placeholder:text-muted-foreground resize-none focus:outline-none focus:ring-2 focus:ring-primary/50"
                          spellCheck={false}
                        />
                      </div>
                    </div>
                  </TabsContent>

                  <TabsContent value="result" className="flex-1 m-0 overflow-hidden">
                    {queryResult ? (
                      <div className="h-full flex flex-col">
                        {/* Result Header */}
                        <div className="px-4 py-3 border-b border-border bg-muted/30 flex items-center justify-between">
                          <div className="flex items-center gap-4 text-sm">
                            {queryResult.rows && (
                              <span className="text-muted-foreground">
                                <span className="text-foreground font-medium">{queryResult.rows.length}</span> registro(s)
                              </span>
                            )}
                            {queryResult.affectedRows !== undefined && (
                              <span className="text-muted-foreground">
                                <span className="text-foreground font-medium">{queryResult.affectedRows}</span> linha(s) afetada(s)
                              </span>
                            )}
                            <span className="text-muted-foreground">
                              Tempo: <span className="text-foreground font-medium">{queryResult.executionTime}ms</span>
                            </span>
                          </div>
                          {queryResult.message && (
                            <Badge variant="outline" className="border-green-500/50 bg-green-500/10 text-green-400">
                              {queryResult.message}
                            </Badge>
                          )}
                        </div>

                        {/* Result Table */}
                        {queryResult.rows && queryResult.rows.length > 0 ? (
                          <ScrollArea className="flex-1">
                            <div className="p-4">
                              <Table>
                                <TableHeader>
                                  <TableRow className="border-border hover:bg-transparent">
                                    {queryResult.columns.map((col) => (
                                      <TableHead key={col} className="text-muted-foreground font-semibold whitespace-nowrap">
                                        {col}
                                      </TableHead>
                                    ))}
                                  </TableRow>
                                </TableHeader>
                                <TableBody>
                                  {queryResult.rows.map((row, idx) => (
                                    <TableRow key={idx} className="border-border hover:bg-muted/30">
                                      {queryResult.columns.map((col) => (
                                        <TableCell key={col} className="py-2 whitespace-nowrap max-w-[300px] truncate">
                                          {row[col] === null ? (
                                            <span className="text-muted-foreground italic">NULL</span>
                                          ) : typeof row[col] === "object" ? (
                                            JSON.stringify(row[col])
                                          ) : (
                                            String(row[col])
                                          )}
                                        </TableCell>
                                      ))}
                                    </TableRow>
                                  ))}
                                </TableBody>
                              </Table>
                            </div>
                          </ScrollArea>
                        ) : queryResult.affectedRows !== undefined ? (
                          <div className="flex-1 flex items-center justify-center">
                            <div className="text-center">
                              <Badge className="mb-3 bg-green-500/10 text-green-400 border-green-500/30">
                                Sucesso
                              </Badge>
                              <p className="text-muted-foreground">
                                Query executada com sucesso. {queryResult.affectedRows} linha(s) afetada(s).
                              </p>
                            </div>
                          </div>
                        ) : (
                          <div className="flex-1 flex items-center justify-center">
                            <p className="text-muted-foreground">Nenhum resultado retornado</p>
                          </div>
                        )}
                      </div>
                    ) : (
                      <div className="h-full flex items-center justify-center">
                        <div className="text-center">
                          <TableIcon />
                          <p className="mt-3 text-muted-foreground">
                            Execute uma query para ver os resultados aqui
                          </p>
                        </div>
                      </div>
                    )}
                  </TabsContent>
                </Tabs>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}
