"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Textarea } from "@/components/ui/textarea"
import { useToast } from "@/hooks/use-toast"
import { format } from "date-fns"
import { ptBR } from "date-fns/locale"
import {
  Search,
  Download,
  Plus,
  Eye,
  Edit,
  Trash2,
  DollarSign,
  Clock,
  CheckCircle,
  AlertTriangle,
  FileText,
} from "lucide-react"

interface ContaReceber {
  id: number
  id_beneficiario?: number
  id_proposta?: number
  descricao: string
  categoria: string
  valor_original: number
  valor_pago: number
  valor_pendente: number
  data_vencimento: string
  data_pagamento?: string
  status: string
  forma_pagamento?: string
  numero_documento?: string
  observacoes?: string
  beneficiario_nome?: string
  proposta_numero?: string
}

export default function ContasReceberPage() {
  const [contas, setContas] = useState<ContaReceber[]>([])
  const [loading, setLoading] = useState(true)
  const [dialogOpen, setDialogOpen] = useState(false)
  const [viewDialogOpen, setViewDialogOpen] = useState(false)
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)
  const [editingConta, setEditingConta] = useState<ContaReceber | null>(null)
  const [viewingConta, setViewingConta] = useState<ContaReceber | null>(null)
  const [deletingId, setDeletingId] = useState<number | null>(null)
  const { toast } = useToast()

  const [filtros, setFiltros] = useState({
    status: "",
    categoria: "",
    busca: "",
  })

  const [formData, setFormData] = useState({
    descricao: "",
    categoria: "mensalidade",
    valor_original: "",
    data_vencimento: "",
    numero_documento: "",
    observacoes: "",
  })

  useEffect(() => {
    fetchContas()
  }, [filtros])

  const fetchContas = async () => {
    try {
      setLoading(true)
      const params = new URLSearchParams()
      if (filtros.status) params.append("status", filtros.status)
      if (filtros.categoria) params.append("categoria", filtros.categoria)
      if (filtros.busca) params.append("busca", filtros.busca)

      const response = await fetch(`/api/financeiro/contas-receber?${params}`)
      if (!response.ok) throw new Error("Erro ao carregar contas")

      const data = await response.json()
      setContas(data)
    } catch (error) {
      toast({
        title: "Erro",
        description: "Não foi possível carregar as contas a receber",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    try {
      const url = editingConta ? `/api/financeiro/contas-receber/${editingConta.id}` : "/api/financeiro/contas-receber"

      const method = editingConta ? "PUT" : "POST"

      const response = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...formData,
          valor_original: Number.parseFloat(formData.valor_original),
        }),
      })

      if (!response.ok) throw new Error("Erro ao salvar conta")

      toast({
        title: "Sucesso",
        description: `Conta ${editingConta ? "atualizada" : "criada"} com sucesso`,
      })

      setDialogOpen(false)
      resetForm()
      fetchContas()
    } catch (error) {
      toast({
        title: "Erro",
        description: "Não foi possível salvar a conta",
        variant: "destructive",
      })
    }
  }

  const handleDelete = async () => {
    if (!deletingId) return

    try {
      const response = await fetch(`/api/financeiro/contas-receber/${deletingId}`, {
        method: "DELETE",
      })

      if (!response.ok) throw new Error("Erro ao deletar conta")

      toast({
        title: "Sucesso",
        description: "Conta deletada com sucesso",
      })

      setDeleteDialogOpen(false)
      setDeletingId(null)
      fetchContas()
    } catch (error) {
      toast({
        title: "Erro",
        description: "Não foi possível deletar a conta",
        variant: "destructive",
      })
    }
  }

  const handleExport = () => {
    const csv = [
      ["Descrição", "Categoria", "Valor Original", "Valor Pago", "Valor Pendente", "Vencimento", "Status"],
      ...contas.map((c) => [
        c.descricao,
        c.categoria,
        c.valor_original,
        c.valor_pago,
        c.valor_pendente,
        c.data_vencimento,
        c.status,
      ]),
    ]
      .map((row) => row.join(","))
      .join("\n")

    const blob = new Blob([csv], { type: "text/csv" })
    const url = window.URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = `contas-receber-${format(new Date(), "yyyy-MM-dd")}.csv`
    a.click()

    toast({
      title: "Sucesso",
      description: "Relatório exportado com sucesso",
    })
  }

  const resetForm = () => {
    setFormData({
      descricao: "",
      categoria: "mensalidade",
      valor_original: "",
      data_vencimento: "",
      numero_documento: "",
      observacoes: "",
    })
    setEditingConta(null)
  }

  const openEditDialog = (conta: ContaReceber) => {
    setEditingConta(conta)
    setFormData({
      descricao: conta.descricao,
      categoria: conta.categoria,
      valor_original: conta.valor_original.toString(),
      data_vencimento: conta.data_vencimento,
      numero_documento: conta.numero_documento || "",
      observacoes: conta.observacoes || "",
    })
    setDialogOpen(true)
  }

  const getStatusBadge = (status: string) => {
    const badges = {
      pago: <Badge className="bg-green-100 text-green-800 hover:bg-green-100">Pago</Badge>,
      pendente: <Badge className="bg-yellow-100 text-yellow-800 hover:bg-yellow-100">Pendente</Badge>,
      vencido: <Badge className="bg-red-100 text-red-800 hover:bg-red-100">Vencido</Badge>,
      parcial: <Badge className="bg-blue-100 text-blue-800 hover:bg-blue-100">Parcial</Badge>,
      cancelado: <Badge className="bg-gray-100 text-gray-800 hover:bg-gray-100">Cancelado</Badge>,
    }
    return badges[status as keyof typeof badges] || badges.pendente
  }

  const totalPendente = contas.filter((c) => c.status === "pendente").reduce((sum, c) => sum + c.valor_pendente, 0)
  const totalVencido = contas.filter((c) => c.status === "vencido").reduce((sum, c) => sum + c.valor_pendente, 0)
  const totalRecebido = contas.filter((c) => c.status === "pago").reduce((sum, c) => sum + c.valor_pago, 0)
  const totalParcial = contas.filter((c) => c.status === "parcial").reduce((sum, c) => sum + c.valor_pago, 0)

  return (
    <div className="flex-1 space-y-6 p-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Contas a Receber</h1>
          <p className="text-muted-foreground">Gerencie suas contas a receber e acompanhe pagamentos</p>
        </div>
        <Button
          className="bg-blue-600 hover:bg-blue-700"
          onClick={() => {
            resetForm()
            setDialogOpen(true)
          }}
        >
          <Plus className="mr-2 h-4 w-4" />
          Nova Conta
        </Button>
      </div>

      {/* Cards de Resumo */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total a Receber</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              R$ {(totalPendente + totalVencido).toLocaleString("pt-BR", { minimumFractionDigits: 2 })}
            </div>
            <p className="text-xs text-muted-foreground">Pendente + Vencido</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Pendente</CardTitle>
            <Clock className="h-4 w-4 text-yellow-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-yellow-600">
              R$ {totalPendente.toLocaleString("pt-BR", { minimumFractionDigits: 2 })}
            </div>
            <p className="text-xs text-muted-foreground">
              {contas.filter((c) => c.status === "pendente").length} contas
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Vencido</CardTitle>
            <AlertTriangle className="h-4 w-4 text-red-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-600">
              R$ {totalVencido.toLocaleString("pt-BR", { minimumFractionDigits: 2 })}
            </div>
            <p className="text-xs text-muted-foreground">
              {contas.filter((c) => c.status === "vencido").length} contas
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Recebido</CardTitle>
            <CheckCircle className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">
              R$ {totalRecebido.toLocaleString("pt-BR", { minimumFractionDigits: 2 })}
            </div>
            <p className="text-xs text-muted-foreground">{contas.filter((c) => c.status === "pago").length} contas</p>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="lista" className="space-y-4">
        <TabsList>
          <TabsTrigger value="lista">Lista de Contas</TabsTrigger>
          <TabsTrigger value="filtros">Filtros Avançados</TabsTrigger>
          <TabsTrigger value="relatorios">Relatórios</TabsTrigger>
        </TabsList>

        <TabsContent value="lista" className="space-y-4">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle>Contas a Receber</CardTitle>
                  <CardDescription>Lista completa de contas a receber</CardDescription>
                </div>
                <div className="flex gap-2">
                  <Button variant="outline" size="sm" onClick={handleExport}>
                    <Download className="mr-2 h-4 w-4" />
                    Exportar
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              {loading ? (
                <div className="flex items-center justify-center py-8">
                  <div className="text-muted-foreground">Carregando...</div>
                </div>
              ) : contas.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-8 text-center">
                  <FileText className="h-12 w-12 text-muted-foreground mb-4" />
                  <p className="text-muted-foreground">Nenhuma conta encontrada</p>
                </div>
              ) : (
                <div className="rounded-md border">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b bg-muted/50">
                        <th className="h-12 px-4 text-left align-middle font-medium">Descrição</th>
                        <th className="h-12 px-4 text-left align-middle font-medium">Categoria</th>
                        <th className="h-12 px-4 text-left align-middle font-medium">Valor Original</th>
                        <th className="h-12 px-4 text-left align-middle font-medium">Valor Pago</th>
                        <th className="h-12 px-4 text-left align-middle font-medium">Vencimento</th>
                        <th className="h-12 px-4 text-left align-middle font-medium">Status</th>
                        <th className="h-12 px-4 text-left align-middle font-medium">Ações</th>
                      </tr>
                    </thead>
                    <tbody>
                      {contas.map((conta) => (
                        <tr key={conta.id} className="border-b">
                          <td className="h-12 px-4 align-middle">{conta.descricao}</td>
                          <td className="h-12 px-4 align-middle capitalize">{conta.categoria}</td>
                          <td className="h-12 px-4 align-middle font-medium">
                            R$ {conta.valor_original.toLocaleString("pt-BR", { minimumFractionDigits: 2 })}
                          </td>
                          <td className="h-12 px-4 align-middle font-medium text-green-600">
                            R$ {conta.valor_pago.toLocaleString("pt-BR", { minimumFractionDigits: 2 })}
                          </td>
                          <td className="h-12 px-4 align-middle">
                            {format(new Date(conta.data_vencimento), "dd/MM/yyyy", { locale: ptBR })}
                          </td>
                          <td className="h-12 px-4 align-middle">{getStatusBadge(conta.status)}</td>
                          <td className="h-12 px-4 align-middle">
                            <div className="flex gap-2">
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => {
                                  setViewingConta(conta)
                                  setViewDialogOpen(true)
                                }}
                              >
                                <Eye className="h-4 w-4" />
                              </Button>
                              <Button variant="ghost" size="sm" onClick={() => openEditDialog(conta)}>
                                <Edit className="h-4 w-4" />
                              </Button>
                              <Button
                                variant="ghost"
                                size="sm"
                                className="text-red-600 hover:text-red-700"
                                onClick={() => {
                                  setDeletingId(conta.id)
                                  setDeleteDialogOpen(true)
                                }}
                              >
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="filtros" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Filtros Avançados</CardTitle>
              <CardDescription>Configure filtros personalizados para suas consultas</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid gap-4 md:grid-cols-3">
                <div className="space-y-2">
                  <Label htmlFor="busca">Buscar</Label>
                  <Input
                    id="busca"
                    placeholder="Descrição ou documento"
                    value={filtros.busca}
                    onChange={(e) => setFiltros({ ...filtros, busca: e.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="status">Status</Label>
                  <Select value={filtros.status} onValueChange={(value) => setFiltros({ ...filtros, status: value })}>
                    <SelectTrigger>
                      <SelectValue placeholder="Selecione o status" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">Todos</SelectItem>
                      <SelectItem value="pendente">Pendente</SelectItem>
                      <SelectItem value="pago">Pago</SelectItem>
                      <SelectItem value="vencido">Vencido</SelectItem>
                      <SelectItem value="parcial">Parcial</SelectItem>
                      <SelectItem value="cancelado">Cancelado</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="categoria">Categoria</Label>
                  <Select
                    value={filtros.categoria}
                    onValueChange={(value) => setFiltros({ ...filtros, categoria: value })}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Selecione a categoria" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">Todas</SelectItem>
                      <SelectItem value="mensalidade">Mensalidade</SelectItem>
                      <SelectItem value="adesao">Adesão</SelectItem>
                      <SelectItem value="coparticipacao">Coparticipação</SelectItem>
                      <SelectItem value="restituicao">Restituição</SelectItem>
                      <SelectItem value="reembolso">Reembolso</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div className="flex gap-4">
                <Button onClick={() => fetchContas()}>
                  <Search className="mr-2 h-4 w-4" />
                  Aplicar Filtros
                </Button>
                <Button
                  variant="outline"
                  onClick={() => {
                    setFiltros({ status: "", categoria: "", busca: "" })
                  }}
                >
                  Limpar Filtros
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="relatorios" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Relatórios de Contas a Receber</CardTitle>
              <CardDescription>Gere relatórios detalhados sobre suas contas a receber</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid gap-4 md:grid-cols-2">
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">Relatório de Inadimplência</CardTitle>
                    <CardDescription>Contas vencidas e em atraso</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <Button className="w-full" onClick={handleExport}>
                      <Download className="mr-2 h-4 w-4" />
                      Gerar Relatório
                    </Button>
                  </CardContent>
                </Card>
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">Fluxo de Recebimentos</CardTitle>
                    <CardDescription>Previsão de recebimentos por período</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <Button className="w-full" onClick={handleExport}>
                      <Download className="mr-2 h-4 w-4" />
                      Gerar Relatório
                    </Button>
                  </CardContent>
                </Card>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>{editingConta ? "Editar Conta" : "Nova Conta a Receber"}</DialogTitle>
            <DialogDescription>Preencha os dados da conta a receber</DialogDescription>
          </DialogHeader>
          <form onSubmit={handleSubmit}>
            <div className="grid gap-4 py-4">
              <div className="grid gap-2">
                <Label htmlFor="descricao">Descrição *</Label>
                <Input
                  id="descricao"
                  value={formData.descricao}
                  onChange={(e) => setFormData({ ...formData, descricao: e.target.value })}
                  required
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="grid gap-2">
                  <Label htmlFor="categoria">Categoria *</Label>
                  <Select
                    value={formData.categoria}
                    onValueChange={(value) => setFormData({ ...formData, categoria: value })}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="mensalidade">Mensalidade</SelectItem>
                      <SelectItem value="adesao">Adesão</SelectItem>
                      <SelectItem value="coparticipacao">Coparticipação</SelectItem>
                      <SelectItem value="restituicao">Restituição</SelectItem>
                      <SelectItem value="reembolso">Reembolso</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="valor_original">Valor *</Label>
                  <Input
                    id="valor_original"
                    type="number"
                    step="0.01"
                    value={formData.valor_original}
                    onChange={(e) => setFormData({ ...formData, valor_original: e.target.value })}
                    required
                  />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="grid gap-2">
                  <Label htmlFor="data_vencimento">Data de Vencimento *</Label>
                  <Input
                    id="data_vencimento"
                    type="date"
                    value={formData.data_vencimento}
                    onChange={(e) => setFormData({ ...formData, data_vencimento: e.target.value })}
                    required
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="numero_documento">Número do Documento</Label>
                  <Input
                    id="numero_documento"
                    value={formData.numero_documento}
                    onChange={(e) => setFormData({ ...formData, numero_documento: e.target.value })}
                  />
                </div>
              </div>
              <div className="grid gap-2">
                <Label htmlFor="observacoes">Observações</Label>
                <Textarea
                  id="observacoes"
                  value={formData.observacoes}
                  onChange={(e) => setFormData({ ...formData, observacoes: e.target.value })}
                  rows={3}
                />
              </div>
            </div>
            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => setDialogOpen(false)}>
                Cancelar
              </Button>
              <Button type="submit">{editingConta ? "Atualizar" : "Criar"} Conta</Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      <Dialog open={viewDialogOpen} onOpenChange={setViewDialogOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Detalhes da Conta</DialogTitle>
          </DialogHeader>
          {viewingConta && (
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label className="text-muted-foreground">Descrição</Label>
                  <p className="font-medium">{viewingConta.descricao}</p>
                </div>
                <div>
                  <Label className="text-muted-foreground">Categoria</Label>
                  <p className="font-medium capitalize">{viewingConta.categoria}</p>
                </div>
              </div>
              <div className="grid grid-cols-3 gap-4">
                <div>
                  <Label className="text-muted-foreground">Valor Original</Label>
                  <p className="font-medium">
                    R$ {viewingConta.valor_original.toLocaleString("pt-BR", { minimumFractionDigits: 2 })}
                  </p>
                </div>
                <div>
                  <Label className="text-muted-foreground">Valor Pago</Label>
                  <p className="font-medium text-green-600">
                    R$ {viewingConta.valor_pago.toLocaleString("pt-BR", { minimumFractionDigits: 2 })}
                  </p>
                </div>
                <div>
                  <Label className="text-muted-foreground">Valor Pendente</Label>
                  <p className="font-medium text-red-600">
                    R$ {viewingConta.valor_pendente.toLocaleString("pt-BR", { minimumFractionDigits: 2 })}
                  </p>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label className="text-muted-foreground">Data de Vencimento</Label>
                  <p className="font-medium">
                    {format(new Date(viewingConta.data_vencimento), "dd/MM/yyyy", { locale: ptBR })}
                  </p>
                </div>
                <div>
                  <Label className="text-muted-foreground">Status</Label>
                  <div className="mt-1">{getStatusBadge(viewingConta.status)}</div>
                </div>
              </div>
              {viewingConta.numero_documento && (
                <div>
                  <Label className="text-muted-foreground">Número do Documento</Label>
                  <p className="font-medium">{viewingConta.numero_documento}</p>
                </div>
              )}
              {viewingConta.observacoes && (
                <div>
                  <Label className="text-muted-foreground">Observações</Label>
                  <p className="font-medium">{viewingConta.observacoes}</p>
                </div>
              )}
            </div>
          )}
          <DialogFooter>
            <Button onClick={() => setViewDialogOpen(false)}>Fechar</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Confirmar Exclusão</DialogTitle>
            <DialogDescription>
              Tem certeza que deseja excluir esta conta? Esta ação não pode ser desfeita.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDeleteDialogOpen(false)}>
              Cancelar
            </Button>
            <Button variant="destructive" onClick={handleDelete}>
              Excluir
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
