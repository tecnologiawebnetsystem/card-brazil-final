"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Progress } from "@/components/ui/progress"
import {
  AlertTriangleIcon,
  CalculatorIcon,
  DownloadIcon,
  PrinterIcon,
  FilterIcon,
  TrendingUpIcon,
  ShieldCheckIcon,
} from "lucide-react"

export default function ProvisoesTecnicasPage() {
  const [selectedPeriod, setSelectedPeriod] = useState("2024-03")
  const [selectedType, setSelectedType] = useState("todas")

  const provisoesData = [
    {
      tipo: "Provisão de Eventos a Liquidar (PEL)",
      valorAtual: 3500000.0,
      valorAnterior: 3200000.0,
      variacao: 9.4,
      percentualReceita: 23.8,
      status: "Adequada",
      observacoes: "Dentro dos parâmetros ANS",
    },
    {
      tipo: "PEONA - Provisão de Eventos Ocorridos e Não Avisados",
      valorAtual: 1800000.0,
      valorAnterior: 1650000.0,
      variacao: 9.1,
      percentualReceita: 12.2,
      status: "Adequada",
      observacoes: "Calculada por método atuarial",
    },
    {
      tipo: "Provisão de Insuficiência de Contraprestações (PIC)",
      valorAtual: 450000.0,
      valorAnterior: 380000.0,
      variacao: 18.4,
      percentualReceita: 3.1,
      status: "Atenção",
      observacoes: "Aumento devido a sinistralidade",
    },
    {
      tipo: "Provisão de Remissão",
      valorAtual: 120000.0,
      valorAnterior: 115000.0,
      variacao: 4.3,
      percentualReceita: 0.8,
      status: "Adequada",
      observacoes: "Estável",
    },
    {
      tipo: "Provisão Complementar de Cobertura (PCC)",
      valorAtual: 280000.0,
      valorAnterior: 250000.0,
      variacao: 12.0,
      percentualReceita: 1.9,
      status: "Adequada",
      observacoes: "Ajuste sazonal",
    },
  ]

  const resumoProvisoes = {
    totalProvisoes: 6150000.0,
    totalReceitas: 14700000.0,
    percentualTotal: 41.8,
    margemSolvencia: 125.6,
    ativosGarantidores: 7800000.0,
  }

  const metodosCalculo = [
    {
      provisao: "PEL",
      metodo: "Triangulo de Run-Off",
      ultimaAtualizacao: "2024-03-31",
      responsavel: "Atuário Responsável",
      status: "Atualizado",
    },
    {
      provisao: "PEONA",
      metodo: "Chain Ladder",
      ultimaAtualizacao: "2024-03-31",
      responsavel: "Atuário Responsável",
      status: "Atualizado",
    },
    {
      provisao: "PIC",
      metodo: "Fluxo de Caixa Descontado",
      ultimaAtualizacao: "2024-03-31",
      responsavel: "Atuário Responsável",
      status: "Atualizado",
    },
  ]

  return (
    <div className="flex-1 space-y-6 p-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold tracking-tight bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
            Provisões Técnicas
          </h2>
          <p className="text-muted-foreground">Gestão e controle das provisões técnicas obrigatórias ANS</p>
        </div>
        <div className="flex items-center space-x-2">
          <Button variant="outline" size="sm">
            <CalculatorIcon className="mr-2 h-4 w-4" />
            Recalcular
          </Button>
          <Button variant="outline" size="sm">
            <PrinterIcon className="mr-2 h-4 w-4" />
            Imprimir
          </Button>
          <Button variant="outline" size="sm">
            <DownloadIcon className="mr-2 h-4 w-4" />
            Exportar
          </Button>
        </div>
      </div>

      {/* Cards de Resumo */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card className="border-l-4 border-l-blue-500">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Provisões</CardTitle>
            <ShieldCheckIcon className="h-4 w-4 text-blue-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-600">
              R$ {resumoProvisoes.totalProvisoes.toLocaleString("pt-BR", { minimumFractionDigits: 2 })}
            </div>
            <p className="text-xs text-muted-foreground">{resumoProvisoes.percentualTotal}% da receita</p>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-green-500">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Margem de Solvência</CardTitle>
            <TrendingUpIcon className="h-4 w-4 text-green-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">{resumoProvisoes.margemSolvencia}%</div>
            <p className="text-xs text-muted-foreground">Acima do mínimo ANS (100%)</p>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-purple-500">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Ativos Garantidores</CardTitle>
            <ShieldCheckIcon className="h-4 w-4 text-purple-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-purple-600">
              R$ {resumoProvisoes.ativosGarantidores.toLocaleString("pt-BR", { minimumFractionDigits: 2 })}
            </div>
            <p className="text-xs text-muted-foreground">Cobertura: 126.8%</p>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-orange-500">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Status Geral</CardTitle>
            <AlertTriangleIcon className="h-4 w-4 text-orange-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">Adequado</div>
            <p className="text-xs text-muted-foreground">Conforme normativas ANS</p>
          </CardContent>
        </Card>
      </div>

      {/* Filtros */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <FilterIcon className="h-5 w-5" />
            Filtros de Consulta
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-4">
            <div className="space-y-2">
              <Label htmlFor="periodo">Período de Referência</Label>
              <Input
                id="periodo"
                type="month"
                value={selectedPeriod}
                onChange={(e) => setSelectedPeriod(e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="tipo">Tipo de Provisão</Label>
              <Select value={selectedType} onValueChange={setSelectedType}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="todas">Todas as Provisões</SelectItem>
                  <SelectItem value="pel">PEL - Eventos a Liquidar</SelectItem>
                  <SelectItem value="peona">PEONA</SelectItem>
                  <SelectItem value="pic">PIC - Insuficiência</SelectItem>
                  <SelectItem value="remissao">Provisão de Remissão</SelectItem>
                  <SelectItem value="pcc">PCC - Cobertura</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="modalidade">Modalidade</Label>
              <Select defaultValue="todas">
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="todas">Todas</SelectItem>
                  <SelectItem value="ambulatorial">Ambulatorial</SelectItem>
                  <SelectItem value="hospitalar">Hospitalar</SelectItem>
                  <SelectItem value="odontologico">Odontológico</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="flex items-end">
              <Button className="w-full">Atualizar Provisões</Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Provisões Técnicas */}
      <Card>
        <CardHeader>
          <CardTitle>Provisões Técnicas - {selectedPeriod}</CardTitle>
          <CardDescription>Detalhamento das provisões técnicas obrigatórias</CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="provisoes" className="w-full">
            <TabsList className="grid w-full grid-cols-4">
              <TabsTrigger value="provisoes">Provisões</TabsTrigger>
              <TabsTrigger value="metodos">Métodos de Cálculo</TabsTrigger>
              <TabsTrigger value="evolucao">Evolução</TabsTrigger>
              <TabsTrigger value="adequacao">Adequação ANS</TabsTrigger>
            </TabsList>

            <TabsContent value="provisoes" className="space-y-4">
              <div className="rounded-md border">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Tipo de Provisão</TableHead>
                      <TableHead className="text-right">Valor Atual</TableHead>
                      <TableHead className="text-right">Valor Anterior</TableHead>
                      <TableHead className="text-right">Variação</TableHead>
                      <TableHead className="text-right">% Receita</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Observações</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {provisoesData.map((provisao, index) => (
                      <TableRow key={index}>
                        <TableCell className="font-medium">{provisao.tipo}</TableCell>
                        <TableCell className="text-right font-semibold">
                          R$ {provisao.valorAtual.toLocaleString("pt-BR", { minimumFractionDigits: 2 })}
                        </TableCell>
                        <TableCell className="text-right">
                          R$ {provisao.valorAnterior.toLocaleString("pt-BR", { minimumFractionDigits: 2 })}
                        </TableCell>
                        <TableCell className="text-right">
                          <span className={provisao.variacao > 0 ? "text-red-600" : "text-green-600"}>
                            {provisao.variacao > 0 ? "+" : ""}
                            {provisao.variacao}%
                          </span>
                        </TableCell>
                        <TableCell className="text-right">{provisao.percentualReceita}%</TableCell>
                        <TableCell>
                          <Badge variant={provisao.status === "Adequada" ? "default" : "destructive"}>
                            {provisao.status}
                          </Badge>
                        </TableCell>
                        <TableCell className="text-sm text-muted-foreground">{provisao.observacoes}</TableCell>
                      </TableRow>
                    ))}
                    <TableRow className="border-t-2 bg-muted/50">
                      <TableCell className="font-bold">TOTAL GERAL</TableCell>
                      <TableCell className="text-right font-bold">
                        R$ {resumoProvisoes.totalProvisoes.toLocaleString("pt-BR", { minimumFractionDigits: 2 })}
                      </TableCell>
                      <TableCell></TableCell>
                      <TableCell></TableCell>
                      <TableCell className="text-right font-bold">{resumoProvisoes.percentualTotal}%</TableCell>
                      <TableCell>
                        <Badge variant="default">Adequado</Badge>
                      </TableCell>
                      <TableCell></TableCell>
                    </TableRow>
                  </TableBody>
                </Table>
              </div>
            </TabsContent>

            <TabsContent value="metodos" className="space-y-4">
              <div className="rounded-md border">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Provisão</TableHead>
                      <TableHead>Método de Cálculo</TableHead>
                      <TableHead>Última Atualização</TableHead>
                      <TableHead>Responsável</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Ações</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {metodosCalculo.map((metodo, index) => (
                      <TableRow key={index}>
                        <TableCell className="font-medium">{metodo.provisao}</TableCell>
                        <TableCell>{metodo.metodo}</TableCell>
                        <TableCell>{metodo.ultimaAtualizacao}</TableCell>
                        <TableCell>{metodo.responsavel}</TableCell>
                        <TableCell>
                          <Badge variant="default">{metodo.status}</Badge>
                        </TableCell>
                        <TableCell>
                          <Button variant="outline" size="sm">
                            Recalcular
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </TabsContent>

            <TabsContent value="evolucao" className="space-y-4">
              <div className="text-center py-8 text-muted-foreground">
                Gráficos de evolução das provisões em desenvolvimento
              </div>
            </TabsContent>

            <TabsContent value="adequacao" className="space-y-4">
              <div className="grid gap-4 md:grid-cols-2">
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">Adequação às Normas ANS</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span>Margem de Solvência</span>
                        <span className="font-medium">125.6%</span>
                      </div>
                      <Progress value={100} className="h-2" />
                      <p className="text-xs text-muted-foreground">Mínimo: 100% - Status: Adequado</p>
                    </div>

                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span>Cobertura de Ativos</span>
                        <span className="font-medium">126.8%</span>
                      </div>
                      <Progress value={100} className="h-2" />
                      <p className="text-xs text-muted-foreground">Mínimo: 100% - Status: Adequado</p>
                    </div>

                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span>Provisões / Receita</span>
                        <span className="font-medium">41.8%</span>
                      </div>
                      <Progress value={84} className="h-2" />
                      <p className="text-xs text-muted-foreground">Referência: 50% - Status: Adequado</p>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">Alertas e Recomendações</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      <div className="flex items-start space-x-2">
                        <AlertTriangleIcon className="h-4 w-4 text-yellow-500 mt-0.5" />
                        <div>
                          <p className="text-sm font-medium">PIC em Atenção</p>
                          <p className="text-xs text-muted-foreground">
                            Aumento de 18.4% devido ao crescimento da sinistralidade
                          </p>
                        </div>
                      </div>

                      <div className="flex items-start space-x-2">
                        <ShieldCheckIcon className="h-4 w-4 text-green-500 mt-0.5" />
                        <div>
                          <p className="text-sm font-medium">Demais Provisões Adequadas</p>
                          <p className="text-xs text-muted-foreground">
                            Todas as outras provisões estão dentro dos parâmetros
                          </p>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  )
}
