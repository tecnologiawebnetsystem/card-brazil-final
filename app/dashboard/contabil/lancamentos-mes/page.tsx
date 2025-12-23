"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { CalendarIcon, DownloadIcon, PrinterIcon, FilterIcon, EditIcon, CheckIcon, XIcon } from "lucide-react"

export default function LancamentosMesPage() {
  const [selectedPeriod, setSelectedPeriod] = useState("2024-03")
  const [selectedStatus, setSelectedStatus] = useState("todos")

  const lancamentosData = [
    {
      id: "LCT-2024-001",
      data: "2024-03-01",
      evento: "Recebimento de Mensalidades",
      contaDebito: "1.1.2.01.001 - Banco do Brasil",
      contaCredito: "3.1.1.01.001 - Receita de Mensalidades",
      valor: 125000.0,
      historico: "Recebimento mensalidades março/2024",
      status: "Processado",
      usuario: "João Silva",
      lote: "LT-2024-03-001",
    },
    {
      id: "LCT-2024-002",
      data: "2024-03-02",
      evento: "Pagamento de Sinistros",
      contaDebito: "4.1.1.01.001 - Despesas com Sinistros",
      contaCredito: "1.1.2.01.001 - Banco do Brasil",
      valor: 85000.0,
      historico: "Pagamento sinistros hospitalares",
      status: "Processado",
      usuario: "Maria Santos",
      lote: "LT-2024-03-002",
    },
    {
      id: "LCT-2024-003",
      data: "2024-03-03",
      evento: "Provisão de Sinistros",
      contaDebito: "4.1.2.01.001 - Provisão de Sinistros",
      contaCredito: "2.1.2.01.001 - Provisão a Pagar",
      valor: 45000.0,
      historico: "Provisão sinistros março/2024",
      status: "Pendente",
      usuario: "Carlos Oliveira",
      lote: "LT-2024-03-003",
    },
    {
      id: "LCT-2024-004",
      data: "2024-03-04",
      evento: "Despesas Administrativas",
      contaDebito: "4.2.1.01.001 - Despesas Administrativas",
      contaCredito: "2.1.1.01.001 - Fornecedores",
      valor: 12500.0,
      historico: "Despesas administrativas março/2024",
      status: "Processado",
      usuario: "Ana Costa",
      lote: "LT-2024-03-004",
    },
  ]

  const resumoLancamentos = {
    totalLancamentos: lancamentosData.length,
    totalDebitos: lancamentosData.reduce((sum, item) => sum + item.valor, 0),
    totalCreditos: lancamentosData.reduce((sum, item) => sum + item.valor, 0),
    processados: lancamentosData.filter((item) => item.status === "Processado").length,
    pendentes: lancamentosData.filter((item) => item.status === "Pendente").length,
  }

  return (
    <div className="flex-1 space-y-6 p-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold tracking-tight bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
            Lançamentos do Mês
          </h2>
          <p className="text-muted-foreground">Gestão dos lançamentos contábeis mensais</p>
        </div>
        <div className="flex items-center space-x-2">
          <Button variant="outline" size="sm">
            <PrinterIcon className="mr-2 h-4 w-4" />
            Imprimir
          </Button>
          <Button variant="outline" size="sm">
            <DownloadIcon className="mr-2 h-4 w-4" />
            Exportar
          </Button>
        </div>
      </div>

      {/* Cards de Resumo */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card className="border-l-4 border-l-blue-500">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Lançamentos</CardTitle>
            <EditIcon className="h-4 w-4 text-blue-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-600">{resumoLancamentos.totalLancamentos}</div>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-green-500">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Processados</CardTitle>
            <CheckIcon className="h-4 w-4 text-green-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">{resumoLancamentos.processados}</div>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-yellow-500">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Pendentes</CardTitle>
            <XIcon className="h-4 w-4 text-yellow-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-yellow-600">{resumoLancamentos.pendentes}</div>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-purple-500">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Movimentado</CardTitle>
            <CalendarIcon className="h-4 w-4 text-purple-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-purple-600">
              R$ {resumoLancamentos.totalDebitos.toLocaleString("pt-BR", { minimumFractionDigits: 2 })}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filtros */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <FilterIcon className="h-5 w-5" />
            Filtros de Consulta
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-4">
            <div className="space-y-2">
              <Label htmlFor="periodo">Período</Label>
              <Input
                id="periodo"
                type="month"
                value={selectedPeriod}
                onChange={(e) => setSelectedPeriod(e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="status">Status</Label>
              <Select value={selectedStatus} onValueChange={setSelectedStatus}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="todos">Todos</SelectItem>
                  <SelectItem value="processado">Processados</SelectItem>
                  <SelectItem value="pendente">Pendentes</SelectItem>
                  <SelectItem value="cancelado">Cancelados</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="evento">Evento</Label>
              <Select defaultValue="todos">
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="todos">Todos os Eventos</SelectItem>
                  <SelectItem value="mensalidades">Mensalidades</SelectItem>
                  <SelectItem value="sinistros">Sinistros</SelectItem>
                  <SelectItem value="provisoes">Provisões</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="flex items-end">
              <Button className="w-full">Filtrar</Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Lançamentos */}
      <Card>
        <CardHeader>
          <CardTitle>Lançamentos Contábeis - {selectedPeriod}</CardTitle>
          <CardDescription>Detalhamento dos lançamentos contábeis do período</CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="lancamentos" className="w-full">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="lancamentos">Lançamentos</TabsTrigger>
              <TabsTrigger value="lotes">Por Lotes</TabsTrigger>
              <TabsTrigger value="resumo">Resumo</TabsTrigger>
            </TabsList>

            <TabsContent value="lancamentos" className="space-y-4">
              <div className="rounded-md border">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>ID</TableHead>
                      <TableHead>Data</TableHead>
                      <TableHead>Evento</TableHead>
                      <TableHead>Conta Débito</TableHead>
                      <TableHead>Conta Crédito</TableHead>
                      <TableHead className="text-right">Valor</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Usuário</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {lancamentosData.map((lancamento) => (
                      <TableRow key={lancamento.id}>
                        <TableCell className="font-mono text-sm">{lancamento.id}</TableCell>
                        <TableCell>{new Date(lancamento.data).toLocaleDateString("pt-BR")}</TableCell>
                        <TableCell className="font-medium">{lancamento.evento}</TableCell>
                        <TableCell className="text-sm">{lancamento.contaDebito}</TableCell>
                        <TableCell className="text-sm">{lancamento.contaCredito}</TableCell>
                        <TableCell className="text-right font-semibold">
                          R$ {lancamento.valor.toLocaleString("pt-BR", { minimumFractionDigits: 2 })}
                        </TableCell>
                        <TableCell>
                          <Badge variant={lancamento.status === "Processado" ? "default" : "secondary"}>
                            {lancamento.status}
                          </Badge>
                        </TableCell>
                        <TableCell>{lancamento.usuario}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </TabsContent>

            <TabsContent value="lotes" className="space-y-4">
              <div className="text-center py-8 text-muted-foreground">Visualização por lotes em desenvolvimento</div>
            </TabsContent>

            <TabsContent value="resumo" className="space-y-4">
              <div className="text-center py-8 text-muted-foreground">Resumo analítico em desenvolvimento</div>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  )
}
