"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { BookIcon, DownloadIcon, PrinterIcon, FilterIcon, CalendarIcon } from "lucide-react"

export default function DiarioContabilPage() {
  const [selectedPeriod, setSelectedPeriod] = useState("2024-03")
  const [selectedDate, setSelectedDate] = useState("2024-03-01")

  const diarioData = [
    {
      data: "2024-03-01",
      lote: "LT-2024-03-001",
      lancamento: "LCT-2024-001",
      historico: "Recebimento mensalidades março/2024",
      contaDebito: "1.1.2.01.001",
      nomeContaDebito: "Banco do Brasil - C/C 12345-6",
      contaCredito: "3.1.1.01.001",
      nomeContaCredito: "Receita de Mensalidades",
      valor: 125000.0,
      usuario: "João Silva",
    },
    {
      data: "2024-03-01",
      lote: "LT-2024-03-002",
      lancamento: "LCT-2024-002",
      historico: "Pagamento sinistros hospitalares",
      contaDebito: "4.1.1.01.001",
      nomeContaDebito: "Despesas com Sinistros",
      contaCredito: "1.1.2.01.001",
      nomeContaCredito: "Banco do Brasil - C/C 12345-6",
      valor: 85000.0,
      usuario: "Maria Santos",
    },
    {
      data: "2024-03-02",
      lote: "LT-2024-03-003",
      lancamento: "LCT-2024-003",
      historico: "Provisão de sinistros março/2024",
      contaDebito: "4.1.2.01.001",
      nomeContaDebito: "Provisão de Sinistros",
      contaCredito: "2.1.2.01.001",
      nomeContaCredito: "Provisão a Pagar",
      valor: 45000.0,
      usuario: "Carlos Oliveira",
    },
    {
      data: "2024-03-02",
      lote: "LT-2024-03-004",
      lancamento: "LCT-2024-004",
      historico: "Despesas administrativas março/2024",
      contaDebito: "4.2.1.01.001",
      nomeContaDebito: "Despesas Administrativas",
      contaCredito: "2.1.1.01.001",
      nomeContaCredito: "Fornecedores",
      valor: 12500.0,
      usuario: "Ana Costa",
    },
    {
      data: "2024-03-03",
      lote: "LT-2024-03-005",
      lancamento: "LCT-2024-005",
      historico: "Recebimento de co-participação",
      contaDebito: "1.1.2.01.001",
      nomeContaDebito: "Banco do Brasil - C/C 12345-6",
      contaCredito: "3.1.2.01.001",
      nomeContaCredito: "Receita de Co-participação",
      valor: 8500.0,
      usuario: "João Silva",
    },
  ]

  const resumoDiario = {
    totalLancamentos: diarioData.length,
    totalDebitos: diarioData.reduce((sum, item) => sum + item.valor, 0),
    totalCreditos: diarioData.reduce((sum, item) => sum + item.valor, 0),
    lotes: [...new Set(diarioData.map((item) => item.lote))].length,
  }

  const lancamentosPorData = diarioData.reduce(
    (acc, lancamento) => {
      const data = lancamento.data
      if (!acc[data]) {
        acc[data] = []
      }
      acc[data].push(lancamento)
      return acc
    },
    {} as Record<string, typeof diarioData>,
  )

  return (
    <div className="flex-1 space-y-6 p-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold tracking-tight bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
            Diário Contábil
          </h2>
          <p className="text-muted-foreground">Livro diário dos lançamentos contábeis</p>
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
            <BookIcon className="h-4 w-4 text-blue-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-600">{resumoDiario.totalLancamentos}</div>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-green-500">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Débitos</CardTitle>
            <BookIcon className="h-4 w-4 text-green-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">
              R$ {resumoDiario.totalDebitos.toLocaleString("pt-BR", { minimumFractionDigits: 2 })}
            </div>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-red-500">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Créditos</CardTitle>
            <BookIcon className="h-4 w-4 text-red-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-600">
              R$ {resumoDiario.totalCreditos.toLocaleString("pt-BR", { minimumFractionDigits: 2 })}
            </div>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-purple-500">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Lotes Processados</CardTitle>
            <CalendarIcon className="h-4 w-4 text-purple-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-purple-600">{resumoDiario.lotes}</div>
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
              <Label htmlFor="dataInicio">Data Início</Label>
              <Input id="dataInicio" type="date" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="dataFim">Data Fim</Label>
              <Input id="dataFim" type="date" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="lote">Lote</Label>
              <Select>
                <SelectTrigger>
                  <SelectValue placeholder="Todos os lotes" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="todos">Todos os Lotes</SelectItem>
                  <SelectItem value="LT-2024-03-001">LT-2024-03-001</SelectItem>
                  <SelectItem value="LT-2024-03-002">LT-2024-03-002</SelectItem>
                  <SelectItem value="LT-2024-03-003">LT-2024-03-003</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Diário Contábil */}
      <Card>
        <CardHeader>
          <CardTitle>Diário Contábil - {selectedPeriod}</CardTitle>
          <CardDescription>Registro cronológico dos lançamentos contábeis</CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="cronologico" className="w-full">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="cronologico">Cronológico</TabsTrigger>
              <TabsTrigger value="por-data">Por Data</TabsTrigger>
              <TabsTrigger value="por-lote">Por Lote</TabsTrigger>
            </TabsList>

            <TabsContent value="cronologico" className="space-y-4">
              <div className="rounded-md border">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Data</TableHead>
                      <TableHead>Lote</TableHead>
                      <TableHead>Lançamento</TableHead>
                      <TableHead>Histórico</TableHead>
                      <TableHead>Conta Débito</TableHead>
                      <TableHead>Conta Crédito</TableHead>
                      <TableHead className="text-right">Valor</TableHead>
                      <TableHead>Usuário</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {diarioData.map((lancamento, index) => (
                      <TableRow key={index}>
                        <TableCell>{new Date(lancamento.data).toLocaleDateString("pt-BR")}</TableCell>
                        <TableCell className="font-mono text-sm">{lancamento.lote}</TableCell>
                        <TableCell className="font-mono text-sm">{lancamento.lancamento}</TableCell>
                        <TableCell className="font-medium">{lancamento.historico}</TableCell>
                        <TableCell className="text-sm">
                          <div>
                            <div className="font-mono">{lancamento.contaDebito}</div>
                            <div className="text-muted-foreground">{lancamento.nomeContaDebito}</div>
                          </div>
                        </TableCell>
                        <TableCell className="text-sm">
                          <div>
                            <div className="font-mono">{lancamento.contaCredito}</div>
                            <div className="text-muted-foreground">{lancamento.nomeContaCredito}</div>
                          </div>
                        </TableCell>
                        <TableCell className="text-right font-semibold">
                          R$ {lancamento.valor.toLocaleString("pt-BR", { minimumFractionDigits: 2 })}
                        </TableCell>
                        <TableCell>{lancamento.usuario}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </TabsContent>

            <TabsContent value="por-data" className="space-y-4">
              {Object.entries(lancamentosPorData).map(([data, lancamentos]) => (
                <Card key={data}>
                  <CardHeader>
                    <CardTitle className="text-lg">
                      {new Date(data).toLocaleDateString("pt-BR", {
                        weekday: "long",
                        year: "numeric",
                        month: "long",
                        day: "numeric",
                      })}
                    </CardTitle>
                    <CardDescription>
                      {lancamentos.length} lançamento(s) - Total: R${" "}
                      {lancamentos
                        .reduce((sum, l) => sum + l.valor, 0)
                        .toLocaleString("pt-BR", { minimumFractionDigits: 2 })}
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2">
                      {lancamentos.map((lancamento, index) => (
                        <div key={index} className="flex items-center justify-between p-3 border rounded-lg">
                          <div className="flex-1">
                            <div className="font-medium">{lancamento.historico}</div>
                            <div className="text-sm text-muted-foreground">
                              {lancamento.contaDebito} → {lancamento.contaCredito}
                            </div>
                          </div>
                          <div className="text-right">
                            <div className="font-semibold">
                              R$ {lancamento.valor.toLocaleString("pt-BR", { minimumFractionDigits: 2 })}
                            </div>
                            <div className="text-sm text-muted-foreground">{lancamento.lote}</div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </TabsContent>

            <TabsContent value="por-lote" className="space-y-4">
              <div className="text-center py-8 text-muted-foreground">Visualização por lotes em desenvolvimento</div>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  )
}
