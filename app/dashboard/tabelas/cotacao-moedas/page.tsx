"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { Search, Plus, Edit, Trash2, RefreshCw, TrendingUp, TrendingDown, Loader2 } from "lucide-react"
import { useToast } from "@/hooks/use-toast"
import { format } from "date-fns"

interface Moeda {
  id: number
  codigo: string
  nome: string
  simbolo?: string
  pais?: string
  cotacao_compra?: number
  cotacao_venda?: number
  variacao_percentual?: number
  data_cotacao?: string
  status: string
}

export default function CotacaoMoedasPage() {
  const [moedas, setMoedas] = useState<Moeda[]>([])
  const [searchTerm, setSearchTerm] = useState("")
  const [loading, setLoading] = useState(true)
  const [dialogOpen, setDialogOpen] = useState(false)
  const [editingMoeda, setEditingMoeda] = useState<Moeda | null>(null)
  const [atualizandoCotacoes, setAtualizandoCotacoes] = useState(false)
  const { toast } = useToast()

  const [formData, setFormData] = useState({
    codigo: "",
    nome: "",
    simbolo: "",
    pais: "",
    status: "Ativa",
  })

  useEffect(() => {
    carregarMoedas()
  }, [])

  const carregarMoedas = async () => {
    try {
      setLoading(true)
      const response = await fetch("/api/moedas")
      const data = await response.json()

      if (response.ok) {
        setMoedas(data)
      }
    } catch (error) {
      toast({
        title: "Erro",
        description: "Erro ao carregar moedas",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  const atualizarCotacoes = async () => {
    try {
      setAtualizandoCotacoes(true)
      const response = await fetch("/api/moedas/atualizar-cotacoes", {
        method: "POST",
      })

      const data = await response.json()

      if (response.ok) {
        toast({
          title: "Sucesso",
          description: data.message,
        })
        carregarMoedas()
      } else {
        toast({
          title: "Erro",
          description: data.error || "Erro ao atualizar cotações",
          variant: "destructive",
        })
      }
    } catch (error) {
      toast({
        title: "Erro",
        description: "Erro ao atualizar cotações",
        variant: "destructive",
      })
    } finally {
      setAtualizandoCotacoes(false)
    }
  }

  const abrirDialogNovo = () => {
    setEditingMoeda(null)
    setFormData({
      codigo: "",
      nome: "",
      simbolo: "",
      pais: "",
      status: "Ativa",
    })
    setDialogOpen(true)
  }

  const abrirDialogEditar = (moeda: Moeda) => {
    setEditingMoeda(moeda)
    setFormData({
      codigo: moeda.codigo,
      nome: moeda.nome,
      simbolo: moeda.simbolo || "",
      pais: moeda.pais || "",
      status: moeda.status,
    })
    setDialogOpen(true)
  }

  const salvarMoeda = async () => {
    try {
      const url = editingMoeda ? `/api/moedas/${editingMoeda.id}` : "/api/moedas"
      const method = editingMoeda ? "PUT" : "POST"

      const response = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      })

      if (response.ok) {
        toast({
          title: "Sucesso",
          description: `Moeda ${editingMoeda ? "atualizada" : "cadastrada"} com sucesso`,
        })
        setDialogOpen(false)
        carregarMoedas()
      } else {
        const data = await response.json()
        toast({
          title: "Erro",
          description: data.error || "Erro ao salvar moeda",
          variant: "destructive",
        })
      }
    } catch (error) {
      toast({
        title: "Erro",
        description: "Erro ao salvar moeda",
        variant: "destructive",
      })
    }
  }

  const excluirMoeda = async (id: number) => {
    if (!confirm("Deseja realmente excluir esta moeda?")) return

    try {
      const response = await fetch(`/api/moedas/${id}`, {
        method: "DELETE",
      })

      if (response.ok) {
        toast({
          title: "Sucesso",
          description: "Moeda excluída com sucesso",
        })
        carregarMoedas()
      }
    } catch (error) {
      toast({
        title: "Erro",
        description: "Erro ao excluir moeda",
        variant: "destructive",
      })
    }
  }

  const filteredMoedas = moedas.filter(
    (moeda) =>
      moeda.codigo.toLowerCase().includes(searchTerm.toLowerCase()) ||
      moeda.nome.toLowerCase().includes(searchTerm.toLowerCase()),
  )

  const totalMoedas = moedas.length
  const moedasEmAlta = moedas.filter((m) => m.variacao_percentual && m.variacao_percentual > 0).length
  const moedasEmBaixa = moedas.filter((m) => m.variacao_percentual && m.variacao_percentual < 0).length

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Cotação de Moedas</h1>
          <p className="text-muted-foreground">Acompanhamento das cotações de moedas estrangeiras</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" size="sm" onClick={atualizarCotacoes} disabled={atualizandoCotacoes}>
            {atualizandoCotacoes ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Atualizando...
              </>
            ) : (
              <>
                <RefreshCw className="mr-2 h-4 w-4" />
                Atualizar Cotações
              </>
            )}
          </Button>
          <Button size="sm" onClick={abrirDialogNovo}>
            <Plus className="mr-2 h-4 w-4" />
            Nova Moeda
          </Button>
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Moedas Ativas</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalMoedas}</div>
            <p className="text-xs text-muted-foreground">Cotações monitoradas</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Última Atualização</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {moedas[0]?.data_cotacao ? format(new Date(moedas[0].data_cotacao), "HH:mm") : "--:--"}
            </div>
            <p className="text-xs text-muted-foreground">Hoje - AwesomeAPI</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Em Alta</CardTitle>
            <TrendingUp className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">{moedasEmAlta}</div>
            <p className="text-xs text-muted-foreground">Moedas valorizadas</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Em Baixa</CardTitle>
            <TrendingDown className="h-4 w-4 text-red-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-600">{moedasEmBaixa}</div>
            <p className="text-xs text-muted-foreground">Moedas desvalorizadas</p>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Cotações Atuais</CardTitle>
          <CardDescription>Valores em Real (BRL) - Atualização via AwesomeAPI</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex gap-4 mb-4">
            <div className="relative flex-1">
              <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Buscar por código ou nome da moeda..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-8"
              />
            </div>
          </div>

          {loading ? (
            <div className="flex justify-center py-8">
              <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Código</TableHead>
                  <TableHead>Moeda</TableHead>
                  <TableHead>Símbolo</TableHead>
                  <TableHead className="text-right">Compra (BRL)</TableHead>
                  <TableHead className="text-right">Venda (BRL)</TableHead>
                  <TableHead className="text-right">Variação (%)</TableHead>
                  <TableHead className="text-right">Ações</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredMoedas.map((moeda) => (
                  <TableRow key={moeda.id}>
                    <TableCell className="font-mono font-bold">{moeda.codigo}</TableCell>
                    <TableCell className="font-medium">{moeda.nome}</TableCell>
                    <TableCell className="text-lg">{moeda.simbolo || "-"}</TableCell>
                    <TableCell className="text-right font-mono">
                      {moeda.cotacao_compra ? `R$ ${moeda.cotacao_compra.toFixed(4)}` : "-"}
                    </TableCell>
                    <TableCell className="text-right font-mono">
                      {moeda.cotacao_venda ? `R$ ${moeda.cotacao_venda.toFixed(4)}` : "-"}
                    </TableCell>
                    <TableCell className="text-right">
                      {moeda.variacao_percentual !== undefined && moeda.variacao_percentual !== null ? (
                        <div
                          className={`flex items-center justify-end gap-1 ${
                            moeda.variacao_percentual > 0 ? "text-green-600" : "text-red-600"
                          }`}
                        >
                          {moeda.variacao_percentual > 0 ? (
                            <TrendingUp className="h-4 w-4" />
                          ) : (
                            <TrendingDown className="h-4 w-4" />
                          )}
                          {moeda.variacao_percentual > 0 ? "+" : ""}
                          {moeda.variacao_percentual.toFixed(2)}%
                        </div>
                      ) : (
                        "-"
                      )}
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-2">
                        <Button variant="ghost" size="sm" onClick={() => abrirDialogEditar(moeda)}>
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button variant="ghost" size="sm" onClick={() => excluirMoeda(moeda.id)}>
                          <Trash2 className="h-4 w-4" />
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

      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>{editingMoeda ? "Editar Moeda" : "Nova Moeda"}</DialogTitle>
            <DialogDescription>Preencha os dados da moeda abaixo</DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="codigo" className="text-right">
                Código
              </Label>
              <Input
                id="codigo"
                value={formData.codigo}
                onChange={(e) => setFormData({ ...formData, codigo: e.target.value.toUpperCase() })}
                className="col-span-3"
                placeholder="USD"
                maxLength={10}
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="nome" className="text-right">
                Nome
              </Label>
              <Input
                id="nome"
                value={formData.nome}
                onChange={(e) => setFormData({ ...formData, nome: e.target.value })}
                className="col-span-3"
                placeholder="Dólar Americano"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="simbolo" className="text-right">
                Símbolo
              </Label>
              <Input
                id="simbolo"
                value={formData.simbolo}
                onChange={(e) => setFormData({ ...formData, simbolo: e.target.value })}
                className="col-span-3"
                placeholder="$"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="pais" className="text-right">
                País
              </Label>
              <Input
                id="pais"
                value={formData.pais}
                onChange={(e) => setFormData({ ...formData, pais: e.target.value })}
                className="col-span-3"
                placeholder="Estados Unidos"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="status" className="text-right">
                Status
              </Label>
              <select
                id="status"
                value={formData.status}
                onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                className="col-span-3 px-3 py-2 border rounded-md"
              >
                <option value="Ativa">Ativa</option>
                <option value="Inativa">Inativa</option>
                <option value="Descontinuada">Descontinuada</option>
              </select>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDialogOpen(false)}>
              Cancelar
            </Button>
            <Button onClick={salvarMoeda}>Salvar</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
