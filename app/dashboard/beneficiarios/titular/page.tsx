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

interface Beneficiario {
  id: number
  pessoa_id: number
  proposta_id?: number
  tipo_beneficiario: "titular"
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
}

export default function BeneficiarioTitularPage() {
  const { toast } = useToast()
  const [searchTerm, setSearchTerm] = useState("")
  const [searchType, setSearchType] = useState("nome")
  const [beneficiarios, setBeneficiarios] = useState<Beneficiario[]>([])
  const [filteredBeneficiarios, setFilteredBeneficiarios] = useState<Beneficiario[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [selectedBeneficiario, setSelectedBeneficiario] = useState<Beneficiario | null>(null)
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [dialogMode, setDialogMode] = useState<"view" | "edit" | "create">("view")

  useEffect(() => {
    loadBeneficiarios()
  }, [])

  useEffect(() => {
    filterBeneficiarios()
  }, [searchTerm, searchType, beneficiarios])

  const loadBeneficiarios = async () => {
    setIsLoading(true)
    try {
      const response = await fetch("/api/beneficiarios?tipo=titular")
      const data = await response.json()

      if (data.success) {
        setBeneficiarios(data.data)
        setFilteredBeneficiarios(data.data)
      } else {
        throw new Error(data.message)
      }
    } catch (error) {
      console.error("Erro ao carregar beneficiários:", error)
      toast({
        title: "Erro",
        description: "Não foi possível carregar os beneficiários titulares",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  const filterBeneficiarios = () => {
    if (!searchTerm.trim()) {
      setFilteredBeneficiarios(beneficiarios)
      return
    }

    const filtered = beneficiarios.filter((b) => {
      const term = searchTerm.toLowerCase()
      switch (searchType) {
        case "nome":
          return b.nome?.toLowerCase().includes(term)
        case "cpf":
          return b.cpf?.includes(searchTerm)
        case "proposta":
          return b.proposta_id?.toString().includes(searchTerm)
        default:
          return true
      }
    })

    setFilteredBeneficiarios(filtered)
  }

  const handleSearch = () => {
    filterBeneficiarios()
  }

  const handleView = (beneficiario: Beneficiario) => {
    setSelectedBeneficiario(beneficiario)
    setDialogMode("view")
    setIsDialogOpen(true)
  }

  const handleEdit = (beneficiario: Beneficiario) => {
    setSelectedBeneficiario(beneficiario)
    setDialogMode("edit")
    setIsDialogOpen(true)
  }

  const handleCreate = () => {
    setSelectedBeneficiario(null)
    setDialogMode("create")
    setIsDialogOpen(true)
  }

  const handleDelete = async (id: number) => {
    if (!confirm("Tem certeza que deseja excluir este beneficiário titular?")) return

    try {
      const response = await fetch(`/api/beneficiarios/${id}`, {
        method: "DELETE",
      })

      const data = await response.json()

      if (data.success) {
        toast({
          title: "Sucesso",
          description: "Beneficiário excluído com sucesso",
        })
        loadBeneficiarios()
      } else {
        throw new Error(data.message)
      }
    } catch (error) {
      console.error("Erro ao excluir beneficiário:", error)
      toast({
        title: "Erro",
        description: "Não foi possível excluir o beneficiário",
        variant: "destructive",
      })
    }
  }

  const handleSave = async () => {
    // Implementar lógica de salvar
    toast({
      title: "Sucesso",
      description: "Beneficiário salvo com sucesso",
    })
    setIsDialogOpen(false)
    loadBeneficiarios()
  }

  return (
    <div className="flex-1 space-y-6 p-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-gray-900">Beneficiário Titular</h1>
          <p className="text-gray-600">Gerenciamento de beneficiários titulares</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline">
            <FileTextIcon className="h-4 w-4 mr-2" />
            Relatório
          </Button>
          <Button onClick={handleCreate}>
            <UserPlusIcon className="h-4 w-4 mr-2" />
            Novo Titular
          </Button>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Pesquisar Beneficiário Titular</CardTitle>
          <CardDescription>Busque por nome, CPF ou número da proposta</CardDescription>
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
                  <TableHead>Proposta</TableHead>
                  <TableHead>Plano</TableHead>
                  <TableHead>Data Adesão</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Ações</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredBeneficiarios.map((beneficiario) => (
                  <TableRow key={beneficiario.id}>
                    <TableCell className="font-medium">{beneficiario.id}</TableCell>
                    <TableCell>{beneficiario.nome || "-"}</TableCell>
                    <TableCell>{beneficiario.cpf || "-"}</TableCell>
                    <TableCell>{beneficiario.proposta_id || "-"}</TableCell>
                    <TableCell>{beneficiario.plano_id || "-"}</TableCell>
                    <TableCell>
                      {beneficiario.data_adesao ? new Date(beneficiario.data_adesao).toLocaleDateString("pt-BR") : "-"}
                    </TableCell>
                    <TableCell>
                      <Badge variant={beneficiario.ativo ? "default" : "secondary"}>
                        {beneficiario.ativo ? "Ativo" : "Inativo"}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-2">
                        <Button variant="outline" size="sm" onClick={() => handleView(beneficiario)}>
                          <EyeIcon className="h-4 w-4" />
                        </Button>
                        <Button variant="outline" size="sm" onClick={() => handleEdit(beneficiario)}>
                          <EditIcon className="h-4 w-4" />
                        </Button>
                        <Button variant="outline" size="sm" onClick={() => handleDelete(beneficiario.id)}>
                          <TrashIcon className="h-4 w-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>

          {filteredBeneficiarios.length === 0 && !isLoading && (
            <div className="text-center py-8 text-gray-500">
              <SearchIcon className="h-12 w-12 mx-auto mb-4 text-gray-300" />
              <p>Nenhum beneficiário titular encontrado</p>
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
                ? "Novo Beneficiário Titular"
                : dialogMode === "edit"
                  ? "Editar Beneficiário Titular"
                  : "Detalhes do Beneficiário Titular"}
            </DialogTitle>
            <DialogDescription>
              {dialogMode === "view"
                ? "Visualize todos os dados do beneficiário titular"
                : "Preencha os dados do beneficiário titular"}
            </DialogDescription>
          </DialogHeader>

          <Tabs defaultValue="dados-pessoais" className="w-full">
            <TabsList className="grid w-full grid-cols-4">
              <TabsTrigger value="dados-pessoais">Dados Pessoais</TabsTrigger>
              <TabsTrigger value="endereco">Endereço</TabsTrigger>
              <TabsTrigger value="plano">Plano</TabsTrigger>
              <TabsTrigger value="documentos">Documentos</TabsTrigger>
            </TabsList>

            <TabsContent value="dados-pessoais" className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Nome Completo</Label>
                  <Input value={selectedBeneficiario?.nome || ""} disabled={dialogMode === "view"} />
                </div>
                <div className="space-y-2">
                  <Label>CPF</Label>
                  <Input value={selectedBeneficiario?.cpf || ""} disabled={dialogMode === "view"} />
                </div>
                <div className="space-y-2">
                  <Label>Telefone</Label>
                  <Input value={selectedBeneficiario?.telefone || ""} disabled={dialogMode === "view"} />
                </div>
                <div className="space-y-2">
                  <Label>E-mail</Label>
                  <Input value={selectedBeneficiario?.email || ""} disabled={dialogMode === "view"} />
                </div>
              </div>
            </TabsContent>

            <TabsContent value="endereco" className="space-y-4">
              <p className="text-sm text-gray-500">Informações de endereço do beneficiário</p>
            </TabsContent>

            <TabsContent value="plano" className="space-y-4">
              <p className="text-sm text-gray-500">Informações do plano contratado</p>
            </TabsContent>

            <TabsContent value="documentos" className="space-y-4">
              <p className="text-sm text-gray-500">Documentos anexados do beneficiário</p>
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
