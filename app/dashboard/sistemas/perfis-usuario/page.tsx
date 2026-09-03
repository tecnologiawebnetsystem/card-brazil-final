"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Users2, UserPlus, Edit, Search, Shield, Key, Eye, Settings, Crown, User, UserCheck } from "lucide-react"

export default function PerfisUsuarioPage() {
  const [searchTerm, setSearchTerm] = useState("")
  const [profileStats, setProfileStats] = useState<Record<string, { users: number; permissions: number }>>({})

  useEffect(() => {
    fetch("/api/sistemas/perfis")
      .then(async (response) => {
        const data = await response.json()
        if (!response.ok) throw new Error(data.error)
        const nomesPerfis: Record<string, string> = {
          admin: "Administrador",
          administrador: "Administrador",
          operador: "Operador",
          consulta: "Visualizador",
          visualizador: "Visualizador",
          gerente: "Gerente",
        }
        setProfileStats(Object.fromEntries(data.profiles.map((profile: any) => [nomesPerfis[String(profile.nome).toLowerCase()] || profile.nome, {
          users: Number(profile.usuarios || 0),
          permissions: Number(profile.permissoes || 0),
        }])))
      })
      .catch((error) => console.error("[v0] Erro ao carregar perfis", error))
  }, [])

  const userProfiles = [
    {
      id: 1,
      name: "Administrador",
      description: "Acesso total ao sistema",
      users: profileStats.Administrador?.users ?? 0,
      permissions: profileStats.Administrador?.permissions ?? 0,
      color: "red",
      icon: <Crown className="h-4 w-4" />,
    },
    {
      id: 2,
      name: "Gerente",
      description: "Acesso a relatórios e aprovações",
      users: profileStats.Gerente?.users ?? 0,
      permissions: profileStats.Gerente?.permissions ?? 0,
      color: "blue",
      icon: <Shield className="h-4 w-4" />,
    },
    {
      id: 3,
      name: "Operador",
      description: "Operações do dia a dia",
      users: profileStats.Operador?.users ?? 0,
      permissions: profileStats.Operador?.permissions ?? 0,
      color: "green",
      icon: <UserCheck className="h-4 w-4" />,
    },
    {
      id: 4,
      name: "Visualizador",
      description: "Apenas visualização",
      users: profileStats.Visualizador?.users ?? 0,
      permissions: profileStats.Visualizador?.permissions ?? 0,
      color: "gray",
      icon: <Eye className="h-4 w-4" />,
    },
  ]

  const [permissions, setPermissions] = useState<any[]>([])
  const [selectedUserId, setSelectedUserId] = useState<number | null>(null)
  const [permissionUsers, setPermissionUsers] = useState<any[]>([])
  const [savingPermissions, setSavingPermissions] = useState(false)

  useEffect(() => {
    fetch("/api/configuracoes/usuarios").then((response) => response.json()).then(setPermissionUsers).catch((error) => console.error("[v0] Erro ao carregar usuários da matriz", error))
    fetch("/api/sistemas/permissoes")
      .then(async (response) => {
        const data = await response.json()
        if (!response.ok) throw new Error(data.error)
        setPermissions(data.map((permission: any) => ({
          id: permission.id,
          module: permission.modulo,
          code: permission.codigo,
          view: permission.codigo.includes("view") || permission.codigo.includes("read"),
          create: permission.codigo.includes("create") || permission.codigo.includes("write"),
          edit: permission.codigo.includes("edit") || permission.codigo.includes("update"),
          delete: permission.codigo.includes("delete"),
        })))
      })
      .catch((error) => console.error("[v0] Erro ao carregar permissões", error))
  }, [])

  const togglePermission = (id: number, key: "view" | "create" | "edit" | "delete") => {
    setPermissions((current) => current.map((permission) => permission.id === id ? { ...permission, [key]: !permission[key] } : permission))
  }

  const savePermissions = async () => {
    if (!selectedUserId) return
    setSavingPermissions(true)
    try {
      const response = await fetch("/api/sistemas/permissoes", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ usuarioId: selectedUserId, permissaoIds: permissions.filter((permission) => permission.view || permission.create || permission.edit || permission.delete).map((permission) => permission.id) }),
      })
      if (!response.ok) throw new Error("Não foi possível salvar as permissões")
    } catch (error) {
      console.error("[v0] Erro ao salvar permissões", error)
    } finally {
      setSavingPermissions(false)
    }
  }

  return (
    <div className="flex-1 space-y-6 p-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Perfis de Usuário</h1>
          <p className="text-muted-foreground">Gerencie perfis de acesso e permissões por grupo de usuários</p>
        </div>
        <Button className="gap-2">
          <UserPlus className="h-4 w-4" />
          Novo Perfil
        </Button>
      </div>

      <div className="grid gap-6 md:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total de Perfis</CardTitle>
            <Users2 className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{userProfiles.length}</div>
            <p className="text-xs text-muted-foreground">Perfis configurados</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Usuários Ativos</CardTitle>
            <User className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{userProfiles.reduce((total, profile) => total + profile.users, 0)}</div>
            <p className="text-xs text-muted-foreground">Distribuídos nos perfis</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Permissões</CardTitle>
            <Key className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{userProfiles.reduce((total, profile) => total + profile.permissions, 0)}</div>
            <p className="text-xs text-muted-foreground">Total configuradas</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Perfil Mais Usado</CardTitle>
            <UserCheck className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{Object.entries(profileStats).sort(([, a], [, b]) => b.users - a.users)[0]?.[0] || "—"}</div>
            <p className="text-xs text-muted-foreground">{Object.entries(profileStats).sort(([, a], [, b]) => b.users - a.users)[0]?.[1].users || 0} usuários</p>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="profiles" className="space-y-4">
        <TabsList>
          <TabsTrigger value="profiles">Perfis</TabsTrigger>
          <TabsTrigger value="permissions">Permissões</TabsTrigger>
          <TabsTrigger value="users">Usuários por Perfil</TabsTrigger>
          <TabsTrigger value="settings">Configurações</TabsTrigger>
        </TabsList>

        <TabsContent value="profiles" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Perfis de Usuário</CardTitle>
              <CardDescription>Configure diferentes níveis de acesso ao sistema</CardDescription>
              <div className="flex items-center space-x-2">
                <Search className="h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Buscar perfis..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="max-w-sm"
                />
              </div>
            </CardHeader>
            <CardContent>
              <div className="grid gap-4 md:grid-cols-2">
                {userProfiles.map((profile) => (
                  <Card key={profile.id} className="relative">
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <div className={`p-2 rounded-lg bg-${profile.color}-100`}>{profile.icon}</div>
                        {profile.name}
                      </CardTitle>
                      <CardDescription>{profile.description}</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="flex items-center justify-between">
                        <span className="text-sm">Usuários</span>
                        <Badge variant="outline">{profileStats[profile.name.toLowerCase()]?.users ?? profile.users}</Badge>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-sm">Permissões</span>
                        <Badge variant="outline">{profileStats[profile.name.toLowerCase()]?.permissions ?? profile.permissions}</Badge>
                      </div>
                      <div className="flex items-center gap-2">
                        <Button variant="outline" size="sm" className="flex-1 bg-transparent">
                          <Edit className="h-4 w-4 mr-1" />
                          Editar
                        </Button>
                        <Button variant="outline" size="sm" className="flex-1 bg-transparent">
                          <Eye className="h-4 w-4 mr-1" />
                          Visualizar
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="permissions" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Matriz de Permissões</CardTitle>
              <CardDescription>Configure permissões detalhadas por módulo (exemplo: Perfil Operador)</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b">
                      <th className="text-left p-2">Módulo</th>
                      <th className="text-center p-2">Visualizar</th>
                      <th className="text-center p-2">Criar</th>
                      <th className="text-center p-2">Editar</th>
                      <th className="text-center p-2">Excluir</th>
                    </tr>
                  </thead>
                  <tbody>
                    {permissions.map((perm, index) => (
                      <tr key={index} className="border-b">
                        <td className="p-2 font-medium">{perm.module}</td>
                        <td className="text-center p-2">
                          <input type="checkbox" checked={perm.view} onChange={() => togglePermission(perm.id, "view")} aria-label={`${perm.module} visualizar`} />
                        </td>
                        <td className="text-center p-2">
                          <input type="checkbox" checked={perm.create} onChange={() => togglePermission(perm.id, "create")} aria-label={`${perm.module} criar`} />
                        </td>
                        <td className="text-center p-2">
                          <input type="checkbox" checked={perm.edit} onChange={() => togglePermission(perm.id, "edit")} aria-label={`${perm.module} editar`} />
                        </td>
                        <td className="text-center p-2">
                          <input type="checkbox" checked={perm.delete} onChange={() => togglePermission(perm.id, "delete")} aria-label={`${perm.module} excluir`} />
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              <div className="mt-4 flex items-center gap-3">
                <select className="rounded-md border bg-background p-2 text-sm" value={selectedUserId ?? ""} onChange={(event) => setSelectedUserId(event.target.value ? Number(event.target.value) : null)} aria-label="Usuário para permissões">
                  <option value="">Selecione um usuário</option>
                  {permissionUsers.map((user) => <option key={user.id} value={user.id}>{user.nome} — {user.email}</option>) }
                </select>
                <Button onClick={savePermissions} disabled={!selectedUserId || savingPermissions}>{savingPermissions ? "Salvando..." : "Salvar Permissões"}</Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="users" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2">
            {userProfiles.map((profile) => (
              <Card key={profile.id}>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    {profile.icon}
                    {profile.name}
                  </CardTitle>
                  <CardDescription>{profile.users} usuários neste perfil</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    {permissionUsers.filter((user) => String(user.tipo_usuario || user.perfil || "") === profile.name).slice(0, 5).map((user) => (
                      <div key={user.id} className="flex items-center justify-between rounded border p-2">
                        <span className="text-sm">{user.nome || user.name || user.email}</span>
                        <Badge variant="outline">{profile.name}</Badge>
                      </div>
                    ))}
                    {permissionUsers.filter((user) => String(user.tipo_usuario || user.perfil || "") === profile.name).length === 0 && (
                      <p className="text-sm text-muted-foreground">Nenhum usuário deste perfil encontrado.</p>
                    )}
                  </div>
                  <Button variant="outline" size="sm" className="w-full mt-3 bg-transparent">
                    Ver Todos os Usuários
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="settings" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Settings className="h-5 w-5" />
                Configurações de Perfis
              </CardTitle>
              <CardDescription>Configurações gerais para gerenciamento de perfis</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">Perfil padrão para novos usuários</label>
                <select className="w-full p-2 border rounded-md">
                  <option>Visualizador</option>
                  <option>Operador</option>
                  <option>Gerente</option>
                </select>
              </div>
              <div className="flex items-center space-x-2">
                <input type="checkbox" id="auto-assign" defaultChecked />
                <label htmlFor="auto-assign" className="text-sm">
                  Atribuir perfil automaticamente baseado no departamento
                </label>
              </div>
              <div className="flex items-center space-x-2">
                <input type="checkbox" id="notify-changes" defaultChecked />
                <label htmlFor="notify-changes" className="text-sm">
                  Notificar usuários sobre mudanças de perfil
                </label>
              </div>
              <div className="flex items-center space-x-2">
                <input type="checkbox" id="audit-profile-changes" defaultChecked />
                <label htmlFor="audit-profile-changes" className="text-sm">
                  Registrar alterações de perfil no log de auditoria
                </label>
              </div>
              <Button className="w-full">Salvar Configurações</Button>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
