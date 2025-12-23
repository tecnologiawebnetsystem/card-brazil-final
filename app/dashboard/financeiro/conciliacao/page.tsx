"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Search, Plus, CheckCircle, XCircle, AlertCircle, DollarSign, Calendar } from "lucide-react"
import { toast } from "sonner"

interface Conciliacao {
  id: number
  data: string
  banco: string
  agencia: string
  conta: string
  documento: string
  descricao: string
  valorBanco: number
  valorSistema: number
  diferenca: number
  status: "conciliado" | "pendente" | "divergente"
  dataProcessamento: string
}

const conciliacoesMockadas: Conciliacao[] = [
  {
    id: 1,
    data: "2024-03-15",
    banco: "Banco do Brasil",
    agencia: "1234-5",
    conta: "12345-6",
    documento: "DOC001",
    descricao: "Pagamento de mensalidade - João Silva",
    valorBanco: 250.0,
    valorSistema: 250.0,
    diferenca: 0,
    status: "conciliado",
    dataProcessamento: "2024-03-15",
  },
  {
    id: 2,
    data: "2024-03-15",
    banco: "Itaú",
    agencia: "5678-9",
    conta: "98765-4",
    documento: "TED002",
    descricao: "Pagamento de mensalidade - Maria Santos",
    valorBanco: 180.5,
    valorSistema: 185.0,
    diferenca: -4.5,
    status: "divergente",
    dataProcessamento: "2024-03-15",
  },
  {
    id: 3,
    data: "2024-03-16",
    banco: "Santander",
    agencia: "9876-5",
    conta: "54321-0",
    documento: "PIX003",
    descricao: "Pagamento de mensalidade - Carlos Oliveira",
    valorBanco: 320.0,
    valorSistema: 0,
    diferenca: 320.0,
    status: "pendente",
    dataProcessamento: "2024-03-16",
  },
]

export default function ConciliacaoPage() {
  const [conciliacoes, setConciliacoes] = useState<Conciliacao[]>(conciliacoesMockadas)
  const [filteredConciliacoes, setFilteredConciliacoes] = useState<Conciliacao[]>(conciliacoesMockadas)
  const [searchTerm, setSearchTerm] = useState("")
  const [filterBanco, setFilterBanco] = useState("todos")
  const [filterStatus, setFilterStatus] = useState("todos")
  const [filterData, setFilterData] = useState("")

  useEffect(() => {
    let filtered = conciliacoes

    if (searchTerm) {
      filtered = filtered.filter(
        (item) =>
          item.documento.toLowerCase().includes(searchTerm.toLowerCase()) ||
          item.descricao.toLowerCase().includes(searchTerm.toLowerCase()) ||
          item.banco.toLowerCase().includes(searchTerm.toLowerCase()),
      )
    }

    if (filterBanco !== "todos") {
      filtered = filtered.filter((item) => item.banco === filterBanco)
    }

    if (filterStatus !== "todos") {
      filtered = filtered.filter((item) => item.status === filterStatus)
    }

    if (filterData) {
      filtered = filtered.filter((item) => item.data === filterData)
    }

    setFilteredConciliacoes(filtered)
  }, [searchTerm, filterBanco, filterStatus, filterData, conciliacoes])

  const handleConciliar = (id: number) => {
    setConciliacoes(
      conciliacoes.map((item) =>
        item.id === id ? { ...item, status: "conciliado" as const, diferenca: 0, valorSistema: item.valorBanco } : item,
      ),
    )
    toast.success("Item conciliado com sucesso!")
  }

  const totalItens = conciliacoes.length
  const itensConciliados = conciliacoes.filter((c) => c.status === "conciliado").length
  const itensPendentes = conciliacoes.filter((c) => c.status === "pendente").length
  const itensDivergentes = conciliacoes.filter((c) => c.status === "divergente").length
  const totalDiferenca = conciliacoes.reduce((acc, c) => acc + Math.abs(c.diferenca), 0)

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "conciliado":
        return <CheckCircle className="h-4 w-4 text-green-500" />
      case "pendente":
        return <AlertCircle className="h-4 w-4 text-yellow-500" />
      case "divergente":
        return <XCircle className="h-4 w-4 text-red-500" />
      default:
        return null
    }
  }

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "conciliado":
        return <Badge className="bg-green-100 text-green-800">Conciliado</Badge>
      case "pendente":
        return <Badge className="bg-yellow-100 text-yellow-800">Pendente</Badge>
      case "divergente":
        return <Badge className="bg-red-100 text-red-800">Divergente</Badge>
      default:
        return null
    }
  }

  return (
    <div className="container mx-auto px-6 py-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Conciliação Bancária</h1>
          <p className="text-muted-foreground">Concilie os lançamentos bancários com o sistema</p>
        </div>
      </div>

      {/* Métricas */}
      <div className="grid grid-cols-1 md:grid-cols-5 gap-4 mb-6">
        <Card className="bg-emerald-700 text-white border-0">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total de Itens</CardTitle>
            <Calendar className="h-4 w-4 bg-emerald-600 p-1 rounded ml-6" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalItens}</div>
            <p className="text-xs text-emerald-100">itens para conciliar</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Conciliados</CardTitle>
            <CheckCircle className="h-4 w-4 text-green-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{itensConciliados}</div>
            <p className="text-xs text-muted-foreground">itens conciliados</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Pendentes</CardTitle>
            <AlertCircle className="h-4 w-4 text-yellow-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{itensPendentes}</div>
            <p className="text-xs text-muted-foreground">itens pendentes</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Divergentes</CardTitle>
            <XCircle className="h-4 w-4 text-red-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{itensDivergentes}</div>
            <p className="text-xs text-muted-foreground">itens divergentes</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Diferenças</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">R$ {totalDiferenca.toFixed(2)}</div>
            <p className="text-xs text-muted-foreground">valor das diferenças</p>
          </CardContent>
        </Card>
      </div>

      {/* Filtros */}
      <Card className="mb-6">
        <CardHeader>
          <CardTitle>Filtros</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
            <div className="space-y-2">
              <Label htmlFor="search">Buscar</Label>
              <div className="relative">
                <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  id="search"
                  placeholder="Documento, descrição..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-8"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label>Banco</Label>
              <Select value={filterBanco} onValueChange={setFilterBanco}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="todos">Todos os bancos</SelectItem>
                  {Array.from(new Set(conciliacoes.map((c) => c.banco))).map((banco) => (
                    <SelectItem key={banco} value={banco}>
                      {banco}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label>Status</Label>
              <Select value={filterStatus} onValueChange={setFilterStatus}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="todos">Todos</SelectItem>
                  <SelectItem value="conciliado">Conciliado</SelectItem>
                  <SelectItem value="pendente">Pendente</SelectItem>
                  <SelectItem value="divergente">Divergente</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label>Data</Label>
              <Input type="date" value={filterData} onChange={(e) => setFilterData(e.target.value)} />
            </div>

            <div className="flex items-end">
              <Button className="w-full">
                <Plus className="mr-2 h-4 w-4" />
                Importar Extrato
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Lista de Conciliações */}
      <Card>
        <CardHeader>
          <CardTitle>Itens para Conciliação ({filteredConciliacoes.length})</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {filteredConciliacoes.map((item) => (
              <div key={item.id} className="flex items-center justify-between p-4 border rounded-lg">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    {getStatusIcon(item.status)}
                    <h3 className="font-semibold">{item.documento}</h3>
                    {getStatusBadge(item.status)}
                    {item.diferenca !== 0 && (
                      <Badge variant="outline" className="text-red-600">
                        Diferença: R$ {Math.abs(item.diferenca).toFixed(2)}
                      </Badge>
                    )}
                  </div>
                  <div className="text-sm text-muted-foreground space-y-1">
                    <p>
                      <strong>Data:</strong> {new Date(item.data).toLocaleDateString("pt-BR")}
                    </p>
                    <p>
                      <strong>Banco:</strong> {item.banco} - Ag: {item.agencia} - Conta: {item.conta}
                    </p>
                    <p>
                      <strong>Descrição:</strong> {item.descricao}
                    </p>
                    <div className="flex gap-4">
                      <p>
                        <strong>Valor Banco:</strong> R$ {item.valorBanco.toFixed(2)}
                      </p>
                      <p>
                        <strong>Valor Sistema:</strong> R$ {item.valorSistema.toFixed(2)}
                      </p>
                    </div>
                  </div>
                </div>
                <div className="flex gap-2">
                  {item.status !== "conciliado" && (
                    <Button variant="outline" size="sm" onClick={() => handleConciliar(item.id)}>
                      <CheckCircle className="h-4 w-4 mr-1" />
                      Conciliar
                    </Button>
                  )}
                </div>
              </div>
            ))}

            {filteredConciliacoes.length === 0 && (
              <div className="text-center py-8 text-muted-foreground">
                Nenhum item encontrado com os filtros aplicados.
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
