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
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { PersonModal } from "@/components/shared/person-modal"
import { AddressCard } from "@/components/shared/address-card"
import { BankAccountCard } from "@/components/shared/bank-account-card"
import { AddressModal } from "@/components/shared/address-modal"
import { BankAccountModal } from "@/components/shared/bank-account-modal"
import { useToast } from "@/hooks/use-toast"
import { Loader2 } from "lucide-react"

interface Corretor {
  id: number
  pessoa_id: number
  situacao: "ativo" | "inativo"
  created_at?: string
  updated_at?: string
}

interface Endereco {
  id: number
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
  banco: string
  agencia: string
  tipo_conta: "corrente" | "poupanca"
  conta: string
  digito_conta: string
}

interface Pessoa {
  id: number
  tipo_pessoa: "fisica" | "juridica"
  nome?: string
  razao_social?: string
  nome_fantasia?: string
  cnpj?: string
  cpf?: string
  rg?: string
  data_nascimento?: string
  data_fundacao?: string
  inscricao_estadual?: string
  inscricao_municipal?: string
  telefone?: string
  celular?: string
  email?: string
  site?: string
  status: string
  total_enderecos?: number
  total_contas?: number
}

export default function CorretorPage() {
  const { toast } = useToast()
  const [loading, setLoading] = useState(false)
  const [searchTerm, setSearchTerm] = useState("")
  const [searchFilter, setSearchFilter] = useState("todas")
  const [searchResults, setSearchResults] = useState<Pessoa[]>([])
  const [showResults, setShowResults] = useState(false)
  const [selectedPerson, setSelectedPerson] = useState<Pessoa | null>(null)
  const [showNewPersonModal, setShowNewPersonModal] = useState(false)
  const [showCorretorModal, setShowCorretorModal] = useState(false)
  const [showEditCorretorModal, setShowEditCorretorModal] = useState(false)
  const [showDeleteDialog, setShowDeleteDialog] = useState(false)

  const [showAddEnderecoModal, setShowAddEnderecoModal] = useState(false)
  const [showAddBancoModal, setShowAddBancoModal] = useState(false)
  const [showEditEnderecoModal, setShowEditEnderecoModal] = useState(false)
  const [showEditBancoModal, setShowEditBancoModal] = useState(false)
  const [editingEndereco, setEditingEndereco] = useState<Endereco | null>(null)
  const [editingBanco, setEditingBanco] = useState<DadoBancario | null>(null)

  const [enderecos, setEnderecos] = useState<Endereco[]>([])
  const [dadosBancarios, setDadosBancarios] = useState<DadoBancario[]>([])
  const [corretores, setCorretores] = useState<Corretor[]>([])
  const [currentCorretor, setCurrentCorretor] = useState<Corretor | null>(null)

  const [corretorData, setCorretorData] = useState({
    situacao: "ativo" as "ativo" | "inativo",
  })

  useEffect(() => {
    loadCorretores()
  }, [])

  useEffect(() => {
    if (selectedPerson) {
      loadEnderecos(selectedPerson.id)
      loadDadosBancarios(selectedPerson.id)
      loadCorretorData(selectedPerson.id)
    }
  }, [selectedPerson])

  const loadCorretores = async () => {
    try {
      const response = await fetch("/api/corretores")
      const data = await response.json()
      if (data.success) {
        setCorretores(data.data)
      }
    } catch (error) {
      console.error("Erro ao carregar corretores:", error)
    }
  }

  const loadEnderecos = async (pessoaId: number) => {
    try {
      const response = await fetch(`/api/enderecos?pessoa_id=${pessoaId}`)
      const data = await response.json()
      if (data.success) {
        setEnderecos(data.data)
      }
    } catch (error) {
      console.error("Erro ao carregar endereços:", error)
    }
  }

  const loadDadosBancarios = async (pessoaId: number) => {
    try {
      const response = await fetch(`/api/dados-bancarios?pessoa_id=${pessoaId}`)
      const data = await response.json()
      if (data.success) {
        setDadosBancarios(data.data)
      }
    } catch (error) {
      console.error("Erro ao carregar dados bancários:", error)
    }
  }

  const loadCorretorData = async (pessoaId: number) => {
    try {
      const corretor = corretores.find((c) => c.pessoa_id === pessoaId)
      if (corretor) {
        setCurrentCorretor(corretor)
        setCorretorData({
          situacao: corretor.situacao,
        })
      } else {
        setCurrentCorretor(null)
        setCorretorData({
          situacao: "ativo",
        })
      }
    } catch (error) {
      console.error("Erro ao carregar dados do corretor:", error)
    }
  }

  const handleSearch = async () => {
    if (!searchTerm.trim()) {
      setSearchResults([])
      setShowResults(false)
      return
    }

    try {
      setLoading(true)
      const response = await fetch(`/api/pessoas?search=${encodeURIComponent(searchTerm)}`)
      const data = await response.json()

      if (data.success) {
        let results = data.data

        if (searchFilter === "corretores") {
          results = results.filter((pessoa: Pessoa) => corretores.some((cor) => cor.pessoa_id === pessoa.id))
        }

        setSearchResults(results)
        setShowResults(true)
        setSelectedPerson(null)
      } else {
        throw new Error(data.message)
      }
    } catch (error: any) {
      toast({
        title: "Erro",
        description: error.message || "Erro ao buscar pessoas",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  const handleSelectPerson = (pessoa: Pessoa) => {
    setSelectedPerson(pessoa)
    setShowResults(false)
  }

  const handleBackToSearch = () => {
    setSelectedPerson(null)
    setEnderecos([])
    setDadosBancarios([])
    setCurrentCorretor(null)
    setShowResults(searchResults.length > 0)
  }

  const handleSaveCorretor = async () => {
    if (!selectedPerson) return

    try {
      setLoading(true)

      if (currentCorretor) {
        const response = await fetch(`/api/corretores/${currentCorretor.id}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(corretorData),
        })

        const data = await response.json()

        if (data.success) {
          toast({
            title: "Sucesso",
            description: "Corretor atualizado com sucesso",
          })
          await loadCorretores()
          await loadCorretorData(selectedPerson.id)
          setShowEditCorretorModal(false)
        } else {
          throw new Error(data.message)
        }
      } else {
        const response = await fetch("/api/corretores", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            pessoa_id: selectedPerson.id,
            ...corretorData,
          }),
        })

        const data = await response.json()

        if (data.success) {
          toast({
            title: "Sucesso",
            description: "Corretor cadastrado com sucesso",
          })
          await loadCorretores()
          await loadCorretorData(selectedPerson.id)
          setShowCorretorModal(false)
        } else {
          throw new Error(data.message)
        }
      }
    } catch (error: any) {
      toast({
        title: "Erro",
        description: error.message || "Erro ao salvar corretor",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  const handleDeleteCorretor = async () => {
    if (!currentCorretor) return

    try {
      setLoading(true)

      const response = await fetch(`/api/corretores/${currentCorretor.id}`, {
        method: "DELETE",
      })

      const data = await response.json()

      if (data.success) {
        toast({
          title: "Sucesso",
          description: "Corretor excluído com sucesso",
        })
        await loadCorretores()
        setCurrentCorretor(null)
        setShowDeleteDialog(false)
        setSelectedPerson(null)
      } else {
        throw new Error(data.message)
      }
    } catch (error: any) {
      toast({
        title: "Erro",
        description: error.message || "Erro ao excluir corretor",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  const handleNewPersonSave = async (personData: any) => {
    try {
      setLoading(true)

      const response = await fetch("/api/pessoas", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(personData),
      })

      const data = await response.json()

      if (data.success) {
        toast({
          title: "Sucesso",
          description: "Pessoa cadastrada com sucesso",
        })
        setShowNewPersonModal(false)
        handleSearch()
      } else {
        throw new Error(data.message)
      }
    } catch (error: any) {
      toast({
        title: "Erro",
        description: error.message || "Erro ao cadastrar pessoa",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  const handleSaveEndereco = async (enderecoData: any) => {
    if (!selectedPerson) return

    try {
      setLoading(true)

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
        await loadEnderecos(selectedPerson.id)
        setShowAddEnderecoModal(false)
      } else {
        throw new Error(data.message)
      }
    } catch (error: any) {
      toast({
        title: "Erro",
        description: error.message || "Erro ao adicionar endereço",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  const handleSaveBanco = async (bancoData: any) => {
    if (!selectedPerson) return

    try {
      setLoading(true)

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
          description: "Dados bancários adicionados com sucesso",
        })
        await loadDadosBancarios(selectedPerson.id)
        setShowAddBancoModal(false)
      } else {
        throw new Error(data.message)
      }
    } catch (error: any) {
      toast({
        title: "Erro",
        description: error.message || "Erro ao adicionar dados bancários",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  const handleDeleteEndereco = async (enderecoId: number) => {
    if (!selectedPerson) return

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
        await loadEnderecos(selectedPerson.id)
      } else {
        throw new Error(data.message)
      }
    } catch (error: any) {
      toast({
        title: "Erro",
        description: error.message || "Erro ao excluir endereço",
        variant: "destructive",
      })
    }
  }

  const handleDeleteBanco = async (bancoId: number) => {
    if (!selectedPerson) return

    try {
      const response = await fetch(`/api/dados-bancarios/${bancoId}`, {
        method: "DELETE",
      })

      const data = await response.json()

      if (data.success) {
        toast({
          title: "Sucesso",
          description: "Dados bancários excluídos com sucesso",
        })
        await loadDadosBancarios(selectedPerson.id)
      } else {
        throw new Error(data.message)
      }
    } catch (error: any) {
      toast({
        title: "Erro",
        description: error.message || "Erro ao excluir dados bancários",
        variant: "destructive",
      })
    }
  }

  const isCorretor = currentCorretor !== null

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-6 py-6">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-2xl font-bold text-foreground">Corretores</h1>
            <p className="text-muted-foreground">Gerencie os corretores do sistema</p>
          </div>
          {selectedPerson && (
            <Button variant="outline" onClick={handleBackToSearch}>
              <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
              </svg>
              Voltar à Pesquisa
            </Button>
          )}
        </div>

        {!selectedPerson && (
          <div className="mb-6">
            <Card className="bg-emerald-700 text-white border-emerald-600">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-emerald-100 text-sm font-medium">Total de Corretores</p>
                    <p className="text-3xl font-bold">{corretores.length}</p>
                    <p className="text-emerald-200 text-sm">Cadastrados no sistema</p>
                  </div>
                  <div className="h-12 w-12 bg-emerald-600 rounded-lg flex items-center justify-center">
                    <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                      />
                    </svg>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {!selectedPerson && (
          <Card className="mb-6">
            <CardHeader>
              <CardTitle>Pesquisar Corretor</CardTitle>
              <CardDescription>Digite o nome, CPF ou CNPJ para pesquisar</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div>
                  <Label>Filtro de Pesquisa</Label>
                  <Select value={searchFilter} onValueChange={setSearchFilter}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="todas">Todas as Pessoas</SelectItem>
                      <SelectItem value="corretores">Apenas Corretores</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="flex gap-4">
                  <div className="flex-1">
                    <Input
                      placeholder="Digite aqui..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      onKeyPress={(e) => e.key === "Enter" && handleSearch()}
                    />
                  </div>
                  <Button onClick={handleSearch} className="bg-cyan-500 hover:bg-cyan-600" disabled={loading}>
                    {loading ? (
                      <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    ) : (
                      <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                        />
                      </svg>
                    )}
                    Pesquisar
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {showResults && !selectedPerson && (
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle>Resultados da Pesquisa</CardTitle>
                  <CardDescription>{searchResults.length} pessoa(s) encontrada(s)</CardDescription>
                </div>
                {searchResults.length === 0 && (
                  <Button onClick={() => setShowNewPersonModal(true)}>
                    <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                    </svg>
                    Nova Pessoa
                  </Button>
                )}
              </div>
            </CardHeader>
            <CardContent>
              {searchResults.length === 0 ? (
                <div className="text-center py-8">
                  <p className="text-muted-foreground">Nenhuma pessoa encontrada com os critérios informados.</p>
                </div>
              ) : (
                <div className="space-y-3">
                  {searchResults.map((pessoa) => {
                    const isCor = corretores.some((cor) => cor.pessoa_id === pessoa.id)

                    return (
                      <div
                        key={pessoa.id}
                        className="flex items-center justify-between p-4 border rounded-lg hover:bg-muted/50 cursor-pointer transition-colors"
                        onClick={() => handleSelectPerson(pessoa)}
                      >
                        <div className="flex items-center gap-3">
                          <Avatar className="h-10 w-10">
                            <AvatarFallback>
                              {pessoa.tipo_pessoa === "juridica"
                                ? (pessoa.nome_fantasia || pessoa.razao_social || pessoa.nome || "")
                                    .substring(0, 2)
                                    .toUpperCase()
                                : (pessoa.nome || "").substring(0, 2).toUpperCase()}
                            </AvatarFallback>
                          </Avatar>
                          <div>
                            <p className="font-medium">{pessoa.razao_social || pessoa.nome}</p>
                            <p className="text-sm text-muted-foreground">
                              {pessoa.tipo_pessoa === "juridica" ? `CNPJ: ${pessoa.cnpj}` : `CPF: ${pessoa.cpf}`}
                            </p>
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          <Badge variant="outline">
                            {pessoa.tipo_pessoa === "juridica" ? "Pessoa Jurídica" : "Pessoa Física"}
                          </Badge>
                          {isCor && <Badge variant="default">Corretor</Badge>}
                          <Button variant="ghost" size="sm">
                            Ver Detalhes
                          </Button>
                        </div>
                      </div>
                    )
                  })}
                </div>
              )}
            </CardContent>
          </Card>
        )}

        {selectedPerson && (
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle>Dados do Corretor Selecionado</CardTitle>
                <Button variant="outline" onClick={() => setSelectedPerson(null)}>
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <Tabs defaultValue="corretor" className="w-full">
                <TabsList className="grid w-full grid-cols-4">
                  <TabsTrigger value="corretor">Dados Corretor</TabsTrigger>
                  <TabsTrigger value="dados">Dados Pessoais</TabsTrigger>
                  <TabsTrigger value="enderecos">Endereços ({enderecos.length})</TabsTrigger>
                  <TabsTrigger value="bancarios">Dados Bancários ({dadosBancarios.length})</TabsTrigger>
                </TabsList>

                <TabsContent value="corretor">
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <h3 className="text-lg font-medium">Dados do Corretor</h3>
                      <div className="flex gap-2">
                        {isCorretor ? (
                          <>
                            <Button variant="outline" size="sm" onClick={() => setShowEditCorretorModal(true)}>
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
                          <Button onClick={() => setShowCorretorModal(true)}>
                            <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                            </svg>
                            Cadastrar como Corretor
                          </Button>
                        )}
                      </div>
                    </div>

                    {isCorretor ? (
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div>
                          <Label className="text-sm font-medium text-muted-foreground">Situação</Label>
                          <Badge variant={corretorData.situacao === "ativo" ? "default" : "secondary"}>
                            {corretorData.situacao}
                          </Badge>
                        </div>
                      </div>
                    ) : (
                      <div className="text-center py-8">
                        <p className="text-muted-foreground">Esta pessoa ainda não está cadastrada como corretor.</p>
                        <p className="text-sm text-muted-foreground mt-2">
                          Clique em "Cadastrar como Corretor" para adicionar os dados específicos.
                        </p>
                      </div>
                    )}
                  </div>
                </TabsContent>

                <TabsContent value="dados">
                  {selectedPerson.tipo_pessoa === "juridica" ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                      {selectedPerson.razao_social && (
                        <div>
                          <Label className="text-sm font-medium text-muted-foreground">Razão Social</Label>
                          <p className="text-foreground">{selectedPerson.razao_social}</p>
                        </div>
                      )}
                      {selectedPerson.nome_fantasia && (
                        <div>
                          <Label className="text-sm font-medium text-muted-foreground">Nome Fantasia</Label>
                          <p className="text-foreground">{selectedPerson.nome_fantasia}</p>
                        </div>
                      )}
                      {selectedPerson.cnpj && (
                        <div>
                          <Label className="text-sm font-medium text-muted-foreground">CNPJ</Label>
                          <p className="text-foreground">{selectedPerson.cnpj}</p>
                        </div>
                      )}
                      {selectedPerson.data_fundacao && (
                        <div>
                          <Label className="text-sm font-medium text-muted-foreground">Data Fundação</Label>
                          <p className="text-foreground">
                            {new Date(selectedPerson.data_fundacao).toLocaleDateString("pt-BR")}
                          </p>
                        </div>
                      )}
                      {selectedPerson.inscricao_estadual && (
                        <div>
                          <Label className="text-sm font-medium text-muted-foreground">Inscrição Estadual</Label>
                          <p className="text-foreground">{selectedPerson.inscricao_estadual}</p>
                        </div>
                      )}
                      {selectedPerson.inscricao_municipal && (
                        <div>
                          <Label className="text-sm font-medium text-muted-foreground">Inscrição Municipal</Label>
                          <p className="text-foreground">{selectedPerson.inscricao_municipal}</p>
                        </div>
                      )}
                    </div>
                  ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                      {selectedPerson.nome && (
                        <div>
                          <Label className="text-sm font-medium text-muted-foreground">Nome</Label>
                          <p className="text-foreground">{selectedPerson.nome}</p>
                        </div>
                      )}
                      {selectedPerson.cpf && (
                        <div>
                          <Label className="text-sm font-medium text-muted-foreground">CPF</Label>
                          <p className="text-foreground">{selectedPerson.cpf}</p>
                        </div>
                      )}
                      {selectedPerson.rg && (
                        <div>
                          <Label className="text-sm font-medium text-muted-foreground">RG</Label>
                          <p className="text-foreground">{selectedPerson.rg}</p>
                        </div>
                      )}
                      {selectedPerson.data_nascimento && (
                        <div>
                          <Label className="text-sm font-medium text-muted-foreground">Data de Nascimento</Label>
                          <p className="text-foreground">
                            {new Date(selectedPerson.data_nascimento).toLocaleDateString("pt-BR")}
                          </p>
                        </div>
                      )}
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

                    {enderecos.length === 0 ? (
                      <div className="text-center py-8">
                        <p className="text-muted-foreground mb-4">Nenhum endereço cadastrado.</p>
                        <Button onClick={() => setShowAddEnderecoModal(true)}>Cadastrar Primeiro Endereço</Button>
                      </div>
                    ) : (
                      <div className="space-y-4">
                        {enderecos.map((endereco) => (
                          <AddressCard
                            key={endereco.id}
                            endereco={endereco}
                            onEdit={(endereco) => {
                              setEditingEndereco(endereco)
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

                    {dadosBancarios.length === 0 ? (
                      <div className="text-center py-8">
                        <p className="text-muted-foreground mb-4">Nenhuma conta bancária cadastrada.</p>
                        <Button onClick={() => setShowAddBancoModal(true)}>Cadastrar Primeira Conta</Button>
                      </div>
                    ) : (
                      <div className="space-y-4">
                        {dadosBancarios.map((banco) => (
                          <BankAccountCard
                            key={banco.id}
                            dadoBancario={banco}
                            onEdit={(banco) => {
                              setEditingBanco(banco)
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

        {/* Modal para cadastrar corretor */}
        <Dialog open={showCorretorModal} onOpenChange={setShowCorretorModal}>
          <DialogContent className="sm:max-w-[425px]">
            <DialogHeader>
              <DialogTitle>Cadastrar como Corretor</DialogTitle>
              <DialogDescription>Preencha os dados específicos do corretor</DialogDescription>
            </DialogHeader>
            <div className="space-y-4">
              <div>
                <Label htmlFor="situacao">Situação *</Label>
                <Select
                  value={corretorData.situacao}
                  onValueChange={(value: "ativo" | "inativo") => setCorretorData({ ...corretorData, situacao: value })}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="ativo">Ativo</SelectItem>
                    <SelectItem value="inativo">Inativo</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div className="flex justify-end gap-2 mt-6">
              <Button variant="outline" onClick={() => setShowCorretorModal(false)} disabled={loading}>
                Cancelar
              </Button>
              <Button onClick={handleSaveCorretor} disabled={loading}>
                {loading ? <Loader2 className="h-4 w-4 mr-2 animate-spin" /> : null}
                Salvar Corretor
              </Button>
            </div>
          </DialogContent>
        </Dialog>

        {/* Modal para editar corretor */}
        <Dialog open={showEditCorretorModal} onOpenChange={setShowEditCorretorModal}>
          <DialogContent className="sm:max-w-[425px]">
            <DialogHeader>
              <DialogTitle>Editar Dados do Corretor</DialogTitle>
              <DialogDescription>Altere os dados específicos do corretor</DialogDescription>
            </DialogHeader>
            <div className="space-y-4">
              <div>
                <Label htmlFor="editSituacao">Situação *</Label>
                <Select
                  value={corretorData.situacao}
                  onValueChange={(value: "ativo" | "inativo") => setCorretorData({ ...corretorData, situacao: value })}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="ativo">Ativo</SelectItem>
                    <SelectItem value="inativo">Inativo</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div className="flex justify-end gap-2 mt-6">
              <Button variant="outline" onClick={() => setShowEditCorretorModal(false)} disabled={loading}>
                Cancelar
              </Button>
              <Button onClick={handleSaveCorretor} disabled={loading}>
                {loading ? <Loader2 className="h-4 w-4 mr-2 animate-spin" /> : null}
                Salvar Alterações
              </Button>
            </div>
          </DialogContent>
        </Dialog>

        {/* Dialog de Confirmação de Exclusão */}
        <Dialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Confirmar Exclusão</DialogTitle>
              <DialogDescription>
                Tem certeza que deseja excluir este corretor? Esta ação não pode ser desfeita.
              </DialogDescription>
            </DialogHeader>
            <div className="flex justify-end gap-2 mt-4">
              <Button variant="outline" onClick={() => setShowDeleteDialog(false)} disabled={loading}>
                Cancelar
              </Button>
              <Button variant="destructive" onClick={handleDeleteCorretor} disabled={loading}>
                {loading ? <Loader2 className="h-4 w-4 mr-2 animate-spin" /> : null}
                Excluir
              </Button>
            </div>
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
