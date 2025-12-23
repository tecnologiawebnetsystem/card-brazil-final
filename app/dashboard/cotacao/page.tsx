"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { RefreshCw, TrendingUp, TrendingDown, DollarSign, Percent, Calendar } from "lucide-react"

interface IndicadorFinanceiro {
  id: number
  nome: string
  codigo: string
  valor: number
  variacao: number
  unidade: string
  dataAtualizacao: string
  categoria: "cambio" | "juros" | "inflacao" | "indice"
  fonte: string
}

export default function CotacaoPage() {
  const [searchTerm, setSearchTerm] = useState("")
  const [filterCategoria, setFilterCategoria] = useState("todas")
  const [isLoading, setIsLoading] = useState(false)

  const [indicadores] = useState<IndicadorFinanceiro[]>([
    {
      id: 1,
      nome: "Real",
      codigo: "BRL",
      valor: 1.0,
      variacao: 0.0,
      unidade: "R$",
      dataAtualizacao: "2024-12-10 15:30:00",
      categoria: "cambio",
      fonte: "Banco Central",
    },
    {
      id: 2,
      nome: "Tx. Câmbio Dólar",
      codigo: "USD/BRL",
      valor: 5.15,
      variacao: 0.85,
      unidade: "R$",
      dataAtualizacao: "2024-12-10 15:30:00",
      categoria: "cambio",
      fonte: "Banco Central",
    },
    {
      id: 3,
      nome: "Índice Nac. Preços Cons.",
      codigo: "INPC",
      valor: 4.23,
      variacao: -0.12,
      unidade: "%",
      dataAtualizacao: "2024-12-10 15:30:00",
      categoria: "inflacao",
      fonte: "IBGE",
    },
    {
      id: 4,
      nome: "Tx. de Juros - TR",
      codigo: "TR",
      valor: 0.0,
      variacao: 0.0,
      unidade: "%",
      dataAtualizacao: "2024-12-10 15:30:00",
      categoria: "juros",
      fonte: "Banco Central",
    },
    {
      id: 5,
      nome: "Tx Básica Financeira",
      codigo: "TBF",
      valor: 0.5234,
      variacao: 0.02,
      unidade: "%",
      dataAtualizacao: "2024-12-10 15:30:00",
      categoria: "juros",
      fonte: "Banco Central",
    },
    {
      id: 6,
      nome: "Tx Juros - Mês",
      codigo: "TJM",
      valor: 1.0875,
      variacao: 0.15,
      unidade: "%",
      dataAtualizacao: "2024-12-10 15:30:00",
      categoria: "juros",
      fonte: "Banco Central",
    },
    {
      id: 7,
      nome: "IPCA Mensal",
      codigo: "IPCA",
      valor: 0.39,
      variacao: -0.08,
      unidade: "%",
      dataAtualizacao: "2024-12-10 15:30:00",
      categoria: "inflacao",
      fonte: "IBGE",
    },
    {
      id: 8,
      nome: "Tx. de juros - Selic",
      codigo: "SELIC",
      valor: 11.75,
      variacao: 0.0,
      unidade: "%",
      dataAtualizacao: "2024-12-10 15:30:00",
      categoria: "juros",
      fonte: "Banco Central",
    },
    {
      id: 9,
      nome: "Tx. de Juros - CDI",
      codigo: "CDI",
      valor: 11.65,
      variacao: 0.05,
      unidade: "%",
      dataAtualizacao: "2024-12-10 15:30:00",
      categoria: "juros",
      fonte: "Banco Central",
    },
  ])

  const filteredIndicadores = indicadores.filter((indicador) => {
    const matchesSearch =
      indicador.nome.toLowerCase().includes(searchTerm.toLowerCase()) ||
      indicador.codigo.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesCategoria = filterCategoria === "todas" || indicador.categoria === filterCategoria
    return matchesSearch && matchesCategoria
  })

  const handleRefresh = async () => {
    setIsLoading(true)
    // Simular chamada à API
    await new Promise((resolve) => setTimeout(resolve, 2000))
    setIsLoading(false)
  }

  const getCategoriaIcon = (categoria: string) => {
    switch (categoria) {
      case "cambio":
        return <DollarSign className="h-4 w-4" />
      case "juros":
        return <Percent className="h-4 w-4" />
      case "inflacao":
        return <TrendingUp className="h-4 w-4" />
      default:
        return <Calendar className="h-4 w-4" />
    }
  }

  const getCategoriaColor = (categoria: string) => {
    switch (categoria) {
      case "cambio":
        return "bg-blue-100 text-blue-800"
      case "juros":
        return "bg-purple-100 text-purple-800"
      case "inflacao":
        return "bg-orange-100 text-orange-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  const formatValue = (valor: number, unidade: string) => {
    if (unidade === "R$") {
      return new Intl.NumberFormat("pt-BR", {
        style: "currency",
        currency: "BRL",
        minimumFractionDigits: 2,
        maximumFractionDigits: 4,
      }).format(valor)
    }
    return `${valor.toFixed(4)}${unidade}`
  }

  const analytics = {
    totalIndicadores: indicadores.length,
    variacaoPositiva: indicadores.filter((i) => i.variacao > 0).length,
    variacaoNegativa: indicadores.filter((i) => i.variacao < 0).length,
    maiorVariacao: Math.max(...indicadores.map((i) => Math.abs(i.variacao))),
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-6 py-6">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-3xl font-bold text-foreground">Indicadores Econômicos</h1>
            <p className="text-muted-foreground">
              Acompanhe os principais indicadores financeiros brasileiros em tempo real
            </p>
          </div>
          <Button variant="outline" onClick={handleRefresh} disabled={isLoading} className="gap-2 bg-transparent">
            <RefreshCw className={`h-4 w-4 ${isLoading ? "animate-spin" : ""}`} />
            {isLoading ? "Atualizando..." : "Atualizar Dados"}
          </Button>
        </div>

        {/* Métricas Principais */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card className="bg-emerald-700 text-white border-emerald-700">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-white">Total de Indicadores</CardTitle>
              <div className="h-8 w-8 bg-emerald-800 rounded-full flex items-center justify-center">
                <Calendar className="h-4 w-4 text-white" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-white">{analytics.totalIndicadores}</div>
              <p className="text-sm text-emerald-100">indicadores monitorados</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Dólar Comercial</CardTitle>
              <DollarSign className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">R$ 5,15</div>
              <p className="text-xs text-green-600 flex items-center gap-1">
                <TrendingUp className="h-3 w-3" />
                +0.85% hoje
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Taxa Selic</CardTitle>
              <Percent className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">11,75%</div>
              <p className="text-xs text-muted-foreground">a.a. - estável</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">IPCA Mensal</CardTitle>
              <TrendingUp className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">0,39%</div>
              <p className="text-xs text-red-600 flex items-center gap-1">
                <TrendingDown className="h-3 w-3" />
                -0.08% vs mês anterior
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Filtros */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle>Filtros</CardTitle>
            <CardDescription>Pesquise e filtre os indicadores por categoria</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex gap-4">
              <div className="flex-1">
                <Input
                  placeholder="Pesquisar por nome ou código..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
              <Select value={filterCategoria} onValueChange={setFilterCategoria}>
                <SelectTrigger className="w-48">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="todas">Todas as Categorias</SelectItem>
                  <SelectItem value="cambio">Câmbio</SelectItem>
                  <SelectItem value="juros">Juros</SelectItem>
                  <SelectItem value="inflacao">Inflação</SelectItem>
                  <SelectItem value="indice">Índices</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>

        {/* Grid de Indicadores */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredIndicadores.map((indicador) => (
            <Card key={indicador.id} className="hover:shadow-lg transition-shadow">
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    {getCategoriaIcon(indicador.categoria)}
                    <CardTitle className="text-lg">{indicador.nome}</CardTitle>
                  </div>
                  <Badge className={getCategoriaColor(indicador.categoria)}>{indicador.codigo}</Badge>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div>
                    <div className="text-3xl font-bold text-foreground">
                      {formatValue(indicador.valor, indicador.unidade)}
                    </div>
                    <div className="flex items-center gap-1 mt-1">
                      {indicador.variacao >= 0 ? (
                        <TrendingUp className="h-4 w-4 text-green-600" />
                      ) : (
                        <TrendingDown className="h-4 w-4 text-red-600" />
                      )}
                      <span
                        className={`text-sm font-medium ${indicador.variacao >= 0 ? "text-green-600" : "text-red-600"}`}
                      >
                        {indicador.variacao >= 0 ? "+" : ""}
                        {indicador.variacao.toFixed(2)}%
                      </span>
                    </div>
                  </div>

                  <div className="pt-3 border-t border-border">
                    <div className="flex justify-between text-xs text-muted-foreground">
                      <span>Fonte: {indicador.fonte}</span>
                      <span>{new Date(indicador.dataAtualizacao).toLocaleString("pt-BR")}</span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {filteredIndicadores.length === 0 && (
          <Card>
            <CardContent className="text-center py-8">
              <p className="text-muted-foreground">Nenhum indicador encontrado com os filtros aplicados.</p>
            </CardContent>
          </Card>
        )}

        {/* Rodapé com informações */}
        <Card className="mt-8">
          <CardContent className="pt-6">
            <div className="text-center text-sm text-muted-foreground">
              <p>
                <strong>Fontes:</strong> Banco Central do Brasil (BCB), Instituto Brasileiro de Geografia e Estatística
                (IBGE)
              </p>
              <p className="mt-1">
                Dados atualizados automaticamente. Última sincronização: {new Date().toLocaleString("pt-BR")}
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
