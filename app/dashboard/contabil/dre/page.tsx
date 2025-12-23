"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { DownloadIcon, PrinterIcon, FilterIcon, TrendingUpIcon, TrendingDownIcon, DollarSignIcon } from "lucide-react"

export default function DREPage() {
  const [selectedPeriod, setSelectedPeriod] = useState("2024-03")
  const [selectedComparison, setSelectedComparison] = useState("mensal")

  const dreData = [
    {
      grupo: "RECEITAS OPERACIONAIS",
      items: [
        { conta: "Contraprestações Pecuniárias", valor: 12500000.0, percentual: 85.2 },
        { conta: "Receitas de Aplicações Financeiras", valor: 450000.0, percentual: 3.1 },
        { conta: "Outras Receitas Operacionais", valor: 180000.0, percentual: 1.2 },
      ],
      total: 13130000.0,
      percentualTotal: 89.5,
    },
    {
      grupo: "CUSTOS ASSISTENCIAIS",
      items: [
        { conta: "Eventos Indenizáveis Líquidos", valor: -8200000.0, percentual: -55.9 },
        { conta: "Provisão de Eventos a Liquidar", valor: -1800000.0, percentual: -12.3 },
        { conta: "Variação da Provisão Técnica", valor: -450000.0, percentual: -3.1 },
      ],
      total: -10450000.0,
      percentualTotal: -71.3,
    },
    {
      grupo: "DESPESAS ADMINISTRATIVAS",
      items: [
        { conta: "Despesas com Pessoal", valor: -1200000.0, percentual: -8.2 },
        { conta: "Despesas Gerais", valor: -680000.0, percentual: -4.6 },
        { conta: "Depreciação e Amortização", valor: -120000.0, percentual: -0.8 },
      ],
      total: -2000000.0,
      percentualTotal: -13.6,
    },
    {
      grupo: "DESPESAS COMERCIAIS",
      items: [
        { conta: "Comissões de Corretagem", valor: -380000.0, percentual: -2.6 },
        { conta: "Despesas de Marketing", valor: -150000.0, percentual: -1.0 },
        { conta: "Outras Despesas Comerciais", valor: -70000.0, percentual: -0.5 },
      ],
      total: -600000.0,
      percentualTotal: -4.1,
    },
  ]

  const resultados = {
    receitaOperacional: 13130000.0,
    custosAssistenciais: -10450000.0,
    despesasAdministrativas: -2000000.0,
    despesasComerciais: -600000.0,
    resultadoOperacional: 80000.0,
    resultadoFinanceiro: 45000.0,
    resultadoAntesIR: 125000.0,
    impostoRenda: -31250.0,
    lucroLiquido: 93750.0,
    margemLiquida: 0.64,
  }

  return (
    <div className="flex-1 space-y-6 p-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold tracking-tight bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
            DRE - Demonstração do Resultado do Exercício
          </h2>
          <p className="text-muted-foreground">Análise detalhada do resultado operacional da administradora</p>
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
        <Card className="border-l-4 border-l-green-500">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Receita Operacional</CardTitle>
            <TrendingUpIcon className="h-4 w-4 text-green-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">
              R$ {resultados.receitaOperacional.toLocaleString("pt-BR", { minimumFractionDigits: 2 })}
            </div>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-red-500">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Custos Assistenciais</CardTitle>
            <TrendingDownIcon className="h-4 w-4 text-red-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-600">
              R$ {Math.abs(resultados.custosAssistenciais).toLocaleString("pt-BR", { minimumFractionDigits: 2 })}
            </div>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-blue-500">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Resultado Operacional</CardTitle>
            <DollarSignIcon className="h-4 w-4 text-blue-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-600">
              R$ {resultados.resultadoOperacional.toLocaleString("pt-BR", { minimumFractionDigits: 2 })}
            </div>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-purple-500">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Margem Líquida</CardTitle>
            <TrendingUpIcon className="h-4 w-4 text-purple-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-purple-600">{resultados.margemLiquida}%</div>
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
              <Label htmlFor="comparacao">Comparação</Label>
              <Select value={selectedComparison} onValueChange={setSelectedComparison}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="mensal">Mensal</SelectItem>
                  <SelectItem value="trimestral">Trimestral</SelectItem>
                  <SelectItem value="anual">Anual</SelectItem>
                  <SelectItem value="acumulado">Acumulado</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="formato">Formato</Label>
              <Select defaultValue="completo">
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="completo">Completo</SelectItem>
                  <SelectItem value="resumido">Resumido</SelectItem>
                  <SelectItem value="gerencial">Gerencial</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="flex items-end">
              <Button className="w-full">Gerar DRE</Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* DRE */}
      <Card>
        <CardHeader>
          <CardTitle>Demonstração do Resultado do Exercício - {selectedPeriod}</CardTitle>
          <CardDescription>Análise detalhada das receitas, custos e despesas</CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="dre" className="w-full">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="dre">DRE Detalhada</TabsTrigger>
              <TabsTrigger value="comparativo">Comparativo</TabsTrigger>
              <TabsTrigger value="indicadores">Indicadores</TabsTrigger>
            </TabsList>

            <TabsContent value="dre" className="space-y-4">
              <div className="rounded-md border">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="w-[400px]">Conta</TableHead>
                      <TableHead className="text-right">Valor (R$)</TableHead>
                      <TableHead className="text-right">% Receita</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {dreData.map((grupo, index) => (
                      <>
                        <TableRow key={`grupo-${index}`} className="bg-muted/50">
                          <TableCell className="font-bold text-lg">{grupo.grupo}</TableCell>
                          <TableCell className="text-right font-bold">
                            R$ {Math.abs(grupo.total).toLocaleString("pt-BR", { minimumFractionDigits: 2 })}
                          </TableCell>
                          <TableCell className="text-right font-bold">{grupo.percentualTotal}%</TableCell>
                        </TableRow>
                        {grupo.items.map((item, itemIndex) => (
                          <TableRow key={`item-${index}-${itemIndex}`}>
                            <TableCell className="pl-8">{item.conta}</TableCell>
                            <TableCell className="text-right">
                              R$ {Math.abs(item.valor).toLocaleString("pt-BR", { minimumFractionDigits: 2 })}
                            </TableCell>
                            <TableCell className="text-right">{Math.abs(item.percentual)}%</TableCell>
                          </TableRow>
                        ))}
                      </>
                    ))}

                    {/* Resultados */}
                    <TableRow className="border-t-2 bg-blue-50">
                      <TableCell className="font-bold">RESULTADO OPERACIONAL</TableCell>
                      <TableCell className="text-right font-bold text-blue-600">
                        R$ {resultados.resultadoOperacional.toLocaleString("pt-BR", { minimumFractionDigits: 2 })}
                      </TableCell>
                      <TableCell className="text-right font-bold">0.55%</TableCell>
                    </TableRow>

                    <TableRow>
                      <TableCell className="pl-8">Resultado Financeiro</TableCell>
                      <TableCell className="text-right">
                        R$ {resultados.resultadoFinanceiro.toLocaleString("pt-BR", { minimumFractionDigits: 2 })}
                      </TableCell>
                      <TableCell className="text-right">0.31%</TableCell>
                    </TableRow>

                    <TableRow className="bg-green-50">
                      <TableCell className="font-bold">RESULTADO ANTES DO IR</TableCell>
                      <TableCell className="text-right font-bold text-green-600">
                        R$ {resultados.resultadoAntesIR.toLocaleString("pt-BR", { minimumFractionDigits: 2 })}
                      </TableCell>
                      <TableCell className="text-right font-bold">0.85%</TableCell>
                    </TableRow>

                    <TableRow>
                      <TableCell className="pl-8">Imposto de Renda e CSLL</TableCell>
                      <TableCell className="text-right text-red-600">
                        R$ {Math.abs(resultados.impostoRenda).toLocaleString("pt-BR", { minimumFractionDigits: 2 })}
                      </TableCell>
                      <TableCell className="text-right">-0.21%</TableCell>
                    </TableRow>

                    <TableRow className="border-t-2 bg-green-100">
                      <TableCell className="font-bold text-lg">LUCRO LÍQUIDO</TableCell>
                      <TableCell className="text-right font-bold text-lg text-green-700">
                        R$ {resultados.lucroLiquido.toLocaleString("pt-BR", { minimumFractionDigits: 2 })}
                      </TableCell>
                      <TableCell className="text-right font-bold text-lg">{resultados.margemLiquida}%</TableCell>
                    </TableRow>
                  </TableBody>
                </Table>
              </div>
            </TabsContent>

            <TabsContent value="comparativo" className="space-y-4">
              <div className="text-center py-8 text-muted-foreground">
                Análise comparativa entre períodos em desenvolvimento
              </div>
            </TabsContent>

            <TabsContent value="indicadores" className="space-y-4">
              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                <Card>
                  <CardHeader>
                    <CardTitle className="text-sm">Sinistralidade</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold text-red-600">79.6%</div>
                    <p className="text-xs text-muted-foreground">Custos / Receitas</p>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="text-sm">Despesas Administrativas</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold text-blue-600">15.2%</div>
                    <p className="text-xs text-muted-foreground">% da Receita</p>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="text-sm">Índice Combinado</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold text-orange-600">99.4%</div>
                    <p className="text-xs text-muted-foreground">Sinistralidade + Despesas</p>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  )
}
