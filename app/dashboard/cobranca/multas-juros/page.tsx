"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Calculator, Percent, Calendar, DollarSign, Settings, Plus, Search, Filter } from "lucide-react"

export default function MultasJurosPage() {
  return (
    <div className="flex-1 space-y-4 p-4 md:p-8 pt-6">
      <div className="flex items-center justify-between space-y-2">
        <h2 className="text-3xl font-bold tracking-tight">Multas e Juros</h2>
        <div className="flex items-center space-x-2">
          <Button>
            <Plus className="mr-2 h-4 w-4" />
            Nova Configuração
          </Button>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Multas Aplicadas</CardTitle>
            <Calculator className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">R$ 45.230,00</div>
            <p className="text-xs text-muted-foreground">+12% em relação ao mês anterior</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Juros Calculados</CardTitle>
            <Percent className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">R$ 23.450,00</div>
            <p className="text-xs text-muted-foreground">Taxa média: 2,5% a.m.</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Faturas em Atraso</CardTitle>
            <Calendar className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">1.234</div>
            <p className="text-xs text-muted-foreground">Média de 45 dias de atraso</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Recuperado</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">R$ 156.780,00</div>
            <p className="text-xs text-muted-foreground">85% de efetividade</p>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="configuracoes" className="space-y-4">
        <TabsList>
          <TabsTrigger value="configuracoes">Configurações</TabsTrigger>
          <TabsTrigger value="aplicacao">Aplicação</TabsTrigger>
          <TabsTrigger value="relatorios">Relatórios</TabsTrigger>
        </TabsList>

        <TabsContent value="configuracoes" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Configuração de Multas e Juros</CardTitle>
              <CardDescription>Configure as regras de aplicação de multas e juros por atraso</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="multa-percentual">Percentual de Multa (%)</Label>
                  <Input id="multa-percentual" placeholder="2.0" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="juros-mensal">Juros Mensal (%)</Label>
                  <Input id="juros-mensal" placeholder="1.0" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="carencia">Carência (dias)</Label>
                  <Input id="carencia" placeholder="5" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="tipo-calculo">Tipo de Cálculo</Label>
                  <Select>
                    <SelectTrigger>
                      <SelectValue placeholder="Selecione" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="simples">Juros Simples</SelectItem>
                      <SelectItem value="composto">Juros Compostos</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <Button>Salvar Configurações</Button>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="aplicacao" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Aplicação de Multas e Juros</CardTitle>
              <CardDescription>Visualize e gerencie a aplicação de multas e juros</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex items-center space-x-2 mb-4">
                <Input placeholder="Buscar por beneficiário..." className="max-w-sm" />
                <Button variant="outline" size="icon">
                  <Search className="h-4 w-4" />
                </Button>
                <Button variant="outline" size="icon">
                  <Filter className="h-4 w-4" />
                </Button>
              </div>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Beneficiário</TableHead>
                    <TableHead>Fatura</TableHead>
                    <TableHead>Vencimento</TableHead>
                    <TableHead>Dias Atraso</TableHead>
                    <TableHead>Valor Original</TableHead>
                    <TableHead>Multa</TableHead>
                    <TableHead>Juros</TableHead>
                    <TableHead>Total</TableHead>
                    <TableHead>Status</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  <TableRow>
                    <TableCell>João Silva</TableCell>
                    <TableCell>FAT-2024-001</TableCell>
                    <TableCell>15/01/2024</TableCell>
                    <TableCell>30</TableCell>
                    <TableCell>R$ 450,00</TableCell>
                    <TableCell>R$ 9,00</TableCell>
                    <TableCell>R$ 13,50</TableCell>
                    <TableCell>R$ 472,50</TableCell>
                    <TableCell>
                      <Badge variant="destructive">Em Atraso</Badge>
                    </TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell>Maria Santos</TableCell>
                    <TableCell>FAT-2024-002</TableCell>
                    <TableCell>20/01/2024</TableCell>
                    <TableCell>25</TableCell>
                    <TableCell>R$ 380,00</TableCell>
                    <TableCell>R$ 7,60</TableCell>
                    <TableCell>R$ 9,50</TableCell>
                    <TableCell>R$ 397,10</TableCell>
                    <TableCell>
                      <Badge variant="destructive">Em Atraso</Badge>
                    </TableCell>
                  </TableRow>
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="relatorios" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Relatórios de Multas e Juros</CardTitle>
              <CardDescription>Gere relatórios detalhados sobre multas e juros aplicados</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-3 gap-4">
                <Button variant="outline" className="h-20 flex-col bg-transparent">
                  <Calculator className="h-6 w-6 mb-2" />
                  Relatório Mensal
                </Button>
                <Button variant="outline" className="h-20 flex-col bg-transparent">
                  <Percent className="h-6 w-6 mb-2" />
                  Análise de Efetividade
                </Button>
                <Button variant="outline" className="h-20 flex-col bg-transparent">
                  <Settings className="h-6 w-6 mb-2" />
                  Configurações Aplicadas
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
