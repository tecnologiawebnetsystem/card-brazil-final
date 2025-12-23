"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Search, MoreHorizontal, FileText, X, User, Users, Building, AlertCircle, Printer, Mail } from "lucide-react"

interface Parcela {
  id: string
  beneficiario: string
  corretor: string
  estipulante: string
  plano: string
  vencimento: string
  premioLiquido: number
  adicFrac: number
  custo: number
  iof: number
  premioTotal: number
  novoVencimento?: string
  multa: number
  juros: number
  desconto: number
  cobrancaVist: number
  dataPagamento?: string
  valorPago: number
  valorDevido: number
  diferenca: number
  dataBaixa?: string
  loteBaixa?: string
  dataAvisoCredito?: string
  status: "pendente" | "vencida" | "paga" | "em_atraso"
  ocorrencias: string[]
}

interface Beneficiario {
  id: string
  nome: string
  cpf: string
  corretor: string
  estipulante: string
  plano: string
}

interface Corretor {
  id: string
  nome: string
  codigo: string
  email: string
}

interface Estipulante {
  id: string
  nome: string
  cnpj: string
  contato: string
}

interface Plano {
  id: string
  nome: string
  codigo: string
  categoria: string
}

const mockParcelas: Parcela[] = [
  {
    id: "001",
    beneficiario: "João Silva Santos",
    corretor: "Maria Oliveira",
    estipulante: "Empresa ABC Ltda",
    plano: "Plano Saúde Premium",
    vencimento: "2024-01-15",
    premioLiquido: 450.0,
    adicFrac: 15.5,
    custo: 25.0,
    iof: 12.75,
    premioTotal: 503.25,
    novoVencimento: "2024-02-15",
    multa: 25.16,
    juros: 15.1,
    desconto: 0,
    cobrancaVist: 0,
    dataPagamento: "2024-02-10",
    valorPago: 543.51,
    valorDevido: 543.51,
    diferenca: 0,
    dataBaixa: "2024-02-10",
    loteBaixa: "LT001",
    dataAvisoCredito: "2024-02-11",
    status: "paga",
    ocorrencias: ["Pagamento em atraso", "Multa aplicada"],
  },
  {
    id: "002",
    beneficiario: "Ana Costa Lima",
    corretor: "Carlos Pereira",
    estipulante: "Empresa XYZ S.A.",
    plano: "Plano Saúde Básico",
    vencimento: "2024-01-20",
    premioLiquido: 280.0,
    adicFrac: 8.4,
    custo: 15.0,
    iof: 7.98,
    premioTotal: 311.38,
    multa: 0,
    juros: 0,
    desconto: 15.57,
    cobrancaVist: 0,
    valorPago: 0,
    valorDevido: 295.81,
    diferenca: 295.81,
    status: "em_atraso",
    ocorrencias: ["Desconto por pontualidade aplicado", "Parcela em atraso há 15 dias"],
  },
  {
    id: "003",
    beneficiario: "Pedro Almeida",
    corretor: "Maria Oliveira",
    estipulante: "Empresa ABC Ltda",
    plano: "Plano Odonto",
    vencimento: "2024-02-10",
    premioLiquido: 120.0,
    adicFrac: 3.6,
    custo: 8.0,
    iof: 3.42,
    premioTotal: 135.02,
    multa: 0,
    juros: 0,
    desconto: 0,
    cobrancaVist: 0,
    valorPago: 0,
    valorDevido: 135.02,
    diferenca: 135.02,
    status: "pendente",
    ocorrencias: ["Parcela dentro do prazo"],
  },
  {
    id: "004",
    beneficiario: "Carla Mendes",
    corretor: "Roberto Silva",
    estipulante: "Empresa DEF Ltda",
    plano: "Plano Vida",
    vencimento: "2024-01-05",
    premioLiquido: 85.0,
    adicFrac: 2.55,
    custo: 5.0,
    iof: 2.42,
    premioTotal: 94.97,
    multa: 9.5,
    juros: 5.7,
    desconto: 0,
    cobrancaVist: 0,
    valorPago: 0,
    valorDevido: 110.17,
    diferenca: 110.17,
    status: "vencida",
    ocorrencias: ["Parcela vencida há 45 dias", "Multa e juros aplicados", "Enviado para cobrança"],
  },
]

const mockBeneficiarios: Beneficiario[] = [
  {
    id: "1",
    nome: "João Silva Santos",
    cpf: "123.456.789-00",
    corretor: "Maria Oliveira",
    estipulante: "Empresa ABC Ltda",
    plano: "Plano Saúde Premium",
  },
  {
    id: "2",
    nome: "Ana Costa Lima",
    cpf: "987.654.321-00",
    corretor: "Carlos Pereira",
    estipulante: "Empresa XYZ S.A.",
    plano: "Plano Saúde Básico",
  },
  {
    id: "3",
    nome: "Pedro Almeida",
    cpf: "456.789.123-00",
    corretor: "Maria Oliveira",
    estipulante: "Empresa ABC Ltda",
    plano: "Plano Odonto",
  },
  {
    id: "4",
    nome: "Carla Mendes",
    cpf: "789.123.456-00",
    corretor: "Roberto Silva",
    estipulante: "Empresa DEF Ltda",
    plano: "Plano Vida",
  },
]

const mockCorretores: Corretor[] = [
  { id: "1", nome: "Maria Oliveira", codigo: "COR001", email: "maria@email.com" },
  { id: "2", nome: "Carlos Pereira", codigo: "COR002", email: "carlos@email.com" },
  { id: "3", nome: "Roberto Silva", codigo: "COR003", email: "roberto@email.com" },
]

const mockEstipulantes: Estipulante[] = [
  { id: "1", nome: "Empresa ABC Ltda", cnpj: "12.345.678/0001-90", contato: "(11) 1234-5678" },
  { id: "2", nome: "Empresa XYZ S.A.", cnpj: "98.765.432/0001-10", contato: "(11) 9876-5432" },
  { id: "3", nome: "Empresa DEF Ltda", cnpj: "11.222.333/0001-44", contato: "(11) 5555-6666" },
]

const mockPlanos: Plano[] = [
  { id: "1", nome: "Plano Saúde Premium", codigo: "PSP001", categoria: "Saúde" },
  { id: "2", nome: "Plano Saúde Básico", codigo: "PSB001", categoria: "Saúde" },
  { id: "3", nome: "Plano Odonto", codigo: "POD001", categoria: "Odontológico" },
  { id: "4", nome: "Plano Vida", codigo: "PVI001", categoria: "Vida" },
]

export default function ConsultaParcelasPage() {
  const [selectedParcela, setSelectedParcela] = useState<Parcela | null>(null)
  const [parcelas, setParcelas] = useState<Parcela[]>([])
  const [showResults, setShowResults] = useState(false)

  const [selectedBeneficiario, setSelectedBeneficiario] = useState<Beneficiario | null>(null)
  const [selectedCorretor, setSelectedCorretor] = useState<Corretor | null>(null)
  const [selectedEstipulante, setSelectedEstipulante] = useState<Estipulante | null>(null)
  const [selectedPlano, setSelectedPlano] = useState<Plano | null>(null)

  const handleSearch = () => {
    // Simular busca baseada nos filtros selecionados
    let filteredParcelas = mockParcelas

    if (selectedBeneficiario) {
      filteredParcelas = filteredParcelas.filter((p) => p.beneficiario === selectedBeneficiario.nome)
    }
    if (selectedCorretor) {
      filteredParcelas = filteredParcelas.filter((p) => p.corretor === selectedCorretor.nome)
    }
    if (selectedEstipulante) {
      filteredParcelas = filteredParcelas.filter((p) => p.estipulante === selectedEstipulante.nome)
    }
    if (selectedPlano) {
      filteredParcelas = filteredParcelas.filter((p) => p.plano === selectedPlano.nome)
    }

    setParcelas(filteredParcelas)
    setShowResults(true)
  }

  const handleSelectParcela = (parcela: Parcela) => {
    setSelectedParcela(parcela)
  }

  const handleSelectBeneficiario = (beneficiario: Beneficiario) => {
    setSelectedBeneficiario(beneficiario)
    // Auto-preencher corretor, estipulante e plano se estiverem linkados
    const corretor = mockCorretores.find((c) => c.nome === beneficiario.corretor)
    const estipulante = mockEstipulantes.find((e) => e.nome === beneficiario.estipulante)
    const plano = mockPlanos.find((p) => p.nome === beneficiario.plano)

    if (corretor) setSelectedCorretor(corretor)
    if (estipulante) setSelectedEstipulante(estipulante)
    if (plano) setSelectedPlano(plano)
  }

  const handleClear = () => {
    setParcelas([])
    setShowResults(false)
    setSelectedParcela(null)
    setSelectedBeneficiario(null)
    setSelectedCorretor(null)
    setSelectedEstipulante(null)
    setSelectedPlano(null)
  }

  const handleListarOcorrencias = () => {
    if (selectedParcela) {
      const ocorrenciasText = selectedParcela.ocorrencias.join("\n• ")
      alert(`Ocorrências da parcela:\n\n• ${ocorrenciasText}`)
    }
  }

  const handleImprimir = () => {
    alert("Imprimindo boleto...")
  }

  const handleEncaminharEmail = () => {
    alert("Encaminhando por e-mail...")
  }

  const handleEncaminharWhatsApp = () => {
    alert("Encaminhando por WhatsApp...")
  }

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "paga":
        return <Badge className="bg-emerald-100 text-emerald-800 border-emerald-200">Paga</Badge>
      case "vencida":
        return <Badge variant="destructive">Vencida</Badge>
      case "em_atraso":
        return <Badge className="bg-orange-100 text-orange-800 border-orange-200">Em Atraso</Badge>
      default:
        return <Badge variant="secondary">Pendente</Badge>
    }
  }

  // Modais reutilizados
  const BeneficiarioModal = () => (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="outline" size="icon" className="border-emerald-300 hover:bg-emerald-50 bg-transparent">
          <MoreHorizontal className="h-4 w-4" />
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-4xl">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <User className="h-5 w-5" />
            Selecionar Beneficiário
          </DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          <Input placeholder="Pesquisar beneficiário..." className="w-full" />
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Nome</TableHead>
                <TableHead>CPF</TableHead>
                <TableHead>Corretor</TableHead>
                <TableHead>Plano</TableHead>
                <TableHead>Ações</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {mockBeneficiarios.map((beneficiario) => (
                <TableRow key={beneficiario.id}>
                  <TableCell className="font-medium">{beneficiario.nome}</TableCell>
                  <TableCell>{beneficiario.cpf}</TableCell>
                  <TableCell>{beneficiario.corretor}</TableCell>
                  <TableCell>{beneficiario.plano}</TableCell>
                  <TableCell>
                    <Button
                      size="sm"
                      onClick={() => handleSelectBeneficiario(beneficiario)}
                      className="bg-emerald-600 hover:bg-emerald-700"
                    >
                      Selecionar
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </DialogContent>
    </Dialog>
  )

  const CorretorModal = () => (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="outline" size="icon" className="border-emerald-300 hover:bg-emerald-50 bg-transparent">
          <MoreHorizontal className="h-4 w-4" />
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-3xl">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Users className="h-5 w-5" />
            Selecionar Corretor
          </DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          <Input placeholder="Pesquisar corretor..." className="w-full" />
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Nome</TableHead>
                <TableHead>Código</TableHead>
                <TableHead>Email</TableHead>
                <TableHead>Ações</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {mockCorretores.map((corretor) => (
                <TableRow key={corretor.id}>
                  <TableCell className="font-medium">{corretor.nome}</TableCell>
                  <TableCell>{corretor.codigo}</TableCell>
                  <TableCell>{corretor.email}</TableCell>
                  <TableCell>
                    <Button
                      size="sm"
                      onClick={() => setSelectedCorretor(corretor)}
                      className="bg-emerald-600 hover:bg-emerald-700"
                    >
                      Selecionar
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </DialogContent>
    </Dialog>
  )

  const EstipulanteModal = () => (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="outline" size="icon" className="border-emerald-300 hover:bg-emerald-50 bg-transparent">
          <MoreHorizontal className="h-4 w-4" />
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-3xl">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Building className="h-5 w-5" />
            Selecionar Estipulante
          </DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          <Input placeholder="Pesquisar estipulante..." className="w-full" />
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Nome</TableHead>
                <TableHead>CNPJ</TableHead>
                <TableHead>Contato</TableHead>
                <TableHead>Ações</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {mockEstipulantes.map((estipulante) => (
                <TableRow key={estipulante.id}>
                  <TableCell className="font-medium">{estipulante.nome}</TableCell>
                  <TableCell>{estipulante.cnpj}</TableCell>
                  <TableCell>{estipulante.contato}</TableCell>
                  <TableCell>
                    <Button
                      size="sm"
                      onClick={() => setSelectedEstipulante(estipulante)}
                      className="bg-emerald-600 hover:bg-emerald-700"
                    >
                      Selecionar
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </DialogContent>
    </Dialog>
  )

  const PlanoModal = () => (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="outline" size="icon" className="border-emerald-300 hover:bg-emerald-50 bg-transparent">
          <MoreHorizontal className="h-4 w-4" />
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-3xl">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <FileText className="h-5 w-5" />
            Selecionar Plano
          </DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          <Input placeholder="Pesquisar plano..." className="w-full" />
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Nome</TableHead>
                <TableHead>Código</TableHead>
                <TableHead>Categoria</TableHead>
                <TableHead>Ações</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {mockPlanos.map((plano) => (
                <TableRow key={plano.id}>
                  <TableCell className="font-medium">{plano.nome}</TableCell>
                  <TableCell>{plano.codigo}</TableCell>
                  <TableCell>{plano.categoria}</TableCell>
                  <TableCell>
                    <Button
                      size="sm"
                      onClick={() => setSelectedPlano(plano)}
                      className="bg-emerald-600 hover:bg-emerald-700"
                    >
                      Selecionar
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </DialogContent>
    </Dialog>
  )

  return (
    <div className="space-y-6 p-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Consulta de Parcelas/Títulos</h1>
          <p className="text-muted-foreground">Consulte informações detalhadas de parcelas e títulos</p>
        </div>
      </div>

      <Card className="border-emerald-200">
        <CardHeader className="border-b border-emerald-200">
          <CardTitle className="text-lg font-semibold flex items-center gap-2 text-foreground">
            <Search className="h-5 w-5" />
            Dados de Pesquisa
          </CardTitle>
        </CardHeader>
        <CardContent className="p-6 space-y-6">
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="beneficiario" className="text-sm font-medium text-foreground">
                Beneficiário:
              </Label>
              <div className="flex gap-2">
                <Input
                  id="beneficiario"
                  placeholder="Digite o nome do beneficiário"
                  value={selectedBeneficiario?.nome || ""}
                  readOnly
                  className="flex-1"
                />
                <BeneficiarioModal />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="corretor" className="text-sm font-medium text-foreground">
                Corretor:
              </Label>
              <div className="flex gap-2">
                <Input
                  id="corretor"
                  placeholder="Digite o nome do corretor"
                  value={selectedCorretor?.nome || ""}
                  readOnly
                  className="flex-1"
                />
                <CorretorModal />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="estipulante" className="text-sm font-medium text-foreground">
                Estipulante:
              </Label>
              <div className="flex gap-2">
                <Input
                  id="estipulante"
                  placeholder="Digite o estipulante"
                  value={selectedEstipulante?.nome || ""}
                  readOnly
                  className="flex-1"
                />
                <EstipulanteModal />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="plano" className="text-sm font-medium text-foreground">
                Plano:
              </Label>
              <div className="flex gap-2">
                <Input
                  id="plano"
                  placeholder="Digite o plano"
                  value={selectedPlano?.nome || ""}
                  readOnly
                  className="flex-1"
                />
                <PlanoModal />
              </div>
            </div>
          </div>

          <div className="flex gap-3 justify-end pt-4 border-t">
            <Button onClick={handleSearch} className="bg-emerald-600 hover:bg-emerald-700 text-white">
              <Search className="h-4 w-4 mr-2" />
              Consultar
            </Button>
            <Button
              onClick={handleClear}
              variant="outline"
              className="border-red-300 text-red-600 hover:bg-red-50 bg-transparent"
            >
              <X className="h-4 w-4 mr-2" />
              Limpar
            </Button>
          </div>
        </CardContent>
      </Card>

      {showResults && (
        <Card className="border-emerald-200">
          <CardHeader className="bg-emerald-50 border-b border-emerald-200">
            <CardTitle className="text-emerald-800">Parcelas Encontradas</CardTitle>
          </CardHeader>
          <CardContent className="p-0">
            <Table>
              <TableHeader>
                <TableRow className="bg-emerald-50">
                  <TableHead className="text-emerald-800 font-semibold">Beneficiário</TableHead>
                  <TableHead className="text-emerald-800 font-semibold">Corretor</TableHead>
                  <TableHead className="text-emerald-800 font-semibold">Plano</TableHead>
                  <TableHead className="text-emerald-800 font-semibold">Vencimento</TableHead>
                  <TableHead className="text-emerald-800 font-semibold">Valor Total</TableHead>
                  <TableHead className="text-emerald-800 font-semibold">Status</TableHead>
                  <TableHead className="text-emerald-800 font-semibold">Ações</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {parcelas.map((parcela) => (
                  <TableRow key={parcela.id} className="hover:bg-emerald-50/50">
                    <TableCell className="font-medium">{parcela.beneficiario}</TableCell>
                    <TableCell>{parcela.corretor}</TableCell>
                    <TableCell>{parcela.plano}</TableCell>
                    <TableCell>{new Date(parcela.vencimento).toLocaleDateString("pt-BR")}</TableCell>
                    <TableCell className="font-semibold">R$ {parcela.premioTotal.toFixed(2)}</TableCell>
                    <TableCell>{getStatusBadge(parcela.status)}</TableCell>
                    <TableCell>
                      <Button
                        size="sm"
                        onClick={() => handleSelectParcela(parcela)}
                        disabled={selectedParcela?.id === parcela.id}
                        className={
                          selectedParcela?.id === parcela.id
                            ? "bg-emerald-100 text-emerald-800 cursor-not-allowed"
                            : "bg-emerald-600 hover:bg-emerald-700 text-white"
                        }
                      >
                        {selectedParcela?.id === parcela.id ? "Selecionada" : "Selecionar"}
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      )}

      {selectedParcela && (
        <Card className="border-emerald-200">
          <CardHeader className="bg-emerald-100 border-b border-emerald-200">
            <CardTitle className="text-emerald-800 flex items-center gap-2">
              <FileText className="h-5 w-5" />
              Dados da Parcela
            </CardTitle>
          </CardHeader>
          <CardContent className="p-6 space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="space-y-2">
                <Label className="text-sm font-medium text-foreground">Vencimento:</Label>
                <Input
                  value={new Date(selectedParcela.vencimento).toLocaleDateString("pt-BR")}
                  readOnly
                  className="bg-emerald-50 border-emerald-200"
                />
              </div>

              <div className="space-y-2">
                <Label className="text-sm font-medium text-foreground">Prêmio Líquido:</Label>
                <Input
                  value={`R$ ${selectedParcela.premioLiquido.toFixed(2)}`}
                  readOnly
                  className="bg-emerald-50 border-emerald-200"
                />
              </div>

              <div className="space-y-2">
                <Label className="text-sm font-medium text-foreground">Adic. Frac.:</Label>
                <Input
                  value={`R$ ${selectedParcela.adicFrac.toFixed(2)}`}
                  readOnly
                  className="bg-emerald-50 border-emerald-200"
                />
              </div>

              <div className="space-y-2">
                <Label className="text-sm font-medium text-foreground">Custo:</Label>
                <Input
                  value={`R$ ${selectedParcela.custo.toFixed(2)}`}
                  readOnly
                  className="bg-emerald-50 border-emerald-200"
                />
              </div>

              <div className="space-y-2">
                <Label className="text-sm font-medium text-foreground">IOF:</Label>
                <Input
                  value={`R$ ${selectedParcela.iof.toFixed(2)}`}
                  readOnly
                  className="bg-emerald-50 border-emerald-200"
                />
              </div>

              <div className="space-y-2">
                <Label className="text-sm font-medium text-foreground">Prêmio Total:</Label>
                <Input
                  value={`R$ ${selectedParcela.premioTotal.toFixed(2)}`}
                  readOnly
                  className="bg-emerald-50 border-emerald-200"
                />
              </div>

              {selectedParcela.novoVencimento && (
                <div className="space-y-2">
                  <Label className="text-sm font-medium text-foreground">Novo Vencimento:</Label>
                  <Input
                    value={new Date(selectedParcela.novoVencimento).toLocaleDateString("pt-BR")}
                    readOnly
                    className="bg-blue-50 border-blue-200"
                  />
                </div>
              )}

              <div className="space-y-2">
                <Label className="text-sm font-medium text-foreground">Multa:</Label>
                <Input
                  value={`R$ ${selectedParcela.multa.toFixed(2)}`}
                  readOnly
                  className="bg-emerald-50 border-emerald-200"
                />
              </div>

              <div className="space-y-2">
                <Label className="text-sm font-medium text-foreground">Juros:</Label>
                <Input
                  value={`R$ ${selectedParcela.juros.toFixed(2)}`}
                  readOnly
                  className="bg-emerald-50 border-emerald-200"
                />
              </div>

              <div className="space-y-2">
                <Label className="text-sm font-medium text-foreground">Desconto:</Label>
                <Input
                  value={`R$ ${selectedParcela.desconto.toFixed(2)}`}
                  readOnly
                  className="bg-emerald-50 border-emerald-200"
                />
              </div>

              <div className="space-y-2">
                <Label className="text-sm font-medium text-foreground">Cobrança Vist.:</Label>
                <Input
                  value={`R$ ${selectedParcela.cobrancaVist.toFixed(2)}`}
                  readOnly
                  className="bg-emerald-50 border-emerald-200"
                />
              </div>

              {selectedParcela.dataPagamento && (
                <div className="space-y-2">
                  <Label className="text-sm font-medium text-foreground">Data Pagamento:</Label>
                  <Input
                    value={new Date(selectedParcela.dataPagamento).toLocaleDateString("pt-BR")}
                    readOnly
                    className="bg-green-50 border-green-200"
                  />
                </div>
              )}

              <div className="space-y-2">
                <Label className="text-sm font-medium text-foreground">Valor Pago:</Label>
                <Input
                  value={`R$ ${selectedParcela.valorPago.toFixed(2)}`}
                  readOnly
                  className="bg-emerald-50 border-emerald-200"
                />
              </div>

              <div className="space-y-2">
                <Label className="text-sm font-medium text-foreground">Valor Devido:</Label>
                <Input
                  value={`R$ ${selectedParcela.valorDevido.toFixed(2)}`}
                  readOnly
                  className="bg-emerald-50 border-emerald-200"
                />
              </div>

              <div className="space-y-2">
                <Label className="text-sm font-medium text-foreground">Diferença:</Label>
                <Input
                  value={`R$ ${selectedParcela.diferenca.toFixed(2)}`}
                  readOnly
                  className={
                    selectedParcela.diferenca > 0
                      ? "bg-red-50 border-red-200 text-red-700"
                      : "bg-green-50 border-green-200 text-green-700"
                  }
                />
              </div>

              {selectedParcela.dataBaixa && (
                <div className="space-y-2">
                  <Label className="text-sm font-medium text-foreground">Data da Baixa:</Label>
                  <Input
                    value={new Date(selectedParcela.dataBaixa).toLocaleDateString("pt-BR")}
                    readOnly
                    className="bg-green-50 border-green-200"
                  />
                </div>
              )}

              {selectedParcela.loteBaixa && (
                <div className="space-y-2">
                  <Label className="text-sm font-medium text-foreground">Lote de Baixa:</Label>
                  <Input value={selectedParcela.loteBaixa} readOnly className="bg-emerald-50 border-emerald-200" />
                </div>
              )}

              {selectedParcela.dataAvisoCredito && (
                <div className="space-y-2">
                  <Label className="text-sm font-medium text-foreground">Data Aviso Crédito:</Label>
                  <Input
                    value={new Date(selectedParcela.dataAvisoCredito).toLocaleDateString("pt-BR")}
                    readOnly
                    className="bg-blue-50 border-blue-200"
                  />
                </div>
              )}
            </div>

            <div className="flex gap-3 justify-center pt-4 border-t">
              <Button
                onClick={handleListarOcorrencias}
                className="bg-emerald-600 hover:bg-emerald-700 text-white px-6"
                disabled={!selectedParcela.ocorrencias.length}
              >
                <AlertCircle className="h-4 w-4 mr-2" />
                Listar Ocorrências ({selectedParcela.ocorrencias.length})
              </Button>
              <Button onClick={handleImprimir} className="bg-blue-600 hover:bg-blue-700 text-white px-6">
                <Printer className="h-4 w-4 mr-2" />
                Imprimir
              </Button>
              <Button onClick={handleEncaminharEmail} className="bg-blue-600 hover:bg-blue-700 text-white px-6">
                <Mail className="h-4 w-4 mr-2" />
                Encaminhar por e-mail
              </Button>
              <Button onClick={handleEncaminharWhatsApp} className="bg-green-600 hover:bg-green-700 text-white px-6">
                <svg className="h-4 w-4 mr-2" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.890-5.335 11.893-11.893A11.821 11.821 0 0020.885 3.787" />
                </svg>
                Encaminhar WhatsApp
              </Button>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
