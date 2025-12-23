"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { UserIcon, BuildingIcon, FileTextIcon, SaveIcon, ArrowLeftIcon } from "lucide-react"
import { useToast } from "@/hooks/use-toast"

export default function NovaPropostaPage() {
  const router = useRouter()
  const { toast } = useToast()
  const [isLoading, setIsLoading] = useState(false)

  const [formData, setFormData] = useState({
    tipoPlano: "",
    nomeProponente: "",
    cpfCnpj: "",
    email: "",
    telefone: "",
    empresa: "",
    numeroFuncionarios: "",
    valorProposto: "",
    observacoes: "",
  })

  const handleInputChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
  }

  const handleSubmit = async () => {
    // Validação básica
    if (!formData.nomeProponente || !formData.cpfCnpj || !formData.tipoPlano) {
      toast({
        title: "Campos obrigatórios",
        description: "Preencha todos os campos obrigatórios",
        variant: "destructive",
      })
      return
    }

    setIsLoading(true)
    try {
      const response = await fetch("/api/propostas", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          nome_proponente: formData.nomeProponente,
          cpf_cnpj_proponente: formData.cpfCnpj,
          email_proponente: formData.email,
          telefone_proponente: formData.telefone,
          nome_empresa: formData.empresa,
          numero_funcionarios: formData.numeroFuncionarios,
          tipo_plano: formData.tipoPlano,
          valor_proposto: Number.parseFloat(formData.valorProposto.replace(/[^\d,]/g, "").replace(",", ".")) || 0,
          observacoes: formData.observacoes,
          status: "pendente",
        }),
      })

      if (!response.ok) {
        throw new Error("Erro ao criar proposta")
      }

      const data = await response.json()

      toast({
        title: "Proposta criada",
        description: `Proposta #${data.id} criada com sucesso`,
      })

      // Redirecionar para lista de propostas
      router.push("/dashboard/propostas/lista")
    } catch (error) {
      console.error("[v0] Erro ao criar proposta:", error)
      toast({
        title: "Erro ao criar proposta",
        description: "Ocorreu um erro ao criar a proposta. Tente novamente.",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="flex-1 space-y-6 p-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="sm" onClick={() => router.push("/dashboard/propostas/lista")}>
            <ArrowLeftIcon className="w-4 h-4 mr-2" />
            Voltar
          </Button>
          <div>
            <h1 className="text-3xl font-bold tracking-tight text-slate-900">Nova Proposta</h1>
            <p className="text-slate-600">Criar uma nova proposta de plano de saúde</p>
          </div>
        </div>
        <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200">
          <FileTextIcon className="w-4 h-4 mr-1" />
          Em Elaboração
        </Badge>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <UserIcon className="w-5 h-5 text-blue-600" />
              Dados do Proponente
            </CardTitle>
            <CardDescription>Informações básicas do solicitante</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="nomeProponente">Nome/Razão Social *</Label>
                <Input
                  id="nomeProponente"
                  value={formData.nomeProponente}
                  onChange={(e) => handleInputChange("nomeProponente", e.target.value)}
                  placeholder="Digite o nome completo"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="cpfCnpj">CPF/CNPJ *</Label>
                <Input
                  id="cpfCnpj"
                  value={formData.cpfCnpj}
                  onChange={(e) => handleInputChange("cpfCnpj", e.target.value)}
                  placeholder="000.000.000-00"
                />
              </div>
            </div>
            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="email">E-mail</Label>
                <Input
                  id="email"
                  type="email"
                  value={formData.email}
                  onChange={(e) => handleInputChange("email", e.target.value)}
                  placeholder="email@exemplo.com"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="telefone">Telefone</Label>
                <Input
                  id="telefone"
                  value={formData.telefone}
                  onChange={(e) => handleInputChange("telefone", e.target.value)}
                  placeholder="(11) 99999-9999"
                />
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
            <CardDescription>Informações da empresa contratante</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="empresa">Nome da Empresa</Label>
              <Input
                id="empresa"
                value={formData.empresa}
                onChange={(e) => handleInputChange("empresa", e.target.value)}
                placeholder="Nome da empresa"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="numeroFuncionarios">Número de Funcionários</Label>
              <Select onValueChange={(value) => handleInputChange("numeroFuncionarios", value)}>
                <SelectTrigger>
                  <SelectValue placeholder="Selecione a faixa" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="1-10">1 a 10 funcionários</SelectItem>
                  <SelectItem value="11-50">11 a 50 funcionários</SelectItem>
                  <SelectItem value="51-100">51 a 100 funcionários</SelectItem>
                  <SelectItem value="101-500">101 a 500 funcionários</SelectItem>
                  <SelectItem value="500+">Mais de 500 funcionários</SelectItem>
                </SelectContent>
              </Select>
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
          <CardDescription>Especificações do plano solicitado</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="tipoPlano">Tipo de Plano *</Label>
              <Select onValueChange={(value) => handleInputChange("tipoPlano", value)}>
                <SelectTrigger>
                  <SelectValue placeholder="Selecione o tipo de plano" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="ambulatorial">Ambulatorial</SelectItem>
                  <SelectItem value="hospitalar">Hospitalar com Obstetrícia</SelectItem>
                  <SelectItem value="odontologico">Odontológico</SelectItem>
                  <SelectItem value="completo">Completo (Médico + Odonto)</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="valorProposto">Valor Proposto (R$)</Label>
              <Input
                id="valorProposto"
                value={formData.valorProposto}
                onChange={(e) => handleInputChange("valorProposto", e.target.value)}
                placeholder="0,00"
              />
            </div>
          </div>
          <div className="space-y-2">
            <Label htmlFor="observacoes">Observações</Label>
            <Textarea
              id="observacoes"
              value={formData.observacoes}
              onChange={(e) => handleInputChange("observacoes", e.target.value)}
              placeholder="Informações adicionais sobre a proposta..."
              rows={4}
            />
          </div>
        </CardContent>
      </Card>

      <div className="flex justify-end gap-4">
        <Button variant="outline" onClick={() => router.push("/dashboard/propostas/lista")}>
          Cancelar
        </Button>
        <Button onClick={handleSubmit} disabled={isLoading} className="bg-blue-600 hover:bg-blue-700">
          <SaveIcon className="w-4 h-4 mr-2" />
          {isLoading ? "Salvando..." : "Salvar Proposta"}
        </Button>
      </div>
    </div>
  )
}
