"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"

export default function RelatoriosObrigatoriosPage() {
  const [isGerandoRelatorio, setIsGerandoRelatorio] = useState(false)
  const [relatorioSelecionado, setRelatorioSelecionado] = useState("")

  const relatoriosObrigatorios = [
    {
      codigo: "RIP",
      nome: "Rol de Informações Periódicas",
      descricao: "Dados trimestrais sobre operações da administradora",
      prazo: "30/03/2024",
      status: "Pendente",
      progresso: 75,
      periodicidade: "Trimestral",
    },
    {
      codigo: "SIB",
      nome: "Sistema de Informações de Beneficiários",
      descricao: "Informações mensais sobre beneficiários ativos",
      prazo: "15/02/2024",
      status: "Enviado",
      progresso: 100,
      periodicidade: "Mensal",
    },
    {
      codigo: "DIOPS",
      nome: "Documento de Informações Periódicas",
      descricao: "Demonstrações contábeis e atuariais anuais",
      prazo: "31/03/2024",
      status: "Em Andamento",
      progresso: 45,
      periodicidade: "Anual",
    },
    {
      codigo: "FIP",
      nome: "Formulário de Informações Periódicas",
      descricao: "Dados econômico-financeiros trimestrais",
      prazo: "30/03/2024",
      status: "Pendente",
      progresso: 20,
      periodicidade: "Trimestral",
    },
  ]

  const handleGerarRelatorio = (codigo: string) => {
    setRelatorioSelecionado(codigo)
    setIsGerandoRelatorio(true)
    setTimeout(() => {
      setIsGerandoRelatorio(false)
    }, 3000)
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Enviado":
        return "bg-green-100 text-green-800"
      case "Em Andamento":
        return "bg-yellow-100 text-yellow-800"
      case "Pendente":
        return "bg-red-100 text-red-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-6 py-6">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-2xl font-bold text-foreground">Relatórios Obrigatórios ANS</h1>
            <p className="text-muted-foreground">Gestão de relatórios regulamentares obrigatórios</p>
          </div>
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

        {/* Status Overview */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-2">
                <svg className="w-5 h-5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                <div>
                  <p className="text-sm text-muted-foreground">Enviados</p>
                  <p className="text-xl font-bold text-green-600">1</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-2">
                <svg className="w-5 h-5 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
                <div>
                  <p className="text-sm text-muted-foreground">Em Andamento</p>
                  <p className="text-xl font-bold text-yellow-600">1</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-2">
                <svg className="w-5 h-5 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z"
                  />
                </svg>
                <div>
                  <p className="text-sm text-muted-foreground">Pendentes</p>
                  <p className="text-xl font-bold text-red-600">2</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-2">
                <svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
                <div>
                  <p className="text-sm text-muted-foreground">Conformidade</p>
                  <p className="text-xl font-bold text-blue-600">75%</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Relatórios List */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {relatoriosObrigatorios.map((relatorio) => (
            <Card key={relatorio.codigo} className="hover:shadow-md transition-shadow">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle className="text-lg">{relatorio.codigo}</CardTitle>
                    <CardDescription>{relatorio.nome}</CardDescription>
                  </div>
                  <Badge className={getStatusColor(relatorio.status)}>{relatorio.status}</Badge>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <p className="text-sm text-muted-foreground">{relatorio.descricao}</p>

                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span>Progresso</span>
                      <span>{relatorio.progresso}%</span>
                    </div>
                    <Progress value={relatorio.progresso} className="h-2" />
                  </div>

                  <div className="flex justify-between items-center">
                    <div>
                      <p className="text-sm text-muted-foreground">Prazo</p>
                      <p className="font-medium">{relatorio.prazo}</p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Periodicidade</p>
                      <p className="font-medium">{relatorio.periodicidade}</p>
                    </div>
                  </div>

                  <div className="flex gap-2">
                    <Button
                      size="sm"
                      onClick={() => handleGerarRelatorio(relatorio.codigo)}
                      disabled={isGerandoRelatorio}
                    >
                      <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12"
                        />
                      </svg>
                      {isGerandoRelatorio && relatorioSelecionado === relatorio.codigo ? "Gerando..." : "Gerar"}
                    </Button>
                    <Button variant="outline" size="sm">
                      <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                        />
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
                        />
                      </svg>
                      Visualizar
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        <Dialog open={isGerandoRelatorio} onOpenChange={setIsGerandoRelatorio}>
          <DialogContent className="sm:max-w-[400px]">
            <DialogHeader>
              <DialogTitle>Gerando Relatório {relatorioSelecionado}</DialogTitle>
              <DialogDescription>Processando dados regulamentares...</DialogDescription>
            </DialogHeader>
            <div className="flex items-center justify-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
            </div>
            <DialogFooter>
              <p className="text-sm text-muted-foreground">Validando conformidade com ANS...</p>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  )
}
