"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { SearchIcon, UserPlusIcon, EditIcon, TrashIcon, EyeIcon, FileTextIcon } from "lucide-react"
import { useToast } from "@/hooks/use-toast"

interface Dependente {
  id: number
  pessoa_id: number
  proposta_id?: number
  beneficiario_titular_id?: number
  tipo_beneficiario: "dependente"
  parentesco?: string
  plano_id?: number
  operadora_id?: number
  data_adesao?: string
  status: string
  ativo: boolean
  // Dados da pessoa
  nome?: string
  cpf?: string
  telefone?: string
  email?: string
  // Dados do titular
  titular_nome?: string
}

export default function DependentesPage() {
  const { toast } = useToast()
  const [searchTerm, setSearchTerm] = useState("")
  const [searchType, setSearchType] = useState("nome")
  const [dependentes, setDependentes] = useState<Dependente[]>([])
  const [filteredDependentes, setFilteredDependentes] = useState<Dependente[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [selectedDependente, setSelectedDependente] = useState<Dependente | null>(null)
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [dialogMode, setDialogMode] = useState<"view" | "edit" | "create">("view")

  useEffect(() => {
    loadDependentes()
  }, [])

  useEffect(() => {
    filterDependentes()
  }, [searchTerm, searchType, dependentes])

  const loadDependentes = async () => {
    setIsLoading(true)
    try {
      const response = await fetch("/api/beneficiarios?tipo=dependente")
      const data = await response.json()

      if (data.success) {
        setDependentes(data.data)
        setFilteredDependentes(data.data)
      } else {
        throw new Error(data.message)
      }
    } catch (error) {
      console.error("Erro ao carregar dependentes:", error)
      toast({
        title: "Erro",
        description: "Não foi possível carregar os dependentes",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  const filterDependentes = () => {
    if (!searchTerm.trim()) {
      setFilteredDependentes(dependentes)
      return
    }

    const filtered = dependentes.filter((d) => {
      const term = searchTerm.toLowerCase()
      switch (searchType) {
        case "nome":
          return d.nome?.toLowerCase().includes(term)
        case "cpf":
          return d.cpf?.includes(searchTerm)
        case "proposta":
          return d.proposta_id?.toString().includes(searchTerm)
        case "titular":
          return d.titular_nome?.toLowerCase().includes(term)
        default:
          return true
      }
    })

    setFilteredDependentes(filtered)
  }

  const handleSearch = () => {
    filterDependentes()
  }

  const handleView = (dependente: Dependente) => {
    setSelectedDependente(dependente)
    setDialogMode("view")
    setIsDialogOpen(true)
  }

  const handleEdit = (dependente: Dependente) => {
    setSelectedDependente(dependente)
    setDialogMode("edit")
    setIsDialogOpen(true)
  }

  const handleCreate = () => {
    setSelectedDependente(null)
    setDialogMode("create")
    setIsDialogOpen(true)
  }

  const handleDelete = async (id: number) => {
    if (!confirm("Tem certeza que deseja excluir este dependente?")) return

    try {
      const response = await fetch(`/api/beneficiarios/${id}`, {
        method: "DELETE",
      })

      const data = await response.json()

      if (data.success) {
        toast({
          title: "Sucesso",
          description: "Dependente excluído com sucesso",
        })
        loadDependentes()
      } else {
        throw new Error(data.message)
      }
    } catch (error) {
      console.error("Erro ao excluir dependente:", error)
      toast({
        title: "Erro",
        description: "Não foi possível excluir o dependente",
        variant: "destructive",
      })
    }
  }

  const handleSave = async () => {
    // Implementar lógica de salvar
    toast({
      title: "Sucesso",
      description: "Dependente salvo com sucesso",
    })
    setIsDialogOpen(false)
    loadDependentes()
  }

  return (
    <div className="flex-1 space-y-6 p-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-gray-900">Dependentes</h1>
          <p className="text-gray-600">Gerenciamento de beneficiários dependentes</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline">
            <FileTextIcon className="h-4 w-4 mr-2" />
            Relatório
          </Button>
          <Button onClick={handleCreate}>
            <UserPlusIcon className="h-4 w-4 mr-2" />
            Novo Dependente
          </Button>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Pesquisar Dependente</CardTitle>
          <CardDescription>Busque por nome, CPF, proposta ou titular</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex gap-4 mb-6">
            <Select value={searchType} onValueChange={setSearchType}>
              <SelectTrigger className="w-48">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="nome">Nome</SelectItem>
                <SelectItem value="cpf">CPF</SelectItem>
                <SelectItem value="proposta">Nº Proposta</SelectItem>
                <SelectItem value="titular">Titular</SelectItem>
              </SelectContent>
            </Select>
            <Input
              placeholder={`Buscar por ${searchType}...`}
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="flex-1"
            />
            <Button onClick={handleSearch} disabled={isLoading}>
              <SearchIcon className="h-4 w-4 mr-2" />
              {isLoading ? "Buscando..." : "Buscar"}
            </Button>
          </div>

          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>ID</TableHead>
                  <TableHead>Nome</TableHead>
                  <TableHead>CPF</TableHead>
                  <TableHead>Titular</TableHead>
                  <TableHead>Parentesco</TableHead>
                  <TableHead>Plano</TableHead>
                  <TableHead>Data Adesão</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Ações</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredDependentes.map((dependente) => (
                  <TableRow key={dependente.id}>
                    <TableCell className="font-medium">{dependente.id}</TableCell>
                    <TableCell>{dependente.nome || "-"}</TableCell>
                    <TableCell>{dependente.cpf || "-"}</TableCell>
                    <TableCell>{dependente.titular_nome || "-"}</TableCell>
                    <TableCell>{dependente.parentesco || "-"}</TableCell>
                    <TableCell>{dependente.plano_id || "-"}</TableCell>
                    <TableCell>
                      {dependente.data_adesao ? new Date(dependente.data_adesao).toLocaleDateString("pt-BR") : "-"}
                    </TableCell>
                    <TableCell>
                      <Badge variant={dependente.ativo ? "default" : "secondary"}>
                        {dependente.ativo ? "Ativo" : "Inativo"}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-2">
                        <Button variant="outline" size="sm" onClick={() => handleView(dependente)}>
                          <EyeIcon className="h-4 w-4" />
                        </Button>
                        <Button variant="outline" size="sm" onClick={() => handleEdit(dependente)}>
                          <EditIcon className="h-4 w-4" />
                        </Button>
                        <Button variant="outline" size="sm" onClick={() => handleDelete(dependente.id)}>
                          <TrashIcon className="h-4 w-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>

          {filteredDependentes.length === 0 && !isLoading && (
            <div className="text-center py-8 text-gray-500">
              <SearchIcon className="h-12 w-12 mx-auto mb-4 text-gray-300" />
              <p>Nenhum dependente encontrado</p>
              <p className="text-sm">Tente ajustar os filtros ou termo de busca</p>
            </div>
          )}
        </CardContent>
      </Card>

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>
              {dialogMode === "create"
                ? "Novo Dependente"
                : dialogMode === "edit"
                  ? "Editar Dependente"
                  : "Detalhes do Dependente"}
            </DialogTitle>
            <DialogDescription>
              {dialogMode === "view" ? "Visualize todos os dados do dependente" : "Preencha os dados do dependente"}
            </DialogDescription>
          </DialogHeader>

          <Tabs defaultValue="dados-pessoais" className="w-full">
            <TabsList className="grid w-full grid-cols-5">
              <TabsTrigger value="dados-pessoais">Dados Pessoais</TabsTrigger>
              <TabsTrigger value="titular">Titular</TabsTrigger>
              <TabsTrigger value="endereco">Endereço</TabsTrigger>
              <TabsTrigger value="plano">Plano</TabsTrigger>
              <TabsTrigger value="documentos">Documentos</TabsTrigger>
            </TabsList>

            <TabsContent value="dados-pessoais" className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Nome Completo</Label>
                  <Input value={selectedDependente?.nome || ""} disabled={dialogMode === "view"} />
                </div>
                <div className="space-y-2">
                  <Label>CPF</Label>
                  <Input value={selectedDependente?.cpf || ""} disabled={dialogMode === "view"} />
                </div>
                <div className="space-y-2">
                  <Label>Parentesco</Label>
                  <Select disabled={dialogMode === "view"}>
                    <SelectTrigger>
                      <SelectValue placeholder="Selecione" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="conjuge">Cônjuge</SelectItem>
                      <SelectItem value="filho">Filho(a)</SelectItem>
                      <SelectItem value="enteado">Enteado(a)</SelectItem>
                      <SelectItem value="pai">Pai</SelectItem>
                      <SelectItem value="mae">Mãe</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label>Telefone</Label>
                  <Input value={selectedDependente?.telefone || ""} disabled={dialogMode === "view"} />
                </div>
              </div>
            </TabsContent>

            <TabsContent value="titular" className="space-y-4">
              <p className="text-sm text-gray-500">Informações do beneficiário titular</p>
            </TabsContent>

            <TabsContent value="endereco" className="space-y-4">
              <p className="text-sm text-gray-500">Informações de endereço do dependente</p>
            </TabsContent>

            <TabsContent value="plano" className="space-y-4">
              <p className="text-sm text-gray-500">Informações do plano contratado</p>
            </TabsContent>

            <TabsContent value="documentos" className="space-y-4">
              <p className="text-sm text-gray-500">Documentos anexados do dependente</p>
            </TabsContent>
          </Tabs>

          {dialogMode !== "view" && (
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
                Cancelar
              </Button>
              <Button onClick={handleSave}>Salvar</Button>
            </DialogFooter>
          )}
        </DialogContent>
      </Dialog>
    </div>
  )
}
