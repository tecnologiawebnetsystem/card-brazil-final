"use client"

import { useState, useEffect, useMemo } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { PersonModal } from "@/components/shared/person-modal"
import { AddressModal } from "@/components/shared/address-modal"
import { BankAccountModal } from "@/components/shared/bank-account-modal"
import { useToast } from "@/hooks/use-toast"
import { Loader2 } from "lucide-react"

interface Operadora {
  id: number
  pessoa_id: number
  natureza_operadora: string
  registro_ans: string
  ativo: boolean
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
  tipoConta: "corrente" | "poupanca"
  conta: string
  digitoConta: string
}

interface Pessoa {
  id: number
  tipo_pessoa: "fisica" | "juridica"
  nome: string
  razao_social?: string
  razaoAbreviada?: string
  cnpj?: string
  cpf?: string
  dataAbertura?: string
  inscricaoEstadual?: string
  inscricaoMunicipal?: string
  codigoAtividade?: string
  status: string
  enderecos: Endereco[]
  dadosBancarios: DadoBancario[]
}

export default function OperadoraPage() {
  const { toast } = useToast()
  const [loading, setLoading] = useState(false)
  const [searchTerm, setSearchTerm] = useState("")
  const [searchFilter, setSearchFilter] = useState("todas")
  const [sortBy, setSortBy] = useState("nome")
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("asc")
  const [selectedOperadoras, setSelectedOperadoras] = useState<number[]>([])
  const [viewMode, setViewMode] = useState<"grid" | "table">("grid")

  const [searchResults, setSearchResults] = useState<Pessoa[]>([])
  const [showResults, setShowResults] = useState(false)
  const [selectedPerson, setSelectedPerson] = useState<Pessoa | null>(null)
  const [showNewPersonModal, setShowNewPersonModal] = useState(false)
  const [showBulkActionsModal, setShowBulkActionsModal] = useState(false)

  const [showAddEnderecoModal, setShowAddEnderecoModal] = useState(false)
  const [showAddBancoModal, setShowAddBancoModal] = useState(false)
  const [showEditEnderecoModal, setShowEditEnderecoModal] = useState(false)
  const [showEditBancoModal, setShowEditBancoModal] = useState(false)
  const [editingEndereco, setEditingEndereco] = useState<Endereco | null>(null)
  const [editingBanco, setEditingBanco] = useState<DadoBancario | null>(null)

  const [operadoraData, setOperadoraData] = useState({
    naturezaOperadora: "",
    registroANS: "",
    situacao: "Ativo" as "Ativo" | "Desativo",
  })

  const [pessoas, setPessoas] = useState<Pessoa[]>([])
  const [operadoras, setOperadoras] = useState<Operadora[]>([])
  const [filteredOperadoras, setFilteredOperadoras] = useState<Operadora[]>([])
  const [showModal, setShowModal] = useState(false)
  const [showDeleteDialog, setShowDeleteDialog] = useState(false)
  const [operadoraToDelete, setOperadoraToDelete] = useState<number | null>(null)

  const [formData, setFormData] = useState({
    pessoa_id: 0,
    natureza_operadora: "",
    registro_ans: "",
    ativo: true,
  })

  const [selectedOperadora, setSelectedOperadora] = useState<Operadora | null>(null)

  useEffect(() => {
    loadOperadoras()
    loadPessoas()
  }, [])

  const loadOperadoras = async () => {
    try {
      setLoading(true)
      const response = await fetch("/api/operadoras")
      const data = await response.json()

      if (data.success) {
        setOperadoras(data.data)
        setFilteredOperadoras(data.data)
      } else {
        toast({
          title: "Erro ao carregar operadoras",
          description: data.message || "Ocorreu um erro desconhecido.",
          variant: "destructive",
        })
      }
    } catch (error) {
      toast({
        title: "Erro de Rede",
        description: "Erro ao carregar operadoras",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  const loadPessoas = async () => {
    try {
      const response = await fetch("/api/pessoas?tipo_pessoa=juridica")
      const data = await response.json()

      if (data.success) {
        setPessoas(data.data)
      } else {
        toast({
          title: "Erro ao carregar pessoas",
          description: data.message || "Ocorreu um erro desconhecido.",
          variant: "destructive",
        })
      }
    } catch (error) {
      toast({
        title: "Erro de Rede",
        description: "Erro ao carregar pessoas",
        variant: "destructive",
      })
    }
  }

  const calculateCompletudeScore = (pessoa: Pessoa, operadora?: Operadora) => {
    let score = 0
    const maxScore = 100

    // Dados básicos (40 pontos)
    if (pessoa.razao_social) score += 10
    if (pessoa.cnpj) score += 10
    if (pessoa.inscricaoEstadual) score += 10
    if (pessoa.inscricaoMunicipal) score += 10

    // Dados da operadora (30 pontos)
    if (operadora?.natureza_operadora) score += 15
    if (operadora?.registro_ans) score += 15

    // Endereços (20 pontos)
    if (pessoa.enderecos.length > 0) score += 20

    // Dados bancários (10 pontos)
    if (pessoa.dadosBancarios.length > 0) score += 10

    return Math.round((score / maxScore) * 100)
  }

  const analytics = useMemo(() => {
    const totalOperadoras = operadoras.length
    const operadorasAtivas = operadoras.filter((op) => op.ativo).length
    const operadorasInativas = totalOperadoras - operadorasAtivas

    const naturezaDistribution = operadoras.reduce(
      (acc, op) => {
        acc[op.natureza_operadora] = (acc[op.natureza_operadora] || 0) + 1
        return acc
      },
      {} as Record<string, number>,
    )

    const avgCompletude =
      operadoras.reduce((acc, op) => {
        const pessoa = pessoas.find((p) => p.id === op.pessoa_id)
        // @ts-ignore
        return acc + (pessoa ? calculateCompletudeScore(pessoa, op) : 0)
      }, 0) / totalOperadoras || 0

    return {
      totalOperadoras,
      operadorasAtivas,
      operadorasInativas,
      naturezaDistribution,
      avgCompletude: Math.round(avgCompletude),
    }
  }, [operadoras, pessoas])

  const handleSearch = () => {
    if (!searchTerm.trim()) {
      setFilteredOperadoras(operadoras)
      return
    }

    const filtered = operadoras.filter((op) => {
      const pessoa = pessoas.find((p) => p.id === op.pessoa_id)
      return (
        op.natureza_operadora.toLowerCase().includes(searchTerm.toLowerCase()) ||
        op.registro_ans.includes(searchTerm) ||
        pessoa?.nome.toLowerCase().includes(searchTerm.toLowerCase()) ||
        pessoa?.cnpj?.includes(searchTerm)
      )
    })

    setFilteredOperadoras(filtered)
  }

  const handleCreate = () => {
    setSelectedOperadora(null)
    setFormData({
      pessoa_id: 0,
      natureza_operadora: "",
      registro_ans: "",
      ativo: true,
    })
    setShowModal(true)
  }

  const handleEdit = (operadora: Operadora) => {
    setSelectedOperadora(operadora)
    setFormData({
      pessoa_id: operadora.pessoa_id,
      natureza_operadora: operadora.natureza_operadora,
      registro_ans: operadora.registro_ans,
      ativo: operadora.ativo,
    })
    setShowModal(true)
  }

  const handleSave = async () => {
    try {
      if (!formData.pessoa_id || !formData.natureza_operadora || !formData.registro_ans) {
        toast({
          title: "Erro",
          description: "Preencha todos os campos obrigatórios",
          variant: "destructive",
        })
        return
      }

      setLoading(true)

      if (selectedOperadora) {
        // Atualizar
        const response = await fetch(`/api/operadoras/${selectedOperadora.id}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(formData),
        })

        const data = await response.json()

        if (data.success) {
          toast({
            title: "Sucesso",
            description: "Operadora atualizada com sucesso",
          })
          loadOperadoras()
          setShowModal(false)
        } else {
          throw new Error(data.message)
        }
      } else {
        // Criar
        const response = await fetch("/api/operadoras", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(formData),
        })

        const data = await response.json()

        if (data.success) {
          toast({
            title: "Sucesso",
            description: "Operadora criada com sucesso",
          })
          loadOperadoras()
          setShowModal(false)
        } else {
          throw new Error(data.message)
        }
      }
    } catch (error: any) {
      toast({
        title: "Erro",
        description: error.message || "Erro ao salvar operadora",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  const handleDelete = async () => {
    if (!operadoraToDelete) return

    try {
      setLoading(true)

      const response = await fetch(`/api/operadoras/${operadoraToDelete}`, {
        method: "DELETE",
      })

      const data = await response.json()

      if (data.success) {
        toast({
          title: "Sucesso",
          description: "Operadora excluída com sucesso",
        })
        loadOperadoras()
        setShowDeleteDialog(false)
        setOperadoraToDelete(null)
      } else {
        throw new Error(data.message)
      }
    } catch (error: any) {
      toast({
        title: "Erro",
        description: error.message || "Erro ao excluir operadora",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  const getPessoaNome = (pessoaId: number) => {
    const pessoa = pessoas.find((p) => p.id === pessoaId)
    return pessoa?.nome || "N/A"
  }

  const getPessoaDocumento = (pessoaId: number) => {
    const pessoa = pessoas.find((p) => p.id === pessoaId)
    return pessoa?.cnpj || pessoa?.cpf || "N/A"
  }

  const handleSearchByFilter = () => {
    if (!searchTerm.trim()) {
      setFilteredOperadoras(operadoras)
      return
    }

    const filtered = operadoras.filter((op) => {
      const pessoa = pessoas.find((p) => p.id === op.pessoa_id)
      let matchesSearchTerm = false
      if (searchTerm.toLowerCase()) {
        matchesSearchTerm =
          op.natureza_operadora.toLowerCase().includes(searchTerm.toLowerCase()) ||
          op.registro_ans.includes(searchTerm) ||
          pessoa?.nome.toLowerCase().includes(searchTerm.toLowerCase()) ||
          pessoa?.cnpj?.includes(searchTerm)
      }

      let matchesFilter = true
      if (searchFilter === "ativas") {
        matchesFilter = op.ativo
      } else if (searchFilter === "inativas") {
        matchesFilter = !op.ativo
      }

      return matchesSearchTerm && matchesFilter
    })

    setFilteredOperadoras(filtered)
  }

  const handleExportData = () => {
    const dataToExport = filteredOperadoras.map((pessoa) => {
      const operadora = operadoras.find((op) => op.pessoa_id === pessoa.id)
      return {
        Código: `ADM001-${pessoa.id}`,
        Nome: getPessoaNome(pessoa.pessoa_id),
        CNPJ: getPessoaDocumento(pessoa.pessoa_id),
        Natureza: operadora?.natureza_operadora || "N/A",
        "Registro ANS": operadora?.registro_ans || "N/A",
        Situação: operadora?.ativo ? "Ativo" : "Inativo",
        Endereços: pessoa.enderecos.length,
        "Contas Bancárias": pessoa.dadosBancarios.length,
      }
    })

    console.log("Exportando dados:", dataToExport)
    // Aqui seria implementada a exportação real
  }

  const handleBulkAction = (action: "activate" | "deactivate") => {
    setOperadoras((prev) =>
      prev.map((op) =>
        selectedOperadoras.includes(op.pessoa_id) ? { ...op, ativo: action === "activate" ? true : false } : op,
      ),
    )
    setFilteredOperadoras((prev) =>
      prev.map((op) =>
        selectedOperadoras.includes(op.pessoa_id) ? { ...op, ativo: action === "activate" ? true : false } : op,
      ),
    )
    setSelectedOperadoras([])
    setShowBulkActionsModal(false)
  }

  const handleSelectPerson = (pessoa: Pessoa) => {
    setSelectedPerson(pessoa)
    setShowResults(false)

    const operadoraExistente = operadoras.find((op) => op.pessoa_id === pessoa.id)
    if (operadoraExistente) {
      setFormData({
        pessoa_id: operadoraExistente.pessoa_id,
        natureza_operadora: operadoraExistente.natureza_operadora,
        registro_ans: operadoraExistente.registro_ans,
        ativo: operadoraExistente.ativo,
      })
      setSelectedOperadora(operadoraExistente) // Define a operadora selecionada para edição
    } else {
      setFormData({
        pessoa_id: pessoa.id,
        natureza_operadora: "",
        registro_ans: "",
        ativo: true,
      })
      setSelectedOperadora(null) // Limpa a operadora selecionada se não existir
    }
  }

  const handleBackToSearch = () => {
    setSelectedPerson(null)
    setShowResults(searchResults.length > 0)
    // Limpa o formulário ao voltar para a pesquisa
    setFormData({
      pessoa_id: 0,
      natureza_operadora: "",
      registro_ans: "",
      ativo: true,
    })
    setSelectedOperadora(null)
  }

  const handleSaveOperadora = async () => {
    if (!formData.pessoa_id || !formData.natureza_operadora || !formData.registro_ans) {
      toast({
        title: "Erro",
        description: "Preencha todos os campos obrigatórios",
        variant: "destructive",
      })
      return
    }

    setLoading(true)

    try {
      if (selectedOperadora) {
        // Atualizar operadora existente
        const response = await fetch(`/api/operadoras/${selectedOperadora.id}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(formData),
        })
        const data = await response.json()
        if (data.success) {
          toast({ title: "Sucesso", description: "Operadora atualizada com sucesso." })
          loadOperadoras() // Recarrega a lista de operadoras
          const updatedPessoa = {
            ...selectedPerson!,
            enderecos: selectedPerson!.enderecos,
            dadosBancarios: selectedPerson!.dadosBancarios,
          }
          setSelectedPerson(updatedPessoa) // Atualiza o estado selectedPerson com os novos dados (se necessário)
        } else {
          throw new Error(data.message)
        }
      } else {
        // Criar nova operadora
        const response = await fetch("/api/operadoras", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(formData),
        })
        const data = await response.json()
        if (data.success) {
          toast({ title: "Sucesso", description: "Operadora criada com sucesso." })
          loadOperadoras() // Recarrega a lista de operadoras
          // Atualiza o estado selectedPerson para refletir que agora é uma operadora
          const updatedPessoa = {
            ...selectedPerson!,
            enderecos: selectedPerson!.enderecos,
            dadosBancarios: selectedPerson!.dadosBancarios,
          }
          setSelectedPerson(updatedPessoa)
        } else {
          throw new Error(data.message)
        }
      }
      setShowModal(false) // Fecha o modal após salvar
    } catch (error: any) {
      toast({
        title: "Erro ao salvar operadora",
        description: error.message || "Ocorreu um erro inesperado.",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  const handleDeleteOperadora = async () => {
    if (!selectedPerson || !operadoraToDelete) return

    setLoading(true)
    try {
      const response = await fetch(`/api/operadoras/${operadoraToDelete}`, {
        method: "DELETE",
      })
      const data = await response.json()
      if (data.success) {
        toast({ title: "Sucesso", description: "Operadora excluída com sucesso." })
        loadOperadoras()
        setSelectedPerson(null) // Desseleciona a pessoa/operadora
        setShowDeleteDialog(false)
        setOperadoraToDelete(null)
      } else {
        throw new Error(data.message)
      }
    } catch (error: any) {
      toast({
        title: "Erro ao excluir operadora",
        description: error.message || "Ocorreu um erro inesperado.",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  const handleNewPersonSave = (personData: any) => {
    console.log("Nova pessoa cadastrada:", personData)
    // Aqui você precisaria chamar uma API para salvar a nova pessoa e depois recarregar a lista de pessoas
    // setPessoas([...pessoas, { id: Date.now(), ...personData }]); // Exemplo de atualização local
    setShowNewPersonModal(false)
  }

  const handleSaveEndereco = (enderecoData: any) => {
    if (!selectedPerson) return

    const newEndereco: Endereco = {
      id: Date.now(),
      ...enderecoData,
    }

    setPessoas((prev) =>
      prev.map((p) => (p.id === selectedPerson.id ? { ...p, enderecos: [...p.enderecos, newEndereco] } : p)),
    )

    setSelectedPerson((prev) => (prev ? { ...prev, enderecos: [...prev.enderecos, newEndereco] } : null))
    setShowAddEnderecoModal(false)
  }

  const handleSaveBanco = (bancoData: any) => {
    if (!selectedPerson) return

    const newBanco: DadoBancario = {
      id: Date.now(),
      ...bancoData,
    }

    setPessoas((prev) =>
      prev.map((p) => (p.id === selectedPerson.id ? { ...p, dadosBancarios: [...p.dadosBancarios, newBanco] } : p)),
    )

    setSelectedPerson((prev) => (prev ? { ...prev, dadosBancarios: [...prev.dadosBancarios, newBanco] } : null))
    setShowAddBancoModal(false)
  }

  const handleDeleteEndereco = (enderecoId: number) => {
    if (!selectedPerson) return

    setPessoas((prev) =>
      prev.map((p) =>
        p.id === selectedPerson.id ? { ...p, enderecos: p.enderecos.filter((e) => e.id !== enderecoId) } : p,
      ),
    )

    setSelectedPerson((prev) =>
      prev ? { ...prev, enderecos: prev.enderecos.filter((e) => e.id !== enderecoId) } : null,
    )
  }

  const handleDeleteBanco = (bancoId: number) => {
    if (!selectedPerson) return

    setPessoas((prev) =>
      prev.map((p) =>
        p.id === selectedPerson.id ? { ...p, dadosBancarios: p.dadosBancarios.filter((b) => b.id !== bancoId) } : p,
      ),
    )

    setSelectedPerson((prev) =>
      prev ? { ...prev, dadosBancarios: prev.dadosBancarios.filter((b) => b.id !== bancoId) } : null,
    )
  }

  const isOperadora = selectedPerson ? operadoras.some((op) => op.pessoa_id === selectedPerson.id) : false
  const operadoraAtual = selectedPerson ? operadoras.find((op) => op.pessoa_id === selectedPerson.id) : null

  const handleUpdateEndereco = (enderecoData: any) => {
    if (!editingEndereco || !selectedPerson) return

    const updatedEnderecos = selectedPerson.enderecos.map((e) =>
      e.id === editingEndereco.id ? { ...e, ...enderecoData } : e,
    )

    setPessoas((prev) => prev.map((p) => (p.id === selectedPerson.id ? { ...p, enderecos: updatedEnderecos } : p)))

    setSelectedPerson((prev) => (prev ? { ...prev, enderecos: updatedEnderecos } : null))
    setShowEditEnderecoModal(false)
    setEditingEndereco(null)
  }

  const handleUpdateBanco = (bancoData: any) => {
    if (!editingBanco || !selectedPerson) return

    const updatedDadosBancarios = selectedPerson.dadosBancarios.map((b) =>
      b.id === editingBanco.id ? { ...b, ...bancoData } : b,
    )

    setPessoas((prev) =>
      prev.map((p) => (p.id === selectedPerson.id ? { ...p, dadosBancarios: updatedDadosBancarios } : p)),
    )

    setSelectedPerson((prev) => (prev ? { ...prev, dadosBancarios: updatedDadosBancarios } : null))
    setShowEditBancoModal(false)
    setEditingBanco(null)
  }

  const [showPersonModal, setShowPersonModal] = useState(false)

  const handleSavePerson = (personData: any) => {
    console.log("Nova pessoa cadastrada:", personData)
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-6 py-6">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-2xl font-bold text-foreground">Operadoras</h1>
            <p className="text-muted-foreground">Gerencie as operadoras de saúde do sistema</p>
          </div>
          {/* Botão de Nova Operadora do novo código */}
          <Button onClick={handleCreate} style={{ backgroundColor: "#6B8E23" }} className="hover:opacity-90">
            + Nova Operadora
          </Button>
          {/* Botão antigo "Voltar à Pesquisa" removido pois a navegação mudou */}
        </div>

        {/* Card de Estatísticas */}
        <div className="mb-6">
          <Card className="bg-emerald-700 text-white border-emerald-700">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-white">Total de Operadoras</CardTitle>
              <div className="h-8 w-8 bg-emerald-800 rounded-full flex items-center justify-center">
                <svg className="h-4 w-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"
                  />
                </svg>
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-white">{operadoras.length}</div>
              <p className="text-sm text-emerald-100">
                {operadoras.filter((op) => op.ativo).length} ativas • {operadoras.filter((op) => !op.ativo).length}{" "}
                inativas
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Card de Pesquisa */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle>Pesquisar Operadora</CardTitle>
            <CardDescription>Digite o nome, CNPJ ou registro ANS para pesquisar</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {" "}
              {/* Adicionado para organizar os filtros */}
              <div>
                <Label>Filtro de Status</Label>
                <Select value={searchFilter} onValueChange={setSearchFilter}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="todas">Todas as Operadoras</SelectItem>
                    <SelectItem value="ativas">Apenas Ativas</SelectItem>
                    <SelectItem value="inativas">Apenas Inativas</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="flex gap-4">
                <div className="flex-1">
                  <Input
                    placeholder="Digite aqui..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    onKeyPress={(e) => e.key === "Enter" && handleSearchByFilter()} // Mudado para handleSearchByFilter
                  />
                </div>
                <Button onClick={handleSearchByFilter} className="bg-cyan-500 hover:bg-cyan-600">
                  {" "}
                  {/* Mudado para handleSearchByFilter */}
                  <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                    />
                  </svg>
                  Pesquisar
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Tabela de Resultados */}
        <Card>
          <CardHeader>
            <CardTitle>Todas as Operadoras Cadastradas</CardTitle>
            <CardDescription>{filteredOperadoras.length} operadora(s) encontrada(s)</CardDescription>
          </CardHeader>
          <CardContent>
            {loading ? (
              <div className="flex justify-center items-center py-8">
                <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
              </div>
            ) : filteredOperadoras.length === 0 ? (
              <div className="text-center py-8">
                <p className="text-muted-foreground">Nenhuma operadora encontrada.</p>
              </div>
            ) : (
              <div className="space-y-3">
                {filteredOperadoras.map((operadora) => (
                  <div
                    key={operadora.id}
                    className="flex items-center justify-between p-4 border rounded-lg hover:bg-muted/50 transition-colors"
                  >
                    <div className="flex items-center gap-3">
                      <Avatar className="h-10 w-10">
                        <AvatarFallback>
                          {getPessoaNome(operadora.pessoa_id).substring(0, 2).toUpperCase()}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <div className="flex items-center gap-2">
                          <p className="font-medium">{getPessoaNome(operadora.pessoa_id)}</p>
                          <Badge variant="outline" className="text-xs">
                            {operadora.registro_ans}
                          </Badge>
                        </div>
                        <p className="text-sm text-muted-foreground">{operadora.natureza_operadora}</p>
                        <p className="text-xs text-muted-foreground">
                          Documento: {getPessoaDocumento(operadora.pessoa_id)}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Badge variant={operadora.ativo ? "default" : "secondary"}>
                        {operadora.ativo ? "Ativo" : "Inativo"}
                      </Badge>
                      <Button variant="outline" size="sm" onClick={() => handleEdit(operadora)}>
                        Editar
                      </Button>
                      <Button
                        variant="destructive"
                        size="sm"
                        onClick={() => {
                          setOperadoraToDelete(operadora.id)
                          setShowDeleteDialog(true)
                        }}
                      >
                        Excluir
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Modal de Criar/Editar */}
        <Dialog open={showModal} onOpenChange={setShowModal}>
          <DialogContent className="sm:max-w-[500px]">
            <DialogHeader>
              <DialogTitle>{selectedOperadora ? "Editar Operadora" : "Nova Operadora"}</DialogTitle>
              <DialogDescription>
                {selectedOperadora
                  ? "Altere os dados da operadora"
                  : "Preencha os dados para cadastrar uma nova operadora"}
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4">
              <div>
                <Label htmlFor="pessoa_id">Pessoa Jurídica *</Label>
                <Select
                  value={formData.pessoa_id.toString()}
                  onValueChange={(value) => setFormData({ ...formData, pessoa_id: Number.parseInt(value) })}
                  disabled={!!selectedOperadora} // Desabilita a seleção se estiver editando
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione uma pessoa" />
                  </SelectTrigger>
                  <SelectContent>
                    {pessoas.map((pessoa) => (
                      <SelectItem key={pessoa.id} value={pessoa.id.toString()}>
                        {pessoa.nome} - {pessoa.cnpj}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="natureza_operadora">Natureza Operadora *</Label>
                <Select
                  value={formData.natureza_operadora}
                  onValueChange={(value) => setFormData({ ...formData, natureza_operadora: value })}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione a natureza" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Administradora de Benefícios">Administradora de Benefícios</SelectItem>
                    <SelectItem value="Operadora de Planos de Saúde">Operadora de Planos de Saúde</SelectItem>
                    <SelectItem value="Seguradora Especializada em Saúde">Seguradora Especializada em Saúde</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="registro_ans">Registro ANS *</Label>
                <Input
                  id="registro_ans"
                  placeholder="000000"
                  value={formData.registro_ans}
                  onChange={(e) => setFormData({ ...formData, registro_ans: e.target.value })}
                />
              </div>
              <div className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  id="ativo"
                  checked={formData.ativo}
                  onChange={(e) => setFormData({ ...formData, ativo: e.target.checked })}
                  className="h-4 w-4"
                />
                <Label htmlFor="ativo">Ativo</Label>
              </div>
            </div>
            <div className="flex justify-end gap-2 mt-6">
              <Button variant="outline" onClick={() => setShowModal(false)} disabled={loading}>
                Cancelar
              </Button>
              <Button onClick={handleSave} disabled={loading}>
                {loading ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : null}
                {selectedOperadora ? "Salvar Alterações" : "Criar Operadora"}
              </Button>
            </div>
          </DialogContent>
        </Dialog>

        {/* Dialog de Confirmação de Exclusão */}
        <Dialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Confirmar Exclusão</DialogTitle>
              <DialogDescription>Tem certeza que deseja excluir esta operadora?</DialogDescription>
            </DialogHeader>
            <div className="flex justify-end gap-2 mt-4">
              <Button variant="outline" onClick={() => setShowDeleteDialog(false)} disabled={loading}>
                Cancelar
              </Button>
              <Button variant="destructive" onClick={handleDelete} disabled={loading}>
                {loading ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : null}
                Excluir
              </Button>
            </div>
          </DialogContent>
        </Dialog>

        {/* Componentes de Modal/Dialog que não foram diretamente substituídos/removidos */}
        {/* Módulos de Pessoa, Endereço e Banco que parecem ter sido removidos da lógica principal */}
        {/* Mantidos para referência, mas a lógica de interação foi alterada */}

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

        {/* Diálogo de cadastro/edição de operadora que foi substituído pelo `showModal` */}
        {/* Dialog open={showOperadoraModal} onOpenChange={setShowOperadoraModal}>
          <DialogContent className="sm:max-w-[425px]">
            <DialogHeader>
              <DialogTitle>Cadastrar como Operadora</DialogTitle>
              <DialogDescription>Preencha os dados específicos da operadora</DialogDescription>
            </DialogHeader>
            <div className="space-y-4">
              <div>
                <Label htmlFor="naturezaOperadora">Natureza Operadora *</Label>
                <Select
                  value={operadoraData.naturezaOperadora}
                  onValueChange={(value) => setOperadoraData({ ...operadoraData, naturezaOperadora: value })}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione a natureza" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Administradora de Benefícios">Administradora de Benefícios</SelectItem>
                    <SelectItem value="Operadora de Planos de Saúde">Operadora de Planos de Saúde</SelectItem>
                    <SelectItem value="Seguradora Especializada em Saúde">Seguradora Especializada em Saúde</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="registroANS">Registro ANS *</Label>
                <Input
                  id="registroANS"
                  placeholder="000000"
                  value={operadoraData.registroANS}
                  onChange={(e) => setOperadoraData({ ...operadoraData, registroANS: e.target.value })}
                />
              </div>
              <div>
                <Label htmlFor="situacao">Situação *</Label>
                <Select
                  value={operadoraData.situacao}
                  onValueChange={(value: "Ativo" | "Desativo") =>
                    setOperadoraData({ ...operadoraData, situacao: value })
                  }
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Ativo">Ativo</SelectItem>
                    <SelectItem value="Desativo">Desativo</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div className="flex justify-end gap-2 mt-6">
              <Button variant="outline" onClick={() => setShowOperadoraModal(false)}>
                Cancelar
              </Button>
              <Button onClick={handleSaveOperadora}>Salvar Operadora</Button>
            </div>
          </DialogContent>
        </Dialog> */}

        {/* Diálogo de edição de operadora que foi substituído pelo `showModal` */}
        {/* Dialog open={showEditOperadoraModal} onOpenChange={setShowEditOperadoraModal}>
          <DialogContent className="sm:max-w-[425px]">
            <DialogHeader>
              <DialogTitle>Editar Dados da Operadora</DialogTitle>
              <DialogDescription>Altere os dados específicos da operadora</DialogDescription>
            </DialogHeader>
            <div className="space-y-4">
              <div>
                <Label htmlFor="editNaturezaOperadora">Natureza Operadora *</Label>
                <Select
                  value={operadoraData.naturezaOperadora}
                  onValueChange={(value) => setOperadoraData({ ...operadoraData, naturezaOperadora: value })}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione a natureza" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Administradora de Benefícios">Administradora de Benefícios</SelectItem>
                    <SelectItem value="Operadora de Planos de Saúde">Operadora de Planos de Saúde</SelectItem>
                    <SelectItem value="Seguradora Especializada em Saúde">Seguradora Especializada em Saúde</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="editRegistroANS">Registro ANS *</Label>
                <Input
                  id="editRegistroANS"
                  placeholder="000000"
                  value={operadoraData.registroANS}
                  onChange={(e) => setOperadoraData({ ...operadoraData, registroANS: e.target.value })}
                />
              </div>
              <div>
                <Label htmlFor="editSituacao">Situação *</Label>
                <Select
                  value={operadoraData.situacao}
                  onValueChange={(value: "Ativo" | "Desativo") =>
                    setOperadoraData({ ...operadoraData, situacao: value })
                  }
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Ativo">Ativo</SelectItem>
                    <SelectItem value="Desativo">Desativo</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div className="flex justify-end gap-2 mt-6">
              <Button variant="outline" onClick={() => setShowEditOperadoraModal(false)}>
                Cancelar
              </Button>
              <Button onClick={handleSaveOperadora}>Salvar Alterações</Button>
            </div>
          </DialogContent>
        </Dialog> */}

        <Dialog open={showBulkActionsModal} onOpenChange={setShowBulkActionsModal}>
          <DialogContent className="sm:max-w-[425px]">
            <DialogHeader>
              <DialogTitle>Ações em Lote</DialogTitle>
              <DialogDescription>
                Aplicar ação para {selectedOperadoras.length} operadora(s) selecionada(s)
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4">
              <Button className="w-full" onClick={() => handleBulkAction("activate")}>
                Ativar Todas
              </Button>
              <Button
                className="w-full bg-transparent"
                variant="outline"
                onClick={() => handleBulkAction("deactivate")}
              >
                Desativar Todas
              </Button>
            </div>
            <div className="flex justify-end gap-2 mt-6">
              <Button variant="outline" onClick={() => setShowBulkActionsModal(false)}>
                Cancelar
              </Button>
            </div>
          </DialogContent>
        </Dialog>

        <AddressModal
          isOpen={showAddEnderecoModal}
          onClose={() => setShowAddEnderecoModal(false)}
          onSave={handleSaveEndereco}
          className="max-w-3xl w-full"
        />

        <BankAccountModal
          isOpen={showAddBancoModal}
          onClose={() => setShowAddBancoModal(false)}
          onSave={handleSaveBanco}
          className="max-w-3xl w-full"
        />

        <AddressModal
          isOpen={showEditEnderecoModal}
          onClose={() => setShowEditEnderecoModal(false)}
          onSave={handleUpdateEndereco}
          endereco={editingEndereco}
          className="max-w-3xl w-full"
        />

        <BankAccountModal
          isOpen={showEditBancoModal}
          onClose={() => setShowEditBancoModal(false)}
          onSave={handleUpdateBanco}
          dadoBancario={editingBanco}
          className="max-w-3xl w-full"
        />

        {/* Elementos de UI que foram removidos ou substituídos */}
        {/* TABS e seções detalhadas de pessoa, endereço e banco */}
        {/* O fluxo agora é mais direto: lista -> modal de criação/edição */}

        {/* Seção antiga de seleção de pessoa e visualização de detalhes */}
        {/* A lógica de `selectedPerson` foi parcialmente mantida para a adição de Endereços e Bancos, mas a visualização detalhada foi removida */}
        {/* O código relativo a `selectedPerson` e suas abas (operadora, dados, enderecos, bancarios) foi removido */}
      </div>
    </div>
  )
}
