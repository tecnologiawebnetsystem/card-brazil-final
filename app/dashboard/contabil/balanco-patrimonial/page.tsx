"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Download, TrendingUp, TrendingDown, Building2, DollarSign } from "lucide-react"

export default function BalancoPatrimonialPage() {
  const [selectedPeriod, setSelectedPeriod] = useState("2024-12")
  const [selectedComparison, setSelectedComparison] = useState("2023-12")

  const ativoData = [
    {
      grupo: "ATIVO CIRCULANTE",
      contas: [
        { conta: "Caixa e Equivalentes", atual: 15420000, anterior: 12350000 },
        { conta: "Aplicações Financeiras", atual: 45680000, anterior: 38920000 },
        { conta: "Contas a Receber", atual: 28750000, anterior: 31200000 },
        { conta: "Estoques", atual: 2150000, anterior: 1980000 },
        { conta: "Outros Ativos Circulantes", atual: 5890000, anterior: 4750000 },
      ],
    },
    {
      grupo: "ATIVO NÃO CIRCULANTE",
      contas: [
        { conta: "Ativos Garantidores", atual: 125000000, anterior: 118500000 },
        { conta: "Imobilizado", atual: 18750000, anterior: 19200000 },
        { conta: "Intangível", atual: 8950000, anterior: 7800000 },
        { conta: "Outros Ativos Não Circulantes", atual: 12400000, anterior: 11850000 },
      ],
    },
  ]

  const passivoData = [
    {
      grupo: "PASSIVO CIRCULANTE",
      contas: [
        { conta: "Fornecedores", atual: 8750000, anterior: 9200000 },
        { conta: "Obrigações Trabalhistas", atual: 4580000, anterior: 4320000 },
        { conta: "Tributos a Pagar", atual: 6890000, anterior: 5950000 },
        { conta: "Provisões Técnicas - Curto Prazo", atual: 35000000, anterior: 32500000 },
      ],
    },
    {
      grupo: "PASSIVO NÃO CIRCULANTE",
      contas: [
        { conta: "Provisões Técnicas - Longo Prazo", atual: 89500000, anterior: 85200000 },
        { conta: "Empréstimos e Financiamentos", atual: 15000000, anterior: 18000000 },
        { conta: "Outras Obrigações", atual: 3250000, anterior: 2980000 },
      ],
    },
    {
      grupo: "PATRIMÔNIO LÍQUIDO",
      contas: [
        { conta: "Capital Social", atual: 50000000, anterior: 50000000 },
        { conta: "Reservas de Lucros", atual: 28750000, anterior: 24500000 },
        { conta: "Lucros Acumulados", atual: 15220000, anterior: 12800000 },
      ],
    },
  ]

  const totalAtivo = ativoData.reduce(
    (acc, grupo) => acc + grupo.contas.reduce((sum, conta) => sum + conta.atual, 0),
    0,
  )

  const totalPassivo = passivoData.reduce(
    (acc, grupo) => acc + grupo.contas.reduce((sum, conta) => sum + conta.atual, 0),
    0,
  )

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat("pt-BR", {
      style: "currency",
      currency: "BRL",
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(value)
  }

  const calculateVariation = (atual: number, anterior: number) => {
    const variation = ((atual - anterior) / anterior) * 100
    return {
      percentage: variation,
      isPositive: variation > 0,
    }
  }

  return (
    <div className="flex-1 space-y-6 p-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold tracking-tight bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
            Balanço Patrimonial
          </h2>
          <p className="text-muted-foreground">Demonstração da posição patrimonial e financeira da operadora</p>
        </div>
        <div className="flex items-center space-x-2">
          <Select value={selectedPeriod} onValueChange={setSelectedPeriod}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Período" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="2024-12">Dezembro 2024</SelectItem>
              <SelectItem value="2024-11">Novembro 2024</SelectItem>
              <SelectItem value="2024-10">Outubro 2024</SelectItem>
            </SelectContent>
          </Select>
          <Button variant="outline" size="sm">
            <Download className="h-4 w-4 mr-2" />
            Exportar
          </Button>
        </div>
      </div>

      {/* Cards de Resumo */}
      <div className="grid gap-4 md:grid-cols-3">
        <Card className="border-l-4 border-l-blue-500">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total do Ativo</CardTitle>
            <Building2 className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-600">{formatCurrency(totalAtivo)}</div>
            <p className="text-xs text-muted-foreground">+12.5% em relação ao período anterior</p>
          </CardContent>
        </Card>
        <Card className="border-l-4 border-l-purple-500">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total do Passivo</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-purple-600">{formatCurrency(totalPassivo)}</div>
            <p className="text-xs text-muted-foreground">+8.3% em relação ao período anterior</p>
          </CardContent>
        </Card>
        <Card className="border-l-4 border-l-emerald-500">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Patrimônio Líquido</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-emerald-600">
              {formatCurrency(totalAtivo - totalPassivo + 93970000)}
            </div>
            <p className="text-xs text-muted-foreground">+15.2% em relação ao período anterior</p>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="ativo" className="space-y-4">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="ativo">Ativo</TabsTrigger>
          <TabsTrigger value="passivo">Passivo + PL</TabsTrigger>
        </TabsList>

        <TabsContent value="ativo" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Building2 className="h-5 w-5 text-blue-600" />
                ATIVO
              </CardTitle>
              <CardDescription>Bens e direitos da operadora de planos de saúde</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                {ativoData.map((grupo, index) => (
                  <div key={index} className="space-y-3">
                    <h4 className="font-semibold text-lg text-blue-700 border-b pb-2">{grupo.grupo}</h4>
                    <div className="space-y-2">
                      {grupo.contas.map((conta, contaIndex) => {
                        const variation = calculateVariation(conta.atual, conta.anterior)
                        return (
                          <div
                            key={contaIndex}
                            className="flex items-center justify-between p-3 rounded-lg bg-gray-50 hover:bg-gray-100 transition-colors"
                          >
                            <span className="font-medium">{conta.conta}</span>
                            <div className="flex items-center gap-4">
                              <span className="font-bold text-lg">{formatCurrency(conta.atual)}</span>
                              <div className="flex items-center gap-1">
                                {variation.isPositive ? (
                                  <TrendingUp className="h-4 w-4 text-emerald-600" />
                                ) : (
                                  <TrendingDown className="h-4 w-4 text-red-600" />
                                )}
                                <span
                                  className={`text-sm font-medium ${
                                    variation.isPositive ? "text-emerald-600" : "text-red-600"
                                  }`}
                                >
                                  {variation.percentage.toFixed(1)}%
                                </span>
                              </div>
                            </div>
                          </div>
                        )
                      })}
                    </div>
                    <div className="flex justify-end pt-2 border-t">
                      <span className="font-bold text-xl text-blue-600">
                        Subtotal: {formatCurrency(grupo.contas.reduce((sum, conta) => sum + conta.atual, 0))}
                      </span>
                    </div>
                  </div>
                ))}
                <div className="flex justify-end pt-4 border-t-2 border-blue-200">
                  <span className="font-bold text-2xl text-blue-700">TOTAL DO ATIVO: {formatCurrency(totalAtivo)}</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="passivo" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <DollarSign className="h-5 w-5 text-purple-600" />
                PASSIVO + PATRIMÔNIO LÍQUIDO
              </CardTitle>
              <CardDescription>Obrigações e patrimônio líquido da operadora</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                {passivoData.map((grupo, index) => (
                  <div key={index} className="space-y-3">
                    <h4 className="font-semibold text-lg text-purple-700 border-b pb-2">{grupo.grupo}</h4>
                    <div className="space-y-2">
                      {grupo.contas.map((conta, contaIndex) => {
                        const variation = calculateVariation(conta.atual, conta.anterior)
                        return (
                          <div
                            key={contaIndex}
                            className="flex items-center justify-between p-3 rounded-lg bg-gray-50 hover:bg-gray-100 transition-colors"
                          >
                            <span className="font-medium">{conta.conta}</span>
                            <div className="flex items-center gap-4">
                              <span className="font-bold text-lg">{formatCurrency(conta.atual)}</span>
                              <div className="flex items-center gap-1">
                                {variation.isPositive ? (
                                  <TrendingUp className="h-4 w-4 text-emerald-600" />
                                ) : (
                                  <TrendingDown className="h-4 w-4 text-red-600" />
                                )}
                                <span
                                  className={`text-sm font-medium ${
                                    variation.isPositive ? "text-emerald-600" : "text-red-600"
                                  }`}
                                >
                                  {variation.percentage.toFixed(1)}%
                                </span>
                              </div>
                            </div>
                          </div>
                        )
                      })}
                    </div>
                    <div className="flex justify-end pt-2 border-t">
                      <span className="font-bold text-xl text-purple-600">
                        Subtotal: {formatCurrency(grupo.contas.reduce((sum, conta) => sum + conta.atual, 0))}
                      </span>
                    </div>
                  </div>
                ))}
                <div className="flex justify-end pt-4 border-t-2 border-purple-200">
                  <span className="font-bold text-2xl text-purple-700">
                    TOTAL DO PASSIVO + PL: {formatCurrency(totalAtivo)}
                  </span>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Indicadores de Análise */}
      <Card>
        <CardHeader>
          <CardTitle>Indicadores de Análise Patrimonial</CardTitle>
          <CardDescription>Principais indicadores para análise da situação patrimonial</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-4">
            <div className="text-center p-4 rounded-lg bg-blue-50">
              <div className="text-2xl font-bold text-blue-600">2.85</div>
              <div className="text-sm text-muted-foreground">Liquidez Corrente</div>
            </div>
            <div className="text-center p-4 rounded-lg bg-purple-50">
              <div className="text-2xl font-bold text-purple-600">1.92</div>
              <div className="text-sm text-muted-foreground">Liquidez Seca</div>
            </div>
            <div className="text-center p-4 rounded-lg bg-emerald-50">
              <div className="text-2xl font-bold text-emerald-600">42.3%</div>
              <div className="text-sm text-muted-foreground">Endividamento</div>
            </div>
            <div className="text-center p-4 rounded-lg bg-orange-50">
              <div className="text-2xl font-bold text-orange-600">57.7%</div>
              <div className="text-sm text-muted-foreground">Part. Capital Próprio</div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
