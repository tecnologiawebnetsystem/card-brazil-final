"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Input } from "@/components/ui/input"
import {
  CheckCircleIcon,
  EyeIcon,
  FileTextIcon,
  TrendingUpIcon,
  CalendarIcon,
  SearchIcon,
  DownloadIcon,
} from "lucide-react"
import { useToast } from "@/hooks/use-toast"

interface Proposta {
  id: number
  nome_proponente: string
  nome_empresa: string
  tipo_plano: string
  numero_funcionarios: string
  valor_proposto: number
  data_aprovacao: string
  analista_responsavel: string
  contrato_gerado: boolean
  status: string
}

export default function PropostasAprovadasPage() {
  const router = useRouter()
  const { toast } = useToast()
  const [searchTerm, setSearchTerm] = useState("")
  const [isGenerating, setIsGenerating] = useState<string | null>(null)
  const [propostas, setPropostas] = useState<Proposta[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const fetchPropostas = async () => {
      try {
        const response = await fetch("/api/propostas?status=aprovada")
        if (!response.ok) {
          throw new Error("Erro ao carregar propostas")
        }

        const data = await response.json()
        setPropostas(data)
      } catch (error) {
        console.error("[v0] Erro ao carregar propostas aprovadas:", error)
      } finally {
        setIsLoading(false)
      }
    }

    fetchPropostas()
  }, [])

  const filteredPropostas = propostas.filter((proposta) => {
    const searchLower = searchTerm.toLowerCase()
    const id = `PROP-${String(proposta.id).padStart(3, "0")}`
    return (
      id.toLowerCase().includes(searchLower) ||
      (proposta.nome_empresa && proposta.nome_empresa.toLowerCase().includes(searchLower)) ||
      proposta.nome_proponente.toLowerCase().includes(searchLower)
    )
  })

  const valorTotal = propostas.reduce((total, proposta) => total + proposta.valor_proposto, 0)
  const totalFuncionarios = propostas.reduce((total, proposta) => {
    const num = proposta.numero_funcionarios ? Number.parseInt(proposta.numero_funcionarios.split("-")[0]) : 0
    return total + num
  }, 0)
  const contratosGerados = propostas.filter((p) => p.contrato_gerado).length

  const handleViewProposta = (id: string) => {
    router.push(`/dashboard/propostas/analise?id=${id}`)
  }

  const handleGerarContrato = async (id: number) => {
    setIsGenerating(String(id))
    try {
      const response = await fetch(`/api/propostas/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          contrato_gerado: true,
          data_geracao_contrato: new Date().toISOString(),
        }),
      })

      if (!response.ok) {
        throw new Error("Erro ao gerar contrato")
      }

      toast({
        title: "Contrato gerado",
        description: `O contrato da proposta PROP-${String(id).padStart(3, "0")} foi gerado com sucesso`,
      })

      // Recarregar propostas
      const fetchResponse = await fetch("/api/propostas?status=aprovada")
      if (fetchResponse.ok) {
        const data = await fetchResponse.json()
        setPropostas(data)
      }
    } catch (error) {
      console.error("[v0] Erro ao gerar contrato:", error)
      toast({
        title: "Erro ao gerar contrato",
        description: "Ocorreu um erro ao gerar o contrato",
        variant: "destructive",
      })
    } finally {
      setIsGenerating(null)
    }
  }

  const handleDownloadContrato = (id: number) => {
    toast({
      title: "Download iniciado",
      description: `Baixando contrato da proposta PROP-${String(id).padStart(3, "0")}`,
    })
    // Aqui seria o download real do contrato
  }

  return (
    <div className="flex-1 space-y-6 p-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-slate-900">Propostas Aprovadas</h1>
          <p className="text-slate-600">Propostas que foram aprovadas e estão em processo de contratação</p>
        </div>
        <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
          <CheckCircleIcon className="w-4 h-4 mr-1" />
          {propostas.length} Aprovadas
        </Badge>
      </div>

      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Aprovadas</CardTitle>
            <CheckCircleIcon className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">{propostas.length}</div>
            <p className="text-xs text-slate-600">propostas aprovadas</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Valor Total</CardTitle>
            <TrendingUpIcon className="h-4 w-4 text-blue-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-600">
              R$ {valorTotal.toLocaleString("pt-BR", { minimumFractionDigits: 0 })}
            </div>
            <p className="text-xs text-slate-600">em propostas aprovadas</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Contratos Gerados</CardTitle>
            <FileTextIcon className="h-4 w-4 text-purple-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-purple-600">{contratosGerados}</div>
            <p className="text-xs text-slate-600">contratos prontos</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Funcionários</CardTitle>
            <CalendarIcon className="h-4 w-4 text-orange-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-orange-600">{totalFuncionarios}</div>
            <p className="text-xs text-slate-600">total de beneficiários</p>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Lista de Propostas Aprovadas</CardTitle>
              <CardDescription>Propostas aprovadas aguardando geração de contrato</CardDescription>
            </div>
            <div className="relative w-64">
              <SearchIcon className="absolute left-3 top-3 h-4 w-4 text-slate-400" />
              <Input
                placeholder="Buscar proposta..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
          </div>
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
                  <TableHead>Data Aprovação</TableHead>
                  <TableHead>Contrato</TableHead>
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
                    <TableCell className="font-medium text-green-600">
                      R$ {proposta.valor_proposto.toLocaleString("pt-BR", { minimumFractionDigits: 2 })}
                    </TableCell>
                    <TableCell>
                      {proposta.data_aprovacao ? new Date(proposta.data_aprovacao).toLocaleDateString("pt-BR") : "-"}
                    </TableCell>
                    <TableCell>
                      {proposta.contrato_gerado ? (
                        <Badge variant="outline" className="bg-green-100 text-green-800 border-green-200">
                          Gerado
                        </Badge>
                      ) : (
                        <Badge variant="outline" className="bg-yellow-100 text-yellow-800 border-yellow-200">
                          Pendente
                        </Badge>
                      )}
                    </TableCell>
                    <TableCell>
                      <div className="flex gap-2">
                        <Button
                          variant="ghost"
                          size="sm"
                          className="text-blue-600 hover:text-blue-700 hover:bg-blue-50"
                          onClick={() => handleViewProposta(String(proposta.id))}
                        >
                          <EyeIcon className="w-4 h-4" />
                        </Button>
                        {proposta.contrato_gerado ? (
                          <Button
                            variant="ghost"
                            size="sm"
                            className="text-purple-600 hover:text-purple-700 hover:bg-purple-50"
                            onClick={() => handleDownloadContrato(proposta.id)}
                          >
                            <DownloadIcon className="w-4 h-4" />
                          </Button>
                        ) : (
                          <Button
                            variant="ghost"
                            size="sm"
                            className="text-green-600 hover:text-green-700 hover:bg-green-50"
                            onClick={() => handleGerarContrato(proposta.id)}
                            disabled={isGenerating === String(proposta.id)}
                          >
                            <FileTextIcon className="w-4 h-4" />
                          </Button>
                        )}
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
