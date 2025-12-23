"use client"

import { useState, useEffect } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Separator } from "@/components/ui/separator"
import {
  CheckCircleIcon,
  XCircleIcon,
  ClockIcon,
  UserIcon,
  BuildingIcon,
  FileTextIcon,
  ArrowLeftIcon,
} from "lucide-react"
import { useToast } from "@/hooks/use-toast"

interface Proposta {
  id: number
  nome_proponente: string
  cpf_cnpj_proponente: string
  email_proponente: string
  telefone_proponente: string
  nome_empresa: string
  numero_funcionarios: string
  tipo_plano: string
  valor_proposto: number
  observacoes: string
  status: string
  data_submissao: string
}

export default function AnalisePropostaPage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const { toast } = useToast()
  const [parecer, setParecer] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [proposta, setProposta] = useState<Proposta | null>(null)
  const [isLoadingProposta, setIsLoadingProposta] = useState(true)

  useEffect(() => {
    const fetchProposta = async () => {
      const id = searchParams.get("id")
      if (!id) {
        toast({
          title: "ID não fornecido",
          description: "Nenhum ID de proposta foi fornecido",
          variant: "destructive",
        })
        router.push("/dashboard/propostas/pendentes")
        return
      }

      try {
        const response = await fetch(`/api/propostas/${id}`)
        if (!response.ok) {
          throw new Error("Erro ao carregar proposta")
        }

        const data = await response.json()
        setProposta(data)
      } catch (error) {
        console.error("[v0] Erro ao carregar proposta:", error)
        toast({
          title: "Erro ao carregar",
          description: "Não foi possível carregar a proposta",
          variant: "destructive",
        })
      } finally {
        setIsLoadingProposta(false)
      }
    }

    fetchProposta()
  }, [searchParams, router, toast])

  const handleAprovar = async () => {
    if (!parecer.trim()) {
      toast({
        title: "Parecer obrigatório",
        description: "Por favor, adicione um parecer antes de aprovar",
        variant: "destructive",
      })
      return
    }

    if (!proposta) return

    setIsLoading(true)
    try {
      const response = await fetch(`/api/propostas/${proposta.id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          status: "aprovada",
          parecer_analise: parecer,
          data_analise: new Date().toISOString(),
        }),
      })

      if (!response.ok) {
        throw new Error("Erro ao aprovar proposta")
      }

      toast({
        title: "Proposta aprovada",
        description: `A proposta PROP-${String(proposta.id).padStart(3, "0")} foi aprovada com sucesso`,
      })

      router.push("/dashboard/propostas/aprovadas")
    } catch (error) {
      console.error("[v0] Erro ao aprovar proposta:", error)
      toast({
        title: "Erro ao aprovar",
        description: "Ocorreu um erro ao aprovar a proposta",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  const handleRejeitar = async () => {
    if (!parecer.trim()) {
      toast({
        title: "Parecer obrigatório",
        description: "Por favor, adicione um parecer antes de rejeitar",
        variant: "destructive",
      })
      return
    }

    if (!proposta) return

    setIsLoading(true)
    try {
      const response = await fetch(`/api/propostas/${proposta.id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          status: "rejeitada",
          parecer_analise: parecer,
          data_analise: new Date().toISOString(),
        }),
      })

      if (!response.ok) {
        throw new Error("Erro ao rejeitar proposta")
      }

      toast({
        title: "Proposta rejeitada",
        description: `A proposta PROP-${String(proposta.id).padStart(3, "0")} foi rejeitada`,
      })

      router.push("/dashboard/propostas/lista")
    } catch (error) {
      console.error("[v0] Erro ao rejeitar proposta:", error)
      toast({
        title: "Erro ao rejeitar",
        description: "Ocorreu um erro ao rejeitar a proposta",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  if (isLoadingProposta) {
    return (
      <div className="flex-1 flex items-center justify-center p-6">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    )
  }

  if (!proposta) {
    return (
      <div className="flex-1 flex items-center justify-center p-6">
        <p className="text-slate-600">Proposta não encontrada</p>
      </div>
    )
  }

  return (
    <div className="flex-1 space-y-6 p-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="sm" onClick={() => router.push("/dashboard/propostas/pendentes")}>
            <ArrowLeftIcon className="w-4 h-4 mr-2" />
            Voltar
          </Button>
          <div>
            <h1 className="text-3xl font-bold tracking-tight text-slate-900">Análise de Proposta</h1>
            <p className="text-slate-600">
              Avaliação detalhada da proposta PROP-{String(proposta.id).padStart(3, "0")}
            </p>
          </div>
        </div>
        <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200">
          <ClockIcon className="w-4 h-4 mr-1" />
          {proposta.status}
        </Badge>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <UserIcon className="w-5 h-5 text-blue-600" />
              Dados do Proponente
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="grid gap-3 md:grid-cols-2">
              <div>
                <Label className="text-sm font-medium text-slate-600">Nome/Razão Social</Label>
                <p className="text-slate-900">{proposta.nome_proponente}</p>
              </div>
              <div>
                <Label className="text-sm font-medium text-slate-600">CPF/CNPJ</Label>
                <p className="text-slate-900">{proposta.cpf_cnpj_proponente}</p>
              </div>
            </div>
            <div className="grid gap-3 md:grid-cols-2">
              <div>
                <Label className="text-sm font-medium text-slate-600">E-mail</Label>
                <p className="text-slate-900">{proposta.email_proponente || "-"}</p>
              </div>
              <div>
                <Label className="text-sm font-medium text-slate-600">Telefone</Label>
                <p className="text-slate-900">{proposta.telefone_proponente || "-"}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <BuildingIcon className="w-5 h-5 text-green-600" />
              Dados da Empresa
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div>
              <Label className="text-sm font-medium text-slate-600">Nome da Empresa</Label>
              <p className="text-slate-900">{proposta.nome_empresa || "-"}</p>
            </div>
            <div className="grid gap-3 md:grid-cols-2">
              <div>
                <Label className="text-sm font-medium text-slate-600">Funcionários</Label>
                <p className="text-slate-900">{proposta.numero_funcionarios || "-"}</p>
              </div>
              <div>
                <Label className="text-sm font-medium text-slate-600">Data da Proposta</Label>
                <p className="text-slate-900">{new Date(proposta.data_submissao).toLocaleDateString("pt-BR")}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <FileTextIcon className="w-5 h-5 text-purple-600" />
            Detalhes da Proposta
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid gap-4 md:grid-cols-3">
            <div>
              <Label className="text-sm font-medium text-slate-600">Tipo de Plano</Label>
              <p className="text-slate-900 font-medium">{proposta.tipo_plano}</p>
            </div>
            <div>
              <Label className="text-sm font-medium text-slate-600">Valor Proposto</Label>
              <p className="text-slate-900 font-medium text-green-600">
                R$ {proposta.valor_proposto.toLocaleString("pt-BR", { minimumFractionDigits: 2 })}
              </p>
            </div>
            <div>
              <Label className="text-sm font-medium text-slate-600">Valor por Funcionário</Label>
              <p className="text-slate-900 font-medium">
                {proposta.numero_funcionarios
                  ? `R$ ${(proposta.valor_proposto / Number.parseInt(proposta.numero_funcionarios.split("-")[0])).toLocaleString("pt-BR", { minimumFractionDigits: 2 })}`
                  : "-"}
              </p>
            </div>
          </div>
          <Separator />
          <div>
            <Label className="text-sm font-medium text-slate-600">Observações</Label>
            <p className="text-slate-900 mt-1">{proposta.observacoes || "Nenhuma observação"}</p>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Parecer Técnico</CardTitle>
          <CardDescription>Adicione sua análise e recomendação para esta proposta</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="parecer">Parecer *</Label>
            <Textarea
              id="parecer"
              value={parecer}
              onChange={(e) => setParecer(e.target.value)}
              placeholder="Digite sua análise detalhada da proposta..."
              rows={6}
            />
          </div>
          <div className="flex justify-end gap-4">
            <Button
              variant="outline"
              onClick={handleRejeitar}
              disabled={isLoading}
              className="border-red-200 text-red-700 hover:bg-red-50 bg-transparent"
            >
              <XCircleIcon className="w-4 h-4 mr-2" />
              {isLoading ? "Processando..." : "Rejeitar Proposta"}
            </Button>
            <Button onClick={handleAprovar} disabled={isLoading} className="bg-green-600 hover:bg-green-700">
              <CheckCircleIcon className="w-4 h-4 mr-2" />
              {isLoading ? "Processando..." : "Aprovar Proposta"}
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
