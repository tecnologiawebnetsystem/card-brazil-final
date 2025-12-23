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
import { Search, Plus, Edit, Trash2, BarChart3, TrendingUp, Users, DollarSign } from "lucide-react"
import { toast } from "sonner"

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
  const [planosFaixa, setPlanosFaixa] = useState<PlanoFaixa[]>(planosFaixaMockados)
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
      </div>

      {/* Métricas */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <Card className="bg-emerald-700 text-white border-0">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total de Faixas</CardTitle>
            <BarChart3 className="h-4 w-4 bg-emerald-600 p-1 rounded ml-6" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalPlanos}</div>
            <p className="text-xs text-emerald-100">faixas cadastradas</p>
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

      {/* Filtros e Busca */}
      <Card className="mb-6">
        <CardHeader>
          <CardTitle>Filtros</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="space-y-2">
              <Label htmlFor="search">Buscar</Label>
              <div className="relative">
                <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  id="search"
                  placeholder="Plano ou faixa etária..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-8"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label>Plano</Label>
              <Select value={filterPlano} onValueChange={setFilterPlano}>
                <SelectTrigger>
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
            </div>

            <div className="space-y-2">
              <Label>Status</Label>
              <Select value={filterStatus} onValueChange={setFilterStatus}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="todos">Todos</SelectItem>
                  <SelectItem value="ativo">Ativo</SelectItem>
                  <SelectItem value="inativo">Inativo</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="flex items-end">
              <Dialog open={showModal} onOpenChange={setShowModal}>
                <DialogTrigger asChild>
                  <Button className="w-full">
                    <Plus className="mr-2 h-4 w-4" />
                    Nova Faixa
                  </Button>
                </DialogTrigger>
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
          </div>
        </CardContent>
      </Card>

      {/* Lista de Planos Faixa */}
      <Card>
        <CardHeader>
          <CardTitle>Faixas Etárias Cadastradas ({filteredPlanos.length})</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {filteredPlanos.map((plano) => (
              <div key={plano.id} className="flex items-center justify-between p-4 border rounded-lg">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <h3 className="font-semibold">{plano.plano}</h3>
                    <Badge variant={plano.ativo ? "default" : "secondary"}>{plano.ativo ? "Ativo" : "Inativo"}</Badge>
                  </div>
                  <div className="text-sm text-muted-foreground space-y-1">
                    <p>
                      <strong>Faixa Etária:</strong> {plano.faixaEtaria}
                    </p>
                    <p>
                      <strong>Idades:</strong> {plano.idadeMinima} a {plano.idadeMaxima} anos
                    </p>
                    <p>
                      <strong>Valor:</strong> R$ {plano.valor.toFixed(2)}
                    </p>
                    <p>
                      <strong>Reajuste:</strong> {plano.percentualReajuste}%
                    </p>
                  </div>
                </div>
                <div className="flex gap-2">
                  <Button variant="outline" size="sm" onClick={() => handleEditPlano(plano)}>
                    <Edit className="h-4 w-4" />
                  </Button>
                  <Button variant="outline" size="sm" onClick={() => handleDeletePlano(plano.id)}>
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            ))}

            {filteredPlanos.length === 0 && (
              <div className="text-center py-8 text-muted-foreground">
                Nenhuma faixa etária encontrada com os filtros aplicados.
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
