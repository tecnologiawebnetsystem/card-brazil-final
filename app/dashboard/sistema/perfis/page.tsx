"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { toast } from "sonner"
import { Search, Plus, Edit, Trash2, Shield, Users } from "lucide-react"

interface Perfil {
  id: string
  nome: string
  descricao: string
  usuariosCount: number
  dataCriacao: string
  ativo: boolean
}

export default function PerfisPage() {
  const [perfis, setPerfis] = useState<Perfil[]>([
    {
      id: "administrador",
      nome: "Administrador",
      descricao: "Acesso total ao sistema com todas as permissões",
      usuariosCount: 2,
      dataCriacao: "2024-01-01",
      ativo: true,
    },
    {
      id: "operador",
      nome: "Operador",
      descricao: "Operações gerais do sistema, cadastros e consultas",
      usuariosCount: 5,
      dataCriacao: "2024-01-01",
      ativo: true,
    },
    {
      id: "estipulante",
      nome: "Estipulante",
      descricao: "Gestão de estipulantes e contratos relacionados",
      usuariosCount: 3,
      dataCriacao: "2024-01-01",
      ativo: true,
    },
    {
      id: "agenciador",
      nome: "Agenciador",
      descricao: "Gestão de agenciadores e comissões",
      usuariosCount: 4,
      dataCriacao: "2024-01-01",
      ativo: true,
    },
    {
      id: "corretor",
      nome: "Corretor",
      descricao: "Gestão de corretores e vendas",
      usuariosCount: 8,
      dataCriacao: "2024-01-01",
      ativo: true,
    },
    {
      id: "financeiro",
      nome: "Financeiro",
      descricao: "Operações financeiras, cobrança e pagamentos",
      usuariosCount: 2,
      dataCriacao: "2024-01-01",
      ativo: true,
    },
    {
      id: "cobranca",
      nome: "Cobrança",
      descricao: "Gestão de cobrança e inadimplência",
      usuariosCount: 3,
      dataCriacao: "2024-01-01",
      ativo: true,
    },
  ])

  const [searchTerm, setSearchTerm] = useState("")
  const [showModal, setShowModal] = useState(false)
  const [editingPerfil, setEditingPerfil] = useState<Perfil | null>(null)
  const [formData, setFormData] = useState({
    nome: "",
    descricao: "",
  })

  const perfisFiltrados = perfis.filter(
    (perfil) =>
      perfil.nome.toLowerCase().includes(searchTerm.toLowerCase()) ||
      perfil.descricao.toLowerCase().includes(searchTerm.toLowerCase()),
  )

  const handleSavePerfil = () => {
    if (!formData.nome || !formData.descricao) {
      toast.error("Preencha todos os campos obrigatórios")
      return
    }

    if (editingPerfil) {
      setPerfis((prev) =>
        prev.map((perfil) =>
          perfil.id === editingPerfil.id ? { ...perfil, nome: formData.nome, descricao: formData.descricao } : perfil,
        ),
      )
      toast.success("Perfil atualizado com sucesso!")
    } else {
      const novoPerfil: Perfil = {
        id: formData.nome.toLowerCase().replace(/\s+/g, "-"),
        nome: formData.nome,
        descricao: formData.descricao,
        usuariosCount: 0,
        dataCriacao: new Date().toISOString().split("T")[0],
        ativo: true,
      }
      setPerfis((prev) => [...prev, novoPerfil])
      toast.success("Perfil criado com sucesso!")
    }

    setShowModal(false)
    setEditingPerfil(null)
    setFormData({ nome: "", descricao: "" })
  }

  const handleDeletePerfil = (id: string) => {
    const perfil = perfis.find((p) => p.id === id)
    if (perfil && perfil.usuariosCount > 0) {
      toast.error("Não é possível excluir um perfil que possui usuários associados")
      return
    }

    setPerfis((prev) => prev.filter((perfil) => perfil.id !== id))
    toast.success("Perfil excluído com sucesso!")
  }

  const handleEditPerfil = (perfil: Perfil) => {
    setEditingPerfil(perfil)
    setFormData({
      nome: perfil.nome,
      descricao: perfil.descricao,
    })
    setShowModal(true)
  }

  const getPerfilColor = (perfil: string) => {
    const colors: Record<string, string> = {
      administrador: "bg-red-100 text-red-800",
      operador: "bg-blue-100 text-blue-800",
      estipulante: "bg-green-100 text-green-800",
      agenciador: "bg-purple-100 text-purple-800",
      corretor: "bg-orange-100 text-orange-800",
      financeiro: "bg-yellow-100 text-yellow-800",
      cobranca: "bg-pink-100 text-pink-800",
    }
    return colors[perfil] || "bg-gray-100 text-gray-800"
  }

  const totalUsuarios = perfis.reduce((sum, perfil) => sum + perfil.usuariosCount, 0)

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-6 py-6">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-3xl font-bold text-foreground">Perfis de Usuário</h1>
            <p className="text-muted-foreground">Gerencie os perfis e permissões do sistema</p>
          </div>
          <Button onClick={() => setShowModal(true)} className="bg-emerald-700 hover:bg-emerald-800">
            <Plus className="h-4 w-4 mr-2" />
            Novo Perfil
          </Button>
        </div>

        {/* Métricas */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
          <Card className="bg-emerald-700 text-white border-0">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-white/90">Total de Perfis</CardTitle>
              <Shield className="h-5 w-5 text-white/80" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{perfis.length}</div>
              <p className="text-xs text-white/80">perfis cadastrados</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Usuários Ativos</CardTitle>
              <Users className="h-5 w-5 text-blue-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-blue-600">{totalUsuarios}</div>
              <p className="text-xs text-muted-foreground">usuários com perfis</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Perfis Ativos</CardTitle>
              <Shield className="h-5 w-5 text-green-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-600">{perfis.filter((p) => p.ativo).length}</div>
              <p className="text-xs text-muted-foreground">perfis ativos</p>
            </CardContent>
          </Card>
        </div>

        {/* Filtros */}
        <Card className="mb-6">
          <CardContent className="pt-6">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
              <Input
                placeholder="Buscar perfis..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
          </CardContent>
        </Card>

        {/* Lista de Perfis */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {perfisFiltrados.map((perfil) => (
            <Card key={perfil.id} className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <Badge className={getPerfilColor(perfil.id)}>{perfil.nome}</Badge>
                  <div className="flex gap-2">
                    <Button variant="outline" size="sm" onClick={() => handleEditPerfil(perfil)}>
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleDeletePerfil(perfil.id)}
                      className="text-red-600 hover:text-red-700"
                      disabled={perfil.usuariosCount > 0}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground mb-4">{perfil.descricao}</p>
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>Usuários:</span>
                    <span className="font-medium">{perfil.usuariosCount}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span>Criado em:</span>
                    <span>{new Date(perfil.dataCriacao).toLocaleDateString("pt-BR")}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span>Status:</span>
                    <Badge variant={perfil.ativo ? "default" : "secondary"}>{perfil.ativo ? "Ativo" : "Inativo"}</Badge>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Modal de Cadastro/Edição */}
        <Dialog open={showModal} onOpenChange={setShowModal}>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>{editingPerfil ? "Editar Perfil" : "Novo Perfil"}</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div>
                <Label htmlFor="nome">Nome do Perfil *</Label>
                <Input
                  id="nome"
                  value={formData.nome}
                  onChange={(e) => setFormData({ ...formData, nome: e.target.value })}
                  placeholder="Ex: Supervisor"
                />
              </div>

              <div>
                <Label htmlFor="descricao">Descrição *</Label>
                <Textarea
                  id="descricao"
                  value={formData.descricao}
                  onChange={(e) => setFormData({ ...formData, descricao: e.target.value })}
                  placeholder="Descreva as responsabilidades e permissões deste perfil"
                  rows={3}
                />
              </div>

              <div className="flex justify-end space-x-2 pt-4">
                <Button variant="outline" onClick={() => setShowModal(false)}>
                  Cancelar
                </Button>
                <Button onClick={handleSavePerfil} className="bg-emerald-700 hover:bg-emerald-800">
                  {editingPerfil ? "Atualizar" : "Criar"} Perfil
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  )
}
