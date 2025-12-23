"use client"

import type React from "react"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
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

export default function CobrancaPage() {
  const [isEnviarCobrancaOpen, setIsEnviarCobrancaOpen] = useState(false)
  const [isCobrarOpen, setIsCobrarOpen] = useState(false)
  const [selectedCobranca, setSelectedCobranca] = useState<any>(null)
  const [cobrancas, setCobrancas] = useState([
    {
      id: "COB-2024-001",
      segurado: "João Silva",
      valor: "R$ 450,00",
      vencimento: "15/01/2024",
      diasAtraso: 5,
      status: "Pendente",
      tentativas: 2,
    },
    {
      id: "COB-2024-002",
      segurado: "Carlos Oliveira",
      valor: "R$ 280,00",
      vencimento: "10/01/2024",
      diasAtraso: 10,
      status: "Em Cobrança",
      tentativas: 4,
    },
  ])

  const handleEnviarCobranca = (e: React.FormEvent) => {
    e.preventDefault()
    const formData = new FormData(e.target as HTMLFormElement)
    const novaCobranca = {
      id: `COB-2024-${String(cobrancas.length + 1).padStart(3, "0")}`,
      segurado: formData.get("segurado") as string,
      valor: formData.get("valor") as string,
      vencimento: formData.get("vencimento") as string,
      diasAtraso: 0,
      status: "Pendente",
      tentativas: 0,
    }
    setCobrancas([...cobrancas, novaCobranca])
    setIsEnviarCobrancaOpen(false)
  }

  const handleCobrar = (cobranca: any) => {
    setSelectedCobranca(cobranca)
    setIsCobrarOpen(true)
  }

  const handleEnviarCobrancaIndividual = (e: React.FormEvent) => {
    e.preventDefault()
    // Atualizar tentativas da cobrança
    const cobrancasAtualizadas = cobrancas.map((c) =>
      c.id === selectedCobranca.id ? { ...c, tentativas: c.tentativas + 1, status: "Em Cobrança" } : c,
    )
    setCobrancas(cobrancasAtualizadas)
    setIsCobrarOpen(false)
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-6 py-6">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-2xl font-bold text-foreground">Cobrança</h1>
            <p className="text-muted-foreground">Gerencie cobranças e inadimplência</p>
          </div>
          <Dialog open={isEnviarCobrancaOpen} onOpenChange={setIsEnviarCobrancaOpen}>
            <DialogTrigger asChild>
              <Button>
                <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <line x1="22" y1="2" x2="11" y2="13" />
                  <polygon points="22,2 15,22 11,13 2,9 22,2" />
                </svg>
                Enviar Cobrança
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px]">
              <DialogHeader>
                <DialogTitle>Nova Cobrança</DialogTitle>
                <DialogDescription>Criar uma nova cobrança para segurado inadimplente</DialogDescription>
              </DialogHeader>
              <form onSubmit={handleEnviarCobranca}>
                <div className="grid gap-4 py-4">
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="segurado" className="text-right">
                      Segurado
                    </Label>
                    <Input
                      id="segurado"
                      name="segurado"
                      placeholder="Nome do segurado"
                      className="col-span-3"
                      required
                    />
                  </div>
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="valor" className="text-right">
                      Valor
                    </Label>
                    <Input id="valor" name="valor" placeholder="R$ 0,00" className="col-span-3" required />
                  </div>
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="vencimento" className="text-right">
                      Vencimento
                    </Label>
                    <Input id="vencimento" name="vencimento" type="date" className="col-span-3" required />
                  </div>
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="tipo" className="text-right">
                      Tipo
                    </Label>
                    <Select name="tipo" required>
                      <SelectTrigger className="col-span-3">
                        <SelectValue placeholder="Tipo de cobrança" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="email">E-mail</SelectItem>
                        <SelectItem value="sms">SMS</SelectItem>
                        <SelectItem value="carta">Carta</SelectItem>
                        <SelectItem value="telefone">Telefone</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                <DialogFooter>
                  <Button type="submit">Criar Cobrança</Button>
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
                  <path d="m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.607 10.607Z" />
                </svg>
                <div>
                  <p className="text-sm text-muted-foreground">Em Atraso</p>
                  <p className="text-xl font-bold text-red-600">R$ 95K</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-2">
                <svg className="w-5 h-5 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <ellipse cx="12" cy="5" rx="9" ry="3" />
                  <path d="m3 5 9 9 9-9" />
                  <path d="m3 12 9 9 9-9" />
                  <path d="m3 19 9 9 9-9" />
                </svg>
                <div>
                  <p className="text-sm text-muted-foreground">Em Cobrança</p>
                  <p className="text-xl font-bold text-yellow-600">23</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-2">
                <svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <line x1="22" y1="2" x2="11" y2="13" />
                  <polygon points="22,2 15,22 11,13 2,9 22,2" />
                </svg>
                <div>
                  <p className="text-sm text-muted-foreground">Enviadas Hoje</p>
                  <p className="text-xl font-bold text-blue-600">12</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-2">
                <svg className="w-5 h-5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <line x1="12" y1="5" x2="12" y2="19" />
                  <line x1="5" y1="12" x2="19" y2="12" />
                </svg>
                <div>
                  <p className="text-sm text-muted-foreground">Taxa Recuperação</p>
                  <p className="text-xl font-bold text-green-600">78%</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle>Cobranças Ativas</CardTitle>
                <CardDescription>Segurados com pagamentos em atraso</CardDescription>
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
                <Input placeholder="Buscar cobrança..." className="pl-10 w-64" />
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {cobrancas.map((cobranca) => (
                <div
                  key={cobranca.id}
                  className="flex items-center justify-between p-4 border rounded-lg hover:bg-muted/50 transition-colors"
                >
                  <div className="flex items-center gap-4">
                    <svg className="w-8 h-8 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path d="m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.607 10.607Z" />
                    </svg>
                    <div>
                      <h3 className="font-medium text-foreground">{cobranca.id}</h3>
                      <p className="text-sm text-muted-foreground">{cobranca.segurado}</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-6">
                    <div className="text-center">
                      <p className="text-sm font-medium text-foreground">{cobranca.valor}</p>
                      <p className="text-xs text-muted-foreground">Venc: {cobranca.vencimento}</p>
                    </div>

                    <div className="text-center">
                      <p className="text-sm font-medium text-red-600">{cobranca.diasAtraso} dias</p>
                      <p className="text-xs text-muted-foreground">{cobranca.tentativas} tentativas</p>
                    </div>

                    <Badge variant="destructive">{cobranca.status}</Badge>

                    <Button variant="outline" size="sm" onClick={() => handleCobrar(cobranca)}>
                      <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <line x1="22" y1="2" x2="11" y2="13" />
                        <polygon points="22,2 15,22 11,13 2,9 22,2" />
                      </svg>
                      Cobrar
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Dialog open={isCobrarOpen} onOpenChange={setIsCobrarOpen}>
          <DialogContent className="sm:max-w-[500px]">
            <DialogHeader>
              <DialogTitle>Enviar Cobrança</DialogTitle>
              <DialogDescription>
                Enviar cobrança para: {selectedCobranca?.segurado} - {selectedCobranca?.id}
              </DialogDescription>
            </DialogHeader>
            <form onSubmit={handleEnviarCobrancaIndividual}>
              <div className="grid gap-4 py-4">
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="canal" className="text-right">
                    Canal
                  </Label>
                  <Select name="canal" required>
                    <SelectTrigger className="col-span-3">
                      <SelectValue placeholder="Selecione o canal" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="email">E-mail</SelectItem>
                      <SelectItem value="sms">SMS</SelectItem>
                      <SelectItem value="whatsapp">WhatsApp</SelectItem>
                      <SelectItem value="carta">Carta Registrada</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="template" className="text-right">
                    Template
                  </Label>
                  <Select name="template" required>
                    <SelectTrigger className="col-span-3">
                      <SelectValue placeholder="Selecione o template" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="lembrete">Lembrete Amigável</SelectItem>
                      <SelectItem value="formal">Cobrança Formal</SelectItem>
                      <SelectItem value="urgente">Cobrança Urgente</SelectItem>
                      <SelectItem value="juridico">Aviso Jurídico</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="observacoes" className="text-right">
                    Observações
                  </Label>
                  <Textarea
                    id="observacoes"
                    name="observacoes"
                    placeholder="Observações adicionais..."
                    className="col-span-3"
                    rows={3}
                  />
                </div>
              </div>
              <DialogFooter>
                <Button type="submit">Enviar Cobrança</Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  )
}
