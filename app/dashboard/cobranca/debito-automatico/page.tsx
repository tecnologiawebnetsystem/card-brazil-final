"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { CreditCard, Plus, Search, FileText, CheckCircle, Calendar, DollarSign } from "lucide-react"

export default function DebitoAutomaticoPage() {
  const [searchTerm, setSearchTerm] = useState("")

  const debitosAutomaticos = [
    {
      id: "DA001",
      beneficiario: "João Silva Santos",
      cpf: "123.456.789-00",
      banco: "Banco do Brasil",
      agencia: "1234-5",
      conta: "12345-6",
      status: "Ativo",
      dataAdesao: "15/01/2024",
      valorMensal: "R$ 450,00",
    },
    {
      id: "DA002",
      beneficiario: "Maria Oliveira Costa",
      cpf: "987.654.321-00",
      banco: "Caixa Econômica",
      agencia: "5678-9",
      conta: "98765-4",
      status: "Pendente",
      dataAdesao: "20/01/2024",
      valorMensal: "R$ 320,00",
    },
    {
      id: "DA003",
      beneficiario: "Carlos Eduardo Lima",
      cpf: "456.789.123-00",
      banco: "Itaú Unibanco",
      agencia: "9876-5",
      conta: "54321-0",
      status: "Cancelado",
      dataAdesao: "10/01/2024",
      valorMensal: "R$ 280,00",
    },
  ]

  const filteredDebitos = debitosAutomaticos.filter(
    (debito) =>
      debito.beneficiario.toLowerCase().includes(searchTerm.toLowerCase()) ||
      debito.cpf.includes(searchTerm) ||
      debito.banco.toLowerCase().includes(searchTerm.toLowerCase()),
  )

  return (
    <div className="flex-1 space-y-6 p-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Débito Automático</h1>
          <p className="text-muted-foreground">Gerencie adesões e configurações de débito automático</p>
        </div>
        <Button className="gap-2">
          <Plus className="h-4 w-4" />
          Nova Adesão
        </Button>
      </div>

      <Tabs defaultValue="adesoes" className="space-y-6">
        <TabsList>
          <TabsTrigger value="adesoes">Adesões</TabsTrigger>
          <TabsTrigger value="configuracoes">Configurações</TabsTrigger>
          <TabsTrigger value="relatorios">Relatórios</TabsTrigger>
        </TabsList>

        <TabsContent value="adesoes" className="space-y-6">
          <div className="grid gap-6 md:grid-cols-4">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total de Adesões</CardTitle>
                <CreditCard className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">1,234</div>
                <p className="text-xs text-muted-foreground">+12% em relação ao mês anterior</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Adesões Ativas</CardTitle>
                <CheckCircle className="h-4 w-4 text-green-600" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">1,156</div>
                <p className="text-xs text-muted-foreground">93.7% do total</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Pendentes</CardTitle>
                <Calendar className="h-4 w-4 text-yellow-600" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">45</div>
                <p className="text-xs text-muted-foreground">Aguardando aprovação</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Valor Mensal</CardTitle>
                <DollarSign className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">R$ 456.8K</div>
                <p className="text-xs text-muted-foreground">Total em débitos ativos</p>
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Adesões de Débito Automático</CardTitle>
              <CardDescription>Lista de todas as adesões de débito automático cadastradas</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex items-center space-x-2 mb-4">
                <div className="relative flex-1">
                  <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Buscar por beneficiário, CPF ou banco..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-8"
                  />
                </div>
                <Select>
                  <SelectTrigger className="w-[180px]">
                    <SelectValue placeholder="Status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="todos">Todos</SelectItem>
                    <SelectItem value="ativo">Ativo</SelectItem>
                    <SelectItem value="pendente">Pendente</SelectItem>
                    <SelectItem value="cancelado">Cancelado</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>ID</TableHead>
                    <TableHead>Beneficiário</TableHead>
                    <TableHead>CPF</TableHead>
                    <TableHead>Banco</TableHead>
                    <TableHead>Agência/Conta</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Data Adesão</TableHead>
                    <TableHead>Valor Mensal</TableHead>
                    <TableHead>Ações</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredDebitos.map((debito) => (
                    <TableRow key={debito.id}>
                      <TableCell className="font-medium">{debito.id}</TableCell>
                      <TableCell>{debito.beneficiario}</TableCell>
                      <TableCell>{debito.cpf}</TableCell>
                      <TableCell>{debito.banco}</TableCell>
                      <TableCell>
                        {debito.agencia} / {debito.conta}
                      </TableCell>
                      <TableCell>
                        <Badge
                          variant={
                            debito.status === "Ativo"
                              ? "default"
                              : debito.status === "Pendente"
                                ? "secondary"
                                : "destructive"
                          }
                        >
                          {debito.status}
                        </Badge>
                      </TableCell>
                      <TableCell>{debito.dataAdesao}</TableCell>
                      <TableCell>{debito.valorMensal}</TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <Button variant="ghost" size="sm">
                            <FileText className="h-4 w-4" />
                          </Button>
                          <Button variant="ghost" size="sm">
                            Editar
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="configuracoes" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Configurações de Débito Automático</CardTitle>
              <CardDescription>Configure parâmetros gerais para débito automático</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="diasTentativa">Dias para Tentativa</Label>
                  <Input id="diasTentativa" placeholder="3" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="valorMinimo">Valor Mínimo</Label>
                  <Input id="valorMinimo" placeholder="R$ 50,00" />
                </div>
              </div>
              <Button>Salvar Configurações</Button>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="relatorios" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Relatórios de Débito Automático</CardTitle>
              <CardDescription>Gere relatórios detalhados sobre débitos automáticos</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid gap-4 md:grid-cols-2">
                <Button variant="outline" className="h-20 flex-col gap-2 bg-transparent">
                  <FileText className="h-6 w-6" />
                  Relatório de Adesões
                </Button>
                <Button variant="outline" className="h-20 flex-col gap-2 bg-transparent">
                  <FileText className="h-6 w-6" />
                  Relatório de Cancelamentos
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
