"use client"

import type React from "react"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
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

export default function PrazosPage() {
  const [isNovoPrazoOpen, setIsNovoPrazoOpen] = useState(false)
  const [prazos, setPrazos] = useState([
    {
      id: 1,
      titulo: "Envio RIP Q1 2024",
      descricao: "Relatório de Informações Periódicas do primeiro trimestre",
      prazo: "2024-03-30",
      categoria: "ANS",
      prioridade: "Alta",
      status: "Pendente",
      diasRestantes: 15,
    },
    {
      id: 2,
      titulo: "Auditoria Interna Trimestral",
      descricao: "Revisão dos processos internos de compliance",
      prazo: "2024-02-28",
      categoria: "Auditoria",
      prioridade: "Média",
      status: "Em Andamento",
      diasRestantes: 8,
    },
    {
      id: 3,
      titulo: "Renovação Certificado Digital",
      descricao: "Renovação do certificado A3 para envios ANS",
      prazo: "2024-04-15",
      categoria: "Certificação",
      prioridade: "Alta",
      status: "Pendente",
      diasRestantes: 31,
    },
  ])

  const handleNovoPrazo = (e: React.FormEvent) => {
    e.preventDefault()
    const formData = new FormData(e.target as HTMLFormElement)
    const novoPrazo = {
      id: prazos.length + 1,
      titulo: formData.get("titulo") as string,
      descricao: formData.get("descricao") as string,
      prazo: formData.get("prazo") as string,
      categoria: formData.get("categoria") as string,
      prioridade: formData.get("prioridade") as string,
      status: "Pendente",
      diasRestantes: Math.ceil(
        (new Date(formData.get("prazo") as string).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24),
      ),
    }
    setPrazos([...prazos, novoPrazo])
    setIsNovoPrazoOpen(false)
  }

  const getPrioridadeColor = (prioridade: string) => {
    switch (prioridade) {
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

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Concluído":
        return "bg-green-100 text-green-800"
      case "Em Andamento":
        return "bg-blue-100 text-blue-800"
      case "Pendente":
        return "bg-gray-100 text-gray-800"
      case "Atrasado":
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
            <h1 className="text-2xl font-bold text-foreground">Prazos Regulamentares</h1>
            <p className="text-muted-foreground">Controle de prazos e obrigações regulamentares</p>
          </div>
          <Dialog open={isNovoPrazoOpen} onOpenChange={setIsNovoPrazoOpen}>
            <DialogTrigger asChild>
              <Button>
                <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                </svg>
                Novo Prazo
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[500px]">
              <DialogHeader>
                <DialogTitle>Adicionar Novo Prazo</DialogTitle>
                <DialogDescription>Cadastre um novo prazo regulamentar para acompanhamento</DialogDescription>
              </DialogHeader>
              <form onSubmit={handleNovoPrazo}>
                <div className="grid gap-4 py-4">
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="titulo" className="text-right">
                      Título
                    </Label>
                    <Input id="titulo" name="titulo" className="col-span-3" required />
                  </div>
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="descricao" className="text-right">
                      Descrição
                    </Label>
                    <Textarea id="descricao" name="descricao" className="col-span-3" rows={3} />
                  </div>
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="prazo" className="text-right">
                      Prazo
                    </Label>
                    <Input id="prazo" name="prazo" type="date" className="col-span-3" required />
                  </div>
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="categoria" className="text-right">
                      Categoria
                    </Label>
                    <Select name="categoria" required>
                      <SelectTrigger className="col-span-3">
                        <SelectValue placeholder="Selecione a categoria" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="ANS">ANS</SelectItem>
                        <SelectItem value="Auditoria">Auditoria</SelectItem>
                        <SelectItem value="Certificação">Certificação</SelectItem>
                        <SelectItem value="Fiscal">Fiscal</SelectItem>
                        <SelectItem value="Trabalhista">Trabalhista</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="prioridade" className="text-right">
                      Prioridade
                    </Label>
                    <Select name="prioridade" required>
                      <SelectTrigger className="col-span-3">
                        <SelectValue placeholder="Selecione a prioridade" />
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
                  <Button type="submit">Adicionar Prazo</Button>
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
                <svg className="w-5 h-5 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
                <div>
                  <p className="text-sm text-muted-foreground">Vencendo Hoje</p>
                  <p className="text-xl font-bold text-red-600">2</p>
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
                    d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z"
                  />
                </svg>
                <div>
                  <p className="text-sm text-muted-foreground">Próximos 7 Dias</p>
                  <p className="text-xl font-bold text-yellow-600">5</p>
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
                    d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
                  />
                </svg>
                <div>
                  <p className="text-sm text-muted-foreground">Em Andamento</p>
                  <p className="text-xl font-bold text-blue-600">8</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-2">
                <svg className="w-5 h-5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                <div>
                  <p className="text-sm text-muted-foreground">Concluídos</p>
                  <p className="text-xl font-bold text-green-600">23</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Prazos List */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle>Prazos Ativos</CardTitle>
                <CardDescription>Acompanhe todos os prazos regulamentares</CardDescription>
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
                <Input placeholder="Buscar prazo..." className="pl-10 w-64" />
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {prazos.map((prazo) => (
                <div
                  key={prazo.id}
                  className="flex items-center justify-between p-4 border rounded-lg hover:bg-muted/50 transition-colors"
                >
                  <div className="flex items-center gap-4">
                    <svg className="w-8 h-8 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                      />
                    </svg>
                    <div>
                      <h3 className="font-medium text-foreground">{prazo.titulo}</h3>
                      <p className="text-sm text-muted-foreground">{prazo.descricao}</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-6">
                    <div className="text-center">
                      <p className="text-sm font-medium text-foreground">{prazo.prazo}</p>
                      <p className="text-xs text-muted-foreground">{prazo.diasRestantes} dias restantes</p>
                    </div>

                    <Badge className={getPrioridadeColor(prazo.prioridade)}>{prazo.prioridade}</Badge>

                    <Badge className={getStatusColor(prazo.status)}>{prazo.status}</Badge>

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
