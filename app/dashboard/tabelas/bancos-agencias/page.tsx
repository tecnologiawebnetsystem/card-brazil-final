"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
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
import { Search, Plus, Edit, Trash2, RefreshCw, Building2, Loader2 } from "lucide-react"
import { useToast } from "@/hooks/use-toast"

interface Banco {
  id: number
  codigo: string
  nome: string
  nome_curto?: string
  tipo?: string
  cnpj?: string
  status: string
}

export default function BancosAgenciasPage() {
  const [bancos, setBancos] = useState<Banco[]>([])
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedTipo, setSelectedTipo] = useState("")
  const [loading, setLoading] = useState(true)
  const [dialogOpen, setDialogOpen] = useState(false)
  const [editingBanco, setEditingBanco] = useState<Banco | null>(null)
  const [atualizandoBacen, setAtualizandoBacen] = useState(false)
  const { toast } = useToast()

  const [formData, setFormData] = useState({
    codigo: "",
    nome: "",
    nome_curto: "",
    tipo: "Privado",
    cnpj: "",
    status: "Ativo",
  })

  useEffect(() => {
    carregarBancos()
  }, [selectedTipo])

  const carregarBancos = async () => {
    try {
      setLoading(true)
      const params = new URLSearchParams()
      if (selectedTipo) params.append("tipo", selectedTipo)

      const response = await fetch(`/api/bancos?${params}`)
      const data = await response.json()

      if (response.ok) {
        setBancos(data)
      }
    } catch (error) {
      toast({
        title: "Erro",
        description: "Erro ao carregar bancos",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  const atualizarComBacen = async () => {
    try {
      setAtualizandoBacen(true)
      const response = await fetch("/api/bancos/atualizar-bacen", {
        method: "POST",
      })

      const data = await response.json()

      if (response.ok) {
        toast({
          title: "Sucesso",
          description: data.message,
        })
        carregarBancos()
      } else {
        toast({
          title: "Erro",
          description: data.error || "Erro ao atualizar bancos",
          variant: "destructive",
        })
      }
    } catch (error) {
      toast({
        title: "Erro",
        description: "Erro ao atualizar com Bacen",
        variant: "destructive",
      })
    } finally {
      setAtualizandoBacen(false)
    }
  }

  const abrirDialogNovo = () => {
    setEditingBanco(null)
    setFormData({
      codigo: "",
      nome: "",
      nome_curto: "",
      tipo: "Privado",
      cnpj: "",
      status: "Ativo",
    })
    setDialogOpen(true)
  }

  const abrirDialogEditar = (banco: Banco) => {
    setEditingBanco(banco)
    setFormData({
      codigo: banco.codigo,
      nome: banco.nome,
      nome_curto: banco.nome_curto || "",
      tipo: banco.tipo || "Privado",
      cnpj: banco.cnpj || "",
      status: banco.status,
    })
    setDialogOpen(true)
  }

  const salvarBanco = async () => {
    try {
      const url = editingBanco ? `/api/bancos/${editingBanco.id}` : "/api/bancos"
      const method = editingBanco ? "PUT" : "POST"

      const response = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      })

      if (response.ok) {
        toast({
          title: "Sucesso",
          description: `Banco ${editingBanco ? "atualizado" : "cadastrado"} com sucesso`,
        })
        setDialogOpen(false)
        carregarBancos()
      } else {
        const data = await response.json()
        toast({
          title: "Erro",
          description: data.error || "Erro ao salvar banco",
          variant: "destructive",
        })
      }
    } catch (error) {
      toast({
        title: "Erro",
        description: "Erro ao salvar banco",
        variant: "destructive",
      })
    }
  }

  const excluirBanco = async (id: number) => {
    if (!confirm("Deseja realmente excluir este banco?")) return

    try {
      const response = await fetch(`/api/bancos/${id}`, {
        method: "DELETE",
      })

      if (response.ok) {
        toast({
          title: "Sucesso",
          description: "Banco excluído com sucesso",
        })
        carregarBancos()
      }
    } catch (error) {
      toast({
        title: "Erro",
        description: "Erro ao excluir banco",
        variant: "destructive",
      })
    }
  }

  const filteredBancos = bancos.filter(
    (banco) =>
      banco.codigo.includes(searchTerm) ||
      banco.nome.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (banco.nome_curto && banco.nome_curto.toLowerCase().includes(searchTerm.toLowerCase())),
  )

  const totalBancos = bancos.length
  const bancosPublicos = bancos.filter((b) => b.tipo === "Público").length
  const bancosPrivados = bancos.filter((b) => b.tipo === "Privado").length

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Bancos e Agências</h1>
          <p className="text-muted-foreground">Cadastro oficial de bancos para operações financeiras</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" size="sm" onClick={atualizarComBacen} disabled={atualizandoBacen}>
            {atualizandoBacen ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Atualizando...
              </>
            ) : (
              <>
                <RefreshCw className="mr-2 h-4 w-4" />
                Atualizar com Bacen
              </>
            )}
          </Button>
          <Button size="sm" onClick={abrirDialogNovo}>
            <Plus className="mr-2 h-4 w-4" />
            Novo Banco
          </Button>
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total de Bancos</CardTitle>
            <Building2 className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalBancos}</div>
            <p className="text-xs text-muted-foreground">Instituições cadastradas</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Bancos Públicos</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{bancosPublicos}</div>
            <p className="text-xs text-muted-foreground">Instituições públicas</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Bancos Privados</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{bancosPrivados}</div>
            <p className="text-xs text-muted-foreground">Instituições privadas</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Fonte de Dados</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">Bacen</div>
            <p className="text-xs text-muted-foreground">Brasil API</p>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Pesquisar Bancos</CardTitle>
          <CardDescription>Busque por código, nome do banco ou tipo de instituição</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex gap-4 mb-4">
            <div className="relative flex-1">
              <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Buscar por código ou nome do banco..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-8"
              />
            </div>
            <select
              className="px-3 py-2 border rounded-md"
              value={selectedTipo}
              onChange={(e) => setSelectedTipo(e.target.value)}
            >
              <option value="">Todos os tipos</option>
              <option value="Público">Público</option>
              <option value="Privado">Privado</option>
              <option value="Cooperativa">Cooperativa</option>
            </select>
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
                  <TableHead>Nome do Banco</TableHead>
                  <TableHead>Tipo</TableHead>
                  <TableHead>CNPJ</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Ações</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredBancos.map((banco) => (
                  <TableRow key={banco.id}>
                    <TableCell className="font-mono">{banco.codigo}</TableCell>
                    <TableCell className="font-medium">{banco.nome}</TableCell>
                    <TableCell>
                      <Badge variant={banco.tipo === "Público" ? "default" : "secondary"}>{banco.tipo}</Badge>
                    </TableCell>
                    <TableCell className="font-mono text-sm">{banco.cnpj || "-"}</TableCell>
                    <TableCell>
                      <Badge variant="outline" className="text-green-600">
                        {banco.status}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-2">
                        <Button variant="ghost" size="sm" onClick={() => abrirDialogEditar(banco)}>
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button variant="ghost" size="sm" onClick={() => excluirBanco(banco.id)}>
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
            <DialogTitle>{editingBanco ? "Editar Banco" : "Novo Banco"}</DialogTitle>
            <DialogDescription>Preencha os dados do banco abaixo</DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="codigo" className="text-right">
                Código
              </Label>
              <Input
                id="codigo"
                value={formData.codigo}
                onChange={(e) => setFormData({ ...formData, codigo: e.target.value })}
                className="col-span-3"
                placeholder="001"
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
                placeholder="Nome completo do banco"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="nome_curto" className="text-right">
                Nome Curto
              </Label>
              <Input
                id="nome_curto"
                value={formData.nome_curto}
                onChange={(e) => setFormData({ ...formData, nome_curto: e.target.value })}
                className="col-span-3"
                placeholder="Sigla ou nome curto"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="tipo" className="text-right">
                Tipo
              </Label>
              <select
                id="tipo"
                value={formData.tipo}
                onChange={(e) => setFormData({ ...formData, tipo: e.target.value })}
                className="col-span-3 px-3 py-2 border rounded-md"
              >
                <option value="Público">Público</option>
                <option value="Privado">Privado</option>
                <option value="Cooperativa">Cooperativa</option>
                <option value="Financeira">Financeira</option>
              </select>
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="cnpj" className="text-right">
                CNPJ
              </Label>
              <Input
                id="cnpj"
                value={formData.cnpj}
                onChange={(e) => setFormData({ ...formData, cnpj: e.target.value })}
                className="col-span-3"
                placeholder="00.000.000/0001-00"
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
                <option value="Ativo">Ativo</option>
                <option value="Inativo">Inativo</option>
                <option value="Liquidado">Liquidado</option>
              </select>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDialogOpen(false)}>
              Cancelar
            </Button>
            <Button onClick={salvarBanco}>Salvar</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
