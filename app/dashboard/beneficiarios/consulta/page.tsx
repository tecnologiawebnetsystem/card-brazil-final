"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { SearchIcon, EyeIcon, DownloadIcon, FilterIcon } from "lucide-react"
import { useToast } from "@/hooks/use-toast"

interface Beneficiario {
  id: number
  pessoa_id: number
  tipo_beneficiario: "titular" | "dependente"
  proposta_id?: number
  beneficiario_titular_id?: number
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
  // Dados do titular (para dependentes)
  titular_nome?: string
  // Dados do plano
  plano_nome?: string
  operadora_nome?: string
}

export default function ConsultaBeneficiariosPage() {
  const { toast } = useToast()
  const [searchTerm, setSearchTerm] = useState("")
  const [filtroTipo, setFiltroTipo] = useState("todos")
  const [filtroStatus, setFiltroStatus] = useState("todos")
  const [beneficiarios, setBeneficiarios] = useState<Beneficiario[]>([])
  const [filteredBeneficiarios, setFilteredBeneficiarios] = useState<Beneficiario[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [selectedBeneficiario, setSelectedBeneficiario] = useState<Beneficiario | null>(null)
  const [isDialogOpen, setIsDialogOpen] = useState(false)

  useEffect(() => {
    loadBeneficiarios()
  }, [])

  useEffect(() => {
    filterBeneficiarios()
  }, [searchTerm, filtroTipo, filtroStatus, beneficiarios])

  const loadBeneficiarios = async () => {
    setIsLoading(true)
    try {
      const response = await fetch("/api/beneficiarios")
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
        description: "Não foi possível carregar os beneficiários",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  const filterBeneficiarios = () => {
    let filtered = beneficiarios

    if (searchTerm.trim()) {
      const term = searchTerm.toLowerCase()
      filtered = filtered.filter(
        (b) =>
          b.nome?.toLowerCase().includes(term) ||
          b.cpf?.includes(searchTerm) ||
          b.proposta_id?.toString().includes(searchTerm) ||
          b.titular_nome?.toLowerCase().includes(term),
      )
    }

    if (filtroTipo !== "todos") {
      filtered = filtered.filter((b) => b.tipo_beneficiario === filtroTipo)
    }

    if (filtroStatus !== "todos") {
      filtered = filtered.filter((b) => (filtroStatus === "ativo" ? b.ativo : !b.ativo))
    }

    setFilteredBeneficiarios(filtered)
  }

  const handleView = (beneficiario: Beneficiario) => {
    setSelectedBeneficiario(beneficiario)
    setIsDialogOpen(true)
  }

  const handleExport = () => {
    toast({
      title: "Exportando",
      description: "Gerando arquivo de exportação...",
    })
  }

  return (
    <div className="flex-1 space-y-6 p-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-gray-900">Consulta de Beneficiários</h1>
          <p className="text-gray-600">Consulte e visualize informações completas de todos os beneficiários</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={handleExport}>
            <DownloadIcon className="h-4 w-4 mr-2" />
            Exportar
          </Button>
        </div>
      </div>

      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Todos os Beneficiários</CardTitle>
              <CardDescription>
                Mostrando {filteredBeneficiarios.length} de {beneficiarios.length} beneficiários (titulares e
                dependentes)
              </CardDescription>
            </div>
            <div className="flex items-center gap-2">
              <FilterIcon className="h-4 w-4 text-gray-500" />
              <span className="text-sm text-gray-500">Filtros ativos</span>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex gap-4">
              <div className="flex-1">
                <Input
                  placeholder="Buscar por nome, CPF, proposta ou titular..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  disabled={isLoading}
                />
              </div>
              <Select value={filtroTipo} onValueChange={setFiltroTipo}>
                <SelectTrigger className="w-48">
                  <SelectValue placeholder="Tipo" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="todos">Todos os tipos</SelectItem>
                  <SelectItem value="titular">Titular</SelectItem>
                  <SelectItem value="dependente">Dependente</SelectItem>
                </SelectContent>
              </Select>
              <Select value={filtroStatus} onValueChange={setFiltroStatus}>
                <SelectTrigger className="w-48">
                  <SelectValue placeholder="Status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="todos">Todos os status</SelectItem>
                  <SelectItem value="ativo">Ativo</SelectItem>
                  <SelectItem value="inativo">Inativo</SelectItem>
                </SelectContent>
              </Select>
              <Button
                variant="outline"
                onClick={() => {
                  setFiltroTipo("todos")
                  setFiltroStatus("todos")
                  setSearchTerm("")
                }}
              >
                Limpar
              </Button>
            </div>

            <div className="rounded-md border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>ID</TableHead>
                    <TableHead>Nome</TableHead>
                    <TableHead>CPF</TableHead>
                    <TableHead>Tipo</TableHead>
                    <TableHead>Titular</TableHead>
                    <TableHead>Parentesco</TableHead>
                    <TableHead>Proposta</TableHead>
                    <TableHead>Plano</TableHead>
                    <TableHead>Operadora</TableHead>
                    <TableHead>Data Adesão</TableHead>
                    <TableHead>Telefone</TableHead>
                    <TableHead>E-mail</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className="text-right">Ações</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredBeneficiarios.map((beneficiario) => (
                    <TableRow key={beneficiario.id}>
                      <TableCell className="font-medium">{beneficiario.id}</TableCell>
                      <TableCell className="font-medium">{beneficiario.nome || "-"}</TableCell>
                      <TableCell>{beneficiario.cpf || "-"}</TableCell>
                      <TableCell>
                        <Badge variant={beneficiario.tipo_beneficiario === "titular" ? "default" : "secondary"}>
                          {beneficiario.tipo_beneficiario}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        {beneficiario.tipo_beneficiario === "dependente" ? beneficiario.titular_nome || "-" : "-"}
                      </TableCell>
                      <TableCell>
                        {beneficiario.tipo_beneficiario === "dependente" ? beneficiario.parentesco || "-" : "-"}
                      </TableCell>
                      <TableCell>{beneficiario.proposta_id || "-"}</TableCell>
                      <TableCell>{beneficiario.plano_nome || beneficiario.plano_id || "-"}</TableCell>
                      <TableCell>{beneficiario.operadora_nome || beneficiario.operadora_id || "-"}</TableCell>
                      <TableCell>
                        {beneficiario.data_adesao
                          ? new Date(beneficiario.data_adesao).toLocaleDateString("pt-BR")
                          : "-"}
                      </TableCell>
                      <TableCell>{beneficiario.telefone || "-"}</TableCell>
                      <TableCell>{beneficiario.email || "-"}</TableCell>
                      <TableCell>
                        <Badge variant={beneficiario.ativo ? "default" : "secondary"}>
                          {beneficiario.ativo ? "Ativo" : "Inativo"}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-right">
                        <Button variant="outline" size="sm" onClick={() => handleView(beneficiario)}>
                          <EyeIcon className="h-4 w-4" />
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>

            {filteredBeneficiarios.length === 0 && !isLoading && (
              <div className="text-center py-8 text-gray-500">
                <SearchIcon className="h-12 w-12 mx-auto mb-4 text-gray-300" />
                <p>Nenhum beneficiário encontrado</p>
                <p className="text-sm">Tente ajustar os filtros ou termo de busca</p>
              </div>
            )}

            {isLoading && (
              <div className="text-center py-8 text-gray-500">
                <p>Carregando beneficiários...</p>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="max-w-5xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Detalhes Completos do Beneficiário</DialogTitle>
            <DialogDescription>Visualize todas as informações disponíveis do beneficiário</DialogDescription>
          </DialogHeader>

          {selectedBeneficiario && (
            <Tabs defaultValue="dados-pessoais" className="w-full">
              <TabsList className="grid w-full grid-cols-6">
                <TabsTrigger value="dados-pessoais">Dados Pessoais</TabsTrigger>
                <TabsTrigger value="endereco">Endereço</TabsTrigger>
                <TabsTrigger value="plano">Plano</TabsTrigger>
                <TabsTrigger value="pagamentos">Pagamentos</TabsTrigger>
                <TabsTrigger value="documentos">Documentos</TabsTrigger>
                <TabsTrigger value="historico">Histórico</TabsTrigger>
              </TabsList>

              <TabsContent value="dados-pessoais" className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label className="text-gray-500">ID</Label>
                    <p className="font-medium">{selectedBeneficiario.id}</p>
                  </div>
                  <div className="space-y-2">
                    <Label className="text-gray-500">Tipo</Label>
                    <Badge variant={selectedBeneficiario.tipo_beneficiario === "titular" ? "default" : "secondary"}>
                      {selectedBeneficiario.tipo_beneficiario}
                    </Badge>
                  </div>
                  <div className="space-y-2">
                    <Label className="text-gray-500">Nome Completo</Label>
                    <p className="font-medium">{selectedBeneficiario.nome || "-"}</p>
                  </div>
                  <div className="space-y-2">
                    <Label className="text-gray-500">CPF</Label>
                    <p className="font-medium">{selectedBeneficiario.cpf || "-"}</p>
                  </div>
                  {selectedBeneficiario.tipo_beneficiario === "dependente" && (
                    <>
                      <div className="space-y-2">
                        <Label className="text-gray-500">Titular</Label>
                        <p className="font-medium">{selectedBeneficiario.titular_nome || "-"}</p>
                      </div>
                      <div className="space-y-2">
                        <Label className="text-gray-500">Parentesco</Label>
                        <p className="font-medium">{selectedBeneficiario.parentesco || "-"}</p>
                      </div>
                    </>
                  )}
                  <div className="space-y-2">
                    <Label className="text-gray-500">Telefone</Label>
                    <p className="font-medium">{selectedBeneficiario.telefone || "-"}</p>
                  </div>
                  <div className="space-y-2">
                    <Label className="text-gray-500">E-mail</Label>
                    <p className="font-medium">{selectedBeneficiario.email || "-"}</p>
                  </div>
                  <div className="space-y-2">
                    <Label className="text-gray-500">Data de Adesão</Label>
                    <p className="font-medium">
                      {selectedBeneficiario.data_adesao
                        ? new Date(selectedBeneficiario.data_adesao).toLocaleDateString("pt-BR")
                        : "-"}
                    </p>
                  </div>
                  <div className="space-y-2">
                    <Label className="text-gray-500">Status</Label>
                    <Badge variant={selectedBeneficiario.ativo ? "default" : "secondary"}>
                      {selectedBeneficiario.ativo ? "Ativo" : "Inativo"}
                    </Badge>
                  </div>
                </div>
              </TabsContent>

              <TabsContent value="endereco" className="space-y-4">
                <p className="text-sm text-gray-500">Informações de endereço do beneficiário</p>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label className="text-gray-500">CEP</Label>
                    <p className="font-medium">-</p>
                  </div>
                  <div className="space-y-2">
                    <Label className="text-gray-500">Logradouro</Label>
                    <p className="font-medium">-</p>
                  </div>
                  <div className="space-y-2">
                    <Label className="text-gray-500">Número</Label>
                    <p className="font-medium">-</p>
                  </div>
                  <div className="space-y-2">
                    <Label className="text-gray-500">Complemento</Label>
                    <p className="font-medium">-</p>
                  </div>
                  <div className="space-y-2">
                    <Label className="text-gray-500">Bairro</Label>
                    <p className="font-medium">-</p>
                  </div>
                  <div className="space-y-2">
                    <Label className="text-gray-500">Cidade/UF</Label>
                    <p className="font-medium">-</p>
                  </div>
                </div>
              </TabsContent>

              <TabsContent value="plano" className="space-y-4">
                <p className="text-sm text-gray-500">Informações do plano contratado</p>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label className="text-gray-500">Proposta</Label>
                    <p className="font-medium">{selectedBeneficiario.proposta_id || "-"}</p>
                  </div>
                  <div className="space-y-2">
                    <Label className="text-gray-500">Plano</Label>
                    <p className="font-medium">
                      {selectedBeneficiario.plano_nome || selectedBeneficiario.plano_id || "-"}
                    </p>
                  </div>
                  <div className="space-y-2">
                    <Label className="text-gray-500">Operadora</Label>
                    <p className="font-medium">
                      {selectedBeneficiario.operadora_nome || selectedBeneficiario.operadora_id || "-"}
                    </p>
                  </div>
                  <div className="space-y-2">
                    <Label className="text-gray-500">Valor Mensalidade</Label>
                    <p className="font-medium">-</p>
                  </div>
                </div>
              </TabsContent>

              <TabsContent value="pagamentos" className="space-y-4">
                <p className="text-sm text-gray-500">Histórico de pagamentos do beneficiário</p>
              </TabsContent>

              <TabsContent value="documentos" className="space-y-4">
                <p className="text-sm text-gray-500">Documentos anexados do beneficiário</p>
              </TabsContent>

              <TabsContent value="historico" className="space-y-4">
                <p className="text-sm text-gray-500">Histórico de alterações e movimentações</p>
              </TabsContent>
            </Tabs>
          )}
        </DialogContent>
      </Dialog>
    </div>
  )
}
