"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Plus, Search, Edit, Trash2, Eye, FileText, Calculator, CheckCircle } from "lucide-react"

export default function LancamentosPage() {
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedPeriodo, setSelectedPeriodo] = useState("2024-01")

  // Mock data para lançamentos contábeis
  const lancamentos = [
    {
      id: "LC001",
      data: "2024-01-15",
      historico: "Recebimento de contraprestações - Janeiro/2024",
      documento: "REC-2024-001",
      valor: 850000.0,
      tipo: "Receita",
      status: "Confirmado",
      usuario: "admin",
      partidas: [
        { conta: "1.1.02.001", descricao: "Banco Bradesco", debito: 850000.0, credito: 0 },
        { conta: "3.1.01.001", descricao: "Receitas de Contraprestações", debito: 0, credito: 850000.0 },
      ],
    },
    {
      id: "LC002",
      data: "2024-01-16",
      historico: "Pagamento de eventos indenizáveis - Hospital São Lucas",
      documento: "PAG-2024-002",
      valor: 125000.0,
      tipo: "Despesa",
      status: "Confirmado",
      usuario: "admin",
      partidas: [
        { conta: "4.1.01.001", descricao: "Eventos Indenizáveis", debito: 125000.0, credito: 0 },
        { conta: "1.1.02.001", descricao: "Banco Bradesco", debito: 0, credito: 125000.0 },
      ],
    },
    {
      id: "LC003",
      data: "2024-01-17",
      historico: "Constituição de PEONA - Janeiro/2024",
      documento: "PEONA-2024-001",
      valor: 450000.0,
      tipo: "Provisão",
      status: "Pendente",
      usuario: "admin",
      partidas: [
        { conta: "4.2.01.001", descricao: "Provisão PEONA", debito: 450000.0, credito: 0 },
        { conta: "2.2.01.001", descricao: "PEONA a Constituir", debito: 0, credito: 450000.0 },
      ],
    },
    {
      id: "LC004",
      data: "2024-01-18",
      historico: "Aplicação financeira CDB Banco do Brasil",
      documento: "APL-2024-001",
      valor: 500000.0,
      tipo: "Aplicação",
      status: "Confirmado",
      usuario: "admin",
      partidas: [
        { conta: "1.1.03.001", descricao: "Aplicações Financeiras CDB", debito: 500000.0, credito: 0 },
        { conta: "1.1.02.001", descricao: "Banco Bradesco", debito: 0, credito: 500000.0 },
      ],
    },
  ]

  const filteredLancamentos = lancamentos.filter((lancamento) => {
    const matchesSearch =
      lancamento.historico.toLowerCase().includes(searchTerm.toLowerCase()) ||
      lancamento.documento.toLowerCase().includes(searchTerm.toLowerCase())
    return matchesSearch
  })

  const totalDebitos = lancamentos.reduce((sum, lanc) => sum + lanc.valor, 0)
  const totalCreditos = lancamentos.reduce((sum, lanc) => sum + lanc.valor, 0)

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-6 space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <h1 className="text-3xl font-bold text-foreground">Lançamentos Contábeis</h1>
            <p className="text-muted-foreground">Gestão de lançamentos e partidas dobradas</p>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" className="gap-2 bg-transparent">
              <Calculator className="h-4 w-4" />
              Balancete
            </Button>
            <Dialog>
              <DialogTrigger asChild>
                <Button className="gap-2">
                  <Plus className="h-4 w-4" />
                  Novo Lançamento
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
                <DialogHeader>
                  <DialogTitle>Novo Lançamento Contábil</DialogTitle>
                  <DialogDescription>Registre um novo lançamento com partidas dobradas</DialogDescription>
                </DialogHeader>
                <div className="space-y-6 py-4">
                  {/* Dados Gerais */}
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="data">Data do Lançamento</Label>
                      <Input id="data" type="date" />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="documento">Número do Documento</Label>
                      <Input id="documento" placeholder="Ex: REC-2024-001" />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="historico">Histórico</Label>
                    <Textarea id="historico" placeholder="Descrição detalhada do lançamento" />
                  </div>

                  {/* Partidas */}
                  <div className="space-y-4">
                    <h3 className="text-lg font-semibold">Partidas Contábeis</h3>

                    {/* Débito */}
                    <Card>
                      <CardHeader>
                        <CardTitle className="text-sm text-emerald-600">Débito</CardTitle>
                      </CardHeader>
                      <CardContent className="space-y-4">
                        <div className="grid grid-cols-3 gap-4">
                          <div className="space-y-2">
                            <Label>Conta Contábil</Label>
                            <Select>
                              <SelectTrigger>
                                <SelectValue placeholder="Selecione a conta" />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="1.1.01.001">1.1.01.001 - Caixa Geral</SelectItem>
                                <SelectItem value="1.1.02.001">1.1.02.001 - Banco Bradesco</SelectItem>
                                <SelectItem value="4.1.01.001">4.1.01.001 - Eventos Indenizáveis</SelectItem>
                              </SelectContent>
                            </Select>
                          </div>
                          <div className="space-y-2">
                            <Label>Valor</Label>
                            <Input placeholder="R$ 0,00" />
                          </div>
                          <div className="space-y-2">
                            <Label>Complemento</Label>
                            <Input placeholder="Informação adicional" />
                          </div>
                        </div>
                      </CardContent>
                    </Card>

                    {/* Crédito */}
                    <Card>
                      <CardHeader>
                        <CardTitle className="text-sm text-red-600">Crédito</CardTitle>
                      </CardHeader>
                      <CardContent className="space-y-4">
                        <div className="grid grid-cols-3 gap-4">
                          <div className="space-y-2">
                            <Label>Conta Contábil</Label>
                            <Select>
                              <SelectTrigger>
                                <SelectValue placeholder="Selecione a conta" />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="3.1.01.001">3.1.01.001 - Receitas de Contraprestações</SelectItem>
                                <SelectItem value="2.1.01.001">2.1.01.001 - Fornecedores Nacionais</SelectItem>
                                <SelectItem value="2.1.02.001">2.1.02.001 - Obrigações Trabalhistas</SelectItem>
                              </SelectContent>
                            </Select>
                          </div>
                          <div className="space-y-2">
                            <Label>Valor</Label>
                            <Input placeholder="R$ 0,00" />
                          </div>
                          <div className="space-y-2">
                            <Label>Complemento</Label>
                            <Input placeholder="Informação adicional" />
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </div>
                </div>
                <div className="flex justify-end gap-2">
                  <Button variant="outline">Cancelar</Button>
                  <Button>Salvar Lançamento</Button>
                </div>
              </DialogContent>
            </Dialog>
          </div>
        </div>

        {/* Filtros */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Filtros e Pesquisa</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col sm:flex-row gap-4">
              <div className="flex-1">
                <Label htmlFor="search">Pesquisar</Label>
                <div className="relative">
                  <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="search"
                    placeholder="Buscar por histórico ou documento..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10"
                  />
                </div>
              </div>
              <div className="w-full sm:w-48">
                <Label htmlFor="periodo">Período</Label>
                <Select value={selectedPeriodo} onValueChange={setSelectedPeriodo}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="2024-01">Janeiro 2024</SelectItem>
                    <SelectItem value="2023-12">Dezembro 2023</SelectItem>
                    <SelectItem value="2023-11">Novembro 2023</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Resumo */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">Total Débitos</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-emerald-600">
                R$ {totalDebitos.toLocaleString("pt-BR", { minimumFractionDigits: 2 })}
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">Total Créditos</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-red-600">
                R$ {totalCreditos.toLocaleString("pt-BR", { minimumFractionDigits: 2 })}
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">Diferença</CardTitle>
            </CardHeader>
            <CardContent>
              <div
                className={`text-2xl font-bold ${totalDebitos === totalCreditos ? "text-emerald-600" : "text-red-600"}`}
              >
                R$ {Math.abs(totalDebitos - totalCreditos).toLocaleString("pt-BR", { minimumFractionDigits: 2 })}
              </div>
              {totalDebitos === totalCreditos && (
                <div className="flex items-center gap-1 text-xs text-emerald-600 mt-1">
                  <CheckCircle className="h-3 w-3" />
                  Balanceado
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Tabela de Lançamentos */}
        <Card>
          <CardHeader>
            <CardTitle>Lançamentos Contábeis</CardTitle>
            <CardDescription>{filteredLancamentos.length} lançamentos encontrados</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="rounded-md border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>ID</TableHead>
                    <TableHead>Data</TableHead>
                    <TableHead>Histórico</TableHead>
                    <TableHead>Documento</TableHead>
                    <TableHead className="text-right">Valor</TableHead>
                    <TableHead>Tipo</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className="text-right">Ações</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredLancamentos.map((lancamento) => (
                    <TableRow key={lancamento.id}>
                      <TableCell className="font-mono">{lancamento.id}</TableCell>
                      <TableCell>{new Date(lancamento.data).toLocaleDateString("pt-BR")}</TableCell>
                      <TableCell className="max-w-xs truncate">{lancamento.historico}</TableCell>
                      <TableCell className="font-mono">{lancamento.documento}</TableCell>
                      <TableCell className="text-right font-mono">
                        R$ {lancamento.valor.toLocaleString("pt-BR", { minimumFractionDigits: 2 })}
                      </TableCell>
                      <TableCell>
                        <Badge variant="outline">{lancamento.tipo}</Badge>
                      </TableCell>
                      <TableCell>
                        <Badge variant={lancamento.status === "Confirmado" ? "default" : "secondary"}>
                          {lancamento.status}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end gap-1">
                          <Button variant="ghost" size="sm">
                            <Eye className="h-4 w-4" />
                          </Button>
                          <Button variant="ghost" size="sm">
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button variant="ghost" size="sm">
                            <FileText className="h-4 w-4" />
                          </Button>
                          <Button variant="ghost" size="sm" className="text-destructive">
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
