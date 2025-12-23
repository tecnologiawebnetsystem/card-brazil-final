"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { Switch } from "@/components/ui/switch"
import { Search, Plus, Edit, Trash2, Package, TrendingUp, Users, DollarSign } from "lucide-react"
import { useToast } from "@/hooks/use-toast"

interface Produto {
  id: number
  codigo: string
  nome: string
  categoria: string
  tipo: string
  descricao: string
  valor: number
  ativo: boolean
  operadora_id?: number
  created_at?: string
  updated_at?: string
  deleted_at?: string | null
}

export default function ProdutosPage() {
  const { toast } = useToast()
  const [produtos, setProdutos] = useState<Produto[]>([])
  const [filteredProdutos, setFilteredProdutos] = useState<Produto[]>([])
  const [searchTerm, setSearchTerm] = useState("")
  const [filterCategoria, setFilterCategoria] = useState("todos")
  const [filterStatus, setFilterStatus] = useState("todos")
  const [showModal, setShowModal] = useState(false)
  const [editingProduto, setEditingProduto] = useState<Produto | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [showDeleteDialog, setShowDeleteDialog] = useState(false)
  const [produtoToDelete, setProdutoToDelete] = useState<number | null>(null)
  const [formData, setFormData] = useState({
    codigo: "",
    nome: "",
    categoria: "",
    tipo: "",
    descricao: "",
    valor: "",
    operadora_id: "",
    ativo: true,
  })

  useEffect(() => {
    loadProdutos()
  }, [])

  useEffect(() => {
    let filtered = produtos

    if (searchTerm) {
      filtered = filtered.filter(
        (produto) =>
          produto.nome.toLowerCase().includes(searchTerm.toLowerCase()) ||
          produto.codigo.toLowerCase().includes(searchTerm.toLowerCase()),
      )
    }

    if (filterCategoria !== "todos") {
      filtered = filtered.filter((produto) => produto.categoria === filterCategoria)
    }

    if (filterStatus !== "todos") {
      filtered = filtered.filter((produto) => (filterStatus === "ativo" ? produto.ativo : !produto.ativo))
    }

    setFilteredProdutos(filtered)
  }, [searchTerm, filterCategoria, filterStatus, produtos])

  const loadProdutos = async () => {
    setIsLoading(true)
    try {
      const response = await fetch("/api/produtos")
      const data = await response.json()

      if (data.success) {
        setProdutos(data.data)
        setFilteredProdutos(data.data)
      } else {
        throw new Error(data.message)
      }
    } catch (error) {
      console.error("Erro ao carregar produtos:", error)
      toast({
        title: "Erro",
        description: "Não foi possível carregar os produtos",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  const handleOpenModal = (produto?: Produto) => {
    if (produto) {
      setEditingProduto(produto)
      setFormData({
        codigo: produto.codigo,
        nome: produto.nome,
        categoria: produto.categoria,
        tipo: produto.tipo,
        descricao: produto.descricao,
        valor: produto.valor.toString(),
        operadora_id: produto.operadora_id?.toString() || "",
        ativo: produto.ativo,
      })
    } else {
      setEditingProduto(null)
      setFormData({
        codigo: "",
        nome: "",
        categoria: "",
        tipo: "",
        descricao: "",
        valor: "",
        operadora_id: "",
        ativo: true,
      })
    }
    setShowModal(true)
  }

  const handleSaveProduto = async () => {
    if (!formData.nome || !formData.codigo || !formData.categoria) {
      toast({
        title: "Erro",
        description: "Preencha todos os campos obrigatórios",
        variant: "destructive",
      })
      return
    }

    setIsLoading(true)
    try {
      const produtoData = {
        codigo: formData.codigo,
        nome: formData.nome,
        categoria: formData.categoria,
        tipo: formData.tipo,
        descricao: formData.descricao,
        valor: Number.parseFloat(formData.valor) || 0,
        operadora_id: formData.operadora_id ? Number.parseInt(formData.operadora_id) : null,
        ativo: formData.ativo,
      }

      let response
      if (editingProduto) {
        response = await fetch(`/api/produtos/${editingProduto.id}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(produtoData),
        })
      } else {
        response = await fetch("/api/produtos", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(produtoData),
        })
      }

      const data = await response.json()

      if (data.success) {
        toast({
          title: "Sucesso",
          description: editingProduto ? "Produto atualizado com sucesso" : "Produto cadastrado com sucesso",
        })
        await loadProdutos()
        setShowModal(false)
      } else {
        throw new Error(data.message)
      }
    } catch (error) {
      console.error("Erro ao salvar produto:", error)
      toast({
        title: "Erro",
        description: "Não foi possível salvar o produto",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  const handleDeleteProduto = async () => {
    if (!produtoToDelete) return

    setIsLoading(true)
    try {
      const response = await fetch(`/api/produtos/${produtoToDelete}`, {
        method: "DELETE",
      })

      const data = await response.json()

      if (data.success) {
        toast({
          title: "Sucesso",
          description: "Produto excluído com sucesso",
        })
        await loadProdutos()
        setShowDeleteDialog(false)
        setProdutoToDelete(null)
      } else {
        throw new Error(data.message)
      }
    } catch (error) {
      console.error("Erro ao excluir produto:", error)
      toast({
        title: "Erro",
        description: "Não foi possível excluir o produto",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  const totalProdutos = produtos.length
  const produtosAtivos = produtos.filter((p) => p.ativo).length
  const valorMedio = produtos.length > 0 ? produtos.reduce((acc, p) => acc + p.valor, 0) / produtos.length : 0

  return (
    <div className="container mx-auto px-6 py-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Produtos</h1>
          <p className="text-muted-foreground">Gerencie os produtos do sistema</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <Card className="bg-emerald-700 text-white border-0">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total de Produtos</CardTitle>
            <Package className="h-4 w-4 bg-emerald-600 p-1 rounded ml-6" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalProdutos}</div>
            <p className="text-xs text-emerald-100">produtos cadastrados</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Produtos Ativos</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{produtosAtivos}</div>
            <p className="text-xs text-muted-foreground">de {totalProdutos} produtos</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Valor Médio</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">R$ {valorMedio.toFixed(2)}</div>
            <p className="text-xs text-muted-foreground">valor médio dos produtos</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Categorias</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{new Set(produtos.map((p) => p.categoria)).size}</div>
            <p className="text-xs text-muted-foreground">categorias diferentes</p>
          </CardContent>
        </Card>
      </div>

      <Card className="mb-6">
        <CardHeader>
          <CardTitle>Filtros</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="space-y-2">
              <Label htmlFor="search">Buscar</Label>
              <div className="relative">
                <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  id="search"
                  placeholder="Nome ou código..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-8"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label>Categoria</Label>
              <Select value={filterCategoria} onValueChange={setFilterCategoria}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="todos">Todas as categorias</SelectItem>
                  <SelectItem value="Saúde">Saúde</SelectItem>
                  <SelectItem value="Odontológico">Odontológico</SelectItem>
                  <SelectItem value="Vida">Vida</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label>Status</Label>
              <Select value={filterStatus} onValueChange={setFilterStatus}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="todos">Todos</SelectItem>
                  <SelectItem value="ativo">Ativo</SelectItem>
                  <SelectItem value="inativo">Inativo</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="flex items-end">
              <Dialog open={showModal} onOpenChange={setShowModal}>
                <DialogTrigger asChild>
                  <Button className="w-full" onClick={() => handleOpenModal()}>
                    <Plus className="mr-2 h-4 w-4" />
                    Novo Produto
                  </Button>
                </DialogTrigger>
                <DialogContent className="max-w-2xl">
                  <DialogHeader>
                    <DialogTitle>{editingProduto ? "Editar Produto" : "Cadastrar Novo Produto"}</DialogTitle>
                    <DialogDescription>Preencha as informações do produto</DialogDescription>
                  </DialogHeader>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="codigo">Código *</Label>
                      <Input
                        id="codigo"
                        value={formData.codigo}
                        onChange={(e) => setFormData({ ...formData, codigo: e.target.value })}
                        placeholder="PROD001"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="nome">Nome *</Label>
                      <Input
                        id="nome"
                        value={formData.nome}
                        onChange={(e) => setFormData({ ...formData, nome: e.target.value })}
                        placeholder="Nome do produto"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="categoria">Categoria *</Label>
                      <Select
                        value={formData.categoria}
                        onValueChange={(value) => setFormData({ ...formData, categoria: value })}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Selecione a categoria" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="Saúde">Saúde</SelectItem>
                          <SelectItem value="Odontológico">Odontológico</SelectItem>
                          <SelectItem value="Vida">Vida</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="tipo">Tipo</Label>
                      <Select
                        value={formData.tipo}
                        onValueChange={(value) => setFormData({ ...formData, tipo: value })}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Selecione o tipo" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="Individual">Individual</SelectItem>
                          <SelectItem value="Familiar">Familiar</SelectItem>
                          <SelectItem value="Empresarial">Empresarial</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="valor">Valor</Label>
                      <Input
                        id="valor"
                        type="number"
                        step="0.01"
                        value={formData.valor}
                        onChange={(e) => setFormData({ ...formData, valor: e.target.value })}
                        placeholder="0.00"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="operadora_id">Operadora ID</Label>
                      <Input
                        id="operadora_id"
                        value={formData.operadora_id}
                        onChange={(e) => setFormData({ ...formData, operadora_id: e.target.value })}
                        placeholder="ID da operadora"
                      />
                    </div>

                    <div className="col-span-2 space-y-2">
                      <Label htmlFor="descricao">Descrição</Label>
                      <Textarea
                        id="descricao"
                        value={formData.descricao}
                        onChange={(e) => setFormData({ ...formData, descricao: e.target.value })}
                        placeholder="Descrição do produto"
                        rows={3}
                      />
                    </div>

                    <div className="col-span-2 flex items-center space-x-2">
                      <Switch
                        id="ativo"
                        checked={formData.ativo}
                        onCheckedChange={(checked) => setFormData({ ...formData, ativo: checked })}
                      />
                      <Label htmlFor="ativo">Produto ativo</Label>
                    </div>
                  </div>

                  <DialogFooter>
                    <Button variant="outline" onClick={() => setShowModal(false)} disabled={isLoading}>
                      Cancelar
                    </Button>
                    <Button onClick={handleSaveProduto} disabled={isLoading}>
                      {isLoading ? "Salvando..." : editingProduto ? "Atualizar" : "Cadastrar"}
                    </Button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Produtos Cadastrados ({filteredProdutos.length})</CardTitle>
        </CardHeader>
        <CardContent>
          {isLoading && produtos.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">Carregando produtos...</div>
          ) : filteredProdutos.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              {searchTerm || filterCategoria !== "todos" || filterStatus !== "todos"
                ? "Nenhum produto encontrado com os filtros aplicados."
                : "Nenhum produto cadastrado."}
            </div>
          ) : (
            <div className="space-y-4">
              {filteredProdutos.map((produto) => (
                <div key={produto.id} className="flex items-center justify-between p-4 border rounded-lg">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <h3 className="font-semibold">{produto.nome}</h3>
                      <Badge variant={produto.ativo ? "default" : "secondary"}>
                        {produto.ativo ? "Ativo" : "Inativo"}
                      </Badge>
                      <Badge variant="outline">{produto.categoria}</Badge>
                    </div>
                    <div className="text-sm text-muted-foreground space-y-1">
                      <p>
                        <strong>Código:</strong> {produto.codigo}
                      </p>
                      <p>
                        <strong>Tipo:</strong> {produto.tipo}
                      </p>
                      <p>
                        <strong>Valor:</strong> R$ {produto.valor.toFixed(2)}
                      </p>
                      {produto.descricao && (
                        <p>
                          <strong>Descrição:</strong> {produto.descricao}
                        </p>
                      )}
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <Button variant="outline" size="sm" onClick={() => handleOpenModal(produto)}>
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => {
                        setProdutoToDelete(produto.id)
                        setShowDeleteDialog(true)
                      }}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      <Dialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Confirmar Exclusão</DialogTitle>
            <DialogDescription>
              Tem certeza que deseja excluir este produto? Esta ação não pode ser desfeita.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowDeleteDialog(false)} disabled={isLoading}>
              Cancelar
            </Button>
            <Button variant="destructive" onClick={handleDeleteProduto} disabled={isLoading}>
              {isLoading ? "Excluindo..." : "Excluir"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
