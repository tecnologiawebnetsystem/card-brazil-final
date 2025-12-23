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
import { CreditCardIcon, PrinterIcon, DownloadIcon, SearchIcon, FileTextIcon } from "lucide-react"

export default function CarteirinhasPage() {
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedBeneficiarios, setSelectedBeneficiarios] = useState<number[]>([])

  const [solicitacoesCarteirinha, setSolicitacoesCarteirinha] = useState([
    {
      id: 1,
      nome: "Carlos Silva Santos",
      cpf: "111.222.333-44",
      tipo: "Titular",
      plano: "Plano Premium",
      motivo: "Primeira via",
      dataSolicitacao: "15/01/2024",
      status: "Em Produção",
      previsaoEntrega: "22/01/2024",
    },
    {
      id: 2,
      nome: "Maria Santos Silva",
      cpf: "123.456.789-01",
      tipo: "Dependente",
      plano: "Plano Premium",
      motivo: "Segunda via - Perda",
      dataSolicitacao: "14/01/2024",
      status: "Enviado",
      previsaoEntrega: "21/01/2024",
    },
  ])

  const beneficiarios = [
    {
      id: 1,
      nome: "Carlos Silva Santos",
      cpf: "111.222.333-44",
      tipo: "Titular",
      plano: "Plano Premium",
      operadora: "Unimed",
      numeroCarteirinha: "123456789012345",
      dataEmissao: "01/06/2023",
      status: "Ativo",
      possuiCarteirinha: true,
    },
    {
      id: 2,
      nome: "Maria Santos Silva",
      cpf: "123.456.789-01",
      tipo: "Dependente",
      plano: "Plano Premium",
      operadora: "Unimed",
      numeroCarteirinha: "123456789012346",
      dataEmissao: "01/06/2023",
      status: "Ativo",
      possuiCarteirinha: true,
    },
    {
      id: 3,
      nome: "Roberto Costa Lima",
      cpf: "555.666.777-88",
      tipo: "Titular",
      plano: "Plano Básico",
      operadora: "Bradesco Saúde",
      numeroCarteirinha: "",
      dataEmissao: "",
      status: "Ativo",
      possuiCarteirinha: false,
    },
    {
      id: 4,
      nome: "Ana Costa Lima",
      cpf: "999.888.777-66",
      tipo: "Dependente",
      plano: "Plano Básico",
      operadora: "Bradesco Saúde",
      numeroCarteirinha: "",
      dataEmissao: "",
      status: "Ativo",
      possuiCarteirinha: false,
    },
  ]

  const filteredBeneficiarios = beneficiarios.filter(
    (beneficiario) =>
      beneficiario.nome.toLowerCase().includes(searchTerm.toLowerCase()) ||
      beneficiario.cpf.includes(searchTerm) ||
      beneficiario.numeroCarteirinha.includes(searchTerm),
  )

  const toggleBeneficiario = (id: number) => {
    setSelectedBeneficiarios((prev) => (prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]))
  }

  const toggleAll = () => {
    if (selectedBeneficiarios.length === filteredBeneficiarios.length) {
      setSelectedBeneficiarios([])
    } else {
      setSelectedBeneficiarios(filteredBeneficiarios.map((b) => b.id))
    }
  }

  return (
    <div className="flex-1 space-y-6 p-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-gray-900">Emissão de Carteirinhas</h1>
          <p className="text-gray-600">Gerenciamento de carteirinhas dos beneficiários</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline">
            <FileTextIcon className="h-4 w-4 mr-2" />
            Relatório
          </Button>
          <Button>
            <CreditCardIcon className="h-4 w-4 mr-2" />
            Nova Solicitação
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        <div className="lg:col-span-1">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Resumo de Carteirinhas</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 gap-3">
                <div className="text-center p-3 bg-blue-50 rounded-lg">
                  <div className="text-2xl font-bold text-blue-600">12</div>
                  <div className="text-xs text-blue-600">Solicitações Mês</div>
                </div>
                <div className="text-center p-3 bg-yellow-50 rounded-lg">
                  <div className="text-2xl font-bold text-yellow-600">5</div>
                  <div className="text-xs text-yellow-600">Em Produção</div>
                </div>
                <div className="text-center p-3 bg-green-50 rounded-lg">
                  <div className="text-2xl font-bold text-green-600">8</div>
                  <div className="text-xs text-green-600">Enviadas</div>
                </div>
                <div className="text-center p-3 bg-purple-50 rounded-lg">
                  <div className="text-2xl font-bold text-purple-600">156</div>
                  <div className="text-xs text-purple-600">Carteirinhas Ativas</div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="mt-6">
            <CardHeader>
              <CardTitle className="text-lg">Ações em Lote</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <Button className="w-full" disabled={selectedBeneficiarios.length === 0}>
                <PrinterIcon className="h-4 w-4 mr-2" />
                Imprimir Selecionadas ({selectedBeneficiarios.length})
              </Button>
              <Button variant="outline" className="w-full bg-transparent" disabled={selectedBeneficiarios.length === 0}>
                <DownloadIcon className="h-4 w-4 mr-2" />
                Baixar PDF
              </Button>
              <Button variant="outline" className="w-full bg-transparent" disabled={selectedBeneficiarios.length === 0}>
                <CreditCardIcon className="h-4 w-4 mr-2" />
                Solicitar Reimpressão
              </Button>
            </CardContent>
          </Card>
        </div>

        <div className="lg:col-span-3">
          <Tabs defaultValue="solicitacoes" className="space-y-6">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="solicitacoes">Solicitações</TabsTrigger>
              <TabsTrigger value="beneficiarios">Beneficiários</TabsTrigger>
              <TabsTrigger value="emitir">Emitir Carteirinha</TabsTrigger>
            </TabsList>

            <TabsContent value="solicitacoes">
              <Card>
                <CardHeader>
                  <CardTitle>Solicitações de Carteirinhas</CardTitle>
                  <CardDescription>Acompanhe o status das solicitações de carteirinhas</CardDescription>
                </CardHeader>
                <CardContent>
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Beneficiário</TableHead>
                        <TableHead>CPF</TableHead>
                        <TableHead>Tipo</TableHead>
                        <TableHead>Plano</TableHead>
                        <TableHead>Motivo</TableHead>
                        <TableHead>Data Solicitação</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead>Previsão Entrega</TableHead>
                        <TableHead className="text-right">Ações</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {solicitacoesCarteirinha.map((solicitacao) => (
                        <TableRow key={solicitacao.id}>
                          <TableCell className="font-medium">{solicitacao.nome}</TableCell>
                          <TableCell>{solicitacao.cpf}</TableCell>
                          <TableCell>{solicitacao.tipo}</TableCell>
                          <TableCell>{solicitacao.plano}</TableCell>
                          <TableCell>{solicitacao.motivo}</TableCell>
                          <TableCell>{solicitacao.dataSolicitacao}</TableCell>
                          <TableCell>
                            <Badge
                              variant={
                                solicitacao.status === "Enviado"
                                  ? "default"
                                  : solicitacao.status === "Em Produção"
                                    ? "secondary"
                                    : "destructive"
                              }
                            >
                              {solicitacao.status}
                            </Badge>
                          </TableCell>
                          <TableCell>{solicitacao.previsaoEntrega}</TableCell>
                          <TableCell className="text-right">
                            <div className="flex justify-end gap-2">
                              <Button variant="outline" size="sm">
                                <PrinterIcon className="h-4 w-4" />
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
                  <CardTitle>Beneficiários e Carteirinhas</CardTitle>
                  <CardDescription>Lista de beneficiários e status das carteirinhas</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex gap-4">
                      <div className="flex-1">
                        <Input
                          placeholder="Buscar por nome, CPF ou número da carteirinha..."
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
                          <TableHead className="w-12">
                            <input
                              type="checkbox"
                              checked={selectedBeneficiarios.length === filteredBeneficiarios.length}
                              onChange={toggleAll}
                              className="rounded"
                            />
                          </TableHead>
                          <TableHead>Nome</TableHead>
                          <TableHead>CPF</TableHead>
                          <TableHead>Tipo</TableHead>
                          <TableHead>Plano</TableHead>
                          <TableHead>Nº Carteirinha</TableHead>
                          <TableHead>Data Emissão</TableHead>
                          <TableHead>Status</TableHead>
                          <TableHead className="text-right">Ações</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {filteredBeneficiarios.map((beneficiario) => (
                          <TableRow key={beneficiario.id}>
                            <TableCell>
                              <input
                                type="checkbox"
                                checked={selectedBeneficiarios.includes(beneficiario.id)}
                                onChange={() => toggleBeneficiario(beneficiario.id)}
                                className="rounded"
                              />
                            </TableCell>
                            <TableCell className="font-medium">{beneficiario.nome}</TableCell>
                            <TableCell>{beneficiario.cpf}</TableCell>
                            <TableCell>
                              <Badge variant={beneficiario.tipo === "Titular" ? "default" : "secondary"}>
                                {beneficiario.tipo}
                              </Badge>
                            </TableCell>
                            <TableCell>{beneficiario.plano}</TableCell>
                            <TableCell>
                              {beneficiario.numeroCarteirinha || (
                                <span className="text-gray-400 italic">Não emitida</span>
                              )}
                            </TableCell>
                            <TableCell>{beneficiario.dataEmissao || "-"}</TableCell>
                            <TableCell>
                              <Badge variant={beneficiario.possuiCarteirinha ? "default" : "secondary"}>
                                {beneficiario.possuiCarteirinha ? "Emitida" : "Pendente"}
                              </Badge>
                            </TableCell>
                            <TableCell className="text-right">
                              <div className="flex justify-end gap-2">
                                <Button variant="outline" size="sm">
                                  <CreditCardIcon className="h-4 w-4" />
                                </Button>
                                <Button variant="outline" size="sm">
                                  <PrinterIcon className="h-4 w-4" />
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

            <TabsContent value="emitir">
              <Card>
                <CardHeader>
                  <CardTitle>Emitir Nova Carteirinha</CardTitle>
                  <CardDescription>Solicite a emissão de carteirinha para beneficiários</CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="beneficiario">Beneficiário</Label>
                      <Select>
                        <SelectTrigger>
                          <SelectValue placeholder="Selecione o beneficiário" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="carlos">Carlos Silva Santos - 111.222.333-44</SelectItem>
                          <SelectItem value="maria">Maria Santos Silva - 123.456.789-01</SelectItem>
                          <SelectItem value="roberto">Roberto Costa Lima - 555.666.777-88</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="motivo">Motivo da Emissão</Label>
                      <Select>
                        <SelectTrigger>
                          <SelectValue placeholder="Selecione o motivo" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="primeira-via">Primeira via</SelectItem>
                          <SelectItem value="segunda-via-perda">Segunda via - Perda</SelectItem>
                          <SelectItem value="segunda-via-roubo">Segunda via - Roubo</SelectItem>
                          <SelectItem value="segunda-via-dano">Segunda via - Dano</SelectItem>
                          <SelectItem value="atualizacao-dados">Atualização de dados</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="endereco-entrega">Endereço de Entrega</Label>
                      <Select>
                        <SelectTrigger>
                          <SelectValue placeholder="Selecione o endereço" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="residencial">Endereço Residencial</SelectItem>
                          <SelectItem value="comercial">Endereço Comercial</SelectItem>
                          <SelectItem value="outro">Outro Endereço</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="urgencia">Urgência</Label>
                      <Select>
                        <SelectTrigger>
                          <SelectValue placeholder="Selecione a urgência" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="normal">Normal (7-10 dias)</SelectItem>
                          <SelectItem value="expressa">Expressa (3-5 dias)</SelectItem>
                          <SelectItem value="urgente">Urgente (1-2 dias)</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  <div className="flex justify-end gap-2">
                    <Button variant="outline">Cancelar</Button>
                    <Button>
                      <CreditCardIcon className="h-4 w-4 mr-2" />
                      Solicitar Emissão
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
