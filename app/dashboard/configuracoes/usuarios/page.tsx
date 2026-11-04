"use client"

import type React from "react"
import { useEffect, useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { toast } from "sonner"
import { Search, SlidersHorizontal, UserRound, UserCheck, UserX, ShieldCheck, Users as UsersIcon } from "lucide-react"

const PlusIcon = ({ className = "w-4 h-4" }: { className?: string }) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
  </svg>
)

const EditIcon = ({ className = "w-4 h-4" }: { className?: string }) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
    />
  </svg>
)

const TrashIcon = ({ className = "w-4 h-4" }: { className?: string }) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
    />
  </svg>
)

export default function ConfiguracoesUsuariosPage() {
  const [showAddUser, setShowAddUser] = useState(false)
  const [users, setUsers] = useState<any[]>([])
  const [loadingUsers, setLoadingUsers] = useState(true)
  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState("todos")
  const [roleFilter, setRoleFilter] = useState("todos")

  useEffect(() => {
    fetch("/api/configuracoes/usuarios")
      .then(async (response) => {
        const data = await response.json()
        if (!response.ok) throw new Error(data.error)
        setUsers(data.map((user: any) => ({
          id: user.id,
          name: user.nome,
          email: user.email,
          role: user.perfil,
          status: user.status,
          lastLogin: user.ultimo_acesso ? new Date(user.ultimo_acesso).toLocaleString("pt-BR") : "Nunca acessou",
          avatar: user.avatar_url,
        })))
      })
      .catch((error) => toast.error(error.message || "Erro ao carregar usuários"))
      .finally(() => setLoadingUsers(false))
  }, [])

  const usuariosAtivos = users.filter((user) => user.status?.toLowerCase() === "ativo").length
  const usuariosInativos = users.length - usuariosAtivos
  const usuariosFiltrados = users.filter((user) => {
    const termo = searchTerm.toLowerCase()
    const combinaTexto = user.name.toLowerCase().includes(termo) || user.email.toLowerCase().includes(termo)
    const combinaStatus = statusFilter === "todos" || user.status?.toLowerCase() === statusFilter
    const combinaPerfil = roleFilter === "todos" || user.role === roleFilter
    return combinaTexto && combinaStatus && combinaPerfil
  })

  const handleAddUser = () => {
    setShowAddUser(true)
  }

  const handleSaveUser = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    const form = new FormData(event.currentTarget)
    const payload = { nome_completo: form.get("nome_completo"), email: form.get("email"), senha: form.get("senha"), tipo_usuario: form.get("tipo_usuario") || "operador", telefone: form.get("telefone") || null }
    const response = await fetch("/api/configuracoes/usuarios", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(payload) })
    const data = await response.json()
    if (!response.ok) return toast.error(data.error || "Não foi possível criar o usuário")
    setUsers((current) => [...current, { id: data.id, name: data.nome, email: data.email, role: data.perfil, status: data.status, lastLogin: "Nunca acessou", avatar: data.avatar_url }])
    setShowAddUser(false)
    toast.success("Usuário criado com sucesso!")
  }

  const handleEditUser = async (userId: number) => {
    const current = users.find((user) => user.id === userId)
    if (!current) return
    const nome = window.prompt("Nome completo", current.name)
    if (!nome) return
    const response = await fetch("/api/configuracoes/usuarios", { method: "PATCH", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ id: userId, nome_completo: nome, email: current.email, tipo_usuario: current.role, status: current.status?.toLowerCase() }) })
    const data = await response.json()
    if (!response.ok) return toast.error(data.error || "Não foi possível atualizar o usuário")
    setUsers((items) => items.map((item) => item.id === userId ? { ...item, name: data.nome } : item))
    toast.success("Usuário atualizado com sucesso")
  }

  const getRoleLabel = (role: string) => ({ administrador: "Administrador", operador: "Operador", consulta: "Consulta" })[role] || role

  const handleDeleteUser = async (userId: number) => {
    if (!window.confirm("Excluir este usuário?")) return
    const response = await fetch(`/api/configuracoes/usuarios?id=${userId}`, { method: "DELETE" })
    const data = await response.json()
    if (!response.ok) return toast.error(data.error || "Não foi possível excluir o usuário")
    setUsers((items) => items.filter((item) => item.id !== userId))
    toast.success("Usuário removido com sucesso")
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="mx-auto max-w-7xl px-6 py-8">
        <div className="mb-8 flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-start gap-4">
            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary ring-1 ring-primary/15">
              <UserRound className="h-6 w-6" />
            </div>
            <div>
              <p className="mb-1 text-xs font-semibold uppercase tracking-[0.18em] text-primary">Administração do sistema</p>
              <h1 className="text-3xl font-bold tracking-tight text-foreground">Cadastro de usuários</h1>
              <p className="mt-1 text-muted-foreground">Gerencie acessos, perfis e status dos usuários.</p>
            </div>
          </div>
          <Button onClick={handleAddUser} className="w-full sm:w-auto">
            <PlusIcon className="mr-2 h-4 w-4" />
            Novo usuário
          </Button>
        </div>

        <div className="mb-8 grid grid-cols-1 gap-4 md:grid-cols-3">
          <Card className="border-primary/20 bg-primary text-primary-foreground shadow-sm">
            <CardContent className="flex items-center justify-between p-5">
              <div><p className="text-sm text-primary-foreground/75">Total de usuários</p><p className="mt-2 text-3xl font-bold">{users.length}</p><p className="text-xs text-primary-foreground/70">cadastros no sistema</p></div>
              <UsersIcon className="h-7 w-7 text-primary-foreground/80" />
            </CardContent>
          </Card>
          <Card className="border-border shadow-sm">
            <CardContent className="flex items-center justify-between p-5">
              <div><p className="text-sm text-muted-foreground">Usuários ativos</p><p className="mt-2 text-3xl font-bold text-primary">{usuariosAtivos}</p><p className="text-xs text-muted-foreground">com acesso liberado</p></div>
              <UserCheck className="h-7 w-7 text-primary" />
            </CardContent>
          </Card>
          <Card className="border-border shadow-sm">
            <CardContent className="flex items-center justify-between p-5">
              <div><p className="text-sm text-muted-foreground">Usuários inativos</p><p className="mt-2 text-3xl font-bold text-muted-foreground">{usuariosInativos}</p><p className="text-xs text-muted-foreground">acesso suspenso</p></div>
              <UserX className="h-7 w-7 text-muted-foreground" />
            </CardContent>
          </Card>
        </div>

        <div className="space-y-6">
          {showAddUser && (
            <Card className="overflow-hidden border-border shadow-sm">
              <CardHeader className="border-b border-border/70 bg-muted/30 px-6 py-5">
                <CardTitle>Novo usuário</CardTitle>
                <CardDescription>Preencha as informações para liberar um novo acesso.</CardDescription>
              </CardHeader>
              <form onSubmit={handleSaveUser}>
              <CardContent className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="new-name">Nome Completo</Label>
                    <Input id="new-name" name="nome_completo" placeholder="Digite o nome completo" required />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="new-email">Email</Label>
                    <Input id="new-email" name="email" type="email" placeholder="Digite o email" required />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="new-role">Perfil de Acesso</Label>
                    <Select name="tipo_usuario" defaultValue="operador">
                      <SelectTrigger>
                        <SelectValue placeholder="Selecione o perfil" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="admin">Administrador</SelectItem>
                        <SelectItem value="operador">Operador</SelectItem>
                        <SelectItem value="consulta">Consulta</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="new-department">Departamento</Label>
                    <Select>
                      <SelectTrigger>
                        <SelectValue placeholder="Selecione o departamento" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="ti">Tecnologia da Informação</SelectItem>
                        <SelectItem value="financeiro">Financeiro</SelectItem>
                        <SelectItem value="operacoes">Operações</SelectItem>
                        <SelectItem value="comercial">Comercial</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="new-password">Senha Temporária</Label>
                    <Input id="new-password" name="senha" type="password" placeholder="Digite a senha temporária" minLength={12} required />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="new-phone">Telefone</Label>
                    <Input id="new-phone" name="telefone" placeholder="(11) 99999-9999" />
                  </div>
                </div>

                <div className="flex items-center space-x-2">
                  <Switch id="send-welcome-email" />
                  <Label htmlFor="send-welcome-email">Enviar email de boas-vindas</Label>
                </div>

                <div className="flex gap-2">
                  <Button type="submit" className="bg-primary text-primary-foreground hover:bg-primary/90">
                    Criar Usuário
                  </Button>
                  <Button variant="outline" onClick={() => setShowAddUser(false)}>
                    Cancelar
                  </Button>
                </div>
              </CardContent>
              </form>
            </Card>
          )}

          <Card className="overflow-hidden border-border shadow-sm">
            <CardHeader className="border-b border-border/70 bg-muted/30 px-6 py-5">
              <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
                <div><CardTitle>Usuários cadastrados</CardTitle><CardDescription>Consulte e gerencie os acessos do sistema.</CardDescription></div>
                <div className="flex items-center gap-2 text-sm text-muted-foreground"><SlidersHorizontal className="h-4 w-4" />{usuariosFiltrados.length} resultado(s)</div>
              </div>
            </CardHeader>
            <CardContent className="space-y-4 p-6">
              <div className="grid grid-cols-1 gap-3 md:grid-cols-[1fr_190px_190px]">
                <div className="relative"><Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" /><Input className="pl-10" placeholder="Buscar por nome ou e-mail..." value={searchTerm} onChange={(event) => setSearchTerm(event.target.value)} /></div>
                <Select value={statusFilter} onValueChange={setStatusFilter}><SelectTrigger><SelectValue placeholder="Status" /></SelectTrigger><SelectContent><SelectItem value="todos">Todos os status</SelectItem><SelectItem value="ativo">Ativos</SelectItem><SelectItem value="inativo">Inativos</SelectItem></SelectContent></Select>
                <Select value={roleFilter} onValueChange={setRoleFilter}><SelectTrigger><SelectValue placeholder="Perfil" /></SelectTrigger><SelectContent><SelectItem value="todos">Todos os perfis</SelectItem><SelectItem value="administrador">Administrador</SelectItem><SelectItem value="operador">Operador</SelectItem><SelectItem value="consulta">Consulta</SelectItem></SelectContent></Select>
              </div>
              <div className="space-y-3">
                {loadingUsers ? <p className="text-sm text-muted-foreground">Carregando usuários do banco...</p> : null}
                {!loadingUsers && users.length === 0 ? <p className="text-sm text-muted-foreground">Nenhum usuário cadastrado.</p> : null}
                {usuariosFiltrados.map((user) => (
                  <div key={user.id} className="flex flex-col gap-4 rounded-xl border border-border/80 bg-background p-4 transition-colors hover:border-primary/30 hover:bg-primary/[0.02] sm:flex-row sm:items-center sm:justify-between">
                    <div className="flex items-center gap-4">
                      <Avatar className="h-12 w-12 ring-4 ring-primary/5">
                        <AvatarImage src={user.avatar || undefined} />
                        <AvatarFallback>
                          {user.name
                            .split(" ")
                            .map((n: string) => n[0])
                            .join("")}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <h4 className="font-medium">{user.name}</h4>
                        <p className="text-sm text-muted-foreground">{user.email}</p>
                        <div className="flex items-center gap-2 mt-1">
                          <Badge className="bg-primary/10 text-primary hover:bg-primary/15">{getRoleLabel(user.role)}</Badge>
                          <Badge variant={user.status === "Ativo" ? "default" : "secondary"}>{user.status}</Badge>
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center justify-between gap-4 sm:text-right">
                      <div><p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">Último acesso</p><p className="mt-1 text-sm font-medium text-foreground">{user.lastLogin}</p></div>
                      <div className="flex gap-2">
                        <Button variant="outline" size="sm" className="h-9 w-9 p-0" aria-label={`Editar ${user.name}`} onClick={() => handleEditUser(user.id)}>
                          <EditIcon className="w-4 h-4" />
                        </Button>
                        <Button variant="outline" size="sm" className="h-9 w-9 p-0 text-destructive hover:text-destructive" aria-label={`Excluir ${user.name}`} onClick={() => handleDeleteUser(user.id)}>
                          <TrashIcon className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          <Card className="overflow-hidden border-border shadow-sm">
            <CardHeader className="border-b border-border/70 bg-muted/30 px-6 py-5">
              <CardTitle className="flex items-center gap-2"><ShieldCheck className="h-5 w-5 text-primary" />Configurações de usuários</CardTitle>
              <CardDescription>Defina as políticas gerais de acesso.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-3 p-6">
              <div className="flex items-center justify-between gap-4 rounded-xl border border-border/80 bg-background p-4">
                <div>
                  <h4 className="font-medium">Forçar Troca de Senha</h4>
                  <p className="text-sm text-muted-foreground">Obrigar usuários a trocar senha no primeiro login</p>
                </div>
                <Switch defaultChecked />
              </div>
              <div className="flex items-center justify-between gap-4 rounded-xl border border-border/80 bg-background p-4">
                <div>
                  <h4 className="font-medium">Sessão Única</h4>
                  <p className="text-sm text-muted-foreground">Permitir apenas uma sessão ativa por usuário</p>
                </div>
                <Switch />
              </div>
              <div className="flex items-center justify-between gap-4 rounded-xl border border-border/80 bg-background p-4">
                <div>
                  <h4 className="font-medium">Timeout de Sessão</h4>
                  <p className="text-sm text-muted-foreground">Deslogar automaticamente após inatividade</p>
                </div>
                <Switch defaultChecked />
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
