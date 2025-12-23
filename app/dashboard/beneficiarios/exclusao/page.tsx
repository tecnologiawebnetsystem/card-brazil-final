"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Textarea } from "@/components/ui/textarea"
import { UserMinusIcon, SearchIcon, FileTextIcon, AlertTriangleIcon } from "lucide-react"

export default function ExclusaoBeneficiariosPage() {
  const [searchTerm, setSearchTerm] = useState("")
  const [motivoExclusao, setMotivoExclusao] = useState("")

  const [exclusoesPendentes, setExclusoesPendentes] = useState([
    {
      id: 1,
      nome: "Maria Santos Silva",
      cpf: "123.456.789-01",
      parentesco: "Cônjuge",
      titular: "Carlos Silva Santos",
      plano: "Plano Premium",
      dataSolicitacao: "10/01/2024",
      motivo: "Divórcio",
      status: "Pendente Análise",
    },
    {
      id: 2,
      nome: "João Costa Lima",
      cpf: "987.654.321-09",
      parentesco: "Filho",
      titular: "Roberto Costa Lima",
      plano: "Plano Básico",
      dataSolicitacao: "08/01/2024",
      motivo: "Atingiu idade limite",
      status: "Aprovado",
    },
  ])

  const beneficiariosAtivos = [
    {
      id: 1,
      nome: "Maria Santos Silva",
      cpf: "123.456.789-01",
      parentesco: "Cônjuge",
      titular: "Carlos Silva Santos",
      plano: "Plano Premium",
      dataAdesao: "01/06/2023",
      status: "Ativo",
      ultimaUtilizacao: "05/01/2024",
    },
    {
      id: 2,
      nome: "Ana Costa Lima",
      cpf: "555.666.777-88",
      parentesco: "Filha",
      titular: "Roberto Costa Lima",
      plano: "Plano Básico",
      dataAdesao: "15/03/2023",
      status: "Ativo",
      ultimaUtilizacao: "12/12/2023",
    },
    {
      id: 3,
      nome: "Pedro Silva Santos",
      cpf: "111.222.333-44",
      parentesco: "Filho",
      titular: "Carlos Silva Santos",
      plano: "Plano Premium",
      dataAdesao: "01/06/2023",
      status: "Ativo",
      ultimaUtilizacao: "20/01/2024",
    },
  ]

  const motivosExclusao = [
    "Divórcio/Separação",
    "Atingiu idade limite",
    "Óbito",
    "Mudança de plano",
    "Inadimplência",
    "Solicitação do titular",
    "Outros",
  ]

  const filteredBeneficiarios = beneficiariosAtivos.filter(
    (beneficiario) =>
      beneficiario.nome.toLowerCase().includes(searchTerm.toLowerCase()) ||
      beneficiario.cpf.includes(searchTerm) ||
      beneficiario.titular.toLowerCase().includes(searchTerm.toLowerCase()),
  )

  return (
    <div className="flex-1 space-y-6 p-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-gray-900">Exclusão de Beneficiários</h1>
          <p className="text-gray-600">Gerenciamento de exclusões de beneficiários</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline">
            <FileTextIcon className="h-4 w-4 mr-2" />
            Relatório
          </Button>
          <Button variant="destructive">
            <UserMinusIcon className="h-4 w-4 mr-2" />
            Nova Exclusão
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        <div className="lg:col-span-1">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Resumo de Exclusões</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 gap-3">
                <div className="text-center p-3 bg-red-50 rounded-lg">
                  <div className="text-2xl font-bold text-red-600">8</div>
                  <div className="text-xs text-red-600">Solicitações Mês</div>
                </div>
                <div className="text-center p-3 bg-yellow-50 rounded-lg">
                  <div className="text-2xl font-bold text-yellow-600">3</div>
                  <div className="text-xs text-yellow-600">Pendente Análise</div>
                </div>
                <div className="text-center p-3 bg-green-50 rounded-lg">
                  <div className="text-2xl font-bold text-green-600">5</div>
                  <div className="text-xs text-green-600">Processadas</div>
                </div>
                <div className="text-center p-3 bg-blue-50 rounded-lg">
                  <div className="text-2xl font-bold text-blue-600">156</div>
                  <div className="text-xs text-blue-600">Beneficiários Ativos</div>
                </div>
              </div>

              <div className="p-3 bg-amber-50 border border-amber-200 rounded-lg">
                <div className="flex items-center gap-2 mb-2">
                  <AlertTriangleIcon className="h-4 w-4 text-amber-600" />
                  <span className="text-sm font-medium text-amber-800">Atenção</span>
                </div>
                <p className="text-xs text-amber-700">
                  Exclusões processadas não podem ser revertidas. Verifique todos os dados antes de confirmar.
                </p>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="lg:col-span-3 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Solicitações de Exclusão</CardTitle>
              <CardDescription>Acompanhe o status das solicitações de exclusão</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex gap-4">
                  <div className="flex-1">
                    <Input
                      placeholder="Buscar por nome, CPF ou titular..."
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
                      <TableHead>Beneficiário</TableHead>
                      <TableHead>CPF</TableHead>
                      <TableHead>Parentesco</TableHead>
                      <TableHead>Titular</TableHead>
                      <TableHead>Motivo</TableHead>
                      <TableHead>Data Solicitação</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead className="text-right">Ações</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {exclusoesPendentes.map((exclusao) => (
                      <TableRow key={exclusao.id}>
                        <TableCell className="font-medium">{exclusao.nome}</TableCell>
                        <TableCell>{exclusao.cpf}</TableCell>
                        <TableCell>{exclusao.parentesco}</TableCell>
                        <TableCell>{exclusao.titular}</TableCell>
                        <TableCell>{exclusao.motivo}</TableCell>
                        <TableCell>{exclusao.dataSolicitacao}</TableCell>
                        <TableCell>
                          <Badge
                            variant={
                              exclusao.status === "Aprovado"
                                ? "default"
                                : exclusao.status === "Pendente Análise"
                                  ? "secondary"
                                  : "destructive"
                            }
                          >
                            {exclusao.status}
                          </Badge>
                        </TableCell>
                        <TableCell className="text-right">
                          <div className="flex justify-end gap-2">
                            <Button variant="outline" size="sm">
                              Processar
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

          <Card>
            <CardHeader>
              <CardTitle>Beneficiários Elegíveis para Exclusão</CardTitle>
              <CardDescription>Selecione beneficiários para solicitar exclusão</CardDescription>
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
                  <Select value={motivoExclusao} onValueChange={setMotivoExclusao}>
                    <SelectTrigger className="w-48">
                      <SelectValue placeholder="Motivo da exclusão" />
                    </SelectTrigger>
                    <SelectContent>
                      {motivosExclusao.map((motivo) => (
                        <SelectItem key={motivo} value={motivo}>
                          {motivo}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="w-12">Sel.</TableHead>
                      <TableHead>Nome</TableHead>
                      <TableHead>CPF</TableHead>
                      <TableHead>Parentesco</TableHead>
                      <TableHead>Titular</TableHead>
                      <TableHead>Plano</TableHead>
                      <TableHead>Última Utilização</TableHead>
                      <TableHead className="text-right">Ações</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredBeneficiarios.map((beneficiario) => (
                      <TableRow key={beneficiario.id}>
                        <TableCell>
                          <input type="checkbox" className="rounded" />
                        </TableCell>
                        <TableCell className="font-medium">{beneficiario.nome}</TableCell>
                        <TableCell>{beneficiario.cpf}</TableCell>
                        <TableCell>{beneficiario.parentesco}</TableCell>
                        <TableCell>{beneficiario.titular}</TableCell>
                        <TableCell>{beneficiario.plano}</TableCell>
                        <TableCell>{beneficiario.ultimaUtilizacao}</TableCell>
                        <TableCell className="text-right">
                          <Button variant="destructive" size="sm">
                            <UserMinusIcon className="h-4 w-4" />
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>

                <div className="flex justify-between items-center pt-4 border-t">
                  <div className="space-y-2">
                    <Label htmlFor="observacoes">Observações da Exclusão</Label>
                    <Textarea
                      id="observacoes"
                      placeholder="Descreva o motivo detalhado da exclusão..."
                      rows={3}
                      className="w-96"
                    />
                  </div>
                  <div className="flex gap-2">
                    <Button variant="outline">Cancelar</Button>
                    <Button variant="destructive">
                      <UserMinusIcon className="h-4 w-4 mr-2" />
                      Solicitar Exclusão
                    </Button>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
