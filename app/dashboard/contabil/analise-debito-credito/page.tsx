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
import { Progress } from "@/components/ui/progress"
import {
  BarChartIcon,
  DownloadIcon,
  PrinterIcon,
  FilterIcon,
  TrendingUpIcon,
  TrendingDownIcon,
  AlertTriangleIcon,
} from "lucide-react"

export default function AnaliseDebitoCreditoPage() {
  const [selectedPeriod, setSelectedPeriod] = useState("2024-03")
  const [selectedAnalysis, setSelectedAnalysis] = useState("geral")

  const analiseData = [
    {
      conta: "1.1.2.01.001",
      nomeConta: "Banco do Brasil - C/C 12345-6",
      natureza: "Devedora",
      saldoInicial: 2850000.0,
      totalDebitos: 307500.0,
      totalCreditos: 130000.0,
      saldoFinal: 3027500.0,
      movimentacoes: 6,
      percentualDebito: 70.3,
      percentualCredito: 29.7,
      variacao: 6.23,
      status: "Normal",
    },
    {
      conta: "3.1.1.01.001",
      nomeConta: "Receita de Mensalidades",
      natureza: "Credora",
      saldoInicial: 0,
      totalDebitos: 0,
      totalCreditos: 305000.0,
      saldoFinal: 305000.0,
      movimentacoes: 3,
      percentualDebito: 0,
      percentualCredito: 100,
      variacao: 0,
      status: "Normal",
    },
    {
      conta: "4.1.1.01.001",
      nomeConta: "Despesas com Sinistros",
      natureza: "Devedora",
      saldoInicial: 0,
      totalDebitos: 85000.0,
      totalCreditos: 0,
      saldoFinal: 85000.0,
      movimentacoes: 1,
      percentualDebito: 100,
      percentualCredito: 0,
      variacao: 0,
      status: "Atenção",
    },
    {
      conta: "2.1.2.01.001",
      nomeConta: "Provisão a Pagar",
      natureza: "Credora",
      saldoInicial: 3200000.0,
      totalDebitos: 2800000.0,
      totalCreditos: 3145000.0,
      saldoFinal: 3545000.0,
      movimentacoes: 8,
      percentualDebito: 47.1,
      percentualCredito: 52.9,
      variacao: 10.78,
      status: "Normal",
    },
  ]

  const resumoAnalise = {
    totalContas: analiseData.length,
    contasDevedoras: analiseData.filter((c) => c.natureza === "Devedora").length,
    contasCredoras: analiseData.filter((c) => c.natureza === "Credora").length,
    totalDebitos: analiseData.reduce((sum, c) => sum + c.totalDebitos, 0),
    totalCreditos: analiseData.reduce((sum, c) => sum + c.totalCreditos, 0),
    contasAtencao: analiseData.filter((c) => c.status === "Atenção").length,
  }

  const divergencias = [
    {
      conta: "4.1.1.01.001",
      problema: "Conta de despesa sem movimentação de crédito",
      impacto: "Médio",
      recomendacao: "Verificar se há estornos ou ajustes pendentes",
    },
    {
      conta: "1.2.1.01.001",
      problema: "Saldo crescente em contas a receber",
      impacto: "Alto",
      recomendacao: "Analisar política de cobrança e inadimplência",
    },
  ]

  return (
    <div className="flex-1 space-y-6 p-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold tracking-tight bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
            Análise Débito/Crédito
          </h2>
          <p className="text-muted-foreground">Análise da movimentação de débitos e créditos por conta</p>
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
            <CardTitle className="text-sm font-medium">Total Contas</CardTitle>
            <BarChartIcon className="h-4 w-4 text-blue-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-600">{resumoAnalise.totalContas}</div>
            <p className="text-xs text-muted-foreground">
              {resumoAnalise.contasDevedoras} devedoras, {resumoAnalise.contasCredoras} credoras
            </p>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-green-500">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Débitos</CardTitle>
            <TrendingUpIcon className="h-4 w-4 text-green-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">
              R$ {resumoAnalise.totalDebitos.toLocaleString("pt-BR", { minimumFractionDigits: 2 })}
            </div>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-red-500">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Créditos</CardTitle>
            <TrendingDownIcon className="h-4 w-4 text-red-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-600">
              R$ {resumoAnalise.totalCreditos.toLocaleString("pt-BR", { minimumFractionDigits: 2 })}
            </div>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-yellow-500">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Contas em Atenção</CardTitle>
            <AlertTriangleIcon className="h-4 w-4 text-yellow-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-yellow-600">{resumoAnalise.contasAtencao}</div>
          </CardContent>
        </Card>
      </div>

      {/* Filtros */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <FilterIcon className="h-5 w-5" />
            Filtros de Análise
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
              <Label htmlFor="analise">Tipo de Análise</Label>
              <Select value={selectedAnalysis} onValueChange={setSelectedAnalysis}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="geral">Análise Geral</SelectItem>
                  <SelectItem value="devedoras">Contas Devedoras</SelectItem>
                  <SelectItem value="credoras">Contas Credoras</SelectItem>
                  <SelectItem value="divergencias">Divergências</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="natureza">Natureza da Conta</Label>
              <Select>
                <SelectTrigger>
                  <SelectValue placeholder="Todas" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="todas">Todas</SelectItem>
                  <SelectItem value="devedora">Devedora</SelectItem>
                  <SelectItem value="credora">Credora</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="flex items-end">
              <Button className="w-full">Analisar</Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Análise Débito/Crédito */}
      <Card>
        <CardHeader>
          <CardTitle>Análise Débito/Crédito - {selectedPeriod}</CardTitle>
          <CardDescription>Análise detalhada da movimentação de débitos e créditos</CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="analise" className="w-full">
            <TabsList className="grid w-full grid-cols-4">
              <TabsTrigger value="analise">Análise</TabsTrigger>
              <TabsTrigger value="proporcoes">Proporções</TabsTrigger>
              <TabsTrigger value="divergencias">Divergências</TabsTrigger>
              <TabsTrigger value="graficos">Gráficos</TabsTrigger>
            </TabsList>

            <TabsContent value="analise" className="space-y-4">
              <div className="rounded-md border">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Conta</TableHead>
                      <TableHead>Nome da Conta</TableHead>
                      <TableHead>Natureza</TableHead>
                      <TableHead className="text-right">Saldo Inicial</TableHead>
                      <TableHead className="text-right">Débitos</TableHead>
                      <TableHead className="text-right">Créditos</TableHead>
                      <TableHead className="text-right">Saldo Final</TableHead>
                      <TableHead className="text-right">Variação</TableHead>
                      <TableHead>Status</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {analiseData.map((conta) => (
                      <TableRow key={conta.conta}>
                        <TableCell className="font-mono text-sm">{conta.conta}</TableCell>
                        <TableCell className="font-medium">{conta.nomeConta}</TableCell>
                        <TableCell>
                          <Badge variant={conta.natureza === "Devedora" ? "default" : "secondary"}>
                            {conta.natureza}
                          </Badge>
                        </TableCell>
                        <TableCell className="text-right">
                          R$ {conta.saldoInicial.toLocaleString("pt-BR", { minimumFractionDigits: 2 })}
                        </TableCell>
                        <TableCell className="text-right text-green-600 font-semibold">
                          R$ {conta.totalDebitos.toLocaleString("pt-BR", { minimumFractionDigits: 2 })}
                        </TableCell>
                        <TableCell className="text-right text-red-600 font-semibold">
                          R$ {conta.totalCreditos.toLocaleString("pt-BR", { minimumFractionDigits: 2 })}
                        </TableCell>
                        <TableCell className="text-right font-bold">
                          R$ {conta.saldoFinal.toLocaleString("pt-BR", { minimumFractionDigits: 2 })}
                        </TableCell>
                        <TableCell className="text-right">
                          <span
                            className={conta.variacao > 0 ? "text-green-600" : conta.variacao < 0 ? "text-red-600" : ""}
                          >
                            {conta.variacao > 0 ? "+" : ""}
                            {conta.variacao}%
                          </span>
                        </TableCell>
                        <TableCell>
                          <Badge variant={conta.status === "Normal" ? "default" : "destructive"}>{conta.status}</Badge>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </TabsContent>

            <TabsContent value="proporcoes" className="space-y-4">
              <div className="grid gap-4 md:grid-cols-2">
                {analiseData.map((conta) => (
                  <Card key={conta.conta}>
                    <CardHeader>
                      <CardTitle className="text-lg">{conta.conta}</CardTitle>
                      <CardDescription>{conta.nomeConta}</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="space-y-2">
                        <div className="flex justify-between text-sm">
                          <span>Débitos ({conta.percentualDebito}%)</span>
                          <span className="font-medium">
                            R$ {conta.totalDebitos.toLocaleString("pt-BR", { minimumFractionDigits: 2 })}
                          </span>
                        </div>
                        <Progress value={conta.percentualDebito} className="h-2" />
                      </div>

                      <div className="space-y-2">
                        <div className="flex justify-between text-sm">
                          <span>Créditos ({conta.percentualCredito}%)</span>
                          <span className="font-medium">
                            R$ {conta.totalCreditos.toLocaleString("pt-BR", { minimumFractionDigits: 2 })}
                          </span>
                        </div>
                        <Progress value={conta.percentualCredito} className="h-2" />
                      </div>

                      <div className="pt-2 border-t">
                        <div className="flex justify-between">
                          <span className="font-medium">Movimentações:</span>
                          <span>{conta.movimentacoes}</span>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </TabsContent>

            <TabsContent value="divergencias" className="space-y-4">
              <div className="space-y-4">
                {divergencias.map((divergencia, index) => (
                  <Card key={index}>
                    <CardHeader>
                      <div className="flex items-center justify-between">
                        <CardTitle className="text-lg">{divergencia.conta}</CardTitle>
                        <Badge variant={divergencia.impacto === "Alto" ? "destructive" : "secondary"}>
                          Impacto {divergencia.impacto}
                        </Badge>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-2">
                        <div>
                          <span className="font-medium">Problema:</span>
                          <p className="text-muted-foreground">{divergencia.problema}</p>
                        </div>
                        <div>
                          <span className="font-medium">Recomendação:</span>
                          <p className="text-muted-foreground">{divergencia.recomendacao}</p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </TabsContent>

            <TabsContent value="graficos" className="space-y-4">
              <div className="text-center py-8 text-muted-foreground">Gráficos de análise em desenvolvimento</div>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  )
}
