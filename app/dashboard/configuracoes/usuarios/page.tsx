"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { toast } from "sonner"

const PlusIcon = () => (
  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
  </svg>
)

const EditIcon = () => (
  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
    />
  </svg>
)

const TrashIcon = () => (
  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
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
  const [users] = useState([
    {
      id: 1,
      name: "Administrador CardBrazil",
      email: "admin@cardbrazil.com.br",
      role: "Administrador",
      status: "Ativo",
      lastLogin: "2024-01-15 14:30",
      avatar: "/professional-avatar.png",
    },
    {
      id: 2,
      name: "Maria Silva",
      email: "maria.silva@cardbrazil.com.br",
      role: "Operador",
      status: "Ativo",
      lastLogin: "2024-01-15 09:15",
      avatar: null,
    },
    {
      id: 3,
      name: "João Santos",
      email: "joao.santos@cardbrazil.com.br",
      role: "Consulta",
      status: "Inativo",
      lastLogin: "2024-01-10 16:45",
      avatar: null,
    },
  ])

  const handleAddUser = () => {
    setShowAddUser(true)
  }

  const handleSaveUser = () => {
    setShowAddUser(false)
    toast.success("Usuário criado com sucesso!")
  }

  const handleEditUser = (userId: number) => {
    toast.success(`Editando usuário ${userId}`)
  }

  const handleDeleteUser = (userId: number) => {
    toast.success(`Usuário ${userId} removido`)
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-6 py-6">
        <div className="mb-6 flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-foreground">Cadastro de Usuários</h1>
            <p className="text-muted-foreground">Gerencie os usuários do sistema</p>
          </div>
          <Button onClick={handleAddUser} className="bg-emerald-700 hover:bg-emerald-800">
            <PlusIcon className="w-4 h-4 mr-2" />
            Novo Usuário
          </Button>
        </div>

        <div className="space-y-6">
          {showAddUser && (
            <Card>
              <CardHeader>
                <CardTitle>Novo Usuário</CardTitle>
                <CardDescription>Preencha as informações do novo usuário</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="new-name">Nome Completo</Label>
                    <Input id="new-name" placeholder="Digite o nome completo" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="new-email">Email</Label>
                    <Input id="new-email" type="email" placeholder="Digite o email" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="new-role">Perfil de Acesso</Label>
                    <Select>
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
                    <Input id="new-password" type="password" placeholder="Digite a senha temporária" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="new-phone">Telefone</Label>
                    <Input id="new-phone" placeholder="(11) 99999-9999" />
                  </div>
                </div>

                <div className="flex items-center space-x-2">
                  <Switch id="send-welcome-email" />
                  <Label htmlFor="send-welcome-email">Enviar email de boas-vindas</Label>
                </div>

                <div className="flex gap-2">
                  <Button onClick={handleSaveUser} className="bg-emerald-700 hover:bg-emerald-800">
                    Criar Usuário
                  </Button>
                  <Button variant="outline" onClick={() => setShowAddUser(false)}>
                    Cancelar
                  </Button>
                </div>
              </CardContent>
            </Card>
          )}

          <Card>
            <CardHeader>
              <CardTitle>Usuários Cadastrados</CardTitle>
              <CardDescription>Lista de todos os usuários do sistema</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {users.map((user) => (
                  <div key={user.id} className="flex items-center justify-between p-4 border rounded-lg">
                    <div className="flex items-center gap-4">
                      <Avatar className="w-12 h-12">
                        <AvatarImage src={user.avatar || undefined} />
                        <AvatarFallback>
                          {user.name
                            .split(" ")
                            .map((n) => n[0])
                            .join("")}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <h4 className="font-medium">{user.name}</h4>
                        <p className="text-sm text-muted-foreground">{user.email}</p>
                        <div className="flex items-center gap-2 mt-1">
                          <Badge variant={user.role === "Administrador" ? "default" : "secondary"}>{user.role}</Badge>
                          <Badge variant={user.status === "Ativo" ? "default" : "destructive"}>{user.status}</Badge>
                        </div>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-sm text-muted-foreground">Último acesso:</p>
                      <p className="text-sm font-medium">{user.lastLogin}</p>
                      <div className="flex gap-2 mt-2">
                        <Button variant="outline" size="sm" onClick={() => handleEditUser(user.id)}>
                          <EditIcon className="w-4 h-4" />
                        </Button>
                        <Button variant="outline" size="sm" onClick={() => handleDeleteUser(user.id)}>
                          <TrashIcon className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Configurações de Usuários</CardTitle>
              <CardDescription>Configure as políticas gerais para usuários</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between p-4 border rounded-lg">
                <div>
                  <h4 className="font-medium">Forçar Troca de Senha</h4>
                  <p className="text-sm text-muted-foreground">Obrigar usuários a trocar senha no primeiro login</p>
                </div>
                <Switch defaultChecked />
              </div>
              <div className="flex items-center justify-between p-4 border rounded-lg">
                <div>
                  <h4 className="font-medium">Sessão Única</h4>
                  <p className="text-sm text-muted-foreground">Permitir apenas uma sessão ativa por usuário</p>
                </div>
                <Switch />
              </div>
              <div className="flex items-center justify-between p-4 border rounded-lg">
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
