"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

export default function ConsultaPessoasPage() {
  const [searchTerm, setSearchTerm] = useState("")
  const [filterType, setFilterType] = useState("todos")
  const [filterStatus, setFilterStatus] = useState("todos")

  const mockPessoas = [
    {
      id: "1",
      nome: "João Silva Santos",
      documento: "123.456.789-00",
      tipo: "Física",
      status: "Ativo",
      operadora: "Unimed SP",
      plano: "Enfermaria",
      ultimaMovimentacao: "2024-01-15",
    },
    {
      id: "2",
      nome: "Empresa ABC Ltda",
      documento: "12.345.678/0001-90",
      tipo: "Jurídica",
      status: "Ativo",
      operadora: "Bradesco Saúde",
      plano: "Apartamento",
      ultimaMovimentacao: "2024-01-10",
    },
    {
      id: "3",
      nome: "Maria Oliveira Costa",
      documento: "987.654.321-00",
      tipo: "Física",
      status: "Suspenso",
      operadora: "SulAmérica",
      plano: "Enfermaria",
      ultimaMovimentacao: "2023-12-20",
    },
  ]

  const filteredPessoas = mockPessoas.filter((pessoa) => {
    const matchesSearch =
      pessoa.nome.toLowerCase().includes(searchTerm.toLowerCase()) || pessoa.documento.includes(searchTerm)
    const matchesType = filterType === "todos" || pessoa.tipo === filterType
    const matchesStatus = filterStatus === "todos" || pessoa.status === filterStatus

    return matchesSearch && matchesType && matchesStatus
  })

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-6 py-6">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-2xl font-bold text-foreground">Consulta de Pessoas</h1>
            <p className="text-muted-foreground">Consulte informações detalhadas de pessoas físicas e jurídicas</p>
          </div>
        </div>

        {/* Métricas */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 bg-emerald-700 text-white rounded-lg flex items-center justify-center">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                    />
                  </svg>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Total de Pessoas</p>
                  <p className="text-xl font-bold text-emerald-700">2,847</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 bg-blue-600 text-white rounded-lg flex items-center justify-center">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                    />
                  </svg>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Pessoas Físicas</p>
                  <p className="text-xl font-bold text-blue-600">2,654</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 bg-purple-600 text-white rounded-lg flex items-center justify-center">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"
                    />
                  </svg>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Pessoas Jurídicas</p>
                  <p className="text-xl font-bold text-purple-600">193</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 bg-green-600 text-white rounded-lg flex items-center justify-center">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                    />
                  </svg>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Ativos</p>
                  <p className="text-xl font-bold text-green-600">2,701</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Filtros de Busca */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle>Filtros de Consulta</CardTitle>
            <CardDescription>Use os filtros para encontrar pessoas específicas</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div>
                <Label htmlFor="search">Nome ou Documento</Label>
                <Input
                  id="search"
                  placeholder="Digite nome ou CPF/CNPJ..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
              <div>
                <Label htmlFor="type">Tipo de Pessoa</Label>
                <Select value={filterType} onValueChange={setFilterType}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="todos">Todos</SelectItem>
                    <SelectItem value="Física">Pessoa Física</SelectItem>
                    <SelectItem value="Jurídica">Pessoa Jurídica</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="status">Status</Label>
                <Select value={filterStatus} onValueChange={setFilterStatus}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="todos">Todos</SelectItem>
                    <SelectItem value="Ativo">Ativo</SelectItem>
                    <SelectItem value="Suspenso">Suspenso</SelectItem>
                    <SelectItem value="Cancelado">Cancelado</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="flex items-end">
                <Button className="w-full">
                  <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="m21 21-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                    />
                  </svg>
                  Consultar
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Resultados */}
        <Card>
          <CardHeader>
            <CardTitle>Resultados da Consulta</CardTitle>
            <CardDescription>{filteredPessoas.length} pessoa(s) encontrada(s)</CardDescription>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Nome/Razão Social</TableHead>
                  <TableHead>Documento</TableHead>
                  <TableHead>Tipo</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Operadora</TableHead>
                  <TableHead>Plano</TableHead>
                  <TableHead>Última Movimentação</TableHead>
                  <TableHead className="text-right">Ações</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredPessoas.map((pessoa) => (
                  <TableRow key={pessoa.id}>
                    <TableCell className="font-medium">{pessoa.nome}</TableCell>
                    <TableCell>{pessoa.documento}</TableCell>
                    <TableCell>
                      <Badge variant="outline">{pessoa.tipo}</Badge>
                    </TableCell>
                    <TableCell>
                      <Badge variant={pessoa.status === "Ativo" ? "default" : "secondary"}>{pessoa.status}</Badge>
                    </TableCell>
                    <TableCell>{pessoa.operadora}</TableCell>
                    <TableCell>{pessoa.plano}</TableCell>
                    <TableCell>{new Date(pessoa.ultimaMovimentacao).toLocaleDateString("pt-BR")}</TableCell>
                    <TableCell className="text-right">
                      <Button variant="ghost" size="sm">
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                          />
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
                          />
                        </svg>
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
