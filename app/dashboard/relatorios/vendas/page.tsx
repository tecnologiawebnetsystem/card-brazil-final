"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { Calendar } from "@/components/ui/calendar"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { CalendarIcon, Download, Search, TrendingUp, Users, DollarSign, Target } from "lucide-react"
import { format } from "date-fns"
import { ptBR } from "date-fns/locale"

export default function RelatorioVendasPage() {
  const [dateFrom, setDateFrom] = useState<Date>()
  const [dateTo, setDateTo] = useState<Date>()
  const [selectedCorretor, setSelectedCorretor] = useState("")
  const [selectedProduto, setSelectedProduto] = useState("")

  // Dados simulados para o relatório
  const vendas = [
    {
      id: 1,
      corretor: "João Silva",
      cliente: "Maria Santos",
      produto: "Plano Saúde Premium",
      valor: 450.0,
      comissao: 45.0,
      data: "2024-01-15",
      status: "Ativa",
    },
    {
      id: 2,
      corretor: "Ana Costa",
      cliente: "Pedro Oliveira",
      produto: "Plano Saúde Básico",
      valor: 280.0,
      comissao: 28.0,
      data: "2024-01-14",
      status: "Ativa",
    },
    {
      id: 3,
      corretor: "Carlos Mendes",
      cliente: "Lucia Ferreira",
      produto: "Plano Saúde Familiar",
      valor: 680.0,
      comissao: 68.0,
      data: "2024-01-13",
      status: "Pendente",
    },
  ]

  const metricas = {
    totalVendas: 15,
    valorTotal: 6750.0,
    comissaoTotal: 675.0,
    metaMensal: 20000.0,
  }

  return (
    <div className="container mx-auto p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-emerald-800">Relatório de Vendas</h1>
          <p className="text-muted-foreground">Acompanhe o desempenho de vendas e comissões</p>
        </div>
        <Button className="bg-emerald-600 hover:bg-emerald-700">
          <Download className="h-4 w-4 mr-2" />
          Exportar Relatório
        </Button>
      </div>

      {/* Métricas */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total de Vendas</CardTitle>
            <Target className="h-4 w-4 text-emerald-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-emerald-700">{metricas.totalVendas}</div>
            <p className="text-xs text-muted-foreground">vendas no período</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Valor Total</CardTitle>
            <DollarSign className="h-4 w-4 text-emerald-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-emerald-700">
              R$ {metricas.valorTotal.toLocaleString("pt-BR", { minimumFractionDigits: 2 })}
            </div>
            <p className="text-xs text-muted-foreground">em vendas realizadas</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Comissões</CardTitle>
            <TrendingUp className="h-4 w-4 text-emerald-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-emerald-700">
              R$ {metricas.comissaoTotal.toLocaleString("pt-BR", { minimumFractionDigits: 2 })}
            </div>
            <p className="text-xs text-muted-foreground">em comissões geradas</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Meta Mensal</CardTitle>
            <Users className="h-4 w-4 text-emerald-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-emerald-700">
              {((metricas.valorTotal / metricas.metaMensal) * 100).toFixed(1)}%
            </div>
            <p className="text-xs text-muted-foreground">da meta atingida</p>
          </CardContent>
        </Card>
      </div>

      {/* Filtros */}
      <Card>
        <CardHeader>
          <CardTitle className="text-emerald-800">Filtros</CardTitle>
          <CardDescription>Configure os filtros para gerar o relatório</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
            <div className="space-y-2">
              <Label>Data Inicial</Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button variant="outline" className="w-full justify-start text-left font-normal bg-transparent">
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {dateFrom ? format(dateFrom, "dd/MM/yyyy", { locale: ptBR }) : "Selecionar"}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0">
                  <Calendar mode="single" selected={dateFrom} onSelect={setDateFrom} initialFocus />
                </PopoverContent>
              </Popover>
            </div>

            <div className="space-y-2">
              <Label>Data Final</Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button variant="outline" className="w-full justify-start text-left font-normal bg-transparent">
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {dateTo ? format(dateTo, "dd/MM/yyyy", { locale: ptBR }) : "Selecionar"}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0">
                  <Calendar mode="single" selected={dateTo} onSelect={setDateTo} initialFocus />
                </PopoverContent>
              </Popover>
            </div>

            <div className="space-y-2">
              <Label>Corretor</Label>
              <Select value={selectedCorretor} onValueChange={setSelectedCorretor}>
                <SelectTrigger>
                  <SelectValue placeholder="Todos os corretores" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="todos">Todos os corretores</SelectItem>
                  <SelectItem value="joao">João Silva</SelectItem>
                  <SelectItem value="ana">Ana Costa</SelectItem>
                  <SelectItem value="carlos">Carlos Mendes</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label>Produto</Label>
              <Select value={selectedProduto} onValueChange={setSelectedProduto}>
                <SelectTrigger>
                  <SelectValue placeholder="Todos os produtos" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="todos">Todos os produtos</SelectItem>
                  <SelectItem value="premium">Plano Saúde Premium</SelectItem>
                  <SelectItem value="basico">Plano Saúde Básico</SelectItem>
                  <SelectItem value="familiar">Plano Saúde Familiar</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="flex items-end">
              <Button className="w-full bg-emerald-600 hover:bg-emerald-700">
                <Search className="h-4 w-4 mr-2" />
                Filtrar
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Tabela de Vendas */}
      <Card>
        <CardHeader>
          <CardTitle className="text-emerald-800">Vendas Realizadas</CardTitle>
          <CardDescription>Lista detalhada das vendas no período selecionado</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full border-collapse">
              <thead>
                <tr className="border-b border-emerald-200">
                  <th className="text-left p-3 font-semibold text-emerald-800">Data</th>
                  <th className="text-left p-3 font-semibold text-emerald-800">Corretor</th>
                  <th className="text-left p-3 font-semibold text-emerald-800">Cliente</th>
                  <th className="text-left p-3 font-semibold text-emerald-800">Produto</th>
                  <th className="text-right p-3 font-semibold text-emerald-800">Valor</th>
                  <th className="text-right p-3 font-semibold text-emerald-800">Comissão</th>
                  <th className="text-center p-3 font-semibold text-emerald-800">Status</th>
                </tr>
              </thead>
              <tbody>
                {vendas.map((venda) => (
                  <tr key={venda.id} className="border-b border-gray-100 hover:bg-emerald-50">
                    <td className="p-3">{format(new Date(venda.data), "dd/MM/yyyy", { locale: ptBR })}</td>
                    <td className="p-3 font-medium">{venda.corretor}</td>
                    <td className="p-3">{venda.cliente}</td>
                    <td className="p-3">{venda.produto}</td>
                    <td className="p-3 text-right font-medium">
                      R$ {venda.valor.toLocaleString("pt-BR", { minimumFractionDigits: 2 })}
                    </td>
                    <td className="p-3 text-right font-medium text-emerald-600">
                      R$ {venda.comissao.toLocaleString("pt-BR", { minimumFractionDigits: 2 })}
                    </td>
                    <td className="p-3 text-center">
                      <Badge variant={venda.status === "Ativa" ? "default" : "secondary"}>{venda.status}</Badge>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
