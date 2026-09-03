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

interface PlanoFaixa {
  id: number
  plano: string
  faixaEtaria: string
  idadeMinima: number
  idadeMaxima: number
  valor: number
  percentualReajuste: number
  ativo: boolean
  dataInclusao: string
}

const planosFaixaMockados: PlanoFaixa[] = [
  {
    id: 1,
    plano: "Plano Básico Individual",
    faixaEtaria: "0 a 18 anos",
    idadeMinima: 0,
    idadeMaxima: 18,
    valor: 150.0,
    percentualReajuste: 0,
    ativo: true,
    dataInclusao: "2024-01-15",
  },
  {
    id: 2,
    plano: "Plano Básico Individual",
    faixaEtaria: "19 a 23 anos",
    idadeMinima: 19,
    idadeMaxima: 23,
    valor: 180.0,
    percentualReajuste: 20,
    ativo: true,
    dataInclusao: "2024-01-15",
  },
  {
    id: 3,
    plano: "Plano Básico Individual",
    faixaEtaria: "24 a 28 anos",
    idadeMinima: 24,
    idadeMaxima: 28,
    valor: 220.0,
    percentualReajuste: 22.22,
    ativo: true,
    dataInclusao: "2024-01-15",
  },
  {
    id: 4,
    plano: "Plano Premium Familiar",
    faixaEtaria: "0 a 18 anos",
    idadeMinima: 0,
    idadeMaxima: 18,
    valor: 280.0,
    percentualReajuste: 0,
    ativo: true,
    dataInclusao: "2024-01-20",
  },
  {
    id: 5,
    plano: "Plano Premium Familiar",
    faixaEtaria: "19 a 23 anos",
    idadeMinima: 19,
    idadeMaxima: 23,
    valor: 350.0,
    percentualReajuste: 25,
    ativo: true,
    dataInclusao: "2024-01-20",
  },
]

export default function PlanosFaixaPage() {
  const [planosFaixa, setPlanosFaixa] = useState<PlanoFaixa[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [filteredPlanos, setFilteredPlanos] = useState<PlanoFaixa[]>(planosFaixaMockados)
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
    setIsLoading(true)
    fetch("/api/planos-faixas").then((response) => response.json()).then((payload) => setPlanosFaixa((payload.data || []).map((item: any) => ({ id: item.id, plano: item.plano_nome, faixaEtaria: `${item.idade_minima} a ${item.idade_maxima} anos`, idadeMinima: item.idade_minima, idadeMaxima: item.idade_maxima, valor: Number(item.valor), percentualReajuste: 0, ativo: true, dataInclusao: item.created_at })))) .catch((error) => console.error("[v0] Erro ao carregar faixas", error)).finally(() => setIsLoading(false))
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
      filtered = filtered.filter((plano) => plano.plano === filterPlano)
    }

    if (filterStatus !== "todos") {
      filtered = filtered.filter((plano) => (filterStatus === "ativo" ? plano.ativo : !plano.ativo))
    }

    setFilteredPlanos(filtered)
  }, [searchTerm, filterPlano, filterStatus, planosFaixa])

  const handleSavePlano = () => {
    if (!formData.plano || !formData.faixaEtaria || !formData.idadeMinima || !formData.idadeMaxima) {
      toast.error("Preencha todos os campos obrigatórios")
      return
    }

    const planoData = {
      ...formData,
      idadeMinima: Number.parseInt(formData.idadeMinima),
      idadeMaxima: Number.parseInt(formData.idadeMaxima),
      valor: Number.parseFloat(formData.valor) || 0,
      percentualReajuste: Number.parseFloat(formData.percentualReajuste) || 0,
      dataInclusao: new Date().toISOString().split("T")[0],
    }

    if (editingPlano) {
      setPlanosFaixa(planosFaixa.map((p) => (p.id === editingPlano.id ? { ...editingPlano, ...planoData } : p)))
      toast.success("Plano faixa atualizado com sucesso!")
    } else {
      const novoPlano = {
        id: Date.now(),
        ...planoData,
      }
      setPlanosFaixa([...planosFaixa, novoPlano])
      toast.success("Plano faixa cadastrado com sucesso!")
    }

    setShowModal(false)
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
  }

  const handleEditPlano = (plano: PlanoFaixa) => {
    setEditingPlano(plano)
    setFormData({
      plano: plano.plano,
      faixaEtaria: plano.faixaEtaria,
      idadeMinima: plano.idadeMinima.toString(),
      idadeMaxima: plano.idadeMaxima.toString(),
      valor: plano.valor.toString(),
      percentualReajuste: plano.percentualReajuste.toString(),
      ativo: plano.ativo,
    })
    setShowModal(true)
  }

  const handleDeletePlano = (id: number) => {
    setPlanosFaixa(planosFaixa.filter((p) => p.id !== id))
    toast.success("Plano faixa excluído com sucesso!")
  }

  const handleToggleStatus = (plano: PlanoFaixa) => {
    setPlanosFaixa(planosFaixa.map((p) => (p.id === plano.id ? { ...p, ativo: !p.ativo } : p)))
    toast.success(`Faixa ${plano.ativo ? "desativada" : "ativada"} com sucesso!`)
  }

  const planosPorPlano = filterPlano === "todos" ? planosFaixa : planosFaixa.filter((p) => p.plano === filterPlano)

  const totalPlanos = planosFaixa.length
  const planosAtivos = planosFaixa.filter((p) => p.ativo).length
  const valorMedio = planosFaixa.reduce((acc, p) => acc + p.valor, 0) / planosFaixa.length
  const reajusteMedio = planosFaixa.reduce((acc, p) => acc + p.percentualReajuste, 0) / planosFaixa.length

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

      {/* Métricas */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total de Faixas</CardTitle>
            <BarChart3 className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalPlanos}</div>
            <p className="text-xs text-muted-foreground">faixas cadastradas</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Faixas Ativas</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{planosAtivos}</div>
            <p className="text-xs text-muted-foreground">de {totalPlanos} faixas</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Valor Médio</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">R$ {valorMedio.toFixed(2)}</div>
            <p className="text-xs text-muted-foreground">valor médio por faixa</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Reajuste Médio</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{reajusteMedio.toFixed(1)}%</div>
            <p className="text-xs text-muted-foreground">reajuste médio</p>
          </CardContent>
        </Card>
      </div>

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
                  {Array.from(new Set(planosFaixa.map((p) => p.plano))).map((plano) => (
                    <SelectItem key={plano} value={plano}>
                      {plano}
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
              <Input
                id="plano"
                value={formData.plano}
                onChange={(e) => setFormData({ ...formData, plano: e.target.value })}
                placeholder="Nome do plano"
              />
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
