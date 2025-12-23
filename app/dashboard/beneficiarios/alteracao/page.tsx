"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { EditIcon, SearchIcon, FileTextIcon, SaveIcon } from "lucide-react"

export default function AlteracaoBeneficiariosPage() {
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedBeneficiario, setSelectedBeneficiario] = useState(null)

  const [alteracoesPendentes, setAlteracoesPendentes] = useState([
    {
      id: 1,
      nome: "Carlos Silva Santos",
      cpf: "111.222.333-44",
      tipoAlteracao: "Dados Pessoais",
      campoAlterado: "Telefone",
      valorAnterior: "(11) 98765-4321",
      valorNovo: "(11) 99999-8888",
      dataSolicitacao: "15/01/2024",
      status: "Pendente Análise",
    },
    {
      id: 2,
      nome: "Maria Santos Silva",
      cpf: "123.456.789-01",
      tipoAlteracao: "Endereço",
      campoAlterado: "Endereço Completo",
      valorAnterior: "Rua A, 123",
      valorNovo: "Rua B, 456",
      dataSolicitacao: "14/01/2024",
      status: "Aprovado",
    },
  ])

  const beneficiarios = [
    {
      id: 1,
      nome: "Carlos Silva Santos",
      cpf: "111.222.333-44",
      tipo: "Titular",
      plano: "Plano Premium",
      telefone: "(11) 98765-4321",
      email: "carlos@email.com",
      endereco: "Rua das Flores, 123",
      status: "Ativo",
    },
    {
      id: 2,
      nome: "Maria Santos Silva",
      cpf: "123.456.789-01",
      tipo: "Dependente",
      plano: "Plano Premium",
      telefone: "(11) 97654-3210",
      email: "maria@email.com",
      endereco: "Rua das Flores, 123",
      status: "Ativo",
    },
  ]

  const [dadosEdicao, setDadosEdicao] = useState({
    nome: "",
    telefone: "",
    email: "",
    endereco: "",
    numero: "",
    complemento: "",
    bairro: "",
    cidade: "",
    uf: "",
    cep: "",
  })

  const filteredBeneficiarios = beneficiarios.filter(
    (beneficiario) =>
      beneficiario.nome.toLowerCase().includes(searchTerm.toLowerCase()) || beneficiario.cpf.includes(searchTerm),
  )

  const selecionarBeneficiario = (beneficiario) => {
    setSelectedBeneficiario(beneficiario)
    setDadosEdicao({
      nome: beneficiario.nome,
      telefone: beneficiario.telefone,
      email: beneficiario.email,
      endereco: beneficiario.endereco,
      numero: "123",
      complemento: "",
      bairro: "Centro",
      cidade: "São Paulo",
      uf: "SP",
      cep: "01234-567",
    })
  }

  const handleInputChange = (field: string, value: string) => {
    setDadosEdicao((prev) => ({ ...prev, [field]: value }))
  }

  return (
    <div className="flex-1 space-y-6 p-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-gray-900">Alteração de Dados</h1>
          <p className="text-gray-600">Gerenciamento de alterações de dados dos beneficiários</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline">
            <FileTextIcon className="h-4 w-4 mr-2" />
            Relatório
          </Button>
          <Button>
            <EditIcon className="h-4 w-4 mr-2" />
            Nova Alteração
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        <div className="lg:col-span-1">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Resumo de Alterações</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 gap-3">
                <div className="text-center p-3 bg-blue-50 rounded-lg">
                  <div className="text-2xl font-bold text-blue-600">23</div>
                  <div className="text-xs text-blue-600">Solicitações Mês</div>
                </div>
                <div className="text-center p-3 bg-yellow-50 rounded-lg">
                  <div className="text-2xl font-bold text-yellow-600">7</div>
                  <div className="text-xs text-yellow-600">Pendente Análise</div>
                </div>
                <div className="text-center p-3 bg-green-50 rounded-lg">
                  <div className="text-2xl font-bold text-green-600">18</div>
                  <div className="text-xs text-green-600">Processadas</div>
                </div>
                <div className="text-center p-3 bg-purple-50 rounded-lg">
                  <div className="text-2xl font-bold text-purple-600">156</div>
                  <div className="text-xs text-purple-600">Beneficiários Ativos</div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="lg:col-span-3">
          <Tabs defaultValue="alteracoes" className="space-y-6">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="alteracoes">Solicitações</TabsTrigger>
              <TabsTrigger value="beneficiarios">Beneficiários</TabsTrigger>
              <TabsTrigger value="editar">Editar Dados</TabsTrigger>
            </TabsList>

            <TabsContent value="alteracoes">
              <Card>
                <CardHeader>
                  <CardTitle>Solicitações de Alteração</CardTitle>
                  <CardDescription>Acompanhe o status das alterações solicitadas</CardDescription>
                </CardHeader>
                <CardContent>
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Beneficiário</TableHead>
                        <TableHead>CPF</TableHead>
                        <TableHead>Tipo Alteração</TableHead>
                        <TableHead>Campo</TableHead>
                        <TableHead>Valor Anterior</TableHead>
                        <TableHead>Valor Novo</TableHead>
                        <TableHead>Data</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead className="text-right">Ações</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {alteracoesPendentes.map((alteracao) => (
                        <TableRow key={alteracao.id}>
                          <TableCell className="font-medium">{alteracao.nome}</TableCell>
                          <TableCell>{alteracao.cpf}</TableCell>
                          <TableCell>{alteracao.tipoAlteracao}</TableCell>
                          <TableCell>{alteracao.campoAlterado}</TableCell>
                          <TableCell className="text-gray-500">{alteracao.valorAnterior}</TableCell>
                          <TableCell className="font-medium">{alteracao.valorNovo}</TableCell>
                          <TableCell>{alteracao.dataSolicitacao}</TableCell>
                          <TableCell>
                            <Badge
                              variant={
                                alteracao.status === "Aprovado"
                                  ? "default"
                                  : alteracao.status === "Pendente Análise"
                                    ? "secondary"
                                    : "destructive"
                              }
                            >
                              {alteracao.status}
                            </Badge>
                          </TableCell>
                          <TableCell className="text-right">
                            <div className="flex justify-end gap-2">
                              <Button variant="outline" size="sm">
                                Aprovar
                              </Button>
                              <Button variant="outline" size="sm">
                                Detalhes
                              </Button>
                            </div>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="beneficiarios">
              <Card>
                <CardHeader>
                  <CardTitle>Selecionar Beneficiário</CardTitle>
                  <CardDescription>Escolha o beneficiário para alterar os dados</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex gap-4">
                      <div className="flex-1">
                        <Input
                          placeholder="Buscar por nome ou CPF..."
                          value={searchTerm}
                          onChange={(e) => setSearchTerm(e.target.value)}
                        />
                      </div>
                      <Button variant="outline">
                        <SearchIcon className="h-4 w-4 mr-2" />
                        Buscar
                      </Button>
                    </div>

                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Nome</TableHead>
                          <TableHead>CPF</TableHead>
                          <TableHead>Tipo</TableHead>
                          <TableHead>Plano</TableHead>
                          <TableHead>Telefone</TableHead>
                          <TableHead>E-mail</TableHead>
                          <TableHead>Status</TableHead>
                          <TableHead className="text-right">Ações</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {filteredBeneficiarios.map((beneficiario) => (
                          <TableRow key={beneficiario.id}>
                            <TableCell className="font-medium">{beneficiario.nome}</TableCell>
                            <TableCell>{beneficiario.cpf}</TableCell>
                            <TableCell>{beneficiario.tipo}</TableCell>
                            <TableCell>{beneficiario.plano}</TableCell>
                            <TableCell>{beneficiario.telefone}</TableCell>
                            <TableCell>{beneficiario.email}</TableCell>
                            <TableCell>
                              <Badge variant="default">{beneficiario.status}</Badge>
                            </TableCell>
                            <TableCell className="text-right">
                              <Button variant="outline" size="sm" onClick={() => selecionarBeneficiario(beneficiario)}>
                                <EditIcon className="h-4 w-4" />
                              </Button>
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="editar">
              <Card>
                <CardHeader>
                  <CardTitle>Editar Dados do Beneficiário</CardTitle>
                  <CardDescription>
                    {selectedBeneficiario
                      ? `Alterando dados de: ${selectedBeneficiario.nome}`
                      : "Selecione um beneficiário na aba anterior"}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  {selectedBeneficiario ? (
                    <div className="space-y-6">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label htmlFor="nome">Nome Completo</Label>
                          <Input
                            id="nome"
                            value={dadosEdicao.nome}
                            onChange={(e) => handleInputChange("nome", e.target.value)}
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="telefone">Telefone</Label>
                          <Input
                            id="telefone"
                            value={dadosEdicao.telefone}
                            onChange={(e) => handleInputChange("telefone", e.target.value)}
                          />
                        </div>
                        <div className="space-y-2 md:col-span-2">
                          <Label htmlFor="email">E-mail</Label>
                          <Input
                            id="email"
                            type="email"
                            value={dadosEdicao.email}
                            onChange={(e) => handleInputChange("email", e.target.value)}
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="cep">CEP</Label>
                          <Input
                            id="cep"
                            value={dadosEdicao.cep}
                            onChange={(e) => handleInputChange("cep", e.target.value)}
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="endereco">Endereço</Label>
                          <Input
                            id="endereco"
                            value={dadosEdicao.endereco}
                            onChange={(e) => handleInputChange("endereco", e.target.value)}
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="numero">Número</Label>
                          <Input
                            id="numero"
                            value={dadosEdicao.numero}
                            onChange={(e) => handleInputChange("numero", e.target.value)}
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="complemento">Complemento</Label>
                          <Input
                            id="complemento"
                            value={dadosEdicao.complemento}
                            onChange={(e) => handleInputChange("complemento", e.target.value)}
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="bairro">Bairro</Label>
                          <Input
                            id="bairro"
                            value={dadosEdicao.bairro}
                            onChange={(e) => handleInputChange("bairro", e.target.value)}
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="cidade">Cidade</Label>
                          <Input
                            id="cidade"
                            value={dadosEdicao.cidade}
                            onChange={(e) => handleInputChange("cidade", e.target.value)}
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="uf">UF</Label>
                          <Select value={dadosEdicao.uf} onValueChange={(value) => handleInputChange("uf", value)}>
                            <SelectTrigger>
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="SP">São Paulo</SelectItem>
                              <SelectItem value="RJ">Rio de Janeiro</SelectItem>
                              <SelectItem value="MG">Minas Gerais</SelectItem>
                              <SelectItem value="RS">Rio Grande do Sul</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                      </div>

                      <div className="flex justify-end gap-2">
                        <Button variant="outline">Cancelar</Button>
                        <Button>
                          <SaveIcon className="h-4 w-4 mr-2" />
                          Salvar Alterações
                        </Button>
                      </div>
                    </div>
                  ) : (
                    <div className="text-center py-8 text-gray-500">
                      <EditIcon className="h-12 w-12 mx-auto mb-4 text-gray-300" />
                      <p>Nenhum beneficiário selecionado</p>
                      <p className="text-sm">Vá para a aba "Beneficiários" e selecione um beneficiário para editar</p>
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  )
}
