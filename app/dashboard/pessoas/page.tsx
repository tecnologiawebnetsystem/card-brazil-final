"use client"
import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Plus, Search, X, Loader2, Pencil, Trash2, Eye } from "lucide-react"
import { useAuth } from "@/contexts/auth-context"
import { useToast } from "@/hooks/use-toast"

interface Pessoa {
  id: number
  tipo_pessoa: "fisica" | "juridica"
  nome?: string
  cpf?: string
  rg?: string
  razao_social?: string
  cnpj?: string
  inscricao_estadual?: string
  data_nascimento?: string
  email?: string
  telefone?: string
  celular?: string
  status: "ativo" | "inativo"
  id_administradora: number
}

interface Endereco {
  id?: number
  pessoa_id?: number
  tipo_endereco: string
  cep: string
  logradouro: string
  numero: string
  complemento?: string
  bairro: string
  cidade: string
  estado: string
  email?: string
  principal: boolean
}

interface ContaBancaria {
  id?: number
  pessoa_id?: number
  banco: string
  agencia: string
  tipo_conta: string
  conta: string
  digito: string
  principal: boolean
}

export default function PessoasPage() {
  const { user } = useAuth()
  const { toast } = useToast()

  const [pessoas, setPessoas] = useState<Pessoa[]>([])
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)

  const [searchTerm, setSearchTerm] = useState("")
  const [tipoFilter, setTipoFilter] = useState("todos")
  const [statusFilter, setStatusFilter] = useState("todos")
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [isEditMode, setIsEditMode] = useState(false)
  const [pessoaEditando, setPessoaEditando] = useState<Pessoa | null>(null)
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false)
  const [pessoaParaExcluir, setPessoaParaExcluir] = useState<Pessoa | null>(null)
  const [isDetalhesOpen, setIsDetalhesOpen] = useState(false)
  const [pessoaDetalhes, setPessoaDetalhes] = useState<Pessoa | null>(null)
  const [enderecosDetalhes, setEnderecosDetalhes] = useState<Endereco[]>([])
  const [contasDetalhes, setContasDetalhes] = useState<ContaBancaria[]>([])

  // Estados do formulário
  const [tipoPessoa, setTipoPessoa] = useState<"fisica" | "juridica">("fisica")
  const [formData, setFormData] = useState({
    nome: "",
    cpf: "",
    rg: "",
    razao_social: "",
    cnpj: "",
    inscricao_estadual: "",
    data_nascimento: "",
    email: "",
    telefone: "",
    celular: "",
  })

  const [enderecos, setEnderecos] = useState<Endereco[]>([
    {
      tipo_endereco: "",
      cep: "",
      logradouro: "",
      numero: "",
      complemento: "",
      bairro: "",
      cidade: "",
      estado: "",
      email: "",
      principal: true,
    },
  ])

  const [contasBancarias, setContasBancarias] = useState<ContaBancaria[]>([
    { banco: "", agencia: "", tipo_conta: "", conta: "", digito: "", principal: true },
  ])

  useEffect(() => {
    carregarPessoas()
  }, [])

  const carregarPessoas = async () => {
    try {
      setLoading(true)
      const token = localStorage.getItem("token")
      const response = await fetch(`/api/pessoas?id_administradora=${user?.perfil_id || 1}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })

      if (!response.ok) throw new Error("Erro ao carregar pessoas")

      const data = await response.json()
      setPessoas(data.data || [])
    } catch (error) {
      console.error("[v0] Erro ao carregar pessoas:", error)
      toast({
        title: "Erro",
        description: "Não foi possível carregar as pessoas",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  const carregarDetalhesPessoa = async (pessoaId: number) => {
    try {
      const token = localStorage.getItem("token")

      // Carregar pessoa
      const pessoaResponse = await fetch(`/api/pessoas/${pessoaId}`, {
        headers: { Authorization: `Bearer ${token}` },
      })
      const pessoaData = await pessoaResponse.json()

      // Carregar endereços
      const enderecosResponse = await fetch(`/api/enderecos?pessoa_id=${pessoaId}`, {
        headers: { Authorization: `Bearer ${token}` },
      })
      const enderecosData = await enderecosResponse.json()

      // Carregar contas bancárias
      const contasResponse = await fetch(`/api/dados-bancarios?pessoa_id=${pessoaId}`, {
        headers: { Authorization: `Bearer ${token}` },
      })
      const contasData = await contasResponse.json()

      return {
        pessoa: pessoaData.data,
        enderecos: enderecosData.data || [],
        contas: contasData.data || [],
      }
    } catch (error) {
      console.error("[v0] Erro ao carregar detalhes:", error)
      throw error
    }
  }

  const abrirEdicao = async (pessoa: Pessoa) => {
    try {
      setLoading(true)
      const detalhes = await carregarDetalhesPessoa(pessoa.id)

      setPessoaEditando(pessoa)
      setIsEditMode(true)
      setTipoPessoa(pessoa.tipo_pessoa)
      setFormData({
        nome: pessoa.nome || "",
        cpf: pessoa.cpf || "",
        rg: pessoa.rg || "",
        razao_social: pessoa.razao_social || "",
        cnpj: pessoa.cnpj || "",
        inscricao_estadual: pessoa.inscricao_estadual || "",
        data_nascimento: pessoa.data_nascimento || "",
        email: pessoa.email || "",
        telefone: pessoa.telefone || "",
        celular: pessoa.celular || "",
      })

      setEnderecos(
        detalhes.enderecos.length > 0
          ? detalhes.enderecos
          : [
              {
                tipo_endereco: "",
                cep: "",
                logradouro: "",
                numero: "",
                complemento: "",
                bairro: "",
                cidade: "",
                estado: "",
                email: "",
                principal: true,
              },
            ],
      )

      setContasBancarias(
        detalhes.contas.length > 0
          ? detalhes.contas
          : [{ banco: "", agencia: "", tipo_conta: "", conta: "", digito: "", principal: true }],
      )

      setIsModalOpen(true)
    } catch (error) {
      toast({
        title: "Erro",
        description: "Não foi possível carregar os dados para edição",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  const abrirDetalhes = async (pessoa: Pessoa) => {
    try {
      setLoading(true)
      const detalhes = await carregarDetalhesPessoa(pessoa.id)

      setPessoaDetalhes(detalhes.pessoa)
      setEnderecosDetalhes(detalhes.enderecos)
      setContasDetalhes(detalhes.contas)
      setIsDetalhesOpen(true)
    } catch (error) {
      toast({
        title: "Erro",
        description: "Não foi possível carregar os detalhes",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  const confirmarExclusao = (pessoa: Pessoa) => {
    setPessoaParaExcluir(pessoa)
    setIsDeleteDialogOpen(true)
  }

  const excluirPessoa = async () => {
    if (!pessoaParaExcluir) return

    try {
      const token = localStorage.getItem("token")
      const response = await fetch(`/api/pessoas/${pessoaParaExcluir.id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      })

      if (!response.ok) throw new Error("Erro ao excluir pessoa")

      toast({
        title: "Sucesso",
        description: "Pessoa excluída com sucesso",
      })

      carregarPessoas()
      setIsDeleteDialogOpen(false)
      setPessoaParaExcluir(null)
    } catch (error) {
      toast({
        title: "Erro",
        description: "Não foi possível excluir a pessoa",
        variant: "destructive",
      })
    }
  }

  const salvarPessoa = async () => {
    try {
      setSaving(true)
      const token = localStorage.getItem("token")

      if (tipoPessoa === "fisica" && (!formData.nome || !formData.cpf)) {
        toast({
          title: "Erro de validação",
          description: "Nome e CPF são obrigatórios para pessoa física",
          variant: "destructive",
        })
        return
      }

      if (tipoPessoa === "juridica" && (!formData.razao_social || !formData.cnpj)) {
        toast({
          title: "Erro de validação",
          description: "Razão Social e CNPJ são obrigatórios para pessoa jurídica",
          variant: "destructive",
        })
        return
      }

      const pessoaPayload = {
        tipo_pessoa: tipoPessoa,
        nome: tipoPessoa === "fisica" ? formData.nome : null,
        cpf: tipoPessoa === "fisica" ? formData.cpf : null,
        rg: tipoPessoa === "fisica" ? formData.rg || null : null,
        razao_social: tipoPessoa === "juridica" ? formData.razao_social : null,
        cnpj: tipoPessoa === "juridica" ? formData.cnpj : null,
        inscricao_estadual: tipoPessoa === "juridica" ? formData.inscricao_estadual || null : null,
        data_nascimento: formData.data_nascimento || null,
        email: formData.email || null,
        telefone: formData.telefone || null,
        celular: formData.celular || null,
        status: "ativo",
        id_administradora: user?.perfil_id || 1,
      }

      let pessoaId: number

      if (isEditMode && pessoaEditando) {
        // Atualizar pessoa existente
        const response = await fetch(`/api/pessoas/${pessoaEditando.id}`, {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(pessoaPayload),
        })

        if (!response.ok) throw new Error("Erro ao atualizar pessoa")
        pessoaId = pessoaEditando.id
      } else {
        // Criar nova pessoa
        const response = await fetch("/api/pessoas", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(pessoaPayload),
        })

        if (!response.ok) throw new Error("Erro ao criar pessoa")
        const data = await response.json()
        pessoaId = data.data.id
      }

      // Atualizar endereços
      for (const endereco of enderecos) {
        if (endereco.cep && endereco.logradouro) {
          if (endereco.id) {
            // Atualizar endereço existente
            await fetch(`/api/enderecos/${endereco.id}`, {
              method: "PUT",
              headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`,
              },
              body: JSON.stringify({
                ...endereco,
                pessoa_id: pessoaId,
                id_administradora: user?.perfil_id || 1,
              }),
            })
          } else {
            // Criar novo endereço
            await fetch("/api/enderecos", {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`,
              },
              body: JSON.stringify({
                ...endereco,
                pessoa_id: pessoaId,
                id_administradora: user?.perfil_id || 1,
              }),
            })
          }
        }
      }

      // Atualizar contas bancárias
      for (const conta of contasBancarias) {
        if (conta.banco && conta.agencia && conta.conta) {
          if (conta.id) {
            // Atualizar conta existente
            await fetch(`/api/dados-bancarios/${conta.id}`, {
              method: "PUT",
              headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`,
              },
              body: JSON.stringify({
                ...conta,
                pessoa_id: pessoaId,
                id_administradora: user?.perfil_id || 1,
              }),
            })
          } else {
            // Criar nova conta
            await fetch("/api/dados-bancarios", {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`,
              },
              body: JSON.stringify({
                ...conta,
                pessoa_id: pessoaId,
                id_administradora: user?.perfil_id || 1,
              }),
            })
          }
        }
      }

      toast({
        title: "Sucesso",
        description: isEditMode ? "Pessoa atualizada com sucesso" : "Pessoa cadastrada com sucesso",
      })

      limparFormulario()
      setIsModalOpen(false)
      setIsEditMode(false)
      setPessoaEditando(null)
      carregarPessoas()
    } catch (error: any) {
      console.error("[v0] Erro ao salvar pessoa:", error)
      toast({
        title: "Erro",
        description: error.message || "Não foi possível salvar a pessoa",
        variant: "destructive",
      })
    } finally {
      setSaving(false)
    }
  }

  const limparFormulario = () => {
    setFormData({
      nome: "",
      cpf: "",
      rg: "",
      razao_social: "",
      cnpj: "",
      inscricao_estadual: "",
      data_nascimento: "",
      email: "",
      telefone: "",
      celular: "",
    })
    setEnderecos([
      {
        tipo_endereco: "",
        cep: "",
        logradouro: "",
        numero: "",
        complemento: "",
        bairro: "",
        cidade: "",
        estado: "",
        email: "",
        principal: true,
      },
    ])
    setContasBancarias([{ banco: "", agencia: "", tipo_conta: "", conta: "", digito: "", principal: true }])
    setTipoPessoa("fisica")
    setIsEditMode(false)
    setPessoaEditando(null)
  }

  const filteredPessoas = pessoas.filter((pessoa) => {
    const matchesSearch =
      searchTerm === "" ||
      (pessoa.nome && pessoa.nome.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (pessoa.razao_social && pessoa.razao_social.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (pessoa.cpf && pessoa.cpf.includes(searchTerm)) ||
      (pessoa.cnpj && pessoa.cnpj.includes(searchTerm))
    const matchesTipo =
      tipoFilter === "todos" ||
      (tipoFilter === "Pessoa Física" && pessoa.tipo_pessoa === "fisica") ||
      (tipoFilter === "Pessoa Jurídica" && pessoa.tipo_pessoa === "juridica")
    const matchesStatus = statusFilter === "todos" || pessoa.status === statusFilter.toLowerCase()
    return matchesSearch && matchesTipo && matchesStatus
  })

  const adicionarEndereco = () => {
    setEnderecos([
      ...enderecos,
      {
        tipo_endereco: "",
        cep: "",
        logradouro: "",
        numero: "",
        complemento: "",
        bairro: "",
        cidade: "",
        estado: "",
        email: "",
        principal: false,
      },
    ])
  }

  const removerEndereco = (index: number) => {
    if (enderecos.length > 1) {
      setEnderecos(enderecos.filter((_, i) => i !== index))
    }
  }

  const adicionarConta = () => {
    setContasBancarias([
      ...contasBancarias,
      { banco: "", agencia: "", tipo_conta: "", conta: "", digito: "", principal: false },
    ])
  }

  const removerConta = (index: number) => {
    if (contasBancarias.length > 1) {
      setContasBancarias(contasBancarias.filter((_, i) => i !== index))
    }
  }

  const getIniciais = (pessoa: Pessoa) => {
    // Tenta usar nome_completo ou nome
    const nome = (pessoa as any).nome_completo || pessoa.nome
    if (nome) {
      const palavras = nome.trim().split(" ")
      if (palavras.length >= 2) {
        return `${palavras[0][0]}${palavras[palavras.length - 1][0]}`.toUpperCase()
      }
      return nome.substring(0, 2).toUpperCase()
    }
    // Tenta usar razao_social
    if (pessoa.razao_social) {
      return pessoa.razao_social.substring(0, 2).toUpperCase()
    }
    // Fallback: extrai iniciais do email
    if (pessoa.email) {
      const emailName = pessoa.email.split("@")[0]
      const parts = emailName.split(/[._-]/)
      if (parts.length >= 2) {
        return `${parts[0][0]}${parts[1][0]}`.toUpperCase()
      }
      return emailName.substring(0, 2).toUpperCase()
    }
    return "NA"
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-6 py-6">
        <div className="mb-6 flex items-start justify-between">
          <div>
            <h1 className="text-3xl font-bold text-foreground">Pessoas</h1>
            <p className="text-muted-foreground mt-1">Gerencie todas as pessoas do sistema</p>
          </div>

          <Dialog
            open={isModalOpen}
            onOpenChange={(open) => {
              setIsModalOpen(open)
              if (!open) limparFormulario()
            }}
          >
            <DialogTrigger asChild>
              <Button className="bg-[#00d084] hover:bg-[#00f5a0] text-black">
                <Plus className="w-4 h-4 mr-2" />
                Nova Pessoa
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle>{isEditMode ? "Editar Pessoa" : "Cadastrar Nova Pessoa"}</DialogTitle>
                <DialogDescription>
                  {isEditMode ? "Atualize os dados da pessoa" : "Preencha os dados completos da nova pessoa"}
                </DialogDescription>
              </DialogHeader>

              <Tabs defaultValue="dados-pessoais" className="w-full">
                <TabsList className="grid w-full grid-cols-3">
                  <TabsTrigger value="dados-pessoais">Dados Pessoais</TabsTrigger>
                  <TabsTrigger value="enderecos">Endereços</TabsTrigger>
                  <TabsTrigger value="dados-bancarios">Dados Bancários</TabsTrigger>
                </TabsList>

                <TabsContent value="dados-pessoais" className="space-y-4 mt-4">
                  <div className="space-y-2">
                    <Label htmlFor="tipo-pessoa">Tipo de Pessoa *</Label>
                    <Select value={tipoPessoa} onValueChange={(v) => setTipoPessoa(v as "fisica" | "juridica")}>
                      <SelectTrigger id="tipo-pessoa">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="fisica">Física</SelectItem>
                        <SelectItem value="juridica">Jurídica</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  {tipoPessoa === "fisica" ? (
                    <>
                      <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label htmlFor="nome">Nome *</Label>
                          <Input
                            id="nome"
                            placeholder="Nome completo"
                            value={formData.nome}
                            onChange={(e) => setFormData({ ...formData, nome: e.target.value })}
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="rg">RG</Label>
                          <Input
                            id="rg"
                            placeholder="00.000.000-0"
                            value={formData.rg}
                            onChange={(e) => setFormData({ ...formData, rg: e.target.value })}
                          />
                        </div>
                      </div>

                      <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label htmlFor="cpf">CPF *</Label>
                          <Input
                            id="cpf"
                            placeholder="000.000.000-00"
                            value={formData.cpf}
                            onChange={(e) => setFormData({ ...formData, cpf: e.target.value })}
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="data-nascimento">Data de Nascimento</Label>
                          <Input
                            id="data-nascimento"
                            type="date"
                            value={formData.data_nascimento}
                            onChange={(e) => setFormData({ ...formData, data_nascimento: e.target.value })}
                          />
                        </div>
                      </div>
                    </>
                  ) : (
                    <>
                      <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label htmlFor="razao-social">Razão Social *</Label>
                          <Input
                            id="razao-social"
                            placeholder="Razão social da empresa"
                            value={formData.razao_social}
                            onChange={(e) => setFormData({ ...formData, razao_social: e.target.value })}
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="inscricao-estadual">Inscrição Estadual</Label>
                          <Input
                            id="inscricao-estadual"
                            placeholder="000.000.000.000"
                            value={formData.inscricao_estadual}
                            onChange={(e) => setFormData({ ...formData, inscricao_estadual: e.target.value })}
                          />
                        </div>
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="cnpj">CNPJ *</Label>
                        <Input
                          id="cnpj"
                          placeholder="00.000.000/0000-00"
                          value={formData.cnpj}
                          onChange={(e) => setFormData({ ...formData, cnpj: e.target.value })}
                        />
                      </div>
                    </>
                  )}

                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="email">Email</Label>
                      <Input
                        id="email"
                        type="email"
                        placeholder="email@exemplo.com"
                        value={formData.email}
                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="telefone">Telefone</Label>
                      <Input
                        id="telefone"
                        placeholder="(00) 0000-0000"
                        value={formData.telefone}
                        onChange={(e) => setFormData({ ...formData, telefone: e.target.value })}
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="celular">Celular</Label>
                    <Input
                      id="celular"
                      placeholder="(00) 00000-0000"
                      value={formData.celular}
                      onChange={(e) => setFormData({ ...formData, celular: e.target.value })}
                    />
                  </div>
                </TabsContent>

                <TabsContent value="enderecos" className="space-y-4 mt-4">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-lg font-semibold">Endereços</h3>
                    <Button
                      onClick={adicionarEndereco}
                      size="sm"
                      className="bg-[#00d084] hover:bg-[#00f5a0] text-black"
                    >
                      <Plus className="w-4 h-4 mr-2" />
                      Adicionar Endereço
                    </Button>
                  </div>

                  {enderecos.map((endereco, index) => (
                    <Card key={index} className="p-4 relative">
                      {enderecos.length > 1 && (
                        <Button
                          onClick={() => removerEndereco(index)}
                          size="icon"
                          variant="ghost"
                          className="absolute top-2 right-2"
                        >
                          <X className="w-4 h-4" />
                        </Button>
                      )}
                      <h4 className="font-medium mb-4">
                        {index === 0 ? "Endereço Principal" : `Endereço ${index + 1}`}
                      </h4>

                      <div className="grid grid-cols-3 gap-4 mb-4">
                        <div className="space-y-2">
                          <Label>Tipo de Endereço</Label>
                          <Select
                            value={endereco.tipo_endereco}
                            onValueChange={(v) => {
                              const novosEnderecos = [...enderecos]
                              novosEnderecos[index].tipo_endereco = v
                              setEnderecos(novosEnderecos)
                            }}
                          >
                            <SelectTrigger>
                              <SelectValue placeholder="Selecione" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="residencial">Residencial</SelectItem>
                              <SelectItem value="comercial">Comercial</SelectItem>
                              <SelectItem value="cobranca">Cobrança</SelectItem>
                              <SelectItem value="entrega">Entrega</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                        <div className="space-y-2">
                          <Label>CEP *</Label>
                          <Input
                            placeholder="00000-000"
                            value={endereco.cep}
                            onChange={(e) => {
                              const novosEnderecos = [...enderecos]
                              novosEnderecos[index].cep = e.target.value
                              setEnderecos(novosEnderecos)
                            }}
                          />
                        </div>
                        <div className="space-y-2">
                          <Label>Email</Label>
                          <Input
                            placeholder="email@exemplo"
                            type="email"
                            value={endereco.email}
                            onChange={(e) => {
                              const novosEnderecos = [...enderecos]
                              novosEnderecos[index].email = e.target.value
                              setEnderecos(novosEnderecos)
                            }}
                          />
                        </div>
                      </div>

                      <div className="grid grid-cols-3 gap-4 mb-4">
                        <div className="space-y-2 col-span-2">
                          <Label>Logradouro *</Label>
                          <Input
                            placeholder="Rua, Avenida..."
                            value={endereco.logradouro}
                            onChange={(e) => {
                              const novosEnderecos = [...enderecos]
                              novosEnderecos[index].logradouro = e.target.value
                              setEnderecos(novosEnderecos)
                            }}
                          />
                        </div>
                        <div className="space-y-2">
                          <Label>Número *</Label>
                          <Input
                            placeholder="123"
                            value={endereco.numero}
                            onChange={(e) => {
                              const novosEnderecos = [...enderecos]
                              novosEnderecos[index].numero = e.target.value
                              setEnderecos(novosEnderecos)
                            }}
                          />
                        </div>
                      </div>

                      <div className="grid grid-cols-3 gap-4">
                        <div className="space-y-2">
                          <Label>Complemento</Label>
                          <Input
                            placeholder="Apto, Sala"
                            value={endereco.complemento}
                            onChange={(e) => {
                              const novosEnderecos = [...enderecos]
                              novosEnderecos[index].complemento = e.target.value
                              setEnderecos(novosEnderecos)
                            }}
                          />
                        </div>
                        <div className="space-y-2">
                          <Label>Bairro *</Label>
                          <Input
                            placeholder="Bairro"
                            value={endereco.bairro}
                            onChange={(e) => {
                              const novosEnderecos = [...enderecos]
                              novosEnderecos[index].bairro = e.target.value
                              setEnderecos(novosEnderecos)
                            }}
                          />
                        </div>
                        <div className="space-y-2">
                          <Label>Cidade *</Label>
                          <Input
                            placeholder="Cidade"
                            value={endereco.cidade}
                            onChange={(e) => {
                              const novosEnderecos = [...enderecos]
                              novosEnderecos[index].cidade = e.target.value
                              setEnderecos(novosEnderecos)
                            }}
                          />
                        </div>
                      </div>

                      <div className="grid grid-cols-3 gap-4 mt-4">
                        <div className="space-y-2">
                          <Label>Estado *</Label>
                          <Select
                            value={endereco.estado}
                            onValueChange={(v) => {
                              const novosEnderecos = [...enderecos]
                              novosEnderecos[index].estado = v
                              setEnderecos(novosEnderecos)
                            }}
                          >
                            <SelectTrigger>
                              <SelectValue placeholder="UF" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="SP">SP</SelectItem>
                              <SelectItem value="RJ">RJ</SelectItem>
                              <SelectItem value="MG">MG</SelectItem>
                              <SelectItem value="ES">ES</SelectItem>
                              <SelectItem value="BA">BA</SelectItem>
                              <SelectItem value="PR">PR</SelectItem>
                              <SelectItem value="SC">SC</SelectItem>
                              <SelectItem value="RS">RS</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                      </div>
                    </Card>
                  ))}
                </TabsContent>

                <TabsContent value="dados-bancarios" className="space-y-4 mt-4">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-lg font-semibold">Dados Bancários</h3>
                    <Button onClick={adicionarConta} size="sm" className="bg-[#00d084] hover:bg-[#00f5a0] text-black">
                      <Plus className="w-4 h-4 mr-2" />
                      Adicionar Conta
                    </Button>
                  </div>

                  {contasBancarias.map((conta, index) => (
                    <Card key={index} className="p-4 relative">
                      {contasBancarias.length > 1 && (
                        <Button
                          onClick={() => removerConta(index)}
                          size="icon"
                          variant="ghost"
                          className="absolute top-2 right-2"
                        >
                          <X className="w-4 h-4" />
                        </Button>
                      )}
                      <h4 className="font-medium mb-4">{index === 0 ? "Conta Principal" : `Conta ${index + 1}`}</h4>

                      <div className="grid grid-cols-2 gap-4 mb-4">
                        <div className="space-y-2">
                          <Label>Banco *</Label>
                          <Select
                            value={conta.banco}
                            onValueChange={(v) => {
                              const novasContas = [...contasBancarias]
                              novasContas[index].banco = v
                              setContasBancarias(novasContas)
                            }}
                          >
                            <SelectTrigger>
                              <SelectValue placeholder="Selecione o banco" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="001">001 - Banco do Brasil</SelectItem>
                              <SelectItem value="237">237 - Bradesco</SelectItem>
                              <SelectItem value="341">341 - Itaú</SelectItem>
                              <SelectItem value="104">104 - Caixa Econômica</SelectItem>
                              <SelectItem value="033">033 - Santander</SelectItem>
                              <SelectItem value="077">077 - Inter</SelectItem>
                              <SelectItem value="260">260 - Nubank</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                        <div className="space-y-2">
                          <Label>Agência *</Label>
                          <Input
                            placeholder="0000-0"
                            value={conta.agencia}
                            onChange={(e) => {
                              const novasContas = [...contasBancarias]
                              novasContas[index].agencia = e.target.value
                              setContasBancarias(novasContas)
                            }}
                          />
                        </div>
                      </div>

                      <div className="grid grid-cols-3 gap-4">
                        <div className="space-y-2">
                          <Label>Tipo da Conta *</Label>
                          <Select
                            value={conta.tipo_conta}
                            onValueChange={(v) => {
                              const novasContas = [...contasBancarias]
                              novasContas[index].tipo_conta = v
                              setContasBancarias(novasContas)
                            }}
                          >
                            <SelectTrigger>
                              <SelectValue placeholder="Tipo" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="corrente">Corrente</SelectItem>
                              <SelectItem value="poupanca">Poupança</SelectItem>
                              <SelectItem value="salario">Salário</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                        <div className="space-y-2">
                          <Label>Conta *</Label>
                          <Input
                            placeholder="00000-0"
                            value={conta.conta}
                            onChange={(e) => {
                              const novasContas = [...contasBancarias]
                              novasContas[index].conta = e.target.value
                              setContasBancarias(novasContas)
                            }}
                          />
                        </div>
                        <div className="space-y-2">
                          <Label>Dígito *</Label>
                          <Input
                            placeholder="0"
                            maxLength={1}
                            value={conta.digito}
                            onChange={(e) => {
                              const novasContas = [...contasBancarias]
                              novasContas[index].digito = e.target.value
                              setContasBancarias(novasContas)
                            }}
                          />
                        </div>
                      </div>
                    </Card>
                  ))}
                </TabsContent>
              </Tabs>

              <div className="flex justify-end gap-3 mt-6">
                <Button variant="outline" onClick={() => setIsModalOpen(false)} disabled={saving}>
                  Cancelar
                </Button>
                <Button className="bg-[#00d084] hover:bg-[#00f5a0] text-black" onClick={salvarPessoa} disabled={saving}>
                  {saving ? (
                    <>
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                      Salvando...
                    </>
                  ) : (
                    "Salvar Pessoa"
                  )}
                </Button>
              </div>
            </DialogContent>
          </Dialog>
        </div>

        <Card className="mb-6">
          <CardHeader>
            <CardTitle>Pesquisar Pessoa</CardTitle>
            <CardDescription>Digite o nome, CPF ou CNPJ para pesquisar</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex gap-4">
              <Input
                placeholder="Digite aqui..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="flex-1"
              />
              <Button className="bg-[#00d084] hover:bg-[#00f5a0] text-black">
                <Search className="w-4 h-4 mr-2" />
                Pesquisar
              </Button>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle>Todas as Pessoas Cadastradas</CardTitle>
                <CardDescription>{filteredPessoas.length} pessoas encontradas</CardDescription>
              </div>
              <div className="flex gap-3">
                <Select value={tipoFilter} onValueChange={setTipoFilter}>
                  <SelectTrigger className="w-[180px]">
                    <SelectValue placeholder="Todos os Tipos" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="todos">Todos os Tipos</SelectItem>
                    <SelectItem value="Pessoa Física">Pessoa Física</SelectItem>
                    <SelectItem value="Pessoa Jurídica">Pessoa Jurídica</SelectItem>
                  </SelectContent>
                </Select>
                <Select value={statusFilter} onValueChange={setStatusFilter}>
                  <SelectTrigger className="w-[150px]">
                    <SelectValue placeholder="Todos" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="todos">Todos</SelectItem>
                    <SelectItem value="Ativo">Ativo</SelectItem>
                    <SelectItem value="Inativo">Inativo</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            {loading ? (
              <div className="flex items-center justify-center py-8">
                <Loader2 className="w-8 h-8 animate-spin text-muted-foreground" />
              </div>
            ) : (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Nome</TableHead>
                    <TableHead>Documento</TableHead>
                    <TableHead>Tipo</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className="text-right">Ações</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredPessoas.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={5} className="text-center text-muted-foreground py-8">
                        Nenhuma pessoa encontrada
                      </TableCell>
                    </TableRow>
                  ) : (
                    filteredPessoas.map((pessoa) => (
                      <TableRow key={pessoa.id}>
                        <TableCell>
                          <div className="flex items-center gap-3">
                            <Avatar className="h-10 w-10 bg-[#1a1a1a]">
                              <AvatarFallback className="text-sm font-medium bg-[#00d084] text-black">
                                {getIniciais(pessoa)}
                              </AvatarFallback>
                            </Avatar>
                            <div>
                              <div className="font-medium text-foreground">
                                {pessoa.tipo_pessoa === "fisica" 
                                  ? ((pessoa as any).nome_completo || pessoa.nome || pessoa.email?.split("@")[0]) 
                                  : pessoa.razao_social}
                              </div>
                              <div className="text-sm text-muted-foreground">{pessoa.email || "Sem email"}</div>
                            </div>
                          </div>
                        </TableCell>
                        <TableCell className="text-foreground">
                          {pessoa.tipo_pessoa === "fisica" ? pessoa.cpf : pessoa.cnpj}
                        </TableCell>
                        <TableCell>
                          <Badge variant="outline" className="bg-muted">
                            {pessoa.tipo_pessoa === "fisica" ? "Pessoa Física" : "Pessoa Jurídica"}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <Badge
                            variant="outline"
                            className={
                              pessoa.status === "ativo"
                                ? "bg-[#00d084] text-black border-[#00d084]"
                                : "bg-[#737373] text-white border-[#737373]"
                            }
                          >
                            {pessoa.status === "ativo" ? "Ativo" : "Inativo"}
                          </Badge>
                        </TableCell>
                        <TableCell className="text-right">
                          <div className="flex items-center justify-end gap-2">
                            <Button variant="ghost" size="sm" onClick={() => abrirDetalhes(pessoa)}>
                              <Eye className="w-4 h-4 mr-1" />
                              Ver Detalhes
                            </Button>
                            <Button variant="ghost" size="sm" onClick={() => abrirEdicao(pessoa)}>
                              <Pencil className="w-4 h-4" />
                            </Button>
                            <Button variant="ghost" size="sm" onClick={() => confirmarExclusao(pessoa)}>
                              <Trash2 className="w-4 h-4 text-destructive" />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            )}
          </CardContent>
        </Card>

        <AlertDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Confirmar Exclusão</AlertDialogTitle>
              <AlertDialogDescription>
                Tem certeza que deseja excluir a pessoa{" "}
                <strong>{pessoaParaExcluir?.nome || pessoaParaExcluir?.razao_social}</strong>? Esta ação não pode ser
                desfeita.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Cancelar</AlertDialogCancel>
              <AlertDialogAction onClick={excluirPessoa} className="bg-destructive hover:bg-destructive/90">
                Excluir
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>

        <Dialog open={isDetalhesOpen} onOpenChange={setIsDetalhesOpen}>
          <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Detalhes da Pessoa</DialogTitle>
              <DialogDescription>Informações completas da pessoa cadastrada</DialogDescription>
            </DialogHeader>

            {pessoaDetalhes && (
              <Tabs defaultValue="dados-pessoais" className="w-full">
                <TabsList className="grid w-full grid-cols-3">
                  <TabsTrigger value="dados-pessoais">Dados Pessoais</TabsTrigger>
                  <TabsTrigger value="enderecos">Endereços ({enderecosDetalhes.length})</TabsTrigger>
                  <TabsTrigger value="dados-bancarios">Dados Bancários ({contasDetalhes.length})</TabsTrigger>
                </TabsList>

                <TabsContent value="dados-pessoais" className="space-y-4 mt-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label className="text-muted-foreground">Tipo de Pessoa</Label>
                      <p className="font-medium">
                        {pessoaDetalhes.tipo_pessoa === "fisica" ? "Pessoa Física" : "Pessoa Jurídica"}
                      </p>
                    </div>
                    <div>
                      <Label className="text-muted-foreground">Status</Label>
                      <p className="font-medium capitalize">{pessoaDetalhes.status}</p>
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label className="text-muted-foreground">Nome</Label>
                      <p className="font-medium">
                        {pessoaDetalhes.tipo_pessoa === "fisica" ? pessoaDetalhes.nome : pessoaDetalhes.razao_social}
                      </p>
                    </div>
                    <div>
                      <Label className="text-muted-foreground">
                        {pessoaDetalhes.tipo_pessoa === "fisica" ? "CPF" : "CNPJ"}
                      </Label>
                      <p className="font-medium">{pessoaDetalhes.cpf || pessoaDetalhes.cnpj}</p>
                    </div>
                  </div>
                  {(pessoaDetalhes.rg || pessoaDetalhes.inscricao_estadual) && (
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <Label className="text-muted-foreground">
                          {pessoaDetalhes.tipo_pessoa === "fisica" ? "RG" : "IE"}
                        </Label>
                        <p className="font-medium">{pessoaDetalhes.rg || pessoaDetalhes.inscricao_estadual}</p>
                      </div>
                      {pessoaDetalhes.data_nascimento && (
                        <div>
                          <Label className="text-muted-foreground">Data de Nascimento</Label>
                          <p className="font-medium">
                            {new Date(pessoaDetalhes.data_nascimento).toLocaleDateString("pt-BR")}
                          </p>
                        </div>
                      )}
                    </div>
                  )}
                  <div className="grid grid-cols-2 gap-4">
                    {pessoaDetalhes.email && (
                      <div>
                        <Label className="text-muted-foreground">Email</Label>
                        <p className="font-medium">{pessoaDetalhes.email}</p>
                      </div>
                    )}
                    {pessoaDetalhes.telefone && (
                      <div>
                        <Label className="text-muted-foreground">Telefone</Label>
                        <p className="font-medium">{pessoaDetalhes.telefone}</p>
                      </div>
                    )}
                    {pessoaDetalhes.celular && (
                      <div>
                        <Label className="text-muted-foreground">Celular</Label>
                        <p className="font-medium">{pessoaDetalhes.celular}</p>
                      </div>
                    )}
                  </div>
                </TabsContent>

                <TabsContent value="enderecos" className="space-y-4 mt-4">
                  {enderecosDetalhes.length === 0 ? (
                    <p className="text-center text-muted-foreground py-8">Nenhum endereço cadastrado</p>
                  ) : (
                    enderecosDetalhes.map((endereco, index) => (
                      <Card key={endereco.id} className="p-4">
                        <h4 className="font-medium mb-4">
                          {endereco.principal ? "Endereço Principal" : `Endereço ${index + 1}`}
                        </h4>
                        <div className="grid grid-cols-2 gap-4">
                          <div>
                            <Label className="text-muted-foreground">Tipo</Label>
                            <p className="font-medium capitalize">{endereco.tipo_endereco}</p>
                          </div>
                          <div>
                            <Label className="text-muted-foreground">CEP</Label>
                            <p className="font-medium">{endereco.cep}</p>
                          </div>
                        </div>
                        <div className="mt-4">
                          <Label className="text-muted-foreground">Endereço Completo</Label>
                          <p className="font-medium">
                            {endereco.logradouro}, {endereco.numero}
                            {endereco.complemento && ` - ${endereco.complemento}`}
                          </p>
                          <p className="font-medium">
                            {endereco.bairro} - {endereco.cidade}/{endereco.estado}
                          </p>
                        </div>
                        {endereco.email && (
                          <div className="mt-4">
                            <Label className="text-muted-foreground">Email</Label>
                            <p className="font-medium">{endereco.email}</p>
                          </div>
                        )}
                      </Card>
                    ))
                  )}
                </TabsContent>

                <TabsContent value="dados-bancarios" className="space-y-4 mt-4">
                  {contasDetalhes.length === 0 ? (
                    <p className="text-center text-muted-foreground py-8">Nenhuma conta bancária cadastrada</p>
                  ) : (
                    contasDetalhes.map((conta, index) => (
                      <Card key={conta.id} className="p-4">
                        <h4 className="font-medium mb-4">
                          {conta.principal ? "Conta Principal" : `Conta ${index + 1}`}
                        </h4>
                        <div className="grid grid-cols-2 gap-4">
                          <div>
                            <Label className="text-muted-foreground">Banco</Label>
                            <p className="font-medium">{conta.banco}</p>
                          </div>
                          <div>
                            <Label className="text-muted-foreground">Agência</Label>
                            <p className="font-medium">{conta.agencia}</p>
                          </div>
                        </div>
                        <div className="grid grid-cols-3 gap-4 mt-4">
                          <div>
                            <Label className="text-muted-foreground">Tipo da Conta</Label>
                            <p className="font-medium capitalize">{conta.tipo_conta}</p>
                          </div>
                          <div>
                            <Label className="text-muted-foreground">Conta</Label>
                            <p className="font-medium">{conta.conta}</p>
                          </div>
                          <div>
                            <Label className="text-muted-foreground">Dígito</Label>
                            <p className="font-medium">{conta.digito}</p>
                          </div>
                        </div>
                      </Card>
                    ))
                  )}
                </TabsContent>
              </Tabs>
            )}
          </DialogContent>
        </Dialog>
      </div>
    </div>
  )
}
