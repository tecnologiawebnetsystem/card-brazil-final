"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Cpu, HardDrive, Wifi, Users, TrendingUp, Activity, Server, Database, RefreshCw } from "lucide-react"

export default function PerformancePage() {
  const [cpuUsage, setCpuUsage] = useState(45)
  const [memoryUsage, setMemoryUsage] = useState(62)
  const [diskUsage, setDiskUsage] = useState(38)
  const [isRefreshing, setIsRefreshing] = useState(false)

  const handleRefresh = () => {
    setIsRefreshing(true)
    setTimeout(() => {
      setCpuUsage(Math.floor(Math.random() * 100))
      setMemoryUsage(Math.floor(Math.random() * 100))
      setDiskUsage(Math.floor(Math.random() * 100))
      setIsRefreshing(false)
    }, 2000)
  }

  return (
    <div className="flex-1 space-y-6 p-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Performance do Sistema</h1>
          <p className="text-muted-foreground">Monitore o desempenho e recursos do sistema em tempo real</p>
        </div>
        <Button onClick={handleRefresh} disabled={isRefreshing} className="gap-2">
          <RefreshCw className={`h-4 w-4 ${isRefreshing ? "animate-spin" : ""}`} />
          Atualizar
        </Button>
      </div>

      <div className="grid gap-6 md:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">CPU</CardTitle>
            <Cpu className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{cpuUsage}%</div>
            <Progress value={cpuUsage} className="mt-2" />
            <p className="text-xs text-muted-foreground mt-1">
              {cpuUsage > 80 ? "Alto uso" : cpuUsage > 50 ? "Uso moderado" : "Uso normal"}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Memória</CardTitle>
            <HardDrive className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{memoryUsage}%</div>
            <Progress value={memoryUsage} className="mt-2" />
            <p className="text-xs text-muted-foreground mt-1">8.2 GB / 16 GB</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Disco</CardTitle>
            <Database className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{diskUsage}%</div>
            <Progress value={diskUsage} className="mt-2" />
            <p className="text-xs text-muted-foreground mt-1">380 GB / 1 TB</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Usuários Online</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">47</div>
            <p className="text-xs text-muted-foreground flex items-center gap-1 mt-1">
              <TrendingUp className="h-3 w-3 text-green-600" />
              +12% desde ontem
            </p>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="overview" className="space-y-4">
        <TabsList>
          <TabsTrigger value="overview">Visão Geral</TabsTrigger>
          <TabsTrigger value="processes">Processos</TabsTrigger>
          <TabsTrigger value="network">Rede</TabsTrigger>
          <TabsTrigger value="database">Banco de Dados</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Activity className="h-5 w-5" />
                  Métricas do Sistema
                </CardTitle>
                <CardDescription>Indicadores principais de performance</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Tempo de Resposta Médio</span>
                    <Badge variant="outline">245ms</Badge>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Throughput</span>
                    <span className="text-sm font-medium">1,247 req/min</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Taxa de Erro</span>
                    <Badge className="bg-green-100 text-green-800">0.02%</Badge>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Uptime</span>
                    <span className="text-sm font-medium">99.98%</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Server className="h-5 w-5" />
                  Status dos Serviços
                </CardTitle>
                <CardDescription>Estado atual dos serviços principais</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-3">
                  {[
                    { service: "API Gateway", status: "Online", color: "green" },
                    { service: "Banco de Dados", status: "Online", color: "green" },
                    { service: "Cache Redis", status: "Online", color: "green" },
                    { service: "File Storage", status: "Degradado", color: "yellow" },
                  ].map((item, index) => (
                    <div key={index} className="flex items-center justify-between">
                      <span className="text-sm">{item.service}</span>
                      <Badge
                        className={
                          item.color === "green" ? "bg-green-100 text-green-800" : "bg-yellow-100 text-yellow-800"
                        }
                      >
                        {item.status}
                      </Badge>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="processes" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Processos em Execução</CardTitle>
              <CardDescription>Top 10 processos por uso de CPU</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {[
                  { name: "node.js", cpu: "15.2%", memory: "245 MB", pid: "1234" },
                  { name: "postgres", cpu: "8.7%", memory: "512 MB", pid: "5678" },
                  { name: "redis-server", cpu: "3.1%", memory: "128 MB", pid: "9012" },
                  { name: "nginx", cpu: "2.8%", memory: "64 MB", pid: "3456" },
                  { name: "pm2", cpu: "1.9%", memory: "32 MB", pid: "7890" },
                ].map((process, index) => (
                  <div key={index} className="flex items-center justify-between p-3 border rounded-lg">
                    <div className="flex items-center gap-3">
                      <span className="text-sm font-medium">{process.name}</span>
                      <Badge variant="outline">PID: {process.pid}</Badge>
                    </div>
                    <div className="flex items-center gap-4">
                      <span className="text-sm">CPU: {process.cpu}</span>
                      <span className="text-sm">RAM: {process.memory}</span>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="network" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Wifi className="h-5 w-5" />
                  Tráfego de Rede
                </CardTitle>
                <CardDescription>Dados de entrada e saída</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Download</span>
                    <span className="text-sm font-medium">125.4 MB/s</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Upload</span>
                    <span className="text-sm font-medium">89.2 MB/s</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Latência</span>
                    <Badge variant="outline">12ms</Badge>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Conexões Ativas</CardTitle>
                <CardDescription>Conexões por protocolo</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-sm">HTTP/HTTPS</span>
                    <span className="text-sm font-medium">1,247</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm">WebSocket</span>
                    <span className="text-sm font-medium">89</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Database</span>
                    <span className="text-sm font-medium">45</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="database" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Database className="h-5 w-5" />
                  Performance do Banco
                </CardTitle>
                <CardDescription>Métricas de desempenho do PostgreSQL</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Queries/segundo</span>
                    <span className="text-sm font-medium">847</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Tempo médio de query</span>
                    <Badge variant="outline">45ms</Badge>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Conexões ativas</span>
                    <span className="text-sm font-medium">45/100</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Cache hit ratio</span>
                    <Badge className="bg-green-100 text-green-800">98.7%</Badge>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Queries Lentas</CardTitle>
                <CardDescription>Top 5 queries com maior tempo de execução</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {[
                    { query: "SELECT * FROM beneficiarios WHERE...", time: "1.2s" },
                    { query: "UPDATE propostas SET status...", time: "890ms" },
                    { query: "SELECT COUNT(*) FROM pagamentos...", time: "650ms" },
                    { query: "INSERT INTO movimentacoes...", time: "420ms" },
                    { query: "DELETE FROM temp_data WHERE...", time: "380ms" },
                  ].map((item, index) => (
                    <div key={index} className="flex items-center justify-between p-2 border rounded">
                      <span className="text-xs font-mono truncate flex-1 mr-2">{item.query}</span>
                      <Badge variant="outline">{item.time}</Badge>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}
