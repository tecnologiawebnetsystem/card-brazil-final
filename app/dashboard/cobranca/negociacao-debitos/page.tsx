"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Textarea } from "@/components/ui/textarea"
import { HandHeart, Calculator, FileText, Clock, Users, TrendingDown, CheckCircle, AlertCircle } from "lucide-react"

export default function NegociacaoDebitosPage() {
  const [selectedDebito, setSelectedDebito] = useState<any>(null)
  const [proposta, setProposta] = useState({
    desconto: "",
    parcelas: "",
    observacoes: "",
  })

  const debitos = [
    {
      id: "1",
      cliente: "Maria Santos",
      cpf: "123.456.789-00",
      valorOriginal: 1250.0,
      valorAtualizado: 1450.0,
      diasAtraso: 45,
      status: "pendente",
      telefone: "(11) 99999-1111",
      email: "maria@email.com",
    },
    {
      id: "2",
      cliente: "Pedro Oliveira",
      cpf: "987.654.321-00",
      valorOriginal: 850.0,
      valorAtualizado: 920.0,
      diasAtraso: 30,
      status: "negociando",
      telefone: "(11) 99999-2222",
      email: "pedro@email.com",
    },
    {
      id: "3",
      cliente: "Lucia Ferreira",
      cpf: "456.789.123-00",
      valorOriginal: 2100.0,
      valorAtualizado: 2450.0,
      diasAtraso: 60,
      status: "acordo",
      telefone: "(11) 99999-3333",
      email: "lucia@email.com",
    },
  ]

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "pendente":
        return (
          <Badge variant="destructive">
            <AlertCircle className="h-3 w-3 mr-1" />
            Pendente
          </Badge>
        )
      case "negociando":
        return (
          <Badge variant="secondary">
            <Clock className="h-3 w-3 mr-1" />
            Negociando
          </Badge>
        )
      case "acordo":
        return (
          <Badge variant="default" className="bg-emerald-600">
            <CheckCircle className="h-3 w-3 mr-1" />
            Acordo
          </Badge>
        )
      default:
        return <Badge variant="outline">Desconhecido</Badge>
    }
  }

  const calcularDesconto = (valorOriginal: number, desconto: string) => {
    const desc = Number.parseFloat(desconto) || 0
    return valorOriginal * (desc / 100)
  }

  const calcularValorFinal = (valorOriginal: number, desconto: string) => {
    return valorOriginal - calcularDesconto(valorOriginal, desconto)
  }

  return (
    <div className="container mx-auto p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-emerald-800">Negociação de Débitos</h1>
          <p className="text-muted-foreground">Gerencie acordos e negociações de débitos em atraso</p>
        </div>
      </div>

      {/* Cards de Resumo */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Total em Atraso</p>
                <p className="text-2xl font-bold text-red-600">R$ 4.820,00</p>
              </div>
              <TrendingDown className="h-8 w-8 text-red-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Em Negociação</p>
                <p className="text-2xl font-bold text-yellow-600">R$ 920,00</p>
              </div>
              <Clock className="h-8 w-8 text-yellow-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Acordos Fechados</p>
                <p className="text-2xl font-bold text-emerald-600">R$ 2.450,00</p>
              </div>
              <HandHeart className="h-8 w-8 text-emerald-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Clientes</p>
                <p className="text-2xl font-bold">3</p>
              </div>
              <Users className="h-8 w-8 text-blue-600" />
            </div>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="lista" className="space-y-4">
        <TabsList>
          <TabsTrigger value="lista">Lista de Débitos</TabsTrigger>
          <TabsTrigger value="historico">Histórico de Acordos</TabsTrigger>
          <TabsTrigger value="relatorios">Relatórios</TabsTrigger>
        </TabsList>

        <TabsContent value="lista" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="text-emerald-800 flex items-center gap-2">
                <FileText className="h-5 w-5" />
                Débitos para Negociação
              </CardTitle>
              <CardDescription>Lista de clientes com débitos em atraso disponíveis para negociação</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {/* Filtros */}
                <div className="flex gap-4">
                  <Select>
                    <SelectTrigger className="w-48">
                      <SelectValue placeholder="Filtrar por status" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="todos">Todos</SelectItem>
                      <SelectItem value="pendente">Pendente</SelectItem>
                      <SelectItem value="negociando">Negociando</SelectItem>
                      <SelectItem value="acordo">Acordo</SelectItem>
                    </SelectContent>
                  </Select>
                  <Input placeholder="Buscar cliente..." className="w-64" />
                </div>

                {/* Tabela de Débitos */}
                <div className="border rounded-lg">
                  <div className="grid grid-cols-7 gap-4 p-3 bg-emerald-50 font-semibold text-emerald-800 border-b">
                    <div>Cliente</div>
                    <div>CPF</div>
                    <div>Valor Original</div>
                    <div>Valor Atualizado</div>
                    <div>Dias Atraso</div>
                    <div>Status</div>
                    <div>Ações</div>
                  </div>

                  {debitos.map((debito) => (
                    <div
                      key={debito.id}
                      className="grid grid-cols-7 gap-4 p-3 border-b last:border-b-0 hover:bg-gray-50"
                    >
                      <div>
                        <div className="font-medium">{debito.cliente}</div>
                        <div className="text-sm text-muted-foreground">{debito.telefone}</div>
                      </div>
                      <div className="text-muted-foreground">{debito.cpf}</div>
                      <div className="font-medium">
                        R$ {debito.valorOriginal.toLocaleString("pt-BR", { minimumFractionDigits: 2 })}
                      </div>
                      <div className="font-medium text-red-600">
                        R$ {debito.valorAtualizado.toLocaleString("pt-BR", { minimumFractionDigits: 2 })}
                      </div>
                      <div className="text-center">
                        <Badge variant="outline">{debito.diasAtraso} dias</Badge>
                      </div>
                      <div>{getStatusBadge(debito.status)}</div>
                      <div>
                        <Dialog>
                          <DialogTrigger asChild>
                            <Button variant="outline" size="sm" onClick={() => setSelectedDebito(debito)}>
                              <HandHeart className="h-4 w-4 mr-1" />
                              Negociar
                            </Button>
                          </DialogTrigger>
                          <DialogContent className="max-w-2xl">
                            <DialogHeader>
                              <DialogTitle>Negociar Débito - {selectedDebito?.cliente}</DialogTitle>
                              <DialogDescription>Configure os termos da negociação para este débito</DialogDescription>
                            </DialogHeader>

                            {selectedDebito && (
                              <div className="space-y-6">
                                {/* Informações do Débito */}
                                <div className="grid grid-cols-2 gap-4 p-4 bg-gray-50 rounded-lg">
                                  <div>
                                    <Label className="text-sm font-medium">Valor Original</Label>
                                    <p className="text-lg font-bold">
                                      R${" "}
                                      {selectedDebito.valorOriginal.toLocaleString("pt-BR", {
                                        minimumFractionDigits: 2,
                                      })}
                                    </p>
                                  </div>
                                  <div>
                                    <Label className="text-sm font-medium">Valor Atualizado</Label>
                                    <p className="text-lg font-bold text-red-600">
                                      R${" "}
                                      {selectedDebito.valorAtualizado.toLocaleString("pt-BR", {
                                        minimumFractionDigits: 2,
                                      })}
                                    </p>
                                  </div>
                                </div>

                                {/* Proposta de Acordo */}
                                <div className="space-y-4">
                                  <h3 className="text-lg font-semibold">Proposta de Acordo</h3>

                                  <div className="grid grid-cols-2 gap-4">
                                    <div className="space-y-2">
                                      <Label>Desconto (%)</Label>
                                      <Input
                                        type="number"
                                        placeholder="0"
                                        value={proposta.desconto}
                                        onChange={(e) => setProposta({ ...proposta, desconto: e.target.value })}
                                      />
                                    </div>
                                    <div className="space-y-2">
                                      <Label>Número de Parcelas</Label>
                                      <Input
                                        type="number"
                                        placeholder="1"
                                        value={proposta.parcelas}
                                        onChange={(e) => setProposta({ ...proposta, parcelas: e.target.value })}
                                      />
                                    </div>
                                  </div>

                                  {/* Cálculo do Acordo */}
                                  {proposta.desconto && (
                                    <div className="p-4 bg-emerald-50 rounded-lg">
                                      <div className="grid grid-cols-3 gap-4 text-center">
                                        <div>
                                          <Label className="text-sm">Desconto</Label>
                                          <p className="text-lg font-bold text-emerald-600">
                                            R${" "}
                                            {calcularDesconto(
                                              selectedDebito.valorOriginal,
                                              proposta.desconto,
                                            ).toLocaleString("pt-BR", { minimumFractionDigits: 2 })}
                                          </p>
                                        </div>
                                        <div>
                                          <Label className="text-sm">Valor Final</Label>
                                          <p className="text-lg font-bold">
                                            R${" "}
                                            {calcularValorFinal(
                                              selectedDebito.valorOriginal,
                                              proposta.desconto,
                                            ).toLocaleString("pt-BR", { minimumFractionDigits: 2 })}
                                          </p>
                                        </div>
                                        <div>
                                          <Label className="text-sm">Valor por Parcela</Label>
                                          <p className="text-lg font-bold">
                                            R${" "}
                                            {(
                                              calcularValorFinal(selectedDebito.valorOriginal, proposta.desconto) /
                                              (Number.parseInt(proposta.parcelas) || 1)
                                            ).toLocaleString("pt-BR", { minimumFractionDigits: 2 })}
                                          </p>
                                        </div>
                                      </div>
                                    </div>
                                  )}

                                  <div className="space-y-2">
                                    <Label>Observações</Label>
                                    <Textarea
                                      placeholder="Observações sobre a negociação..."
                                      value={proposta.observacoes}
                                      onChange={(e) => setProposta({ ...proposta, observacoes: e.target.value })}
                                    />
                                  </div>

                                  <div className="flex gap-2 pt-4">
                                    <Button className="bg-emerald-600 hover:bg-emerald-700">
                                      <CheckCircle className="h-4 w-4 mr-2" />
                                      Enviar Proposta
                                    </Button>
                                    <Button variant="outline">
                                      <Calculator className="h-4 w-4 mr-2" />
                                      Simular Acordo
                                    </Button>
                                  </div>
                                </div>
                              </div>
                            )}
                          </DialogContent>
                        </Dialog>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="historico">
          <Card>
            <CardHeader>
              <CardTitle>Histórico de Acordos</CardTitle>
              <CardDescription>Visualize todos os acordos realizados</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">Histórico de acordos será implementado aqui...</p>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="relatorios">
          <Card>
            <CardHeader>
              <CardTitle>Relatórios de Negociação</CardTitle>
              <CardDescription>Análises e métricas de negociação</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">Relatórios de negociação serão implementados aqui...</p>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
