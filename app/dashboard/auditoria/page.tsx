"use client"

import type React from "react"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"

export default function AuditoriaPage() {
  const [isNovaAuditoriaOpen, setIsNovaAuditoriaOpen] = useState(false)
  const [auditorias, setAuditorias] = useState([
    {
      id: "AUD-2024-001",
      titulo: "Auditoria de Processos Financeiros",
      tipo: "Interna",
      auditor: "Maria Santos",
      dataInicio: "2024-01-15",
      dataFim: "2024-01-30",
      status: "Concluída",
      achados: 3,
      criticidade: "Média",
    },
    {
      id: "AUD-2024-002",
      titulo: "Revisão de Compliance ANS",
      tipo: "Externa",
      auditor: "João Oliveira",
      dataInicio: "2024-02-01",
      dataFim: "2024-02-15",
      status: "Em Andamento",
      achados: 1,
      criticidade: "Alta",
    },
    {
      id: "AUD-2024-003",
      titulo: "Auditoria de Sistemas de TI",
      tipo: "Interna",
      auditor: "Carlos Silva",
      dataInicio: "2024-02-20",
      dataFim: "2024-03-05",
      status: "Planejada",
      achados: 0,
      criticidade: "Baixa",
    },
  ])

  const handleNovaAuditoria = (e: React.FormEvent) => {
    e.preventDefault()
    const formData = new FormData(e.target as HTMLFormElement)
    const novaAuditoria = {
      id: `AUD-2024-${String(auditorias.length + 1).padStart(3, "0")}`,
      titulo: formData.get("titulo") as string,
      tipo: formData.get("tipo") as string,
      auditor: formData.get("auditor") as string,
      dataInicio: formData.get("dataInicio") as string,
      dataFim: formData.get("dataFim") as string,
      status: "Planejada",
      achados: 0,
      criticidade: formData.get("criticidade") as string,
    }
    setAuditorias([...auditorias, novaAuditoria])
    setIsNovaAuditoriaOpen(false)
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Concluída":
        return "bg-green-100 text-green-800"
      case "Em Andamento":
        return "bg-blue-100 text-blue-800"
      case "Planejada":
        return "bg-yellow-100 text-yellow-800"
      case "Cancelada":
        return "bg-red-100 text-red-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  const getCriticidadeColor = (criticidade: string) => {
    switch (criticidade) {
      case "Alta":
        return "bg-red-100 text-red-800"
      case "Média":
        return "bg-yellow-100 text-yellow-800"
      case "Baixa":
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
            <h1 className="text-2xl font-bold text-foreground">Auditoria de Processos</h1>
            <p className="text-muted-foreground">Gestão e acompanhamento de auditorias internas e externas</p>
          </div>
          <Dialog open={isNovaAuditoriaOpen} onOpenChange={setIsNovaAuditoriaOpen}>
            <DialogTrigger asChild>
              <Button>
                <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4"
                  />
                </svg>
                Nova Auditoria
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[500px]">
              <DialogHeader>
                <DialogTitle>Agendar Nova Auditoria</DialogTitle>
                <DialogDescription>Cadastre uma nova auditoria para acompanhamento</DialogDescription>
              </DialogHeader>
              <form onSubmit={handleNovaAuditoria}>
                <div className="grid gap-4 py-4">
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="titulo" className="text-right">
                      Título
                    </Label>
                    <Input id="titulo" name="titulo" className="col-span-3" required />
                  </div>
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="tipo" className="text-right">
                      Tipo
                    </Label>
                    <Select name="tipo" required>
                      <SelectTrigger className="col-span-3">
                        <SelectValue placeholder="Selecione o tipo" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Interna">Interna</SelectItem>
                        <SelectItem value="Externa">Externa</SelectItem>
                        <SelectItem value="Regulatória">Regulatória</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="auditor" className="text-right">
                      Auditor
                    </Label>
                    <Input id="auditor" name="auditor" className="col-span-3" required />
                  </div>
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="dataInicio" className="text-right">
                      Data Início
                    </Label>
                    <Input id="dataInicio" name="dataInicio" type="date" className="col-span-3" required />
                  </div>
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="dataFim" className="text-right">
                      Data Fim
                    </Label>
                    <Input id="dataFim" name="dataFim" type="date" className="col-span-3" required />
                  </div>
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="criticidade" className="text-right">
                      Criticidade
                    </Label>
                    <Select name="criticidade" required>
                      <SelectTrigger className="col-span-3">
                        <SelectValue placeholder="Selecione a criticidade" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Alta">Alta</SelectItem>
                        <SelectItem value="Média">Média</SelectItem>
                        <SelectItem value="Baixa">Baixa</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                <DialogFooter>
                  <Button type="submit">Agendar Auditoria</Button>
                </DialogFooter>
              </form>
            </DialogContent>
          </Dialog>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-2">
                <svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
                  />
                </svg>
                <div>
                  <p className="text-sm text-muted-foreground">Auditorias Ativas</p>
                  <p className="text-xl font-bold text-blue-600">3</p>
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
                  <p className="text-sm text-muted-foreground">Achados Críticos</p>
                  <p className="text-xl font-bold text-red-600">4</p>
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
                    d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
                <div>
                  <p className="text-sm text-muted-foreground">Conformidade</p>
                  <p className="text-xl font-bold text-green-600">87%</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-2">
                <svg className="w-5 h-5 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
                <div>
                  <p className="text-sm text-muted-foreground">Ações Pendentes</p>
                  <p className="text-xl font-bold text-purple-600">7</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Auditorias List */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle>Auditorias</CardTitle>
                <CardDescription>Acompanhe todas as auditorias em andamento</CardDescription>
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
                <Input placeholder="Buscar auditoria..." className="pl-10 w-64" />
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {auditorias.map((auditoria) => (
                <div
                  key={auditoria.id}
                  className="flex items-center justify-between p-4 border rounded-lg hover:bg-muted/50 transition-colors"
                >
                  <div className="flex items-center gap-4">
                    <svg className="w-8 h-8 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4"
                      />
                    </svg>
                    <div>
                      <h3 className="font-medium text-foreground">{auditoria.id}</h3>
                      <p className="text-sm text-muted-foreground">{auditoria.titulo}</p>
                      <p className="text-xs text-muted-foreground">Auditor: {auditoria.auditor}</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-6">
                    <div className="text-center">
                      <p className="text-sm font-medium text-foreground">{auditoria.dataInicio}</p>
                      <p className="text-xs text-muted-foreground">até {auditoria.dataFim}</p>
                    </div>

                    <div className="text-center">
                      <p className="text-sm font-medium text-foreground">{auditoria.achados}</p>
                      <p className="text-xs text-muted-foreground">achados</p>
                    </div>

                    <Badge className={getCriticidadeColor(auditoria.criticidade)}>{auditoria.criticidade}</Badge>

                    <Badge className={getStatusColor(auditoria.status)}>{auditoria.status}</Badge>

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
    </div>
  )
}
