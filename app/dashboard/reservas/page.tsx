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

export default function ReservasPage() {
  const [isCalculandoReserva, setIsCalculandoReserva] = useState(false)
  const [reservas, setReservas] = useState([
    {
      id: "RSV-001",
      tipo: "IBNR",
      nome: "Incurred But Not Reported",
      valor: "R$ 2.450.000,00",
      dataCalculo: "2024-01-31",
      status: "Aprovada",
      metodologia: "Chain Ladder",
      confianca: "95%",
    },
    {
      id: "RSV-002",
      tipo: "RBNS",
      nome: "Reported But Not Settled",
      valor: "R$ 1.890.000,00",
      dataCalculo: "2024-01-31",
      status: "Em Análise",
      metodologia: "Case by Case",
      confianca: "90%",
    },
    {
      id: "RSV-003",
      tipo: "PMI",
      nome: "Provisão Matemática de Insuficiência",
      valor: "R$ 850.000,00",
      dataCalculo: "2024-01-31",
      status: "Pendente",
      metodologia: "Atuarial",
      confianca: "99%",
    },
  ])

  const handleCalcularReserva = (e: React.FormEvent) => {
    e.preventDefault()
    setIsCalculandoReserva(true)
    setTimeout(() => {
      setIsCalculandoReserva(false)
    }, 3000)
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Aprovada":
        return "bg-green-100 text-green-800"
      case "Em Análise":
        return "bg-yellow-100 text-yellow-800"
      case "Pendente":
        return "bg-red-100 text-red-800"
      case "Rejeitada":
        return "bg-gray-100 text-gray-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-6 py-6">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-2xl font-bold text-foreground">Reservas Técnicas</h1>
            <p className="text-muted-foreground">Cálculo e gestão de reservas atuariais</p>
          </div>
          <Dialog>
            <DialogTrigger asChild>
              <Button>
                <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 7h6m0 10v-3m-3 3h.01M9 17h.01M9 14h.01M12 14h.01M15 11h.01M12 11h.01M9 11h.01M7 21h10a2 2 0 002-2V5a2 2 0 00-2-2H7a2 2 0 00-2 2v14a2 2 0 002 2z"
                  />
                </svg>
                Calcular Reserva
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[500px]">
              <DialogHeader>
                <DialogTitle>Calcular Nova Reserva</DialogTitle>
                <DialogDescription>Configure os parâmetros para cálculo atuarial</DialogDescription>
              </DialogHeader>
              <form onSubmit={handleCalcularReserva}>
                <div className="grid gap-4 py-4">
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="tipo" className="text-right">
                      Tipo
                    </Label>
                    <Select name="tipo" required>
                      <SelectTrigger className="col-span-3">
                        <SelectValue placeholder="Selecione o tipo" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="IBNR">IBNR - Incurred But Not Reported</SelectItem>
                        <SelectItem value="RBNS">RBNS - Reported But Not Settled</SelectItem>
                        <SelectItem value="PMI">PMI - Provisão Matemática de Insuficiência</SelectItem>
                        <SelectItem value="PEONA">PEONA - Provisão de Eventos Ocorridos e Não Avisados</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="metodologia" className="text-right">
                      Metodologia
                    </Label>
                    <Select name="metodologia" required>
                      <SelectTrigger className="col-span-3">
                        <SelectValue placeholder="Selecione a metodologia" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="chain-ladder">Chain Ladder</SelectItem>
                        <SelectItem value="bornhuetter">Bornhuetter-Ferguson</SelectItem>
                        <SelectItem value="case-by-case">Case by Case</SelectItem>
                        <SelectItem value="atuarial">Método Atuarial</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="periodo" className="text-right">
                      Período
                    </Label>
                    <Select name="periodo" required>
                      <SelectTrigger className="col-span-3">
                        <SelectValue placeholder="Selecione o período" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="mensal">Mensal</SelectItem>
                        <SelectItem value="trimestral">Trimestral</SelectItem>
                        <SelectItem value="semestral">Semestral</SelectItem>
                        <SelectItem value="anual">Anual</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="confianca" className="text-right">
                      Confiança
                    </Label>
                    <Select name="confianca" required>
                      <SelectTrigger className="col-span-3">
                        <SelectValue placeholder="Nível de confiança" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="90">90%</SelectItem>
                        <SelectItem value="95">95%</SelectItem>
                        <SelectItem value="99">99%</SelectItem>
                        <SelectItem value="99.5">99.5%</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                <DialogFooter>
                  <Button type="submit" disabled={isCalculandoReserva}>
                    {isCalculandoReserva ? "Calculando..." : "Calcular Reserva"}
                  </Button>
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
                    d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1"
                  />
                </svg>
                <div>
                  <p className="text-sm text-muted-foreground">Total Reservas</p>
                  <p className="text-xl font-bold text-blue-600">R$ 5.19M</p>
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
                  <p className="text-sm text-muted-foreground">Solvência</p>
                  <p className="text-xl font-bold text-green-600">187%</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-2">
                <svg className="w-5 h-5 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 7h6m0 10v-3m-3 3h.01M9 17h.01M9 14h.01M12 14h.01M15 11h.01M12 11h.01M9 11h.01M7 21h10a2 2 0 002-2V5a2 2 0 00-2-2H7a2 2 0 00-2 2v14a2 2 0 002 2z"
                  />
                </svg>
                <div>
                  <p className="text-sm text-muted-foreground">Última Atualização</p>
                  <p className="text-xl font-bold text-purple-600">31/01</p>
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
                    d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
                <div>
                  <p className="text-sm text-muted-foreground">Adequação</p>
                  <p className="text-xl font-bold text-orange-600">98.5%</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Reservas List */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle>Reservas Técnicas Ativas</CardTitle>
                <CardDescription>Acompanhe todas as reservas calculadas</CardDescription>
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
                <Input placeholder="Buscar reserva..." className="pl-10 w-64" />
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {reservas.map((reserva) => (
                <div
                  key={reserva.id}
                  className="flex items-center justify-between p-4 border rounded-lg hover:bg-muted/50 transition-colors"
                >
                  <div className="flex items-center gap-4">
                    <svg className="w-8 h-8 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M9 7h6m0 10v-3m-3 3h.01M9 17h.01M9 14h.01M12 14h.01M15 11h.01M12 11h.01M9 11h.01M7 21h10a2 2 0 002-2V5a2 2 0 00-2-2H7a2 2 0 00-2 2v14a2 2 0 002 2z"
                      />
                    </svg>
                    <div>
                      <h3 className="font-medium text-foreground">
                        {reserva.tipo} - {reserva.id}
                      </h3>
                      <p className="text-sm text-muted-foreground">{reserva.nome}</p>
                      <p className="text-xs text-muted-foreground">Metodologia: {reserva.metodologia}</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-6">
                    <div className="text-center">
                      <p className="text-sm font-medium text-foreground">{reserva.valor}</p>
                      <p className="text-xs text-muted-foreground">Confiança: {reserva.confianca}</p>
                    </div>

                    <div className="text-center">
                      <p className="text-sm font-medium text-foreground">{reserva.dataCalculo}</p>
                      <p className="text-xs text-muted-foreground">Último cálculo</p>
                    </div>

                    <Badge className={getStatusColor(reserva.status)}>{reserva.status}</Badge>

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

        <Dialog open={isCalculandoReserva} onOpenChange={setIsCalculandoReserva}>
          <DialogContent className="sm:max-w-[400px]">
            <DialogHeader>
              <DialogTitle>Calculando Reserva Técnica</DialogTitle>
              <DialogDescription>Processando dados atuariais...</DialogDescription>
            </DialogHeader>
            <div className="flex items-center justify-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
            </div>
            <DialogFooter>
              <p className="text-sm text-muted-foreground">Aplicando metodologia atuarial...</p>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  )
}
