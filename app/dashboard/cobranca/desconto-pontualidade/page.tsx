"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Gift, Percent, Calendar, TrendingUp, Settings, Plus, Search, Filter } from "lucide-react"

export default function DescontoPontualidadePage() {
  return (
    <div className="flex-1 space-y-4 p-4 md:p-8 pt-6">
      <div className="flex items-center justify-between space-y-2">
        <h2 className="text-3xl font-bold tracking-tight">Desconto por Pontualidade</h2>
        <div className="flex items-center space-x-2">
          <Button>
            <Plus className="mr-2 h-4 w-4" />
            Nova Regra
          </Button>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Descontos Concedidos</CardTitle>
            <Gift className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">R$ 28.450,00</div>
            <p className="text-xs text-muted-foreground">+8% em relação ao mês anterior</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Taxa de Adesão</CardTitle>
            <Percent className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">78%</div>
            <p className="text-xs text-muted-foreground">Beneficiários pontuais</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Pagamentos Antecipados</CardTitle>
            <Calendar className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">2.456</div>
            <p className="text-xs text-muted-foreground">Média de 5 dias de antecipação</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Economia Gerada</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">R$ 125.300,00</div>
            <p className="text-xs text-muted-foreground">Redução de inadimplência</p>
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
              <CardTitle>Configuração de Descontos</CardTitle>
              <CardDescription>Configure as regras de desconto por pontualidade no pagamento</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="desconto-percentual">Percentual de Desconto (%)</Label>
                  <Input id="desconto-percentual" placeholder="5.0" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="dias-antecipacao">Dias de Antecipação</Label>
                  <Input id="dias-antecipacao" placeholder="5" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="valor-minimo">Valor Mínimo (R$)</Label>
                  <Input id="valor-minimo" placeholder="100.00" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="tipo-desconto">Tipo de Desconto</Label>
                  <Select>
                    <SelectTrigger>
                      <SelectValue placeholder="Selecione" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="percentual">Percentual</SelectItem>
                      <SelectItem value="fixo">Valor Fixo</SelectItem>
                      <SelectItem value="progressivo">Progressivo</SelectItem>
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
              <CardTitle>Aplicação de Descontos</CardTitle>
              <CardDescription>Visualize e gerencie os descontos por pontualidade aplicados</CardDescription>
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
                    <TableHead>Pagamento</TableHead>
                    <TableHead>Antecipação</TableHead>
                    <TableHead>Valor Original</TableHead>
                    <TableHead>Desconto</TableHead>
                    <TableHead>Valor Final</TableHead>
                    <TableHead>Status</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  <TableRow>
                    <TableCell>Ana Costa</TableCell>
                    <TableCell>FAT-2024-003</TableCell>
                    <TableCell>15/02/2024</TableCell>
                    <TableCell>10/02/2024</TableCell>
                    <TableCell>5 dias</TableCell>
                    <TableCell>R$ 450,00</TableCell>
                    <TableCell>R$ 22,50</TableCell>
                    <TableCell>R$ 427,50</TableCell>
                    <TableCell>
                      <Badge variant="default">Aplicado</Badge>
                    </TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell>Carlos Lima</TableCell>
                    <TableCell>FAT-2024-004</TableCell>
                    <TableCell>20/02/2024</TableCell>
                    <TableCell>12/02/2024</TableCell>
                    <TableCell>8 dias</TableCell>
                    <TableCell>R$ 380,00</TableCell>
                    <TableCell>R$ 19,00</TableCell>
                    <TableCell>R$ 361,00</TableCell>
                    <TableCell>
                      <Badge variant="default">Aplicado</Badge>
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
              <CardTitle>Relatórios de Desconto por Pontualidade</CardTitle>
              <CardDescription>Gere relatórios sobre a efetividade do programa de descontos</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-3 gap-4">
                <Button variant="outline" className="h-20 flex-col bg-transparent">
                  <Gift className="h-6 w-6 mb-2" />
                  Relatório de Adesão
                </Button>
                <Button variant="outline" className="h-20 flex-col bg-transparent">
                  <TrendingUp className="h-6 w-6 mb-2" />
                  Análise de Impacto
                </Button>
                <Button variant="outline" className="h-20 flex-col bg-transparent">
                  <Settings className="h-6 w-6 mb-2" />
                  Configurações Ativas
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
