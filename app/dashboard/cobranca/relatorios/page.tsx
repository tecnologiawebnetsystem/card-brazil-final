"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { FileText, BarChart3, PieChart, TrendingUp, Download, Calendar, Filter, Search } from "lucide-react"

export default function RelatoriosCobrancaPage() {
  return (
    <div className="flex-1 space-y-4 p-4 md:p-8 pt-6">
      <div className="flex items-center justify-between space-y-2">
        <h2 className="text-3xl font-bold tracking-tight">Relatórios de Cobrança</h2>
        <div className="flex items-center space-x-2">
          <Button>
            <Download className="mr-2 h-4 w-4" />
            Exportar Relatório
          </Button>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Faturado</CardTitle>
            <BarChart3 className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">R$ 2.450.000,00</div>
            <p className="text-xs text-muted-foreground">+15% em relação ao mês anterior</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Recebido</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">R$ 2.180.000,00</div>
            <p className="text-xs text-muted-foreground">89% de efetividade</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Em Aberto</CardTitle>
            <PieChart className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">R$ 270.000,00</div>
            <p className="text-xs text-muted-foreground">11% do total faturado</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Inadimplência</CardTitle>
            <FileText className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">3.2%</div>
            <p className="text-xs text-muted-foreground">Dentro da meta de 5%</p>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="gerenciais" className="space-y-4">
        <TabsList>
          <TabsTrigger value="gerenciais">Relatórios Gerenciais</TabsTrigger>
          <TabsTrigger value="operacionais">Operacionais</TabsTrigger>
          <TabsTrigger value="analiticos">Analíticos</TabsTrigger>
        </TabsList>

        <TabsContent value="gerenciais" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Relatórios Gerenciais</CardTitle>
              <CardDescription>Relatórios executivos para tomada de decisão</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                <Button variant="outline" className="h-24 flex-col bg-transparent">
                  <BarChart3 className="h-8 w-8 mb-2" />
                  <span className="text-sm">Resumo Executivo</span>
                </Button>
                <Button variant="outline" className="h-24 flex-col bg-transparent">
                  <PieChart className="h-8 w-8 mb-2" />
                  <span className="text-sm">Análise de Inadimplência</span>
                </Button>
                <Button variant="outline" className="h-24 flex-col bg-transparent">
                  <TrendingUp className="h-8 w-8 mb-2" />
                  <span className="text-sm">Evolução de Recebimentos</span>
                </Button>
                <Button variant="outline" className="h-24 flex-col bg-transparent">
                  <FileText className="h-8 w-8 mb-2" />
                  <span className="text-sm">Comparativo Mensal</span>
                </Button>
                <Button variant="outline" className="h-24 flex-col bg-transparent">
                  <Calendar className="h-8 w-8 mb-2" />
                  <span className="text-sm">Projeção de Fluxo</span>
                </Button>
                <Button variant="outline" className="h-24 flex-col bg-transparent">
                  <Download className="h-8 w-8 mb-2" />
                  <span className="text-sm">Dashboard Executivo</span>
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="operacionais" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Relatórios Operacionais</CardTitle>
              <CardDescription>Relatórios detalhados para operação diária</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center space-x-2 mb-4">
                  <Input placeholder="Filtrar relatórios..." className="max-w-sm" />
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
                      <TableHead>Relatório</TableHead>
                      <TableHead>Descrição</TableHead>
                      <TableHead>Última Atualização</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Ações</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    <TableRow>
                      <TableCell>Posição de Cobrança</TableCell>
                      <TableCell>Situação atual de todas as cobranças</TableCell>
                      <TableCell>Hoje, 09:30</TableCell>
                      <TableCell>
                        <Badge variant="default">Atualizado</Badge>
                      </TableCell>
                      <TableCell>
                        <Button variant="outline" size="sm">
                          <Download className="h-4 w-4" />
                        </Button>
                      </TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell>Faturas Vencidas</TableCell>
                      <TableCell>Lista de faturas em atraso</TableCell>
                      <TableCell>Hoje, 08:00</TableCell>
                      <TableCell>
                        <Badge variant="default">Atualizado</Badge>
                      </TableCell>
                      <TableCell>
                        <Button variant="outline" size="sm">
                          <Download className="h-4 w-4" />
                        </Button>
                      </TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell>Recebimentos do Dia</TableCell>
                      <TableCell>Pagamentos recebidos hoje</TableCell>
                      <TableCell>Hoje, 16:45</TableCell>
                      <TableCell>
                        <Badge variant="default">Atualizado</Badge>
                      </TableCell>
                      <TableCell>
                        <Button variant="outline" size="sm">
                          <Download className="h-4 w-4" />
                        </Button>
                      </TableCell>
                    </TableRow>
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="analiticos" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Relatórios Analíticos</CardTitle>
              <CardDescription>Análises avançadas e indicadores de performance</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="periodo">Período de Análise</Label>
                  <Select>
                    <SelectTrigger>
                      <SelectValue placeholder="Selecione o período" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="mes">Último Mês</SelectItem>
                      <SelectItem value="trimestre">Último Trimestre</SelectItem>
                      <SelectItem value="semestre">Último Semestre</SelectItem>
                      <SelectItem value="ano">Último Ano</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="segmentacao">Segmentação</Label>
                  <Select>
                    <SelectTrigger>
                      <SelectValue placeholder="Selecione a segmentação" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="plano">Por Plano</SelectItem>
                      <SelectItem value="regiao">Por Região</SelectItem>
                      <SelectItem value="idade">Por Faixa Etária</SelectItem>
                      <SelectItem value="valor">Por Faixa de Valor</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <Button variant="outline" className="h-20 flex-col bg-transparent">
                  <BarChart3 className="h-6 w-6 mb-2" />
                  Análise de Tendências
                </Button>
                <Button variant="outline" className="h-20 flex-col bg-transparent">
                  <PieChart className="h-6 w-6 mb-2" />
                  Segmentação de Clientes
                </Button>
                <Button variant="outline" className="h-20 flex-col bg-transparent">
                  <TrendingUp className="h-6 w-6 mb-2" />
                  Previsão de Recebimentos
                </Button>
                <Button variant="outline" className="h-20 flex-col bg-transparent">
                  <FileText className="h-6 w-6 mb-2" />
                  Análise de Risco
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
