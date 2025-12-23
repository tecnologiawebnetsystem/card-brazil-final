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
import { useToast } from "@/hooks/use-toast"
import { Loader2 } from "lucide-react"

interface Estipulante {
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

const BriefcaseIcon = () => (
  <svg className="w-8 h-8 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 14l9-5-9-5-9 5 9 5z" />
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="M12 14l6.16-3.422a12.083 12.083 0 01.665 6.479A11.952 11.952 0 0012 20.055a11.952 11.952 0 00-6.824-2.998 12.078 12.078 0 01.665-6.479L12 14z"
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

const MoreIcon = () => (
  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="M12 5v.01M12 12v.01M12 19v.01M12 6a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2z"
    />
  </svg>
)

export default function EstipulantePage() {
  const { toast } = useToast()
  const [loading, setLoading] = useState(false)
  const [searchTerm, setSearchTerm] = useState("")
  const [searchFilter, setSearchFilter] = useState("todas")
  const [searchResults, setSearchResults] = useState<Pessoa[]>([])
  const [showResults, setShowResults] = useState(false)
  const [selectedPerson, setSelectedPerson] = useState<Pessoa | null>(null)
  const [showNewPersonModal, setShowNewPersonModal] = useState(false)
  const [showEstipulanteModal, setShowEstipulanteModal] = useState(false)
  const [showEditEstipulanteModal, setShowEditEstipulanteModal] = useState(false)
  const [showDeleteDialog, setShowDeleteDialog] = useState(false)

  const [showAddEnderecoModal, setShowAddEnderecoModal] = useState(false)
  const [showAddBancoModal, setShowAddBancoModal] = useState(false)
  const [showEditEnderecoModal, setShowEditEnderecoModal] = useState(false)
  const [showEditBancoModal, setShowEditBancoModal] = useState(false)
  const [editingEndereco, setEditingEndereco] = useState<Endereco | null>(null)
  const [editingBanco, setEditingBanco] = useState<DadoBancario | null>(null)

  const [enderecos, setEnderecos] = useState<Endereco[]>([])
  const [dadosBancarios, setDadosBancarios] = useState<DadoBancario[]>([])
  const [estipulantes, setEstipulantes] = useState<Estipulante[]>([])
  const [currentEstipulante, setCurrentEstipulante] = useState<Estipulante | null>(null)

  const [estipulanteData, setEstipulanteData] = useState({
    situacao: "ativo" as "ativo" | "inativo",
  })

  const [newEnderecoData, setNewEnderecoData] = useState({
    tipo: "comercial" as "residencial" | "comercial" | "cobranca",
    cep: "",
    logradouro: "",
    numero: "",
    complemento: "",
    bairro: "",
    cidade: "",
    estado: "",
    email: "",
  })

  const [newBancoData, setNewBancoData] = useState({
    banco: "",
    agencia: "",
    tipo_conta: "corrente" as "corrente" | "poupanca",
    conta: "",
    digito_conta: "",
  })

  useEffect(() => {
    loadEstipulantes()
  }, [])

  useEffect(() => {
    if (selectedPerson) {
      loadEnderecos(selectedPerson.id)
      loadDadosBancarios(selectedPerson.id)
      loadEstipulanteData(selectedPerson.id)
    }
  }, [selectedPerson])

  const loadEstipulantes = async () => {
    try {
      const response = await fetch("/api/estipulantes")
      const data = await response.json()
      if (data.success) {
        setEstipulantes(data.data)
      }
    } catch (error) {
      console.error("Erro ao carregar estipulantes:", error)
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

  const loadEstipulanteData = async (pessoaId: number) => {
    try {
      const estipulante = estipulantes.find((e) => e.pessoa_id === pessoaId)
      if (estipulante) {
        setCurrentEstipulante(estipulante)
        setEstipulanteData({
          situacao: estipulante.situacao,
        })
      } else {
        setCurrentEstipulante(null)
        setEstipulanteData({
          situacao: "ativo",
        })
      }
    } catch (error) {
      console.error("Erro ao carregar dados do estipulante:", error)
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
      const response = await fetch(`/api/pessoas?tipo_pessoa=juridica&search=${encodeURIComponent(searchTerm)}`)
      const data = await response.json()

      if (data.success) {
        let results = data.data

        // Filtrar apenas estipulantes se necessário
        if (searchFilter === "estipulantes") {
          results = results.filter((pessoa: Pessoa) => estipulantes.some((est) => est.pessoa_id === pessoa.id))
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
    setCurrentEstipulante(null)
    setShowResults(searchResults.length > 0)
  }

  const handleSaveEstipulante = async () => {
    if (!selectedPerson) return

    try {
      setLoading(true)

      if (currentEstipulante) {
        // Atualizar estipulante existente
        const response = await fetch(`/api/estipulantes/${currentEstipulante.id}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(estipulanteData),
        })

        const data = await response.json()

        if (data.success) {
          toast({
            title: "Sucesso",
            description: "Estipulante atualizado com sucesso",
          })
          await loadEstipulantes()
          await loadEstipulanteData(selectedPerson.id)
          setShowEditEstipulanteModal(false)
        } else {
          throw new Error(data.message)
        }
      } else {
        // Criar novo estipulante
        const response = await fetch("/api/estipulantes", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            pessoa_id: selectedPerson.id,
            ...estipulanteData,
          }),
        })

        const data = await response.json()

        if (data.success) {
          toast({
            title: "Sucesso",
            description: "Estipulante cadastrado com sucesso",
          })
          await loadEstipulantes()
          await loadEstipulanteData(selectedPerson.id)
          setShowEstipulanteModal(false)
        } else {
          throw new Error(data.message)
        }
      }
    } catch (error: any) {
      toast({
        title: "Erro",
        description: error.message || "Erro ao salvar estipulante",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  const handleDeleteEstipulante = async () => {
    if (!currentEstipulante) return

    try {
      setLoading(true)

      const response = await fetch(`/api/estipulantes/${currentEstipulante.id}`, {
        method: "DELETE",
      })

      const data = await response.json()

      if (data.success) {
        toast({
          title: "Sucesso",
          description: "Estipulante excluído com sucesso",
        })
        await loadEstipulantes()
        setCurrentEstipulante(null)
        setShowDeleteDialog(false)
        setSelectedPerson(null)
      } else {
        throw new Error(data.message)
      }
    } catch (error: any) {
      toast({
        title: "Erro",
        description: error.message || "Erro ao excluir estipulante",
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
        body: JSON.stringify({
          ...personData,
          tipo_pessoa: "juridica",
        }),
      })

      const data = await response.json()

      if (data.success) {
        toast({
          title: "Sucesso",
          description: "Pessoa cadastrada com sucesso",
        })
        setShowNewPersonModal(false)
        // Buscar novamente para incluir a nova pessoa
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
        setNewEnderecoData({
          tipo: "comercial",
          cep: "",
          logradouro: "",
          numero: "",
          complemento: "",
          bairro: "",
          cidade: "",
          estado: "",
          email: "",
        })
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
        setNewBancoData({
          banco: "",
          agencia: "",
          tipo_conta: "corrente",
          conta: "",
          digito_conta: "",
        })
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

  const handleCepChange = async (cep: string) => {
    setNewEnderecoData({ ...newEnderecoData, cep })

    if (cep.length === 8) {
      try {
        const response = await fetch(`https://viacep.com.br/ws/${cep}/json/`)
        const data = await response.json()

        if (!data.erro) {
          setNewEnderecoData((prev) => ({
            ...prev,
            logradouro: data.logradouro || "",
            bairro: data.bairro || "",
            cidade: data.localidade || "",
            estado: data.uf || "",
          }))
        }
      } catch (error) {
        console.log("[v0] Erro ao buscar CEP:", error)
      }
    }
  }

  const isEstipulante = currentEstipulante !== null

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-6 py-6">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-2xl font-bold text-foreground">Estipulantes</h1>
            <p className="text-muted-foreground">Gerencie os estipulantes do sistema</p>
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
          <Card className="mb-6">
            <CardHeader>
              <CardTitle>Pesquisar Estipulante</CardTitle>
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
                      <SelectItem value="estipulantes">Apenas Estipulantes</SelectItem>
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
                  <CardDescription>{searchResults.length} pessoa(s) jurídica(s) encontrada(s)</CardDescription>
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
                  <p className="text-muted-foreground">
                    Nenhuma pessoa jurídica encontrada com os critérios informados.
                  </p>
                </div>
              ) : (
                <div className="space-y-3">
                  {searchResults.map((pessoa) => {
                    const isEst = estipulantes.some((est) => est.pessoa_id === pessoa.id)

                    return (
                      <div
                        key={pessoa.id}
                        className="flex items-center justify-between p-4 border rounded-lg hover:bg-muted/50 cursor-pointer transition-colors"
                        onClick={() => handleSelectPerson(pessoa)}
                      >
                        <div className="flex items-center gap-3">
                          <Avatar className="h-10 w-10">
                            <AvatarFallback>
                              {(pessoa.nome_fantasia || pessoa.razao_social || pessoa.nome || "")
                                .substring(0, 2)
                                .toUpperCase()}
                            </AvatarFallback>
                          </Avatar>
                          <div>
                            <p className="font-medium">{pessoa.razao_social || pessoa.nome}</p>
                            <p className="text-sm text-muted-foreground">CNPJ: {pessoa.cnpj}</p>
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          <Badge variant="outline">Pessoa Jurídica</Badge>
                          {isEst && <Badge variant="default">Estipulante</Badge>}
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
                <CardTitle>Dados do Estipulante Selecionado</CardTitle>
                <Button variant="outline" onClick={() => setSelectedPerson(null)}>
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <Tabs defaultValue="estipulante" className="w-full">
                <TabsList className="grid w-full grid-cols-4">
                  <TabsTrigger value="estipulante">Dados Estipulante</TabsTrigger>
                  <TabsTrigger value="dados">Dados Pessoais</TabsTrigger>
                  <TabsTrigger value="enderecos">
                    Endereços ({enderecos.length})
                    <Button
                      variant="ghost"
                      size="sm"
                      className="ml-2 h-5 w-5 p-0"
                      onClick={(e) => {
                        e.stopPropagation()
                        setShowAddEnderecoModal(true)
                      }}
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                      </svg>
                    </Button>
                  </TabsTrigger>
                  <TabsTrigger value="bancarios">
                    Dados Bancários ({dadosBancarios.length})
                    <Button
                      variant="ghost"
                      size="sm"
                      className="ml-2 h-5 w-5 p-0"
                      onClick={(e) => {
                        e.stopPropagation()
                        setShowAddBancoModal(true)
                      }}
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                      </svg>
                    </Button>
                  </TabsTrigger>
                </TabsList>

                <TabsContent value="estipulante">
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <h3 className="text-lg font-medium">Dados do Estipulante</h3>
                      <div className="flex gap-2">
                        {isEstipulante ? (
                          <>
                            <Button variant="outline" size="sm" onClick={() => setShowEditEstipulanteModal(true)}>
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
                          <Button onClick={() => setShowEstipulanteModal(true)}>
                            <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                            </svg>
                            Cadastrar como Estipulante
                          </Button>
                        )}
                      </div>
                    </div>

                    {isEstipulante ? (
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div>
                          <Label className="text-sm font-medium text-muted-foreground">Situação</Label>
                          <Badge variant={estipulanteData.situacao === "ativo" ? "default" : "secondary"}>
                            {estipulanteData.situacao}
                          </Badge>
                        </div>
                      </div>
                    ) : (
                      <div className="text-center py-8">
                        <p className="text-muted-foreground">Esta pessoa ainda não está cadastrada como estipulante.</p>
                        <p className="text-sm text-muted-foreground mt-2">
                          Clique em "Cadastrar como Estipulante" para adicionar os dados específicos.
                        </p>
                      </div>
                    )}
                  </div>
                </TabsContent>

                <TabsContent value="dados">
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <h3 className="text-lg font-medium">Dados Pessoais</h3>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      {selectedPerson.razao_social && (
                        <div>
                          <Label className="text-sm font-medium text-muted-foreground">Razão Social</Label>
                          <p className="font-medium">{selectedPerson.razao_social}</p>
                        </div>
                      )}
                      {selectedPerson.nome_fantasia && (
                        <div>
                          <Label className="text-sm font-medium text-muted-foreground">Nome Fantasia</Label>
                          <p className="font-medium">{selectedPerson.nome_fantasia}</p>
                        </div>
                      )}
                      {selectedPerson.cnpj && (
                        <div>
                          <Label className="text-sm font-medium text-muted-foreground">CNPJ</Label>
                          <p className="font-medium">{selectedPerson.cnpj}</p>
                        </div>
                      )}
                      {selectedPerson.inscricao_estadual && (
                        <div>
                          <Label className="text-sm font-medium text-muted-foreground">Inscrição Estadual</Label>
                          <p className="font-medium">{selectedPerson.inscricao_estadual}</p>
                        </div>
                      )}
                      {selectedPerson.inscricao_municipal && (
                        <div>
                          <Label className="text-sm font-medium text-muted-foreground">Inscrição Municipal</Label>
                          <p className="font-medium">{selectedPerson.inscricao_municipal}</p>
                        </div>
                      )}
                      {selectedPerson.data_fundacao && (
                        <div>
                          <Label className="text-sm font-medium text-muted-foreground">Data de Fundação</Label>
                          <p className="font-medium">
                            {new Date(selectedPerson.data_fundacao).toLocaleDateString("pt-BR")}
                          </p>
                        </div>
                      )}
                      {selectedPerson.telefone && (
                        <div>
                          <Label className="text-sm font-medium text-muted-foreground">Telefone</Label>
                          <p className="font-medium">{selectedPerson.telefone}</p>
                        </div>
                      )}
                      {selectedPerson.celular && (
                        <div>
                          <Label className="text-sm font-medium text-muted-foreground">Celular</Label>
                          <p className="font-medium">{selectedPerson.celular}</p>
                        </div>
                      )}
                      {selectedPerson.email && (
                        <div>
                          <Label className="text-sm font-medium text-muted-foreground">Email</Label>
                          <p className="font-medium">{selectedPerson.email}</p>
                        </div>
                      )}
                      {selectedPerson.site && (
                        <div>
                          <Label className="text-sm font-medium text-muted-foreground">Site</Label>
                          <p className="font-medium">{selectedPerson.site}</p>
                        </div>
                      )}
                    </div>
                  </div>
                </TabsContent>

                <TabsContent value="enderecos">
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <h3 className="text-lg font-medium">Endereços</h3>
                      {enderecos.length === 0 && (
                        <Button onClick={() => setShowAddEnderecoModal(true)}>
                          <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                          </svg>
                          Adicionar Endereço
                        </Button>
                      )}
                    </div>

                    {enderecos.length === 0 ? (
                      <div className="text-center py-8">
                        <p className="text-muted-foreground">Nenhum endereço cadastrado.</p>
                        <p className="text-sm text-muted-foreground mt-2">
                          Clique em "Adicionar Endereço" para cadastrar um novo endereço.
                        </p>
                      </div>
                    ) : (
                      <div className="space-y-4">
                        {enderecos.map((endereco) => (
                          <Card key={endereco.id}>
                            <CardContent className="pt-4">
                              <div className="flex items-start justify-between">
                                <div className="flex-1">
                                  <div className="flex items-center gap-2 mb-2">
                                    <Badge variant="outline" className="capitalize">
                                      {endereco.tipo}
                                    </Badge>
                                  </div>
                                  <p className="font-medium">
                                    {endereco.logradouro}, {endereco.numero}
                                  </p>
                                  {endereco.complemento && (
                                    <p className="text-sm text-muted-foreground">{endereco.complemento}</p>
                                  )}
                                  <p className="text-sm text-muted-foreground">
                                    {endereco.bairro}, {endereco.cidade} - {endereco.estado}
                                  </p>
                                  <p className="text-sm text-muted-foreground">CEP: {endereco.cep}</p>
                                  {endereco.email && (
                                    <p className="text-sm text-muted-foreground">Email: {endereco.email}</p>
                                  )}
                                </div>
                                <div className="flex gap-2">
                                  <Button
                                    variant="ghost"
                                    size="sm"
                                    onClick={() => {
                                      setEditingEndereco(endereco)
                                      setShowEditEnderecoModal(true)
                                    }}
                                  >
                                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                      <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth={2}
                                        d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
                                      />
                                    </svg>
                                  </Button>
                                  <Button variant="ghost" size="sm" onClick={() => handleDeleteEndereco(endereco.id)}>
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
                            </CardContent>
                          </Card>
                        ))}
                      </div>
                    )}
                  </div>
                </TabsContent>

                <TabsContent value="bancarios">
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <h3 className="text-lg font-medium">Dados Bancários</h3>
                      {dadosBancarios.length === 0 && (
                        <Button onClick={() => setShowAddBancoModal(true)}>
                          <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                          </svg>
                          Adicionar Conta
                        </Button>
                      )}
                    </div>

                    {dadosBancarios.length === 0 ? (
                      <div className="text-center py-8">
                        <p className="text-muted-foreground">Nenhum dado bancário cadastrado.</p>
                        <p className="text-sm text-muted-foreground mt-2">
                          Clique em "Adicionar Conta" para cadastrar uma nova conta bancária.
                        </p>
                      </div>
                    ) : (
                      <div className="space-y-4">
                        {dadosBancarios.map((banco) => (
                          <Card key={banco.id}>
                            <CardContent className="pt-4">
                              <div className="flex items-start justify-between">
                                <div className="flex-1">
                                  <p className="font-medium">{banco.banco}</p>
                                  <p className="text-sm text-muted-foreground">Agência: {banco.agencia}</p>
                                  <p className="text-sm text-muted-foreground">
                                    Conta: {banco.conta}-{banco.digito_conta}
                                  </p>
                                  <Badge variant="outline" className="mt-2 capitalize">
                                    {banco.tipo_conta}
                                  </Badge>
                                </div>
                                <div className="flex gap-2">
                                  <Button
                                    variant="ghost"
                                    size="sm"
                                    onClick={() => {
                                      setEditingBanco(banco)
                                      setShowEditBancoModal(true)
                                    }}
                                  >
                                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                      <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth={2}
                                        d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
                                      />
                                    </svg>
                                  </Button>
                                  <Button variant="ghost" size="sm" onClick={() => handleDeleteBanco(banco.id)}>
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
                            </CardContent>
                          </Card>
                        ))}
                      </div>
                    )}
                  </div>
                </TabsContent>
              </Tabs>
            </CardContent>
          </Card>
        )}

        {/* Modal para cadastrar nova pessoa */}
        <PersonModal
          isOpen={showNewPersonModal}
          onClose={() => setShowNewPersonModal(false)}
          onSave={handleNewPersonSave}
          title="Cadastrar Nova Pessoa Jurídica"
          description="Cadastre uma nova pessoa jurídica no sistema"
          allowedTypes={["juridica"]}
          showAddressTabs={true}
          showBankTabs={true}
          className="max-w-6xl w-full"
        />

        {/* Modal para cadastrar estipulante */}
        <Dialog open={showEstipulanteModal} onOpenChange={setShowEstipulanteModal}>
          <DialogContent className="sm:max-w-[425px]">
            <DialogHeader>
              <DialogTitle>Cadastrar como Estipulante</DialogTitle>
              <DialogDescription>Preencha os dados específicos do estipulante</DialogDescription>
            </DialogHeader>
            <div className="space-y-4">
              <div>
                <Label htmlFor="situacao">Situação *</Label>
                <Select
                  value={estipulanteData.situacao}
                  onValueChange={(value: "ativo" | "inativo") =>
                    setEstipulanteData({ ...estipulanteData, situacao: value })
                  }
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
              <Button variant="outline" onClick={() => setShowEstipulanteModal(false)} disabled={loading}>
                Cancelar
              </Button>
              <Button onClick={handleSaveEstipulante} disabled={loading}>
                {loading ? <Loader2 className="h-4 w-4 mr-2 animate-spin" /> : null}
                Salvar Estipulante
              </Button>
            </div>
          </DialogContent>
        </Dialog>

        {/* Modal para editar estipulante */}
        <Dialog open={showEditEstipulanteModal} onOpenChange={setShowEditEstipulanteModal}>
          <DialogContent className="sm:max-w-[425px]">
            <DialogHeader>
              <DialogTitle>Editar Dados do Estipulante</DialogTitle>
              <DialogDescription>Altere os dados específicos do estipulante</DialogDescription>
            </DialogHeader>
            <div className="space-y-4">
              <div>
                <Label htmlFor="editSituacao">Situação *</Label>
                <Select
                  value={estipulanteData.situacao}
                  onValueChange={(value: "ativo" | "inativo") =>
                    setEstipulanteData({ ...estipulanteData, situacao: value })
                  }
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
              <Button variant="outline" onClick={() => setShowEditEstipulanteModal(false)} disabled={loading}>
                Cancelar
              </Button>
              <Button onClick={handleSaveEstipulante} disabled={loading}>
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
                Tem certeza que deseja excluir este estipulante? Esta ação não pode ser desfeita.
              </DialogDescription>
            </DialogHeader>
            <div className="flex justify-end gap-2 mt-4">
              <Button variant="outline" onClick={() => setShowDeleteDialog(false)} disabled={loading}>
                Cancelar
              </Button>
              <Button variant="destructive" onClick={handleDeleteEstipulante} disabled={loading}>
                {loading ? <Loader2 className="h-4 w-4 mr-2 animate-spin" /> : null}
                Excluir
              </Button>
            </div>
          </DialogContent>
        </Dialog>

        <Dialog open={showAddEnderecoModal} onOpenChange={setShowAddEnderecoModal}>
          <DialogContent className="sm:max-w-[600px]">
            <DialogHeader>
              <DialogTitle>Adicionar Endereço</DialogTitle>
              <DialogDescription>Cadastre um novo endereço para o estipulante</DialogDescription>
            </DialogHeader>
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="tipo">Tipo de Endereço *</Label>
                  <Select
                    value={newEnderecoData.tipo}
                    onValueChange={(value: "residencial" | "comercial" | "cobranca") =>
                      setNewEnderecoData({ ...newEnderecoData, tipo: value })
                    }
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="residencial">Residencial</SelectItem>
                      <SelectItem value="comercial">Comercial</SelectItem>
                      <SelectItem value="cobranca">Cobrança</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="cep">CEP *</Label>
                  <Input
                    id="cep"
                    value={newEnderecoData.cep}
                    onChange={(e) => handleCepChange(e.target.value.replace(/\D/g, ""))}
                    placeholder="00000-000"
                    maxLength={8}
                  />
                </div>
              </div>
              <div className="grid grid-cols-3 gap-4">
                <div className="col-span-2">
                  <Label htmlFor="logradouro">Logradouro *</Label>
                  <Input
                    id="logradouro"
                    value={newEnderecoData.logradouro}
                    onChange={(e) => setNewEnderecoData({ ...newEnderecoData, logradouro: e.target.value })}
                  />
                </div>
                <div>
                  <Label htmlFor="numero">Número *</Label>
                  <Input
                    id="numero"
                    value={newEnderecoData.numero}
                    onChange={(e) => setNewEnderecoData({ ...newEnderecoData, numero: e.target.value })}
                  />
                </div>
              </div>
              <div>
                <Label htmlFor="complemento">Complemento</Label>
                <Input
                  id="complemento"
                  value={newEnderecoData.complemento}
                  onChange={(e) => setNewEnderecoData({ ...newEnderecoData, complemento: e.target.value })}
                />
              </div>
              <div className="grid grid-cols-3 gap-4">
                <div>
                  <Label htmlFor="bairro">Bairro *</Label>
                  <Input
                    id="bairro"
                    value={newEnderecoData.bairro}
                    onChange={(e) => setNewEnderecoData({ ...newEnderecoData, bairro: e.target.value })}
                  />
                </div>
                <div>
                  <Label htmlFor="cidade">Cidade *</Label>
                  <Input
                    id="cidade"
                    value={newEnderecoData.cidade}
                    onChange={(e) => setNewEnderecoData({ ...newEnderecoData, cidade: e.target.value })}
                  />
                </div>
                <div>
                  <Label htmlFor="estado">Estado *</Label>
                  <Input
                    id="estado"
                    value={newEnderecoData.estado}
                    onChange={(e) => setNewEnderecoData({ ...newEnderecoData, estado: e.target.value })}
                    maxLength={2}
                  />
                </div>
              </div>
              <div>
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  value={newEnderecoData.email}
                  onChange={(e) => setNewEnderecoData({ ...newEnderecoData, email: e.target.value })}
                />
              </div>
            </div>
            <div className="flex justify-end gap-2 mt-6">
              <Button variant="outline" onClick={() => setShowAddEnderecoModal(false)} disabled={loading}>
                Cancelar
              </Button>
              <Button onClick={() => handleSaveEndereco(newEnderecoData)} disabled={loading}>
                {loading ? <Loader2 className="h-4 w-4 mr-2 animate-spin" /> : null}
                Salvar Endereço
              </Button>
            </div>
          </DialogContent>
        </Dialog>

        <Dialog open={showAddBancoModal} onOpenChange={setShowAddBancoModal}>
          <DialogContent className="sm:max-w-[500px]">
            <DialogHeader>
              <DialogTitle>Adicionar Dados Bancários</DialogTitle>
              <DialogDescription>Cadastre uma nova conta bancária para o estipulante</DialogDescription>
            </DialogHeader>
            <div className="space-y-4">
              <div>
                <Label htmlFor="banco">Banco *</Label>
                <Input
                  id="banco"
                  value={newBancoData.banco}
                  onChange={(e) => setNewBancoData({ ...newBancoData, banco: e.target.value })}
                  placeholder="Nome do banco"
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="agencia">Agência *</Label>
                  <Input
                    id="agencia"
                    value={newBancoData.agencia}
                    onChange={(e) => setNewBancoData({ ...newBancoData, agencia: e.target.value })}
                    placeholder="0000-0"
                  />
                </div>
                <div>
                  <Label htmlFor="tipo_conta">Tipo da Conta *</Label>
                  <Select
                    value={newBancoData.tipo_conta}
                    onValueChange={(value: "corrente" | "poupanca") =>
                      setNewBancoData({ ...newBancoData, tipo_conta: value })
                    }
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="corrente">Corrente</SelectItem>
                      <SelectItem value="poupanca">Poupança</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="conta">Conta *</Label>
                  <Input
                    id="conta"
                    value={newBancoData.conta}
                    onChange={(e) => setNewBancoData({ ...newBancoData, conta: e.target.value })}
                    placeholder="00000-0"
                  />
                </div>
                <div>
                  <Label htmlFor="digito_conta">Dígito da Conta *</Label>
                  <Input
                    id="digito_conta"
                    value={newBancoData.digito_conta}
                    onChange={(e) => setNewBancoData({ ...newBancoData, digito_conta: e.target.value })}
                    placeholder="0"
                    maxLength={1}
                  />
                </div>
              </div>
            </div>
            <div className="flex justify-end gap-2 mt-6">
              <Button variant="outline" onClick={() => setShowAddBancoModal(false)} disabled={loading}>
                Cancelar
              </Button>
              <Button onClick={() => handleSaveBanco(newBancoData)} disabled={loading}>
                {loading ? <Loader2 className="h-4 w-4 mr-2 animate-spin" /> : null}
                Salvar Dados Bancários
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  )
}
