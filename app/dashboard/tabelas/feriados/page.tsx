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
import { Textarea } from "@/components/ui/textarea"
import { Search, Plus, Edit, Trash2, Calendar, Loader2 } from "lucide-react"
import { useToast } from "@/hooks/use-toast"
import { format } from "date-fns"

interface Feriado {
  id: number
  data: string
  nome: string
  tipo: string
  uf?: string
  cidade?: string
  fixo: boolean
  descricao?: string
  status: string
}

export default function FeriadosPage() {
  const [feriados, setFeriados] = useState<Feriado[]>([])
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedTipo, setSelectedTipo] = useState("")
  const [selectedAno, setSelectedAno] = useState(new Date().getFullYear().toString())
  const [loading, setLoading] = useState(true)
  const [dialogOpen, setDialogOpen] = useState(false)
  const [editingFeriado, setEditingFeriado] = useState<Feriado | null>(null)
  const { toast } = useToast()

  const [formData, setFormData] = useState({
    data: "",
    nome: "",
    tipo: "Nacional",
    uf: "",
    cidade: "",
    fixo: true,
    descricao: "",
    status: "Ativo",
  })

  useEffect(() => {
    carregarFeriados()
  }, [selectedTipo, selectedAno])

  const carregarFeriados = async () => {
    try {
      setLoading(true)
      const params = new URLSearchParams()
      if (selectedTipo) params.append("tipo", selectedTipo)
      if (selectedAno) params.append("ano", selectedAno)

      const response = await fetch(`/api/feriados?${params}`)
      const data = await response.json()

      if (response.ok) {
        setFeriados(data)
      }
    } catch (error) {
      toast({
        title: "Erro",
        description: "Erro ao carregar feriados",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  const abrirDialogNovo = () => {
    setEditingFeriado(null)
    setFormData({
      data: "",
      nome: "",
      tipo: "Nacional",
      uf: "",
      cidade: "",
      fixo: true,
      descricao: "",
      status: "Ativo",
    })
    setDialogOpen(true)
  }

  const abrirDialogEditar = (feriado: Feriado) => {
    setEditingFeriado(feriado)
    setFormData({
      data: feriado.data,
      nome: feriado.nome,
      tipo: feriado.tipo,
      uf: feriado.uf || "",
      cidade: feriado.cidade || "",
      fixo: feriado.fixo,
      descricao: feriado.descricao || "",
      status: feriado.status,
    })
    setDialogOpen(true)
  }

  const salvarFeriado = async () => {
    try {
      const url = editingFeriado ? `/api/feriados/${editingFeriado.id}` : "/api/feriados"
      const method = editingFeriado ? "PUT" : "POST"

      const response = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      })

      if (response.ok) {
        toast({
          title: "Sucesso",
          description: `Feriado ${editingFeriado ? "atualizado" : "cadastrado"} com sucesso`,
        })
        setDialogOpen(false)
        carregarFeriados()
      } else {
        const data = await response.json()
        toast({
          title: "Erro",
          description: data.error || "Erro ao salvar feriado",
          variant: "destructive",
        })
      }
    } catch (error) {
      toast({
        title: "Erro",
        description: "Erro ao salvar feriado",
        variant: "destructive",
      })
    }
  }

  const excluirFeriado = async (id: number) => {
    if (!confirm("Deseja realmente excluir este feriado?")) return

    try {
      const response = await fetch(`/api/feriados/${id}`, {
        method: "DELETE",
      })

      if (response.ok) {
        toast({
          title: "Sucesso",
          description: "Feriado excluído com sucesso",
        })
        carregarFeriados()
      }
    } catch (error) {
      toast({
        title: "Erro",
        description: "Erro ao excluir feriado",
        variant: "destructive",
      })
    }
  }

  const filteredFeriados = feriados.filter((feriado) => feriado.nome.toLowerCase().includes(searchTerm.toLowerCase()))

  const totalFeriados = feriados.length
  const feriadosFixos = feriados.filter((f) => f.fixo).length
  const feriadosMoveis = feriados.filter((f) => !f.fixo).length

  const formatarData = (data: string) => {
    return format(new Date(data + "T00:00:00"), "dd/MM/yyyy")
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Feriados</h1>
          <p className="text-muted-foreground">Calendário de feriados nacionais, estaduais e municipais</p>
        </div>
        <div className="flex gap-2">
          <Button size="sm" onClick={abrirDialogNovo}>
            <Plus className="mr-2 h-4 w-4" />
            Novo Feriado
          </Button>
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Feriados {selectedAno}</CardTitle>
            <Calendar className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalFeriados}</div>
            <p className="text-xs text-muted-foreground">Total cadastrados</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Feriados Fixos</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{feriadosFixos}</div>
            <p className="text-xs text-muted-foreground">Mesma data todo ano</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Feriados Móveis</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{feriadosMoveis}</div>
            <p className="text-xs text-muted-foreground">Data varia por ano</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Próximo Feriado</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {feriados[0] ? formatarData(feriados[0].data).substring(0, 5) : "--/--"}
            </div>
            <p className="text-xs text-muted-foreground">{feriados[0]?.nome || "Nenhum"}</p>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Calendário de Feriados</CardTitle>
          <CardDescription>Gerencie feriados nacionais, estaduais e municipais para cálculos de prazos</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex gap-4 mb-4">
            <div className="relative flex-1">
              <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Buscar por nome do feriado..."
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
              <option value="Nacional">Nacional</option>
              <option value="Estadual">Estadual</option>
              <option value="Municipal">Municipal</option>
            </select>
            <select
              className="px-3 py-2 border rounded-md"
              value={selectedAno}
              onChange={(e) => setSelectedAno(e.target.value)}
            >
              <option value="2024">2024</option>
              <option value="2025">2025</option>
              <option value="2026">2026</option>
              <option value="2027">2027</option>
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
                  <TableHead>Data</TableHead>
                  <TableHead>Feriado</TableHead>
                  <TableHead>Tipo</TableHead>
                  <TableHead>UF/Cidade</TableHead>
                  <TableHead>Categoria</TableHead>
                  <TableHead className="text-right">Ações</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredFeriados.map((feriado) => (
                  <TableRow key={feriado.id}>
                    <TableCell className="font-mono">{formatarData(feriado.data)}</TableCell>
                    <TableCell className="font-medium">{feriado.nome}</TableCell>
                    <TableCell>
                      <Badge variant={feriado.tipo === "Nacional" ? "default" : "secondary"}>{feriado.tipo}</Badge>
                    </TableCell>
                    <TableCell className="text-sm">
                      {feriado.tipo === "Estadual" && feriado.uf}
                      {feriado.tipo === "Municipal" && `${feriado.cidade}/${feriado.uf}`}
                      {feriado.tipo === "Nacional" && "-"}
                    </TableCell>
                    <TableCell>
                      <Badge variant="outline">{feriado.fixo ? "Fixo" : "Móvel"}</Badge>
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-2">
                        <Button variant="ghost" size="sm" onClick={() => abrirDialogEditar(feriado)}>
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button variant="ghost" size="sm" onClick={() => excluirFeriado(feriado.id)}>
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
            <DialogTitle>{editingFeriado ? "Editar Feriado" : "Novo Feriado"}</DialogTitle>
            <DialogDescription>Preencha os dados do feriado abaixo</DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="data" className="text-right">
                Data
              </Label>
              <Input
                id="data"
                type="date"
                value={formData.data}
                onChange={(e) => setFormData({ ...formData, data: e.target.value })}
                className="col-span-3"
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
                placeholder="Nome do feriado"
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
                <option value="Nacional">Nacional</option>
                <option value="Estadual">Estadual</option>
                <option value="Municipal">Municipal</option>
              </select>
            </div>
            {formData.tipo === "Estadual" && (
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="uf" className="text-right">
                  UF
                </Label>
                <select
                  id="uf"
                  value={formData.uf}
                  onChange={(e) => setFormData({ ...formData, uf: e.target.value })}
                  className="col-span-3 px-3 py-2 border rounded-md"
                >
                  <option value="">Selecione</option>
                  <option value="SP">São Paulo</option>
                  <option value="RJ">Rio de Janeiro</option>
                  <option value="MG">Minas Gerais</option>
                  <option value="BA">Bahia</option>
                  <option value="RS">Rio Grande do Sul</option>
                </select>
              </div>
            )}
            {formData.tipo === "Municipal" && (
              <>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="uf" className="text-right">
                    UF
                  </Label>
                  <select
                    id="uf"
                    value={formData.uf}
                    onChange={(e) => setFormData({ ...formData, uf: e.target.value })}
                    className="col-span-3 px-3 py-2 border rounded-md"
                  >
                    <option value="">Selecione</option>
                    <option value="SP">São Paulo</option>
                    <option value="RJ">Rio de Janeiro</option>
                    <option value="MG">Minas Gerais</option>
                  </select>
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="cidade" className="text-right">
                    Cidade
                  </Label>
                  <Input
                    id="cidade"
                    value={formData.cidade}
                    onChange={(e) => setFormData({ ...formData, cidade: e.target.value })}
                    className="col-span-3"
                    placeholder="Nome da cidade"
                  />
                </div>
              </>
            )}
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="fixo" className="text-right">
                Categoria
              </Label>
              <select
                id="fixo"
                value={formData.fixo ? "true" : "false"}
                onChange={(e) => setFormData({ ...formData, fixo: e.target.value === "true" })}
                className="col-span-3 px-3 py-2 border rounded-md"
              >
                <option value="true">Fixo (mesma data todo ano)</option>
                <option value="false">Móvel (data varia)</option>
              </select>
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="descricao" className="text-right">
                Descrição
              </Label>
              <Textarea
                id="descricao"
                value={formData.descricao}
                onChange={(e) => setFormData({ ...formData, descricao: e.target.value })}
                className="col-span-3"
                placeholder="Descrição opcional"
                rows={3}
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDialogOpen(false)}>
              Cancelar
            </Button>
            <Button onClick={salvarFeriado}>Salvar</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
