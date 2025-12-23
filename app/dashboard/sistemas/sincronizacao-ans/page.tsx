"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { RefreshCw, CheckCircle, Clock, Download, Upload, Database, Activity, Calendar, Settings } from "lucide-react"

export default function SincronizacaoANSPage() {
  const [isSync, setIsSync] = useState(false)
  const [progress, setProgress] = useState(0)

  const handleSync = () => {
    setIsSync(true)
    setProgress(0)

    const interval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval)
          setIsSync(false)
          return 100
        }
        return prev + 10
      })
    }, 500)
  }

  return (
    <div className="flex-1 space-y-6 p-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Sincronização ANS</h1>
          <p className="text-muted-foreground">
            Gerencie a sincronização de dados com a Agência Nacional de Saúde Suplementar
          </p>
        </div>
        <Button onClick={handleSync} disabled={isSync} className="gap-2">
          <RefreshCw className={`h-4 w-4 ${isSync ? "animate-spin" : ""}`} />
          {isSync ? "Sincronizando..." : "Sincronizar Agora"}
        </Button>
      </div>

      <div className="grid gap-6 md:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Última Sincronização</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">2h atrás</div>
            <p className="text-xs text-muted-foreground">15/01/2024 14:30</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Status</CardTitle>
            <CheckCircle className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">Ativo</div>
            <p className="text-xs text-muted-foreground">Sistema funcionando</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Registros Enviados</CardTitle>
            <Upload className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">1.247</div>
            <p className="text-xs text-muted-foreground">+12% desde ontem</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Registros Recebidos</CardTitle>
            <Download className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">892</div>
            <p className="text-xs text-muted-foreground">+8% desde ontem</p>
          </CardContent>
        </Card>
      </div>

      {isSync && (
        <Alert>
          <Activity className="h-4 w-4" />
          <AlertDescription>
            Sincronização em andamento... {progress}% concluído
            <Progress value={progress} className="mt-2" />
          </AlertDescription>
        </Alert>
      )}

      <Tabs defaultValue="status" className="space-y-4">
        <TabsList>
          <TabsTrigger value="status">Status da Sincronização</TabsTrigger>
          <TabsTrigger value="historico">Histórico</TabsTrigger>
          <TabsTrigger value="configuracoes">Configurações</TabsTrigger>
        </TabsList>

        <TabsContent value="status" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Database className="h-5 w-5" />
                  Beneficiários
                </CardTitle>
                <CardDescription>Sincronização de dados de beneficiários</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-sm">Última atualização</span>
                  <Badge variant="outline">14:30</Badge>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm">Registros processados</span>
                  <span className="text-sm font-medium">1.247</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm">Status</span>
                  <Badge className="bg-green-100 text-green-800">Sincronizado</Badge>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Activity className="h-5 w-5" />
                  Movimentações
                </CardTitle>
                <CardDescription>Inclusões, exclusões e alterações</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-sm">Última atualização</span>
                  <Badge variant="outline">14:25</Badge>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm">Registros processados</span>
                  <span className="text-sm font-medium">892</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm">Status</span>
                  <Badge className="bg-yellow-100 text-yellow-800">Processando</Badge>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="historico" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Histórico de Sincronizações</CardTitle>
              <CardDescription>Últimas 10 sincronizações realizadas</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {[
                  { data: "15/01/2024 14:30", status: "Sucesso", registros: 1247 },
                  { data: "15/01/2024 12:30", status: "Sucesso", registros: 1189 },
                  { data: "15/01/2024 10:30", status: "Erro", registros: 0 },
                  { data: "15/01/2024 08:30", status: "Sucesso", registros: 1156 },
                  { data: "14/01/2024 16:30", status: "Sucesso", registros: 1098 },
                ].map((item, index) => (
                  <div key={index} className="flex items-center justify-between p-3 border rounded-lg">
                    <div className="flex items-center gap-3">
                      <Calendar className="h-4 w-4 text-muted-foreground" />
                      <span className="text-sm">{item.data}</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <span className="text-sm">{item.registros} registros</span>
                      <Badge
                        variant={item.status === "Sucesso" ? "default" : "destructive"}
                        className={item.status === "Sucesso" ? "bg-green-100 text-green-800" : ""}
                      >
                        {item.status}
                      </Badge>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="configuracoes" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Settings className="h-5 w-5" />
                Configurações de Sincronização
              </CardTitle>
              <CardDescription>Configure os parâmetros de sincronização com a ANS</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <label className="text-sm font-medium">Intervalo de Sincronização</label>
                  <select className="w-full p-2 border rounded-md">
                    <option>A cada 2 horas</option>
                    <option>A cada 4 horas</option>
                    <option>A cada 6 horas</option>
                    <option>Diariamente</option>
                  </select>
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium">Horário de Início</label>
                  <input type="time" className="w-full p-2 border rounded-md" defaultValue="08:00" />
                </div>
              </div>
              <div className="flex items-center space-x-2">
                <input type="checkbox" id="auto-sync" defaultChecked />
                <label htmlFor="auto-sync" className="text-sm">
                  Sincronização automática ativa
                </label>
              </div>
              <div className="flex items-center space-x-2">
                <input type="checkbox" id="email-notifications" defaultChecked />
                <label htmlFor="email-notifications" className="text-sm">
                  Notificações por email em caso de erro
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
