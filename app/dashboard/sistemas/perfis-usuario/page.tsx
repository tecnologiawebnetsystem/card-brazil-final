"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Users2, UserPlus, Edit, Search, Shield, Key, Eye, Settings, Crown, User, UserCheck } from "lucide-react"

export default function PerfisUsuarioPage() {
  const [searchTerm, setSearchTerm] = useState("")

  const userProfiles = [
    {
      id: 1,
      name: "Administrador",
      description: "Acesso total ao sistema",
      users: 3,
      permissions: 45,
      color: "red",
      icon: <Crown className="h-4 w-4" />,
    },
    {
      id: 2,
      name: "Gerente",
      description: "Acesso a relatórios e aprovações",
      users: 8,
      permissions: 32,
      color: "blue",
      icon: <Shield className="h-4 w-4" />,
    },
    {
      id: 3,
      name: "Operador",
      description: "Operações do dia a dia",
      users: 25,
      permissions: 18,
      color: "green",
      icon: <UserCheck className="h-4 w-4" />,
    },
    {
      id: 4,
      name: "Visualizador",
      description: "Apenas visualização",
      users: 12,
      permissions: 8,
      color: "gray",
      icon: <Eye className="h-4 w-4" />,
    },
  ]

  const permissions = [
    { module: "Dashboard", view: true, create: false, edit: false, delete: false },
    { module: "Cadastros", view: true, create: true, edit: true, delete: false },
    { module: "Propostas", view: true, create: true, edit: true, delete: false },
    { module: "Beneficiários", view: true, create: false, edit: true, delete: false },
    { module: "Cobrança", view: true, create: false, edit: false, delete: false },
    { module: "Relatórios", view: true, create: false, edit: false, delete: false },
    { module: "Configurações", view: false, create: false, edit: false, delete: false },
  ]

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
            <div className="text-2xl font-bold">4</div>
            <p className="text-xs text-muted-foreground">Perfis configurados</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Usuários Ativos</CardTitle>
            <User className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">48</div>
            <p className="text-xs text-muted-foreground">Distribuídos nos perfis</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Permissões</CardTitle>
            <Key className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">103</div>
            <p className="text-xs text-muted-foreground">Total configuradas</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Perfil Mais Usado</CardTitle>
            <UserCheck className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">Operador</div>
            <p className="text-xs text-muted-foreground">25 usuários</p>
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
                        <Badge variant="outline">{profile.users}</Badge>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-sm">Permissões</span>
                        <Badge variant="outline">{profile.permissions}</Badge>
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
                          <input type="checkbox" checked={perm.view} readOnly />
                        </td>
                        <td className="text-center p-2">
                          <input type="checkbox" checked={perm.create} readOnly />
                        </td>
                        <td className="text-center p-2">
                          <input type="checkbox" checked={perm.edit} readOnly />
                        </td>
                        <td className="text-center p-2">
                          <input type="checkbox" checked={perm.delete} readOnly />
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              <Button className="mt-4">Salvar Permissões</Button>
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
                    {profile.name === "Administrador" && (
                      <>
                        <div className="flex items-center justify-between p-2 border rounded">
                          <span className="text-sm">João Silva</span>
                          <Badge variant="outline">Admin</Badge>
                        </div>
                        <div className="flex items-center justify-between p-2 border rounded">
                          <span className="text-sm">Maria Santos</span>
                          <Badge variant="outline">Admin</Badge>
                        </div>
                        <div className="flex items-center justify-between p-2 border rounded">
                          <span className="text-sm">Carlos Oliveira</span>
                          <Badge variant="outline">Admin</Badge>
                        </div>
                      </>
                    )}
                    {profile.name === "Gerente" && (
                      <>
                        <div className="flex items-center justify-between p-2 border rounded">
                          <span className="text-sm">Ana Costa</span>
                          <Badge variant="outline">Manager</Badge>
                        </div>
                        <div className="flex items-center justify-between p-2 border rounded">
                          <span className="text-sm">Pedro Lima</span>
                          <Badge variant="outline">Manager</Badge>
                        </div>
                        <div className="text-sm text-muted-foreground">+6 usuários</div>
                      </>
                    )}
                    {profile.name === "Operador" && (
                      <>
                        <div className="flex items-center justify-between p-2 border rounded">
                          <span className="text-sm">Lucia Ferreira</span>
                          <Badge variant="outline">Operator</Badge>
                        </div>
                        <div className="flex items-center justify-between p-2 border rounded">
                          <span className="text-sm">Roberto Souza</span>
                          <Badge variant="outline">Operator</Badge>
                        </div>
                        <div className="text-sm text-muted-foreground">+23 usuários</div>
                      </>
                    )}
                    {profile.name === "Visualizador" && (
                      <>
                        <div className="flex items-center justify-between p-2 border rounded">
                          <span className="text-sm">Fernanda Alves</span>
                          <Badge variant="outline">Viewer</Badge>
                        </div>
                        <div className="flex items-center justify-between p-2 border rounded">
                          <span className="text-sm">Marcos Pereira</span>
                          <Badge variant="outline">Viewer</Badge>
                        </div>
                        <div className="text-sm text-muted-foreground">+10 usuários</div>
                      </>
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
