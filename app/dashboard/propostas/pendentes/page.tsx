"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { ClockIcon, EyeIcon, AlertCircleIcon, CalendarIcon } from "lucide-react"

interface Proposta {
  id: number
  nome_proponente: string
  nome_empresa: string
  tipo_plano: string
  numero_funcionarios: string
  valor_proposto: number
  data_submissao: string
  status: string
}

const getPrioridadeBadge = (prioridade: string) => {
  const config = {
    Alta: { className: "bg-red-100 text-red-800 border-red-200" },
    Média: { className: "bg-yellow-100 text-yellow-800 border-yellow-200" },
    Baixa: { className: "bg-green-100 text-green-800 border-green-200" },
  }

  const badgeConfig = config[prioridade as keyof typeof config] || config["Média"]
  return (
    <Badge variant="outline" className={badgeConfig.className}>
      {prioridade}
    </Badge>
  )
}

export default function PropostasPendentesPage() {
  const router = useRouter()
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
        console.error("[v0] Erro ao carregar propostas pendentes:", error)
      } finally {
        setIsLoading(false)
      }
    }

    fetchPropostas()
  }, [])

  const handleAnalisar = (id: string) => {
    router.push(`/dashboard/propostas/analise?id=${id}`)
  }

  const calcularDiasPendente = (dataSubmissao: string) => {
    const hoje = new Date()
    const data = new Date(dataSubmissao)
    const diffTime = Math.abs(hoje.getTime() - data.getTime())
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))
    return diffDays
  }

  const getDiasPendenteBadge = (dias: number) => {
    if (dias <= 2)
      return (
        <Badge variant="outline" className="bg-green-100 text-green-800 border-green-200">
          {dias} dias
        </Badge>
      )
    if (dias <= 5)
      return (
        <Badge variant="outline" className="bg-yellow-100 text-yellow-800 border-yellow-200">
          {dias} dias
        </Badge>
      )
    return (
      <Badge variant="outline" className="bg-red-100 text-red-800 border-red-200">
        {dias} dias
      </Badge>
    )
  }

  const totalPendentes = propostas.length
  const tempoMedio =
    propostas.length > 0
      ? Math.round(propostas.reduce((acc, p) => acc + calcularDiasPendente(p.data_submissao), 0) / propostas.length)
      : 0
  const altaPrioridade = propostas.filter((p) => calcularDiasPendente(p.data_submissao) > 5).length

  return (
    <div className="flex-1 space-y-6 p-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-slate-900">Propostas Pendentes</h1>
          <p className="text-slate-600">Propostas aguardando análise e aprovação</p>
        </div>
        <Badge variant="outline" className="bg-orange-50 text-orange-700 border-orange-200">
          <ClockIcon className="w-4 h-4 mr-1" />
          {totalPendentes} Pendentes
        </Badge>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Pendentes</CardTitle>
            <ClockIcon className="h-4 w-4 text-orange-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-orange-600">{totalPendentes}</div>
            <p className="text-xs text-slate-600">propostas aguardando</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Tempo Médio</CardTitle>
            <CalendarIcon className="h-4 w-4 text-blue-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-600">{tempoMedio} dias</div>
            <p className="text-xs text-slate-600">tempo médio pendente</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Alta Prioridade</CardTitle>
            <AlertCircleIcon className="h-4 w-4 text-red-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-600">{altaPrioridade}</div>
            <p className="text-xs text-slate-600">
              proposta{altaPrioridade !== 1 ? "s" : ""} urgente{altaPrioridade !== 1 ? "s" : ""}
            </p>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Lista de Propostas Pendentes</CardTitle>
          <CardDescription>Propostas que necessitam de análise imediata</CardDescription>
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
                  <TableHead>Tempo Pendente</TableHead>
                  <TableHead>Ações</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {propostas.map((proposta) => {
                  const diasPendente = calcularDiasPendente(proposta.data_submissao)
                  return (
                    <TableRow key={proposta.id}>
                      <TableCell className="font-medium">PROP-{String(proposta.id).padStart(3, "0")}</TableCell>
                      <TableCell>{proposta.nome_empresa || "-"}</TableCell>
                      <TableCell>{proposta.nome_proponente}</TableCell>
                      <TableCell>{proposta.tipo_plano}</TableCell>
                      <TableCell>{proposta.numero_funcionarios || "-"}</TableCell>
                      <TableCell className="font-medium">
                        R$ {proposta.valor_proposto.toLocaleString("pt-BR", { minimumFractionDigits: 2 })}
                      </TableCell>
                      <TableCell>{getDiasPendenteBadge(diasPendente)}</TableCell>
                      <TableCell>
                        <Button
                          variant="ghost"
                          size="sm"
                          className="text-blue-600 hover:text-blue-700 hover:bg-blue-50"
                          onClick={() => handleAnalisar(String(proposta.id))}
                        >
                          <EyeIcon className="w-4 h-4 mr-1" />
                          Analisar
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
