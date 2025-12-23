"use client"

import type React from "react"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"

export default function SinistrosPage() {
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [sinistros, setSinistros] = useState([
    {
      id: "SIN-2024-001",
      segurado: "João Silva",
      tipo: "Consulta Médica",
      valor: "R$ 280,00",
      status: "Aprovado",
      data: "15/01/2024",
      prestador: "Hospital São Paulo",
    },
    {
      id: "SIN-2024-002",
      segurado: "Maria Santos",
      tipo: "Exame Laboratorial",
      valor: "R$ 150,00",
      status: "Pendente",
      data: "14/01/2024",
      prestador: "Lab Diagnóstico",
    },
    {
      id: "SIN-2024-003",
      segurado: "Carlos Oliveira",
      tipo: "Cirurgia",
      valor: "R$ 5.200,00",
      status: "Em Análise",
      data: "13/01/2024",
      prestador: "Hospital Central",
    },
    {
      id: "SIN-2024-004",
      segurado: "Ana Costa",
      tipo: "Fisioterapia",
      valor: "R$ 120,00",
      status: "Negado",
      data: "12/01/2024",
      prestador: "Clínica Reabilitação",
    },
  ])

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "Aprovado":
        return (
          <svg className="w-4 h-4 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
            />
          </svg>
        )
      case "Negado":
        return (
          <svg className="w-4 h-4 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z"
            />
          </svg>
        )
      case "Pendente":
        return (
          <svg className="w-4 h-4 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <circle cx="12" cy="12" r="10" />
            <polyline points="12,6 12,12 16,14" />
          </svg>
        )
      case "Em Análise":
        return (
          <svg className="w-4 h-4 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
            />
          </svg>
        )
      default:
        return (
          <svg className="w-4 h-4 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
            />
          </svg>
        )
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Aprovado":
        return "bg-green-50 text-green-700 border-green-200"
      case "Negado":
        return "bg-red-50 text-red-700 border-red-200"
      case "Pendente":
        return "bg-yellow-50 text-yellow-700 border-yellow-200"
      case "Em Análise":
        return "bg-blue-50 text-blue-700 border-blue-200"
      default:
        return "bg-gray-50 text-gray-700 border-gray-200"
    }
  }

  const handleAddSinistro = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    const formData = new FormData(event.currentTarget)

    const novoSinistro = {
      id: `SIN-2024-${String(sinistros.length + 1).padStart(3, "0")}`,
      segurado: formData.get("segurado") as string,
      tipo: formData.get("tipo") as string,
      valor: `R$ ${formData.get("valor")}`,
      status: "Pendente",
      data: new Date().toLocaleDateString("pt-BR"),
      prestador: formData.get("prestador") as string,
    }

    setSinistros([novoSinistro, ...sinistros])
    setIsModalOpen(false)
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-6 py-6">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-2xl font-bold text-foreground">Sinistros</h1>
            <p className="text-muted-foreground">Gerencie solicitações de reembolso e autorizações</p>
          </div>
          <Button onClick={() => setIsModalOpen(true)}>
            <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
              />
            </svg>
            Novo Sinistro
          </Button>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
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
                  <p className="text-sm text-muted-foreground">Aprovados</p>
                  <p className="text-xl font-bold text-green-600">156</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-2">
                <svg className="w-5 h-5 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <circle cx="12" cy="12" r="10" />
                  <polyline points="12,6 12,12 16,14" />
                </svg>
                <div>
                  <p className="text-sm text-muted-foreground">Pendentes</p>
                  <p className="text-xl font-bold text-yellow-600">23</p>
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
                    d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
                  />
                </svg>
                <div>
                  <p className="text-sm text-muted-foreground">Em Análise</p>
                  <p className="text-xl font-bold text-blue-600">12</p>
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
                    d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
                <div>
                  <p className="text-sm text-muted-foreground">Negados</p>
                  <p className="text-xl font-bold text-red-600">8</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle>Lista de Sinistros</CardTitle>
                <CardDescription>Últimas solicitações de reembolso e autorizações</CardDescription>
              </div>
              <div className="flex items-center gap-2">
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
                  <Input placeholder="Buscar sinistro..." className="pl-10 w-64" />
                </div>
                <Select defaultValue="todos">
                  <SelectTrigger className="w-40">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="todos">Todos</SelectItem>
                    <SelectItem value="aprovado">Aprovados</SelectItem>
                    <SelectItem value="pendente">Pendentes</SelectItem>
                    <SelectItem value="negado">Negados</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {sinistros.map((sinistro) => (
                <div
                  key={sinistro.id}
                  className="flex items-center justify-between p-4 border rounded-lg hover:bg-muted/50 transition-colors"
                >
                  <div className="flex items-center gap-4">
                    {getStatusIcon(sinistro.status)}
                    <div>
                      <h3 className="font-medium text-foreground">{sinistro.id}</h3>
                      <p className="text-sm text-muted-foreground">{sinistro.segurado}</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-6">
                    <div className="text-center">
                      <p className="text-sm font-medium text-foreground">{sinistro.tipo}</p>
                      <p className="text-xs text-muted-foreground">{sinistro.prestador}</p>
                    </div>

                    <div className="text-center">
                      <p className="text-sm font-medium text-foreground">{sinistro.valor}</p>
                      <p className="text-xs text-muted-foreground">{sinistro.data}</p>
                    </div>

                    <Badge className={getStatusColor(sinistro.status)}>{sinistro.status}</Badge>

                    <Button variant="ghost" size="sm">
                      Ver Detalhes
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
          <DialogContent className="sm:max-w-[500px]">
            <DialogHeader>
              <DialogTitle>Novo Sinistro</DialogTitle>
              <DialogDescription>Registre uma nova solicitação de reembolso ou autorização</DialogDescription>
            </DialogHeader>
            <form onSubmit={handleAddSinistro}>
              <div className="grid gap-4 py-4">
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="segurado" className="text-right">
                    Segurado
                  </Label>
                  <Input id="segurado" name="segurado" placeholder="Nome do segurado" className="col-span-3" required />
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
                      <SelectItem value="Consulta Médica">Consulta Médica</SelectItem>
                      <SelectItem value="Exame Laboratorial">Exame Laboratorial</SelectItem>
                      <SelectItem value="Cirurgia">Cirurgia</SelectItem>
                      <SelectItem value="Fisioterapia">Fisioterapia</SelectItem>
                      <SelectItem value="Internação">Internação</SelectItem>
                      <SelectItem value="Medicamentos">Medicamentos</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="prestador" className="text-right">
                    Prestador
                  </Label>
                  <Input
                    id="prestador"
                    name="prestador"
                    placeholder="Hospital/Clínica"
                    className="col-span-3"
                    required
                  />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="valor" className="text-right">
                    Valor
                  </Label>
                  <Input id="valor" name="valor" placeholder="0,00" className="col-span-3" required />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="observacoes" className="text-right">
                    Observações
                  </Label>
                  <Textarea
                    id="observacoes"
                    name="observacoes"
                    placeholder="Detalhes adicionais sobre o sinistro"
                    className="col-span-3"
                    rows={3}
                  />
                </div>
              </div>
              <DialogFooter>
                <Button type="button" variant="outline" onClick={() => setIsModalOpen(false)}>
                  Cancelar
                </Button>
                <Button type="submit">Registrar Sinistro</Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  )
}
