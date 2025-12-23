"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

const CalculatorIcon = () => (
  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="M9 7h6m0 10v-3m-3 3h.01M9 17h.01M9 14h.01M12 14h.01M15 11h.01M12 11h.01M9 11h.01M7 21h10a2 2 0 002-2V5a2 2 0 00-2-2H7a2 2 0 00-2 2v14a2 2 0 002 2z"
    />
  </svg>
)

const TrendingUpIcon = () => (
  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
  </svg>
)

const DollarSignIcon = () => (
  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1"
    />
  </svg>
)

const PlusIcon = () => (
  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
  </svg>
)

export default function PremiosPage() {
  const [isCalculating, setIsCalculating] = useState(false)
  const [showNewCalculo, setShowNewCalculo] = useState(false)
  const [calculoData, setCalculoData] = useState({
    plano: "",
    faixaEtaria: "",
    numeroVidas: "",
    percentualComissao: "",
    valorBase: "",
  })

  const [calculos] = useState([
    {
      id: 1,
      plano: "Plano Executivo",
      faixaEtaria: "18-23 anos",
      numeroVidas: 150,
      valorBase: 280.5,
      comissao: 8.5,
      valorFinal: 304.34,
      status: "Ativo",
      dataCalculo: "2024-01-15",
    },
    {
      id: 2,
      plano: "Plano Familiar",
      faixaEtaria: "24-28 anos",
      numeroVidas: 89,
      valorBase: 320.8,
      comissao: 7.2,
      valorFinal: 343.9,
      status: "Ativo",
      dataCalculo: "2024-01-14",
    },
    {
      id: 3,
      plano: "Plano Premium",
      faixaEtaria: "29-33 anos",
      numeroVidas: 67,
      valorBase: 450.0,
      comissao: 9.0,
      valorFinal: 490.5,
      status: "Pendente",
      dataCalculo: "2024-01-13",
    },
  ])

  const handleCalcular = () => {
    setIsCalculating(true)
    setTimeout(() => {
      setIsCalculating(false)
      setShowNewCalculo(false)
      setCalculoData({
        plano: "",
        faixaEtaria: "",
        numeroVidas: "",
        percentualComissao: "",
        valorBase: "",
      })
    }, 2000)
  }

  return (
    <div className="flex-1 space-y-6 p-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold tracking-tight text-foreground">Cálculo de Prêmios</h2>
          <p className="text-muted-foreground">Sistema automático de cálculo de prêmios e comissões</p>
        </div>
        <Dialog open={showNewCalculo} onOpenChange={setShowNewCalculo}>
          <DialogTrigger asChild>
            <Button className="bg-primary hover:bg-primary/90">
              <PlusIcon />
              Novo Cálculo
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[600px]">
            <DialogHeader>
              <DialogTitle>Novo Cálculo de Prêmio</DialogTitle>
              <DialogDescription>Configure os parâmetros para calcular automaticamente o prêmio</DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="plano">Plano de Saúde</Label>
                  <Select
                    value={calculoData.plano}
                    onValueChange={(value) => setCalculoData({ ...calculoData, plano: value })}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Selecione o plano" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="executivo">Plano Executivo</SelectItem>
                      <SelectItem value="familiar">Plano Familiar</SelectItem>
                      <SelectItem value="premium">Plano Premium</SelectItem>
                      <SelectItem value="basico">Plano Básico</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="faixa">Faixa Etária</Label>
                  <Select
                    value={calculoData.faixaEtaria}
                    onValueChange={(value) => setCalculoData({ ...calculoData, faixaEtaria: value })}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Selecione a faixa" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="18-23">18-23 anos</SelectItem>
                      <SelectItem value="24-28">24-28 anos</SelectItem>
                      <SelectItem value="29-33">29-33 anos</SelectItem>
                      <SelectItem value="34-38">34-38 anos</SelectItem>
                      <SelectItem value="39-43">39-43 anos</SelectItem>
                      <SelectItem value="44-48">44-48 anos</SelectItem>
                      <SelectItem value="49-53">49-53 anos</SelectItem>
                      <SelectItem value="54-58">54-58 anos</SelectItem>
                      <SelectItem value="59+">59+ anos</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="vidas">Número de Vidas</Label>
                  <Input
                    id="vidas"
                    type="number"
                    placeholder="Ex: 150"
                    value={calculoData.numeroVidas}
                    onChange={(e) => setCalculoData({ ...calculoData, numeroVidas: e.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="valorBase">Valor Base (R$)</Label>
                  <Input
                    id="valorBase"
                    type="number"
                    step="0.01"
                    placeholder="Ex: 280.50"
                    value={calculoData.valorBase}
                    onChange={(e) => setCalculoData({ ...calculoData, valorBase: e.target.value })}
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="comissao">Percentual de Comissão (%)</Label>
                <Input
                  id="comissao"
                  type="number"
                  step="0.1"
                  placeholder="Ex: 8.5"
                  value={calculoData.percentualComissao}
                  onChange={(e) => setCalculoData({ ...calculoData, percentualComissao: e.target.value })}
                />
              </div>
            </div>
            <div className="flex justify-end gap-3">
              <Button variant="outline" onClick={() => setShowNewCalculo(false)}>
                Cancelar
              </Button>
              <Button onClick={handleCalcular} disabled={isCalculating}>
                {isCalculating ? "Calculando..." : "Calcular Prêmio"}
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total de Cálculos</CardTitle>
            <CalculatorIcon />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">1,247</div>
            <p className="text-xs text-muted-foreground">+12% em relação ao mês anterior</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Valor Médio Prêmio</CardTitle>
            <DollarSignIcon />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">R$ 387,50</div>
            <p className="text-xs text-muted-foreground">+5.2% em relação ao mês anterior</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Comissão Total</CardTitle>
            <TrendingUpIcon />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">R$ 32,450</div>
            <p className="text-xs text-muted-foreground">+8.1% em relação ao mês anterior</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Vidas Ativas</CardTitle>
            <TrendingUpIcon />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">2,847</div>
            <p className="text-xs text-muted-foreground">+15.3% em relação ao mês anterior</p>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="calculos" className="space-y-4">
        <TabsList>
          <TabsTrigger value="calculos">Cálculos Recentes</TabsTrigger>
          <TabsTrigger value="parametros">Parâmetros</TabsTrigger>
          <TabsTrigger value="relatorios">Relatórios</TabsTrigger>
        </TabsList>

        <TabsContent value="calculos" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Cálculos de Prêmios</CardTitle>
              <CardDescription>Histórico de cálculos realizados no sistema</CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Plano</TableHead>
                    <TableHead>Faixa Etária</TableHead>
                    <TableHead>Vidas</TableHead>
                    <TableHead>Valor Base</TableHead>
                    <TableHead>Comissão</TableHead>
                    <TableHead>Valor Final</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Data</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {calculos.map((calculo) => (
                    <TableRow key={calculo.id}>
                      <TableCell className="font-medium">{calculo.plano}</TableCell>
                      <TableCell>{calculo.faixaEtaria}</TableCell>
                      <TableCell>{calculo.numeroVidas}</TableCell>
                      <TableCell>R$ {calculo.valorBase.toFixed(2)}</TableCell>
                      <TableCell>{calculo.comissao}%</TableCell>
                      <TableCell className="font-medium">R$ {calculo.valorFinal.toFixed(2)}</TableCell>
                      <TableCell>
                        <Badge variant={calculo.status === "Ativo" ? "default" : "secondary"}>{calculo.status}</Badge>
                      </TableCell>
                      <TableCell>{new Date(calculo.dataCalculo).toLocaleDateString("pt-BR")}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="parametros" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Parâmetros de Cálculo</CardTitle>
              <CardDescription>Configure os parâmetros utilizados nos cálculos automáticos</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Taxa de Administração (%)</Label>
                  <Input type="number" defaultValue="3.5" step="0.1" />
                </div>
                <div className="space-y-2">
                  <Label>Margem de Segurança (%)</Label>
                  <Input type="number" defaultValue="15.0" step="0.1" />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Fator de Risco Base</Label>
                  <Input type="number" defaultValue="1.25" step="0.01" />
                </div>
                <div className="space-y-2">
                  <Label>Inflação Médica Anual (%)</Label>
                  <Input type="number" defaultValue="8.2" step="0.1" />
                </div>
              </div>
              <Button>Salvar Parâmetros</Button>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="relatorios" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Relatórios de Prêmios</CardTitle>
              <CardDescription>Gere relatórios detalhados sobre cálculos e comissões</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <Button variant="outline">Relatório Mensal</Button>
                <Button variant="outline">Relatório por Plano</Button>
                <Button variant="outline">Análise de Comissões</Button>
                <Button variant="outline">Comparativo Anual</Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
