"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
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
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

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

const CheckIcon = () => (
  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
  </svg>
)

const XIcon = () => (
  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
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

export default function ConciliacaoPage() {
  const [isUploadOpen, setIsUploadOpen] = useState(false)
  const [isProcessing, setIsProcessing] = useState(false)
  const [processProgress, setProcessProgress] = useState(0)
  const [selectedBank, setSelectedBank] = useState("")

  const [conciliations, setConciliations] = useState([
    {
      id: "CONC001",
      banco: "Banco do Brasil",
      conta: "12345-6",
      periodo: "Dezembro 2024",
      status: "Conciliado",
      divergencias: 0,
      valorBanco: "R$ 2.450.780,50",
      valorSistema: "R$ 2.450.780,50",
      dataProcessamento: "15/12/2024 09:30",
    },
    {
      id: "CONC002",
      banco: "Itaú Unibanco",
      conta: "98765-4",
      periodo: "Dezembro 2024",
      status: "Divergência",
      divergencias: 3,
      valorBanco: "R$ 1.890.450,30",
      valorSistema: "R$ 1.892.120,30",
      dataProcessamento: "15/12/2024 10:15",
    },
    {
      id: "CONC003",
      banco: "Santander",
      conta: "54321-8",
      periodo: "Dezembro 2024",
      status: "Pendente",
      divergencias: 0,
      valorBanco: "R$ 0,00",
      valorSistema: "R$ 987.650,80",
      dataProcessamento: "-",
    },
  ])

  const divergencias = [
    {
      id: "DIV001",
      tipo: "Débito não identificado",
      valor: "R$ 1.250,00",
      data: "12/12/2024",
      descricao: "Débito automático não cadastrado no sistema",
      status: "Pendente",
    },
    {
      id: "DIV002",
      tipo: "Diferença de valor",
      valor: "R$ 420,00",
      data: "10/12/2024",
      descricao: "Diferença entre valor cobrado e recebido",
      status: "Em análise",
    },
    {
      id: "DIV003",
      tipo: "Crédito duplicado",
      valor: "R$ -1.670,00",
      data: "08/12/2024",
      descricao: "Pagamento processado em duplicidade",
      status: "Resolvido",
    },
  ]

  const handleProcessConciliation = async () => {
    setIsProcessing(true)
    setProcessProgress(0)

    const interval = setInterval(() => {
      setProcessProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval)
          setIsProcessing(false)
          return 100
        }
        return prev + 20
      })
    }, 800)
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Conciliado":
        return "bg-green-100 text-green-800"
      case "Divergência":
        return "bg-red-100 text-red-800"
      case "Pendente":
        return "bg-yellow-100 text-yellow-800"
      case "Em análise":
        return "bg-blue-100 text-blue-800"
      case "Resolvido":
        return "bg-green-100 text-green-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "Conciliado":
      case "Resolvido":
        return <CheckIcon />
      case "Divergência":
        return <XIcon />
      case "Pendente":
      case "Em análise":
        return <AlertIcon />
      default:
        return <AlertIcon />
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Conciliação Bancária</h1>
          <p className="text-gray-600">Automatize a conciliação entre extratos bancários e movimentações do sistema</p>
        </div>

        <Dialog open={isUploadOpen} onOpenChange={setIsUploadOpen}>
          <DialogTrigger asChild>
            <Button className="bg-primary hover:bg-primary/90">
              <UploadIcon />
              <span className="ml-2">Importar Extrato</span>
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>Importar Extrato Bancário</DialogTitle>
              <DialogDescription>Faça upload do arquivo OFX ou CSV do seu banco</DialogDescription>
            </DialogHeader>

            <div className="grid gap-4 py-4">
              <div className="space-y-2">
                <Label htmlFor="banco">Banco</Label>
                <Select onValueChange={setSelectedBank}>
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione o banco" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="bb">Banco do Brasil</SelectItem>
                    <SelectItem value="itau">Itaú Unibanco</SelectItem>
                    <SelectItem value="santander">Santander</SelectItem>
                    <SelectItem value="bradesco">Bradesco</SelectItem>
                    <SelectItem value="caixa">Caixa Econômica</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="conta">Conta</Label>
                <Input id="conta" placeholder="Número da conta" />
              </div>

              <div className="space-y-2">
                <Label htmlFor="arquivo">Arquivo do Extrato</Label>
                <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
                  <UploadIcon />
                  <p className="mt-2 text-sm text-gray-600">
                    Arraste o arquivo aqui ou{" "}
                    <span className="text-primary cursor-pointer">clique para selecionar</span>
                  </p>
                  <p className="text-xs text-gray-500 mt-1">Formatos aceitos: OFX, CSV, TXT</p>
                </div>
              </div>

              {isProcessing && (
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>Processando conciliação...</span>
                    <span>{processProgress}%</span>
                  </div>
                  <Progress value={processProgress} className="w-full" />
                </div>
              )}
            </div>

            <DialogFooter>
              <Button variant="outline" onClick={() => setIsUploadOpen(false)}>
                Cancelar
              </Button>
              <Button onClick={handleProcessConciliation} disabled={isProcessing}>
                {isProcessing ? "Processando..." : "Processar Conciliação"}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Contas Conciliadas</p>
                <p className="text-2xl font-bold text-gray-900">1/3</p>
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
                <p className="text-sm font-medium text-gray-600">Divergências Ativas</p>
                <p className="text-2xl font-bold text-red-600">3</p>
              </div>
              <div className="w-12 h-12 bg-red-100 rounded-lg flex items-center justify-center">
                <XIcon />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Valor Total Conciliado</p>
                <p className="text-lg font-semibold text-gray-900">R$ 2.450.780,50</p>
              </div>
              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                <CheckIcon />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Última Conciliação</p>
                <p className="text-lg font-semibold text-gray-900">15/12 10:15</p>
              </div>
              <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
                <UploadIcon />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Status das Conciliações</CardTitle>
            <CardDescription>Acompanhe o status de cada conta bancária</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {conciliations.map((conc) => (
                <div key={conc.id} className="flex items-center justify-between p-4 border rounded-lg">
                  <div className="flex items-center space-x-4">
                    <div className="flex items-center justify-center w-10 h-10 rounded-lg bg-gray-100">
                      {getStatusIcon(conc.status)}
                    </div>
                    <div>
                      <h3 className="font-medium text-gray-900">
                        {conc.banco} - {conc.conta}
                      </h3>
                      <p className="text-sm text-gray-600">{conc.periodo}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <Badge className={getStatusColor(conc.status)}>{conc.status}</Badge>
                    {conc.divergencias > 0 && (
                      <p className="text-sm text-red-600 mt-1">{conc.divergencias} divergências</p>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Divergências Encontradas</CardTitle>
            <CardDescription>Itens que precisam de análise manual</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {divergencias.map((div) => (
                <div key={div.id} className="p-4 border rounded-lg">
                  <div className="flex justify-between items-start mb-2">
                    <div>
                      <h3 className="font-medium text-gray-900">{div.tipo}</h3>
                      <p className="text-sm text-gray-600">{div.data}</p>
                    </div>
                    <div className="text-right">
                      <p className="font-semibold text-gray-900">{div.valor}</p>
                      <Badge className={getStatusColor(div.status)}>{div.status}</Badge>
                    </div>
                  </div>
                  <p className="text-sm text-gray-600 mb-3">{div.descricao}</p>
                  <div className="flex space-x-2">
                    <Button variant="outline" size="sm">
                      Analisar
                    </Button>
                    <Button variant="outline" size="sm">
                      Resolver
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
