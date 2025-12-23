"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

export default function ConsultaOperadorasPage() {
  const [searchTerm, setSearchTerm] = useState("")
  const [filterNatureza, setFilterNatureza] = useState("todas")
  const [filterStatus, setFilterStatus] = useState("todos")

  const mockOperadoras = [
    {
      id: "1",
      codigo: "ADM001-OP001",
      nome: "Unimed São Paulo",
      natureza: "Cooperativa Médica",
      registroANS: "12345-6",
      status: "Ativo",
      segurados: 1250,
      receita: 2400000,
      ultimaAtualizacao: "2024-01-15",
    },
    {
      id: "2",
      codigo: "ADM001-OP002",
      nome: "Bradesco Saúde",
      natureza: "Seguradora",
      registroANS: "78901-2",
      status: "Ativo",
      segurados: 890,
      receita: 1800000,
      ultimaAtualizacao: "2024-01-14",
    },
    {
      id: "3",
      codigo: "ADM001-OP003",
      nome: "SulAmérica Saúde",
      natureza: "Seguradora",
      registroANS: "34567-8",
      status: "Suspenso",
      segurados: 650,
      receita: 1200000,
      ultimaAtualizacao: "2024-01-10",
    },
  ]

  const filteredOperadoras = mockOperadoras.filter((op) => {
    const matchesSearch =
      op.nome.toLowerCase().includes(searchTerm.toLowerCase()) ||
      op.codigo.toLowerCase().includes(searchTerm.toLowerCase()) ||
      op.registroANS.includes(searchTerm)
    const matchesNatureza = filterNatureza === "todas" || op.natureza === filterNatureza
    const matchesStatus = filterStatus === "todos" || op.status === filterStatus

    return matchesSearch && matchesNatureza && matchesStatus
  })

  const totalSegurados = mockOperadoras.reduce((sum, op) => sum + op.segurados, 0)
  const totalReceita = mockOperadoras.reduce((sum, op) => sum + op.receita, 0)
  const operadorasAtivas = mockOperadoras.filter((op) => op.status === "Ativo").length

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-6 py-6">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-2xl font-bold text-foreground">Consulta de Operadoras</h1>
            <p className="text-muted-foreground">Consulte informações detalhadas das operadoras de saúde</p>
          </div>
        </div>

        {/* Métricas das Operadoras */}
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
                      d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"
                    />
                  </svg>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Total de Operadoras</p>
                  <p className="text-xl font-bold text-emerald-700">{mockOperadoras.length}</p>
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
                  <p className="text-sm text-muted-foreground">Operadoras Ativas</p>
                  <p className="text-xl font-bold text-green-600">{operadorasAtivas}</p>
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
                  <p className="text-sm text-muted-foreground">Total de Segurados</p>
                  <p className="text-xl font-bold text-blue-600">{totalSegurados.toLocaleString("pt-BR")}</p>
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
                      d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                    />
                  </svg>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Receita Total</p>
                  <p className="text-xl font-bold text-purple-600">R$ {(totalReceita / 1000000).toFixed(1)}M</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Filtros de Busca */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle>Filtros de Consulta</CardTitle>
            <CardDescription>Use os filtros para encontrar operadoras específicas</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div>
                <Label htmlFor="search">Nome, Código ou Registro ANS</Label>
                <Input
                  id="search"
                  placeholder="Digite para buscar..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
              <div>
                <Label htmlFor="natureza">Natureza</Label>
                <Select value={filterNatureza} onValueChange={setFilterNatureza}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="todas">Todas</SelectItem>
                    <SelectItem value="Cooperativa Médica">Cooperativa Médica</SelectItem>
                    <SelectItem value="Seguradora">Seguradora</SelectItem>
                    <SelectItem value="Medicina de Grupo">Medicina de Grupo</SelectItem>
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
            <CardTitle>Operadoras Encontradas</CardTitle>
            <CardDescription>{filteredOperadoras.length} operadora(s) encontrada(s)</CardDescription>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Código</TableHead>
                  <TableHead>Nome</TableHead>
                  <TableHead>Natureza</TableHead>
                  <TableHead>Registro ANS</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Segurados</TableHead>
                  <TableHead>Receita Mensal</TableHead>
                  <TableHead className="text-right">Ações</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredOperadoras.map((operadora) => (
                  <TableRow key={operadora.id}>
                    <TableCell className="font-medium">{operadora.codigo}</TableCell>
                    <TableCell>{operadora.nome}</TableCell>
                    <TableCell>
                      <Badge variant="outline">{operadora.natureza}</Badge>
                    </TableCell>
                    <TableCell>{operadora.registroANS}</TableCell>
                    <TableCell>
                      <Badge variant={operadora.status === "Ativo" ? "default" : "secondary"}>{operadora.status}</Badge>
                    </TableCell>
                    <TableCell>{operadora.segurados.toLocaleString("pt-BR")}</TableCell>
                    <TableCell>R$ {(operadora.receita / 1000000).toFixed(1)}M</TableCell>
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
