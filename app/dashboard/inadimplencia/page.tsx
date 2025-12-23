"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"

export default function InadimplenciaPage() {
  const [isProcessandoWorkflow, setIsProcessandoWorkflow] = useState(false)
  const [workflowSelecionado, setWorkflowSelecionado] = useState("")

  const inadimplentes = [
    {
      id: "SEG-001",
      nome: "João Silva",
      valorDevido: "R$ 1.250,00",
      diasAtraso: 45,
      ultimoPagamento: "2023-12-15",
      etapaWorkflow: "Cobrança Amigável",
      proximaAcao: "Envio de SMS",
      dataProximaAcao: "2024-02-20",
      risco: "Médio",
    },
    {
      id: "SEG-002",
      nome: "Maria Santos",
      valorDevido: "R$ 890,00",
      diasAtraso: 75,
      ultimoPagamento: "2023-11-10",
      etapaWorkflow: "Cobrança Formal",
      proximaAcao: "Carta Registrada",
      dataProximaAcao: "2024-02-18",
      risco: "Alto",
    },
    {
      id: "SEG-003",
      nome: "Carlos Oliveira",
      valorDevido: "R$ 2.100,00",
      diasAtraso: 120,
      ultimoPagamento: "2023-10-05",
      etapaWorkflow: "Jurídico",
      proximaAcao: "Ação Judicial",
      dataProximaAcao: "2024-02-25",
      risco: "Crítico",
    },
  ]

  const workflows = [
    {
      nome: "Cobrança Amigável",
      descricao: "Lembretes por e-mail e SMS",
      duracao: "30 dias",
      taxa_sucesso: "65%",
    },
    {
      nome: "Cobrança Formal",
      descricao: "Cartas registradas e ligações",
      duracao: "45 dias",
      taxa_sucesso: "40%",
    },
    {
      nome: "Jurídico",
      descricao: "Ação judicial e negativação",
      duracao: "90 dias",
      taxa_sucesso: "25%",
    },
  ]

  const handleExecutarWorkflow = (workflow: string) => {
    setWorkflowSelecionado(workflow)
    setIsProcessandoWorkflow(true)
    setTimeout(() => {
      setIsProcessandoWorkflow(false)
    }, 2500)
  }

  const getRiscoColor = (risco: string) => {
    switch (risco) {
      case "Crítico":
        return "bg-red-100 text-red-800"
      case "Alto":
        return "bg-orange-100 text-orange-800"
      case "Médio":
        return "bg-yellow-100 text-yellow-800"
      case "Baixo":
        return "bg-green-100 text-green-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-6 py-6">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-2xl font-bold text-foreground">Gestão de Inadimplência</h1>
            <p className="text-muted-foreground">Workflows automatizados para recuperação de crédito</p>
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
            Relatório Completo
          </Button>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-2">
                <svg className="w-5 h-5 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1"
                  />
                </svg>
                <div>
                  <p className="text-sm text-muted-foreground">Total Inadimplente</p>
                  <p className="text-xl font-bold text-red-600">R$ 4.24M</p>
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
                    d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"
                  />
                </svg>
                <div>
                  <p className="text-sm text-muted-foreground">Inadimplentes</p>
                  <p className="text-xl font-bold text-orange-600">347</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-2">
                <svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
                <div>
                  <p className="text-sm text-muted-foreground">Em Workflow</p>
                  <p className="text-xl font-bold text-blue-600">89</p>
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
                    d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
                  />
                </svg>
                <div>
                  <p className="text-sm text-muted-foreground">Taxa Recuperação</p>
                  <p className="text-xl font-bold text-green-600">43%</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
          {/* Workflows */}
          <Card className="lg:col-span-1">
            <CardHeader>
              <CardTitle>Workflows Ativos</CardTitle>
              <CardDescription>Processos automatizados de cobrança</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {workflows.map((workflow, index) => (
                  <div key={index} className="p-3 border rounded-lg">
                    <div className="flex items-center justify-between mb-2">
                      <h4 className="font-medium text-sm">{workflow.nome}</h4>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => handleExecutarWorkflow(workflow.nome)}
                        disabled={isProcessandoWorkflow}
                      >
                        Executar
                      </Button>
                    </div>
                    <p className="text-xs text-muted-foreground mb-2">{workflow.descricao}</p>
                    <div className="flex justify-between text-xs">
                      <span>Duração: {workflow.duracao}</span>
                      <span className="text-green-600">Taxa: {workflow.taxa_sucesso}</span>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Inadimplentes */}
          <Card className="lg:col-span-2">
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle>Inadimplentes Críticos</CardTitle>
                  <CardDescription>Casos que requerem atenção imediata</CardDescription>
                </div>
                <div className="relative">
                  <svg
                    className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <circle cx="11" cy="11" r="8" />
                    <path d="m21 21-4.35-4.35" />
                  </svg>
                  <Input placeholder="Buscar inadimplente..." className="pl-10 w-64" />
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {inadimplentes.map((inadimplente) => (
                  <div
                    key={inadimplente.id}
                    className="flex items-center justify-between p-4 border rounded-lg hover:bg-muted/50 transition-colors"
                  >
                    <div className="flex items-center gap-4">
                      <svg className="w-8 h-8 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z"
                        />
                      </svg>
                      <div>
                        <h3 className="font-medium text-foreground">{inadimplente.nome}</h3>
                        <p className="text-sm text-muted-foreground">{inadimplente.id}</p>
                        <p className="text-xs text-muted-foreground">
                          Último pagamento: {inadimplente.ultimoPagamento}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center gap-6">
                      <div className="text-center">
                        <p className="text-sm font-medium text-foreground">{inadimplente.valorDevido}</p>
                        <p className="text-xs text-red-600">{inadimplente.diasAtraso} dias</p>
                      </div>

                      <div className="text-center">
                        <p className="text-sm font-medium text-foreground">{inadimplente.etapaWorkflow}</p>
                        <p className="text-xs text-muted-foreground">{inadimplente.proximaAcao}</p>
                      </div>

                      <Badge className={getRiscoColor(inadimplente.risco)}>{inadimplente.risco}</Badge>

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
                        Detalhes
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        <Dialog open={isProcessandoWorkflow} onOpenChange={setIsProcessandoWorkflow}>
          <DialogContent className="sm:max-w-[400px]">
            <DialogHeader>
              <DialogTitle>Executando Workflow</DialogTitle>
              <DialogDescription>Processando: {workflowSelecionado}</DialogDescription>
            </DialogHeader>
            <div className="flex items-center justify-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
            </div>
            <DialogFooter>
              <p className="text-sm text-muted-foreground">Aplicando ações automatizadas...</p>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  )
}
