"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  Shield,
  AlertTriangle,
  Lock,
  Unlock,
  Search,
  Download,
  Clock,
  User,
  Activity,
  Eye,
  Settings,
  RefreshCw,
} from "lucide-react"

export default function LogsSegurancaPage() {
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedFilter, setSelectedFilter] = useState("all")

  const securityLogs = [
    {
      id: 1,
      timestamp: "2024-01-15 14:30:25",
      user: "João Silva",
      action: "Login realizado",
      ip: "192.168.1.100",
      status: "Sucesso",
      severity: "Info",
      details: "Login via navegador Chrome",
    },
    {
      id: 2,
      timestamp: "2024-01-15 14:28:15",
      user: "Sistema",
      action: "Tentativa de acesso não autorizado",
      ip: "192.168.1.200",
      status: "Bloqueado",
      severity: "Alto",
      details: "Múltiplas tentativas de login falharam",
    },
    {
      id: 3,
      timestamp: "2024-01-15 14:25:10",
      user: "Maria Santos",
      action: "Alteração de permissões",
      ip: "192.168.1.101",
      status: "Sucesso",
      severity: "Médio",
      details: "Permissões do usuário Carlos alteradas",
    },
    {
      id: 4,
      timestamp: "2024-01-15 14:20:05",
      user: "Carlos Oliveira",
      action: "Acesso a dados sensíveis",
      ip: "192.168.1.102",
      status: "Sucesso",
      severity: "Médio",
      details: "Visualização de relatório financeiro",
    },
    {
      id: 5,
      timestamp: "2024-01-15 14:15:30",
      user: "Sistema",
      action: "Falha na autenticação 2FA",
      ip: "192.168.1.150",
      status: "Falha",
      severity: "Alto",
      details: "Token 2FA inválido fornecido",
    },
  ]

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case "Alto":
        return "bg-red-100 text-red-800"
      case "Médio":
        return "bg-yellow-100 text-yellow-800"
      case "Info":
        return "bg-blue-100 text-blue-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Sucesso":
        return "bg-green-100 text-green-800"
      case "Falha":
        return "bg-red-100 text-red-800"
      case "Bloqueado":
        return "bg-orange-100 text-orange-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  return (
    <div className="flex-1 space-y-6 p-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Logs de Segurança</h1>
          <p className="text-muted-foreground">Monitore atividades de segurança e eventos críticos do sistema</p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" className="gap-2 bg-transparent">
            <Download className="h-4 w-4" />
            Exportar
          </Button>
          <Button className="gap-2">
            <RefreshCw className="h-4 w-4" />
            Atualizar
          </Button>
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Eventos Hoje</CardTitle>
            <Activity className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">247</div>
            <p className="text-xs text-muted-foreground">+12% desde ontem</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Alertas Críticos</CardTitle>
            <AlertTriangle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">3</div>
            <p className="text-xs text-muted-foreground">Requer atenção</p>
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
            <CardTitle className="text-sm font-medium">Logins Bem-sucedidos</CardTitle>
            <Unlock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">89</div>
            <p className="text-xs text-muted-foreground">Hoje</p>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="logs" className="space-y-4">
        <TabsList>
          <TabsTrigger value="logs">Logs de Eventos</TabsTrigger>
          <TabsTrigger value="alerts">Alertas Ativos</TabsTrigger>
          <TabsTrigger value="analysis">Análise de Segurança</TabsTrigger>
          <TabsTrigger value="settings">Configurações</TabsTrigger>
        </TabsList>

        <TabsContent value="logs" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Logs de Segurança</CardTitle>
              <CardDescription>Histórico completo de eventos de segurança</CardDescription>
              <div className="flex items-center gap-4">
                <div className="flex items-center space-x-2">
                  <Search className="h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Buscar logs..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="max-w-sm"
                  />
                </div>
                <select
                  className="p-2 border rounded-md"
                  value={selectedFilter}
                  onChange={(e) => setSelectedFilter(e.target.value)}
                >
                  <option value="all">Todos os eventos</option>
                  <option value="login">Logins</option>
                  <option value="access">Acessos</option>
                  <option value="blocked">Bloqueados</option>
                  <option value="critical">Críticos</option>
                </select>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {securityLogs.map((log) => (
                  <div key={log.id} className="flex items-center justify-between p-4 border rounded-lg">
                    <div className="flex items-center gap-4">
                      <div className="flex items-center gap-2">
                        <Clock className="h-4 w-4 text-muted-foreground" />
                        <span className="text-sm font-mono">{log.timestamp}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <User className="h-4 w-4 text-muted-foreground" />
                        <span className="text-sm font-medium">{log.user}</span>
                      </div>
                      <span className="text-sm">{log.action}</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <span className="text-sm text-muted-foreground">{log.ip}</span>
                      <Badge className={getSeverityColor(log.severity)}>{log.severity}</Badge>
                      <Badge className={getStatusColor(log.status)}>{log.status}</Badge>
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

        <TabsContent value="alerts" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Alertas Ativos de Segurança</CardTitle>
              <CardDescription>Eventos que requerem atenção imediata</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center justify-between p-4 border-l-4 border-red-500 bg-red-50 rounded-lg">
                  <div className="flex items-center gap-3">
                    <AlertTriangle className="h-5 w-5 text-red-600" />
                    <div>
                      <h4 className="font-medium text-red-800">Múltiplas tentativas de login falharam</h4>
                      <p className="text-sm text-red-600">IP: 192.168.1.200 - 15 tentativas em 5 minutos</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge className="bg-red-100 text-red-800">Crítico</Badge>
                    <Button size="sm">Investigar</Button>
                  </div>
                </div>

                <div className="flex items-center justify-between p-4 border-l-4 border-yellow-500 bg-yellow-50 rounded-lg">
                  <div className="flex items-center gap-3">
                    <Shield className="h-5 w-5 text-yellow-600" />
                    <div>
                      <h4 className="font-medium text-yellow-800">Acesso fora do horário comercial</h4>
                      <p className="text-sm text-yellow-600">Usuário: Carlos Oliveira - 02:30 AM</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge className="bg-yellow-100 text-yellow-800">Médio</Badge>
                    <Button size="sm" variant="outline">
                      Revisar
                    </Button>
                  </div>
                </div>

                <div className="flex items-center justify-between p-4 border-l-4 border-orange-500 bg-orange-50 rounded-lg">
                  <div className="flex items-center gap-3">
                    <Lock className="h-5 w-5 text-orange-600" />
                    <div>
                      <h4 className="font-medium text-orange-800">Falha na autenticação 2FA</h4>
                      <p className="text-sm text-orange-600">Usuário: Ana Costa - Token inválido</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge className="bg-orange-100 text-orange-800">Alto</Badge>
                    <Button size="sm" variant="outline">
                      Verificar
                    </Button>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="analysis" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle>Análise de Padrões</CardTitle>
                <CardDescription>Identificação de comportamentos suspeitos</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Logins fora do horário</span>
                    <Badge variant="outline">8 eventos</Badge>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm">IPs suspeitos</span>
                    <Badge className="bg-red-100 text-red-800">3 bloqueados</Badge>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Falhas de autenticação</span>
                    <Badge className="bg-yellow-100 text-yellow-800">12 tentativas</Badge>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Acessos privilegiados</span>
                    <Badge variant="outline">45 eventos</Badge>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Estatísticas de Segurança</CardTitle>
                <CardDescription>Métricas dos últimos 30 dias</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Taxa de sucesso de login</span>
                    <Badge className="bg-green-100 text-green-800">98.2%</Badge>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Tentativas bloqueadas</span>
                    <Badge variant="outline">247</Badge>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Alertas gerados</span>
                    <Badge variant="outline">89</Badge>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Incidentes resolvidos</span>
                    <Badge className="bg-green-100 text-green-800">86/89</Badge>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="settings" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Settings className="h-5 w-5" />
                Configurações de Logs
              </CardTitle>
              <CardDescription>Configure o sistema de logs de segurança</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">Nível de log</label>
                <select className="w-full p-2 border rounded-md">
                  <option>Todos os eventos</option>
                  <option>Apenas eventos críticos</option>
                  <option>Eventos críticos e médios</option>
                </select>
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">Retenção de logs (dias)</label>
                <Input type="number" defaultValue="90" />
              </div>
              <div className="flex items-center space-x-2">
                <input type="checkbox" id="real-time-alerts" defaultChecked />
                <label htmlFor="real-time-alerts" className="text-sm">
                  Alertas em tempo real
                </label>
              </div>
              <div className="flex items-center space-x-2">
                <input type="checkbox" id="email-notifications" defaultChecked />
                <label htmlFor="email-notifications" className="text-sm">
                  Notificações por email
                </label>
              </div>
              <div className="flex items-center space-x-2">
                <input type="checkbox" id="auto-block-suspicious" />
                <label htmlFor="auto-block-suspicious" className="text-sm">
                  Bloqueio automático de IPs suspeitos
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
