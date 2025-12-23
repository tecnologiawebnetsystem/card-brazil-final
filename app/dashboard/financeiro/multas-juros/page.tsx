"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Textarea } from "@/components/ui/textarea"
import { useToast } from "@/hooks/use-toast"
import { format } from "date-fns"
import { ptBR } from "date-fns/locale"
import {
  Calculator,
  Percent,
  Calendar,
  DollarSign,
  Plus,
  Eye,
  Edit,
  Trash2,
  FileText,
  QrCode,
  CreditCard,
} from "lucide-react"

interface ConfiguracaoMultaJuros {
  id: number
  nome: string
  percentual_multa: number
  percentual_juros_mensal: number
  dias_carencia: number
  tipo_calculo: string
  texto_padrao_boleto: string
  ativo: boolean
}

interface BoletoComMulta {
  id: number
  numero_boleto: string
  beneficiario_nome: string
  valor_original: number
  data_vencimento: string
  dias_atraso: number
  valor_multa: number
  valor_juros: number
  valor_total: number
  status: string
}

export default function MultasJurosPage() {
  const [configuracoes, setConfiguracoes] = useState<ConfiguracaoMultaJuros[]>([])
  const [boletos, setBoletos] = useState<BoletoComMulta[]>([])
  const [loading, setLoading] = useState(true)
  const [dialogOpen, setDialogOpen] = useState(false)
  const [viewDialogOpen, setViewDialogOpen] = useState(false)
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)
  const [pixDialogOpen, setPixDialogOpen] = useState(false)
  const [editingConfig, setEditingConfig] = useState<ConfiguracaoMultaJuros | null>(null)
  const [viewingConfig, setViewingConfig] = useState<ConfiguracaoMultaJuros | null>(null)
  const [deletingId, setDeletingId] = useState<number | null>(null)
  const [selectedBoleto, setSelectedBoleto] = useState<BoletoComMulta | null>(null)
  const { toast } = useToast()

  const [formData, setFormData] = useState({
    nome: "",
    percentual_multa: "",
    percentual_juros_mensal: "",
    dias_carencia: "",
    tipo_calculo: "simples",
    texto_padrao_boleto: "",
    ativo: true,
  })

  const [pixFormData, setPixFormData] = useState({
    chave_pix: "",
    nome_beneficiario: "",
    cidade: "",
    valor: "",
    descricao: "",
  })

  useEffect(() => {
    fetchConfiguracoes()
    fetchBoletos()
  }, [])

  const fetchConfiguracoes = async () => {
    try {
      setLoading(true)
      const response = await fetch("/api/financeiro/configuracoes-multa-juros")
      if (!response.ok) throw new Error("Erro ao carregar configurações")

      const data = await response.json()
      setConfiguracoes(data)
    } catch (error) {
      toast({
        title: "Erro",
        description: "Não foi possível carregar as configurações",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  const fetchBoletos = async () => {
    try {
      const response = await fetch("/api/financeiro/boletos-com-multa")
      if (!response.ok) throw new Error("Erro ao carregar boletos")

      const data = await response.json()
      setBoletos(data)
    } catch (error) {
      console.error("Erro ao carregar boletos:", error)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    try {
      const url = editingConfig
        ? `/api/financeiro/configuracoes-multa-juros/${editingConfig.id}`
        : "/api/financeiro/configuracoes-multa-juros"

      const method = editingConfig ? "PUT" : "POST"

      const response = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...formData,
          percentual_multa: Number.parseFloat(formData.percentual_multa),
          percentual_juros_mensal: Number.parseFloat(formData.percentual_juros_mensal),
          dias_carencia: Number.parseInt(formData.dias_carencia),
        }),
      })

      if (!response.ok) throw new Error("Erro ao salvar configuração")

      toast({
        title: "Sucesso",
        description: `Configuração ${editingConfig ? "atualizada" : "criada"} com sucesso`,
      })

      setDialogOpen(false)
      resetForm()
      fetchConfiguracoes()
    } catch (error) {
      toast({
        title: "Erro",
        description: "Não foi possível salvar a configuração",
        variant: "destructive",
      })
    }
  }

  const handleDelete = async () => {
    if (!deletingId) return

    try {
      const response = await fetch(`/api/financeiro/configuracoes-multa-juros/${deletingId}`, {
        method: "DELETE",
      })

      if (!response.ok) throw new Error("Erro ao deletar configuração")

      toast({
        title: "Sucesso",
        description: "Configuração deletada com sucesso",
      })

      setDeleteDialogOpen(false)
      setDeletingId(null)
      fetchConfiguracoes()
    } catch (error) {
      toast({
        title: "Erro",
        description: "Não foi possível deletar a configuração",
        variant: "destructive",
      })
    }
  }

  const handleGerarNovoBoleto = async (boletoId: number) => {
    try {
      const response = await fetch(`/api/financeiro/boletos/${boletoId}/gerar-com-multa`, {
        method: "POST",
      })

      if (!response.ok) throw new Error("Erro ao gerar boleto")

      const data = await response.json()

      toast({
        title: "Sucesso",
        description: "Novo boleto gerado com multa e juros aplicados",
      })

      fetchBoletos()
    } catch (error) {
      toast({
        title: "Erro",
        description: "Não foi possível gerar o novo boleto",
        variant: "destructive",
      })
    }
  }

  const handleGerarPix = async (e: React.FormEvent) => {
    e.preventDefault()

    try {
      const response = await fetch("/api/financeiro/gerar-pix-qrcode", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...pixFormData,
          valor: Number.parseFloat(pixFormData.valor),
          id_boleto: selectedBoleto?.id,
        }),
      })

      if (!response.ok) throw new Error("Erro ao gerar PIX")

      const data = await response.json()

      toast({
        title: "Sucesso",
        description: "QR Code PIX gerado com sucesso",
      })

      // Aqui você pode exibir o QR Code ou fazer download
      console.log("QR Code gerado:", data.qrcode)

      setPixDialogOpen(false)
      setPixFormData({ chave_pix: "", nome_beneficiario: "", cidade: "", valor: "", descricao: "" })
    } catch (error) {
      toast({
        title: "Erro",
        description: "Não foi possível gerar o QR Code PIX",
        variant: "destructive",
      })
    }
  }

  const resetForm = () => {
    setFormData({
      nome: "",
      percentual_multa: "",
      percentual_juros_mensal: "",
      dias_carencia: "",
      tipo_calculo: "simples",
      texto_padrao_boleto: "",
      ativo: true,
    })
    setEditingConfig(null)
  }

  const openEditDialog = (config: ConfiguracaoMultaJuros) => {
    setEditingConfig(config)
    setFormData({
      nome: config.nome,
      percentual_multa: config.percentual_multa.toString(),
      percentual_juros_mensal: config.percentual_juros_mensal.toString(),
      dias_carencia: config.dias_carencia.toString(),
      tipo_calculo: config.tipo_calculo,
      texto_padrao_boleto: config.texto_padrao_boleto,
      ativo: config.ativo,
    })
    setDialogOpen(true)
  }

  const totalMultasAplicadas = boletos.reduce((sum, b) => sum + b.valor_multa, 0)
  const totalJurosCalculados = boletos.reduce((sum, b) => sum + b.valor_juros, 0)
  const totalBoletosAtraso = boletos.filter((b) => b.dias_atraso > 0).length
  const totalRecuperado = boletos.reduce((sum, b) => sum + (b.valor_multa + b.valor_juros), 0)

  return (
    <div className="flex-1 space-y-6 p-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Multas e Juros</h1>
          <p className="text-muted-foreground">Configure e gerencie multas, juros e pagamentos via PIX</p>
        </div>
        <Button
          className="bg-blue-600 hover:bg-blue-700"
          onClick={() => {
            resetForm()
            setDialogOpen(true)
          }}
        >
          <Plus className="mr-2 h-4 w-4" />
          Nova Configuração
        </Button>
      </div>

      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Multas Aplicadas</CardTitle>
            <Calculator className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              R$ {totalMultasAplicadas.toLocaleString("pt-BR", { minimumFractionDigits: 2 })}
            </div>
            <p className="text-xs text-muted-foreground">total de multas</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Juros Calculados</CardTitle>
            <Percent className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              R$ {totalJurosCalculados.toLocaleString("pt-BR", { minimumFractionDigits: 2 })}
            </div>
            <p className="text-xs text-muted-foreground">total de juros</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Boletos em Atraso</CardTitle>
            <Calendar className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalBoletosAtraso}</div>
            <p className="text-xs text-muted-foreground">com multa aplicada</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Recuperado</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              R$ {totalRecuperado.toLocaleString("pt-BR", { minimumFractionDigits: 2 })}
            </div>
            <p className="text-xs text-muted-foreground">multas + juros</p>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="configuracoes" className="space-y-4">
        <TabsList>
          <TabsTrigger value="configuracoes">Configurações</TabsTrigger>
          <TabsTrigger value="boletos">Boletos com Multa</TabsTrigger>
        </TabsList>

        <TabsContent value="configuracoes" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Configurações de Multas e Juros</CardTitle>
              <CardDescription>
                Gerencie as regras de aplicação de multas e juros, incluindo texto padrão para boletos
              </CardDescription>
            </CardHeader>
            <CardContent>
              {loading ? (
                <div className="flex items-center justify-center py-8">
                  <div className="text-muted-foreground">Carregando...</div>
                </div>
              ) : configuracoes.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-8 text-center">
                  <FileText className="h-12 w-12 text-muted-foreground mb-4" />
                  <p className="text-muted-foreground">Nenhuma configuração encontrada</p>
                  <Button className="mt-4" onClick={() => setDialogOpen(true)}>
                    <Plus className="mr-2 h-4 w-4" />
                    Criar Primeira Configuração
                  </Button>
                </div>
              ) : (
                <div className="grid gap-4 md:grid-cols-2">
                  {configuracoes.map((config) => (
                    <Card key={config.id} className="border-2">
                      <CardHeader>
                        <div className="flex items-center justify-between">
                          <CardTitle className="text-lg">{config.nome}</CardTitle>
                          {config.ativo ? (
                            <Badge className="bg-green-100 text-green-800">Ativo</Badge>
                          ) : (
                            <Badge variant="outline">Inativo</Badge>
                          )}
                        </div>
                      </CardHeader>
                      <CardContent className="space-y-3">
                        <div className="grid grid-cols-2 gap-4 text-sm">
                          <div>
                            <p className="text-muted-foreground">Multa</p>
                            <p className="font-semibold">{config.percentual_multa}%</p>
                          </div>
                          <div>
                            <p className="text-muted-foreground">Juros Mensal</p>
                            <p className="font-semibold">{config.percentual_juros_mensal}%</p>
                          </div>
                          <div>
                            <p className="text-muted-foreground">Carência</p>
                            <p className="font-semibold">{config.dias_carencia} dias</p>
                          </div>
                          <div>
                            <p className="text-muted-foreground">Tipo</p>
                            <p className="font-semibold capitalize">{config.tipo_calculo}</p>
                          </div>
                        </div>
                        {config.texto_padrao_boleto && (
                          <div className="pt-2 border-t">
                            <p className="text-xs text-muted-foreground mb-1">Texto Padrão Boleto:</p>
                            <p className="text-xs italic">{config.texto_padrao_boleto}</p>
                          </div>
                        )}
                        <div className="flex gap-2 pt-2">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => {
                              setViewingConfig(config)
                              setViewDialogOpen(true)
                            }}
                          >
                            <Eye className="mr-1 h-3 w-3" />
                            Ver
                          </Button>
                          <Button variant="outline" size="sm" onClick={() => openEditDialog(config)}>
                            <Edit className="mr-1 h-3 w-3" />
                            Editar
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            className="text-red-600 hover:text-red-700 bg-transparent"
                            onClick={() => {
                              setDeletingId(config.id)
                              setDeleteDialogOpen(true)
                            }}
                          >
                            <Trash2 className="mr-1 h-3 w-3" />
                            Excluir
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="boletos" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Boletos com Multa e Juros</CardTitle>
              <CardDescription>Visualize boletos em atraso e gere novos boletos ou PIX com QR Code</CardDescription>
            </CardHeader>
            <CardContent>
              {boletos.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-8 text-center">
                  <FileText className="h-12 w-12 text-muted-foreground mb-4" />
                  <p className="text-muted-foreground">Nenhum boleto em atraso encontrado</p>
                </div>
              ) : (
                <div className="rounded-md border">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b bg-muted/50">
                        <th className="h-12 px-4 text-left align-middle font-medium">Boleto</th>
                        <th className="h-12 px-4 text-left align-middle font-medium">Beneficiário</th>
                        <th className="h-12 px-4 text-left align-middle font-medium">Vencimento</th>
                        <th className="h-12 px-4 text-left align-middle font-medium">Atraso</th>
                        <th className="h-12 px-4 text-left align-middle font-medium">Valor Original</th>
                        <th className="h-12 px-4 text-left align-middle font-medium">Multa</th>
                        <th className="h-12 px-4 text-left align-middle font-medium">Juros</th>
                        <th className="h-12 px-4 text-left align-middle font-medium">Total</th>
                        <th className="h-12 px-4 text-left align-middle font-medium">Ações</th>
                      </tr>
                    </thead>
                    <tbody>
                      {boletos.map((boleto) => (
                        <tr key={boleto.id} className="border-b">
                          <td className="h-12 px-4 align-middle font-medium">{boleto.numero_boleto}</td>
                          <td className="h-12 px-4 align-middle">{boleto.beneficiario_nome}</td>
                          <td className="h-12 px-4 align-middle">
                            {format(new Date(boleto.data_vencimento), "dd/MM/yyyy", { locale: ptBR })}
                          </td>
                          <td className="h-12 px-4 align-middle">
                            <Badge variant="destructive">{boleto.dias_atraso} dias</Badge>
                          </td>
                          <td className="h-12 px-4 align-middle">
                            R$ {boleto.valor_original.toLocaleString("pt-BR", { minimumFractionDigits: 2 })}
                          </td>
                          <td className="h-12 px-4 align-middle text-red-600">
                            R$ {boleto.valor_multa.toLocaleString("pt-BR", { minimumFractionDigits: 2 })}
                          </td>
                          <td className="h-12 px-4 align-middle text-red-600">
                            R$ {boleto.valor_juros.toLocaleString("pt-BR", { minimumFractionDigits: 2 })}
                          </td>
                          <td className="h-12 px-4 align-middle font-bold">
                            R$ {boleto.valor_total.toLocaleString("pt-BR", { minimumFractionDigits: 2 })}
                          </td>
                          <td className="h-12 px-4 align-middle">
                            <div className="flex gap-2">
                              <Button
                                variant="outline"
                                size="sm"
                                title="Gerar novo boleto com multa e juros"
                                onClick={() => handleGerarNovoBoleto(boleto.id)}
                              >
                                <CreditCard className="mr-1 h-3 w-3" />
                                Boleto
                              </Button>
                              <Button
                                variant="outline"
                                size="sm"
                                title="Gerar PIX com QR Code"
                                onClick={() => {
                                  setSelectedBoleto(boleto)
                                  setPixFormData({
                                    ...pixFormData,
                                    valor: boleto.valor_total.toString(),
                                    descricao: `Pagamento boleto ${boleto.numero_boleto}`,
                                  })
                                  setPixDialogOpen(true)
                                }}
                              >
                                <QrCode className="mr-1 h-3 w-3" />
                                PIX
                              </Button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>{editingConfig ? "Editar Configuração" : "Nova Configuração"}</DialogTitle>
            <DialogDescription>Configure as regras de multa e juros para boletos em atraso</DialogDescription>
          </DialogHeader>
          <form onSubmit={handleSubmit}>
            <div className="grid gap-4 py-4">
              <div className="grid gap-2">
                <Label htmlFor="nome">Nome da Configuração *</Label>
                <Input
                  id="nome"
                  value={formData.nome}
                  onChange={(e) => setFormData({ ...formData, nome: e.target.value })}
                  placeholder="Ex: Padrão Mensalidades"
                  required
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="grid gap-2">
                  <Label htmlFor="percentual_multa">Percentual de Multa (%) *</Label>
                  <Input
                    id="percentual_multa"
                    type="number"
                    step="0.01"
                    value={formData.percentual_multa}
                    onChange={(e) => setFormData({ ...formData, percentual_multa: e.target.value })}
                    placeholder="2.0"
                    required
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="percentual_juros_mensal">Juros Mensal (%) *</Label>
                  <Input
                    id="percentual_juros_mensal"
                    type="number"
                    step="0.01"
                    value={formData.percentual_juros_mensal}
                    onChange={(e) => setFormData({ ...formData, percentual_juros_mensal: e.target.value })}
                    placeholder="1.0"
                    required
                  />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="grid gap-2">
                  <Label htmlFor="dias_carencia">Carência (dias) *</Label>
                  <Input
                    id="dias_carencia"
                    type="number"
                    value={formData.dias_carencia}
                    onChange={(e) => setFormData({ ...formData, dias_carencia: e.target.value })}
                    placeholder="5"
                    required
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="tipo_calculo">Tipo de Cálculo *</Label>
                  <Select
                    value={formData.tipo_calculo}
                    onValueChange={(value) => setFormData({ ...formData, tipo_calculo: value })}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="simples">Juros Simples</SelectItem>
                      <SelectItem value="composto">Juros Compostos</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div className="grid gap-2">
                <Label htmlFor="texto_padrao_boleto">Texto Padrão para Boleto</Label>
                <Textarea
                  id="texto_padrao_boleto"
                  value={formData.texto_padrao_boleto}
                  onChange={(e) => setFormData({ ...formData, texto_padrao_boleto: e.target.value })}
                  placeholder="Ex: Após o vencimento será cobrado multa de 2% e juros de 1% ao mês"
                  rows={3}
                />
                <p className="text-xs text-muted-foreground">
                  Este texto será exibido automaticamente nos boletos gerados
                </p>
              </div>
              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  id="ativo"
                  checked={formData.ativo}
                  onChange={(e) => setFormData({ ...formData, ativo: e.target.checked })}
                />
                <Label htmlFor="ativo">Configuração ativa</Label>
              </div>
            </div>
            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => setDialogOpen(false)}>
                Cancelar
              </Button>
              <Button type="submit">{editingConfig ? "Atualizar" : "Criar"} Configuração</Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      <Dialog open={pixDialogOpen} onOpenChange={setPixDialogOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Gerar PIX com QR Code</DialogTitle>
            <DialogDescription>Configure os dados do PIX para gerar o QR Code de pagamento</DialogDescription>
          </DialogHeader>
          <form onSubmit={handleGerarPix}>
            <div className="grid gap-4 py-4">
              {selectedBoleto && (
                <div className="p-4 bg-muted rounded-lg">
                  <p className="text-sm font-medium">Boleto: {selectedBoleto.numero_boleto}</p>
                  <p className="text-sm">Beneficiário: {selectedBoleto.beneficiario_nome}</p>
                  <p className="text-sm font-bold">
                    Valor Total: R$ {selectedBoleto.valor_total.toLocaleString("pt-BR", { minimumFractionDigits: 2 })}
                  </p>
                </div>
              )}
              <div className="grid gap-2">
                <Label htmlFor="chave_pix">Chave PIX *</Label>
                <Input
                  id="chave_pix"
                  value={pixFormData.chave_pix}
                  onChange={(e) => setPixFormData({ ...pixFormData, chave_pix: e.target.value })}
                  placeholder="CPF, CNPJ, Email ou Telefone"
                  required
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="grid gap-2">
                  <Label htmlFor="nome_beneficiario">Nome do Beneficiário *</Label>
                  <Input
                    id="nome_beneficiario"
                    value={pixFormData.nome_beneficiario}
                    onChange={(e) => setPixFormData({ ...pixFormData, nome_beneficiario: e.target.value })}
                    required
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="cidade">Cidade *</Label>
                  <Input
                    id="cidade"
                    value={pixFormData.cidade}
                    onChange={(e) => setPixFormData({ ...pixFormData, cidade: e.target.value })}
                    required
                  />
                </div>
              </div>
              <div className="grid gap-2">
                <Label htmlFor="valor_pix">Valor *</Label>
                <Input
                  id="valor_pix"
                  type="number"
                  step="0.01"
                  value={pixFormData.valor}
                  onChange={(e) => setPixFormData({ ...pixFormData, valor: e.target.value })}
                  required
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="descricao_pix">Descrição</Label>
                <Input
                  id="descricao_pix"
                  value={pixFormData.descricao}
                  onChange={(e) => setPixFormData({ ...pixFormData, descricao: e.target.value })}
                  placeholder="Descrição do pagamento"
                />
              </div>
            </div>
            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => setPixDialogOpen(false)}>
                Cancelar
              </Button>
              <Button type="submit">
                <QrCode className="mr-2 h-4 w-4" />
                Gerar QR Code
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      <Dialog open={viewDialogOpen} onOpenChange={setViewDialogOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Detalhes da Configuração</DialogTitle>
          </DialogHeader>
          {viewingConfig && (
            <div className="grid gap-4 py-4">
              <div>
                <Label className="text-muted-foreground">Nome</Label>
                <p className="font-medium">{viewingConfig.nome}</p>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label className="text-muted-foreground">Percentual de Multa</Label>
                  <p className="font-medium">{viewingConfig.percentual_multa}%</p>
                </div>
                <div>
                  <Label className="text-muted-foreground">Juros Mensal</Label>
                  <p className="font-medium">{viewingConfig.percentual_juros_mensal}%</p>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label className="text-muted-foreground">Carência</Label>
                  <p className="font-medium">{viewingConfig.dias_carencia} dias</p>
                </div>
                <div>
                  <Label className="text-muted-foreground">Tipo de Cálculo</Label>
                  <p className="font-medium capitalize">{viewingConfig.tipo_calculo}</p>
                </div>
              </div>
              {viewingConfig.texto_padrao_boleto && (
                <div>
                  <Label className="text-muted-foreground">Texto Padrão Boleto</Label>
                  <p className="font-medium">{viewingConfig.texto_padrao_boleto}</p>
                </div>
              )}
              <div>
                <Label className="text-muted-foreground">Status</Label>
                <div className="mt-1">
                  {viewingConfig.ativo ? (
                    <Badge className="bg-green-100 text-green-800">Ativo</Badge>
                  ) : (
                    <Badge variant="outline">Inativo</Badge>
                  )}
                </div>
              </div>
            </div>
          )}
          <DialogFooter>
            <Button onClick={() => setViewDialogOpen(false)}>Fechar</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Confirmar Exclusão</DialogTitle>
            <DialogDescription>
              Tem certeza que deseja excluir esta configuração? Esta ação não pode ser desfeita.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDeleteDialogOpen(false)}>
              Cancelar
            </Button>
            <Button variant="destructive" onClick={handleDelete}>
              Excluir
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
