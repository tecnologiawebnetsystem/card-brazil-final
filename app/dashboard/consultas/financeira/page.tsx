"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

export default function ConsultaFinanceiraPage() {
  const [searchTerm, setSearchTerm] = useState("")
  const [filterPeriodo, setFilterPeriodo] = useState("mes")
  const [filterStatus, setFilterStatus] = useState("todos")

  const mockMovimentacoes = [
    {
      id: "1",
      data: "2024-01-15",
      tipo: "Receita",
      descricao: "Mensalidade - João Silva",
      valor: 450.0,
      status: "Pago",
      operadora: "Unimed SP",
    },
    {
      id: "2",
      data: "2024-01-14",
      tipo: "Despesa",
      descricao: "Sinistro - Maria Costa",
      valor: -1200.0,
      status: "Processado",
      operadora: "SulAmérica",
    },
    {
      id: "3",
      data: "2024-01-13",
      tipo: "Receita",
      descricao: "Mensalidade - Empresa ABC",
      valor: 2800.0,
      status: "Pendente",
      operadora: "Bradesco Saúde",
    },
  ]

  const filteredMovimentacoes = mockMovimentacoes.filter((mov) => {
    const matchesSearch =
      mov.descricao.toLowerCase().includes(searchTerm.toLowerCase()) ||
      mov.operadora.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesStatus = filterStatus === "todos" || mov.status === filterStatus

    return matchesSearch && matchesStatus
  })

  const totalReceitas = mockMovimentacoes
    .filter((m) => m.tipo === "Receita" && m.status === "Pago")
    .reduce((sum, m) => sum + m.valor, 0)

  const totalDespesas = Math.abs(
    mockMovimentacoes.filter((m) => m.tipo === "Despesa").reduce((sum, m) => sum + m.valor, 0),
  )

  const saldoLiquido = totalReceitas - totalDespesas

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-6 py-6">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-2xl font-bold text-foreground">Consulta Financeira</h1>
            <p className="text-muted-foreground">Consulte movimentações financeiras e indicadores</p>
          </div>
        </div>

        {/* Métricas Financeiras */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 bg-emerald-700 text-white rounded-lg flex items-center justify-center">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                    />
                  </svg>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Receitas</p>
                  <p className="text-xl font-bold text-emerald-700">
                    R$ {totalReceitas.toLocaleString("pt-BR", { minimumFractionDigits: 2 })}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 bg-red-600 text-white rounded-lg flex items-center justify-center">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                    />
                  </svg>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Despesas</p>
                  <p className="text-xl font-bold text-red-600">
                    R$ {totalDespesas.toLocaleString("pt-BR", { minimumFractionDigits: 2 })}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-2">
                <div
                  className={`w-8 h-8 text-white rounded-lg flex items-center justify-center ${saldoLiquido >= 0 ? "bg-green-600" : "bg-red-600"}`}
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
                    />
                  </svg>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Saldo Líquido</p>
                  <p className={`text-xl font-bold ${saldoLiquido >= 0 ? "text-green-600" : "text-red-600"}`}>
                    R$ {saldoLiquido.toLocaleString("pt-BR", { minimumFractionDigits: 2 })}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 bg-blue-600 text-white rounded-lg flex items-center justify-center">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6"
                    />
                  </svg>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Pendentes</p>
                  <p className="text-xl font-bold text-blue-600">R$ 2.800,00</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Filtros de Busca */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle>Filtros de Consulta</CardTitle>
            <CardDescription>Filtre as movimentações financeiras</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div>
                <Label htmlFor="search">Descrição ou Operadora</Label>
                <Input
                  id="search"
                  placeholder="Digite para buscar..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
              <div>
                <Label htmlFor="periodo">Período</Label>
                <Select value={filterPeriodo} onValueChange={setFilterPeriodo}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="mes">Este Mês</SelectItem>
                    <SelectItem value="trimestre">Trimestre</SelectItem>
                    <SelectItem value="ano">Este Ano</SelectItem>
                    <SelectItem value="personalizado">Personalizado</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="status">Status</Label>
                <Select value={filterStatus} onValueChange={setFilterStatus}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="todos">Todos</SelectItem>
                    <SelectItem value="Pago">Pago</SelectItem>
                    <SelectItem value="Pendente">Pendente</SelectItem>
                    <SelectItem value="Processado">Processado</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="flex items-end">
                <Button className="w-full">
                  <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="m21 21-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                    />
                  </svg>
                  Consultar
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Resultados */}
        <Card>
          <CardHeader>
            <CardTitle>Movimentações Financeiras</CardTitle>
            <CardDescription>{filteredMovimentacoes.length} movimentação(ões) encontrada(s)</CardDescription>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Data</TableHead>
                  <TableHead>Tipo</TableHead>
                  <TableHead>Descrição</TableHead>
                  <TableHead>Operadora</TableHead>
                  <TableHead>Valor</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Ações</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredMovimentacoes.map((mov) => (
                  <TableRow key={mov.id}>
                    <TableCell>{new Date(mov.data).toLocaleDateString("pt-BR")}</TableCell>
                    <TableCell>
                      <Badge variant={mov.tipo === "Receita" ? "default" : "destructive"}>{mov.tipo}</Badge>
                    </TableCell>
                    <TableCell className="font-medium">{mov.descricao}</TableCell>
                    <TableCell>{mov.operadora}</TableCell>
                    <TableCell className={mov.valor >= 0 ? "text-green-600" : "text-red-600"}>
                      R$ {Math.abs(mov.valor).toLocaleString("pt-BR", { minimumFractionDigits: 2 })}
                    </TableCell>
                    <TableCell>
                      <Badge variant={mov.status === "Pago" ? "default" : "secondary"}>{mov.status}</Badge>
                    </TableCell>
                    <TableCell className="text-right">
                      <Button variant="ghost" size="sm">
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                          />
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
                          />
                        </svg>
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
