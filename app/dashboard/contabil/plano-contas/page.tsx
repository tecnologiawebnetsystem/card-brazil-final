"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
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
import { Plus, Search, Edit, Trash2, Eye, Download, Upload, BarChart3 } from "lucide-react"

export default function PlanoContasPage() {
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedGrupo, setSelectedGrupo] = useState("todos")

  // Mock data para plano de contas
  const planoContas = [
    {
      codigo: "1.1.01.001",
      descricao: "Caixa Geral",
      tipo: "Ativo Circulante",
      natureza: "Devedora",
      nivel: 4,
      pai: "1.1.01",
      saldo: 125000.0,
      status: "Ativo",
    },
    {
      codigo: "1.1.02.001",
      descricao: "Banco Bradesco C/C 12345-6",
      tipo: "Ativo Circulante",
      natureza: "Devedora",
      nivel: 4,
      pai: "1.1.02",
      saldo: 850000.0,
      status: "Ativo",
    },
    {
      codigo: "1.1.03.001",
      descricao: "Aplicações Financeiras CDB",
      tipo: "Ativo Circulante",
      natureza: "Devedora",
      nivel: 4,
      pai: "1.1.03",
      saldo: 2500000.0,
      status: "Ativo",
    },
    {
      codigo: "1.2.01.001",
      descricao: "Provisões Técnicas PEONA",
      tipo: "Ativo Não Circulante",
      natureza: "Devedora",
      nivel: 4,
      pai: "1.2.01",
      saldo: 15000000.0,
      status: "Ativo",
    },
    {
      codigo: "2.1.01.001",
      descricao: "Fornecedores Nacionais",
      tipo: "Passivo Circulante",
      natureza: "Credora",
      nivel: 4,
      pai: "2.1.01",
      saldo: 450000.0,
      status: "Ativo",
    },
    {
      codigo: "2.1.02.001",
      descricao: "Obrigações Trabalhistas",
      tipo: "Passivo Circulante",
      natureza: "Credora",
      nivel: 4,
      pai: "2.1.02",
      saldo: 280000.0,
      status: "Ativo",
    },
    {
      codigo: "3.1.01.001",
      descricao: "Receitas de Contraprestações",
      tipo: "Receita",
      natureza: "Credora",
      nivel: 4,
      pai: "3.1.01",
      saldo: 8500000.0,
      status: "Ativo",
    },
    {
      codigo: "4.1.01.001",
      descricao: "Eventos Indenizáveis",
      tipo: "Despesa",
      natureza: "Devedora",
      nivel: 4,
      pai: "4.1.01",
      saldo: 6200000.0,
      status: "Ativo",
    },
  ]

  const filteredContas = planoContas.filter((conta) => {
    const matchesSearch =
      conta.descricao.toLowerCase().includes(searchTerm.toLowerCase()) || conta.codigo.includes(searchTerm)
    const matchesGrupo = selectedGrupo === "todos" || conta.tipo === selectedGrupo
    return matchesSearch && matchesGrupo
  })

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-6 space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <h1 className="text-3xl font-bold text-foreground">Plano de Contas</h1>
            <p className="text-muted-foreground">Gestão completa do plano de contas contábil</p>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" className="gap-2 bg-transparent">
              <Upload className="h-4 w-4" />
              Importar
            </Button>
            <Button variant="outline" className="gap-2 bg-transparent">
              <Download className="h-4 w-4" />
              Exportar
            </Button>
            <Dialog>
              <DialogTrigger asChild>
                <Button className="gap-2">
                  <Plus className="h-4 w-4" />
                  Nova Conta
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-2xl">
                <DialogHeader>
                  <DialogTitle>Nova Conta Contábil</DialogTitle>
                  <DialogDescription>Cadastre uma nova conta no plano de contas</DialogDescription>
                </DialogHeader>
                <div className="grid grid-cols-2 gap-4 py-4">
                  <div className="space-y-2">
                    <Label htmlFor="codigo">Código da Conta</Label>
                    <Input id="codigo" placeholder="Ex: 1.1.01.001" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="descricao">Descrição</Label>
                    <Input id="descricao" placeholder="Nome da conta" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="tipo">Tipo de Conta</Label>
                    <Select>
                      <SelectTrigger>
                        <SelectValue placeholder="Selecione o tipo" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="ativo-circulante">Ativo Circulante</SelectItem>
                        <SelectItem value="ativo-nao-circulante">Ativo Não Circulante</SelectItem>
                        <SelectItem value="passivo-circulante">Passivo Circulante</SelectItem>
                        <SelectItem value="passivo-nao-circulante">Passivo Não Circulante</SelectItem>
                        <SelectItem value="patrimonio-liquido">Patrimônio Líquido</SelectItem>
                        <SelectItem value="receita">Receita</SelectItem>
                        <SelectItem value="despesa">Despesa</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="natureza">Natureza</Label>
                    <Select>
                      <SelectTrigger>
                        <SelectValue placeholder="Selecione a natureza" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="devedora">Devedora</SelectItem>
                        <SelectItem value="credora">Credora</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                <div className="flex justify-end gap-2">
                  <Button variant="outline">Cancelar</Button>
                  <Button>Salvar Conta</Button>
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
                    placeholder="Buscar por código ou descrição..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10"
                  />
                </div>
              </div>
              <div className="w-full sm:w-64">
                <Label htmlFor="grupo">Grupo de Contas</Label>
                <Select value={selectedGrupo} onValueChange={setSelectedGrupo}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="todos">Todos os Grupos</SelectItem>
                    <SelectItem value="Ativo Circulante">Ativo Circulante</SelectItem>
                    <SelectItem value="Ativo Não Circulante">Ativo Não Circulante</SelectItem>
                    <SelectItem value="Passivo Circulante">Passivo Circulante</SelectItem>
                    <SelectItem value="Passivo Não Circulante">Passivo Não Circulante</SelectItem>
                    <SelectItem value="Patrimônio Líquido">Patrimônio Líquido</SelectItem>
                    <SelectItem value="Receita">Receita</SelectItem>
                    <SelectItem value="Despesa">Despesa</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Resumo por Grupos */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">Ativo Total</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-emerald-600">R$ 18.475.000</div>
              <p className="text-xs text-muted-foreground">+12% vs mês anterior</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">Passivo Total</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-red-600">R$ 730.000</div>
              <p className="text-xs text-muted-foreground">-5% vs mês anterior</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">Receitas</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-blue-600">R$ 8.500.000</div>
              <p className="text-xs text-muted-foreground">+8% vs mês anterior</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">Despesas</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-orange-600">R$ 6.200.000</div>
              <p className="text-xs text-muted-foreground">+3% vs mês anterior</p>
            </CardContent>
          </Card>
        </div>

        {/* Tabela de Contas */}
        <Card>
          <CardHeader>
            <CardTitle>Contas Contábeis</CardTitle>
            <CardDescription>{filteredContas.length} contas encontradas</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="rounded-md border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Código</TableHead>
                    <TableHead>Descrição</TableHead>
                    <TableHead>Tipo</TableHead>
                    <TableHead>Natureza</TableHead>
                    <TableHead className="text-right">Saldo Atual</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className="text-right">Ações</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredContas.map((conta) => (
                    <TableRow key={conta.codigo}>
                      <TableCell className="font-mono">{conta.codigo}</TableCell>
                      <TableCell className="font-medium">{conta.descricao}</TableCell>
                      <TableCell>
                        <Badge variant="outline">{conta.tipo}</Badge>
                      </TableCell>
                      <TableCell>
                        <Badge variant={conta.natureza === "Devedora" ? "default" : "secondary"}>
                          {conta.natureza}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-right font-mono">
                        R$ {conta.saldo.toLocaleString("pt-BR", { minimumFractionDigits: 2 })}
                      </TableCell>
                      <TableCell>
                        <Badge variant={conta.status === "Ativo" ? "default" : "secondary"}>{conta.status}</Badge>
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
                            <BarChart3 className="h-4 w-4" />
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
