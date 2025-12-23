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

const ClipboardIcon = () => (
  <svg className="w-8 h-8 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01"
    />
  </svg>
)

const SearchIcon = () => (
  <svg
    className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground"
    fill="none"
    stroke="currentColor"
    viewBox="0 0 24 24"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
    />
  </svg>
)

const PlusIcon = () => (
  <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
  </svg>
)

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
  const [filteredPlanos, setFilteredPlanos] = useState<Plano[]>([])
  const [showDeleteDialog, setShowDeleteDialog] = useState(false)
  const [planoToDelete, setPlanoToDelete] = useState<number | null>(null)

  const [formData, setFormData] = useState({
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
    loadPlanos()
  }, [])

  useEffect(() => {
    if (!searchTerm.trim()) {
      setFilteredPlanos(planos)
    } else {
      const filtered = planos.filter(
        (plano) =>
          plano.nome.toLowerCase().includes(searchTerm.toLowerCase()) ||
          plano.codigo?.toLowerCase().includes(searchTerm.toLowerCase()) ||
          plano.tipo?.toLowerCase().includes(searchTerm.toLowerCase()),
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
      const payload = {
        nome: formData.nome,
        codigo: formData.codigo || null,
        tipo: formData.tipo || null,
        valor: formData.valor ? Number.parseFloat(formData.valor) : null,
        cobertura: formData.cobertura || null,
        descricao: formData.descricao || null,
        status: formData.status,
        ativo: formData.ativo,
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
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-6 py-6">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-2xl font-bold text-foreground">Planos de Saúde</h1>
            <p className="text-muted-foreground">Gerencie os planos de saúde disponíveis</p>
          </div>
          <Button onClick={() => handleOpenModal()}>
            <PlusIcon />
            Novo Plano
          </Button>
        </div>

        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle>Lista de Planos</CardTitle>
                <CardDescription>Total de {filteredPlanos.length} planos cadastrados</CardDescription>
              </div>
              <div className="relative">
                <SearchIcon />
                <Input
                  placeholder="Buscar plano..."
                  className="pl-10 w-64"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
            </div>
          </CardHeader>
          <CardContent>
            {isLoading && planos.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground">Carregando planos...</div>
            ) : filteredPlanos.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground">
                {searchTerm ? "Nenhum plano encontrado com os critérios de busca" : "Nenhum plano cadastrado"}
              </div>
            ) : (
              <div className="space-y-4">
                {filteredPlanos.map((plano) => (
                  <div
                    key={plano.id}
                    className="flex items-center justify-between p-4 border rounded-lg hover:bg-muted/50 transition-colors"
                  >
                    <div className="flex items-center gap-4">
                      <ClipboardIcon />
                      <div>
                        <h3 className="font-medium text-foreground">{plano.nome}</h3>
                        <p className="text-sm text-muted-foreground">
                          {plano.codigo && `Código: ${plano.codigo}`}
                          {plano.tipo && ` | Tipo: ${plano.tipo}`}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center gap-6">
                      {plano.cobertura && (
                        <div className="text-center">
                          <p className="text-sm font-medium text-foreground">{plano.cobertura}</p>
                          <p className="text-xs text-muted-foreground">Cobertura</p>
                        </div>
                      )}

                      {plano.valor && (
                        <div className="text-center">
                          <p className="text-sm font-medium text-foreground">
                            R$ {plano.valor.toFixed(2).replace(".", ",")}
                          </p>
                          <p className="text-xs text-muted-foreground">Valor</p>
                        </div>
                      )}

                      <Badge variant={plano.ativo ? "default" : "secondary"}>{plano.status}</Badge>

                      <div className="flex gap-2">
                        <Button variant="outline" size="sm" onClick={() => handleOpenModal(plano)}>
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
                            />
                          </svg>
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => {
                            setPlanoToDelete(plano.id)
                            setShowDeleteDialog(true)
                          }}
                        >
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                            />
                          </svg>
                        </Button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
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
    </div>
  )
}
