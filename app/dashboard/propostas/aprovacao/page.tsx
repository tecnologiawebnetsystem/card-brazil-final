"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Checkbox } from "@/components/ui/checkbox"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { CheckCircleIcon, XCircleIcon, EyeIcon, ClockIcon, AlertCircleIcon, CheckIcon } from "lucide-react"
import { useToast } from "@/hooks/use-toast"

interface Proposta {
  id: number
  nome_proponente: string
  nome_empresa: string
  tipo_plano: string
  numero_funcionarios: string
  valor_proposto: number
  data_submissao: string
  status: string
  score_risco?: number
}

export default function AprovacaoPropostasPage() {
  const router = useRouter()
  const { toast } = useToast()
  const [selectedPropostas, setSelectedPropostas] = useState<number[]>([])
  const [isProcessing, setIsProcessing] = useState(false)
  const [propostas, setPropostas] = useState<Proposta[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const fetchPropostas = async () => {
      try {
        const response = await fetch("/api/propostas?status=pendente")
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
  }, [])

  const handleSelectProposta = (id: number) => {
    setSelectedPropostas((prev) => (prev.includes(id) ? prev.filter((p) => p !== id) : [...prev, id]))
  }

  const handleSelectAll = () => {
    if (selectedPropostas.length === propostas.length) {
      setSelectedPropostas([])
    } else {
      setSelectedPropostas(propostas.map((p) => p.id))
    }
  }

  const handleAprovarSelecionadas = async () => {
    if (selectedPropostas.length === 0) {
      toast({
        title: "Nenhuma proposta selecionada",
        description: "Selecione ao menos uma proposta para aprovar",
        variant: "destructive",
      })
      return
    }

    setIsProcessing(true)
    try {
      // Aprovar cada proposta selecionada
      const promises = selectedPropostas.map((id) =>
        fetch(`/api/propostas/${id}`, {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            status: "aprovada",
            data_aprovacao: new Date().toISOString(),
            parecer_analise: "Aprovação em lote",
          }),
        }),
      )

      await Promise.all(promises)

      toast({
        title: "Propostas aprovadas",
        description: `${selectedPropostas.length} proposta(s) aprovada(s) com sucesso`,
      })

      setSelectedPropostas([])
      // Recarregar propostas
      const response = await fetch("/api/propostas?status=pendente")
      if (response.ok) {
        const data = await response.json()
        setPropostas(data)
      }
    } catch (error) {
      console.error("[v0] Erro ao aprovar propostas:", error)
      toast({
        title: "Erro ao aprovar",
        description: "Ocorreu um erro ao aprovar as propostas",
        variant: "destructive",
      })
    } finally {
      setIsProcessing(false)
    }
  }

  const handleRejeitarSelecionadas = async () => {
    if (selectedPropostas.length === 0) {
      toast({
        title: "Nenhuma proposta selecionada",
        description: "Selecione ao menos uma proposta para rejeitar",
        variant: "destructive",
      })
      return
    }

    setIsProcessing(true)
    try {
      // Rejeitar cada proposta selecionada
      const promises = selectedPropostas.map((id) =>
        fetch(`/api/propostas/${id}`, {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            status: "rejeitada",
            data_analise: new Date().toISOString(),
            parecer_analise: "Rejeição em lote",
          }),
        }),
      )

      await Promise.all(promises)

      toast({
        title: "Propostas rejeitadas",
        description: `${selectedPropostas.length} proposta(s) rejeitada(s)`,
      })

      setSelectedPropostas([])
      // Recarregar propostas
      const response = await fetch("/api/propostas?status=pendente")
      if (response.ok) {
        const data = await response.json()
        setPropostas(data)
      }
    } catch (error) {
      console.error("[v0] Erro ao rejeitar propostas:", error)
      toast({
        title: "Erro ao rejeitar",
        description: "Ocorreu um erro ao rejeitar as propostas",
        variant: "destructive",
      })
    } finally {
      setIsProcessing(false)
    }
  }

  const handleViewDetalhes = (id: number) => {
    router.push(`/dashboard/propostas/analise?id=${id}`)
  }

  const calcularDiasPendente = (dataSubmissao: string) => {
    const hoje = new Date()
    const data = new Date(dataSubmissao)
    const diffTime = Math.abs(hoje.getTime() - data.getTime())
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))
    return diffDays
  }

  const getPrioridadeBadge = (diasPendente: number) => {
    if (diasPendente > 5) {
      return (
        <Badge variant="outline" className="bg-red-100 text-red-800 border-red-200">
          Alta
        </Badge>
      )
    }
    if (diasPendente > 2) {
      return (
        <Badge variant="outline" className="bg-yellow-100 text-yellow-800 border-yellow-200">
          Média
        </Badge>
      )
    }
    return (
      <Badge variant="outline" className="bg-green-100 text-green-800 border-green-200">
        Baixa
      </Badge>
    )
  }

  const getScoreBadge = (score: number) => {
    if (score >= 80)
      return (
        <Badge variant="outline" className="bg-green-100 text-green-800 border-green-200">
          {score}
        </Badge>
      )
    if (score >= 70)
      return (
        <Badge variant="outline" className="bg-yellow-100 text-yellow-800 border-yellow-200">
          {score}
        </Badge>
      )
    return (
      <Badge variant="outline" className="bg-red-100 text-red-800 border-red-200">
        {score}
      </Badge>
    )
  }

  const altaPrioridade = propostas.filter((p) => calcularDiasPendente(p.data_submissao) > 5).length

  return (
    <div className="flex-1 space-y-6 p-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-slate-900">Aprovação de Propostas</h1>
          <p className="text-slate-600">Aprovação rápida em lote de propostas pendentes</p>
        </div>
        <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200">
          <ClockIcon className="w-4 h-4 mr-1" />
          {propostas.length} Aguardando
        </Badge>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Aguardando Aprovação</CardTitle>
            <ClockIcon className="h-4 w-4 text-blue-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-600">{propostas.length}</div>
            <p className="text-xs text-slate-600">propostas pendentes</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Selecionadas</CardTitle>
            <CheckIcon className="h-4 w-4 text-purple-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-purple-600">{selectedPropostas.length}</div>
            <p className="text-xs text-slate-600">para processar</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Alta Prioridade</CardTitle>
            <AlertCircleIcon className="h-4 w-4 text-red-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-600">{altaPrioridade}</div>
            <p className="text-xs text-slate-600">requer atenção</p>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Propostas para Aprovação</CardTitle>
              <CardDescription>Selecione as propostas e aprove ou rejeite em lote</CardDescription>
            </div>
            <div className="flex gap-2">
              <Button
                variant="outline"
                onClick={handleRejeitarSelecionadas}
                disabled={isProcessing || selectedPropostas.length === 0}
                className="border-red-200 text-red-700 hover:bg-red-50 bg-transparent"
              >
                <XCircleIcon className="w-4 h-4 mr-2" />
                Rejeitar Selecionadas
              </Button>
              <Button
                onClick={handleAprovarSelecionadas}
                disabled={isProcessing || selectedPropostas.length === 0}
                className="bg-green-600 hover:bg-green-700"
              >
                <CheckCircleIcon className="w-4 h-4 mr-2" />
                Aprovar Selecionadas
              </Button>
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
                  <TableHead className="w-12">
                    <Checkbox
                      checked={selectedPropostas.length === propostas.length && propostas.length > 0}
                      onCheckedChange={handleSelectAll}
                    />
                  </TableHead>
                  <TableHead>ID</TableHead>
                  <TableHead>Empresa</TableHead>
                  <TableHead>Proponente</TableHead>
                  <TableHead>Tipo de Plano</TableHead>
                  <TableHead>Funcionários</TableHead>
                  <TableHead>Valor</TableHead>
                  <TableHead>Score</TableHead>
                  <TableHead>Prioridade</TableHead>
                  <TableHead>Ações</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {propostas.map((proposta) => {
                  const diasPendente = calcularDiasPendente(proposta.data_submissao)
                  const score = proposta.score_risco || Math.floor(Math.random() * 30) + 70
                  return (
                    <TableRow key={proposta.id}>
                      <TableCell>
                        <Checkbox
                          checked={selectedPropostas.includes(proposta.id)}
                          onCheckedChange={() => handleSelectProposta(proposta.id)}
                        />
                      </TableCell>
                      <TableCell className="font-medium">PROP-{String(proposta.id).padStart(3, "0")}</TableCell>
                      <TableCell>{proposta.nome_empresa || "-"}</TableCell>
                      <TableCell>{proposta.nome_proponente}</TableCell>
                      <TableCell>{proposta.tipo_plano}</TableCell>
                      <TableCell>{proposta.numero_funcionarios || "-"}</TableCell>
                      <TableCell className="font-medium">
                        R$ {proposta.valor_proposto.toLocaleString("pt-BR", { minimumFractionDigits: 2 })}
                      </TableCell>
                      <TableCell>{getScoreBadge(score)}</TableCell>
                      <TableCell>{getPrioridadeBadge(diasPendente)}</TableCell>
                      <TableCell>
                        <Button
                          variant="ghost"
                          size="sm"
                          className="text-blue-600 hover:text-blue-700 hover:bg-blue-50"
                          onClick={() => handleViewDetalhes(proposta.id)}
                        >
                          <EyeIcon className="w-4 h-4" />
                        </Button>
                      </TableCell>
                    </TableRow>
                  )
                })}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
