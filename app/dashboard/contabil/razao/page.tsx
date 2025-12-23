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
import { BookOpenIcon, DownloadIcon, PrinterIcon, FilterIcon } from "lucide-react"

export default function RazaoContabilPage() {
  const [selectedPeriod, setSelectedPeriod] = useState("2024-03")
  const [selectedAccount, setSelectedAccount] = useState("1.1.2.01.001")

  const razaoData = [
    {
      data: "2024-03-01",
      historico: "Saldo Inicial",
      documento: "-",
      debito: 0,
      credito: 0,
      saldo: 2850000.0,
      tipo: "Saldo Inicial",
    },
    {
      data: "2024-03-02",
      historico: "Recebimento mensalidades março/2024",
      documento: "LCT-2024-001",
      debito: 125000.0,
      credito: 0,
      saldo: 2975000.0,
      tipo: "Débito",
    },
    {
      data: "2024-03-05",
      historico: "Pagamento sinistros hospitalares",
      documento: "LCT-2024-002",
      debito: 0,
      credito: 85000.0,
      saldo: 2890000.0,
      tipo: "Crédito",
    },
    {
      data: "2024-03-10",
      historico: "Recebimento mensalidades março/2024",
      documento: "LCT-2024-015",
      debito: 180000.0,
      credito: 0,
      saldo: 3070000.0,
      tipo: "Débito",
    },
    {
      data: "2024-03-15",
      historico: "Pagamento fornecedores",
      documento: "LCT-2024-025",
      debito: 0,
      credito: 45000.0,
      saldo: 3025000.0,
      tipo: "Crédito",
    },
    {
      data: "2024-03-20",
      historico: "Ajuste manual - Correção lançamento",
      documento: "AJT-2024-001",
      debito: 2500.0,
      credito: 0,
      saldo: 3027500.0,
      tipo: "Ajuste",
    },
  ]

  const contasDisponiveis = [
    { codigo: "1.1.1.01.001", nome: "Caixa Geral" },
    { codigo: "1.1.2.01.001", nome: "Banco do Brasil - C/C 12345-6" },
    { codigo: "1.2.1.01.001", nome: "Mensalidades a Receber" },
    { codigo: "2.1.1.01.001", nome: "Fornecedores" },
    { codigo: "2.1.2.01.001", nome: "Provisão de Sinistros" },
    { codigo: "3.1.1.01.001", nome: "Receita de Mensalidades" },
    { codigo: "4.1.1.01.001", nome: "Despesas com Sinistros" },
  ]

  const contaSelecionada = contasDisponiveis.find((conta) => conta.codigo === selectedAccount)
  const saldoFinal = razaoData[razaoData.length - 1]?.saldo || 0
  const totalDebitos = razaoData.reduce((sum, item) => sum + item.debito, 0)
  const totalCreditos = razaoData.reduce((sum, item) => sum + item.credito, 0)

  return (
    <div className="flex-1 space-y-6 p-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold tracking-tight bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
            Razão Contábil
          </h2>
          <p className="text-muted-foreground">Livro razão das contas contábeis</p>
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
            <CardTitle className="text-sm font-medium">Saldo Final</CardTitle>
            <BookOpenIcon className="h-4 w-4 text-blue-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-600">
              R$ {saldoFinal.toLocaleString("pt-BR", { minimumFractionDigits: 2 })}
            </div>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-green-500">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Débitos</CardTitle>
            <BookOpenIcon className="h-4 w-4 text-green-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">
              R$ {totalDebitos.toLocaleString("pt-BR", { minimumFractionDigits: 2 })}
            </div>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-red-500">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Créditos</CardTitle>
            <BookOpenIcon className="h-4 w-4 text-red-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-600">
              R$ {totalCreditos.toLocaleString("pt-BR", { minimumFractionDigits: 2 })}
            </div>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-purple-500">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Movimentações</CardTitle>
            <BookOpenIcon className="h-4 w-4 text-purple-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-purple-600">{razaoData.length - 1}</div>
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
              <Label htmlFor="conta">Conta Contábil</Label>
              <Select value={selectedAccount} onValueChange={setSelectedAccount}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {contasDisponiveis.map((conta) => (
                    <SelectItem key={conta.codigo} value={conta.codigo}>
                      {conta.codigo} - {conta.nome}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
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
          </div>
        </CardContent>
      </Card>

      {/* Razão Contábil */}
      <Card>
        <CardHeader>
          <CardTitle>
            Razão Contábil - {contaSelecionada?.codigo} - {contaSelecionada?.nome}
          </CardTitle>
          <CardDescription>Movimentação detalhada da conta no período {selectedPeriod}</CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="movimentacao" className="w-full">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="movimentacao">Movimentação</TabsTrigger>
              <TabsTrigger value="resumo">Resumo</TabsTrigger>
              <TabsTrigger value="grafico">Gráfico</TabsTrigger>
            </TabsList>

            <TabsContent value="movimentacao" className="space-y-4">
              <div className="rounded-md border">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Data</TableHead>
                      <TableHead>Histórico</TableHead>
                      <TableHead>Documento</TableHead>
                      <TableHead className="text-right">Débito</TableHead>
                      <TableHead className="text-right">Crédito</TableHead>
                      <TableHead className="text-right">Saldo</TableHead>
                      <TableHead>Tipo</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {razaoData.map((movimento, index) => (
                      <TableRow key={index}>
                        <TableCell>{new Date(movimento.data).toLocaleDateString("pt-BR")}</TableCell>
                        <TableCell className="font-medium">{movimento.historico}</TableCell>
                        <TableCell className="font-mono text-sm">{movimento.documento}</TableCell>
                        <TableCell className="text-right">
                          {movimento.debito > 0 ? (
                            <span className="text-green-600 font-semibold">
                              R$ {movimento.debito.toLocaleString("pt-BR", { minimumFractionDigits: 2 })}
                            </span>
                          ) : (
                            "-"
                          )}
                        </TableCell>
                        <TableCell className="text-right">
                          {movimento.credito > 0 ? (
                            <span className="text-red-600 font-semibold">
                              R$ {movimento.credito.toLocaleString("pt-BR", { minimumFractionDigits: 2 })}
                            </span>
                          ) : (
                            "-"
                          )}
                        </TableCell>
                        <TableCell className="text-right font-bold">
                          R$ {movimento.saldo.toLocaleString("pt-BR", { minimumFractionDigits: 2 })}
                        </TableCell>
                        <TableCell>
                          <Badge
                            variant={
                              movimento.tipo === "Saldo Inicial"
                                ? "outline"
                                : movimento.tipo === "Débito"
                                  ? "default"
                                  : movimento.tipo === "Crédito"
                                    ? "secondary"
                                    : "destructive"
                            }
                          >
                            {movimento.tipo}
                          </Badge>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </TabsContent>

            <TabsContent value="resumo" className="space-y-4">
              <div className="grid gap-4 md:grid-cols-2">
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">Resumo da Conta</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="flex justify-between">
                      <span>Saldo Inicial:</span>
                      <span className="font-semibold">R$ 2.850.000,00</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Total Débitos:</span>
                      <span className="font-semibold text-green-600">
                        R$ {totalDebitos.toLocaleString("pt-BR", { minimumFractionDigits: 2 })}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span>Total Créditos:</span>
                      <span className="font-semibold text-red-600">
                        R$ {totalCreditos.toLocaleString("pt-BR", { minimumFractionDigits: 2 })}
                      </span>
                    </div>
                    <div className="flex justify-between border-t pt-2">
                      <span className="font-bold">Saldo Final:</span>
                      <span className="font-bold text-blue-600">
                        R$ {saldoFinal.toLocaleString("pt-BR", { minimumFractionDigits: 2 })}
                      </span>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">Análise de Movimentação</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="flex justify-between">
                      <span>Número de Lançamentos:</span>
                      <span className="font-semibold">{razaoData.length - 1}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Maior Débito:</span>
                      <span className="font-semibold">R$ 180.000,00</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Maior Crédito:</span>
                      <span className="font-semibold">R$ 85.000,00</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Variação no Período:</span>
                      <span className="font-semibold text-green-600">+6,23%</span>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

            <TabsContent value="grafico" className="space-y-4">
              <div className="text-center py-8 text-muted-foreground">
                Gráfico de evolução do saldo em desenvolvimento
              </div>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  )
}
