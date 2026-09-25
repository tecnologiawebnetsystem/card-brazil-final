"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { useToast } from "@/hooks/use-toast"
import { DollarSign, Package, TrendingUp, Plus } from "lucide-react"
import { CadastroTable, type CadastroColumn } from "@/components/tables/cadastro-table"
import { CadastroDetailsGrid, CadastroDetailField } from "@/components/tables/cadastro-details"
import { CadastroSummaryCard, CadastroSummaryGrid } from "@/components/tables/cadastro-summary-card"

interface ProdutoDisponivel {
  id: number
  nome: string
  operadora_id?: number
}

interface Plano {
  id: number
  nome: string
  codigo?: string
  tipo?: string
  valor?: number
  cobertura?: string
  descricao?: string
  status: string
  produto_id?: number
  ativo: boolean
  created_at?: string
  updated_at?: string
  deleted_at?: string | null
}

export default function PlanosPage() {
  const { toast } = useToast()
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [isEditMode, setIsEditMode] = useState(false)
  const [editingPlano, setEditingPlano] = useState<Plano | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [searchTerm, setSearchTerm] = useState("")
  const [planos, setPlanos] = useState<Plano[]>([])
  const [produtos, setProdutos] = useState<ProdutoDisponivel[]>([])
  const [filteredPlanos, setFilteredPlanos] = useState<Plano[]>([])
  const [showDeleteDialog, setShowDeleteDialog] = useState(false)
  const [planoToDelete, setPlanoToDelete] = useState<number | null>(null)

  const [formData, setFormData] = useState({
    produto_id: "",
    nome: "",
    codigo: "",
    tipo: "",
    valor: "",
    cobertura: "",
    descricao: "",
    status: "Ativo",
    ativo: true,
  })

  useEffect(() => {
    void Promise.all([loadPlanos(), loadProdutos()])
  }, [])

  const loadProdutos = async () => {
    try {
      const response = await fetch("/api/produtos", { credentials: "include", cache: "no-store" })
      const data = await response.json()
      if (!response.ok || !data.success) throw new Error(data.message)
      setProdutos(data.data || [])
    } catch (error) {
      toast({ title: "Erro", description: "Não foi possível carregar os produtos", variant: "destructive" })
    }
  }

  useEffect(() => {
    if (!searchTerm.trim()) {
      setFilteredPlanos(planos)
    } else {
      const filtered = planos.filter(
        (plano) =>
          (plano.nome || "").toLowerCase().includes(searchTerm.toLowerCase()) ||
          (plano.codigo || "").toLowerCase().includes(searchTerm.toLowerCase()) ||
          (plano.tipo || "").toLowerCase().includes(searchTerm.toLowerCase()),
      )
      setFilteredPlanos(filtered)
    }
  }, [searchTerm, planos])

  const loadPlanos = async () => {
    setIsLoading(true)
    try {
      const response = await fetch("/api/planos")
      const data = await response.json()

      if (data.success) {
        setPlanos(data.data)
        setFilteredPlanos(data.data)
      } else {
        throw new Error(data.message)
      }
    } catch (error) {
      console.error("Erro ao carregar planos:", error)
      toast({
        title: "Erro",
        description: "Não foi possível carregar os planos",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  const handleOpenModal = (plano?: Plano) => {
    if (plano) {
      setIsEditMode(true)
      setEditingPlano(plano)
      setFormData({
        produto_id: plano.produto_id?.toString() || "",
        nome: plano.nome,
        codigo: plano.codigo || "",
        tipo: plano.tipo || "",
        valor: plano.valor?.toString() || "",
        cobertura: plano.cobertura || "",
        descricao: plano.descricao || "",
        status: plano.status,
        ativo: plano.ativo,
      })
    } else {
      setIsEditMode(false)
      setEditingPlano(null)
      setFormData({
        produto_id: "",
        nome: "",
        codigo: "",
        tipo: "",
        valor: "",
        cobertura: "",
        descricao: "",
        status: "Ativo",
        ativo: true,
      })
    }
    setIsModalOpen(true)
  }

  const handleSavePlano = async () => {
    if (!formData.nome.trim()) {
      toast({
        title: "Erro",
        description: "O nome do plano é obrigatório",
        variant: "destructive",
      })
      return
    }

    setIsLoading(true)
    try {
      const produtoSelecionado = produtos.find((produto) => produto.id.toString() === formData.produto_id)
      if (!produtoSelecionado) throw new Error("Selecione um produto cadastrado antes de criar o plano")
      const payload = {
        produto_id: produtoSelecionado.id,
        operadora_id: produtoSelecionado.operadora_id,
        nome: formData.nome,
        codigo_ans: formData.codigo || null,
        tipo_plano: formData.tipo || "Individual",
        valor_base: formData.valor ? Number.parseFloat(formData.valor) : null,
        descricao: formData.descricao || null,
        status: formData.status.toLowerCase(),
      }

      let response
      if (isEditMode && editingPlano) {
        response = await fetch(`/api/planos/${editingPlano.id}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        })
      } else {
        response = await fetch("/api/planos", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        })
      }

      const data = await response.json()

      if (data.success) {
        toast({
          title: "Sucesso",
          description: isEditMode ? "Plano atualizado com sucesso" : "Plano cadastrado com sucesso",
        })
        await loadPlanos()
        setIsModalOpen(false)
      } else {
        throw new Error(data.message)
      }
    } catch (error) {
      console.error("Erro ao salvar plano:", error)
      toast({
        title: "Erro",
        description: "Não foi possível salvar o plano",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  const handleToggleStatus = async (plano: Plano) => {
    const novoAtivo = !plano.ativo
    try {
      const response = await fetch(`/api/planos/${plano.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          produto_id: plano.produto_id ?? null,
          operadora_id: produtos.find((produto) => produto.id === plano.produto_id)?.operadora_id,
          nome: plano.nome,
          codigo_ans: plano.codigo ?? null,
          tipo_plano: plano.tipo || "Individual",
          valor_base: plano.valor ?? null,
          descricao: plano.descricao ?? null,
          status: novoAtivo ? "ativo" : "inativo",
        }),
      })
      const data = await response.json()
      if (data.success) {
        toast({
          title: "Sucesso",
          description: `Plano ${plano.ativo ? "desativado" : "ativado"} com sucesso`,
        })
        await loadPlanos()
      } else {
        throw new Error(data.message)
      }
    } catch (error) {
      toast({
        title: "Erro",
        description: "Não foi possível alterar o status do plano",
        variant: "destructive",
      })
    }
  }

  const handleDeletePlano = async () => {
    if (!planoToDelete) return

    setIsLoading(true)
    try {
      const response = await fetch(`/api/planos/${planoToDelete}`, {
        method: "DELETE",
      })

      const data = await response.json()

      if (data.success) {
        toast({
          title: "Sucesso",
          description: "Plano excluído com sucesso",
        })
        await loadPlanos()
        setShowDeleteDialog(false)
        setPlanoToDelete(null)
      } else {
        throw new Error(data.message)
      }
    } catch (error) {
      console.error("Erro ao excluir plano:", error)
      toast({
        title: "Erro",
        description: "Não foi possível excluir o plano",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="container mx-auto px-6 py-6">
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Planos de Saúde</h1>
          <p className="text-muted-foreground">Gerencie os planos de saúde disponíveis</p>
        </div>
        <Button onClick={() => handleOpenModal()}>
            <Plus className="mr-2 h-4 w-4" />
            Novo Plano
          </Button>
      </div>

      <CadastroSummaryGrid className="mb-6">
        <CadastroSummaryCard
          title="Total de Planos"
          value={planos.length}
          description="planos cadastrados"
          icon={<Package className="h-5 w-5" />}
          metrics={[{ label: "Status", value: `${planos.filter((p) => p.ativo).length} ativos`, tone: "positive" }]}
        />
        <CadastroSummaryCard
          title="Planos Ativos"
          value={planos.filter((p) => p.ativo).length}
          description={`de ${planos.length} planos`}
          icon={<TrendingUp className="h-5 w-5" />}
          metrics={[{ label: "Status", value: "Ativos", tone: "positive" }]}
        />
        <CadastroSummaryCard
          title="Valor Médio"
          value={`R$ ${planos.length ? (planos.reduce((total, plano) => total + (Number(plano.valor) || 0), 0) / planos.length).toFixed(2) : "0,00"}`}
          description="valor médio dos planos"
          icon={<DollarSign className="h-5 w-5" />}
        />
      </CadastroSummaryGrid>

      <Card>
          <CardHeader>
            <CardTitle>Planos cadastrados</CardTitle>
            <CardDescription>Busque, visualize, edite e altere o status dos planos.</CardDescription>
          </CardHeader>
          <CardContent>
            <CadastroTable
              data={planos}
              loading={isLoading && planos.length === 0}
              getId={(p) => p.id}
              getSearchText={(p) => `${p.nome} ${p.codigo ?? ""} ${p.tipo ?? ""} ${p.cobertura ?? ""}`}
              isActive={(p) => p.ativo}
              searchPlaceholder="Buscar por nome, código, tipo ou cobertura..."
              emptyMessage="Nenhum plano encontrado."
              columns={
                [
                  { key: "nome", header: "Plano", sortable: true, className: "font-medium text-foreground" },
                  {
                    key: "codigo",
                    header: "Código",
                    sortable: true,
                    render: (p) =>
                      p.codigo ? (
                        <Badge variant="outline" className="text-xs">
                          {p.codigo}
                        </Badge>
                      ) : (
                        "—"
                      ),
                  },
                  { key: "tipo", header: "Tipo", sortable: true, render: (p) => p.tipo || "—" },
                  { key: "cobertura", header: "Cobertura", render: (p) => p.cobertura || "—" },
                  {
                    key: "valor",
                    header: "Valor",
                    sortable: true,
                    sortValue: (p) => p.valor ?? 0,
                    render: (p) => {
        const valor = p.valor == null ? null : Number(p.valor)
        return valor == null || Number.isNaN(valor) ? "—" : `R$ ${valor.toFixed(2).replace(".", ",")}`
      },
                  },
                ] as CadastroColumn<Plano>[]
              }
              onEdit={(p) => handleOpenModal(p)}
              onToggleStatus={handleToggleStatus}
              onDelete={(p) => {
                setPlanoToDelete(p.id)
                setShowDeleteDialog(true)
              }}
              detailsTitle={(p) => p.nome}
              renderDetails={(p) => (
                <CadastroDetailsGrid>
                  <CadastroDetailField label="Plano" value={p.nome} />
                  <CadastroDetailField label="Código" value={p.codigo} />
                  <CadastroDetailField label="Tipo" value={p.tipo} />
                  <CadastroDetailField label="Cobertura" value={p.cobertura} />
                  <CadastroDetailField
                    label="Valor"
                    value={(() => {
          const valor = p.valor == null ? null : Number(p.valor)
          return valor == null || Number.isNaN(valor) ? undefined : `R$ ${valor.toFixed(2).replace(".", ",")}`
        })()}
                  />
                  <CadastroDetailField label="Status" value={p.ativo ? "Ativo" : "Inativo"} />
                  <CadastroDetailField label="Descrição" value={p.descricao} full />
                </CadastroDetailsGrid>
              )}
            />
          </CardContent>
        </Card>

        <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
          <DialogContent className="sm:max-w-[500px]">
            <DialogHeader>
              <DialogTitle>{isEditMode ? "Editar Plano de Saúde" : "Novo Plano de Saúde"}</DialogTitle>
              <DialogDescription>
                {isEditMode ? "Atualize as informações do plano" : "Cadastre um novo plano de saúde no sistema"}
              </DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="produto_id" className="text-right">Produto *</Label>
                <Select value={formData.produto_id} onValueChange={(value) => setFormData({ ...formData, produto_id: value })}>
                  <SelectTrigger id="produto_id" className="col-span-3"><SelectValue placeholder="Selecione o produto" /></SelectTrigger>
                  <SelectContent>
                    {produtos.map((produto) => <SelectItem key={produto.id} value={produto.id.toString()}>{produto.nome}</SelectItem>)}
                  </SelectContent>
                </Select>
              </div>
              {produtos.length === 0 && <p className="text-sm text-muted-foreground">Cadastre um produto antes de criar um plano.</p>}
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="nome" className="text-right">
                  Nome *
                </Label>
                <Input
                  id="nome"
                  placeholder="Nome do plano"
                  className="col-span-3"
                  value={formData.nome}
                  onChange={(e) => setFormData({ ...formData, nome: e.target.value })}
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="codigo" className="text-right">
                  Código
                </Label>
                <Input
                  id="codigo"
                  placeholder="PREM-001"
                  className="col-span-3"
                  value={formData.codigo}
                  onChange={(e) => setFormData({ ...formData, codigo: e.target.value })}
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="tipo" className="text-right">
                  Tipo
                </Label>
                <Select value={formData.tipo} onValueChange={(value) => setFormData({ ...formData, tipo: value })}>
                  <SelectTrigger className="col-span-3">
                    <SelectValue placeholder="Selecione o tipo" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Individual">Individual</SelectItem>
                    <SelectItem value="Familiar">Familiar</SelectItem>
                    <SelectItem value="Empresarial">Empresarial</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="valor" className="text-right">
                  Valor
                </Label>
                <Input
                  id="valor"
                  type="number"
                  step="0.01"
                  placeholder="450.00"
                  className="col-span-3"
                  value={formData.valor}
                  onChange={(e) => setFormData({ ...formData, valor: e.target.value })}
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="cobertura" className="text-right">
                  Cobertura
                </Label>
                <Select
                  value={formData.cobertura}
                  onValueChange={(value) => setFormData({ ...formData, cobertura: value })}
                >
                  <SelectTrigger className="col-span-3">
                    <SelectValue placeholder="Selecione a cobertura" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Municipal">Municipal</SelectItem>
                    <SelectItem value="Regional">Regional</SelectItem>
                    <SelectItem value="Estadual">Estadual</SelectItem>
                    <SelectItem value="Nacional">Nacional</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="descricao" className="text-right">
                  Descrição
                </Label>
                <Textarea
                  id="descricao"
                  placeholder="Descrição dos benefícios do plano..."
                  className="col-span-3"
                  rows={3}
                  value={formData.descricao}
                  onChange={(e) => setFormData({ ...formData, descricao: e.target.value })}
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="status" className="text-right">
                  Status
                </Label>
                <Select value={formData.status} onValueChange={(value) => setFormData({ ...formData, status: value })}>
                  <SelectTrigger className="col-span-3">
                    <SelectValue placeholder="Selecione o status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Ativo">Ativo</SelectItem>
                    <SelectItem value="Inativo">Inativo</SelectItem>
                    <SelectItem value="Suspenso">Suspenso</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => setIsModalOpen(false)} disabled={isLoading}>
                Cancelar
              </Button>
              <Button onClick={handleSavePlano} disabled={isLoading}>
                {isLoading ? "Salvando..." : isEditMode ? "Atualizar" : "Cadastrar"}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        <Dialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Confirmar Exclusão</DialogTitle>
              <DialogDescription>
                Tem certeza que deseja excluir este plano? Esta ação não pode ser desfeita.
              </DialogDescription>
            </DialogHeader>
            <DialogFooter>
              <Button variant="outline" onClick={() => setShowDeleteDialog(false)} disabled={isLoading}>
                Cancelar
              </Button>
              <Button variant="destructive" onClick={handleDeletePlano} disabled={isLoading}>
                {isLoading ? "Excluindo..." : "Excluir"}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
    </div>
  )
}
