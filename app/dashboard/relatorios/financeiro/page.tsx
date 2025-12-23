"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"

export default function RelatorioFinanceiroPage() {
  const [periodo, setPeriodo] = useState("mes")
  const [isGenerating, setIsGenerating] = useState(false)

  const handleGenerateReport = () => {
    setIsGenerating(true)
    setTimeout(() => {
      setIsGenerating(false)
    }, 2000)
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-6 py-6">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-2xl font-bold text-foreground">Relatório Financeiro</h1>
            <p className="text-muted-foreground">Gere relatórios detalhados da situação financeira</p>
          </div>
          <div className="flex gap-2">
            <Select value={periodo} onValueChange={setPeriodo}>
              <SelectTrigger className="w-40">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="mes">Este Mês</SelectItem>
                <SelectItem value="trimestre">Trimestre</SelectItem>
                <SelectItem value="ano">Este Ano</SelectItem>
              </SelectContent>
            </Select>
            <Button onClick={handleGenerateReport} disabled={isGenerating}>
              {isGenerating ? "Gerando..." : "Gerar Relatório"}
            </Button>
          </div>
        </div>

        {/* Resumo Financeiro */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 bg-green-600 text-white rounded-lg flex items-center justify-center">
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
                  <p className="text-sm text-muted-foreground">Receita Total</p>
                  <p className="text-xl font-bold text-green-600">R$ 2.450.000</p>
                  <p className="text-xs text-green-600">+12% vs mês anterior</p>
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
                  <p className="text-sm text-muted-foreground">Despesas Totais</p>
                  <p className="text-xl font-bold text-red-600">R$ 1.890.000</p>
                  <p className="text-xs text-red-600">+8% vs mês anterior</p>
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
                      d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
                    />
                  </svg>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Lucro Líquido</p>
                  <p className="text-xl font-bold text-blue-600">R$ 560.000</p>
                  <p className="text-xs text-blue-600">+18% vs mês anterior</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Tipos de Relatório */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle>Demonstrativo de Resultados</CardTitle>
              <CardDescription>Receitas, despesas e resultado líquido do período</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <span>Mensalidades Recebidas</span>
                  <span className="font-bold text-green-600">R$ 2.100.000</span>
                </div>
                <div className="flex justify-between items-center">
                  <span>Outras Receitas</span>
                  <span className="font-bold text-green-600">R$ 350.000</span>
                </div>
                <hr />
                <div className="flex justify-between items-center">
                  <span>Sinistros Pagos</span>
                  <span className="font-bold text-red-600">R$ 1.200.000</span>
                </div>
                <div className="flex justify-between items-center">
                  <span>Despesas Administrativas</span>
                  <span className="font-bold text-red-600">R$ 490.000</span>
                </div>
                <div className="flex justify-between items-center">
                  <span>Outras Despesas</span>
                  <span className="font-bold text-red-600">R$ 200.000</span>
                </div>
                <hr />
                <div className="flex justify-between items-center text-lg font-bold">
                  <span>Resultado Líquido</span>
                  <span className="text-blue-600">R$ 560.000</span>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Indicadores de Performance</CardTitle>
              <CardDescription>Principais métricas financeiras</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <span>Margem de Lucro</span>
                  <Badge variant="default">22.9%</Badge>
                </div>
                <div className="flex justify-between items-center">
                  <span>Sinistralidade</span>
                  <Badge variant="secondary">57.1%</Badge>
                </div>
                <div className="flex justify-between items-center">
                  <span>Despesas Administrativas</span>
                  <Badge variant="outline">20.0%</Badge>
                </div>
                <div className="flex justify-between items-center">
                  <span>ROI Mensal</span>
                  <Badge variant="default">18.2%</Badge>
                </div>
                <div className="flex justify-between items-center">
                  <span>Inadimplência</span>
                  <Badge variant="destructive">3.2%</Badge>
                </div>
                <div className="flex justify-between items-center">
                  <span>Crescimento Receita</span>
                  <Badge variant="default">+12%</Badge>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Ações do Relatório */}
        <Card className="mt-6">
          <CardHeader>
            <CardTitle>Exportar Relatório</CardTitle>
            <CardDescription>Baixe o relatório em diferentes formatos</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex gap-4">
              <Button variant="outline">
                <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                  />
                </svg>
                Exportar PDF
              </Button>
              <Button variant="outline">
                <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                  />
                </svg>
                Exportar Excel
              </Button>
              <Button variant="outline">
                <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
                  />
                </svg>
                Enviar por Email
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
