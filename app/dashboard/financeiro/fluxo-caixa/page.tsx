"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
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
import { Textarea } from "@/components/ui/textarea"
import { useToast } from "@/hooks/use-toast"
import {
  Search,
  TrendingUp,
  TrendingDown,
  DollarSign,
  ArrowUpCircle,
  ArrowDownCircle,
  Plus,
  Eye,
  Edit,
  Trash2,
  Download,
  FileText,
} from "lucide-react"
import { format } from "date-fns"
import { ptBR } from "date-fns/locale"

interface FluxoCaixa {
  id: number
  tipo: "entrada" | "saida"
  categoria: string
  descricao: string
  valor: number
  data_movimentacao: string
  status: "realizado" | "previsto"
  id_conta_receber?: number
  id_conta_pagar?: number
  observacoes?: string
}

export default function FluxoCaixaPage() {
  const [fluxoCaixa, setFluxoCaixa] = useState<FluxoCaixa[]>([])
  const [loading, setLoading] = useState(true)
  const [dialogOpen, setDialogOpen] = useState(false)
  const [viewDialogOpen, setViewDialogOpen] = useState(false)
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)
  const [editingFluxo, setEditingFluxo] = useState<FluxoCaixa | null>(null)
  const [viewingFluxo, setViewingFluxo] = useState<FluxoCaixa | null>(null)
  const [deletingId, setDeletingId] = useState<number | null>(null)
  const { toast } = useToast()

  const [filtros, setFiltros] = useState({
    tipo: "",
    status: "",
    categoria: "",
    busca: "",
    data_inicio: "",
    data_fim: "",
  })

  const [formData, setFormData] = useState({
    tipo: "entrada" as "entrada" | "saida",
    categoria: "",
    descricao: "",
    valor: "",
    data_movimentacao: "",
    status: "previsto" as "realizado" | "previsto",
    observacoes: "",
  })

  useEffect(() => {
    fetchFluxoCaixa()
  }, [filtros])

  const fetchFluxoCaixa = async () => {
    try {
      setLoading(true)
      const params = new URLSearchParams()
      if (filtros.tipo) params.append("tipo", filtros.tipo)
      if (filtros.status) params.append("status", filtros.status)
      if (filtros.categoria) params.append("categoria", filtros.categoria)
      if (filtros.busca) params.append("busca", filtros.busca)
      if (filtros.data_inicio) params.append("data_inicio", filtros.data_inicio)
      if (filtros.data_fim) params.append("data_fim", filtros.data_fim)

      const response = await fetch(`/api/financeiro/fluxo-caixa?${params}`)
      if (!response.ok) throw new Error("Erro ao carregar fluxo de caixa")

      const data = await response.json()
      setFluxoCaixa(data)
    } catch (error) {
      toast({
        title: "Erro",
        description: "Não foi possível carregar o fluxo de caixa",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    try {
      const url = editingFluxo ? `/api/financeiro/fluxo-caixa/${editingFluxo.id}` : "/api/financeiro/fluxo-caixa"

      const method = editingFluxo ? "PUT" : "POST"

      const response = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...formData,
          valor: Number.parseFloat(formData.valor),
        }),
      })

      if (!response.ok) throw new Error("Erro ao salvar movimentação")

      toast({
        title: "Sucesso",
        description: `Movimentação ${editingFluxo ? "atualizada" : "criada"} com sucesso`,
      })

      setDialogOpen(false)
      resetForm()
      fetchFluxoCaixa()
    } catch (error) {
      toast({
        title: "Erro",
        description: "Não foi possível salvar a movimentação",
        variant: "destructive",
      })
    }
  }

  const handleDelete = async () => {
    if (!deletingId) return

    try {
      const response = await fetch(`/api/financeiro/fluxo-caixa/${deletingId}`, {
        method: "DELETE",
      })

      if (!response.ok) throw new Error("Erro ao deletar movimentação")

      toast({
        title: "Sucesso",
        description: "Movimentação deletada com sucesso",
      })

      setDeleteDialogOpen(false)
      setDeletingId(null)
      fetchFluxoCaixa()
    } catch (error) {
      toast({
        title: "Erro",
        description: "Não foi possível deletar a movimentação",
        variant: "destructive",
      })
    }
  }

  const handleExport = () => {
    const csv = [
      ["Data", "Tipo", "Categoria", "Descrição", "Valor", "Status"],
      ...fluxoCaixa.map((f) => [f.data_movimentacao, f.tipo, f.categoria, f.descricao, f.valor, f.status]),
    ]
      .map((row) => row.join(","))
      .join("\n")

    const blob = new Blob([csv], { type: "text/csv" })
    const url = window.URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = `fluxo-caixa-${format(new Date(), "yyyy-MM-dd")}.csv`
    a.click()

    toast({
      title: "Sucesso",
      description: "Relatório exportado com sucesso",
    })
  }

  const resetForm = () => {
    setFormData({
      tipo: "entrada",
      categoria: "",
      descricao: "",
      valor: "",
      data_movimentacao: "",
      status: "previsto",
      observacoes: "",
    })
    setEditingFluxo(null)
  }

  const openEditDialog = (fluxo: FluxoCaixa) => {
    setEditingFluxo(fluxo)
    setFormData({
      tipo: fluxo.tipo,
      categoria: fluxo.categoria,
      descricao: fluxo.descricao,
      valor: fluxo.valor.toString(),
      data_movimentacao: fluxo.data_movimentacao,
      status: fluxo.status,
      observacoes: fluxo.observacoes || "",
    })
    setDialogOpen(true)
  }

  const getTipoIcon = (tipo: string) => {
    return tipo === "entrada" ? (
      <ArrowUpCircle className="h-4 w-4 text-green-500" />
    ) : (
      <ArrowDownCircle className="h-4 w-4 text-red-500" />
    )
  }

  const getTipoBadge = (tipo: string) => {
    return tipo === "entrada" ? (
      <Badge className="bg-green-100 text-green-800 hover:bg-green-100">Entrada</Badge>
    ) : (
      <Badge className="bg-red-100 text-red-800 hover:bg-red-100">Saída</Badge>
    )
  }

  const getStatusBadge = (status: string) => {
    return status === "realizado" ? (
      <Badge className="bg-blue-100 text-blue-800 hover:bg-blue-100">Realizado</Badge>
    ) : (
      <Badge className="bg-yellow-100 text-yellow-800 hover:bg-yellow-100">Previsto</Badge>
    )
  }

  const totalEntradas = fluxoCaixa.filter((f) => f.tipo === "entrada").reduce((acc, f) => acc + f.valor, 0)
  const totalSaidas = fluxoCaixa.filter((f) => f.tipo === "saida").reduce((acc, f) => acc + f.valor, 0)
  const saldoLiquido = totalEntradas - totalSaidas
  const entradasRealizadas = fluxoCaixa
    .filter((f) => f.tipo === "entrada" && f.status === "realizado")
    .reduce((acc, f) => acc + f.valor, 0)
  const saidasRealizadas = fluxoCaixa
    .filter((f) => f.tipo === "saida" && f.status === "realizado")
    .reduce((acc, f) => acc + f.valor, 0)

  return (
    <div className="flex-1 space-y-6 p-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Fluxo de Caixa</h1>
          <p className="text-muted-foreground">Controle integrado de entradas e saídas financeiras</p>
        </div>
        <Button
          className="bg-blue-600 hover:bg-blue-700"
          onClick={() => {
            resetForm()
            setDialogOpen(true)
          }}
        >
          <Plus className="mr-2 h-4 w-4" />
          Nova Movimentação
        </Button>
      </div>

      {/* Métricas */}
      <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
        <Card className="bg-emerald-700 text-white border-0">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Saldo Líquido</CardTitle>
            <DollarSign className="h-4 w-4 bg-emerald-600 p-1 rounded" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              R$ {saldoLiquido.toLocaleString("pt-BR", { minimumFractionDigits: 2 })}
            </div>
            <p className="text-xs text-emerald-100">entradas - saídas</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Entradas</CardTitle>
            <TrendingUp className="h-4 w-4 text-green-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">
              R$ {totalEntradas.toLocaleString("pt-BR", { minimumFractionDigits: 2 })}
            </div>
            <p className="text-xs text-muted-foreground">receitas do período</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Saídas</CardTitle>
            <TrendingDown className="h-4 w-4 text-red-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-600">
              R$ {totalSaidas.toLocaleString("pt-BR", { minimumFractionDigits: 2 })}
            </div>
            <p className="text-xs text-muted-foreground">despesas do período</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Entradas Realizadas</CardTitle>
            <ArrowUpCircle className="h-4 w-4 text-green-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">
              R$ {entradasRealizadas.toLocaleString("pt-BR", { minimumFractionDigits: 2 })}
            </div>
            <p className="text-xs text-muted-foreground">já recebidas</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Saídas Realizadas</CardTitle>
            <ArrowDownCircle className="h-4 w-4 text-red-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-600">
              R$ {saidasRealizadas.toLocaleString("pt-BR", { minimumFractionDigits: 2 })}
            </div>
            <p className="text-xs text-muted-foreground">já pagas</p>
          </CardContent>
        </Card>
      </div>

      {/* Filtros */}
      <Card>
        <CardHeader>
          <CardTitle>Filtros</CardTitle>
          <CardDescription>Filtre as movimentações por período, tipo, status e categoria</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-6 gap-4">
            <div className="space-y-2">
              <Label htmlFor="busca">Buscar</Label>
              <div className="relative">
                <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  id="busca"
                  placeholder="Descrição..."
                  value={filtros.busca}
                  onChange={(e) => setFiltros({ ...filtros, busca: e.target.value })}
                  className="pl-8"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label>Tipo</Label>
              <Select value={filtros.tipo} onValueChange={(value) => setFiltros({ ...filtros, tipo: value })}>
                <SelectTrigger>
                  <SelectValue placeholder="Todos" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todos</SelectItem>
                  <SelectItem value="entrada">Entrada</SelectItem>
                  <SelectItem value="saida">Saída</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label>Status</Label>
              <Select value={filtros.status} onValueChange={(value) => setFiltros({ ...filtros, status: value })}>
                <SelectTrigger>
                  <SelectValue placeholder="Todos" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todos</SelectItem>
                  <SelectItem value="realizado">Realizado</SelectItem>
                  <SelectItem value="previsto">Previsto</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label>Categoria</Label>
              <Select value={filtros.categoria} onValueChange={(value) => setFiltros({ ...filtros, categoria: value })}>
                <SelectTrigger>
                  <SelectValue placeholder="Todas" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todas</SelectItem>
                  <SelectItem value="mensalidade">Mensalidade</SelectItem>
                  <SelectItem value="cobranca">Cobrança</SelectItem>
                  <SelectItem value="fornecedor">Fornecedor</SelectItem>
                  <SelectItem value="restituicao">Restituição</SelectItem>
                  <SelectItem value="imposto">Imposto</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label>Data Início</Label>
              <Input
                type="date"
                value={filtros.data_inicio}
                onChange={(e) => setFiltros({ ...filtros, data_inicio: e.target.value })}
              />
            </div>

            <div className="space-y-2">
              <Label>Data Fim</Label>
              <Input
                type="date"
                value={filtros.data_fim}
                onChange={(e) => setFiltros({ ...filtros, data_fim: e.target.value })}
              />
            </div>
          </div>
          <div className="flex gap-4 mt-4">
            <Button onClick={() => fetchFluxoCaixa()}>
              <Search className="mr-2 h-4 w-4" />
              Aplicar Filtros
            </Button>
            <Button
              variant="outline"
              onClick={() => {
                setFiltros({ tipo: "", status: "", categoria: "", busca: "", data_inicio: "", data_fim: "" })
              }}
            >
              Limpar Filtros
            </Button>
            <Button variant="outline" onClick={handleExport}>
              <Download className="mr-2 h-4 w-4" />
              Exportar Relatório
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Lista do Fluxo de Caixa */}
      <Card>
        <CardHeader>
          <CardTitle>Movimentações ({fluxoCaixa.length})</CardTitle>
          <CardDescription>Movimentações integradas com Contas a Receber, Contas a Pagar e Cobrança</CardDescription>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="flex items-center justify-center py-8">
              <div className="text-muted-foreground">Carregando...</div>
            </div>
          ) : fluxoCaixa.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-8 text-center">
              <FileText className="h-12 w-12 text-muted-foreground mb-4" />
              <p className="text-muted-foreground">Nenhuma movimentação encontrada</p>
            </div>
          ) : (
            <div className="space-y-4">
              {fluxoCaixa.map((item) => (
                <div
                  key={item.id}
                  className="flex items-center justify-between p-4 border rounded-lg hover:bg-muted/50 transition-colors"
                >
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      {getTipoIcon(item.tipo)}
                      <h3 className="font-semibold">{item.descricao}</h3>
                      {getTipoBadge(item.tipo)}
                      {getStatusBadge(item.status)}
                      <Badge variant="outline" className="capitalize">
                        {item.categoria}
                      </Badge>
                      {item.id_conta_receber && (
                        <Badge variant="outline" className="bg-green-50">
                          Conta a Receber
                        </Badge>
                      )}
                      {item.id_conta_pagar && (
                        <Badge variant="outline" className="bg-red-50">
                          Conta a Pagar
                        </Badge>
                      )}
                    </div>
                    <div className="flex items-center gap-6 text-sm text-muted-foreground">
                      <p>
                        <strong>Data:</strong>{" "}
                        {format(new Date(item.data_movimentacao), "dd/MM/yyyy", { locale: ptBR })}
                      </p>
                      <p>
                        <strong>Valor:</strong>
                        <span
                          className={
                            item.tipo === "entrada"
                              ? "text-green-600 font-semibold ml-1"
                              : "text-red-600 font-semibold ml-1"
                          }
                        >
                          {item.tipo === "entrada" ? "+" : "-"}R${" "}
                          {item.valor.toLocaleString("pt-BR", { minimumFractionDigits: 2 })}
                        </span>
                      </p>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => {
                        setViewingFluxo(item)
                        setViewDialogOpen(true)
                      }}
                    >
                      <Eye className="h-4 w-4" />
                    </Button>
                    <Button variant="ghost" size="sm" onClick={() => openEditDialog(item)}>
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="text-red-600 hover:text-red-700"
                      onClick={() => {
                        setDeletingId(item.id)
                        setDeleteDialogOpen(true)
                      }}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>{editingFluxo ? "Editar Movimentação" : "Nova Movimentação"}</DialogTitle>
            <DialogDescription>Registre uma movimentação de entrada ou saída no fluxo de caixa</DialogDescription>
          </DialogHeader>
          <form onSubmit={handleSubmit}>
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="grid gap-2">
                  <Label htmlFor="tipo">Tipo *</Label>
                  <Select
                    value={formData.tipo}
                    onValueChange={(value: "entrada" | "saida") => setFormData({ ...formData, tipo: value })}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="entrada">Entrada</SelectItem>
                      <SelectItem value="saida">Saída</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="status">Status *</Label>
                  <Select
                    value={formData.status}
                    onValueChange={(value: "realizado" | "previsto") => setFormData({ ...formData, status: value })}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="realizado">Realizado</SelectItem>
                      <SelectItem value="previsto">Previsto</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
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
                      <SelectValue placeholder="Selecione" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="mensalidade">Mensalidade</SelectItem>
                      <SelectItem value="cobranca">Cobrança</SelectItem>
                      <SelectItem value="fornecedor">Fornecedor</SelectItem>
                      <SelectItem value="restituicao">Restituição</SelectItem>
                      <SelectItem value="imposto">Imposto</SelectItem>
                      <SelectItem value="taxa">Taxa</SelectItem>
                      <SelectItem value="salario">Salário</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="valor">Valor *</Label>
                  <Input
                    id="valor"
                    type="number"
                    step="0.01"
                    value={formData.valor}
                    onChange={(e) => setFormData({ ...formData, valor: e.target.value })}
                    required
                  />
                </div>
              </div>
              <div className="grid gap-2">
                <Label htmlFor="data_movimentacao">Data da Movimentação *</Label>
                <Input
                  id="data_movimentacao"
                  type="date"
                  value={formData.data_movimentacao}
                  onChange={(e) => setFormData({ ...formData, data_movimentacao: e.target.value })}
                  required
                />
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
              <Button type="submit">{editingFluxo ? "Atualizar" : "Criar"} Movimentação</Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      <Dialog open={viewDialogOpen} onOpenChange={setViewDialogOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Detalhes da Movimentação</DialogTitle>
          </DialogHeader>
          {viewingFluxo && (
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label className="text-muted-foreground">Tipo</Label>
                  <div className="mt-1">{getTipoBadge(viewingFluxo.tipo)}</div>
                </div>
                <div>
                  <Label className="text-muted-foreground">Status</Label>
                  <div className="mt-1">{getStatusBadge(viewingFluxo.status)}</div>
                </div>
              </div>
              <div>
                <Label className="text-muted-foreground">Descrição</Label>
                <p className="font-medium">{viewingFluxo.descricao}</p>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label className="text-muted-foreground">Categoria</Label>
                  <p className="font-medium capitalize">{viewingFluxo.categoria}</p>
                </div>
                <div>
                  <Label className="text-muted-foreground">Valor</Label>
                  <p
                    className={`font-medium text-lg ${viewingFluxo.tipo === "entrada" ? "text-green-600" : "text-red-600"}`}
                  >
                    {viewingFluxo.tipo === "entrada" ? "+" : "-"}R${" "}
                    {viewingFluxo.valor.toLocaleString("pt-BR", { minimumFractionDigits: 2 })}
                  </p>
                </div>
              </div>
              <div>
                <Label className="text-muted-foreground">Data da Movimentação</Label>
                <p className="font-medium">
                  {format(new Date(viewingFluxo.data_movimentacao), "dd/MM/yyyy", { locale: ptBR })}
                </p>
              </div>
              {viewingFluxo.id_conta_receber && (
                <div>
                  <Label className="text-muted-foreground">Vinculado a</Label>
                  <Badge className="bg-green-100 text-green-800">
                    Conta a Receber #{viewingFluxo.id_conta_receber}
                  </Badge>
                </div>
              )}
              {viewingFluxo.id_conta_pagar && (
                <div>
                  <Label className="text-muted-foreground">Vinculado a</Label>
                  <Badge className="bg-red-100 text-red-800">Conta a Pagar #{viewingFluxo.id_conta_pagar}</Badge>
                </div>
              )}
              {viewingFluxo.observacoes && (
                <div>
                  <Label className="text-muted-foreground">Observações</Label>
                  <p className="font-medium">{viewingFluxo.observacoes}</p>
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
              Tem certeza que deseja excluir esta movimentação? Esta ação não pode ser desfeita.
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
