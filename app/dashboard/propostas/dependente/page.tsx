"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { UserPlusIcon, TrashIcon, EditIcon, FileTextIcon } from "lucide-react"

export default function DependentePage() {
  const [selectedTitular, setSelectedTitular] = useState("")
  const [dependentes, setDependentes] = useState([
    {
      id: 1,
      nome: "Maria Silva Santos",
      parentesco: "Cônjuge",
      cpf: "123.456.789-01",
      dataNascimento: "15/03/1985",
      idade: 39,
      status: "Ativo",
    },
    {
      id: 2,
      nome: "João Silva Santos",
      parentesco: "Filho",
      cpf: "987.654.321-09",
      dataNascimento: "22/08/2010",
      idade: 13,
      status: "Ativo",
    },
  ])

  const [novoDependente, setNovoDependente] = useState({
    nome: "",
    parentesco: "",
    cpf: "",
    rg: "",
    dataNascimento: "",
    sexo: "",
    telefone: "",
    email: "",
  })

  const titulares = [
    { id: "1", nome: "Carlos Silva Santos", cpf: "111.222.333-44", plano: "Plano Premium" },
    { id: "2", nome: "Ana Maria Oliveira", cpf: "555.666.777-88", plano: "Plano Básico" },
    { id: "3", nome: "Roberto Costa Lima", cpf: "999.888.777-66", plano: "Plano Intermediário" },
  ]

  const handleInputChange = (field: string, value: string) => {
    setNovoDependente((prev) => ({ ...prev, [field]: value }))
  }

  const adicionarDependente = () => {
    if (novoDependente.nome && novoDependente.parentesco && novoDependente.cpf) {
      const novoId = Math.max(...dependentes.map((d) => d.id)) + 1
      const idade = new Date().getFullYear() - new Date(novoDependente.dataNascimento).getFullYear()

      setDependentes((prev) => [
        ...prev,
        {
          id: novoId,
          nome: novoDependente.nome,
          parentesco: novoDependente.parentesco,
          cpf: novoDependente.cpf,
          dataNascimento: new Date(novoDependente.dataNascimento).toLocaleDateString("pt-BR"),
          idade,
          status: "Ativo",
        },
      ])

      setNovoDependente({
        nome: "",
        parentesco: "",
        cpf: "",
        rg: "",
        dataNascimento: "",
        sexo: "",
        telefone: "",
        email: "",
      })
    }
  }

  const removerDependente = (id: number) => {
    setDependentes((prev) => prev.filter((d) => d.id !== id))
  }

  return (
    <div className="flex-1 space-y-6 p-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-gray-900">Proposta - Dependentes</h1>
          <p className="text-gray-600">Cadastro de dependentes para beneficiários titulares</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline">
            <FileTextIcon className="h-4 w-4 mr-2" />
            Imprimir Lista
          </Button>
          <Button>
            <UserPlusIcon className="h-4 w-4 mr-2" />
            Salvar Alterações
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-1">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Selecionar Titular</CardTitle>
              <CardDescription>Escolha o beneficiário titular para adicionar dependentes</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="titular">Beneficiário Titular</Label>
                <Select value={selectedTitular} onValueChange={setSelectedTitular}>
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione o titular" />
                  </SelectTrigger>
                  <SelectContent>
                    {titulares.map((titular) => (
                      <SelectItem key={titular.id} value={titular.id}>
                        <div className="flex flex-col">
                          <span className="font-medium">{titular.nome}</span>
                          <span className="text-xs text-gray-500">
                            {titular.cpf} - {titular.plano}
                          </span>
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {selectedTitular && (
                <div className="p-3 bg-emerald-50 rounded-lg">
                  <h4 className="font-medium text-emerald-800">Titular Selecionado</h4>
                  <p className="text-sm text-emerald-700">{titulares.find((t) => t.id === selectedTitular)?.nome}</p>
                  <p className="text-xs text-emerald-600">{titulares.find((t) => t.id === selectedTitular)?.plano}</p>
                </div>
              )}

              <div className="space-y-2">
                <h4 className="font-medium">Resumo de Dependentes</h4>
                <div className="grid grid-cols-2 gap-2">
                  <div className="text-center p-2 bg-blue-50 rounded">
                    <div className="text-2xl font-bold text-blue-600">{dependentes.length}</div>
                    <div className="text-xs text-blue-600">Total</div>
                  </div>
                  <div className="text-center p-2 bg-green-50 rounded">
                    <div className="text-2xl font-bold text-green-600">
                      {dependentes.filter((d) => d.status === "Ativo").length}
                    </div>
                    <div className="text-xs text-green-600">Ativos</div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="lg:col-span-2 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Adicionar Novo Dependente</CardTitle>
              <CardDescription>Preencha os dados do dependente</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="nome">Nome Completo *</Label>
                  <Input
                    id="nome"
                    placeholder="Digite o nome completo"
                    value={novoDependente.nome}
                    onChange={(e) => handleInputChange("nome", e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="parentesco">Parentesco *</Label>
                  <Select
                    value={novoDependente.parentesco}
                    onValueChange={(value) => handleInputChange("parentesco", value)}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Selecione" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="conjuge">Cônjuge</SelectItem>
                      <SelectItem value="filho">Filho(a)</SelectItem>
                      <SelectItem value="enteado">Enteado(a)</SelectItem>
                      <SelectItem value="pai">Pai</SelectItem>
                      <SelectItem value="mae">Mãe</SelectItem>
                      <SelectItem value="sogro">Sogro(a)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="cpf">CPF *</Label>
                  <Input
                    id="cpf"
                    placeholder="000.000.000-00"
                    value={novoDependente.cpf}
                    onChange={(e) => handleInputChange("cpf", e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="rg">RG</Label>
                  <Input
                    id="rg"
                    placeholder="Digite o RG"
                    value={novoDependente.rg}
                    onChange={(e) => handleInputChange("rg", e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="dataNascimento">Data de Nascimento *</Label>
                  <Input
                    id="dataNascimento"
                    type="date"
                    value={novoDependente.dataNascimento}
                    onChange={(e) => handleInputChange("dataNascimento", e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="sexo">Sexo *</Label>
                  <Select value={novoDependente.sexo} onValueChange={(value) => handleInputChange("sexo", value)}>
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
                  <Input
                    id="telefone"
                    placeholder="(11) 90000-0000"
                    value={novoDependente.telefone}
                    onChange={(e) => handleInputChange("telefone", e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="email">E-mail</Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="email@exemplo.com"
                    value={novoDependente.email}
                    onChange={(e) => handleInputChange("email", e.target.value)}
                  />
                </div>
              </div>
              <div className="flex justify-end">
                <Button onClick={adicionarDependente} disabled={!selectedTitular}>
                  <UserPlusIcon className="h-4 w-4 mr-2" />
                  Adicionar Dependente
                </Button>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Dependentes Cadastrados</CardTitle>
              <CardDescription>Lista de dependentes do titular selecionado</CardDescription>
            </CardHeader>
            <CardContent>
              {dependentes.length > 0 ? (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Nome</TableHead>
                      <TableHead>Parentesco</TableHead>
                      <TableHead>CPF</TableHead>
                      <TableHead>Idade</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead className="text-right">Ações</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {dependentes.map((dependente) => (
                      <TableRow key={dependente.id}>
                        <TableCell className="font-medium">{dependente.nome}</TableCell>
                        <TableCell>{dependente.parentesco}</TableCell>
                        <TableCell>{dependente.cpf}</TableCell>
                        <TableCell>{dependente.idade} anos</TableCell>
                        <TableCell>
                          <Badge variant={dependente.status === "Ativo" ? "default" : "secondary"}>
                            {dependente.status}
                          </Badge>
                        </TableCell>
                        <TableCell className="text-right">
                          <div className="flex justify-end gap-2">
                            <Button variant="outline" size="sm">
                              <EditIcon className="h-4 w-4" />
                            </Button>
                            <Button variant="outline" size="sm" onClick={() => removerDependente(dependente.id)}>
                              <TrashIcon className="h-4 w-4" />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              ) : (
                <div className="text-center py-8 text-gray-500">
                  <UserPlusIcon className="h-12 w-12 mx-auto mb-4 text-gray-300" />
                  <p>Nenhum dependente cadastrado</p>
                  <p className="text-sm">Selecione um titular e adicione dependentes</p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
