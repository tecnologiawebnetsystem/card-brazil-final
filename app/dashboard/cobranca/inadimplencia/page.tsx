"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Search, AlertTriangle, TrendingUp, Users, DollarSign } from "lucide-react"

export default function InadimplenciaPage() {
  const [dateFrom, setDateFrom] = useState<Date>()
  const [dateTo, setDateTo] = useState<Date>()

  const inadimplentes = [
    {
      id: "001",
      cliente: "João Silva Santos",
      contrato: "CTR-2024-001",
      valorDevido: 1350.0,
      diasAtraso: 45,
      ultimoPagamento: "2024-01-15",
      telefone: "(11) 99999-1234",
      email: "joao.silva@email.com",
      risco: "Alto",
      parcelasVencidas: 3,
    },
    {
      id: "002",
      cliente: "Maria Oliveira Costa",
      contrato: "CTR-2024-002",
      valorDevido: 680.0,
      diasAtraso: 30,
      ultimoPagamento: "2024-02-01",
      telefone: "(11) 98888-5678",
      email: "maria.costa@email.com",
      risco: "Médio",
      parcelasVencidas: 1,
    },
    {
      id: "003",
      cliente: "Carlos Eduardo Lima",
      contrato: "CTR-2024-003",
      valorDevido: 2100.0,
      diasAtraso: 75,
      ultimoPagamento: "2023-12-20",
      telefone: "(11) 97777-9012",
      email: "carlos.lima@email.com",
      risco: "Crítico",
      parcelasVencidas: 5,
    },
  ]

  const getRiscoBadge = (risco: string) => {
    switch (risco) {
      case "Baixo":
        return <Badge className="bg-green-100 text-green-800">Baixo</Badge>
      case "Médio":
        return <Badge className="bg-yellow-100 text-yellow-800">Médio</Badge>
      case "Alto":
        return <Badge className="bg-orange-100 text-orange-800">Alto</Badge>
      case "Crítico":
        return <Badge variant="destructive">Crítico</Badge>
      default:
        return <Badge variant="secondary">{risco}</Badge>
    }
  }

  const totalInadimplencia = inadimplentes.reduce((sum, item) => sum + item.valorDevido, 0)
  const mediaAtraso = Math.round(inadimplentes.reduce((sum, item) => sum + item.diasAtraso, 0) / inadimplentes.length)

  return (
    <div className="container mx-auto p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-emerald-800">Inadimplência</h1>
          <p className="text-muted-foreground">Gerencie clientes inadimplentes e ações de cobrança</p>
        </div>
      </div>

      {/* Métricas de Inadimplência */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Inadimplência</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-600">
              R$ {totalInadimplencia.toLocaleString("pt-BR", { minimumFractionDigits: 2 })}
            </div>
            <p className="text-xs text-muted-foreground">{inadimplentes.length} clientes</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Média de Atraso</CardTitle>
            <AlertTriangle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{mediaAtraso} dias</div>
            <p className="text-xs text-muted-foreground">Tempo médio</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Clientes Críticos</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-600">
              {inadimplentes.filter((i) => i.risco === "Crítico").length}
            </div>
            <p className="text-xs text-muted-foreground">Risco crítico</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Taxa Inadimplência</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">8.5%</div>
            <p className="text-xs text-muted-foreground">+2.1% vs mês anterior</p>
          </CardContent>
        </Card>
      </div>

      {/* Filtros */}
      <Card>
        <CardHeader>
          <CardTitle className="text-emerald-800">Filtros de Pesquisa</CardTitle>
          <CardDescription>Filtre clientes inadimplentes</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-6 gap-4">
            <div className="space-y-2">
              <Label>Cliente</Label>
              <Input placeholder="Nome do cliente" />
            </div>

            <div className="space-y-2">
              <Label>Contrato</Label>
              <Input placeholder="Número do contrato" />
            </div>

            <div className="space-y-2">
              <Label>Risco</Label>
              <Select>
                <SelectTrigger>
                  <SelectValue placeholder="Todos" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="todos">Todos</SelectItem>
                  <SelectItem value="baixo">Baixo</SelectItem>
                  <SelectItem value="medio">Médio</SelectItem>
                  <SelectItem value="alto">Alto</SelectItem>
                  <SelectItem value="critico">Crítico</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label>Dias Atraso (min)</Label>
              <Input type="number" placeholder="30" />
            </div>

            <div className="space-y-2">
              <Label>Valor Mínimo</Label>
              <Input type="number" placeholder="500.00" />
            </div>

            <div className="flex items-end">
              <Button className="w-full bg-emerald-600 hover:bg-emerald-700">
                <Search className="h-4 w-4 mr-2" />
                Pesquisar
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Lista de Inadimplentes */}
      <Card>
        <CardHeader>
          <CardTitle className="text-emerald-800">Clientes Inadimplentes</CardTitle>
          <CardDescription>Lista de clientes com parcelas em atraso</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full border-collapse">
              <thead>
                <tr className="border-b border-emerald-200">
                  <th className="text-left p-3 font-semibold text-emerald-800">Cliente</th>
                  <th className="text-left p-3 font-semibold text-emerald-800">Contrato</th>
                  <th className="text-right p-3 font-semibold text-emerald-800">Valor Devido</th>
                  <th className="text-center p-3 font-semibold text-emerald-800">Dias Atraso</th>
                  <th className="text-center p-3 font-semibold text-emerald-800">Parcelas</th>
                  <th className="text-left p-3 font-semibold text-emerald-800">Último Pagamento</th>
                  <th className="text-center p-3 font-semibold text-emerald-800">Risco</th>
                  <th className="text-left p-3 font-semibold text-emerald-800">Contato</th>
                </tr>
              </thead>
              <tbody>
                {inadimplentes.map((cliente) => (
                  <tr key={cliente.id} className="border-b border-gray-100 hover:bg-emerald-50">
                    <td className="p-3 font-medium">{cliente.cliente}</td>
                    <td className="p-3">{cliente.contrato}</td>
                    <td className="p-3 text-right font-medium text-red-600">
                      R$ {cliente.valorDevido.toLocaleString("pt-BR", { minimumFractionDigits: 2 })}
                    </td>
                    <td className="p-3 text-center">
                      <Badge
                        variant={
                          cliente.diasAtraso > 60 ? "destructive" : cliente.diasAtraso > 30 ? "secondary" : "outline"
                        }
                      >
                        {cliente.diasAtraso} dias
                      </Badge>
                    </td>
                    <td className="p-3 text-center font-medium">{cliente.parcelasVencidas}</td>
                    <td className="p-3">{new Date(cliente.ultimoPagamento).toLocaleDateString("pt-BR")}</td>
                    <td className="p-3 text-center">{getRiscoBadge(cliente.risco)}</td>
                    <td className="p-3">
                      <div className="text-sm">
                        <div>{cliente.telefone}</div>
                        <div className="text-muted-foreground">{cliente.email}</div>
                      </div>
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
