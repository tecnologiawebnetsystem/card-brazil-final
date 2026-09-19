"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Switch } from "@/components/ui/switch"
import { Plus, BarChart3, TrendingUp, Users, DollarSign } from "lucide-react"
import { toast } from "sonner"
import { CardDescription } from "@/components/ui/card"
import { CadastroTable, type CadastroColumn } from "@/components/tables/cadastro-table"
import { CadastroDetailsGrid, CadastroDetailField } from "@/components/tables/cadastro-details"
import { CadastroSummaryCard, CadastroSummaryGrid } from "@/components/tables/cadastro-summary-card"

interface PlanoDisponivel {
  id: number
  nome: string
}

interface PlanoFaixa {
  id: number
  plano_id: number
  plano: string
  faixaEtaria: string
  idadeMinima: number
  idadeMaxima: number
  valor: number
  percentualReajuste: number
  ativo: boolean
  dataInclusao: string
}

export default function PlanosFaixaPage() {
  const [planosFaixa, setPlanosFaixa] = useState<PlanoFaixa[]>([])
  const [planosDisponiveis, setPlanosDisponiveis] = useState<PlanoDisponivel[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [filteredPlanos, setFilteredPlanos] = useState<PlanoFaixa[]>([])
  const [searchTerm, setSearchTerm] = useState("")
  const [filterPlano, setFilterPlano] = useState("todos")
  const [filterStatus, setFilterStatus] = useState("todos")
  const [showModal, setShowModal] = useState(false)
  const [editingPlano, setEditingPlano] = useState<PlanoFaixa | null>(null)
  const [formData, setFormData] = useState({
    plano: "",
    faixaEtaria: "",
    idadeMinima: "",
    idadeMaxima: "",
    valor: "",
    percentualReajuste: "",
    ativo: true,
  })

  useEffect(() => {
    let cancelled = false
    const loadData = async () => {
      setIsLoading(true)
      try {
        const [faixasResponse, planosResponse] = await Promise.all([fetch("/api/planos-faixas"), fetch("/api/planos")])
        const [faixasPayload, planosPayload] = await Promise.all([faixasResponse.json(), planosResponse.json()])
        if (!faixasResponse.ok) throw new Error(faixasPayload.message || "Não foi possível carregar as faixas")
        if (!planosResponse.ok) throw new Error(planosPayload.message || "Não foi possível carregar os planos")
        if (cancelled) return
        setPlanosDisponiveis((planosPayload.data || []).map((item: PlanoDisponivel) => ({ id: item.id, nome: item.nome })))
        setPlanosFaixa((faixasPayload.data || []).map((item: any) => ({
          id: item.id,
          plano_id: item.plano_id,
          plano: item.plano_nome || "Plano não identificado",
          faixaEtaria: `${item.idade_minima} a ${item.idade_maxima} anos`,
          idadeMinima: Number(item.idade_minima),
          idadeMaxima: Number(item.idade_maxima),
          valor: Number(item.valor || 0),
          percentualReajuste: 0,
          ativo: item.deleted_at == null,
          dataInclusao: item.created_at,
        })))
      } catch (error) {
        if (!cancelled) toast.error(error instanceof Error ? error.message : "Não foi possível carregar os dados")
      } finally {
        if (!cancelled) setIsLoading(false)
      }
    }
    void loadData()
    return () => { cancelled = true }
  }, [])

  useEffect(() => {
    let filtered = planosFaixa

    if (searchTerm) {
      filtered = filtered.filter(
        (plano) =>
          plano.plano.toLowerCase().includes(searchTerm.toLowerCase()) ||
          plano.faixaEtaria.toLowerCase().includes(searchTerm.toLowerCase()),
      )
    }

    if (filterPlano !== "todos") {
      filtered = filtered.filter((plano) => plano.plano_id.toString() === filterPlano)
    }

    if (filterStatus !== "todos") {
      filtered = filtered.filter((plano) => (filterStatus === "ativo" ? plano.ativo : !plano.ativo))
    }

    setFilteredPlanos(filtered)
  }, [searchTerm, filterPlano, filterStatus, planosFaixa])

  const handleSavePlano = async () => {
    if (!formData.plano || !formData.idadeMinima || !formData.idadeMaxima) { toast.error("Preencha os campos obrigatórios"); return }
    setIsLoading(true)
    try {
      const planoSelecionado = planosDisponiveis.find((plano) => plano.nome === formData.plano)
      if (!planoSelecionado) throw new Error("Selecione um plano cadastrado")
      const body = { plano_id: planoSelecionado.id, idade_minima: Number(formData.idadeMinima), idade_maxima: Number(formData.idadeMaxima), valor: Number(formData.valor) || 0 }
      const response = await fetch(editingPlano ? `/api/planos-faixas/${editingPlano.id}` : "/api/planos-faixas", { method: editingPlano ? "PUT" : "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(body) })
      const payload = await response.json()
      if (!response.ok) throw new Error(payload.message || payload.error || "Não foi possível salvar a faixa")
      toast.success(editingPlano ? "Faixa atualizada com sucesso!" : "Faixa cadastrada com sucesso!")
      setShowModal(false); setEditingPlano(null)
      const refreshed = await fetch("/api/planos-faixas")
      const next = await refreshed.json()
      setPlanosFaixa((next.data || []).map((item: any) => ({ id: item.id, plano_id: item.plano_id, plano: item.plano_nome || "Plano não identificado", faixaEtaria: `${item.idade_minima} a ${item.idade_maxima} anos`, idadeMinima: Number(item.idade_minima), idadeMaxima: Number(item.idade_maxima), valor: Number(item.valor || 0), percentualReajuste: 0, ativo: item.deleted_at == null, dataInclusao: item.created_at })))
    } catch (error) { toast.error(error instanceof Error ? error.message : "Não foi possível salvar a faixa") } finally { setIsLoading(false) }
  }

  const handleEditPlano = (plano: PlanoFaixa) => {
    setEditingPlano(plano)
    setFormData({
      plano: plano.plano_id.toString(),
      faixaEtaria: plano.faixaEtaria,
      idadeMinima: plano.idadeMinima.toString(),
      idadeMaxima: plano.idadeMaxima.toString(),
      valor: plano.valor.toString(),
      percentualReajuste: plano.percentualReajuste.toString(),
      ativo: plano.ativo,
    })
    setShowModal(true)
  }

  const handleDeletePlano = async (id: number) => {
    const response = await fetch(`/api/planos-faixas/${id}`, { method: "DELETE" })
    if (!response.ok) { toast.error("Não foi possível excluir a faixa"); return }
    setPlanosFaixa(planosFaixa.filter((p) => p.id !== id)); toast.success("Plano faixa excluído com sucesso!")
  }

  const handleToggleStatus = (plano: PlanoFaixa) => {
    toast.info("O cadastro de faixas etárias não possui coluna de status no banco.")
  }

  const planosPorPlano = filteredPlanos

  const totalPlanos = planosFaixa.length
  const planosAtivos = planosFaixa.filter((p) => p.ativo).length
  const valorMedio = planosFaixa.length > 0 ? planosFaixa.reduce((acc, p) => acc + p.valor, 0) / planosFaixa.length : 0
  const reajusteMedio = planosFaixa.length > 0 ? planosFaixa.reduce((acc, p) => acc + p.percentualReajuste, 0) / planosFaixa.length : 0

  return (
    <div className="container mx-auto px-6 py-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Planos por Faixa Etária</h1>
          <p className="text-muted-foreground">Gerencie os valores por faixa etária dos planos</p>
        </div>
        <Button
          onClick={() => {
            setEditingPlano(null)
            setFormData({
              plano: "",
              faixaEtaria: "",
              idadeMinima: "",
              idadeMaxima: "",
              valor: "",
              percentualReajuste: "",
              ativo: true,
            })
            setShowModal(true)
          }}
        >
          <Plus className="mr-2 h-4 w-4" />
          Nova Faixa
        </Button>
      </div>

      <CadastroSummaryGrid className="mb-6">
        <CadastroSummaryCard title="Total de Faixas" value={totalPlanos} description="faixas cadastradas" icon={<BarChart3 className="h-5 w-5" />} />
        <CadastroSummaryCard title="Faixas Ativas" value={planosAtivos} description={`de ${totalPlanos} faixas`} icon={<TrendingUp className="h-5 w-5" />} metrics={[{ label: "Status", value: "Ativas", tone: "positive" }]} />
        <CadastroSummaryCard title="Valor Médio" value={`R$ ${valorMedio.toFixed(2)}`} description="valor médio por faixa" icon={<DollarSign className="h-5 w-5" />} />
        <CadastroSummaryCard title="Reajuste Médio" value={`${reajusteMedio.toFixed(1)}%`} description="reajuste médio" icon={<Users className="h-5 w-5" />} />
      </CadastroSummaryGrid>

      {/* Grid padronizado */}
      <Card>
        <CardHeader>
          <CardTitle>Faixas etárias cadastradas</CardTitle>
          <CardDescription>Busque, visualize, edite e altere o status das faixas etárias.</CardDescription>
        </CardHeader>
        <CardContent>
          <CadastroTable
            data={planosPorPlano}
            loading={isLoading && planosFaixa.length === 0}
            getId={(p) => p.id}
            getSearchText={(p) => `${p.plano} ${p.faixaEtaria}`}
            isActive={(p) => p.ativo}
            searchPlaceholder="Buscar por plano ou faixa etária..."
            emptyMessage="Nenhuma faixa etária encontrada."
            extraFilters={
              <Select value={filterPlano} onValueChange={setFilterPlano}>
                <SelectTrigger className="w-full sm:w-56">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="todos">Todos os planos</SelectItem>
                  {planosDisponiveis.map((plano) => (
                    <SelectItem key={plano.id} value={plano.id.toString()}>
                      {plano.nome}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            }
            columns={
              [
                { key: "plano", header: "Plano", sortable: true, className: "font-medium text-foreground" },
                { key: "faixaEtaria", header: "Faixa etária", sortable: true },
                {
                  key: "idades",
                  header: "Idades",
                  render: (p) => `${p.idadeMinima} a ${p.idadeMaxima} anos`,
                },
                {
                  key: "valor",
                  header: "Valor",
                  sortable: true,
                  sortValue: (p) => p.valor,
                  render: (p) => `R$ ${p.valor.toFixed(2)}`,
                },
                {
                  key: "percentualReajuste",
                  header: "Reajuste",
                  sortable: true,
                  sortValue: (p) => p.percentualReajuste,
                  render: (p) => `${p.percentualReajuste}%`,
                },
              ] as CadastroColumn<PlanoFaixa>[]
            }
            onEdit={handleEditPlano}
            onToggleStatus={handleToggleStatus}
            onDelete={(p) => handleDeletePlano(p.id)}
            detailsTitle={(p) => `${p.plano} — ${p.faixaEtaria}`}
            renderDetails={(p) => (
              <CadastroDetailsGrid>
                <CadastroDetailField label="Plano" value={p.plano} />
                <CadastroDetailField label="Faixa etária" value={p.faixaEtaria} />
                <CadastroDetailField label="Idade mínima" value={`${p.idadeMinima} anos`} />
                <CadastroDetailField label="Idade máxima" value={`${p.idadeMaxima} anos`} />
                <CadastroDetailField label="Valor" value={`R$ ${p.valor.toFixed(2)}`} />
                <CadastroDetailField label="Reajuste" value={`${p.percentualReajuste}%`} />
                <CadastroDetailField label="Status" value={p.ativo ? "Ativo" : "Inativo"} />
              </CadastroDetailsGrid>
            )}
          />
        </CardContent>
      </Card>

      {/* Modal de Criar/Editar Faixa */}
      <Dialog open={showModal} onOpenChange={setShowModal}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>{editingPlano ? "Editar Faixa Etária" : "Cadastrar Nova Faixa Etária"}</DialogTitle>
            <DialogDescription>Preencha as informações da faixa etária do plano</DialogDescription>
          </DialogHeader>

          <div className="grid grid-cols-2 gap-4">
            <div className="col-span-2 space-y-2">
              <Label htmlFor="plano">Plano *</Label>
              <Select value={formData.plano} onValueChange={(value) => setFormData({ ...formData, plano: value })}>
                <SelectTrigger id="plano"><SelectValue placeholder="Selecione um plano cadastrado" /></SelectTrigger>
                <SelectContent>
                  {planosDisponiveis.map((plano) => <SelectItem key={plano.id} value={plano.nome}>{plano.nome}</SelectItem>)}
                </SelectContent>
              </Select>
              {planosDisponiveis.length === 0 && <p className="text-sm text-muted-foreground">Cadastre um plano antes de criar uma faixa etária.</p>}
            </div>

            <div className="col-span-2 space-y-2">
              <Label htmlFor="faixaEtaria">Descrição da Faixa *</Label>
              <Input
                id="faixaEtaria"
                value={formData.faixaEtaria}
                onChange={(e) => setFormData({ ...formData, faixaEtaria: e.target.value })}
                placeholder="Ex: 0 a 18 anos"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="idadeMinima">Idade Mínima *</Label>
              <Input
                id="idadeMinima"
                type="number"
                value={formData.idadeMinima}
                onChange={(e) => setFormData({ ...formData, idadeMinima: e.target.value })}
                placeholder="0"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="idadeMaxima">Idade Máxima *</Label>
              <Input
                id="idadeMaxima"
                type="number"
                value={formData.idadeMaxima}
                onChange={(e) => setFormData({ ...formData, idadeMaxima: e.target.value })}
                placeholder="18"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="valor">Valor (R$)</Label>
              <Input
                id="valor"
                type="number"
                step="0.01"
                value={formData.valor}
                onChange={(e) => setFormData({ ...formData, valor: e.target.value })}
                placeholder="0.00"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="percentualReajuste">% Reajuste</Label>
              <Input
                id="percentualReajuste"
                type="number"
                step="0.01"
                value={formData.percentualReajuste}
                onChange={(e) => setFormData({ ...formData, percentualReajuste: e.target.value })}
                placeholder="0.00"
              />
            </div>

            <div className="col-span-2 flex items-center space-x-2">
              <Switch
                id="ativo"
                checked={formData.ativo}
                onCheckedChange={(checked) => setFormData({ ...formData, ativo: checked })}
              />
              <Label htmlFor="ativo">Faixa ativa</Label>
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setShowModal(false)}>
              Cancelar
            </Button>
            <Button onClick={handleSavePlano}>{editingPlano ? "Atualizar" : "Cadastrar"}</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
