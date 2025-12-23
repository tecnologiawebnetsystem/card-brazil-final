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
  Plus,
  Eye,
  Edit,
  Trash2,
  FileText,
  Scale,
  UserCheck,
  AlertCircle,
  CheckCircle,
  Clock,
  XCircle,
  Download,
  Gavel,
} from "lucide-react"

interface ProcessoJudicial {
  id: number
  numero_processo: string
  id_beneficiario: number
  beneficiario_nome?: string
  id_advogado: number
  advogado_nome?: string
  id_tribunal: number
  tribunal_nome?: string
  valor_causa: number
  data_abertura: string
  data_encerramento?: string
  status: string
  fase_processual: string
  observacoes?: string
}

interface Advogado {
  id: number
  nome: string
  oab: string
  email: string
  telefone: string
}

interface Tribunal {
  id: number
  nome: string
  cidade: string
  uf: string
  tipo: string
}

export default function CobrancaJudicialPage() {
  const [processos, setProcessos] = useState<ProcessoJudicial[]>([])
  const [advogados, setAdvogados] = useState<Advogado[]>([])
  const [tribunais, setTribunais] = useState<Tribunal[]>([])
  const [loading, setLoading] = useState(true)
  const [dialogOpen, setDialogOpen] = useState(false)
  const [viewDialogOpen, setViewDialogOpen] = useState(false)
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)
  const [advogadoDialogOpen, setAdvogadoDialogOpen] = useState(false)
  const [editingProcesso, setEditingProcesso] = useState<ProcessoJudicial | null>(null)
  const [viewingProcesso, setViewingProcesso] = useState<ProcessoJudicial | null>(null)
  const [deletingId, setDeletingId] = useState<number | null>(null)
  const { toast } = useToast()

  const [filtros, setFiltros] = useState({
    status: "",
    fase: "",
    busca: "",
    advogado: "",
  })

  const [formData, setFormData] = useState({
    numero_processo: "",
    id_beneficiario: "",
    id_advogado: "",
    id_tribunal: "",
    tribunal_manual: "",
    valor_causa: "",
    data_abertura: "",
    fase_processual: "inicial",
    observacoes: "",
  })

  const [advogadoFormData, setAdvogadoFormData] = useState({
    nome: "",
    oab: "",
    email: "",
    telefone: "",
  })

  const [beneficiarioBusca, setBeneficiarioBusca] = useState("")
  const [beneficiariosEncontrados, setBeneficiariosEncontrados] = useState<any[]>([])
  const [tribunalBusca, setTribunalBusca] = useState("")
  const [usarTribunalManual, setUsarTribunalManual] = useState(false)

  useEffect(() => {
    fetchProcessos()
    fetchAdvogados()
    fetchTribunais()
  }, [filtros])

  const fetchProcessos = async () => {
    try {
      setLoading(true)
      const params = new URLSearchParams()
      if (filtros.status) params.append("status", filtros.status)
      if (filtros.fase) params.append("fase", filtros.fase)
      if (filtros.busca) params.append("busca", filtros.busca)
      if (filtros.advogado) params.append("advogado", filtros.advogado)

      const response = await fetch(`/api/financeiro/processos-judiciais?${params}`)
      if (!response.ok) throw new Error("Erro ao carregar processos")

      const data = await response.json()
      setProcessos(data)
    } catch (error) {
      toast({
        title: "Erro",
        description: "Não foi possível carregar os processos judiciais",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  const fetchAdvogados = async () => {
    try {
      const response = await fetch("/api/financeiro/advogados")
      if (!response.ok) throw new Error("Erro ao carregar advogados")
      const data = await response.json()
      setAdvogados(data)
    } catch (error) {
      console.error("Erro ao carregar advogados:", error)
    }
  }

  const fetchTribunais = async () => {
    try {
      const response = await fetch("/api/financeiro/tribunais")
      if (!response.ok) throw new Error("Erro ao carregar tribunais")
      const data = await response.json()
      setTribunais(data)
    } catch (error) {
      console.error("Erro ao carregar tribunais:", error)
    }
  }

  const buscarBeneficiario = async () => {
    if (!beneficiarioBusca) return

    try {
      const response = await fetch(`/api/beneficiarios?busca=${beneficiarioBusca}`)
      if (!response.ok) throw new Error("Erro ao buscar beneficiário")
      const data = await response.json()
      setBeneficiariosEncontrados(data)
    } catch (error) {
      toast({
        title: "Erro",
        description: "Não foi possível buscar o beneficiário",
        variant: "destructive",
      })
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    try {
      const url = editingProcesso
        ? `/api/financeiro/processos-judiciais/${editingProcesso.id}`
        : "/api/financeiro/processos-judiciais"

      const method = editingProcesso ? "PUT" : "POST"

      const payload = {
        ...formData,
        valor_causa: Number.parseFloat(formData.valor_causa),
        id_beneficiario: Number.parseInt(formData.id_beneficiario),
        id_advogado: Number.parseInt(formData.id_advogado),
        id_tribunal: usarTribunalManual ? null : Number.parseInt(formData.id_tribunal),
      }

      const response = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      })

      if (!response.ok) throw new Error("Erro ao salvar processo")

      toast({
        title: "Sucesso",
        description: `Processo ${editingProcesso ? "atualizado" : "iniciado"} com sucesso`,
      })

      setDialogOpen(false)
      resetForm()
      fetchProcessos()
    } catch (error) {
      toast({
        title: "Erro",
        description: "Não foi possível salvar o processo",
        variant: "destructive",
      })
    }
  }

  const handleSubmitAdvogado = async (e: React.FormEvent) => {
    e.preventDefault()

    try {
      const response = await fetch("/api/financeiro/advogados", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(advogadoFormData),
      })

      if (!response.ok) throw new Error("Erro ao cadastrar advogado")

      toast({
        title: "Sucesso",
        description: "Advogado cadastrado com sucesso",
      })

      setAdvogadoDialogOpen(false)
      setAdvogadoFormData({ nome: "", oab: "", email: "", telefone: "" })
      fetchAdvogados()
    } catch (error) {
      toast({
        title: "Erro",
        description: "Não foi possível cadastrar o advogado",
        variant: "destructive",
      })
    }
  }

  const handleDelete = async () => {
    if (!deletingId) return

    try {
      const response = await fetch(`/api/financeiro/processos-judiciais/${deletingId}`, {
        method: "DELETE",
      })

      if (!response.ok) throw new Error("Erro ao deletar processo")

      toast({
        title: "Sucesso",
        description: "Processo deletado com sucesso",
      })

      setDeleteDialogOpen(false)
      setDeletingId(null)
      fetchProcessos()
    } catch (error) {
      toast({
        title: "Erro",
        description: "Não foi possível deletar o processo",
        variant: "destructive",
      })
    }
  }

  const handleExport = () => {
    const csv = [
      ["Número Processo", "Beneficiário", "Advogado", "Tribunal", "Valor Causa", "Status", "Fase"],
      ...processos.map((p) => [
        p.numero_processo,
        p.beneficiario_nome,
        p.advogado_nome,
        p.tribunal_nome,
        p.valor_causa,
        p.status,
        p.fase_processual,
      ]),
    ]
      .map((row) => row.join(","))
      .join("\n")

    const blob = new Blob([csv], { type: "text/csv" })
    const url = window.URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = `processos-judiciais-${format(new Date(), "yyyy-MM-dd")}.csv`
    a.click()

    toast({
      title: "Sucesso",
      description: "Relatório exportado com sucesso",
    })
  }

  const resetForm = () => {
    setFormData({
      numero_processo: "",
      id_beneficiario: "",
      id_advogado: "",
      id_tribunal: "",
      tribunal_manual: "",
      valor_causa: "",
      data_abertura: "",
      fase_processual: "inicial",
      observacoes: "",
    })
    setBeneficiarioBusca("")
    setBeneficiariosEncontrados([])
    setTribunalBusca("")
    setUsarTribunalManual(false)
    setEditingProcesso(null)
  }

  const openEditDialog = (processo: ProcessoJudicial) => {
    setEditingProcesso(processo)
    setFormData({
      numero_processo: processo.numero_processo,
      id_beneficiario: processo.id_beneficiario.toString(),
      id_advogado: processo.id_advogado.toString(),
      id_tribunal: processo.id_tribunal?.toString() || "",
      tribunal_manual: "",
      valor_causa: processo.valor_causa.toString(),
      data_abertura: processo.data_abertura,
      fase_processual: processo.fase_processual,
      observacoes: processo.observacoes || "",
    })
    setDialogOpen(true)
  }

  const getStatusBadge = (status: string) => {
    const badges = {
      ativo: (
        <Badge className="bg-blue-100 text-blue-800 hover:bg-blue-100">
          <Clock className="mr-1 h-3 w-3" />
          Ativo
        </Badge>
      ),
      suspenso: (
        <Badge className="bg-yellow-100 text-yellow-800 hover:bg-yellow-100">
          <AlertCircle className="mr-1 h-3 w-3" />
          Suspenso
        </Badge>
      ),
      encerrado: (
        <Badge className="bg-green-100 text-green-800 hover:bg-green-100">
          <CheckCircle className="mr-1 h-3 w-3" />
          Encerrado
        </Badge>
      ),
      arquivado: (
        <Badge className="bg-gray-100 text-gray-800 hover:bg-gray-100">
          <XCircle className="mr-1 h-3 w-3" />
          Arquivado
        </Badge>
      ),
    }
    return badges[status as keyof typeof badges] || badges.ativo
  }

  const totalProcessos = processos.length
  const processosAtivos = processos.filter((p) => p.status === "ativo").length
  const processosSuspensos = processos.filter((p) => p.status === "suspenso").length
  const processosEncerrados = processos.filter((p) => p.status === "encerrado").length
  const valorTotalCausas = processos.reduce((sum, p) => sum + p.valor_causa, 0)

  return (
    <div className="flex-1 space-y-6 p-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Cobrança Judicial</h1>
          <p className="text-muted-foreground">Gerencie processos judiciais de cobrança</p>
        </div>
        <Button
          className="bg-blue-600 hover:bg-blue-700"
          onClick={() => {
            resetForm()
            setDialogOpen(true)
          }}
        >
          <Plus className="mr-2 h-4 w-4" />
          Iniciar Processo
        </Button>
      </div>

      <div className="grid gap-4 md:grid-cols-5">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total de Processos</CardTitle>
            <Scale className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalProcessos}</div>
            <p className="text-xs text-muted-foreground">processos cadastrados</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Ativos</CardTitle>
            <Clock className="h-4 w-4 text-blue-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-600">{processosAtivos}</div>
            <p className="text-xs text-muted-foreground">em andamento</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Suspensos</CardTitle>
            <AlertCircle className="h-4 w-4 text-yellow-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-yellow-600">{processosSuspensos}</div>
            <p className="text-xs text-muted-foreground">temporariamente parados</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Encerrados</CardTitle>
            <CheckCircle className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">{processosEncerrados}</div>
            <p className="text-xs text-muted-foreground">finalizados</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Valor Total</CardTitle>
            <Gavel className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              R$ {valorTotalCausas.toLocaleString("pt-BR", { minimumFractionDigits: 2 })}
            </div>
            <p className="text-xs text-muted-foreground">soma das causas</p>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="lista" className="space-y-4">
        <TabsList>
          <TabsTrigger value="lista">Lista de Processos</TabsTrigger>
          <TabsTrigger value="filtros">Filtros Avançados</TabsTrigger>
          <TabsTrigger value="advogados">Advogados</TabsTrigger>
        </TabsList>

        <TabsContent value="lista" className="space-y-4">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle>Processos Judiciais</CardTitle>
                  <CardDescription>Lista completa de processos de cobrança judicial</CardDescription>
                </div>
                <Button variant="outline" size="sm" onClick={handleExport}>
                  <Download className="mr-2 h-4 w-4" />
                  Exportar
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              {loading ? (
                <div className="flex items-center justify-center py-8">
                  <div className="text-muted-foreground">Carregando...</div>
                </div>
              ) : processos.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-8 text-center">
                  <FileText className="h-12 w-12 text-muted-foreground mb-4" />
                  <p className="text-muted-foreground">Nenhum processo encontrado</p>
                </div>
              ) : (
                <div className="rounded-md border">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b bg-muted/50">
                        <th className="h-12 px-4 text-left align-middle font-medium">Número Processo</th>
                        <th className="h-12 px-4 text-left align-middle font-medium">Beneficiário</th>
                        <th className="h-12 px-4 text-left align-middle font-medium">Advogado</th>
                        <th className="h-12 px-4 text-left align-middle font-medium">Valor Causa</th>
                        <th className="h-12 px-4 text-left align-middle font-medium">Status</th>
                        <th className="h-12 px-4 text-left align-middle font-medium">Fase</th>
                        <th className="h-12 px-4 text-left align-middle font-medium">Ações</th>
                      </tr>
                    </thead>
                    <tbody>
                      {processos.map((processo) => (
                        <tr key={processo.id} className="border-b">
                          <td className="h-12 px-4 align-middle font-medium">{processo.numero_processo}</td>
                          <td className="h-12 px-4 align-middle">{processo.beneficiario_nome}</td>
                          <td className="h-12 px-4 align-middle">{processo.advogado_nome}</td>
                          <td className="h-12 px-4 align-middle">
                            R$ {processo.valor_causa.toLocaleString("pt-BR", { minimumFractionDigits: 2 })}
                          </td>
                          <td className="h-12 px-4 align-middle">{getStatusBadge(processo.status)}</td>
                          <td className="h-12 px-4 align-middle capitalize">{processo.fase_processual}</td>
                          <td className="h-12 px-4 align-middle">
                            <div className="flex gap-2">
                              <Button
                                variant="ghost"
                                size="sm"
                                title="Visualizar detalhes"
                                onClick={() => {
                                  setViewingProcesso(processo)
                                  setViewDialogOpen(true)
                                }}
                              >
                                <Eye className="h-4 w-4" />
                              </Button>
                              <Button
                                variant="ghost"
                                size="sm"
                                title="Editar processo"
                                onClick={() => openEditDialog(processo)}
                              >
                                <Edit className="h-4 w-4" />
                              </Button>
                              <Button
                                variant="ghost"
                                size="sm"
                                title="Excluir processo"
                                className="text-red-600 hover:text-red-700"
                                onClick={() => {
                                  setDeletingId(processo.id)
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
              <div className="grid gap-4 md:grid-cols-4">
                <div className="space-y-2">
                  <Label htmlFor="busca">Buscar</Label>
                  <div className="relative">
                    <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                    <Input
                      id="busca"
                      placeholder="Número ou beneficiário..."
                      value={filtros.busca}
                      onChange={(e) => setFiltros({ ...filtros, busca: e.target.value })}
                      className="pl-9"
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="status">Status</Label>
                  <Select value={filtros.status} onValueChange={(value) => setFiltros({ ...filtros, status: value })}>
                    <SelectTrigger>
                      <SelectValue placeholder="Todos" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">Todos</SelectItem>
                      <SelectItem value="ativo">Ativo</SelectItem>
                      <SelectItem value="suspenso">Suspenso</SelectItem>
                      <SelectItem value="encerrado">Encerrado</SelectItem>
                      <SelectItem value="arquivado">Arquivado</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="fase">Fase Processual</Label>
                  <Select value={filtros.fase} onValueChange={(value) => setFiltros({ ...filtros, fase: value })}>
                    <SelectTrigger>
                      <SelectValue placeholder="Todas" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">Todas</SelectItem>
                      <SelectItem value="inicial">Inicial</SelectItem>
                      <SelectItem value="citacao">Citação</SelectItem>
                      <SelectItem value="contestacao">Contestação</SelectItem>
                      <SelectItem value="instrucao">Instrução</SelectItem>
                      <SelectItem value="sentenca">Sentença</SelectItem>
                      <SelectItem value="recurso">Recurso</SelectItem>
                      <SelectItem value="execucao">Execução</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="advogado">Advogado</Label>
                  <Select
                    value={filtros.advogado}
                    onValueChange={(value) => setFiltros({ ...filtros, advogado: value })}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Todos" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">Todos</SelectItem>
                      {advogados.map((adv) => (
                        <SelectItem key={adv.id} value={adv.id.toString()}>
                          {adv.nome}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div className="flex gap-4">
                <Button onClick={() => fetchProcessos()}>
                  <Search className="mr-2 h-4 w-4" />
                  Aplicar Filtros
                </Button>
                <Button
                  variant="outline"
                  onClick={() => {
                    setFiltros({ status: "", fase: "", busca: "", advogado: "" })
                  }}
                >
                  Limpar Filtros
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="advogados" className="space-y-4">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle>Advogados Cadastrados</CardTitle>
                  <CardDescription>Gerencie os advogados responsáveis pelos processos</CardDescription>
                </div>
                <Button onClick={() => setAdvogadoDialogOpen(true)}>
                  <Plus className="mr-2 h-4 w-4" />
                  Cadastrar Advogado
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <div className="grid gap-4 md:grid-cols-2">
                {advogados.map((advogado) => (
                  <Card key={advogado.id}>
                    <CardHeader>
                      <div className="flex items-center gap-3">
                        <UserCheck className="h-5 w-5 text-blue-600" />
                        <div>
                          <CardTitle className="text-lg">{advogado.nome}</CardTitle>
                          <CardDescription>OAB: {advogado.oab}</CardDescription>
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-2 text-sm">
                        <p>
                          <strong>Email:</strong> {advogado.email}
                        </p>
                        <p>
                          <strong>Telefone:</strong> {advogado.telefone}
                        </p>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>{editingProcesso ? "Editar Processo" : "Iniciar Processo Judicial"}</DialogTitle>
            <DialogDescription>Preencha os dados do processo de cobrança judicial</DialogDescription>
          </DialogHeader>
          <form onSubmit={handleSubmit}>
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="grid gap-2">
                  <Label htmlFor="numero_processo">Número do Processo *</Label>
                  <Input
                    id="numero_processo"
                    value={formData.numero_processo}
                    onChange={(e) => setFormData({ ...formData, numero_processo: e.target.value })}
                    placeholder="0000000-00.0000.0.00.0000"
                    required
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="valor_causa">Valor da Causa *</Label>
                  <Input
                    id="valor_causa"
                    type="number"
                    step="0.01"
                    value={formData.valor_causa}
                    onChange={(e) => setFormData({ ...formData, valor_causa: e.target.value })}
                    required
                  />
                </div>
              </div>

              <div className="grid gap-2">
                <Label>Buscar Beneficiário *</Label>
                <div className="flex gap-2">
                  <Input
                    placeholder="Digite o nome ou CPF do beneficiário"
                    value={beneficiarioBusca}
                    onChange={(e) => setBeneficiarioBusca(e.target.value)}
                  />
                  <Button type="button" onClick={buscarBeneficiario}>
                    <Search className="h-4 w-4" />
                  </Button>
                </div>
                {beneficiariosEncontrados.length > 0 && (
                  <Select
                    value={formData.id_beneficiario}
                    onValueChange={(value) => setFormData({ ...formData, id_beneficiario: value })}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Selecione o beneficiário" />
                    </SelectTrigger>
                    <SelectContent>
                      {beneficiariosEncontrados.map((ben) => (
                        <SelectItem key={ben.id} value={ben.id.toString()}>
                          {ben.nome} - CPF: {ben.cpf}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                )}
              </div>

              <div className="grid gap-2">
                <Label htmlFor="id_advogado">Advogado Responsável *</Label>
                <Select
                  value={formData.id_advogado}
                  onValueChange={(value) => setFormData({ ...formData, id_advogado: value })}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione o advogado" />
                  </SelectTrigger>
                  <SelectContent>
                    {advogados.map((adv) => (
                      <SelectItem key={adv.id} value={adv.id.toString()}>
                        {adv.nome} - OAB: {adv.oab}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="grid gap-2">
                <div className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    id="tribunal_manual"
                    checked={usarTribunalManual}
                    onChange={(e) => setUsarTribunalManual(e.target.checked)}
                  />
                  <Label htmlFor="tribunal_manual">Digitar tribunal manualmente</Label>
                </div>

                {usarTribunalManual ? (
                  <Input
                    placeholder="Digite o nome do tribunal"
                    value={formData.tribunal_manual}
                    onChange={(e) => setFormData({ ...formData, tribunal_manual: e.target.value })}
                  />
                ) : (
                  <>
                    <div className="flex gap-2">
                      <Input
                        placeholder="Buscar tribunal por nome ou cidade"
                        value={tribunalBusca}
                        onChange={(e) => setTribunalBusca(e.target.value)}
                      />
                    </div>
                    <Select
                      value={formData.id_tribunal}
                      onValueChange={(value) => setFormData({ ...formData, id_tribunal: value })}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Selecione o tribunal" />
                      </SelectTrigger>
                      <SelectContent>
                        {tribunais
                          .filter(
                            (t) =>
                              !tribunalBusca ||
                              t.nome.toLowerCase().includes(tribunalBusca.toLowerCase()) ||
                              t.cidade.toLowerCase().includes(tribunalBusca.toLowerCase()),
                          )
                          .map((trib) => (
                            <SelectItem key={trib.id} value={trib.id.toString()}>
                              {trib.nome} - {trib.cidade}/{trib.uf}
                            </SelectItem>
                          ))}
                      </SelectContent>
                    </Select>
                  </>
                )}
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="grid gap-2">
                  <Label htmlFor="data_abertura">Data de Abertura *</Label>
                  <Input
                    id="data_abertura"
                    type="date"
                    value={formData.data_abertura}
                    onChange={(e) => setFormData({ ...formData, data_abertura: e.target.value })}
                    required
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="fase_processual">Fase Processual *</Label>
                  <Select
                    value={formData.fase_processual}
                    onValueChange={(value) => setFormData({ ...formData, fase_processual: value })}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="inicial">Inicial</SelectItem>
                      <SelectItem value="citacao">Citação</SelectItem>
                      <SelectItem value="contestacao">Contestação</SelectItem>
                      <SelectItem value="instrucao">Instrução</SelectItem>
                      <SelectItem value="sentenca">Sentença</SelectItem>
                      <SelectItem value="recurso">Recurso</SelectItem>
                      <SelectItem value="execucao">Execução</SelectItem>
                    </SelectContent>
                  </Select>
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
              <Button type="submit">{editingProcesso ? "Atualizar" : "Iniciar"} Processo</Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      <Dialog open={advogadoDialogOpen} onOpenChange={setAdvogadoDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Cadastrar Advogado</DialogTitle>
            <DialogDescription>Adicione um novo advogado ao sistema</DialogDescription>
          </DialogHeader>
          <form onSubmit={handleSubmitAdvogado}>
            <div className="grid gap-4 py-4">
              <div className="grid gap-2">
                <Label htmlFor="nome_advogado">Nome Completo *</Label>
                <Input
                  id="nome_advogado"
                  value={advogadoFormData.nome}
                  onChange={(e) => setAdvogadoFormData({ ...advogadoFormData, nome: e.target.value })}
                  required
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="oab">OAB *</Label>
                <Input
                  id="oab"
                  value={advogadoFormData.oab}
                  onChange={(e) => setAdvogadoFormData({ ...advogadoFormData, oab: e.target.value })}
                  placeholder="SP 123456"
                  required
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="email_advogado">Email *</Label>
                <Input
                  id="email_advogado"
                  type="email"
                  value={advogadoFormData.email}
                  onChange={(e) => setAdvogadoFormData({ ...advogadoFormData, email: e.target.value })}
                  required
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="telefone_advogado">Telefone *</Label>
                <Input
                  id="telefone_advogado"
                  value={advogadoFormData.telefone}
                  onChange={(e) => setAdvogadoFormData({ ...advogadoFormData, telefone: e.target.value })}
                  placeholder="(11) 99999-9999"
                  required
                />
              </div>
            </div>
            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => setAdvogadoDialogOpen(false)}>
                Cancelar
              </Button>
              <Button type="submit">Cadastrar</Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      <Dialog open={viewDialogOpen} onOpenChange={setViewDialogOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Detalhes do Processo</DialogTitle>
          </DialogHeader>
          {viewingProcesso && (
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label className="text-muted-foreground">Número do Processo</Label>
                  <p className="font-medium">{viewingProcesso.numero_processo}</p>
                </div>
                <div>
                  <Label className="text-muted-foreground">Status</Label>
                  <div className="mt-1">{getStatusBadge(viewingProcesso.status)}</div>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label className="text-muted-foreground">Beneficiário</Label>
                  <p className="font-medium">{viewingProcesso.beneficiario_nome}</p>
                </div>
                <div>
                  <Label className="text-muted-foreground">Advogado</Label>
                  <p className="font-medium">{viewingProcesso.advogado_nome}</p>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label className="text-muted-foreground">Tribunal</Label>
                  <p className="font-medium">{viewingProcesso.tribunal_nome}</p>
                </div>
                <div>
                  <Label className="text-muted-foreground">Valor da Causa</Label>
                  <p className="font-medium text-lg">
                    R$ {viewingProcesso.valor_causa.toLocaleString("pt-BR", { minimumFractionDigits: 2 })}
                  </p>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label className="text-muted-foreground">Data de Abertura</Label>
                  <p className="font-medium">
                    {format(new Date(viewingProcesso.data_abertura), "dd/MM/yyyy", { locale: ptBR })}
                  </p>
                </div>
                <div>
                  <Label className="text-muted-foreground">Fase Processual</Label>
                  <p className="font-medium capitalize">{viewingProcesso.fase_processual}</p>
                </div>
              </div>
              {viewingProcesso.observacoes && (
                <div>
                  <Label className="text-muted-foreground">Observações</Label>
                  <p className="font-medium">{viewingProcesso.observacoes}</p>
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
              Tem certeza que deseja excluir este processo? Esta ação não pode ser desfeita.
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
