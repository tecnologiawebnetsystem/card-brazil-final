"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"

const SyncIcon = () => (
  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
    />
  </svg>
)

const CheckIcon = () => (
  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
  </svg>
)

const AlertIcon = () => (
  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z"
    />
  </svg>
)

const UploadIcon = () => (
  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"
    />
  </svg>
)

export default function ANSPage() {
  const [isConfigOpen, setIsConfigOpen] = useState(false)
  const [isSyncOpen, setIsSyncOpen] = useState(false)
  const [syncProgress, setSyncProgress] = useState(0)
  const [isLoading, setIsLoading] = useState(false)

  const [ansConfig, setAnsConfig] = useState({
    registroAns: "41234567",
    cnpj: "12.345.678/0001-90",
    razaoSocial: "CardBrazil Administradora de Saúde Ltda",
    usuario: "",
    senha: "",
    ambiente: "producao",
  })

  const ansStatus = [
    {
      sistema: "SIB - Sistema de Informações de Beneficiários",
      status: "Conectado",
      ultimaSync: "15/12/2024 14:30",
      proximaSync: "16/12/2024 02:00",
      registros: 1250,
    },
    {
      sistema: "RIP - Registro de Informações Periódicas",
      status: "Conectado",
      ultimaSync: "15/12/2024 14:30",
      proximaSync: "31/12/2024 23:59",
      registros: 45,
    },
    {
      sistema: "DIOPS - Documento de Informações Periódicas",
      status: "Pendente",
      ultimaSync: "30/11/2024 18:00",
      proximaSync: "31/12/2024 23:59",
      registros: 12,
    },
    {
      sistema: "TISS - Troca de Informações de Saúde Suplementar",
      status: "Conectado",
      ultimaSync: "15/12/2024 14:30",
      proximaSync: "16/12/2024 06:00",
      registros: 890,
    },
  ]

  const handleSync = async () => {
    setIsLoading(true)
    setSyncProgress(0)
    setIsSyncOpen(true)

    // Simular sincronização
    const interval = setInterval(() => {
      setSyncProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval)
          setIsLoading(false)
          return 100
        }
        return prev + 10
      })
    }, 500)
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Conectado":
        return "bg-green-100 text-green-800"
      case "Pendente":
        return "bg-yellow-100 text-yellow-800"
      case "Erro":
        return "bg-red-100 text-red-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "Conectado":
        return <CheckIcon />
      case "Pendente":
        return <AlertIcon />
      case "Erro":
        return <AlertIcon />
      default:
        return <AlertIcon />
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Integração ANS</h1>
          <p className="text-gray-600">Conecte-se aos sistemas da Agência Nacional de Saúde Suplementar</p>
        </div>

        <div className="flex space-x-2">
          <Dialog open={isConfigOpen} onOpenChange={setIsConfigOpen}>
            <DialogTrigger asChild>
              <Button variant="outline">Configurar</Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl">
              <DialogHeader>
                <DialogTitle>Configuração ANS</DialogTitle>
                <DialogDescription>Configure as credenciais de acesso aos sistemas da ANS</DialogDescription>
              </DialogHeader>

              <div className="grid gap-4 py-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="registroAns">Registro ANS</Label>
                    <Input
                      id="registroAns"
                      value={ansConfig.registroAns}
                      onChange={(e) => setAnsConfig({ ...ansConfig, registroAns: e.target.value })}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="cnpj">CNPJ</Label>
                    <Input
                      id="cnpj"
                      value={ansConfig.cnpj}
                      onChange={(e) => setAnsConfig({ ...ansConfig, cnpj: e.target.value })}
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="razaoSocial">Razão Social</Label>
                  <Input
                    id="razaoSocial"
                    value={ansConfig.razaoSocial}
                    onChange={(e) => setAnsConfig({ ...ansConfig, razaoSocial: e.target.value })}
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="usuario">Usuário ANS</Label>
                    <Input
                      id="usuario"
                      value={ansConfig.usuario}
                      onChange={(e) => setAnsConfig({ ...ansConfig, usuario: e.target.value })}
                      placeholder="Usuário do sistema ANS"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="senha">Senha</Label>
                    <Input
                      id="senha"
                      type="password"
                      value={ansConfig.senha}
                      onChange={(e) => setAnsConfig({ ...ansConfig, senha: e.target.value })}
                      placeholder="Senha do sistema ANS"
                    />
                  </div>
                </div>
              </div>

              <DialogFooter>
                <Button variant="outline" onClick={() => setIsConfigOpen(false)}>
                  Cancelar
                </Button>
                <Button onClick={() => setIsConfigOpen(false)}>Salvar Configuração</Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>

          <Button onClick={handleSync} disabled={isLoading} className="bg-primary hover:bg-primary/90">
            <SyncIcon />
            <span className="ml-2">Sincronizar</span>
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Sistemas Conectados</p>
                <p className="text-2xl font-bold text-gray-900">3/4</p>
              </div>
              <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                <CheckIcon />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Última Sincronização</p>
                <p className="text-lg font-semibold text-gray-900">15/12 14:30</p>
              </div>
              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                <SyncIcon />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Registros Enviados</p>
                <p className="text-2xl font-bold text-gray-900">2.197</p>
              </div>
              <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
                <UploadIcon />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Status Geral</p>
                <p className="text-lg font-semibold text-green-600">Operacional</p>
              </div>
              <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                <CheckIcon />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Status dos Sistemas ANS</CardTitle>
          <CardDescription>Monitoramento em tempo real das conexões com os sistemas da ANS</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {ansStatus.map((system, index) => (
              <div key={index} className="flex items-center justify-between p-4 border rounded-lg">
                <div className="flex items-center space-x-4">
                  <div className="flex items-center justify-center w-10 h-10 rounded-lg bg-gray-100">
                    {getStatusIcon(system.status)}
                  </div>
                  <div>
                    <h3 className="font-medium text-gray-900">{system.sistema}</h3>
                    <p className="text-sm text-gray-600">
                      Última sync: {system.ultimaSync} | Próxima: {system.proximaSync}
                    </p>
                  </div>
                </div>
                <div className="flex items-center space-x-4">
                  <div className="text-right">
                    <p className="text-sm font-medium text-gray-900">{system.registros} registros</p>
                    <Badge className={getStatusColor(system.status)}>{system.status}</Badge>
                  </div>
                  <Button variant="outline" size="sm">
                    Detalhes
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      <Dialog open={isSyncOpen} onOpenChange={setIsSyncOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Sincronização em Andamento</DialogTitle>
            <DialogDescription>Enviando dados para os sistemas da ANS...</DialogDescription>
          </DialogHeader>

          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span>Progresso da sincronização</span>
                <span>{syncProgress}%</span>
              </div>
              <Progress value={syncProgress} className="w-full" />
            </div>

            {syncProgress === 100 && (
              <div className="flex items-center space-x-2 text-green-600">
                <CheckIcon />
                <span>Sincronização concluída com sucesso!</span>
              </div>
            )}
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setIsSyncOpen(false)} disabled={isLoading}>
              {syncProgress === 100 ? "Fechar" : "Cancelar"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
