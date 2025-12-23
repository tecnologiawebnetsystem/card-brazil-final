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
import { DownloadIcon, PrinterIcon, FilterIcon, TrendingUpIcon, TrendingDownIcon } from "lucide-react"

export default function BalancetesPage() {
  const [selectedPeriod, setSelectedPeriod] = useState("2024-03")
  const [selectedType, setSelectedType] = useState("sintetico")

  const balanceteData = [
    {
      codigo: "1.1.1.01.001",
      conta: "Caixa Geral",
      saldoAnterior: 125000.0,
      debitos: 450000.0,
      creditos: 380000.0,
      saldoAtual: 195000.0,
      natureza: "Devedora",
    },
    {
      codigo: "1.1.2.01.001",
      conta: "Banco do Brasil - C/C 12345-6",
      saldoAnterior: 2850000.0,
      debitos: 1250000.0,
      creditos: 980000.0,
      saldoAtual: 3120000.0,
      natureza: "Devedora",
    },
    {
      codigo: "1.2.1.01.001",
      conta: "Mensalidades a Receber",
      saldoAnterior: 1850000.0,
      debitos: 2100000.0,
      creditos: 1950000.0,
      saldoAtual: 2000000.0,
      natureza: "Devedora",
    },
    {
      codigo: "2.1.1.01.001",
      conta: "Fornecedores",
      saldoAnterior: 450000.0,
      debitos: 380000.0,
      creditos: 520000.0,
      saldoAtual: 590000.0,
      natureza: "Credora",
    },
    {
      codigo: "2.1.2.01.001",
      conta: "Provisão de Sinistros",
      saldoAnterior: 3200000.0,
      debitos: 2800000.0,
      creditos: 3100000.0,
      saldoAtual: 3500000.0,
      natureza: "Credora",
    },
  ]

  const resumoBalancete = {
    totalAtivo: 5315000.0,
    totalPassivo: 4090000.0,
    totalPatrimonio: 1225000.0,
    variacao: 2.5,
  }

  return (
    <div className="flex-1 space-y-6 p-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold tracking-tight bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
            Balancetes
          </h2>
          <p className="text-muted-foreground">Gestão e consulta de balancetes contábeis</p>
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
            <CardTitle className="text-sm font-medium">Total Ativo</CardTitle>
            <TrendingUpIcon className="h-4 w-4 text-blue-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-600">
              R$ {resumoBalancete.totalAtivo.toLocaleString("pt-BR", { minimumFractionDigits: 2 })}
            </div>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-red-500">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Passivo</CardTitle>
            <TrendingDownIcon className="h-4 w-4 text-red-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-600">
              R$ {resumoBalancete.totalPassivo.toLocaleString("pt-BR", { minimumFractionDigits: 2 })}
            </div>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-green-500">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Patrimônio Líquido</CardTitle>
            <TrendingUpIcon className="h-4 w-4 text-green-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">
              R$ {resumoBalancete.totalPatrimonio.toLocaleString("pt-BR", { minimumFractionDigits: 2 })}
            </div>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-purple-500">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Variação Mensal</CardTitle>
            <TrendingUpIcon className="h-4 w-4 text-purple-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-purple-600">+{resumoBalancete.variacao}%</div>
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
              <Label htmlFor="tipo">Tipo de Balancete</Label>
              <Select value={selectedType} onValueChange={setSelectedType}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="sintetico">Sintético</SelectItem>
                  <SelectItem value="analitico">Analítico</SelectItem>
                  <SelectItem value="completo">Completo</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="nivel">Nível de Conta</Label>
              <Select defaultValue="todos">
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="todos">Todos os Níveis</SelectItem>
                  <SelectItem value="1">Nível 1</SelectItem>
                  <SelectItem value="2">Nível 2</SelectItem>
                  <SelectItem value="3">Nível 3</SelectItem>
                  <SelectItem value="4">Nível 4</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="flex items-end">
              <Button className="w-full">Gerar Balancete</Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Balancete */}
      <Card>
        <CardHeader>
          <CardTitle>Balancete de Verificação - {selectedPeriod}</CardTitle>
          <CardDescription>Demonstrativo dos saldos das contas contábeis</CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="balancete" className="w-full">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="balancete">Balancete</TabsTrigger>
              <TabsTrigger value="comparativo">Comparativo</TabsTrigger>
              <TabsTrigger value="graficos">Gráficos</TabsTrigger>
            </TabsList>

            <TabsContent value="balancete" className="space-y-4">
              <div className="rounded-md border">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Código</TableHead>
                      <TableHead>Conta</TableHead>
                      <TableHead className="text-right">Saldo Anterior</TableHead>
                      <TableHead className="text-right">Débitos</TableHead>
                      <TableHead className="text-right">Créditos</TableHead>
                      <TableHead className="text-right">Saldo Atual</TableHead>
                      <TableHead>Natureza</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {balanceteData.map((conta) => (
                      <TableRow key={conta.codigo}>
                        <TableCell className="font-mono text-sm">{conta.codigo}</TableCell>
                        <TableCell className="font-medium">{conta.conta}</TableCell>
                        <TableCell className="text-right">
                          R$ {conta.saldoAnterior.toLocaleString("pt-BR", { minimumFractionDigits: 2 })}
                        </TableCell>
                        <TableCell className="text-right">
                          R$ {conta.debitos.toLocaleString("pt-BR", { minimumFractionDigits: 2 })}
                        </TableCell>
                        <TableCell className="text-right">
                          R$ {conta.creditos.toLocaleString("pt-BR", { minimumFractionDigits: 2 })}
                        </TableCell>
                        <TableCell className="text-right font-semibold">
                          R$ {conta.saldoAtual.toLocaleString("pt-BR", { minimumFractionDigits: 2 })}
                        </TableCell>
                        <TableCell>
                          <Badge variant={conta.natureza === "Devedora" ? "default" : "secondary"}>
                            {conta.natureza}
                          </Badge>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </TabsContent>

            <TabsContent value="comparativo" className="space-y-4">
              <div className="text-center py-8 text-muted-foreground">
                Comparativo entre períodos em desenvolvimento
              </div>
            </TabsContent>

            <TabsContent value="graficos" className="space-y-4">
              <div className="text-center py-8 text-muted-foreground">
                Gráficos e análises visuais em desenvolvimento
              </div>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  )
}
