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
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { AddressCard } from "@/components/shared/address-card"
import { BankAccountCard } from "@/components/shared/bank-account-card"
import { AddressModal } from "@/components/shared/address-modal"
import { BankAccountModal } from "@/components/shared/bank-account-modal"

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
  tipo: "fisica" | "juridica"
  nome: string
  rg?: string
  cpf?: string
  dataNascimento?: string
  razaoSocial?: string
  razaoAbreviada?: string
  cnpj?: string
  dataAbertura?: string
  inscricaoEstadual?: string
  inscricaoMunicipal?: string
  codigoAtividade?: string
  status: string
  enderecos: Endereco[]
  dadosBancarios: DadoBancario[]
}

export default function PessoasPage() {
  const [searchTerm, setSearchTerm] = useState("")
  const [searchResults, setSearchResults] = useState<Pessoa[]>([])
  const [showResults, setShowResults] = useState(false)
  const [selectedPerson, setSelectedPerson] = useState<Pessoa | null>(null)
  const [showNewPersonModal, setShowNewPersonModal] = useState(false)
  const [showEditModal, setShowEditModal] = useState(false)
  const [editingSection, setEditingSection] = useState<"dados" | "enderecos" | "bancarios">("dados")
  const [newPersonType, setNewPersonType] = useState("fisica")

  const [editingEnderecoId, setEditingEnderecoId] = useState<number | null>(null)
  const [editingBancoId, setEditingBancoId] = useState<number | null>(null)
  const [showAddEnderecoModal, setShowAddEnderecoModal] = useState(false)
  const [showAddBancoModal, setShowAddBancoModal] = useState(false)
  const [pessoas, setPessoas] = useState<Pessoa[]>([])

  const [currentPage, setCurrentPage] = useState(1)
  const [itemsPerPage] = useState(10)
  const [sortBy, setSortBy] = useState<"nome" | "tipo" | "status">("nome")
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("asc")
  const [filterType, setFilterType] = useState<"all" | "fisica" | "juridica">("all")
  const [filterStatus, setFilterStatus] = useState<"all" | "Ativo" | "Inativo">("all")
  const [showAllPeople, setShowAllPeople] = useState(true)

  const [editFormData, setEditFormData] = useState<any>({})
  const [newEnderecoData, setNewEnderecoData] = useState({
    tipo: "",
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
    tipoConta: "",
    conta: "",
    digito: "",
  })

  const [showEditEnderecoModal, setShowEditEnderecoModal] = useState(false)
  const [showEditBancoModal, setShowEditBancoModal] = useState(false)
  const [editingEndereco, setEditingEndereco] = useState<Endereco | null>(null)
  const [editingBanco, setEditingBanco] = useState<DadoBancario | null>(null)

  const pessoasDatabase: Pessoa[] = [
    // Pessoas Físicas
    {
      id: 1,
      tipo: "fisica",
      nome: "João Silva Santos",
      rg: "12.345.678-9",
      cpf: "123.456.789-00",
      dataNascimento: "15/03/1985",
      status: "Ativo",
      enderecos: [
        {
          id: 1,
          tipo: "residencial",
          cep: "01234-567",
          logradouro: "Rua das Flores",
          numero: "123",
          bairro: "Centro",
          cidade: "São Paulo",
          estado: "SP",
          email: "joao.silva@email.com",
        },
        {
          id: 2,
          tipo: "comercial",
          cep: "01310-100",
          logradouro: "Av. Paulista",
          numero: "1578",
          complemento: "Sala 1205",
          bairro: "Bela Vista",
          cidade: "São Paulo",
          estado: "SP",
          email: "joao.trabalho@email.com",
        },
        {
          id: 3,
          tipo: "cobranca",
          cep: "04567-890",
          logradouro: "Rua Augusta",
          numero: "2890",
          bairro: "Consolação",
          cidade: "São Paulo",
          estado: "SP",
          email: "joao.cobranca@email.com",
        },
      ],
      dadosBancarios: [
        {
          id: 1,
          banco: "Banco do Brasil",
          agencia: "1234-5",
          tipoConta: "corrente",
          conta: "12345-6",
          digitoConta: "7",
        },
        {
          id: 2,
          banco: "Itaú",
          agencia: "5678-9",
          tipoConta: "poupanca",
          conta: "98765-4",
          digitoConta: "3",
        },
        {
          id: 3,
          banco: "Santander",
          agencia: "9876-5",
          tipoConta: "corrente",
          conta: "54321-0",
          digitoConta: "9",
        },
      ],
    },
    {
      id: 2,
      tipo: "fisica",
      nome: "Maria Santos Oliveira",
      rg: "98.765.432-1",
      cpf: "987.654.321-00",
      dataNascimento: "22/07/1990",
      status: "Ativo",
      enderecos: [
        {
          id: 1,
          tipo: "residencial",
          cep: "04567-890",
          logradouro: "Av. Paulista",
          numero: "456",
          bairro: "Bela Vista",
          cidade: "São Paulo",
          estado: "SP",
          email: "maria.santos@email.com",
        },
      ],
      dadosBancarios: [
        {
          id: 1,
          banco: "Itaú",
          agencia: "5678-9",
          tipoConta: "poupanca",
          conta: "98765-4",
          digitoConta: "3",
        },
      ],
    },
    {
      id: 3,
      tipo: "fisica",
      nome: "Carlos Eduardo Pereira",
      rg: "45.678.912-3",
      cpf: "456.789.123-45",
      dataNascimento: "10/12/1978",
      status: "Ativo",
      enderecos: [
        {
          id: 1,
          tipo: "residencial",
          cep: "02468-135",
          logradouro: "Rua Augusta",
          numero: "789",
          bairro: "Consolação",
          cidade: "São Paulo",
          estado: "SP",
          email: "carlos.pereira@email.com",
        },
        {
          id: 2,
          tipo: "comercial",
          cep: "01414-001",
          logradouro: "Av. Rebouças",
          numero: "3970",
          complemento: "Conj. 82",
          bairro: "Pinheiros",
          cidade: "São Paulo",
          estado: "SP",
          email: "carlos.escritorio@email.com",
        },
      ],
      dadosBancarios: [
        {
          id: 1,
          banco: "Bradesco",
          agencia: "9876-5",
          tipoConta: "corrente",
          conta: "54321-0",
          digitoConta: "9",
        },
        {
          id: 2,
          banco: "Nubank",
          agencia: "0001",
          tipoConta: "corrente",
          conta: "12345678-9",
          digitoConta: "0",
        },
      ],
    },
    {
      id: 4,
      tipo: "fisica",
      nome: "Ana Paula Costa",
      rg: "78.912.345-6",
      cpf: "789.123.456-78",
      dataNascimento: "05/09/1992",
      status: "Ativo",
      enderecos: [
        {
          id: 1,
          tipo: "residencial",
          cep: "03691-258",
          logradouro: "Rua da Liberdade",
          numero: "321",
          bairro: "Liberdade",
          cidade: "São Paulo",
          estado: "SP",
          email: "ana.costa@email.com",
        },
      ],
      dadosBancarios: [
        {
          id: 1,
          banco: "Santander",
          agencia: "1357-2",
          tipoConta: "corrente",
          conta: "24681-3",
          digitoConta: "5",
        },
      ],
    },
    {
      id: 5,
      tipo: "fisica",
      nome: "Roberto Almeida Junior",
      rg: "32.165.498-7",
      cpf: "321.654.987-01",
      dataNascimento: "18/04/1987",
      status: "Ativo",
      enderecos: [
        {
          id: 1,
          tipo: "residencial",
          cep: "05432-167",
          logradouro: "Av. Faria Lima",
          numero: "654",
          bairro: "Itaim Bibi",
          cidade: "São Paulo",
          estado: "SP",
          email: "roberto.almeida@email.com",
        },
      ],
      dadosBancarios: [
        {
          id: 1,
          banco: "Caixa Econômica",
          agencia: "2468-1",
          tipoConta: "poupanca",
          conta: "13579-2",
          digitoConta: "4",
        },
      ],
    },
    // Pessoas Jurídicas
    {
      id: 6,
      tipo: "juridica",
      nome: "TechSolutions Ltda",
      razaoSocial: "TechSolutions Tecnologia e Inovação Ltda",
      razaoAbreviada: "TechSolutions",
      cnpj: "12.345.678/0001-90",
      dataAbertura: "10/01/2020",
      inscricaoEstadual: "123.456.789.123",
      inscricaoMunicipal: "987654321",
      codigoAtividade: "Desenvolvimento de Software",
      status: "Ativo",
      enderecos: [
        {
          id: 1,
          tipo: "comercial",
          cep: "01310-100",
          logradouro: "Av. Paulista",
          numero: "1000",
          bairro: "Bela Vista",
          cidade: "São Paulo",
          estado: "SP",
          email: "contato@techsolutions.com.br",
        },
        {
          id: 2,
          tipo: "cobranca",
          cep: "04567-890",
          logradouro: "Rua Funchal",
          numero: "418",
          complemento: "Conj. 2304",
          bairro: "Vila Olímpia",
          cidade: "São Paulo",
          estado: "SP",
          email: "financeiro@techsolutions.com.br",
        },
      ],
      dadosBancarios: [
        {
          id: 1,
          banco: "Banco do Brasil",
          agencia: "3456-7",
          tipoConta: "corrente",
          conta: "78901-2",
          digitoConta: "3",
        },
        {
          id: 2,
          banco: "Bradesco",
          agencia: "1234-5",
          tipoConta: "corrente",
          conta: "67890-1",
          digitoConta: "2",
        },
        {
          id: 3,
          banco: "Santander",
          agencia: "9876-5",
          tipoConta: "corrente",
          conta: "11111-1",
          digitoConta: "1",
        },
      ],
    },
    {
      id: 7,
      tipo: "juridica",
      nome: "Comercial ABC S/A",
      razaoSocial: "ABC Comércio e Distribuição S/A",
      razaoAbreviada: "Comercial ABC",
      cnpj: "98.765.432/0001-10",
      dataAbertura: "15/03/2018",
      inscricaoEstadual: "987.654.321.987",
      inscricaoMunicipal: "123456789",
      codigoAtividade: "Comércio Atacadista",
      status: "Ativo",
      enderecos: [
        {
          id: 1,
          tipo: "comercial",
          cep: "04567-890",
          logradouro: "Rua do Comércio",
          numero: "2500",
          bairro: "Vila Olímpia",
          cidade: "São Paulo",
          estado: "SP",
          email: "vendas@comercialabc.com.br",
        },
      ],
      dadosBancarios: [
        {
          id: 1,
          banco: "Itaú",
          agencia: "7890-1",
          tipoConta: "corrente",
          conta: "23456-7",
          digitoConta: "8",
        },
      ],
    },
    {
      id: 8,
      tipo: "juridica",
      nome: "Construtora Delta Ltda",
      razaoSocial: "Delta Construções e Incorporações Ltda",
      razaoAbreviada: "Construtora Delta",
      cnpj: "45.678.912/0001-34",
      dataAbertura: "22/08/2015",
      inscricaoEstadual: "456.789.123.456",
      inscricaoMunicipal: "456789123",
      codigoAtividade: "Construção Civil",
      status: "Ativo",
      enderecos: [
        {
          id: 1,
          tipo: "comercial",
          cep: "02468-135",
          logradouro: "Av. das Nações Unidas",
          numero: "1500",
          bairro: "Brooklin",
          cidade: "São Paulo",
          estado: "SP",
          email: "obras@construtoradelta.com.br",
        },
        {
          id: 2,
          tipo: "comercial",
          cep: "05432-167",
          logradouro: "Av. Faria Lima",
          numero: "2232",
          complemento: "19º andar",
          bairro: "Itaim Bibi",
          cidade: "São Paulo",
          estado: "SP",
          email: "administrativo@construtoradelta.com.br",
        },
        {
          id: 3,
          tipo: "cobranca",
          cep: "01310-100",
          logradouro: "Av. Paulista",
          numero: "807",
          complemento: "Conj. 1101",
          bairro: "Bela Vista",
          cidade: "São Paulo",
          estado: "SP",
          email: "cobranca@construtoradelta.com.br",
        },
      ],
      dadosBancarios: [
        {
          id: 1,
          banco: "Bradesco",
          agencia: "1234-5",
          tipoConta: "corrente",
          conta: "67890-1",
          digitoConta: "2",
        },
        {
          id: 2,
          banco: "Itaú",
          agencia: "7890-1",
          tipoConta: "corrente",
          conta: "23456-7",
          digitoConta: "8",
        },
      ],
    },
    {
      id: 9,
      tipo: "juridica",
      nome: "Logística Express ME",
      razaoSocial: "Express Transportes e Logística ME",
      razaoAbreviada: "Logística Express",
      cnpj: "78.912.345/0001-67",
      dataAbertura: "05/11/2019",
      inscricaoEstadual: "789.123.456.789",
      inscricaoMunicipal: "789123456",
      codigoAtividade: "Transporte Rodoviário",
      status: "Ativo",
      enderecos: [
        {
          id: 1,
          tipo: "comercial",
          cep: "03691-258",
          logradouro: "Rodovia dos Bandeirantes",
          numero: "Km 15",
          bairro: "Distrito Industrial",
          cidade: "Osasco",
          estado: "SP",
          email: "operacoes@logisticaexpress.com.br",
        },
      ],
      dadosBancarios: [
        {
          id: 1,
          banco: "Santander",
          agencia: "5678-9",
          tipoConta: "corrente",
          conta: "34567-8",
          digitoConta: "9",
        },
      ],
    },
    {
      id: 10,
      tipo: "juridica",
      nome: "Consultoria Omega Ltda",
      razaoSocial: "Omega Consultoria Empresarial Ltda",
      razaoAbreviada: "Consultoria Omega",
      cnpj: "32.165.498/0001-70",
      dataAbertura: "12/06/2021",
      inscricaoEstadual: "321.654.987.321",
      inscricaoMunicipal: "321654987",
      codigoAtividade: "Consultoria Empresarial",
      status: "Ativo",
      enderecos: [
        {
          id: 1,
          tipo: "comercial",
          cep: "05432-167",
          logradouro: "Av. Brigadeiro Faria Lima",
          numero: "3500",
          bairro: "Itaim Bibi",
          cidade: "São Paulo",
          estado: "SP",
          email: "contato@consultoriaomega.com.br",
        },
      ],
      dadosBancarios: [
        {
          id: 1,
          banco: "Caixa Econômica",
          agencia: "9012-3",
          tipoConta: "corrente",
          conta: "45678-9",
          digitoConta: "0",
        },
      ],
    },
  ]

  useEffect(() => {
    setPessoas(pessoasDatabase)
  }, [])

  const validarCPF = (cpf: string): boolean => {
    const cpfLimpo = cpf.replace(/\D/g, "")
    if (cpfLimpo.length !== 11) return false

    // Verifica se todos os dígitos são iguais
    if (/^(\d)\1{10}$/.test(cpfLimpo)) return false

    // Validação do primeiro dígito verificador
    let soma = 0
    for (let i = 0; i < 9; i++) {
      soma += Number.parseInt(cpfLimpo.charAt(i)) * (10 - i)
    }
    let resto = 11 - (soma % 11)
    if (resto === 10 || resto === 11) resto = 0
    if (resto !== Number.parseInt(cpfLimpo.charAt(9))) return false

    // Validação do segundo dígito verificador
    soma = 0
    for (let i = 0; i < 10; i++) {
      soma += Number.parseInt(cpfLimpo.charAt(i)) * (11 - i)
    }
    resto = 11 - (soma % 11)
    if (resto === 10 || resto === 11) resto = 0
    if (resto !== Number.parseInt(cpfLimpo.charAt(10))) return false

    return true
  }

  const validarCNPJ = (cnpj: string): boolean => {
    const cnpjLimpo = cnpj.replace(/\D/g, "")
    if (cnpjLimpo.length !== 14) return false

    // Verifica se todos os dígitos são iguais
    if (/^(\d)\1{13}$/.test(cnpjLimpo)) return false

    // Validação do primeiro dígito verificador
    let tamanho = cnpjLimpo.length - 2
    let numeros = cnpjLimpo.substring(0, tamanho)
    const digitos = cnpjLimpo.substring(tamanho)
    let soma = 0
    let pos = tamanho - 7

    for (let i = tamanho; i >= 1; i--) {
      soma += Number.parseInt(numeros.charAt(tamanho - i)) * pos--
      if (pos < 2) pos = 9
    }

    let resultado = soma % 11 < 2 ? 0 : 11 - (soma % 11)
    if (resultado !== Number.parseInt(digitos.charAt(0))) return false

    // Validação do segundo dígito verificador
    tamanho = tamanho + 1
    numeros = cnpjLimpo.substring(0, tamanho)
    soma = 0
    pos = tamanho - 7

    for (let i = tamanho; i >= 1; i--) {
      soma += Number.parseInt(numeros.charAt(tamanho - i)) * pos--
      if (pos < 2) pos = 9
    }

    resultado = soma % 11 < 2 ? 0 : 11 - (soma % 11)
    if (resultado !== Number.parseInt(digitos.charAt(1))) return false

    return true
  }

  const validarRG = (rg: string): boolean => {
    const rgLimpo = rg.replace(/\D/g, "")
    return rgLimpo.length >= 7 && rgLimpo.length <= 9
  }

  const buscarCEP = async (cep: string) => {
    try {
      const cepLimpo = cep.replace(/\D/g, "")
      if (cepLimpo.length !== 8) {
        console.log("[v0] CEP deve ter 8 dígitos")
        return null
      }

      console.log("[v0] Buscando CEP:", cepLimpo)
      const response = await fetch(`https://viacep.com.br/ws/${cepLimpo}/json/`)
      const data = await response.json()

      if (!data.erro) {
        console.log("[v0] CEP encontrado:", data)
        return {
          logradouro: data.logradouro,
          bairro: data.bairro,
          cidade: data.localidade,
          estado: data.uf,
        }
      } else {
        console.log("[v0] CEP não encontrado")
      }
    } catch (error) {
      console.error("[v0] Erro ao buscar CEP:", error)
    }
    return null
  }

  const handleSearch = () => {
    if (!searchTerm.trim()) {
      setShowResults(false)
      return
    }

    const results = pessoas.filter(
      (pessoa) =>
        pessoa.nome.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (pessoa.cpf && pessoa.cpf.includes(searchTerm)) ||
        (pessoa.cnpj && pessoa.cnpj.includes(searchTerm)) ||
        (pessoa.razaoSocial && pessoa.razaoSocial.toLowerCase().includes(searchTerm.toLowerCase())),
    )

    setSearchResults(results)
    setShowResults(true)
  }

  const handleSelectPerson = (pessoa: Pessoa) => {
    setSelectedPerson(pessoa)
    setShowResults(false)
    setSearchTerm("")
  }

  const handleEditSection = (section: "dados" | "enderecos" | "bancarios") => {
    setEditingSection(section)
    setShowEditModal(true)
  }

  const handleSaveNewPerson = () => {
    // Aqui você implementaria a lógica para salvar a nova pessoa
    // Por enquanto, vamos simular adicionando uma pessoa de exemplo
    const novaPessoa: Pessoa = {
      id: pessoas.length + 1,
      tipo: newPersonType as "fisica" | "juridica",
      nome: newPersonType === "fisica" ? "Nova Pessoa Física" : "Nova Empresa Ltda",
      cpf: newPersonType === "fisica" ? "000.000.000-00" : undefined,
      cnpj: newPersonType === "juridica" ? "00.000.000/0001-00" : undefined,
      status: "Ativo",
      enderecos: [],
      dadosBancarios: [],
    }

    setPessoas([...pessoas, novaPessoa])
    setShowNewPersonModal(false)
    setSelectedPerson(novaPessoa)
  }

  const handleEditEndereco = (enderecoId: number) => {
    setEditingEnderecoId(enderecoId)
    setShowEditModal(true)
    setEditingSection("enderecos")
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

  const handleEditBanco = (bancoId: number) => {
    setEditingBancoId(bancoId)
    setShowEditModal(true)
    setEditingSection("bancarios")
  }

  const getFilteredAndSortedPeople = () => {
    const filtered = pessoasDatabase.filter((pessoa) => {
      const matchesType = filterType === "all" || pessoa.tipo === filterType
      const matchesStatus = filterStatus === "all" || pessoa.status === filterStatus
      return matchesType && matchesStatus
    })

    filtered.sort((a, b) => {
      let aValue = a[sortBy]
      let bValue = b[sortBy]

      if (sortBy === "nome") {
        aValue = a.nome.toLowerCase()
        bValue = b.nome.toLowerCase()
      }

      if (sortOrder === "asc") {
        return aValue < bValue ? -1 : aValue > bValue ? 1 : 0
      } else {
        return aValue > bValue ? -1 : aValue < bValue ? 1 : 0
      }
    })

    return filtered
  }

  const getPaginatedPeople = () => {
    const filtered = getFilteredAndSortedPeople()
    const startIndex = (currentPage - 1) * itemsPerPage
    const endIndex = startIndex + itemsPerPage
    return {
      people: filtered.slice(startIndex, endIndex),
      totalPages: Math.ceil(filtered.length / itemsPerPage),
      totalItems: filtered.length,
    }
  }

  const handleSelectPersonFromGrid = (pessoa: Pessoa) => {
    setSelectedPerson(pessoa)
    setShowAllPeople(false)
    setShowResults(false)
  }

  const handleBackToGrid = () => {
    setSelectedPerson(null)
    setShowAllPeople(true)
    setShowResults(false)
  }

  const handleSaveEditDados = () => {
    if (selectedPerson) {
      const updatedPerson = { ...selectedPerson, ...editFormData }
      setSelectedPerson(updatedPerson)
      setPessoas(pessoas.map((p) => (p.id === selectedPerson.id ? updatedPerson : p)))
      setShowEditModal(false)
      setEditFormData({})
    }
  }

  const handleSaveNewEndereco = () => {
    if (selectedPerson && newEnderecoData.tipo && newEnderecoData.cep && newEnderecoData.logradouro) {
      const novoEndereco = {
        id: selectedPerson.enderecos.length + 1,
        ...newEnderecoData,
      }
      const updatedPerson = {
        ...selectedPerson,
        enderecos: [...selectedPerson.enderecos, novoEndereco],
      }
      setSelectedPerson(updatedPerson)
      setPessoas(pessoas.map((p) => (p.id === selectedPerson.id ? updatedPerson : p)))
      setShowAddEnderecoModal(false)
      setNewEnderecoData({
        tipo: "",
        cep: "",
        logradouro: "",
        numero: "",
        complemento: "",
        bairro: "",
        cidade: "",
        estado: "",
        email: "",
      })
    }
  }

  const handleSaveNewBanco = () => {
    if (selectedPerson && newBancoData.banco && newBancoData.agencia && newBancoData.conta) {
      const novoBanco = {
        id: selectedPerson.dadosBancarios.length + 1,
        ...newBancoData,
      }
      const updatedPerson = {
        ...selectedPerson,
        dadosBancarios: [...selectedPerson.dadosBancarios, novoBanco],
      }
      setSelectedPerson(updatedPerson)
      setPessoas(pessoas.map((p) => (p.id === selectedPerson.id ? updatedPerson : p)))
      setShowAddBancoModal(false)
      setNewBancoData({
        banco: "",
        agencia: "",
        tipoConta: "",
        conta: "",
        digito: "",
      })
    }
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-6 py-6">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-2xl font-bold text-foreground">Pessoas</h1>
            <p className="text-muted-foreground">Gerencie todas as pessoas do sistema</p>
          </div>
          <div className="flex gap-2">
            {selectedPerson && (
              <Button variant="outline" onClick={handleBackToGrid}>
                <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                </svg>
                Voltar ao Grid
              </Button>
            )}
            <Dialog open={showNewPersonModal} onOpenChange={setShowNewPersonModal}>
              <DialogTrigger asChild>
                <Button>
                  <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                  </svg>
                  Nova Pessoa
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
                <DialogHeader>
                  <DialogTitle>Cadastrar Nova Pessoa</DialogTitle>
                  <DialogDescription>Preencha os dados completos da nova pessoa</DialogDescription>
                </DialogHeader>

                <Tabs defaultValue="dados" className="w-full">
                  <TabsList className="grid w-full grid-cols-3">
                    <TabsTrigger value="dados">Dados Pessoais</TabsTrigger>
                    <TabsTrigger value="enderecos">Endereços</TabsTrigger>
                    <TabsTrigger value="bancarios">Dados Bancários</TabsTrigger>
                  </TabsList>

                  <TabsContent value="dados" className="space-y-4">
                    <div>
                      <Label htmlFor="tipoPessoa">Tipo de Pessoa *</Label>
                      <Select value={newPersonType} onValueChange={setNewPersonType}>
                        <SelectTrigger>
                          <SelectValue placeholder="Selecione o tipo" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="fisica">Física</SelectItem>
                          <SelectItem value="juridica">Jurídica</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    {newPersonType === "fisica" ? (
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <Label htmlFor="nome">Nome *</Label>
                          <Input id="nome" placeholder="Nome completo" />
                        </div>
                        <div>
                          <Label htmlFor="rg">RG *</Label>
                          <Input id="rg" placeholder="00.000.000-0" />
                        </div>
                        <div>
                          <Label htmlFor="cpf">CPF *</Label>
                          <Input id="cpf" placeholder="000.000.000-00" />
                        </div>
                        <div>
                          <Label htmlFor="dataNascimento">Data de Nascimento *</Label>
                          <Input id="dataNascimento" type="date" />
                        </div>
                      </div>
                    ) : (
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <Label htmlFor="razaoSocial">Razão Social *</Label>
                          <Input id="razaoSocial" placeholder="Razão social completa" />
                        </div>
                        <div>
                          <Label htmlFor="razaoAbreviada">Razão Abreviada *</Label>
                          <Input id="razaoAbreviada" placeholder="Nome fantasia" />
                        </div>
                        <div>
                          <Label htmlFor="cnpj">CNPJ *</Label>
                          <Input id="cnpj" placeholder="00.000.000/0000-00" />
                        </div>
                        <div>
                          <Label htmlFor="dataAbertura">Data Abertura *</Label>
                          <Input id="dataAbertura" type="date" />
                        </div>
                        <div>
                          <Label htmlFor="inscricaoEstadual">Inscrição Estadual</Label>
                          <Input id="inscricaoEstadual" placeholder="000.000.000.000" />
                        </div>
                        <div>
                          <Label htmlFor="inscricaoMunicipal">Inscrição Municipal</Label>
                          <Input id="inscricaoMunicipal" placeholder="000000000" />
                        </div>
                        <div className="md:col-span-2">
                          <Label htmlFor="codigoAtividade">Código Atividade</Label>
                          <Select>
                            <SelectTrigger>
                              <SelectValue placeholder="Selecione a atividade" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="comercio">Comércio Varejista</SelectItem>
                              <SelectItem value="servicos">Prestação de Serviços</SelectItem>
                              <SelectItem value="industria">Indústria</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                      </div>
                    )}
                  </TabsContent>

                  <TabsContent value="enderecos" className="space-y-4">
                    <div className="flex items-center justify-between">
                      <h3 className="text-lg font-medium">Endereços</h3>
                      <Button size="sm" onClick={() => setShowAddEnderecoModal(true)}>
                        <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                        </svg>
                        Adicionar Endereço
                      </Button>
                    </div>

                    <Card>
                      <CardHeader>
                        <CardTitle className="text-base">Endereço Principal</CardTitle>
                      </CardHeader>
                      <CardContent className="space-y-4">
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                          <div>
                            <Label>Tipo de Endereço *</Label>
                            <Select>
                              <SelectTrigger>
                                <SelectValue placeholder="Selecione" />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="residencial">Residencial</SelectItem>
                                <SelectItem value="comercial">Comercial</SelectItem>
                                <SelectItem value="cobranca">Cobrança</SelectItem>
                              </SelectContent>
                            </Select>
                          </div>
                          <div>
                            <Label>CEP *</Label>
                            <Input placeholder="00000-000" />
                          </div>
                          <div>
                            <Label>Email</Label>
                            <Input placeholder="email@exemplo.com" />
                          </div>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                          <div className="md:col-span-2">
                            <Label>Logradouro *</Label>
                            <Input placeholder="Rua, Avenida..." />
                          </div>
                          <div>
                            <Label>Número *</Label>
                            <Input placeholder="123" />
                          </div>
                          <div>
                            <Label>Complemento</Label>
                            <Input placeholder="Apto, Sala..." />
                          </div>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                          <div>
                            <Label>Bairro *</Label>
                            <Input placeholder="Bairro" />
                          </div>
                          <div>
                            <Label>Cidade *</Label>
                            <Input placeholder="Cidade" />
                          </div>
                          <div>
                            <Label>Estado *</Label>
                            <Select>
                              <SelectTrigger>
                                <SelectValue placeholder="UF" />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="SP">São Paulo</SelectItem>
                                <SelectItem value="RJ">Rio de Janeiro</SelectItem>
                                <SelectItem value="MG">Minas Gerais</SelectItem>
                              </SelectContent>
                            </Select>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </TabsContent>

                  <TabsContent value="bancarios" className="space-y-4">
                    <div className="flex items-center justify-between">
                      <h3 className="text-lg font-medium">Dados Bancários</h3>
                      <Button size="sm" onClick={() => setShowAddBancoModal(true)}>
                        <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                        </svg>
                        Adicionar Conta
                      </Button>
                    </div>

                    <Card>
                      <CardHeader>
                        <CardTitle className="text-base">Conta Principal</CardTitle>
                      </CardHeader>
                      <CardContent className="space-y-4">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div>
                            <Label>Banco *</Label>
                            <Select>
                              <SelectTrigger>
                                <SelectValue placeholder="Selecione o banco" />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="bb">Banco do Brasil</SelectItem>
                                <SelectItem value="itau">Itaú</SelectItem>
                                <SelectItem value="bradesco">Bradesco</SelectItem>
                                <SelectItem value="santander">Santander</SelectItem>
                                <SelectItem value="caixa">Caixa Econômica</SelectItem>
                              </SelectContent>
                            </Select>
                          </div>
                          <div>
                            <Label>Agência *</Label>
                            <Input placeholder="0000-0" />
                          </div>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                          <div>
                            <Label>Tipo da Conta *</Label>
                            <Select>
                              <SelectTrigger>
                                <SelectValue placeholder="Tipo" />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="corrente">Corrente</SelectItem>
                                <SelectItem value="poupanca">Poupança</SelectItem>
                              </SelectContent>
                            </Select>
                          </div>
                          <div>
                            <Label>Conta *</Label>
                            <Input placeholder="00000-0" />
                          </div>
                          <div>
                            <Label>Dígito *</Label>
                            <Input placeholder="0" maxLength={1} />
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </TabsContent>
                </Tabs>

                <div className="flex justify-end gap-2 pt-4">
                  <Button variant="outline" onClick={() => setShowNewPersonModal(false)}>
                    Cancelar
                  </Button>
                  <Button onClick={handleSaveNewPerson}>Salvar Pessoa</Button>
                </div>
              </DialogContent>
            </Dialog>
          </div>
        </div>

        {!selectedPerson && (
          <Card className="mb-6">
            <CardHeader>
              <CardTitle>Pesquisar Pessoa</CardTitle>
              <CardDescription>Digite o nome, CPF ou CNPJ para pesquisar</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex gap-4">
                <div className="flex-1">
                  <Input
                    placeholder="Digite aqui..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    onKeyPress={(e) => e.key === "Enter" && handleSearch()}
                  />
                </div>
                <Button onClick={handleSearch}>
                  <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <circle cx="11" cy="11" r="8" />
                    <path d="m21 21-4.35-4.35" />
                  </svg>
                  Pesquisar
                </Button>
              </div>

              {showResults && (
                <div className="mt-4 border rounded-lg p-4 bg-muted/20">
                  <h3 className="font-medium mb-3">Resultados da Pesquisa ({searchResults.length})</h3>
                  {searchResults.length > 0 ? (
                    <div className="space-y-2">
                      {searchResults.map((pessoa) => (
                        <div
                          key={pessoa.id}
                          className="flex items-center justify-between p-3 border rounded cursor-pointer hover:bg-background transition-colors"
                          onClick={() => handleSelectPerson(pessoa)}
                        >
                          <div className="flex items-center gap-3">
                            <Avatar className="h-8 w-8">
                              <AvatarFallback className="text-xs">
                                {pessoa.nome
                                  .split(" ")
                                  .map((n: string) => n[0])
                                  .join("")}
                              </AvatarFallback>
                            </Avatar>
                            <div>
                              <p className="font-medium">{pessoa.nome}</p>
                              <p className="text-sm text-muted-foreground">
                                Documento: {pessoa.tipo === "fisica" ? pessoa.cpf : pessoa.cnpj}
                              </p>
                            </div>
                          </div>
                          <div className="text-right">
                            <Badge variant="outline" className="mb-1">
                              {pessoa.tipo === "fisica" ? "Pessoa Física" : "Pessoa Jurídica"}
                            </Badge>
                            <br />
                            <Badge variant={pessoa.status === "Ativo" ? "default" : "secondary"}>{pessoa.status}</Badge>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-muted-foreground">Nenhuma pessoa encontrada.</p>
                  )}
                </div>
              )}
            </CardContent>
          </Card>
        )}

        {showAllPeople && !selectedPerson && (
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle>Todas as Pessoas Cadastradas</CardTitle>
                  <CardDescription>{getPaginatedPeople().totalItems} pessoas encontradas</CardDescription>
                </div>
                <div className="flex gap-2">
                  <Select value={filterType} onValueChange={setFilterType}>
                    <SelectTrigger className="w-40">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">Todos os Tipos</SelectItem>
                      <SelectItem value="fisica">Pessoa Física</SelectItem>
                      <SelectItem value="juridica">Pessoa Jurídica</SelectItem>
                    </SelectContent>
                  </Select>
                  <Select value={filterStatus} onValueChange={setFilterStatus}>
                    <SelectTrigger className="w-32">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">Todos</SelectItem>
                      <SelectItem value="Ativo">Ativo</SelectItem>
                      <SelectItem value="Inativo">Inativo</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="rounded-md border">
                <table className="w-full">
                  <thead>
                    <tr className="border-b bg-muted/50">
                      <th className="h-12 px-4 text-left align-middle font-medium">
                        <Button
                          variant="ghost"
                          onClick={() => {
                            setSortBy("nome")
                            setSortOrder(sortBy === "nome" && sortOrder === "asc" ? "desc" : "asc")
                          }}
                          className="h-auto p-0 font-medium"
                        >
                          Nome
                          {sortBy === "nome" && (
                            <svg className="w-4 h-4 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              {sortOrder === "asc" ? (
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 15l7-7 7 7" />
                              ) : (
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                              )}
                            </svg>
                          )}
                        </Button>
                      </th>
                      <th className="h-12 px-4 text-left align-middle font-medium">Documento</th>
                      <th className="h-12 px-4 text-left align-middle font-medium">
                        <Button
                          variant="ghost"
                          onClick={() => {
                            setSortBy("tipo")
                            setSortOrder(sortBy === "tipo" && sortOrder === "asc" ? "desc" : "asc")
                          }}
                          className="h-auto p-0 font-medium"
                        >
                          Tipo
                        </Button>
                      </th>
                      <th className="h-12 px-4 text-left align-middle font-medium">
                        <Button
                          variant="ghost"
                          onClick={() => {
                            setSortBy("status")
                            setSortOrder(sortBy === "status" && sortOrder === "asc" ? "desc" : "asc")
                          }}
                          className="h-auto p-0 font-medium"
                        >
                          Status
                        </Button>
                      </th>
                      <th className="h-12 px-4 text-left align-middle font-medium">Ações</th>
                    </tr>
                  </thead>
                  <tbody>
                    {getPaginatedPeople().people.map((pessoa) => (
                      <tr
                        key={pessoa.id}
                        className="border-b hover:bg-muted/50 cursor-pointer"
                        onClick={() => handleSelectPersonFromGrid(pessoa)}
                      >
                        <td className="p-4">
                          <div className="flex items-center gap-3">
                            <Avatar className="h-8 w-8">
                              <AvatarFallback className="text-xs">
                                {pessoa.nome
                                  .split(" ")
                                  .map((n: string) => n[0])
                                  .join("")}
                              </AvatarFallback>
                            </Avatar>
                            <div>
                              <p className="font-medium">{pessoa.nome}</p>
                              <p className="text-sm text-muted-foreground">
                                {pessoa.enderecos?.[0]?.email || "Sem email"}
                              </p>
                            </div>
                          </div>
                        </td>
                        <td className="p-4">
                          <p className="font-mono text-sm">{pessoa.tipo === "fisica" ? pessoa.cpf : pessoa.cnpj}</p>
                        </td>
                        <td className="p-4">
                          <Badge variant="outline">
                            {pessoa.tipo === "fisica" ? "Pessoa Física" : "Pessoa Jurídica"}
                          </Badge>
                        </td>
                        <td className="p-4">
                          <Badge variant={pessoa.status === "Ativo" ? "default" : "secondary"}>{pessoa.status}</Badge>
                        </td>
                        <td className="p-4">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={(e) => {
                              e.stopPropagation()
                              handleSelectPersonFromGrid(pessoa)
                            }}
                          >
                            Ver Detalhes
                          </Button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {getPaginatedPeople().totalPages > 1 && (
                <div className="flex items-center justify-between mt-4">
                  <p className="text-sm text-muted-foreground">
                    Mostrando {(currentPage - 1) * itemsPerPage + 1} a{" "}
                    {Math.min(currentPage * itemsPerPage, getPaginatedPeople().totalItems)} de{" "}
                    {getPaginatedPeople().totalItems} pessoas
                  </p>
                  <div className="flex items-center gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
                      disabled={currentPage === 1}
                    >
                      Anterior
                    </Button>
                    <div className="flex items-center gap-1">
                      {Array.from({ length: getPaginatedPeople().totalPages }, (_, i) => i + 1)
                        .filter(
                          (page) =>
                            page === 1 || page === getPaginatedPeople().totalPages || Math.abs(page - currentPage) <= 1,
                        )
                        .map((page, index, array) => (
                          <div key={page} className="flex items-center">
                            {index > 0 && array[index - 1] !== page - 1 && (
                              <span className="px-2 text-muted-foreground">...</span>
                            )}
                            <Button
                              variant={currentPage === page ? "default" : "outline"}
                              size="sm"
                              onClick={() => setCurrentPage(page)}
                              className="w-8 h-8 p-0"
                            >
                              {page}
                            </Button>
                          </div>
                        ))}
                    </div>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setCurrentPage((prev) => Math.min(prev + 1, getPaginatedPeople().totalPages))}
                      disabled={currentPage === getPaginatedPeople().totalPages}
                    >
                      Próxima
                    </Button>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        )}

        {selectedPerson && (
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle>Dados da Pessoa Selecionada</CardTitle>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <Tabs defaultValue="dados" className="w-full">
                <TabsList className="grid w-full grid-cols-3">
                  <TabsTrigger value="dados">Dados Pessoais</TabsTrigger>
                  <TabsTrigger value="enderecos">
                    Endereços ({selectedPerson.enderecos?.length || 0})
                    <Button
                      variant="ghost"
                      size="sm"
                      className="ml-2 h-6 w-6 p-0"
                      onClick={() => setShowAddEnderecoModal(true)}
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                      </svg>
                    </Button>
                  </TabsTrigger>
                  <TabsTrigger value="bancarios">
                    Dados Bancários ({selectedPerson.dadosBancarios?.length || 0})
                    <Button
                      variant="ghost"
                      size="sm"
                      className="ml-2 h-6 w-6 p-0"
                      onClick={() => setShowAddBancoModal(true)}
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                      </svg>
                    </Button>
                  </TabsTrigger>
                </TabsList>

                <TabsContent value="dados">
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <h3 className="text-lg font-medium">Dados Pessoais</h3>
                      <Button variant="outline" size="sm" onClick={() => handleEditSection("dados")}>
                        <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
                          />
                        </svg>
                        Editar Dados
                      </Button>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                      <div>
                        <Label className="text-sm font-medium text-muted-foreground">Nome</Label>
                        <p className="text-foreground">{selectedPerson.nome}</p>
                      </div>
                      <div>
                        <Label className="text-sm font-medium text-muted-foreground">Tipo</Label>
                        <Badge variant="outline">
                          {selectedPerson.tipo === "fisica" ? "Pessoa Física" : "Pessoa Jurídica"}
                        </Badge>
                      </div>

                      {selectedPerson.tipo === "fisica" ? (
                        <>
                          <div>
                            <Label className="text-sm font-medium text-muted-foreground">RG</Label>
                            <p className="text-foreground">{selectedPerson.rg}</p>
                          </div>
                          <div>
                            <Label className="text-sm font-medium text-muted-foreground">CPF</Label>
                            <p className="text-foreground">{selectedPerson.cpf}</p>
                          </div>
                          <div>
                            <Label className="text-sm font-medium text-muted-foreground">Data de Nascimento</Label>
                            <p className="text-foreground">{selectedPerson.dataNascimento}</p>
                          </div>
                        </>
                      ) : (
                        <>
                          <div>
                            <Label className="text-sm font-medium text-muted-foreground">Razão Social</Label>
                            <p className="text-foreground">{selectedPerson.razaoSocial}</p>
                          </div>
                          <div>
                            <Label className="text-sm font-medium text-muted-foreground">Razão Abreviada</Label>
                            <p className="text-foreground">{selectedPerson.razaoAbreviada}</p>
                          </div>
                          <div>
                            <Label className="text-sm font-medium text-muted-foreground">CNPJ</Label>
                            <p className="text-foreground">{selectedPerson.cnpj}</p>
                          </div>
                          <div>
                            <Label className="text-sm font-medium text-muted-foreground">Data Abertura</Label>
                            <p className="text-foreground">{selectedPerson.dataAbertura}</p>
                          </div>
                          <div>
                            <Label className="text-sm font-medium text-muted-foreground">Inscrição Estadual</Label>
                            <p className="text-foreground">{selectedPerson.inscricaoEstadual}</p>
                          </div>
                          <div>
                            <Label className="text-sm font-medium text-muted-foreground">Inscrição Municipal</Label>
                            <p className="text-foreground">{selectedPerson.inscricaoMunicipal}</p>
                          </div>
                          <div>
                            <Label className="text-sm font-medium text-muted-foreground">Código Atividade</Label>
                            <p className="text-foreground">{selectedPerson.codigoAtividade}</p>
                          </div>
                        </>
                      )}

                      <div>
                        <Label className="text-sm font-medium text-muted-foreground">Status</Label>
                        <Badge variant={selectedPerson.status === "Ativo" ? "default" : "secondary"}>
                          {selectedPerson.status}
                        </Badge>
                      </div>
                    </div>
                  </div>
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

                    {selectedPerson.enderecos.length === 0 ? (
                      <div className="text-center py-8">
                        <p className="text-muted-foreground mb-4">Nenhum endereço cadastrado.</p>
                      </div>
                    ) : (
                      <div className="space-y-4">
                        {selectedPerson.enderecos.map((endereco) => (
                          <AddressCard
                            key={endereco.id}
                            endereco={endereco}
                            onEdit={(address) => {
                              setEditingEndereco(address)
                              setShowEditEnderecoModal(true)
                            }}
                            onDelete={(addressId) => handleDeleteEndereco(addressId)}
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

                    {selectedPerson.dadosBancarios.length === 0 ? (
                      <div className="text-center py-8">
                        <p className="text-muted-foreground mb-4">Nenhuma conta bancária cadastrada.</p>
                      </div>
                    ) : (
                      <div className="space-y-4">
                        {selectedPerson.dadosBancarios.map((banco) => (
                          <BankAccountCard
                            key={banco.id}
                            dadoBancario={banco}
                            onEdit={(account) => {
                              setEditingBanco(account)
                              setShowEditBancoModal(true)
                            }}
                            onDelete={(accountId) => handleDeleteBanco(accountId)}
                          />
                        ))}
                      </div>
                    )}
                  </div>
                </TabsContent>
              </Tabs>
            </CardContent>

        <AddressModal
          isOpen={showAddEnderecoModal}
          onClose={() => setShowAddEnderecoModal(false)}
          onSave={handleSaveEndereco}
          title="Adicionar Endereço"
          description="Cadastre um novo endereço para esta pessoa"
        />

        <AddressModal
          isOpen={showEditEnderecoModal}
          onClose={() => {
            setShowEditEnderecoModal(false)
            setEditingEndereco(null)
          }}
          onSave={(data) => {
            if (editingEndereco && selectedPerson) {
              const updatedEnderecos = selectedPerson.enderecos.map((e) =>
                e.id === editingEndereco.id ? { ...e, ...data } : e,
              )

              setPessoas((prev) =>
                prev.map((p) => (p.id === selectedPerson.id ? { ...p, enderecos: updatedEnderecos } : p)),
              )

              setSelectedPerson((prev) => (prev ? { ...prev, enderecos: updatedEnderecos } : null))
            }
            setShowEditEnderecoModal(false)
            setEditingEndereco(null)
          }}
          title="Editar Endereço"
          description="Altere os dados do endereço"
          initialData={editingEndereco}
        />

        <BankAccountModal
          isOpen={showAddBancoModal}
          onClose={() => setShowAddBancoModal(false)}
          onSave={handleSaveBanco}
          title="Adicionar Conta Bancária"
          description="Cadastre uma nova conta bancária para esta pessoa"
        />

        <BankAccountModal
          isOpen={showEditBancoModal}
          onClose={() => {
            setShowEditBancoModal(false)
            setEditingBanco(null)
          }}
          onSave={(data) => {
            if (editingBanco && selectedPerson) {
              const updatedBancos = selectedPerson.dadosBancarios.map((b) =>
                b.id === editingBanco.id ? { ...b, ...data } : b,
              )

              setPessoas((prev) =>
                prev.map((p) => (p.id === selectedPerson.id ? { ...p, dadosBancarios: updatedBancos } : p)),
              )

              setSelectedPerson((prev) => (prev ? { ...prev, dadosBancarios: updatedBancos } : null))
            }
            setShowEditBancoModal(false)
            setEditingBanco(null)
          }}
          title="Editar Conta Bancária"
          description="Altere os dados da conta bancária"
          initialData={editingBanco}
        />

        <Dialog open={showEditModal} onOpenChange={setShowEditModal}>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>Editar Dados Pessoais</DialogTitle>
              <DialogDescription>Altere apenas as informações necessárias</DialogDescription>
            </DialogHeader>

            {selectedPerson && (
              <div className="space-y-4">
                {selectedPerson.tipo === "fisica" ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="editNome">Nome *</Label>
                      <Input
                        id="editNome"
                        defaultValue={selectedPerson.nome}
                        onChange={(e) => setEditFormData({ ...editFormData, nome: e.target.value })}
                      />
                    </div>
                    <div>
                      <Label htmlFor="editRg">RG *</Label>
                      <Input
                        id="editRg"
                        defaultValue={selectedPerson.rg}
                        onChange={(e) => setEditFormData({ ...editFormData, rg: e.target.value })}
                      />
                    </div>
                    <div>
                      <Label htmlFor="editCpf">CPF *</Label>
                      <Input
                        id="editCpf"
                        defaultValue={selectedPerson.cpf}
                        onChange={(e) => setEditFormData({ ...editFormData, cpf: e.target.value })}
                      />
                    </div>
                    <div>
                      <Label htmlFor="editDataNascimento">Data de Nascimento *</Label>
                      <Input
                        id="editDataNascimento"
                        type="date"
                        defaultValue={selectedPerson.dataNascimento}
                        onChange={(e) => setEditFormData({ ...editFormData, dataNascimento: e.target.value })}
                      />
                    </div>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="editRazaoSocial">Razão Social *</Label>
                      <Input
                        id="editRazaoSocial"
                        defaultValue={selectedPerson.razaoSocial}
                        onChange={(e) => setEditFormData({ ...editFormData, razaoSocial: e.target.value })}
                      />
                    </div>
                    <div>
                      <Label htmlFor="editRazaoAbreviada">Razão Abreviada *</Label>
                      <Input
                        id="editRazaoAbreviada"
                        defaultValue={selectedPerson.razaoAbreviada}
                        onChange={(e) => setEditFormData({ ...editFormData, razaoAbreviada: e.target.value })}
                      />
                    </div>
                    <div>
                      <Label htmlFor="editCnpj">CNPJ *</Label>
                      <Input
                        id="editCnpj"
                        defaultValue={selectedPerson.cnpj}
                        onChange={(e) => setEditFormData({ ...editFormData, cnpj: e.target.value })}
                      />
                    </div>
                    <div>
                      <Label htmlFor="editDataAbertura">Data Abertura *</Label>
                      <Input
                        id="editDataAbertura"
                        type="date"
                        defaultValue={selectedPerson.dataAbertura}
                        onChange={(e) => setEditFormData({ ...editFormData, dataAbertura: e.target.value })}
                      />
                    </div>
                  </div>
                )}

                <div className="flex justify-end gap-2 pt-4">
                  <Button variant="outline" onClick={() => setShowEditModal(false)}>
                    Cancelar
                  </Button>
                  <Button onClick={handleSaveEditDados}>Salvar Alterações</Button>
                </div>
              </div>
            )}
          </DialogContent>
        </Dialog>
      </Card>
    )}
    </div>
    </div>
  )
}
