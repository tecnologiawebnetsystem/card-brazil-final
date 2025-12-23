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
import { UserPlusIcon, SearchIcon, FileTextIcon, CheckIcon } from "lucide-react"

export default function InclusaoBeneficiariosPage() {
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedPlano, setSelectedPlano] = useState("")

  const [novasInclusoes, setNovasInclusoes] = useState([
    {
      id: 1,
      nome: "Pedro Santos Silva",
      cpf: "123.456.789-00",
      parentesco: "Filho",
      titular: "Carlos Silva Santos",
      plano: "Plano Premium",
      dataInclusao: "15/01/2024",
      status: "Pendente Análise",
    },
    {
      id: 2,
      nome: "Ana Costa Lima",
      cpf: "987.654.321-11",
      parentesco: "Cônjuge",
      titular: "Roberto Costa Lima",
      plano: "Plano Básico",
      dataInclusao: "14/01/2024",
      status: "Aprovado",
    },
  ])

  const beneficiariosAtivos = [
    {
      id: 1,
      nome: "Carlos Silva Santos",
      cpf: "111.222.333-44",
      tipo: "Titular",
      plano: "Plano Premium",
      dataAdesao: "01/06/2023",
      status: "Ativo",
      dependentes: 2,
    },
    {
      id: 2,
      nome: "Roberto Costa Lima",
      cpf: "555.666.777-88",
      tipo: "Titular",
      plano: "Plano Básico",
      dataAdesao: "15/03/2023",
      status: "Ativo",
      dependentes: 1,
    },
  ]

  const filteredBeneficiarios = beneficiariosAtivos.filter(
    (beneficiario) =>
      beneficiario.nome.toLowerCase().includes(searchTerm.toLowerCase()) || beneficiario.cpf.includes(searchTerm),
  )

  return (
    <div className="flex-1 space-y-6 p-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-gray-900">Inclusão de Beneficiários</h1>
          <p className="text-gray-600">Gerenciamento de inclusões de novos beneficiários</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline">
            <FileTextIcon className="h-4 w-4 mr-2" />
            Relatório
          </Button>
          <Button>
            <UserPlusIcon className="h-4 w-4 mr-2" />
            Nova Inclusão
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        <div className="lg:col-span-1">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Resumo de Inclusões</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 gap-3">
                <div className="text-center p-3 bg-blue-50 rounded-lg">
                  <div className="text-2xl font-bold text-blue-600">15</div>
                  <div className="text-xs text-blue-600">Solicitações Mês</div>
                </div>
                <div className="text-center p-3 bg-yellow-50 rounded-lg">
                  <div className="text-2xl font-bold text-yellow-600">8</div>
                  <div className="text-xs text-yellow-600">Pendente Análise</div>
                </div>
                <div className="text-center p-3 bg-green-50 rounded-lg">
                  <div className="text-2xl font-bold text-green-600">12</div>
                  <div className="text-xs text-green-600">Aprovadas</div>
                </div>
                <div className="text-center p-3 bg-red-50 rounded-lg">
                  <div className="text-2xl font-bold text-red-600">2</div>
                  <div className="text-xs text-red-600">Rejeitadas</div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="lg:col-span-3">
          <Tabs defaultValue="solicitacoes" className="space-y-6">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="solicitacoes">Solicitações</TabsTrigger>
              <TabsTrigger value="beneficiarios">Beneficiários Ativos</TabsTrigger>
              <TabsTrigger value="nova-inclusao">Nova Inclusão</TabsTrigger>
            </TabsList>

            <TabsContent value="solicitacoes">
              <Card>
                <CardHeader>
                  <CardTitle>Solicitações de Inclusão</CardTitle>
                  <CardDescription>Acompanhe o status das solicitações de inclusão</CardDescription>
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
                      <Select value={selectedPlano} onValueChange={setSelectedPlano}>
                        <SelectTrigger className="w-48">
                          <SelectValue placeholder="Filtrar por plano" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="todos">Todos os Planos</SelectItem>
                          <SelectItem value="basico">Plano Básico</SelectItem>
                          <SelectItem value="intermediario">Plano Intermediário</SelectItem>
                          <SelectItem value="premium">Plano Premium</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Beneficiário</TableHead>
                          <TableHead>CPF</TableHead>
                          <TableHead>Parentesco</TableHead>
                          <TableHead>Titular</TableHead>
                          <TableHead>Plano</TableHead>
                          <TableHead>Data Solicitação</TableHead>
                          <TableHead>Status</TableHead>
                          <TableHead className="text-right">Ações</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {novasInclusoes.map((inclusao) => (
                          <TableRow key={inclusao.id}>
                            <TableCell className="font-medium">{inclusao.nome}</TableCell>
                            <TableCell>{inclusao.cpf}</TableCell>
                            <TableCell>{inclusao.parentesco}</TableCell>
                            <TableCell>{inclusao.titular}</TableCell>
                            <TableCell>{inclusao.plano}</TableCell>
                            <TableCell>{inclusao.dataInclusao}</TableCell>
                            <TableCell>
                              <Badge
                                variant={
                                  inclusao.status === "Aprovado"
                                    ? "default"
                                    : inclusao.status === "Pendente Análise"
                                      ? "secondary"
                                      : "destructive"
                                }
                              >
                                {inclusao.status}
                              </Badge>
                            </TableCell>
                            <TableCell className="text-right">
                              <div className="flex justify-end gap-2">
                                <Button variant="outline" size="sm">
                                  <CheckIcon className="h-4 w-4" />
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
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="beneficiarios">
              <Card>
                <CardHeader>
                  <CardTitle>Beneficiários Ativos</CardTitle>
                  <CardDescription>Lista de beneficiários com planos ativos</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex gap-4">
                      <div className="flex-1">
                        <Input
                          placeholder="Buscar beneficiário..."
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
                          <TableHead>Data Adesão</TableHead>
                          <TableHead>Dependentes</TableHead>
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
                            <TableCell>{beneficiario.dataAdesao}</TableCell>
                            <TableCell>{beneficiario.dependentes}</TableCell>
                            <TableCell>
                              <Badge variant="default">{beneficiario.status}</Badge>
                            </TableCell>
                            <TableCell className="text-right">
                              <div className="flex justify-end gap-2">
                                <Button variant="outline" size="sm">
                                  <UserPlusIcon className="h-4 w-4" />
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
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="nova-inclusao">
              <Card>
                <CardHeader>
                  <CardTitle>Nova Inclusão de Beneficiário</CardTitle>
                  <CardDescription>Cadastre um novo beneficiário no sistema</CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="titular">Beneficiário Titular</Label>
                      <Select>
                        <SelectTrigger>
                          <SelectValue placeholder="Selecione o titular" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="carlos">Carlos Silva Santos - 111.222.333-44</SelectItem>
                          <SelectItem value="roberto">Roberto Costa Lima - 555.666.777-88</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="parentesco">Parentesco</Label>
                      <Select>
                        <SelectTrigger>
                          <SelectValue placeholder="Selecione o parentesco" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="conjuge">Cônjuge</SelectItem>
                          <SelectItem value="filho">Filho(a)</SelectItem>
                          <SelectItem value="enteado">Enteado(a)</SelectItem>
                          <SelectItem value="pai">Pai</SelectItem>
                          <SelectItem value="mae">Mãe</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="nome">Nome Completo</Label>
                      <Input id="nome" placeholder="Digite o nome completo" />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="cpf">CPF</Label>
                      <Input id="cpf" placeholder="000.000.000-00" />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="dataNascimento">Data de Nascimento</Label>
                      <Input id="dataNascimento" type="date" />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="sexo">Sexo</Label>
                      <Select>
                        <SelectTrigger>
                          <SelectValue placeholder="Selecione" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="masculino">Masculino</SelectItem>
                          <SelectItem value="feminino">Feminino</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="telefone">Telefone</Label>
                      <Input id="telefone" placeholder="(11) 90000-0000" />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="email">E-mail</Label>
                      <Input id="email" type="email" placeholder="email@exemplo.com" />
                    </div>
                  </div>

                  <div className="flex justify-end gap-2">
                    <Button variant="outline">Cancelar</Button>
                    <Button>
                      <UserPlusIcon className="h-4 w-4 mr-2" />
                      Solicitar Inclusão
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  )
}
