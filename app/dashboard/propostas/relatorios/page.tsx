"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Legend,
} from "recharts"
import {
  DownloadIcon,
  TrendingUpIcon,
  FileTextIcon,
  CheckCircleIcon,
  ClockIcon,
  PrinterIcon,
  FilterIcon,
} from "lucide-react"
import { useToast } from "@/hooks/use-toast"

interface Proposta {
  id: number
  status: string
  valor_proposto: number
  tipo_plano: string
  data_submissao: string
  data_analise?: string
  data_aprovacao?: string
}

const relatoriosDisponiveis = [
  {
    titulo: "Relatório Completo de Propostas",
    descricao: "Relatório detalhado com todas as propostas do período",
    tipo: "completo",
  },
  {
    titulo: "Relatório de Propostas Aprovadas",
    descricao: "Lista de todas as propostas aprovadas com detalhes",
    tipo: "aprovadas",
  },
  {
    titulo: "Relatório de Propostas Rejeitadas",
    descricao: "Análise das propostas rejeitadas e motivos",
    tipo: "rejeitadas",
  },
  {
    titulo: "Relatório de Performance",
    descricao: "Métricas de performance e tempo de análise",
    tipo: "performance",
  },
  {
    titulo: "Relatório Financeiro",
    descricao: "Valores totais e projeções financeiras",
    tipo: "financeiro",
  },
  {
    titulo: "Relatório por Analista",
    descricao: "Performance individual dos analistas",
    tipo: "analista",
  },
]

export default function RelatoriosPropostasPage() {
  const { toast } = useToast()
  const [anoSelecionado, setAnoSelecionado] = useState("2025")
  const [mesSelecionado, setMesSelecionado] = useState("todos")
  const [propostas, setPropostas] = useState<Proposta[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const fetchPropostas = async () => {
      try {
        const response = await fetch("/api/propostas")
        if (!response.ok) {
          throw new Error("Erro ao carregar propostas")
        }

        const data = await response.json()
        setPropostas(data)
      } catch (error) {
        console.error("[v0] Erro ao carregar propostas:", error)
      } finally {
        setIsLoading(false)
      }
    }

    fetchPropostas()
  }, [])

  const dadosStatusPropostas = [
    {
      name: "Aprovadas",
      value: propostas.filter((p) => p.status === "aprovada").length,
      color: "#10b981",
    },
    {
      name: "Rejeitadas",
      value: propostas.filter((p) => p.status === "rejeitada").length,
      color: "#ef4444",
    },
    {
      name: "Pendentes",
      value: propostas.filter((p) => p.status === "pendente").length,
      color: "#f59e0b",
    },
    {
      name: "Em Análise",
      value: propostas.filter((p) => p.status === "em_analise").length,
      color: "#3b82f6",
    },
  ]

  const totalPropostas = propostas.length
  const valorTotalAprovadas = propostas
    .filter((p) => p.status === "aprovada")
    .reduce((sum, p) => sum + p.valor_proposto, 0)

  const taxaAprovacao =
    totalPropostas > 0
      ? Math.round(((dadosStatusPropostas.find((d) => d.name === "Aprovadas")?.value || 0) / totalPropostas) * 100)
      : 0

  // Calcular tempo médio de análise
  const propostasAnalisadas = propostas.filter((p) => p.data_analise && p.data_submissao)
  const tempoMedio =
    propostasAnalisadas.length > 0
      ? propostasAnalisadas.reduce((sum, p) => {
          const dataSubmissao = new Date(p.data_submissao)
          const dataAnalise = new Date(p.data_analise!)
          const diffTime = Math.abs(dataAnalise.getTime() - dataSubmissao.getTime())
          const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))
          return sum + diffDays
        }, 0) / propostasAnalisadas.length
      : 0

  // Agrupar propostas por tipo de plano
  const tiposPlano = ["ambulatorial", "hospitalar", "odontologico", "completo"]
  const dadosTipoPlano = tiposPlano.map((tipo) => {
    const propostasTipo = propostas.filter((p) => p.tipo_plano.toLowerCase().includes(tipo))
    return {
      tipo: tipo.charAt(0).toUpperCase() + tipo.slice(1),
      quantidade: propostasTipo.length,
      valor: propostasTipo.reduce((sum, p) => sum + p.valor_proposto, 0),
    }
  })

  // Agrupar propostas por mês
  const dadosPropostasPorMes = propostas.reduce(
    (acc, proposta) => {
      const data = new Date(proposta.data_submissao)
      const mes = data.toLocaleString("pt-BR", { month: "short" })
      const mesCapitalizado = mes.charAt(0).toUpperCase() + mes.slice(1, 3)

      const mesExistente = acc.find((item) => item.mes === mesCapitalizado)
      if (mesExistente) {
        mesExistente.total++
        if (proposta.status === "aprovada") mesExistente.aprovadas++
        if (proposta.status === "rejeitada") mesExistente.rejeitadas++
        if (proposta.status === "pendente") mesExistente.pendentes++
      } else {
        acc.push({
          mes: mesCapitalizado,
          total: 1,
          aprovadas: proposta.status === "aprovada" ? 1 : 0,
          rejeitadas: proposta.status === "rejeitada" ? 1 : 0,
          pendentes: proposta.status === "pendente" ? 1 : 0,
        })
      }
      return acc
    },
    [] as Array<{ mes: string; total: number; aprovadas: number; rejeitadas: number; pendentes: number }>,
  )

  const handleExportarRelatorio = (tipo: string) => {
    toast({
      title: "Exportando relatório",
      description: `Gerando relatório de ${tipo}...`,
    })
    // Aqui seria a lógica de exportação real
  }

  const handleImprimirRelatorio = (tipo: string) => {
    toast({
      title: "Imprimindo relatório",
      description: `Preparando impressão do relatório de ${tipo}...`,
    })
    // Aqui seria a lógica de impressão real
  }

  const handleExportarGrafico = (formato: string) => {
    toast({
      title: "Exportando gráfico",
      description: `Exportando gráfico em formato ${formato}...`,
    })
  }

  if (isLoading) {
    return (
      <div className="flex-1 flex items-center justify-center p-6">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    )
  }

  return (
    <div className="flex-1 space-y-6 p-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-slate-900">Relatórios de Propostas</h1>
          <p className="text-slate-600">Análise estatística e relatórios detalhados das propostas</p>
        </div>
        <div className="flex gap-2">
          <Select value={mesSelecionado} onValueChange={setMesSelecionado}>
            <SelectTrigger className="w-32">
              <FilterIcon className="w-4 h-4 mr-2" />
              <SelectValue placeholder="Mês" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="todos">Todos</SelectItem>
              <SelectItem value="01">Janeiro</SelectItem>
              <SelectItem value="02">Fevereiro</SelectItem>
              <SelectItem value="03">Março</SelectItem>
            </SelectContent>
          </Select>
          <Select value={anoSelecionado} onValueChange={setAnoSelecionado}>
            <SelectTrigger className="w-32">
              <SelectValue placeholder="Ano" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="2025">2025</SelectItem>
              <SelectItem value="2024">2024</SelectItem>
              <SelectItem value="2023">2023</SelectItem>
            </SelectContent>
          </Select>
          <Button variant="outline" onClick={() => handleExportarGrafico("PDF")}>
            <DownloadIcon className="w-4 h-4 mr-2" />
            Exportar
          </Button>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total de Propostas</CardTitle>
            <FileTextIcon className="h-4 w-4 text-blue-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-600">{totalPropostas}</div>
            <p className="text-xs text-slate-600">propostas cadastradas</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Taxa de Aprovação</CardTitle>
            <CheckCircleIcon className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">{taxaAprovacao}%</div>
            <p className="text-xs text-slate-600">propostas aprovadas</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Valor Aprovado</CardTitle>
            <TrendingUpIcon className="h-4 w-4 text-purple-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-purple-600">R$ {(valorTotalAprovadas / 1000000).toFixed(1)}M</div>
            <p className="text-xs text-slate-600">em propostas aprovadas</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Tempo Médio</CardTitle>
            <ClockIcon className="h-4 w-4 text-orange-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-orange-600">{tempoMedio.toFixed(1)} dias</div>
            <p className="text-xs text-slate-600">tempo de análise</p>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="graficos" className="space-y-6">
        <TabsList className="grid w-full grid-cols-2 max-w-md">
          <TabsTrigger value="graficos">Gráficos e Análises</TabsTrigger>
          <TabsTrigger value="relatorios">Relatórios Disponíveis</TabsTrigger>
        </TabsList>

        <TabsContent value="graficos" className="space-y-6">
          <div className="grid gap-6 md:grid-cols-2">
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle>Propostas por Mês</CardTitle>
                    <CardDescription>Evolução mensal das propostas recebidas</CardDescription>
                  </div>
                  <Button variant="ghost" size="sm" onClick={() => handleExportarGrafico("PNG")}>
                    <DownloadIcon className="w-4 h-4" />
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={dadosPropostasPorMes}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="mes" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Bar dataKey="aprovadas" fill="#10b981" name="Aprovadas" />
                    <Bar dataKey="rejeitadas" fill="#ef4444" name="Rejeitadas" />
                    <Bar dataKey="pendentes" fill="#f59e0b" name="Pendentes" />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle>Status das Propostas</CardTitle>
                    <CardDescription>Distribuição atual por status</CardDescription>
                  </div>
                  <Button variant="ghost" size="sm" onClick={() => handleExportarGrafico("PNG")}>
                    <DownloadIcon className="w-4 h-4" />
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <PieChart>
                    <Pie
                      data={dadosStatusPropostas.filter((d) => d.value > 0)}
                      cx="50%"
                      cy="50%"
                      outerRadius={100}
                      fill="#8884d8"
                      dataKey="value"
                      label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                    >
                      {dadosStatusPropostas.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Propostas por Tipo de Plano</CardTitle>
              <CardDescription>Análise de demanda por categoria de plano</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {dadosTipoPlano
                  .filter((plano) => plano.quantidade > 0)
                  .map((plano, index) => (
                    <div key={index} className="flex items-center justify-between p-4 bg-slate-50 rounded-lg">
                      <div className="flex items-center gap-4">
                        <div className="w-4 h-4 rounded-full bg-blue-600"></div>
                        <div>
                          <p className="font-medium text-slate-900">{plano.tipo}</p>
                          <p className="text-sm text-slate-600">{plano.quantidade} propostas</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="font-medium text-slate-900">R$ {(plano.valor / 1000).toLocaleString("pt-BR")}K</p>
                        <p className="text-sm text-slate-600">
                          {totalPropostas > 0 ? Math.round((plano.quantidade / totalPropostas) * 100) : 0}% do total
                        </p>
                      </div>
                    </div>
                  ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="relatorios" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Relatórios Disponíveis para Download</CardTitle>
              <CardDescription>Selecione o relatório desejado e escolha o formato de exportação</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid gap-4 md:grid-cols-2">
                {relatoriosDisponiveis.map((relatorio, index) => (
                  <Card key={index} className="border-2 hover:border-blue-200 transition-colors">
                    <CardHeader>
                      <CardTitle className="text-lg">{relatorio.titulo}</CardTitle>
                      <CardDescription>{relatorio.descricao}</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="flex gap-2">
                        <Button
                          variant="outline"
                          size="sm"
                          className="flex-1 bg-transparent"
                          onClick={() => handleExportarRelatorio(relatorio.tipo)}
                        >
                          <DownloadIcon className="w-4 h-4 mr-2" />
                          PDF
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          className="flex-1 bg-transparent"
                          onClick={() => handleExportarRelatorio(relatorio.tipo)}
                        >
                          <DownloadIcon className="w-4 h-4 mr-2" />
                          Excel
                        </Button>
                        <Button variant="outline" size="sm" onClick={() => handleImprimirRelatorio(relatorio.tipo)}>
                          <PrinterIcon className="w-4 h-4" />
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
