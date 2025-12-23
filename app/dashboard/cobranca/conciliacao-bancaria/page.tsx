"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Calendar } from "@/components/ui/calendar"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { CalendarIcon, Search, CheckCircle, AlertCircle, Clock, RefreshCw } from "lucide-react"
import { format } from "date-fns"
import { ptBR } from "date-fns/locale"

export default function ConciliacaoBancariaPage() {
  const [dateFrom, setDateFrom] = useState<Date>()
  const [dateTo, setDateTo] = useState<Date>()

  const conciliacoes = [
    {
      id: "001",
      data: "2024-03-15",
      banco: "Banco do Brasil",
      conta: "12345-6",
      totalExtrato: 125000.0,
      totalSistema: 124500.0,
      diferenca: 500.0,
      status: "Pendente",
      registrosConciliados: 145,
      registrosPendentes: 8,
    },
    {
      id: "002",
      data: "2024-03-14",
      banco: "Itaú",
      conta: "98765-4",
      totalExtrato: 89500.0,
      totalSistema: 89500.0,
      diferenca: 0.0,
      status: "Conciliado",
      registrosConciliados: 87,
      registrosPendentes: 0,
    },
    {
      id: "003",
      data: "2024-03-13",
      banco: "Bradesco",
      conta: "54321-9",
      totalExtrato: 156800.0,
      totalSistema: 158200.0,
      diferenca: -1400.0,
      status: "Divergência",
      registrosConciliados: 198,
      registrosPendentes: 15,
    },
  ]

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "Conciliado":
        return (
          <Badge className="bg-green-100 text-green-800">
            <CheckCircle className="h-3 w-3 mr-1" />
            Conciliado
          </Badge>
        )
      case "Pendente":
        return (
          <Badge className="bg-yellow-100 text-yellow-800">
            <Clock className="h-3 w-3 mr-1" />
            Pendente
          </Badge>
        )
      case "Divergência":
        return (
          <Badge variant="destructive">
            <AlertCircle className="h-3 w-3 mr-1" />
            Divergência
          </Badge>
        )
      default:
        return <Badge variant="secondary">{status}</Badge>
    }
  }

  return (
    <div className="container mx-auto p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-emerald-800">Conciliação Bancária</h1>
          <p className="text-muted-foreground">Concilie extratos bancários com o sistema</p>
        </div>
        <Button className="bg-emerald-600 hover:bg-emerald-700">
          <RefreshCw className="h-4 w-4 mr-2" />
          Nova Conciliação
        </Button>
      </div>

      {/* Filtros */}
      <Card>
        <CardHeader>
          <CardTitle className="text-emerald-800">Filtros de Pesquisa</CardTitle>
          <CardDescription>Filtre as conciliações por período e banco</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
            <div className="space-y-2">
              <Label>Banco</Label>
              <Select>
                <SelectTrigger>
                  <SelectValue placeholder="Todos os bancos" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="todos">Todos</SelectItem>
                  <SelectItem value="bb">Banco do Brasil</SelectItem>
                  <SelectItem value="itau">Itaú</SelectItem>
                  <SelectItem value="bradesco">Bradesco</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label>Status</Label>
              <Select>
                <SelectTrigger>
                  <SelectValue placeholder="Todos" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="todos">Todos</SelectItem>
                  <SelectItem value="conciliado">Conciliado</SelectItem>
                  <SelectItem value="pendente">Pendente</SelectItem>
                  <SelectItem value="divergencia">Divergência</SelectItem>
                </SelectContent>
              </Select>
            </div>

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

            <div className="flex items-end">
              <Button className="w-full bg-emerald-600 hover:bg-emerald-700">
                <Search className="h-4 w-4 mr-2" />
                Pesquisar
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Lista de Conciliações */}
      <Card>
        <CardHeader>
          <CardTitle className="text-emerald-800">Histórico de Conciliações</CardTitle>
          <CardDescription>Conciliações bancárias realizadas</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full border-collapse">
              <thead>
                <tr className="border-b border-emerald-200">
                  <th className="text-left p-3 font-semibold text-emerald-800">Data</th>
                  <th className="text-left p-3 font-semibold text-emerald-800">Banco</th>
                  <th className="text-left p-3 font-semibold text-emerald-800">Conta</th>
                  <th className="text-right p-3 font-semibold text-emerald-800">Extrato</th>
                  <th className="text-right p-3 font-semibold text-emerald-800">Sistema</th>
                  <th className="text-right p-3 font-semibold text-emerald-800">Diferença</th>
                  <th className="text-center p-3 font-semibold text-emerald-800">Conciliados</th>
                  <th className="text-center p-3 font-semibold text-emerald-800">Pendentes</th>
                  <th className="text-center p-3 font-semibold text-emerald-800">Status</th>
                </tr>
              </thead>
              <tbody>
                {conciliacoes.map((conciliacao) => (
                  <tr key={conciliacao.id} className="border-b border-gray-100 hover:bg-emerald-50">
                    <td className="p-3">{new Date(conciliacao.data).toLocaleDateString("pt-BR")}</td>
                    <td className="p-3 font-medium">{conciliacao.banco}</td>
                    <td className="p-3">{conciliacao.conta}</td>
                    <td className="p-3 text-right font-medium">
                      R$ {conciliacao.totalExtrato.toLocaleString("pt-BR", { minimumFractionDigits: 2 })}
                    </td>
                    <td className="p-3 text-right font-medium">
                      R$ {conciliacao.totalSistema.toLocaleString("pt-BR", { minimumFractionDigits: 2 })}
                    </td>
                    <td
                      className={`p-3 text-right font-medium ${
                        conciliacao.diferenca === 0
                          ? "text-green-600"
                          : conciliacao.diferenca > 0
                            ? "text-blue-600"
                            : "text-red-600"
                      }`}
                    >
                      R$ {conciliacao.diferenca.toLocaleString("pt-BR", { minimumFractionDigits: 2 })}
                    </td>
                    <td className="p-3 text-center text-green-600 font-medium">{conciliacao.registrosConciliados}</td>
                    <td className="p-3 text-center text-orange-600 font-medium">{conciliacao.registrosPendentes}</td>
                    <td className="p-3 text-center">{getStatusBadge(conciliacao.status)}</td>
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
