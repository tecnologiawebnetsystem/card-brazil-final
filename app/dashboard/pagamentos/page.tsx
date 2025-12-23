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
  DialogTrigger,
} from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"

export default function PagamentosPage() {
  const [isNovaCobrancaOpen, setIsNovaCobrancaOpen] = useState(false)
  const [isDetalhesOpen, setIsDetalhesOpen] = useState(false)
  const [selectedPagamento, setSelectedPagamento] = useState<any>(null)
  const [pagamentos, setPagamentos] = useState([
    {
      id: "PAG-2024-001",
      segurado: "João Silva",
      plano: "Premium",
      valor: "R$ 450,00",
      vencimento: "15/01/2024",
      status: "Pago",
      metodo: "Cartão de Crédito",
      dataPagamento: "14/01/2024",
    },
    {
      id: "PAG-2024-002",
      segurado: "Maria Santos",
      plano: "Básico",
      valor: "R$ 180,00",
      vencimento: "20/01/2024",
      status: "Pendente",
      metodo: "Boleto",
      dataPagamento: "-",
    },
    {
      id: "PAG-2024-003",
      segurado: "Carlos Oliveira",
      plano: "Intermediário",
      valor: "R$ 280,00",
      vencimento: "10/01/2024",
      status: "Atrasado",
      metodo: "Débito Automático",
      dataPagamento: "-",
    },
  ])

  const handleNovaCobranca = (e: React.FormEvent) => {
    e.preventDefault()
    const formData = new FormData(e.target as HTMLFormElement)
    const novaCobranca = {
      id: `PAG-2024-${String(pagamentos.length + 1).padStart(3, "0")}`,
      segurado: formData.get("segurado") as string,
      plano: formData.get("plano") as string,
      valor: formData.get("valor") as string,
      vencimento: formData.get("vencimento") as string,
      status: "Pendente",
      metodo: formData.get("metodo") as string,
      dataPagamento: "-",
    }
    setPagamentos([...pagamentos, novaCobranca])
    setIsNovaCobrancaOpen(false)
  }

  const handleVerDetalhes = (pagamento: any) => {
    setSelectedPagamento(pagamento)
    setIsDetalhesOpen(true)
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Pago":
        return "bg-green-50 text-green-700 border-green-200"
      case "Pendente":
        return "bg-yellow-50 text-yellow-700 border-yellow-200"
      case "Atrasado":
        return "bg-red-50 text-red-700 border-red-200"
      default:
        return "bg-gray-50 text-gray-700 border-gray-200"
    }
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-6 py-6">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-2xl font-bold text-foreground">Pagamentos</h1>
            <p className="text-muted-foreground">Controle de mensalidades e cobranças</p>
          </div>
          <div className="flex gap-2">
            <Button variant="outline">
              <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                />
              </svg>
              Exportar
            </Button>
            <Dialog open={isNovaCobrancaOpen} onOpenChange={setIsNovaCobrancaOpen}>
              <DialogTrigger asChild>
                <Button>
                  <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <rect x="1" y="4" width="22" height="16" rx="2" ry="2" />
                    <line x1="1" y1="10" x2="23" y2="10" />
                  </svg>
                  Nova Cobrança
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                  <DialogTitle>Nova Cobrança</DialogTitle>
                  <DialogDescription>Crie uma nova cobrança para um segurado</DialogDescription>
                </DialogHeader>
                <form onSubmit={handleNovaCobranca}>
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
                      <Label htmlFor="plano" className="text-right">
                        Plano
                      </Label>
                      <Select name="plano" required>
                        <SelectTrigger className="col-span-3">
                          <SelectValue placeholder="Selecione o plano" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="Básico">Básico</SelectItem>
                          <SelectItem value="Intermediário">Intermediário</SelectItem>
                          <SelectItem value="Premium">Premium</SelectItem>
                        </SelectContent>
                      </Select>
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
                      <Label htmlFor="metodo" className="text-right">
                        Método
                      </Label>
                      <Select name="metodo" required>
                        <SelectTrigger className="col-span-3">
                          <SelectValue placeholder="Método de pagamento" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="Boleto">Boleto</SelectItem>
                          <SelectItem value="Cartão de Crédito">Cartão de Crédito</SelectItem>
                          <SelectItem value="Débito Automático">Débito Automático</SelectItem>
                          <SelectItem value="PIX">PIX</SelectItem>
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
        </div>

        {/* Revenue Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-2">
                <svg className="w-5 h-5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <polyline points="23 6 13.5 15.5 8.5 10.5 1 18" />
                  <polyline points="17 6 23 6 23 12" />
                </svg>
                <div>
                  <p className="text-sm text-muted-foreground">Receita Mensal</p>
                  <p className="text-xl font-bold text-green-600">R$ 2.4M</p>
                </div>
              </div>
            </CardContent>
          </Card>
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
                  <p className="text-sm text-muted-foreground">Vencimentos Hoje</p>
                  <p className="text-xl font-bold text-blue-600">156</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-2">
                <svg className="w-5 h-5 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <circle cx="12" cy="12" r="10" />
                  <line x1="12" y1="8" x2="12" y2="12" />
                  <line x1="12" y1="16" x2="12.01" y2="16" />
                </svg>
                <div>
                  <p className="text-sm text-muted-foreground">Pendentes</p>
                  <p className="text-xl font-bold text-yellow-600">R$ 180K</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-2">
                <svg className="w-5 h-5 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <circle cx="12" cy="12" r="10" />
                  <line x1="12" y1="8" x2="12" y2="12" />
                  <line x1="12" y1="16" x2="12.01" y2="16" />
                </svg>
                <div>
                  <p className="text-sm text-muted-foreground">Em Atraso</p>
                  <p className="text-xl font-bold text-red-600">R$ 95K</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle>Controle de Pagamentos</CardTitle>
                <CardDescription>Acompanhe mensalidades e status de pagamento</CardDescription>
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
                  <Input placeholder="Buscar pagamento..." className="pl-10 w-64" />
                </div>
                <Select defaultValue="todos">
                  <SelectTrigger className="w-40">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="todos">Todos</SelectItem>
                    <SelectItem value="pago">Pagos</SelectItem>
                    <SelectItem value="pendente">Pendentes</SelectItem>
                    <SelectItem value="atrasado">Atrasados</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {pagamentos.map((pagamento) => (
                <div
                  key={pagamento.id}
                  className="flex items-center justify-between p-4 border rounded-lg hover:bg-muted/50 transition-colors"
                >
                  <div className="flex items-center gap-4">
                    <svg className="w-5 h-5 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <rect x="1" y="4" width="22" height="16" rx="2" ry="2" />
                      <line x1="1" y1="10" x2="23" y2="10" />
                    </svg>
                    <div>
                      <h3 className="font-medium text-foreground">{pagamento.id}</h3>
                      <p className="text-sm text-muted-foreground">{pagamento.segurado}</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-6">
                    <div className="text-center">
                      <p className="text-sm font-medium text-foreground">{pagamento.plano}</p>
                      <p className="text-xs text-muted-foreground">{pagamento.metodo}</p>
                    </div>

                    <div className="text-center">
                      <p className="text-sm font-medium text-foreground">{pagamento.valor}</p>
                      <p className="text-xs text-muted-foreground">Venc: {pagamento.vencimento}</p>
                    </div>

                    <div className="text-center">
                      <Badge className={getStatusColor(pagamento.status)}>{pagamento.status}</Badge>
                      {pagamento.dataPagamento !== "-" && (
                        <p className="text-xs text-muted-foreground mt-1">Pago: {pagamento.dataPagamento}</p>
                      )}
                    </div>

                    <Button variant="ghost" size="sm" onClick={() => handleVerDetalhes(pagamento)}>
                      Ver Detalhes
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Dialog open={isDetalhesOpen} onOpenChange={setIsDetalhesOpen}>
          <DialogContent className="sm:max-w-[500px]">
            <DialogHeader>
              <DialogTitle>Detalhes do Pagamento</DialogTitle>
              <DialogDescription>Informações completas sobre o pagamento</DialogDescription>
            </DialogHeader>
            {selectedPagamento && (
              <div className="grid gap-4 py-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label className="text-sm font-medium">ID do Pagamento</Label>
                    <p className="text-sm text-muted-foreground">{selectedPagamento.id}</p>
                  </div>
                  <div>
                    <Label className="text-sm font-medium">Status</Label>
                    <Badge className={getStatusColor(selectedPagamento.status)}>{selectedPagamento.status}</Badge>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label className="text-sm font-medium">Segurado</Label>
                    <p className="text-sm text-muted-foreground">{selectedPagamento.segurado}</p>
                  </div>
                  <div>
                    <Label className="text-sm font-medium">Plano</Label>
                    <p className="text-sm text-muted-foreground">{selectedPagamento.plano}</p>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label className="text-sm font-medium">Valor</Label>
                    <p className="text-sm text-muted-foreground">{selectedPagamento.valor}</p>
                  </div>
                  <div>
                    <Label className="text-sm font-medium">Método</Label>
                    <p className="text-sm text-muted-foreground">{selectedPagamento.metodo}</p>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label className="text-sm font-medium">Vencimento</Label>
                    <p className="text-sm text-muted-foreground">{selectedPagamento.vencimento}</p>
                  </div>
                  <div>
                    <Label className="text-sm font-medium">Data Pagamento</Label>
                    <p className="text-sm text-muted-foreground">{selectedPagamento.dataPagamento}</p>
                  </div>
                </div>
              </div>
            )}
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsDetalhesOpen(false)}>
                Fechar
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  )
}
