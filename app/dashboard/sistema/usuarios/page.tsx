"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { toast } from "sonner"
import { Search, Plus, Edit, Trash2, Users, UserCheck, UserX } from "lucide-react"

interface Usuario {
  id: number
  pessoaId: number
  nome: string
  email: string
  perfil: string
  ativo: boolean
  dataUltimoLogin?: string
  dataCriacao: string
}

interface Pessoa {
  id: number
  nome: string
  email: string
  documento: string
  tipo: "fisica" | "juridica"
}

interface Perfil {
  id: string
  nome: string
  descricao: string
}

const perfisDisponiveis: Perfil[] = [
  { id: "administrador", nome: "Administrador", descricao: "Acesso total ao sistema" },
  { id: "operador", nome: "Operador", descricao: "Operações gerais do sistema" },
  { id: "estipulante", nome: "Estipulante", descricao: "Gestão de estipulantes" },
  { id: "agenciador", nome: "Agenciador", descricao: "Gestão de agenciadores" },
  { id: "corretor", nome: "Corretor", descricao: "Gestão de corretores" },
  { id: "financeiro", nome: "Financeiro", descricao: "Operações financeiras" },
  { id: "atendente", nome: "Atendente", descricao: "Atendimento ao cliente" },
]

const pessoasMock: Pessoa[] = [
  { id: 1, nome: "João Silva Santos", email: "joao@email.com", documento: "123.456.789-00", tipo: "fisica" },
  { id: 2, nome: "Maria Oliveira Costa", email: "maria@email.com", documento: "987.654.321-00", tipo: "fisica" },
  {
    id: 3,
    nome: "Tech Solutions LTDA",
    email: "contato@techsolutions.com",
    documento: "12.345.678/0001-90",
    tipo: "juridica",
  },
  { id: 4, nome: "Carlos Eduardo Lima", email: "carlos@email.com", documento: "456.789.123-00", tipo: "fisica" },
  {
    id: 5,
    nome: "Inovação Digital S.A.",
    email: "admin@inovacao.com",
    documento: "98.765.432/0001-10",
    tipo: "juridica",
  },
]

export default function UsuariosPage() {
  const [usuarios, setUsuarios] = useState<Usuario[]>([
    {
      id: 1,
      pessoaId: 1,
      nome: "João Silva Santos",
      email: "joao@email.com",
      perfil: "administrador",
      ativo: true,
      dataUltimoLogin: "2024-01-15 14:30:00",
      dataCriacao: "2024-01-01",
    },
    {
      id: 2,
      pessoaId: 2,
      nome: "Maria Oliveira Costa",
      email: "maria@email.com",
      perfil: "operador",
      ativo: true,
      dataUltimoLogin: "2024-01-14 09:15:00",
      dataCriacao: "2024-01-05",
    },
    {
      id: 3,
      pessoaId: 4,
      nome: "Carlos Eduardo Lima",
      email: "carlos@email.com",
      perfil: "financeiro",
      ativo: false,
      dataCriacao: "2024-01-10",
    },
  ])

  const [searchTerm, setSearchTerm] = useState("")
  const [filtroAtivo, setFiltroAtivo] = useState<string>("todos")
  const [filtroPerfil, setFiltroPerfil] = useState<string>("todos")
  const [showModal, setShowModal] = useState(false)
  const [editingUsuario, setEditingUsuario] = useState<Usuario | null>(null)
  const [formData, setFormData] = useState({
    pessoaId: "",
    perfil: "",
    ativo: true,
  })

  const usuariosFiltrados = usuarios.filter((usuario) => {
    const matchesSearch =
      usuario.nome.toLowerCase().includes(searchTerm.toLowerCase()) ||
      usuario.email.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesAtivo =
      filtroAtivo === "todos" ||
      (filtroAtivo === "ativo" && usuario.ativo) ||
      (filtroAtivo === "inativo" && !usuario.ativo)
    const matchesPerfil = filtroPerfil === "todos" || usuario.perfil === filtroPerfil

    return matchesSearch && matchesAtivo && matchesPerfil
  })

  const handleSaveUsuario = () => {
    if (!formData.pessoaId || !formData.perfil) {
      toast.error("Preencha todos os campos obrigatórios")
      return
    }

    const pessoaSelecionada = pessoasMock.find((p) => p.id === Number.parseInt(formData.pessoaId))
    if (!pessoaSelecionada) {
      toast.error("Pessoa não encontrada")
      return
    }

    if (editingUsuario) {
      setUsuarios((prev) =>
        prev.map((usuario) =>
          usuario.id === editingUsuario.id
            ? {
                ...usuario,
                pessoaId: Number.parseInt(formData.pessoaId),
                nome: pessoaSelecionada.nome,
                email: pessoaSelecionada.email,
                perfil: formData.perfil,
                ativo: formData.ativo,
              }
            : usuario,
        ),
      )
      toast.success("Usuário atualizado com sucesso!")
    } else {
      const novoUsuario: Usuario = {
        id: Math.max(...usuarios.map((u) => u.id)) + 1,
        pessoaId: Number.parseInt(formData.pessoaId),
        nome: pessoaSelecionada.nome,
        email: pessoaSelecionada.email,
        perfil: formData.perfil,
        ativo: formData.ativo,
        dataCriacao: new Date().toISOString().split("T")[0],
      }
      setUsuarios((prev) => [...prev, novoUsuario])
      toast.success("Usuário criado com sucesso!")
    }

    setShowModal(false)
    setEditingUsuario(null)
    setFormData({ pessoaId: "", perfil: "", ativo: true })
  }

  const handleDeleteUsuario = (id: number) => {
    setUsuarios((prev) => prev.filter((usuario) => usuario.id !== id))
    toast.success("Usuário excluído com sucesso!")
  }

  const handleEditUsuario = (usuario: Usuario) => {
    setEditingUsuario(usuario)
    setFormData({
      pessoaId: usuario.pessoaId.toString(),
      perfil: usuario.perfil,
      ativo: usuario.ativo,
    })
    setShowModal(true)
  }

  const toggleUsuarioAtivo = (id: number) => {
    setUsuarios((prev) => prev.map((usuario) => (usuario.id === id ? { ...usuario, ativo: !usuario.ativo } : usuario)))
    toast.success("Status do usuário atualizado!")
  }

  const getPerfilNome = (perfilId: string) => {
    return perfisDisponiveis.find((p) => p.id === perfilId)?.nome || perfilId
  }

  const getPerfilColor = (perfil: string) => {
    const colors: Record<string, string> = {
      administrador: "bg-red-100 text-red-800",
      operador: "bg-blue-100 text-blue-800",
      estipulante: "bg-green-100 text-green-800",
      agenciador: "bg-purple-100 text-purple-800",
      corretor: "bg-orange-100 text-orange-800",
      financeiro: "bg-yellow-100 text-yellow-800",
      atendente: "bg-gray-100 text-gray-800",
    }
    return colors[perfil] || "bg-gray-100 text-gray-800"
  }

  const usuariosAtivos = usuarios.filter((u) => u.ativo).length
  const usuariosInativos = usuarios.filter((u) => !u.ativo).length

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-6 py-6">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-3xl font-bold text-foreground">Usuários</h1>
            <p className="text-muted-foreground">Gerencie os usuários do sistema</p>
          </div>
          <Button onClick={() => setShowModal(true)} className="bg-emerald-700 hover:bg-emerald-800">
            <Plus className="h-4 w-4 mr-2" />
            Novo Usuário
          </Button>
        </div>

        {/* Métricas */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
          <Card className="bg-emerald-700 text-white border-0">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-white/90">Total de Usuários</CardTitle>
              <Users className="h-5 w-5 text-white/80" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{usuarios.length}</div>
              <p className="text-xs text-white/80">usuários cadastrados</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Usuários Ativos</CardTitle>
              <UserCheck className="h-5 w-5 text-green-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-600">{usuariosAtivos}</div>
              <p className="text-xs text-muted-foreground">usuários ativos</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Usuários Inativos</CardTitle>
              <UserX className="h-5 w-5 text-red-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-red-600">{usuariosInativos}</div>
              <p className="text-xs text-muted-foreground">usuários inativos</p>
            </CardContent>
          </Card>
        </div>

        {/* Filtros */}
        <Card className="mb-6">
          <CardContent className="pt-6">
            <div className="flex flex-col md:flex-row gap-4">
              <div className="flex-1">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                  <Input
                    placeholder="Buscar por nome ou email..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10"
                  />
                </div>
              </div>
              <Select value={filtroAtivo} onValueChange={setFiltroAtivo}>
                <SelectTrigger className="w-full md:w-48">
                  <SelectValue placeholder="Status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="todos">Todos os Status</SelectItem>
                  <SelectItem value="ativo">Apenas Ativos</SelectItem>
                  <SelectItem value="inativo">Apenas Inativos</SelectItem>
                </SelectContent>
              </Select>
              <Select value={filtroPerfil} onValueChange={setFiltroPerfil}>
                <SelectTrigger className="w-full md:w-48">
                  <SelectValue placeholder="Perfil" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="todos">Todos os Perfis</SelectItem>
                  {perfisDisponiveis.map((perfil) => (
                    <SelectItem key={perfil.id} value={perfil.id}>
                      {perfil.nome}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>

        {/* Lista de Usuários */}
        <Card>
          <CardHeader>
            <CardTitle>Lista de Usuários ({usuariosFiltrados.length})</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {usuariosFiltrados.map((usuario) => (
                <div key={usuario.id} className="flex items-center justify-between p-4 border rounded-lg">
                  <div className="flex items-center space-x-4">
                    <div className="w-10 h-10 bg-emerald-100 rounded-full flex items-center justify-center">
                      <Users className="h-5 w-5 text-emerald-700" />
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <h3 className="font-medium">{usuario.nome}</h3>
                        <Badge className={getPerfilColor(usuario.perfil)}>{getPerfilNome(usuario.perfil)}</Badge>
                        <Badge variant={usuario.ativo ? "default" : "secondary"}>
                          {usuario.ativo ? "Ativo" : "Inativo"}
                        </Badge>
                      </div>
                      <p className="text-sm text-muted-foreground">{usuario.email}</p>
                      <p className="text-xs text-muted-foreground">
                        Criado em: {new Date(usuario.dataCriacao).toLocaleDateString("pt-BR")}
                        {usuario.dataUltimoLogin && (
                          <> • Último login: {new Date(usuario.dataUltimoLogin).toLocaleString("pt-BR")}</>
                        )}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Switch checked={usuario.ativo} onCheckedChange={() => toggleUsuarioAtivo(usuario.id)} />
                    <Button variant="outline" size="sm" onClick={() => handleEditUsuario(usuario)}>
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleDeleteUsuario(usuario.id)}
                      className="text-red-600 hover:text-red-700"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Modal de Cadastro/Edição */}
        <Dialog open={showModal} onOpenChange={setShowModal}>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>{editingUsuario ? "Editar Usuário" : "Novo Usuário"}</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div>
                <Label htmlFor="pessoa">Pessoa *</Label>
                <Select
                  value={formData.pessoaId}
                  onValueChange={(value) => setFormData({ ...formData, pessoaId: value })}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione uma pessoa" />
                  </SelectTrigger>
                  <SelectContent>
                    {pessoasMock.map((pessoa) => (
                      <SelectItem key={pessoa.id} value={pessoa.id.toString()}>
                        {pessoa.nome} - {pessoa.documento}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label htmlFor="perfil">Perfil *</Label>
                <Select value={formData.perfil} onValueChange={(value) => setFormData({ ...formData, perfil: value })}>
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione um perfil" />
                  </SelectTrigger>
                  <SelectContent>
                    {perfisDisponiveis.map((perfil) => (
                      <SelectItem key={perfil.id} value={perfil.id}>
                        {perfil.nome} - {perfil.descricao}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="flex items-center space-x-2">
                <Switch
                  id="ativo"
                  checked={formData.ativo}
                  onCheckedChange={(checked) => setFormData({ ...formData, ativo: checked })}
                />
                <Label htmlFor="ativo">Usuário ativo</Label>
              </div>

              <div className="flex justify-end space-x-2 pt-4">
                <Button variant="outline" onClick={() => setShowModal(false)}>
                  Cancelar
                </Button>
                <Button onClick={handleSaveUsuario} className="bg-emerald-700 hover:bg-emerald-800">
                  {editingUsuario ? "Atualizar" : "Criar"} Usuário
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  )
}
