"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { PersonModal } from "@/components/shared/person-modal"
import { AddressCard } from "@/components/shared/address-card"
import { BankAccountCard } from "@/components/shared/bank-account-card"
import { AddressModal } from "@/components/shared/address-modal"
import { BankAccountModal } from "@/components/shared/bank-account-modal"
import { useToast } from "@/hooks/use-toast"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Plus } from "lucide-react"
import { CadastroTable, type CadastroColumn } from "@/components/tables/cadastro-table"

interface Agenciador {
  id: number
  pessoa_id: number
  situacao: "Ativo" | "Inativo"
  created_at?: string
  updated_at?: string
  deleted_at?: string | null
}

interface Endereco {
  id: number
  pessoa_id: number
  tipo: "residencial" | "comercial" | "cobranca"
  cep: string
  logradouro: string
  numero: string
  complemento?: string
  bairro: string
  cidade: string
  estado: string
  email?: string
}

interface DadoBancario {
  id: number
  pessoa_id: number
  banco: string
  agencia: string
  tipo_conta: "corrente" | "poupanca"
  conta: string
  digito_conta: string
}

interface Pessoa {
  id: number
  tipo: "fisica" | "juridica"
  nome: string
  cpf?: string
  cnpj?: string
  rg?: string
  inscricao_estadual?: string
  data_nascimento?: string
  status: string
  enderecos?: Endereco[]
  dados_bancarios?: DadoBancario[]
}

export default function AgenciadorPage() {
  const { toast } = useToast()
  const [searchTerm, setSearchTerm] = useState("")
  const [searchFilter, setSearchFilter] = useState("agenciadores")
  const [searchResults, setSearchResults] = useState<Pessoa[]>([])
  const [showResults, setShowResults] = useState(false)
  const [selectedPerson, setSelectedPerson] = useState<Pessoa | null>(null)
  const [showNewPersonModal, setShowNewPersonModal] = useState(false)
  const [showAgenciadorModal, setShowAgenciadorModal] = useState(false)
  const [showEditAgenciadorModal, setShowEditAgenciadorModal] = useState(false)
  const [showDeleteDialog, setShowDeleteDialog] = useState(false)
  const [isLoading, setIsLoading] = useState(false)

  const [showAddEnderecoModal, setShowAddEnderecoModal] = useState(false)
  const [showAddBancoModal, setShowAddBancoModal] = useState(false)
  const [showEditEnderecoModal, setShowEditEnderecoModal] = useState(false)
  const [showEditBancoModal, setShowEditBancoModal] = useState(false)
  const [editingEndereco, setEditingEndereco] = useState<Endereco | null>(null)
  const [editingBanco, setEditingBanco] = useState<DadoBancario | null>(null)

  const [agenciadores, setAgenciadores] = useState<Agenciador[]>([])
  const [currentAgenciador, setCurrentAgenciador] = useState<Agenciador | null>(null)
  const [agenciadorData, setAgenciadorData] = useState({
    situacao: "Ativo" as "Ativo" | "Inativo",
  })

  useEffect(() => {
    const carregarDadosIniciais = async () => {
      await loadAgenciadores()
      await handleSearch()
    }
    void carregarDadosIniciais()
  }, [])

  const loadAgenciadores = async () => {
    try {
      const response = await fetch("/api/agenciadores")
      const data = await response.json()
      if (!response.ok || data.success === false) throw new Error(data.error || data.message || "Erro ao carregar agenciadores")
      setAgenciadores(Array.isArray(data.data) ? data.data : Array.isArray(data) ? data : [])
    } catch (error) {
      console.error("Erro ao carregar agenciadores:", error)
      toast({
        title: "Erro",
        description: "Não foi possível carregar os agenciadores",
        variant: "destructive",
      })
    }
  }

  const handleSearch = async () => {
    setIsLoading(true)
    try {
      const response = await fetch(`/api/pessoas?search=${encodeURIComponent(searchTerm)}`)
      const data = await response.json()

      if (data.success) {
        let results = (data.data || []).map((pessoa: Pessoa & {   nome_completo?: string
  razao_social?: string
}) => ({
          ...pessoa,
          nome: pessoa.nome || pessoa.nome_completo || pessoa.razao_social || "",
        }))

        if (searchFilter === "agenciadores") {
          results = results.filter((pessoa: Pessoa) =>
            agenciadores.some((ag) => ag.pessoa_id === pessoa.id && !ag.deleted_at),
          )
        }

        setSearchResults(results)
        setShowResults(true)
        setSelectedPerson(null)
      }
    } catch (error) {
      console.error("Erro ao pesquisar:", error)
      toast({
        title: "Erro",
        description: "Não foi possível realizar a pesquisa",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  const handleSelectPerson = async (pessoa: Pessoa) => {
    setIsLoading(true)
    try {
      const [pessoaResponse, enderecosResponse, bancosResponse] = await Promise.all([
        fetch(`/api/pessoas/${pessoa.id}`),
        fetch(`/api/enderecos?pessoa_id=${pessoa.id}`),
        fetch(`/api/dados-bancarios?pessoa_id=${pessoa.id}`),
      ])

      const pessoaData = await pessoaResponse.json()
      const enderecosData = await enderecosResponse.json()
      const bancosData = await bancosResponse.json()

      if (pessoaData.success) {
        const pessoaCompleta = {
          ...pessoaData.data,
          enderecos: enderecosData.success ? enderecosData.data : [],
          dados_bancarios: bancosData.success ? bancosData.data : [],
        }

        setSelectedPerson(pessoaCompleta)
        setShowResults(false)

        const agenciadorExistente = agenciadores.find((ag) => ag.pessoa_id === pessoa.id && !ag.deleted_at)
        if (agenciadorExistente) {
          setCurrentAgenciador(agenciadorExistente)
          setAgenciadorData({
            situacao: agenciadorExistente.situacao,
          })
        } else {
          setCurrentAgenciador(null)
          setAgenciadorData({
            situacao: "Ativo",
          })
        }
      }
    } catch (error) {
      console.error("Erro ao carregar dados da pessoa:", error)
      toast({
        title: "Erro",
        description: "Não foi possível carregar os dados completos",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  const handleBackToSearch = () => {
    setSelectedPerson(null)
    setCurrentAgenciador(null)
    setShowResults(searchResults.length > 0)
  }

  const handleSaveAgenciador = async () => {
    if (!selectedPerson) return

    setIsLoading(true)
    try {
      const payload = {
        pessoa_id: selectedPerson.id,
        situacao: agenciadorData.situacao,
      }

      let response
      if (currentAgenciador) {
        response = await fetch(`/api/agenciadores/${currentAgenciador.id}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        })
      } else {
        response = await fetch("/api/agenciadores", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        })
      }

      const data = await response.json()

      if (data.success) {
        toast({
          title: "Sucesso",
          description: currentAgenciador ? "Agenciador atualizado com sucesso" : "Agenciador cadastrado com sucesso",
        })
        await loadAgenciadores()
        setShowAgenciadorModal(false)
        setShowEditAgenciadorModal(false)
        if (selectedPerson) {
          await handleSelectPerson(selectedPerson)
        }
      } else {
        throw new Error(data.message)
      }
    } catch (error) {
      console.error("Erro ao salvar agenciador:", error)
      toast({
        title: "Erro",
        description: "Não foi possível salvar o agenciador",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  const handleDeleteAgenciador = async () => {
    if (!currentAgenciador) return

    setIsLoading(true)
    try {
      const response = await fetch(`/api/agenciadores/${currentAgenciador.id}`, {
        method: "DELETE",
      })

      const data = await response.json()

      if (data.success) {
        toast({
          title: "Sucesso",
          description: "Agenciador excluído com sucesso",
        })
        await loadAgenciadores()
        setShowDeleteDialog(false)
        setSelectedPerson(null)
        setCurrentAgenciador(null)
      } else {
        throw new Error(data.message)
      }
    } catch (error) {
      console.error("Erro ao excluir agenciador:", error)
      toast({
        title: "Erro",
        description: "Não foi possível excluir o agenciador",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  const handleNewPersonSave = async (personData: any) => {
    await loadAgenciadores()
    setShowNewPersonModal(false)
    toast({
      title: "Sucesso",
      description: "Pessoa cadastrada com sucesso",
    })
  }

  const handleToggleStatus = async (pessoa: Pessoa) => {
    const agenciador = agenciadores.find((ag) => ag.pessoa_id === pessoa.id && !ag.deleted_at)
    if (!agenciador) {
      await handleSelectPerson(pessoa)
      toast({
        title: "Cadastro necessário",
        description: "Cadastre o agenciador antes de alterar a situação.",
      })
      return
    }
    const novaSituacao = agenciador.situacao === "Ativo" ? "Inativo" : "Ativo"
    try {
      const response = await fetch(`/api/agenciadores/${agenciador.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ pessoa_id: agenciador.pessoa_id, situacao: novaSituacao }),
      })
      const data = await response.json()
      if (data.success) {
        toast({
          title: "Sucesso",
          description: `Agenciador ${novaSituacao === "Ativo" ? "ativado" : "desativado"} com sucesso`,
        })
        await loadAgenciadores()
      } else {
        throw new Error(data.message)
      }
    } catch (error) {
      toast({
        title: "Erro",
        description: "Não foi possível alterar a situação do agenciador",
        variant: "destructive",
      })
    }
  }

  const handleSaveEndereco = async (enderecoData: any) => {
    if (!selectedPerson) return

    setIsLoading(true)
    try {
      const response = await fetch("/api/enderecos", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...enderecoData,
          pessoa_id: selectedPerson.id,
        }),
      })

      const data = await response.json()

      if (data.success) {
        toast({
          title: "Sucesso",
          description: "Endereço adicionado com sucesso",
        })
        await handleSelectPerson(selectedPerson)
        setShowAddEnderecoModal(false)
      } else {
        throw new Error(data.message)
      }
    } catch (error) {
      console.error("Erro ao salvar endereço:", error)
      toast({
        title: "Erro",
        description: "Não foi possível salvar o endereço",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  const handleSaveBanco = async (bancoData: any) => {
    if (!selectedPerson) return

    setIsLoading(true)
    try {
      const response = await fetch("/api/dados-bancarios", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...bancoData,
          pessoa_id: selectedPerson.id,
        }),
      })

      const data = await response.json()

      if (data.success) {
        toast({
          title: "Sucesso",
          description: "Conta bancária adicionada com sucesso",
        })
        await handleSelectPerson(selectedPerson)
        setShowAddBancoModal(false)
      } else {
        throw new Error(data.message)
      }
    } catch (error) {
      console.error("Erro ao salvar conta bancária:", error)
      toast({
        title: "Erro",
        description: "Não foi possível salvar a conta bancária",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  const handleDeleteEndereco = async (enderecoId: number) => {
    if (!selectedPerson) return

    setIsLoading(true)
    try {
      const response = await fetch(`/api/enderecos/${enderecoId}`, {
        method: "DELETE",
      })

      const data = await response.json()

      if (data.success) {
        toast({
          title: "Sucesso",
          description: "Endereço excluído com sucesso",
        })
        await handleSelectPerson(selectedPerson)
      } else {
        throw new Error(data.message)
      }
    } catch (error) {
      console.error("Erro ao excluir endereço:", error)
      toast({
        title: "Erro",
        description: "Não foi possível excluir o endereço",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  const handleDeleteBanco = async (bancoId: number) => {
    if (!selectedPerson) return

    setIsLoading(true)
    try {
      const response = await fetch(`/api/dados-bancarios/${bancoId}`, {
        method: "DELETE",
      })

      const data = await response.json()

      if (data.success) {
        toast({
          title: "Sucesso",
          description: "Conta bancária excluída com sucesso",
        })
        await handleSelectPerson(selectedPerson)
      } else {
        throw new Error(data.message)
      }
    } catch (error) {
      console.error("Erro ao excluir conta bancária:", error)
      toast({
        title: "Erro",
        description: "Não foi possível excluir a conta bancária",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  const isAgenciador = currentAgenciador !== null

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-6 py-6">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-2xl font-bold text-foreground">Agenciadores</h1>
            <p className="text-muted-foreground">Gerencie os agenciadores do sistema</p>
          </div>
          {selectedPerson ? (
            <Button variant="outline" onClick={handleBackToSearch}>
              <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
              </svg>
              Voltar à Pesquisa
            </Button>
          ) : (
            <Button onClick={() => setShowNewPersonModal(true)}>
              <Plus className="mr-2 h-4 w-4" />
              Nova Pessoa
            </Button>
          )}
        </div>

        {!selectedPerson && (
          <Card>
            <CardHeader>
              <CardTitle>Agenciadores cadastrados</CardTitle>
              <CardDescription>Busque, visualize, edite e altere a situação dos agenciadores.</CardDescription>
            </CardHeader>
            <CardContent>
              <CadastroTable
                data={
                  searchFilter === "agenciadores"
                    ? searchResults.filter((p) => agenciadores.some((ag) => ag.pessoa_id === p.id && !ag.deleted_at))
                    : searchResults
                }
                loading={isLoading}
                getId={(p) => p.id}
                getSearchText={(p) => `${p.nome} ${p.cpf ?? ""} ${p.cnpj ?? ""}`}
                isActive={(p) =>
                  agenciadores.some((ag) => ag.pessoa_id === p.id && !ag.deleted_at && ag.situacao === "Ativo")
                }
                searchPlaceholder="Buscar por nome, CPF ou CNPJ..."
                emptyMessage="Nenhum agenciador encontrado."
                extraFilters={
                  <Select value={searchFilter} onValueChange={setSearchFilter}>
                    <SelectTrigger className="w-full sm:w-52">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="agenciadores">Apenas agenciadores</SelectItem>
                      <SelectItem value="todas">Todas as pessoas</SelectItem>
                    </SelectContent>
                  </Select>
                }
                columns={
                  [
                    {
                      key: "nome",
                      header: "Nome",
                      sortable: true,
                      render: (p) => (
                        <div className="flex items-center gap-3">
                          <Avatar className="h-9 w-9">
                            <AvatarFallback className="text-xs">
                              {p.nome.substring(0, 2).toUpperCase()}
                            </AvatarFallback>
                          </Avatar>
                          <span className="font-medium text-foreground">{p.nome}</span>
                        </div>
                      ),
                    },
                    {
                      key: "documento",
                      header: "Documento",
                      render: (p) => (p.tipo === "juridica" ? p.cnpj : p.cpf) || "—",
                    },
                    {
                      key: "tipo",
                      header: "Tipo",
                      sortable: true,
                      render: (p) => (
                        <Badge variant="outline" className="text-xs">
                          {p.tipo === "juridica" ? "Pessoa Jurídica" : "Pessoa Física"}
                        </Badge>
                      ),
                    },
                  ] as CadastroColumn<Pessoa>[]
                }
                onView={(p) => handleSelectPerson(p)}
                onEdit={(p) => handleSelectPerson(p)}
                onToggleStatus={handleToggleStatus}
              />
            </CardContent>
          </Card>
        )}

        {selectedPerson && (
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle>Dados do Agenciador Selecionado</CardTitle>
                <Button variant="outline" onClick={() => setSelectedPerson(null)}>
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <Tabs defaultValue="agenciador" className="w-full">
                <TabsList className="grid w-full grid-cols-4">
                  <TabsTrigger value="agenciador">Dados Agenciador</TabsTrigger>
                  <TabsTrigger value="dados">Dados Pessoais</TabsTrigger>
                  <TabsTrigger value="enderecos">
                    Endereços ({selectedPerson.enderecos?.length || 0})
                    <Button
                      variant="ghost"
                      size="sm"
                      className="ml-2 h-5 w-5 p-0"
                      onClick={(e) => {
                        e.stopPropagation()
                        setShowAddEnderecoModal(true)
                      }}
                    >
                      <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                      </svg>
                    </Button>
                  </TabsTrigger>
                  <TabsTrigger value="bancarios">
                    Dados Bancários ({selectedPerson.dados_bancarios?.length || 0})
                    <Button
                      variant="ghost"
                      size="sm"
                      className="ml-2 h-5 w-5 p-0"
                      onClick={(e) => {
                        e.stopPropagation()
                        setShowAddBancoModal(true)
                      }}
                    >
                      <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                      </svg>
                    </Button>
                  </TabsTrigger>
                </TabsList>

                <TabsContent value="agenciador">
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <h3 className="text-lg font-medium">Dados do Agenciador</h3>
                      <div className="flex gap-2">
                        {isAgenciador ? (
                          <>
                            <Button variant="outline" size="sm" onClick={() => setShowEditAgenciadorModal(true)}>
                              <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  strokeWidth={2}
                                  d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
                                />
                              </svg>
                              Editar
                            </Button>
                            <Button variant="destructive" size="sm" onClick={() => setShowDeleteDialog(true)}>
                              <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  strokeWidth={2}
                                  d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                                />
                              </svg>
                              Excluir
                            </Button>
                          </>
                        ) : (
                          <Button onClick={() => setShowAgenciadorModal(true)}>
                            <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                            </svg>
                            Cadastrar como Agenciador
                          </Button>
                        )}
                      </div>
                    </div>

                    {isAgenciador ? (
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div>
                          <Label className="text-sm font-medium text-muted-foreground">Situação</Label>
                          <Badge variant={agenciadorData.situacao === "Ativo" ? "default" : "secondary"}>
                            {agenciadorData.situacao}
                          </Badge>
                        </div>
                      </div>
                    ) : (
                      <div className="text-center py-8">
                        <p className="text-muted-foreground">Esta pessoa ainda não está cadastrada como agenciador.</p>
                        <p className="text-sm text-muted-foreground mt-2">
                          Clique em "Cadastrar como Agenciador" para adicionar os dados específicos.
                        </p>
                      </div>
                    )}
                  </div>
                </TabsContent>

                <TabsContent value="dados">
                  {selectedPerson.tipo === "juridica" ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                      <div>
                        <Label className="text-sm font-medium text-muted-foreground">Nome</Label>
                        <p className="text-foreground">{selectedPerson.nome}</p>
                      </div>
                      <div>
                        <Label className="text-sm font-medium text-muted-foreground">CNPJ</Label>
                        <p className="text-foreground">{selectedPerson.cnpj}</p>
                      </div>
                      <div>
                        <Label className="text-sm font-medium text-muted-foreground">Inscrição Estadual</Label>
                        <p className="text-foreground">{selectedPerson.inscricao_estadual || "-"}</p>
                      </div>
                    </div>
                  ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                      <div>
                        <Label className="text-sm font-medium text-muted-foreground">Nome</Label>
                        <p className="text-foreground">{selectedPerson.nome}</p>
                      </div>
                      <div>
                        <Label className="text-sm font-medium text-muted-foreground">CPF</Label>
                        <p className="text-foreground">{selectedPerson.cpf}</p>
                      </div>
                      <div>
                        <Label className="text-sm font-medium text-muted-foreground">RG</Label>
                        <p className="text-foreground">{selectedPerson.rg}</p>
                      </div>
                      <div>
                        <Label className="text-sm font-medium text-muted-foreground">Data de Nascimento</Label>
                        <p className="text-foreground">{selectedPerson.data_nascimento}</p>
                      </div>
                    </div>
                  )}
                </TabsContent>

                <TabsContent value="enderecos">
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <h3 className="text-lg font-medium">Endereços Cadastrados</h3>
                      <Button onClick={() => setShowAddEnderecoModal(true)}>
                        <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                        </svg>
                        Adicionar Endereço
                      </Button>
                    </div>

                    {!selectedPerson.enderecos || selectedPerson.enderecos.length === 0 ? (
                      <div className="text-center py-8">
                        <p className="text-muted-foreground mb-4">Nenhum endereço cadastrado.</p>
                        <Button onClick={() => setShowAddEnderecoModal(true)}>Cadastrar Primeiro Endereço</Button>
                      </div>
                    ) : (
                      <div className="space-y-4">
                        {selectedPerson.enderecos.map((endereco) => (
                          <AddressCard
                            key={endereco.id}
                            endereco={endereco}
                            onEdit={(endereco) => {
                              setEditingEndereco(endereco as unknown as Endereco)
                              setShowEditEnderecoModal(true)
                            }}
                            onDelete={(id) => handleDeleteEndereco(id)}
                          />
                        ))}
                      </div>
                    )}
                  </div>
                </TabsContent>

                <TabsContent value="bancarios">
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <h3 className="text-lg font-medium">Dados Bancários</h3>
                      <Button onClick={() => setShowAddBancoModal(true)}>
                        <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                        </svg>
                        Adicionar Conta
                      </Button>
                    </div>

                    {!selectedPerson.dados_bancarios || selectedPerson.dados_bancarios.length === 0 ? (
                      <div className="text-center py-8">
                        <p className="text-muted-foreground mb-4">Nenhuma conta bancária cadastrada.</p>
                        <Button onClick={() => setShowAddBancoModal(true)}>Cadastrar Primeira Conta</Button>
                      </div>
                    ) : (
                      <div className="space-y-4">
                        {selectedPerson.dados_bancarios.map((banco) => (
                          <BankAccountCard
                            key={banco.id}
                            dadoBancario={banco}
                            onEdit={(banco) => {
                              setEditingBanco(banco as unknown as DadoBancario)
                              setShowEditBancoModal(true)
                            }}
                            onDelete={(id) => handleDeleteBanco(id)}
                          />
                        ))}
                      </div>
                    )}
                  </div>
                </TabsContent>
              </Tabs>
            </CardContent>
          </Card>
        )}

        <PersonModal
          isOpen={showNewPersonModal}
          onClose={() => setShowNewPersonModal(false)}
          onSave={handleNewPersonSave}
          title="Cadastrar Nova Pessoa"
          description="Cadastre uma nova pessoa no sistema"
          allowedTypes={["fisica", "juridica"]}
          showAddressTabs={true}
          showBankTabs={true}
          className="max-w-7xl w-full"
        />

        <Dialog open={showAgenciadorModal} onOpenChange={setShowAgenciadorModal}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Cadastrar como Agenciador</DialogTitle>
              <DialogDescription>Preencha os dados específicos do agenciador</DialogDescription>
            </DialogHeader>
            <div className="space-y-4 py-4">
              <div>
                <Label>Situação</Label>
                <Select
                  value={agenciadorData.situacao}
                  onValueChange={(value: "Ativo" | "Inativo") =>
                    setAgenciadorData({ ...agenciadorData, situacao: value })
                  }
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Ativo">Ativo</SelectItem>
                    <SelectItem value="Inativo">Inativo</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setShowAgenciadorModal(false)}>
                Cancelar
              </Button>
              <Button onClick={handleSaveAgenciador} disabled={isLoading}>
                {isLoading ? "Salvando..." : "Salvar"}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        <Dialog open={showEditAgenciadorModal} onOpenChange={setShowEditAgenciadorModal}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Editar Agenciador</DialogTitle>
              <DialogDescription>Atualize os dados do agenciador</DialogDescription>
            </DialogHeader>
            <div className="space-y-4 py-4">
              <div>
                <Label>Situação</Label>
                <Select
                  value={agenciadorData.situacao}
                  onValueChange={(value: "Ativo" | "Inativo") =>
                    setAgenciadorData({ ...agenciadorData, situacao: value })
                  }
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Ativo">Ativo</SelectItem>
                    <SelectItem value="Inativo">Inativo</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setShowEditAgenciadorModal(false)}>
                Cancelar
              </Button>
              <Button onClick={handleSaveAgenciador} disabled={isLoading}>
                {isLoading ? "Salvando..." : "Salvar"}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        <Dialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Confirmar Exclusão</DialogTitle>
              <DialogDescription>
                Tem certeza que deseja excluir este agenciador? Esta ação não pode ser desfeita.
              </DialogDescription>
            </DialogHeader>
            <DialogFooter>
              <Button variant="outline" onClick={() => setShowDeleteDialog(false)}>
                Cancelar
              </Button>
              <Button variant="destructive" onClick={handleDeleteAgenciador} disabled={isLoading}>
                {isLoading ? "Excluindo..." : "Excluir"}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        <AddressModal
          isOpen={showAddEnderecoModal}
          onClose={() => setShowAddEnderecoModal(false)}
          onSave={handleSaveEndereco}
          title="Adicionar Endereço"
        />

        <AddressModal
          isOpen={showEditEnderecoModal}
          onClose={() => setShowEditEnderecoModal(false)}
          onSave={(enderecoData) => {
            setShowEditEnderecoModal(false)
          }}
          title="Editar Endereço"
          endereco={editingEndereco}
        />

        <BankAccountModal
          isOpen={showAddBancoModal}
          onClose={() => setShowAddBancoModal(false)}
          onSave={handleSaveBanco}
          title="Adicionar Conta Bancária"
        />

        <BankAccountModal
          isOpen={showEditBancoModal}
          onClose={() => setShowEditBancoModal(false)}
          onSave={(bancoData) => {
            setShowEditBancoModal(false)
          }}
          title="Editar Conta Bancária"
          dadoBancario={editingBanco}
        />
      </div>
    </div>
  )
}
