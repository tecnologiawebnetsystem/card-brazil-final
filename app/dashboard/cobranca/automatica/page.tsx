"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { Switch } from "@/components/ui/switch"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Bot, Plus, Search, CheckCircle, Clock, Settings, DollarSign } from "lucide-react"

export default function CobrancaAutomaticaPage() {
  const [searchTerm, setSearchTerm] = useState("")

  const cobrancasAutomaticas = [
    {
      id: "CA001",
      beneficiario: "João Silva Santos",
      cpf: "123.456.789-00",
      tipoCobranca: "Boleto",
      frequencia: "Mensal",
      status: "Ativo",
      proximaCobranca: "15/02/2024",
      valor: "R$ 450,00",
    },
    {
      id: "CA002",
      beneficiario: "Maria Oliveira Costa",
      cpf: "987.654.321-00",
      tipoCobranca: "PIX",
      frequencia: "Mensal",
      status: "Pausado",
      proximaCobranca: "20/02/2024",
      valor: "R$ 320,00",
    },
    {
      id: "CA003",
      beneficiario: "Carlos Eduardo Lima",
      cpf: "456.789.123-00",
      tipoCobranca: "Débito Automático",
      frequencia: "Mensal",
      status: "Ativo",
      proximaCobranca: "10/02/2024",
      valor: "R$ 280,00",
    },
  ]

  const filteredCobrancas = cobrancasAutomaticas.filter(
    (cobranca) =>
      cobranca.beneficiario.toLowerCase().includes(searchTerm.toLowerCase()) ||
      cobranca.cpf.includes(searchTerm) ||
      cobranca.tipoCobranca.toLowerCase().includes(searchTerm.toLowerCase()),
  )

  return (
    <div className="flex-1 space-y-6 p-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Cobrança Automática</h1>
          <p className="text-muted-foreground">Configure e gerencie cobranças automáticas</p>
        </div>
        <Button className="gap-2">
          <Plus className="h-4 w-4" />
          Nova Cobrança Automática
        </Button>
      </div>

      <Tabs defaultValue="cobrancas" className="space-y-6">
        <TabsList>
          <TabsTrigger value="cobrancas">Cobranças</TabsTrigger>
          <TabsTrigger value="regras">Regras</TabsTrigger>
          <TabsTrigger value="configuracoes">Configurações</TabsTrigger>
        </TabsList>

        <TabsContent value="cobrancas" className="space-y-6">
          <div className="grid gap-6 md:grid-cols-4">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total Automáticas</CardTitle>
                <Bot className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">1,567</div>
                <p className="text-xs text-muted-foreground">+15% em relação ao mês anterior</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Ativas</CardTitle>
                <CheckCircle className="h-4 w-4 text-green-600" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">1,423</div>
                <p className="text-xs text-muted-foreground">90.8% do total</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Pausadas</CardTitle>
                <Clock className="h-4 w-4 text-yellow-600" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">144</div>
                <p className="text-xs text-muted-foreground">Temporariamente pausadas</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Valor Mensal</CardTitle>
                <DollarSign className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">R$ 567.8K</div>
                <p className="text-xs text-muted-foreground">Total automático</p>
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Cobranças Automáticas</CardTitle>
              <CardDescription>Lista de todas as cobranças automáticas configuradas</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex items-center space-x-2 mb-4">
                <div className="relative flex-1">
                  <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Buscar por beneficiário, CPF ou tipo..."
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
                    <SelectItem value="pausado">Pausado</SelectItem>
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
                    <TableHead>Tipo Cobrança</TableHead>
                    <TableHead>Frequência</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Próxima Cobrança</TableHead>
                    <TableHead>Valor</TableHead>
                    <TableHead>Ações</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredCobrancas.map((cobranca) => (
                    <TableRow key={cobranca.id}>
                      <TableCell className="font-medium">{cobranca.id}</TableCell>
                      <TableCell>{cobranca.beneficiario}</TableCell>
                      <TableCell>{cobranca.cpf}</TableCell>
                      <TableCell>{cobranca.tipoCobranca}</TableCell>
                      <TableCell>{cobranca.frequencia}</TableCell>
                      <TableCell>
                        <Badge
                          variant={
                            cobranca.status === "Ativo"
                              ? "default"
                              : cobranca.status === "Pausado"
                                ? "secondary"
                                : "destructive"
                          }
                        >
                          {cobranca.status}
                        </Badge>
                      </TableCell>
                      <TableCell>{cobranca.proximaCobranca}</TableCell>
                      <TableCell>{cobranca.valor}</TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <Button variant="ghost" size="sm">
                            <Settings className="h-4 w-4" />
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

        <TabsContent value="regras" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Regras de Cobrança Automática</CardTitle>
              <CardDescription>Configure regras para automatização das cobranças</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label>Gerar boleto automaticamente</Label>
                  <p className="text-sm text-muted-foreground">Gera boletos automaticamente no vencimento</p>
                </div>
                <Switch />
              </div>
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label>Enviar por e-mail</Label>
                  <p className="text-sm text-muted-foreground">Envia cobrança por e-mail automaticamente</p>
                </div>
                <Switch />
              </div>
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label>Enviar por SMS</Label>
                  <p className="text-sm text-muted-foreground">Envia lembrete por SMS antes do vencimento</p>
                </div>
                <Switch />
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="configuracoes" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Configurações Gerais</CardTitle>
              <CardDescription>Configure parâmetros da cobrança automática</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="diasAntecedencia">Dias de Antecedência</Label>
                  <Input id="diasAntecedencia" placeholder="5" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="tentativasMaximas">Tentativas Máximas</Label>
                  <Input id="tentativasMaximas" placeholder="3" />
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
