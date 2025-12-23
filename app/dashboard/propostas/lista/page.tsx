"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { SearchIcon, FilterIcon, EyeIcon, EditIcon, PlusIcon } from "lucide-react"

interface Proposta {
  id: number
  nome_proponente: string
  cpf_cnpj_proponente: string
  nome_empresa: string
  numero_funcionarios: string
  tipo_plano: string
  valor_proposto: number
  status: string
  data_submissao: string
}

const getStatusBadge = (status: string) => {
  const statusConfig = {
    Pendente: { variant: "secondary" as const, className: "bg-yellow-100 text-yellow-800 border-yellow-200" },
    Aprovada: { variant: "secondary" as const, className: "bg-green-100 text-green-800 border-green-200" },
    "Em Análise": { variant: "secondary" as const, className: "bg-blue-100 text-blue-800 border-blue-200" },
    Rejeitada: { variant: "secondary" as const, className: "bg-red-100 text-red-800 border-red-200" },
  }

  const config = statusConfig[status as keyof typeof statusConfig] || statusConfig["Pendente"]
  return (
    <Badge variant={config.variant} className={config.className}>
      {status}
    </Badge>
  )
}

export default function ListaPropostasPage() {
  const router = useRouter()
  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState("todos")
  const [propostas, setPropostas] = useState<Proposta[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const fetchPropostas = async () => {
      try {
        const params = new URLSearchParams()
        if (statusFilter !== "todos") {
          params.append("status", statusFilter.toLowerCase())
        }
        if (searchTerm) {
          params.append("search", searchTerm)
        }

        const response = await fetch(`/api/propostas?${params.toString()}`)
        if (!response.ok) {
          throw new Error("Erro ao carregar propostas")
        }

        const data = await response.json()
        setPropostas(data)
      } catch (error) {
        console.error("[v0] Erro ao carregar propostas:", error)
      } finally {
        setIsLoading(false)
      }
    }

    fetchPropostas()
  }, [statusFilter, searchTerm])

  const filteredPropostas = propostas

  const handleNovaProposta = () => {
    router.push("/dashboard/propostas/nova")
  }

  const handleViewProposta = (id: string) => {
    router.push(`/dashboard/propostas/analise?id=${id}`)
  }

  return (
    <div className="flex-1 space-y-6 p-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-slate-900">Lista de Propostas</h1>
          <p className="text-slate-600">Gerencie todas as propostas de planos de saúde</p>
        </div>
        <Button className="bg-blue-600 hover:bg-blue-700" onClick={handleNovaProposta}>
          <PlusIcon className="w-4 h-4 mr-2" />
          Nova Proposta
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Filtros e Busca</CardTitle>
          <CardDescription>Use os filtros para encontrar propostas específicas</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex gap-4 items-end">
            <div className="flex-1">
              <div className="relative">
                <SearchIcon className="absolute left-3 top-3 h-4 w-4 text-slate-400" />
                <Input
                  placeholder="Buscar por empresa, proponente ou ID..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            <div className="w-48">
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger>
                  <FilterIcon className="w-4 h-4 mr-2" />
                  <SelectValue placeholder="Status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="todos">Todos os Status</SelectItem>
                  <SelectItem value="Pendente">Pendente</SelectItem>
                  <SelectItem value="Em Análise">Em Análise</SelectItem>
                  <SelectItem value="Aprovada">Aprovada</SelectItem>
                  <SelectItem value="Rejeitada">Rejeitada</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Propostas ({filteredPropostas.length})</CardTitle>
          <CardDescription>Lista completa de propostas cadastradas</CardDescription>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="flex justify-center items-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>ID</TableHead>
                  <TableHead>Empresa</TableHead>
                  <TableHead>Proponente</TableHead>
                  <TableHead>Tipo de Plano</TableHead>
                  <TableHead>Funcionários</TableHead>
                  <TableHead>Valor</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Data</TableHead>
                  <TableHead>Ações</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredPropostas.map((proposta) => (
                  <TableRow key={proposta.id}>
                    <TableCell className="font-medium">PROP-{String(proposta.id).padStart(3, "0")}</TableCell>
                    <TableCell>{proposta.nome_empresa || "-"}</TableCell>
                    <TableCell>{proposta.nome_proponente}</TableCell>
                    <TableCell>{proposta.tipo_plano}</TableCell>
                    <TableCell>{proposta.numero_funcionarios || "-"}</TableCell>
                    <TableCell className="font-medium">
                      R$ {proposta.valor_proposto.toLocaleString("pt-BR", { minimumFractionDigits: 2 })}
                    </TableCell>
                    <TableCell>{getStatusBadge(proposta.status)}</TableCell>
                    <TableCell>{new Date(proposta.data_submissao).toLocaleDateString("pt-BR")}</TableCell>
                    <TableCell>
                      <div className="flex gap-2">
                        <Button variant="ghost" size="sm" onClick={() => handleViewProposta(String(proposta.id))}>
                          <EyeIcon className="w-4 h-4" />
                        </Button>
                        <Button variant="ghost" size="sm" onClick={() => handleViewProposta(String(proposta.id))}>
                          <EditIcon className="w-4 h-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
