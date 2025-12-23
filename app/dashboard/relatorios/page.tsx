"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"

export default function RelatoriosPage() {
  const [isGerandoRelatorio, setIsGerandoRelatorio] = useState(false)
  const [relatorioSelecionado, setRelatorioSelecionado] = useState<string>("")

  const relatorios = [
    {
      nome: "Relatório Financeiro Mensal",
      descricao: "Receitas, despesas e inadimplência do mês",
      tipo: "Financeiro",
      periodo: "Mensal",
    },
    {
      nome: "Relatório de Segurados",
      descricao: "Estatísticas de segurados ativos e inativos",
      tipo: "Operacional",
      periodo: "Semanal",
    },
    {
      nome: "Relatório de Sinistros",
      descricao: "Análise de sinistros por período e tipo",
      tipo: "Operacional",
      periodo: "Mensal",
    },
  ]

  const handleGerarRelatorio = (nomeRelatorio: string) => {
    setRelatorioSelecionado(nomeRelatorio)
    setIsGerandoRelatorio(true)

    // Simular geração do relatório
    setTimeout(() => {
      setIsGerandoRelatorio(false)
    }, 2000)
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-6 py-6">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-2xl font-bold text-foreground">Relatórios</h1>
            <p className="text-muted-foreground">Gere e visualize relatórios do sistema</p>
          </div>
          <div className="flex gap-2">
            <Select defaultValue="mes">
              <SelectTrigger className="w-40">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="mes">Este Mês</SelectItem>
                <SelectItem value="trimestre">Trimestre</SelectItem>
                <SelectItem value="ano">Este Ano</SelectItem>
              </SelectContent>
            </Select>
            <Button>
              <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                />
              </svg>
              Exportar Todos
            </Button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {relatorios.map((relatorio, index) => (
            <Card key={index} className="hover:shadow-md transition-shadow">
              <CardHeader>
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center">
                    <svg className="w-5 h-5 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <polyline points="23 6 13.5 15.5 8.5 10.5 1 18" />
                      <polyline points="17 6 23 6 23 12" />
                    </svg>
                  </div>
                  <div className="flex-1">
                    <CardTitle className="text-lg">{relatorio.nome}</CardTitle>
                    <CardDescription>{relatorio.descricao}</CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex gap-4">
                    <div>
                      <p className="text-sm text-muted-foreground">Tipo</p>
                      <p className="font-medium">{relatorio.tipo}</p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Período</p>
                      <p className="font-medium">{relatorio.periodo}</p>
                    </div>
                  </div>
                  <div className="flex justify-end">
                    <Button
                      size="sm"
                      onClick={() => handleGerarRelatorio(relatorio.nome)}
                      disabled={isGerandoRelatorio}
                    >
                      <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <line x1="18" y1="20" x2="18" y2="10" />
                        <line x1="12" y1="20" x2="12" y2="4" />
                        <line x1="6" y1="20" x2="6" y2="14" />
                      </svg>
                      {isGerandoRelatorio && relatorioSelecionado === relatorio.nome ? "Gerando..." : "Gerar"}
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mt-8">
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-2">
                <svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
                  <line x1="16" y1="2" x2="16" y2="6" />
                  <line x1="8" y1="2" x2="8" y2="6" />
                  <line x1="3" y1="10" x2="21" y2="10" />
                </svg>
                <div>
                  <p className="text-sm text-muted-foreground">Relatórios Gerados</p>
                  <p className="text-xl font-bold text-blue-600">47</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-2">
                <svg className="w-5 h-5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                  />
                </svg>
                <div>
                  <p className="text-sm text-muted-foreground">Downloads</p>
                  <p className="text-xl font-bold text-green-600">156</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-2">
                <svg className="w-5 h-5 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <polyline points="23 6 13.5 15.5 8.5 10.5 1 18" />
                  <polyline points="17 6 23 6 23 12" />
                </svg>
                <div>
                  <p className="text-sm text-muted-foreground">Receita Mensal</p>
                  <p className="text-xl font-bold text-purple-600">R$ 2.4M</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-2">
                <svg className="w-5 h-5 text-orange-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z"
                  />
                </svg>
                <div>
                  <p className="text-sm text-muted-foreground">Segurados Ativos</p>
                  <p className="text-xl font-bold text-orange-600">2,847</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <Dialog open={isGerandoRelatorio} onOpenChange={setIsGerandoRelatorio}>
          <DialogContent className="sm:max-w-[400px]">
            <DialogHeader>
              <DialogTitle>Gerando Relatório</DialogTitle>
              <DialogDescription>Processando dados para: {relatorioSelecionado}</DialogDescription>
            </DialogHeader>
            <div className="flex items-center justify-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
            </div>
            <DialogFooter>
              <p className="text-sm text-muted-foreground">Aguarde enquanto o relatório é gerado...</p>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  )
}
