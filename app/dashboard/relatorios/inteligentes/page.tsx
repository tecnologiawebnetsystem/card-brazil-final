"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Bot, Sparkles, Download, Share2, Settings, BarChart3, Brain, Zap } from "lucide-react"

export default function RelatoriosInteligentesPage() {
  const [prompt, setPrompt] = useState("")
  const [isGenerating, setIsGenerating] = useState(false)

  // Mock data para relatórios inteligentes
  const relatoriosGerados = [
    {
      id: "RI001",
      titulo: "Análise de Sinistralidade por Faixa Etária",
      descricao: "Relatório detalhado sobre a distribuição de sinistros por idade dos beneficiários",
      tipo: "Análise Preditiva",
      dataGeracao: "2024-01-15",
      status: "Concluído",
      insights: 8,
      formato: "PDF + Excel",
    },
    {
      id: "RI002",
      titulo: "Projeção de Receitas - Próximos 6 Meses",
      descricao: "Análise preditiva baseada em histórico de contraprestações e tendências de mercado",
      tipo: "Projeção Financeira",
      dataGeracao: "2024-01-14",
      status: "Concluído",
      insights: 12,
      formato: "Dashboard Interativo",
    },
    {
      id: "RI003",
      titulo: "Otimização de Rede Credenciada",
      descricao: "Análise geográfica e de utilização para otimizar a rede de prestadores",
      tipo: "Análise Operacional",
      dataGeracao: "2024-01-13",
      status: "Em Processamento",
      insights: 0,
      formato: "Mapa Interativo",
    },
  ]

  const templatesIA = [
    {
      nome: "Análise de Sinistralidade",
      descricao: "Gera análise completa de sinistros com insights preditivos",
      categoria: "Atuarial",
      parametros: ["Período", "Faixa Etária", "Tipo de Plano"],
    },
    {
      nome: "Projeção de Fluxo de Caixa",
      descricao: "Projeta receitas e despesas com base em machine learning",
      categoria: "Financeiro",
      parametros: ["Horizonte", "Cenários", "Variáveis Econômicas"],
    },
    {
      nome: "Análise de Inadimplência",
      descricao: "Identifica padrões e riscos de inadimplência",
      categoria: "Cobrança",
      parametros: ["Período", "Segmentação", "Score de Risco"],
    },
    {
      nome: "Otimização de Custos",
      descricao: "Identifica oportunidades de redução de custos operacionais",
      categoria: "Operacional",
      parametros: ["Área", "Período", "Benchmarks"],
    },
  ]

  const handleGerarRelatorio = () => {
    setIsGenerating(true)
    // Simular processamento
    setTimeout(() => {
      setIsGenerating(false)
      setPrompt("")
    }, 3000)
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-6 space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <h1 className="text-3xl font-bold text-foreground flex items-center gap-2">
              <Brain className="h-8 w-8 text-primary" />
              Relatórios Inteligentes
            </h1>
            <p className="text-muted-foreground">Análises avançadas com Inteligência Artificial</p>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" className="gap-2 bg-transparent">
              <Settings className="h-4 w-4" />
              Configurações IA
            </Button>
            <Dialog>
              <DialogTrigger asChild>
                <Button className="gap-2">
                  <Sparkles className="h-4 w-4" />
                  Novo Relatório IA
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-2xl">
                <DialogHeader>
                  <DialogTitle className="flex items-center gap-2">
                    <Bot className="h-5 w-5 text-primary" />
                    Criar Relatório com IA
                  </DialogTitle>
                  <DialogDescription>
                    Descreva o que você precisa analisar e nossa IA criará o relatório personalizado
                  </DialogDescription>
                </DialogHeader>
                <div className="space-y-4 py-4">
                  <div className="space-y-2">
                    <Label htmlFor="prompt">Descreva sua necessidade</Label>
                    <Textarea
                      id="prompt"
                      placeholder="Ex: Quero analisar a sinistralidade dos últimos 12 meses por faixa etária e identificar tendências para otimizar precificação..."
                      value={prompt}
                      onChange={(e) => setPrompt(e.target.value)}
                      rows={4}
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label>Tipo de Análise</Label>
                      <Select>
                        <SelectTrigger>
                          <SelectValue placeholder="Selecione o tipo" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="preditiva">Análise Preditiva</SelectItem>
                          <SelectItem value="descritiva">Análise Descritiva</SelectItem>
                          <SelectItem value="prescritiva">Análise Prescritiva</SelectItem>
                          <SelectItem value="comparativa">Análise Comparativa</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <Label>Formato de Saída</Label>
                      <Select>
                        <SelectTrigger>
                          <SelectValue placeholder="Selecione o formato" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="dashboard">Dashboard Interativo</SelectItem>
                          <SelectItem value="pdf">Relatório PDF</SelectItem>
                          <SelectItem value="excel">Planilha Excel</SelectItem>
                          <SelectItem value="powerbi">Power BI</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label>Período de Análise</Label>
                    <div className="grid grid-cols-2 gap-2">
                      <Input type="date" />
                      <Input type="date" />
                    </div>
                  </div>
                </div>
                <div className="flex justify-end gap-2">
                  <Button variant="outline">Cancelar</Button>
                  <Button onClick={handleGerarRelatorio} disabled={isGenerating}>
                    {isGenerating ? (
                      <>
                        <Zap className="h-4 w-4 mr-2 animate-spin" />
                        Gerando...
                      </>
                    ) : (
                      <>
                        <Sparkles className="h-4 w-4 mr-2" />
                        Gerar Relatório
                      </>
                    )}
                  </Button>
                </div>
              </DialogContent>
            </Dialog>
          </div>
        </div>

        <Tabs defaultValue="gerados" className="space-y-6">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="gerados">Relatórios Gerados</TabsTrigger>
            <TabsTrigger value="templates">Templates IA</TabsTrigger>
            <TabsTrigger value="insights">Insights Automáticos</TabsTrigger>
          </TabsList>

          <TabsContent value="gerados" className="space-y-6">
            {/* Estatísticas */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium text-muted-foreground">Relatórios Gerados</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-primary">24</div>
                  <p className="text-xs text-muted-foreground">Este mês</p>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium text-muted-foreground">Insights Descobertos</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-emerald-600">156</div>
                  <p className="text-xs text-muted-foreground">+23% vs mês anterior</p>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium text-muted-foreground">Tempo Médio</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-blue-600">2.3min</div>
                  <p className="text-xs text-muted-foreground">Para gerar relatório</p>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium text-muted-foreground">Precisão IA</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-purple-600">94.7%</div>
                  <p className="text-xs text-muted-foreground">Acurácia das previsões</p>
                </CardContent>
              </Card>
            </div>

            {/* Lista de Relatórios */}
            <div className="grid gap-4">
              {relatoriosGerados.map((relatorio) => (
                <Card key={relatorio.id} className="hover:shadow-lg transition-shadow">
                  <CardHeader>
                    <div className="flex justify-between items-start">
                      <div className="space-y-1">
                        <CardTitle className="text-lg">{relatorio.titulo}</CardTitle>
                        <CardDescription>{relatorio.descricao}</CardDescription>
                      </div>
                      <Badge variant={relatorio.status === "Concluído" ? "default" : "secondary"}>
                        {relatorio.status}
                      </Badge>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="flex justify-between items-center">
                      <div className="flex gap-4 text-sm text-muted-foreground">
                        <span>Tipo: {relatorio.tipo}</span>
                        <span>Gerado em: {new Date(relatorio.dataGeracao).toLocaleDateString("pt-BR")}</span>
                        <span>Insights: {relatorio.insights}</span>
                        <span>Formato: {relatorio.formato}</span>
                      </div>
                      <div className="flex gap-2">
                        <Button variant="ghost" size="sm">
                          <BarChart3 className="h-4 w-4" />
                        </Button>
                        <Button variant="ghost" size="sm">
                          <Download className="h-4 w-4" />
                        </Button>
                        <Button variant="ghost" size="sm">
                          <Share2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="templates" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {templatesIA.map((template, index) => (
                <Card key={index} className="hover:shadow-lg transition-shadow">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Bot className="h-5 w-5 text-primary" />
                      {template.nome}
                    </CardTitle>
                    <CardDescription>{template.descricao}</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div>
                      <Badge variant="outline">{template.categoria}</Badge>
                    </div>
                    <div>
                      <Label className="text-sm font-medium">Parâmetros:</Label>
                      <div className="flex flex-wrap gap-1 mt-1">
                        {template.parametros.map((param, i) => (
                          <Badge key={i} variant="secondary" className="text-xs">
                            {param}
                          </Badge>
                        ))}
                      </div>
                    </div>
                    <Button className="w-full gap-2">
                      <Sparkles className="h-4 w-4" />
                      Usar Template
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="insights" className="space-y-6">
            <div className="grid gap-4">
              <Card className="border-l-4 border-l-emerald-500">
                <CardHeader>
                  <CardTitle className="text-lg text-emerald-700">Oportunidade Identificada</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground mb-3">
                    A IA identificou que beneficiários na faixa de 25-35 anos têm 23% menos utilização que a média,
                    sugerindo oportunidade de criar planos mais atrativos para este segmento.
                  </p>
                  <div className="flex gap-2">
                    <Button size="sm" variant="outline">
                      Ver Detalhes
                    </Button>
                    <Button size="sm">Gerar Relatório</Button>
                  </div>
                </CardContent>
              </Card>

              <Card className="border-l-4 border-l-blue-500">
                <CardHeader>
                  <CardTitle className="text-lg text-blue-700">Tendência Detectada</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground mb-3">
                    Aumento de 15% nos procedimentos de telemedicina nos últimos 3 meses. Recomenda-se revisar a rede
                    credenciada digital.
                  </p>
                  <div className="flex gap-2">
                    <Button size="sm" variant="outline">
                      Ver Detalhes
                    </Button>
                    <Button size="sm">Gerar Relatório</Button>
                  </div>
                </CardContent>
              </Card>

              <Card className="border-l-4 border-l-orange-500">
                <CardHeader>
                  <CardTitle className="text-lg text-orange-700">Alerta de Risco</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground mb-3">
                    Projeção indica possível aumento de 8% na sinistralidade no próximo trimestre devido ao
                    envelhecimento da carteira.
                  </p>
                  <div className="flex gap-2">
                    <Button size="sm" variant="outline">
                      Ver Detalhes
                    </Button>
                    <Button size="sm">Gerar Relatório</Button>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}
