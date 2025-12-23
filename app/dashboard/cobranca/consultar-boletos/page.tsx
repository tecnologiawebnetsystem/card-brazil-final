"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { Calendar } from "@/components/ui/calendar"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import {
  CalendarIcon,
  Search,
  Download,
  Eye,
  Edit,
  Trash2,
  AlarmClockMinusIcon as AlteracaoVencimentoIcon,
} from "lucide-react"
import { format } from "date-fns"
import { ptBR } from "date-fns/locale"

export default function ConsultarBoletosPage() {
  const [dateFrom, setDateFrom] = useState<Date>()
  const [dateTo, setDateTo] = useState<Date>()

  const boletos = [
    {
      id: "001",
      cliente: "Maria Santos",
      cpf: "123.456.789-00",
      valor: 450.0,
      vencimento: "2024-01-15",
      status: "Pago",
      dataPagamento: "2024-01-14",
    },
    {
      id: "002",
      cliente: "Pedro Oliveira",
      cpf: "987.654.321-00",
      valor: 280.0,
      vencimento: "2024-01-20",
      status: "Pendente",
      dataPagamento: null,
    },
    {
      id: "003",
      cliente: "Lucia Ferreira",
      cpf: "456.789.123-00",
      valor: 680.0,
      vencimento: "2024-01-10",
      status: "Vencido",
      dataPagamento: null,
    },
  ]

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "Pago":
        return <Badge className="bg-green-100 text-green-800">Pago</Badge>
      case "Pendente":
        return <Badge className="bg-yellow-100 text-yellow-800">Pendente</Badge>
      case "Vencido":
        return <Badge className="bg-red-100 text-red-800">Vencido</Badge>
      default:
        return <Badge variant="secondary">{status}</Badge>
    }
  }

  return (
    <div className="container mx-auto p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-emerald-800">Consultar Boletos</h1>
          <p className="text-muted-foreground">Consulte e gerencie boletos emitidos</p>
        </div>
        <Button className="bg-emerald-600 hover:bg-emerald-700">
          <Download className="h-4 w-4 mr-2" />
          Exportar Lista
        </Button>
      </div>

      {/* Filtros */}
      <Card>
        <CardHeader>
          <CardTitle className="text-emerald-800">Filtros de Pesquisa</CardTitle>
          <CardDescription>Use os filtros para encontrar boletos específicos</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-6 gap-4">
            <div className="space-y-2">
              <Label>Número do Boleto</Label>
              <Input placeholder="Digite o número" />
            </div>

            <div className="space-y-2">
              <Label>Cliente</Label>
              <Input placeholder="Nome do cliente" />
            </div>

            <div className="space-y-2">
              <Label>Status</Label>
              <Select>
                <SelectTrigger>
                  <SelectValue placeholder="Todos" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="todos">Todos</SelectItem>
                  <SelectItem value="pago">Pago</SelectItem>
                  <SelectItem value="pendente">Pendente</SelectItem>
                  <SelectItem value="vencido">Vencido</SelectItem>
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

      {/* Lista de Boletos */}
      <Card>
        <CardHeader>
          <CardTitle className="text-emerald-800">Boletos Encontrados</CardTitle>
          <CardDescription>Lista de boletos conforme filtros aplicados</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full border-collapse">
              <thead>
                <tr className="border-b border-emerald-200">
                  <th className="text-left p-3 font-semibold text-emerald-800">Número</th>
                  <th className="text-left p-3 font-semibold text-emerald-800">Cliente</th>
                  <th className="text-left p-3 font-semibold text-emerald-800">CPF</th>
                  <th className="text-right p-3 font-semibold text-emerald-800">Valor</th>
                  <th className="text-center p-3 font-semibold text-emerald-800">Vencimento</th>
                  <th className="text-center p-3 font-semibold text-emerald-800">Status</th>
                  <th className="text-center p-3 font-semibold text-emerald-800">Ações</th>
                </tr>
              </thead>
              <tbody>
                {boletos.map((boleto) => (
                  <tr key={boleto.id} className="border-b border-gray-100 hover:bg-emerald-50">
                    <td className="p-3 font-medium">{boleto.id}</td>
                    <td className="p-3">{boleto.cliente}</td>
                    <td className="p-3 text-muted-foreground">{boleto.cpf}</td>
                    <td className="p-3 text-right font-medium">
                      R$ {boleto.valor.toLocaleString("pt-BR", { minimumFractionDigits: 2 })}
                    </td>
                    <td className="p-3 text-center">
                      {format(new Date(boleto.vencimento), "dd/MM/yyyy", { locale: ptBR })}
                    </td>
                    <td className="p-3 text-center">{getStatusBadge(boleto.status)}</td>
                    <td className="p-3 text-center">
                      <div className="flex items-center justify-center gap-2">
                        <Button size="sm" variant="outline">
                          <Eye className="h-4 w-4" />
                        </Button>
                        <Button size="sm" variant="outline" asChild>
                          <a href="/dashboard/cobranca/alteracao-vencimento">
                            <AlteracaoVencimentoIcon className="h-4 w-4" />
                          </a>
                        </Button>
                        <Button size="sm" variant="outline">
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button size="sm" variant="outline" className="text-red-600 hover:text-red-700 bg-transparent">
                          <Trash2 className="h-4 w-4" />
                        </Button>
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
