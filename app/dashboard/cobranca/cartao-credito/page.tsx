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
import { CreditCard, Plus, Search, CheckCircle, XCircle, Shield, DollarSign } from "lucide-react"

export default function CartaoCreditoPage() {
  const [searchTerm, setSearchTerm] = useState("")

  const cartoesCredito = [
    {
      id: "CC001",
      beneficiario: "Ana Paula Silva",
      cpf: "123.456.789-00",
      numeroCartao: "**** **** **** 1234",
      bandeira: "Visa",
      status: "Ativo",
      dataVencimento: "12/2026",
      valorMensal: "R$ 380,00",
    },
    {
      id: "CC002",
      beneficiario: "Roberto Santos Costa",
      cpf: "987.654.321-00",
      numeroCartao: "**** **** **** 5678",
      bandeira: "Mastercard",
      status: "Pendente",
      dataVencimento: "08/2025",
      valorMensal: "R$ 520,00",
    },
    {
      id: "CC003",
      beneficiario: "Fernanda Lima Oliveira",
      cpf: "456.789.123-00",
      numeroCartao: "**** **** **** 9012",
      bandeira: "Elo",
      status: "Bloqueado",
      dataVencimento: "03/2027",
      valorMensal: "R$ 290,00",
    },
  ]

  const filteredCartoes = cartoesCredito.filter(
    (cartao) =>
      cartao.beneficiario.toLowerCase().includes(searchTerm.toLowerCase()) ||
      cartao.cpf.includes(searchTerm) ||
      cartao.numeroCartao.includes(searchTerm),
  )

  return (
    <div className="flex-1 space-y-6 p-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Cartão de Crédito</h1>
          <p className="text-muted-foreground">Gerencie pagamentos via cartão de crédito</p>
        </div>
        <Button className="gap-2">
          <Plus className="h-4 w-4" />
          Novo Cartão
        </Button>
      </div>

      <Tabs defaultValue="cartoes" className="space-y-6">
        <TabsList>
          <TabsTrigger value="cartoes">Cartões</TabsTrigger>
          <TabsTrigger value="transacoes">Transações</TabsTrigger>
          <TabsTrigger value="configuracoes">Configurações</TabsTrigger>
        </TabsList>

        <TabsContent value="cartoes" className="space-y-6">
          <div className="grid gap-6 md:grid-cols-4">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total de Cartões</CardTitle>
                <CreditCard className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">856</div>
                <p className="text-xs text-muted-foreground">+8% em relação ao mês anterior</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Cartões Ativos</CardTitle>
                <CheckCircle className="h-4 w-4 text-green-600" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">789</div>
                <p className="text-xs text-muted-foreground">92.2% do total</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Bloqueados</CardTitle>
                <XCircle className="h-4 w-4 text-red-600" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">23</div>
                <p className="text-xs text-muted-foreground">Por segurança</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Faturamento</CardTitle>
                <DollarSign className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">R$ 342.5K</div>
                <p className="text-xs text-muted-foreground">Mensal via cartão</p>
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Cartões de Crédito Cadastrados</CardTitle>
              <CardDescription>Lista de todos os cartões de crédito para pagamento</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex items-center space-x-2 mb-4">
                <div className="relative flex-1">
                  <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Buscar por beneficiário, CPF ou cartão..."
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
                    <SelectItem value="bloqueado">Bloqueado</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>ID</TableHead>
                    <TableHead>Beneficiário</TableHead>
                    <TableHead>CPF</TableHead>
                    <TableHead>Cartão</TableHead>
                    <TableHead>Bandeira</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Vencimento</TableHead>
                    <TableHead>Valor Mensal</TableHead>
                    <TableHead>Ações</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredCartoes.map((cartao) => (
                    <TableRow key={cartao.id}>
                      <TableCell className="font-medium">{cartao.id}</TableCell>
                      <TableCell>{cartao.beneficiario}</TableCell>
                      <TableCell>{cartao.cpf}</TableCell>
                      <TableCell className="font-mono">{cartao.numeroCartao}</TableCell>
                      <TableCell>{cartao.bandeira}</TableCell>
                      <TableCell>
                        <Badge
                          variant={
                            cartao.status === "Ativo"
                              ? "default"
                              : cartao.status === "Pendente"
                                ? "secondary"
                                : "destructive"
                          }
                        >
                          {cartao.status}
                        </Badge>
                      </TableCell>
                      <TableCell>{cartao.dataVencimento}</TableCell>
                      <TableCell>{cartao.valorMensal}</TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <Button variant="ghost" size="sm">
                            <Shield className="h-4 w-4" />
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

        <TabsContent value="transacoes" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Transações Recentes</CardTitle>
              <CardDescription>Histórico de transações via cartão de crédito</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-center py-8 text-muted-foreground">Nenhuma transação encontrada</div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="configuracoes" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Configurações de Cartão de Crédito</CardTitle>
              <CardDescription>Configure parâmetros para pagamentos via cartão</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="taxaProcessamento">Taxa de Processamento (%)</Label>
                  <Input id="taxaProcessamento" placeholder="2.5" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="valorMinimo">Valor Mínimo</Label>
                  <Input id="valorMinimo" placeholder="R$ 10,00" />
                </div>
              </div>
              <Button>Salvar Configurações</Button>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
