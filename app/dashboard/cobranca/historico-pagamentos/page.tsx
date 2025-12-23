"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Calendar } from "@/components/ui/calendar"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { CalendarIcon, Search, Download, Eye, Filter } from "lucide-react"
import { format } from "date-fns"
import { ptBR } from "date-fns/locale"

const mockHistorico = [
  {
    id: "PAG-001",
    beneficiario: "João Silva Santos",
    valor: 450.0,
    dataPagamento: "2024-01-15",
    dataVencimento: "2024-01-10",
    formaPagamento: "Boleto Bancário",
    status: "Confirmado",
    observacao: "Pagamento em dia",
  },
  {
    id: "PAG-002",
    beneficiario: "Maria Costa Lima",
    valor: 280.0,
    dataPagamento: "2024-01-18",
    dataVencimento: "2024-01-15",
    formaPagamento: "PIX",
    status: "Confirmado",
    observacao: "Pagamento com atraso de 3 dias",
  },
  {
    id: "PAG-003",
    beneficiario: "Pedro Oliveira",
    valor: 680.0,
    dataPagamento: "2024-01-20",
    dataVencimento: "2024-01-20",
    formaPagamento: "Débito Automático",
    status: "Processando",
    observacao: "Aguardando confirmação bancária",
  },
]

export default function HistoricoPagamentosPage() {
  const [dataInicio, setDataInicio] = useState<Date>()
  const [dataFim, setDataFim] = useState<Date>()
  const [filtros, setFiltros] = useState({
    beneficiario: "",
    formaPagamento: "all",
    status: "all",
  })

  return (
    <div className="space-y-6 p-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Histórico de Pagamentos</h1>
          <p className="text-muted-foreground">Consulte o histórico completo de pagamentos realizados</p>
        </div>
      </div>

      <Card className="border-emerald-200">
        <CardHeader className="border-b border-emerald-200">
          <CardTitle className="text-lg font-semibold flex items-center gap-2 text-foreground">
            <Filter className="h-5 w-5" />
            Filtros de Pesquisa
          </CardTitle>
        </CardHeader>
        <CardContent className="p-6 space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="space-y-2">
              <Label>Data Início</Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button variant="outline" className="w-full justify-start text-left font-normal bg-transparent">
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {dataInicio ? format(dataInicio, "dd/MM/yyyy", { locale: ptBR }) : "Selecionar"}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0">
                  <Calendar mode="single" selected={dataInicio} onSelect={setDataInicio} initialFocus />
                </PopoverContent>
              </Popover>
            </div>

            <div className="space-y-2">
              <Label>Data Fim</Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button variant="outline" className="w-full justify-start text-left font-normal bg-transparent">
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {dataFim ? format(dataFim, "dd/MM/yyyy", { locale: ptBR }) : "Selecionar"}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0">
                  <Calendar mode="single" selected={dataFim} onSelect={setDataFim} initialFocus />
                </PopoverContent>
              </Popover>
            </div>

            <div className="space-y-2">
              <Label>Forma de Pagamento</Label>
              <Select
                value={filtros.formaPagamento}
                onValueChange={(value) => setFiltros({ ...filtros, formaPagamento: value })}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Todas" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todas</SelectItem>
                  <SelectItem value="boleto">Boleto Bancário</SelectItem>
                  <SelectItem value="pix">PIX</SelectItem>
                  <SelectItem value="debito">Débito Automático</SelectItem>
                  <SelectItem value="cartao">Cartão de Crédito</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label>Status</Label>
              <Select value={filtros.status} onValueChange={(value) => setFiltros({ ...filtros, status: value })}>
                <SelectTrigger>
                  <SelectValue placeholder="Todos" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todos</SelectItem>
                  <SelectItem value="confirmado">Confirmado</SelectItem>
                  <SelectItem value="processando">Processando</SelectItem>
                  <SelectItem value="cancelado">Cancelado</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="space-y-2">
            <Label>Beneficiário</Label>
            <Input
              placeholder="Digite o nome do beneficiário"
              value={filtros.beneficiario}
              onChange={(e) => setFiltros({ ...filtros, beneficiario: e.target.value })}
            />
          </div>

          <div className="flex gap-3 justify-end pt-4 border-t">
            <Button className="bg-emerald-600 hover:bg-emerald-700">
              <Search className="h-4 w-4 mr-2" />
              Pesquisar
            </Button>
            <Button variant="outline">
              <Download className="h-4 w-4 mr-2" />
              Exportar
            </Button>
          </div>
        </CardContent>
      </Card>

      <Card className="border-emerald-200">
        <CardHeader className="bg-emerald-50 border-b border-emerald-200">
          <CardTitle className="text-emerald-800">Histórico de Pagamentos</CardTitle>
          <CardDescription>Lista completa dos pagamentos realizados</CardDescription>
        </CardHeader>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow className="bg-emerald-50">
                <TableHead className="text-emerald-800 font-semibold">ID</TableHead>
                <TableHead className="text-emerald-800 font-semibold">Beneficiário</TableHead>
                <TableHead className="text-emerald-800 font-semibold">Valor</TableHead>
                <TableHead className="text-emerald-800 font-semibold">Data Pagamento</TableHead>
                <TableHead className="text-emerald-800 font-semibold">Data Vencimento</TableHead>
                <TableHead className="text-emerald-800 font-semibold">Forma Pagamento</TableHead>
                <TableHead className="text-emerald-800 font-semibold">Status</TableHead>
                <TableHead className="text-emerald-800 font-semibold">Ações</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {mockHistorico.map((pagamento) => (
                <TableRow key={pagamento.id} className="hover:bg-emerald-50/50">
                  <TableCell className="font-medium">{pagamento.id}</TableCell>
                  <TableCell>{pagamento.beneficiario}</TableCell>
                  <TableCell className="font-semibold">R$ {pagamento.valor.toFixed(2)}</TableCell>
                  <TableCell>{new Date(pagamento.dataPagamento).toLocaleDateString("pt-BR")}</TableCell>
                  <TableCell>{new Date(pagamento.dataVencimento).toLocaleDateString("pt-BR")}</TableCell>
                  <TableCell>{pagamento.formaPagamento}</TableCell>
                  <TableCell>
                    <Badge
                      variant={
                        pagamento.status === "Confirmado"
                          ? "default"
                          : pagamento.status === "Processando"
                            ? "secondary"
                            : "destructive"
                      }
                    >
                      {pagamento.status}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <Button size="sm" variant="ghost" className="text-blue-600 hover:text-blue-700">
                      <Eye className="w-4 h-4" />
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  )
}
