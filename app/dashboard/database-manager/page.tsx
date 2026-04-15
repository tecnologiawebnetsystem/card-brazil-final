"use client"

import { useState, useEffect, useCallback } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
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

const CheckIcon = () => (
  <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
  </svg>
)

const AlertIcon = () => (
  <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
  </svg>
)

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
  const [isConnecting, setIsConnecting] = useState(true)
  const [databaseName, setDatabaseName] = useState<string>("")
  const [hostName, setHostName] = useState<string>("")
  const [tables, setTables] = useState<TableInfo[]>([])
  const [selectedTable, setSelectedTable] = useState<string>("")
  const [expandedTables, setExpandedTables] = useState<Record<string, boolean>>({})
  const [sqlQuery, setSqlQuery] = useState("")
  const [queryResult, setQueryResult] = useState<QueryResult | null>(null)
  const [isExecuting, setIsExecuting] = useState(false)
  const [activeTab, setActiveTab] = useState("query")
  const [error, setError] = useState<string | null>(null)

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

  // Conectar automaticamente ao carregar a página
  const connect = useCallback(async () => {
    setIsConnecting(true)
    setError(null)
    
    try {
      const response = await fetch("/api/database/connect")
      const data = await response.json()
      
      if (!response.ok) {
        throw new Error(data.error || "Falha ao conectar")
      }
      
      setDatabaseName(data.database || "")
      setHostName(data.host || "")
      setIsConnected(true)
      
      // Carregar tabelas automaticamente
      await loadTables()
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Erro ao conectar ao banco de dados")
      setIsConnected(false)
    } finally {
      setIsConnecting(false)
    }
  }, [])

  const loadTables = async () => {
    try {
      const response = await fetch("/api/database/tables")
      const data = await response.json()
      
      if (!response.ok) {
        throw new Error(data.error || "Falha ao carregar tabelas")
      }
      
      setTables(data.tables || [])
      setDatabaseName(data.database || "")
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Erro ao carregar tabelas")
    }
  }

  useEffect(() => {
    connect()
  }, [connect])

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
        body: JSON.stringify({ query: sqlQuery }),
      })
      
      const data = await response.json()
      
      if (!response.ok) {
        throw new Error(data.error || "Falha ao executar query")
      }
      
      setQueryResult(data)
      setActiveTab("result")
      
      // Recarregar tabelas se for um comando que modifica estrutura
      const upperQuery = sqlQuery.trim().toUpperCase()
      if (upperQuery.startsWith("CREATE") || upperQuery.startsWith("DROP") || upperQuery.startsWith("ALTER") ||
          upperQuery.startsWith("INSERT") || upperQuery.startsWith("UPDATE") || upperQuery.startsWith("DELETE")) {
        await loadTables()
      }
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

  // Loading state
  if (isConnecting) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4" />
          <p className="text-muted-foreground">Conectando ao banco de dados...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-6 py-6">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-2xl font-bold text-foreground">Gerenciador de Banco de Dados</h1>
            <p className="text-muted-foreground">
              {isConnected ? (
                <>Conectado a <span className="text-primary font-medium">{databaseName}</span> em <span className="text-muted-foreground">{hostName}</span></>
              ) : (
                "Gerencie seu banco de dados MySQL"
              )}
            </p>
          </div>
          <div className="flex items-center gap-3">
            {isConnected ? (
              <>
                <Badge variant="outline" className="border-green-500/50 bg-green-500/10 text-green-400">
                  <span className="mr-2 h-2 w-2 rounded-full bg-green-500 animate-pulse" />
                  Conectado
                </Badge>
                <Button variant="outline" size="sm" onClick={connect}>
                  <RefreshIcon />
                  <span className="ml-2">Reconectar</span>
                </Button>
              </>
            ) : (
              <Button className="bg-primary text-primary-foreground hover:bg-primary/90" onClick={connect}>
                <RefreshIcon />
                <span className="ml-2">Tentar Novamente</span>
              </Button>
            )}
          </div>
        </div>

        {error && (
          <div className="mb-6 p-4 rounded-lg bg-destructive/10 border border-destructive/20 text-destructive flex items-start gap-3">
            <AlertIcon />
            <div>
              <p className="font-medium">Erro de Conexao</p>
              <p className="text-sm mt-1">{error}</p>
            </div>
          </div>
        )}

        {/* Main Content */}
        {isConnected && (
          <div className="grid grid-cols-12 gap-6">
            {/* Sidebar - Database Explorer */}
            <div className="col-span-12 lg:col-span-3">
              <Card className="border-border bg-card h-[calc(100vh-220px)]">
                <CardHeader className="pb-3">
                  <CardTitle className="text-base flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <DatabaseIcon />
                      {databaseName}
                    </div>
                    <Button variant="ghost" size="sm" onClick={loadTables} className="h-7 px-2">
                      <RefreshIcon />
                    </Button>
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-0">
                  <div className="px-4 pb-4">
                    {/* Tables Tree */}
                    <div className="flex items-center justify-between mb-2">
                      <Label className="text-xs text-muted-foreground">Tabelas ({tables.length})</Label>
                    </div>
                    <ScrollArea className="h-[calc(100vh-340px)]">
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
                        {tables.length === 0 && (
                          <div className="text-sm text-muted-foreground text-center py-8">
                            Nenhuma tabela encontrada
                          </div>
                        )}
                      </div>
                    </ScrollArea>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Main Panel - Query Editor and Results */}
            <div className="col-span-12 lg:col-span-9">
              <Tabs value={activeTab} onValueChange={setActiveTab} className="h-[calc(100vh-220px)]">
                <TabsList className="mb-4 bg-muted/50">
                  <TabsTrigger value="query" className="data-[state=active]:bg-background">
                    Editor SQL
                  </TabsTrigger>
                  <TabsTrigger value="result" className="data-[state=active]:bg-background">
                    Resultados
                    {queryResult && queryResult.rows.length > 0 && (
                      <Badge variant="secondary" className="ml-2 text-xs">
                        {queryResult.rows.length}
                      </Badge>
                    )}
                  </TabsTrigger>
                </TabsList>

                <TabsContent value="query" className="mt-0 h-[calc(100%-60px)]">
                  <Card className="border-border bg-card h-full">
                    <CardHeader className="pb-3">
                      <div className="flex items-center justify-between">
                        <CardTitle className="text-base">Query SQL</CardTitle>
                        <div className="flex items-center gap-2">
                          <div className="flex flex-wrap gap-1">
                            <Button
                              variant="outline"
                              size="sm"
                              className="h-7 text-xs"
                              onClick={() => insertTemplate(queryTemplates.select)}
                            >
                              SELECT
                            </Button>
                            <Button
                              variant="outline"
                              size="sm"
                              className="h-7 text-xs"
                              onClick={() => insertTemplate(queryTemplates.insert)}
                            >
                              INSERT
                            </Button>
                            <Button
                              variant="outline"
                              size="sm"
                              className="h-7 text-xs"
                              onClick={() => insertTemplate(queryTemplates.update)}
                            >
                              UPDATE
                            </Button>
                            <Button
                              variant="outline"
                              size="sm"
                              className="h-7 text-xs"
                              onClick={() => insertTemplate(queryTemplates.delete)}
                            >
                              DELETE
                            </Button>
                            <Button
                              variant="outline"
                              size="sm"
                              className="h-7 text-xs"
                              onClick={() => insertTemplate(queryTemplates.count)}
                            >
                              COUNT
                            </Button>
                            <Button
                              variant="outline"
                              size="sm"
                              className="h-7 text-xs"
                              onClick={() => insertTemplate(queryTemplates.describe)}
                            >
                              DESCRIBE
                            </Button>
                          </div>
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent className="h-[calc(100%-80px)]">
                      <div className="h-full flex flex-col gap-4">
                        <textarea
                          className="flex-1 w-full p-4 rounded-lg bg-muted/30 border border-border font-mono text-sm resize-none focus:outline-none focus:ring-2 focus:ring-primary/50"
                          placeholder="Digite sua query SQL aqui...

Exemplos:
SELECT * FROM usuarios LIMIT 10;
INSERT INTO usuarios (nome, email) VALUES ('Joao', 'joao@email.com');
UPDATE usuarios SET nome = 'Maria' WHERE id = 1;
DELETE FROM usuarios WHERE id = 1;"
                          value={sqlQuery}
                          onChange={(e) => setSqlQuery(e.target.value)}
                          onKeyDown={(e) => {
                            if (e.key === "Enter" && (e.ctrlKey || e.metaKey)) {
                              executeQuery()
                            }
                          }}
                        />
                        <div className="flex items-center justify-between">
                          <p className="text-xs text-muted-foreground">
                            Pressione <kbd className="px-1.5 py-0.5 rounded bg-muted text-xs">Ctrl</kbd> + <kbd className="px-1.5 py-0.5 rounded bg-muted text-xs">Enter</kbd> para executar
                          </p>
                          <Button
                            onClick={executeQuery}
                            disabled={isExecuting || !sqlQuery.trim()}
                            className="bg-primary text-primary-foreground hover:bg-primary/90"
                          >
                            {isExecuting ? (
                              <>
                                <RefreshIcon />
                                <span className="ml-2 animate-pulse">Executando...</span>
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
                    </CardContent>
                  </Card>
                </TabsContent>

                <TabsContent value="result" className="mt-0 h-[calc(100%-60px)]">
                  <Card className="border-border bg-card h-full">
                    <CardHeader className="pb-3">
                      <div className="flex items-center justify-between">
                        <CardTitle className="text-base">Resultados</CardTitle>
                        {queryResult && (
                          <div className="flex items-center gap-4 text-sm text-muted-foreground">
                            {queryResult.rows.length > 0 && (
                              <span>{queryResult.rows.length} registro(s)</span>
                            )}
                            {queryResult.affectedRows !== undefined && queryResult.affectedRows > 0 && (
                              <span className="flex items-center gap-1 text-green-400">
                                <CheckIcon />
                                {queryResult.message}
                              </span>
                            )}
                            <span>{queryResult.executionTime}ms</span>
                          </div>
                        )}
                      </div>
                    </CardHeader>
                    <CardContent className="h-[calc(100%-80px)] p-0">
                      {queryResult ? (
                        queryResult.rows.length > 0 ? (
                          <ScrollArea className="h-full">
                            <div className="px-6">
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
                                    <TableRow key={idx} className="border-border">
                                      {queryResult.columns.map((col) => (
                                        <TableCell key={col} className="py-2 whitespace-nowrap">
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
                        ) : queryResult.message ? (
                          <div className="flex items-center justify-center h-full">
                            <div className="text-center">
                              <div className="w-12 h-12 rounded-full bg-green-500/10 flex items-center justify-center mx-auto mb-4">
                                <CheckIcon />
                              </div>
                              <p className="text-green-400 font-medium">{queryResult.message}</p>
                              <p className="text-sm text-muted-foreground mt-1">
                                Tempo de execucao: {queryResult.executionTime}ms
                              </p>
                            </div>
                          </div>
                        ) : (
                          <div className="flex items-center justify-center h-full">
                            <p className="text-muted-foreground">Nenhum resultado retornado</p>
                          </div>
                        )
                      ) : (
                        <div className="flex items-center justify-center h-full">
                          <div className="text-center">
                            <DatabaseIcon />
                            <p className="text-muted-foreground mt-2">Execute uma query para ver os resultados</p>
                          </div>
                        </div>
                      )}
                    </CardContent>
                  </Card>
                </TabsContent>
              </Tabs>
            </div>
          </div>
        )}

        {/* Not connected state */}
        {!isConnected && !isConnecting && (
          <div className="flex items-center justify-center h-[calc(100vh-300px)]">
            <div className="text-center">
              <div className="w-16 h-16 rounded-full bg-destructive/10 flex items-center justify-center mx-auto mb-4">
                <AlertIcon />
              </div>
              <h2 className="text-xl font-semibold text-foreground mb-2">Nao foi possivel conectar</h2>
              <p className="text-muted-foreground mb-4 max-w-md">
                Verifique se as variaveis de ambiente do banco de dados estao configuradas corretamente.
              </p>
              <Button onClick={connect} className="bg-primary text-primary-foreground">
                <RefreshIcon />
                <span className="ml-2">Tentar Novamente</span>
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
