"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Search, Eye, FileText, Calendar, X, CheckCircle } from "lucide-react"

interface LoteAvisoCredito {
  id: string
  numeroLote: string
  banco: string
  agencia: string
  contaCorrente: string
  dataLote: string
  dataSituacao: string
  situacao: "processado" | "pendente" | "cancelado"
  qtdParcelas: number
  valorTotal: number
  valorConciliado: number
  valorPendente: number
}

const mockLotes: LoteAvisoCredito[] = [
  {
    id: "1",
    numeroLote: "AC001-2024",
    banco: "001 - Banco do Brasil",
    agencia: "1234-5",
    contaCorrente: "12345-6",
    dataLote: "2024-01-15",
    dataSituacao: "2024-01-16",
    situacao: "processado",
    qtdParcelas: 150,
    valorTotal: 125000.0,
    valorConciliado: 110000.0,
    valorPendente: 15000.0,
  },
  {
    id: "2",
    numeroLote: "AC002-2024",
    banco: "341 - Itaú Unibanco",
    agencia: "5678-9",
    contaCorrente: "98765-4",
    dataLote: "2024-01-20",
    dataSituacao: "2024-01-21",
    situacao: "pendente",
    qtdParcelas: 89,
    valorTotal: 78500.0,
    valorConciliado: 65000.0,
    valorPendente: 13500.0,
  },
  {
    id: "3",
    numeroLote: "AC003-2024",
    banco: "237 - Bradesco",
    agencia: "9876-1",
    contaCorrente: "54321-8",
    dataLote: "2024-01-25",
    dataSituacao: "2024-01-26",
    situacao: "processado",
    qtdParcelas: 203,
    valorTotal: 189750.0,
    valorConciliado: 189750.0,
    valorPendente: 0.0,
  },
  {
    id: "4",
    numeroLote: "AC004-2024",
    banco: "033 - Santander",
    agencia: "2468-3",
    contaCorrente: "13579-2",
    dataLote: "2024-01-30",
    dataSituacao: "2024-01-31",
    situacao: "cancelado",
    qtdParcelas: 45,
    valorTotal: 32500.0,
    valorConciliado: 0.0,
    valorPendente: 32500.0,
  },
]

export default function LotesAvisoCreditoPage() {
  const [searchData, setSearchData] = useState({
    numeroLote: "",
    banco: "",
    agencia: "",
    dataInicio: "",
    dataFim: "",
    situacao: "",
  })

  const [lotes, setLotes] = useState<LoteAvisoCredito[]>([])
  const [showResults, setShowResults] = useState(false)
  const [selectedLote, setSelectedLote] = useState<LoteAvisoCredito | null>(null)

  const handleSearch = () => {
    // Simular busca
    let filteredLotes = mockLotes

    if (searchData.numeroLote) {
      filteredLotes = filteredLotes.filter((lote) =>
        lote.numeroLote.toLowerCase().includes(searchData.numeroLote.toLowerCase()),
      )
    }

    if (searchData.banco) {
      filteredLotes = filteredLotes.filter((lote) => lote.banco.toLowerCase().includes(searchData.banco.toLowerCase()))
    }

    if (searchData.situacao) {
      filteredLotes = filteredLotes.filter((lote) => lote.situacao === searchData.situacao)
    }

    setLotes(filteredLotes)
    setShowResults(true)
  }

  const handleClear = () => {
    setSearchData({
      numeroLote: "",
      banco: "",
      agencia: "",
      dataInicio: "",
      dataFim: "",
      situacao: "",
    })
    setLotes([])
    setShowResults(false)
    setSelectedLote(null)
  }

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat("pt-BR", {
      style: "currency",
      currency: "BRL",
    }).format(value)
  }

  const getSituacaoColor = (situacao: string) => {
    switch (situacao) {
      case "processado":
        return "bg-green-100 text-green-800"
      case "pendente":
        return "bg-yellow-100 text-yellow-800"
      case "cancelado":
        return "bg-red-100 text-red-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  const getSituacaoText = (situacao: string) => {
    switch (situacao) {
      case "processado":
        return "Processado"
      case "pendente":
        return "Pendente"
      case "cancelado":
        return "Cancelado"
      default:
        return "Desconhecido"
    }
  }

  return (
    <div className="space-y-6 p-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Lotes de Aviso de Crédito</h1>
          <p className="text-muted-foreground">Consulte e gerencie lotes de avisos de crédito de forma sintética</p>
        </div>
      </div>

      {/* Filtros de Pesquisa */}
      <Card className="border-emerald-200">
        <CardHeader className="border-b border-emerald-200">
          <CardTitle className="text-lg font-semibold flex items-center gap-2 text-foreground">
            <Search className="h-5 w-5" />
            Filtros de Pesquisa
          </CardTitle>
        </CardHeader>
        <CardContent className="p-6 space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="space-y-2">
              <Label htmlFor="numeroLote" className="text-sm font-medium text-foreground">
                Número do Lote:
              </Label>
              <Input
                id="numeroLote"
                placeholder="Digite o número do lote"
                value={searchData.numeroLote}
                onChange={(e) => setSearchData((prev) => ({ ...prev, numeroLote: e.target.value }))}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="banco" className="text-sm font-medium text-foreground">
                Banco:
              </Label>
              <Select onValueChange={(value) => setSearchData((prev) => ({ ...prev, banco: value }))}>
                <SelectTrigger>
                  <SelectValue placeholder="Selecione o banco" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="001 - Banco do Brasil">001 - Banco do Brasil</SelectItem>
                  <SelectItem value="341 - Itaú Unibanco">341 - Itaú Unibanco</SelectItem>
                  <SelectItem value="237 - Bradesco">237 - Bradesco</SelectItem>
                  <SelectItem value="033 - Santander">033 - Santander</SelectItem>
                  <SelectItem value="104 - Caixa Econômica Federal">104 - Caixa Econômica Federal</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="situacao" className="text-sm font-medium text-foreground">
                Situação:
              </Label>
              <Select onValueChange={(value) => setSearchData((prev) => ({ ...prev, situacao: value }))}>
                <SelectTrigger>
                  <SelectValue placeholder="Selecione a situação" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="processado">Processado</SelectItem>
                  <SelectItem value="pendente">Pendente</SelectItem>
                  <SelectItem value="cancelado">Cancelado</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="dataInicio" className="text-sm font-medium text-foreground">
                Data Início:
              </Label>
              <Input
                id="dataInicio"
                type="date"
                value={searchData.dataInicio}
                onChange={(e) => setSearchData((prev) => ({ ...prev, dataInicio: e.target.value }))}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="dataFim" className="text-sm font-medium text-foreground">
                Data Fim:
              </Label>
              <Input
                id="dataFim"
                type="date"
                value={searchData.dataFim}
                onChange={(e) => setSearchData((prev) => ({ ...prev, dataFim: e.target.value }))}
              />
            </div>
          </div>

          <div className="flex gap-3 justify-end pt-4 border-t">
            <Button onClick={handleSearch} className="bg-emerald-600 hover:bg-emerald-700 text-white">
              <Search className="h-4 w-4 mr-2" />
              Consultar
            </Button>
            <Button
              onClick={handleClear}
              variant="outline"
              className="border-red-300 text-red-600 hover:bg-red-50 bg-transparent"
            >
              <X className="h-4 w-4 mr-2" />
              Limpar
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Resultados */}
      {showResults && (
        <Card className="border-emerald-200">
          <CardHeader className="bg-emerald-50 border-b border-emerald-200">
            <CardTitle className="text-emerald-800 flex items-center gap-2">
              <FileText className="h-5 w-5" />
              Lotes Encontrados ({lotes.length})
            </CardTitle>
          </CardHeader>
          <CardContent className="p-0">
            <Table>
              <TableHeader>
                <TableRow className="bg-emerald-50">
                  <TableHead className="text-emerald-800 font-semibold">Número do Lote</TableHead>
                  <TableHead className="text-emerald-800 font-semibold">Banco</TableHead>
                  <TableHead className="text-emerald-800 font-semibold">Data do Lote</TableHead>
                  <TableHead className="text-emerald-800 font-semibold">Qtd. Parcelas</TableHead>
                  <TableHead className="text-emerald-800 font-semibold">Valor Total</TableHead>
                  <TableHead className="text-emerald-800 font-semibold">Valor Pendente</TableHead>
                  <TableHead className="text-emerald-800 font-semibold">Situação</TableHead>
                  <TableHead className="text-emerald-800 font-semibold">Ações</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {lotes.map((lote) => (
                  <TableRow key={lote.id} className="hover:bg-emerald-50/50">
                    <TableCell className="font-medium">{lote.numeroLote}</TableCell>
                    <TableCell>{lote.banco}</TableCell>
                    <TableCell>{new Date(lote.dataLote).toLocaleDateString("pt-BR")}</TableCell>
                    <TableCell className="text-center">{lote.qtdParcelas}</TableCell>
                    <TableCell className="font-semibold">{formatCurrency(lote.valorTotal)}</TableCell>
                    <TableCell className="font-semibold text-yellow-600">
                      {formatCurrency(lote.valorPendente)}
                    </TableCell>
                    <TableCell>
                      <Badge className={getSituacaoColor(lote.situacao)}>{getSituacaoText(lote.situacao)}</Badge>
                    </TableCell>
                    <TableCell>
                      <div className="flex gap-2">
                        <Dialog>
                          <DialogTrigger asChild>
                            <Button
                              size="sm"
                              variant="outline"
                              className="border-emerald-300 hover:bg-emerald-50 bg-transparent"
                              onClick={() => setSelectedLote(lote)}
                            >
                              <Eye className="h-4 w-4" />
                            </Button>
                          </DialogTrigger>
                          <DialogContent className="max-w-4xl">
                            <DialogHeader>
                              <DialogTitle className="flex items-center gap-2">
                                <FileText className="h-5 w-5" />
                                Detalhes do Lote: {lote.numeroLote}
                              </DialogTitle>
                            </DialogHeader>
                            {selectedLote && (
                              <div className="space-y-6">
                                <div className="grid grid-cols-2 gap-4">
                                  <div className="space-y-2">
                                    <Label className="font-semibold">Informações Bancárias</Label>
                                    <div className="space-y-1 text-sm">
                                      <p>
                                        <strong>Banco:</strong> {selectedLote.banco}
                                      </p>
                                      <p>
                                        <strong>Agência:</strong> {selectedLote.agencia}
                                      </p>
                                      <p>
                                        <strong>Conta Corrente:</strong> {selectedLote.contaCorrente}
                                      </p>
                                    </div>
                                  </div>
                                  <div className="space-y-2">
                                    <Label className="font-semibold">Datas e Situação</Label>
                                    <div className="space-y-1 text-sm">
                                      <p>
                                        <strong>Data do Lote:</strong>{" "}
                                        {new Date(selectedLote.dataLote).toLocaleDateString("pt-BR")}
                                      </p>
                                      <p>
                                        <strong>Data Situação:</strong>{" "}
                                        {new Date(selectedLote.dataSituacao).toLocaleDateString("pt-BR")}
                                      </p>
                                      <p>
                                        <strong>Situação:</strong>
                                        <Badge className={`ml-2 ${getSituacaoColor(selectedLote.situacao)}`}>
                                          {getSituacaoText(selectedLote.situacao)}
                                        </Badge>
                                      </p>
                                    </div>
                                  </div>
                                </div>

                                <div className="grid grid-cols-3 gap-4">
                                  <Card className="border-blue-200">
                                    <CardContent className="p-4 text-center">
                                      <p className="text-sm text-gray-600">Qtd. Parcelas</p>
                                      <p className="text-2xl font-bold text-blue-600">{selectedLote.qtdParcelas}</p>
                                    </CardContent>
                                  </Card>
                                  <Card className="border-green-200">
                                    <CardContent className="p-4 text-center">
                                      <p className="text-sm text-gray-600">Valor Total</p>
                                      <p className="text-xl font-bold text-green-600">
                                        {formatCurrency(selectedLote.valorTotal)}
                                      </p>
                                    </CardContent>
                                  </Card>
                                  <Card className="border-yellow-200">
                                    <CardContent className="p-4 text-center">
                                      <p className="text-sm text-gray-600">Valor Pendente</p>
                                      <p className="text-xl font-bold text-yellow-600">
                                        {formatCurrency(selectedLote.valorPendente)}
                                      </p>
                                    </CardContent>
                                  </Card>
                                </div>

                                <div className="flex justify-center gap-4">
                                  <Button className="bg-emerald-600 hover:bg-emerald-700 text-white">
                                    <FileText className="h-4 w-4 mr-2" />
                                    Ver Aviso Completo
                                  </Button>
                                  <Button
                                    variant="outline"
                                    className="border-blue-300 text-blue-600 hover:bg-blue-50 bg-transparent"
                                  >
                                    <Calendar className="h-4 w-4 mr-2" />
                                    Histórico
                                  </Button>
                                </div>
                              </div>
                            )}
                          </DialogContent>
                        </Dialog>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      )}

      {/* Cards de Resumo */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="border-blue-200">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Total de Lotes</p>
                <p className="text-2xl font-bold text-blue-600">{mockLotes.length}</p>
              </div>
              <FileText className="h-8 w-8 text-blue-600" />
            </div>
          </CardContent>
        </Card>

        <Card className="border-green-200">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Processados</p>
                <p className="text-2xl font-bold text-green-600">
                  {mockLotes.filter((l) => l.situacao === "processado").length}
                </p>
              </div>
              <CheckCircle className="h-8 w-8 text-green-600" />
            </div>
          </CardContent>
        </Card>

        <Card className="border-yellow-200">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Pendentes</p>
                <p className="text-2xl font-bold text-yellow-600">
                  {mockLotes.filter((l) => l.situacao === "pendente").length}
                </p>
              </div>
              <Calendar className="h-8 w-8 text-yellow-600" />
            </div>
          </CardContent>
        </Card>

        <Card className="border-red-200">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Cancelados</p>
                <p className="text-2xl font-bold text-red-600">
                  {mockLotes.filter((l) => l.situacao === "cancelado").length}
                </p>
              </div>
              <X className="h-8 w-8 text-red-600" />
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
