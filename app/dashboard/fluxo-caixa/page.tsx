"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

const TrendingUpIcon = () => (
  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
  </svg>
)

const TrendingDownIcon = () => (
  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 17h8m0 0V9m0 8l-8-8-4 4-6-6" />
  </svg>
)

const DollarSignIcon = () => (
  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1"
    />
  </svg>
)

const CalendarIcon = () => (
  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
    />
  </svg>
)

export default function FluxoCaixaPage() {
  const [selectedPeriod, setSelectedPeriod] = useState("30")

  const cashFlowData = [
    {
      data: "16/12/2024",
      descricao: "Recebimento de Prêmios - Plano Executivo",
      categoria: "Receita",
      valor: 450000.0,
      saldo: 2890450.0,
      tipo: "entrada",
    },
    {
      data: "16/12/2024",
      descricao: "Pagamento de Sinistros - Hospital São Lucas",
      categoria: "Sinistro",
      valor: -125000.0,
      saldo: 2765450.0,
      tipo: "saida",
    },
    {
      data: "15/12/2024",
      descricao: "Comissões de Corretores",
      categoria: "Comissão",
      valor: -35000.0,
      saldo: 2730450.0,
      tipo: "saida",
    },
    {
      data: "15/12/2024",
      descricao: "Recebimento de Prêmios - Plano Básico",
      categoria: "Receita",
      valor: 280000.0,
      saldo: 3010450.0,
      tipo: "entrada",
    },
    {
      data: "14/12/2024",
      descricao: "Despesas Administrativas",
      categoria: "Despesa",
      valor: -45000.0,
      saldo: 2965450.0,
      tipo: "saida",
    },
  ]

  const projections = [
    {
      periodo: "Próximos 7 dias",
      entradas: 890000.0,
      saidas: 450000.0,
      saldoProjetado: 3330450.0,
      status: "positivo",
    },
    {
      periodo: "Próximos 15 dias",
      entradas: 1650000.0,
      saidas: 890000.0,
      saldoProjetado: 4090450.0,
      status: "positivo",
    },
    {
      periodo: "Próximos 30 dias",
      entradas: 3200000.0,
      saidas: 1850000.0,
      saldoProjetado: 5440450.0,
      status: "positivo",
    },
  ]

  const categories = [
    { nome: "Receitas de Prêmios", valor: 2450000.0, percentual: 68.5, cor: "bg-green-500" },
    { nome: "Pagamento de Sinistros", valor: 890000.0, percentual: 24.9, cor: "bg-red-500" },
    { nome: "Comissões", valor: 145000.0, percentual: 4.1, cor: "bg-blue-500" },
    { nome: "Despesas Administrativas", valor: 89000.0, percentual: 2.5, cor: "bg-yellow-500" },
  ]

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat("pt-BR", {
      style: "currency",
      currency: "BRL",
    }).format(value)
  }

  const getTypeIcon = (tipo: string) => {
    return tipo === "entrada" ? <TrendingUpIcon /> : <TrendingDownIcon />
  }

  const getTypeColor = (tipo: string) => {
    return tipo === "entrada" ? "text-green-600" : "text-red-600"
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Fluxo de Caixa</h1>
          <p className="text-gray-600">Controle e projeção do fluxo de caixa da administradora</p>
        </div>

        <div className="flex items-center space-x-2">
          <Select value={selectedPeriod} onValueChange={setSelectedPeriod}>
            <SelectTrigger className="w-40">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="7">Últimos 7 dias</SelectItem>
              <SelectItem value="15">Últimos 15 dias</SelectItem>
              <SelectItem value="30">Últimos 30 dias</SelectItem>
              <SelectItem value="90">Últimos 90 dias</SelectItem>
            </SelectContent>
          </Select>
          <Button variant="outline">
            <CalendarIcon />
            <span className="ml-2">Exportar</span>
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Saldo Atual</p>
                <p className="text-2xl font-bold text-gray-900">R$ 2.890.450</p>
              </div>
              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                <DollarSignIcon />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Entradas (30d)</p>
                <p className="text-2xl font-bold text-green-600">R$ 3.200.000</p>
              </div>
              <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                <TrendingUpIcon />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Saídas (30d)</p>
                <p className="text-2xl font-bold text-red-600">R$ 1.850.000</p>
              </div>
              <div className="w-12 h-12 bg-red-100 rounded-lg flex items-center justify-center">
                <TrendingDownIcon />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Resultado (30d)</p>
                <p className="text-2xl font-bold text-green-600">R$ 1.350.000</p>
              </div>
              <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                <TrendingUpIcon />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <Card>
            <CardHeader>
              <CardTitle>Movimentações Recentes</CardTitle>
              <CardDescription>Últimas entradas e saídas do fluxo de caixa</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {cashFlowData.map((item, index) => (
                  <div key={index} className="flex items-center justify-between p-4 border rounded-lg">
                    <div className="flex items-center space-x-4">
                      <div className={`flex items-center justify-center w-10 h-10 rounded-lg bg-gray-100`}>
                        {getTypeIcon(item.tipo)}
                      </div>
                      <div>
                        <h3 className="font-medium text-gray-900">{item.descricao}</h3>
                        <p className="text-sm text-gray-600">
                          {item.data} • {item.categoria}
                        </p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className={`font-semibold ${getTypeColor(item.tipo)}`}>{formatCurrency(item.valor)}</p>
                      <p className="text-sm text-gray-600">Saldo: {formatCurrency(item.saldo)}</p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Projeções</CardTitle>
              <CardDescription>Previsão de fluxo de caixa</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {projections.map((proj, index) => (
                  <div key={index} className="p-4 border rounded-lg">
                    <h3 className="font-medium text-gray-900 mb-2">{proj.periodo}</h3>
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span className="text-gray-600">Entradas:</span>
                        <span className="text-green-600">{formatCurrency(proj.entradas)}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Saídas:</span>
                        <span className="text-red-600">{formatCurrency(proj.saidas)}</span>
                      </div>
                      <div className="flex justify-between font-medium pt-2 border-t">
                        <span>Saldo Projetado:</span>
                        <span className="text-blue-600">{formatCurrency(proj.saldoProjetado)}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Categorias</CardTitle>
              <CardDescription>Distribuição por categoria</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {categories.map((cat, index) => (
                  <div key={index} className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600">{cat.nome}</span>
                      <span className="font-medium">{cat.percentual}%</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div className={`${cat.cor} h-2 rounded-full`} style={{ width: `${cat.percentual}%` }}></div>
                    </div>
                    <div className="text-right text-sm font-medium text-gray-900">{formatCurrency(cat.valor)}</div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
