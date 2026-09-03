"use client"

import { useEffect, useMemo, useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Lock, Unlock, Shield, Users, Key, Search, Plus, Edit, Trash2, Eye, Clock, AlertTriangle } from "lucide-react"

export default function ControleAcessoPage() {
  const [searchTerm, setSearchTerm] = useState("")
  const [profiles, setProfiles] = useState<any[]>([])
  const [logs, setLogs] = useState<any[]>([])
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    Promise.all([fetch("/api/sistemas/perfis"), fetch("/api/sistemas/logs")])
      .then(async ([profilesResponse, logsResponse]) => {
        const profilesData = await profilesResponse.json()
        const logsData = await logsResponse.json()
        if (!profilesResponse.ok || !logsResponse.ok) throw new Error(profilesData.error || logsData.error)
        setProfiles(Array.isArray(profilesData.profiles) ? profilesData.profiles : [])
        setLogs(Array.isArray(logsData) ? logsData : Array.isArray(logsData.logs) ? logsData.logs : [])
      })
      .catch((cause) => setError(cause instanceof Error ? cause.message : "Não foi possível carregar os dados."))
  }, [])

  const accessRules = useMemo(() => profiles.filter((profile) => String(profile.nome || "").toLowerCase().includes(searchTerm.toLowerCase())).map((profile) => ({ id: profile.nome, resource: "Perfil de usuário", action: `${profile.permissoes || 0} permissões`, role: profile.nome, status: "Ativo" })), [profiles, searchTerm])
  const activeUsers = profiles.flatMap((profile) => Array.from({ length: Number(profile.usuarios || 0) }, (_, index) => ({ id: `${profile.nome}-${index}`, name: profile.nome, role: profile.nome, lastAccess: "Disponível no log de auditoria", ip: "—" })))

  return (
    <div className="flex-1 space-y-6 p-6">
      {error && <p className="rounded-md border border-destructive/30 bg-destructive/10 p-3 text-sm text-destructive">{error}</p>}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Controle de Acesso</h1>
          <p className="text-muted-foreground">
            Gerencie permissões, regras de acesso e monitore atividades dos usuários
          </p>
        </div>
        <Button className="gap-2">
          <Plus className="h-4 w-4" />
          Nova Regra
        </Button>
      </div>

      <div className="grid gap-6 md:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Usuários Ativos</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{activeUsers.length}</div>
              <p className="text-xs text-muted-foreground">Conforme registros do sistema</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Regras Ativas</CardTitle>
            <Shield className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{accessRules.length}</div>
            <p className="text-xs text-muted-foreground">Regras configuradas</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Tentativas Bloqueadas</CardTitle>
            <Lock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">12</div>
            <p className="text-xs text-muted-foreground">Últimas 24h</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Alertas de Segurança</CardTitle>
            <AlertTriangle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">3</div>
            <p className="text-xs text-muted-foreground">Requer atenção</p>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="rules" className="space-y-4">
        <TabsList>
          <TabsTrigger value="rules">Regras de Acesso</TabsTrigger>
          <TabsTrigger value="users">Usuários Ativos</TabsTrigger>
          <TabsTrigger value="logs">Logs de Acesso</TabsTrigger>
          <TabsTrigger value="settings">Configurações</TabsTrigger>
        </TabsList>

        <TabsContent value="rules" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Regras de Acesso</CardTitle>
              <CardDescription>Configure permissões por recurso e perfil de usuário</CardDescription>
              <div className="flex items-center space-x-2">
                <Search className="h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Buscar regras..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="max-w-sm"
                />
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {accessRules.map((rule) => (
                  <div key={rule.id} className="flex items-center justify-between p-4 border rounded-lg">
                    <div className="flex items-center gap-4">
                      <div className="flex items-center gap-2">
                        {rule.status === "Ativo" ? (
                          <Unlock className="h-4 w-4 text-green-600" />
                        ) : (
                          <Lock className="h-4 w-4 text-red-600" />
                        )}
                        <span className="font-medium">{rule.resource}</span>
                      </div>
                      <Badge variant="outline">{rule.action}</Badge>
                      <span className="text-sm text-muted-foreground">{rule.role}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Badge
                        className={rule.status === "Ativo" ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"}
                      >
                        {rule.status}
                      </Badge>
                      <Button variant="ghost" size="sm">
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button variant="ghost" size="sm">
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="users" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Usuários Conectados</CardTitle>
              <CardDescription>Usuários atualmente logados no sistema</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {activeUsers.map((user) => (
                  <div key={user.id} className="flex items-center justify-between p-4 border rounded-lg">
                    <div className="flex items-center gap-4">
                      <div className="flex items-center gap-2">
                        <div className="h-2 w-2 bg-green-500 rounded-full"></div>
                        <span className="font-medium">{user.name}</span>
                      </div>
                      <Badge variant="outline">{user.role}</Badge>
                    </div>
                    <div className="flex items-center gap-4 text-sm text-muted-foreground">
                      <span>{user.ip}</span>
                      <span>{user.lastAccess}</span>
                      <Button variant="ghost" size="sm">
                        <Eye className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="logs" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Logs de Acesso</CardTitle>
              <CardDescription>Histórico de tentativas de acesso e ações realizadas</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {logs.map((log, index) => (
                  <div key={index} className="flex items-center justify-between p-3 border rounded-lg">
                    <div className="flex items-center gap-4">
                      <Clock className="h-4 w-4 text-muted-foreground" />
                      <span className="text-sm font-mono">{log.timestamp ? new Date(log.timestamp).toLocaleTimeString("pt-BR") : "—"}</span>
                      <span className="text-sm">{log.usuario || "Sistema"}</span>
                      <span className="text-sm text-muted-foreground">{log.action}</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <span className="text-sm text-muted-foreground">{log.ip}</span>
                      <Badge
                        className={log.status !== "Falha" ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"}
                      >
                        {log.status}
                      </Badge>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="settings" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Key className="h-5 w-5" />
                  Configurações de Segurança
                </CardTitle>
                <CardDescription>Parâmetros gerais de controle de acesso</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium">Tempo limite de sessão (minutos)</label>
                  <Input type="number" defaultValue="120" />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium">Máximo de tentativas de login</label>
                  <Input type="number" defaultValue="3" />
                </div>
                <div className="flex items-center space-x-2">
                  <input type="checkbox" id="force-2fa" defaultChecked />
                  <label htmlFor="force-2fa" className="text-sm">
                    Forçar autenticação de dois fatores
                  </label>
                </div>
                <div className="flex items-center space-x-2">
                  <input type="checkbox" id="log-all-actions" defaultChecked />
                  <label htmlFor="log-all-actions" className="text-sm">
                    Registrar todas as ações dos usuários
                  </label>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Políticas de Senha</CardTitle>
                <CardDescription>Requisitos para senhas de usuários</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium">Comprimento mínimo</label>
                  <Input type="number" defaultValue="8" />
                </div>
                <div className="flex items-center space-x-2">
                  <input type="checkbox" id="require-uppercase" defaultChecked />
                  <label htmlFor="require-uppercase" className="text-sm">
                    Exigir letras maiúsculas
                  </label>
                </div>
                <div className="flex items-center space-x-2">
                  <input type="checkbox" id="require-numbers" defaultChecked />
                  <label htmlFor="require-numbers" className="text-sm">
                    Exigir números
                  </label>
                </div>
                <div className="flex items-center space-x-2">
                  <input type="checkbox" id="require-symbols" />
                  <label htmlFor="require-symbols" className="text-sm">
                    Exigir símbolos especiais
                  </label>
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium">Expiração da senha (dias)</label>
                  <Input type="number" defaultValue="90" />
                </div>
              </CardContent>
            </Card>
          </div>
          <Button className="w-full">Salvar Configurações</Button>
        </TabsContent>
      </Tabs>
    </div>
  )
}
