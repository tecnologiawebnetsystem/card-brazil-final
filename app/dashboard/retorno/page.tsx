"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Separator } from "@/components/ui/separator"
import { Progress } from "@/components/ui/progress"

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

const FileIcon = () => (
  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
    />
  </svg>
)

const CheckCircleIcon = () => (
  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
    />
  </svg>
)

const XCircleIcon = () => (
  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z"
    />
  </svg>
)

const EyeIcon = () => (
  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
    />
  </svg>
)

export default function RetornoPage() {
  const [isProcessing, setIsProcessing] = useState(false)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [uploadProgress, setUploadProgress] = useState(0)

  const [retornos] = useState([
    {
      id: "RET001",
      banco: "Banco do Brasil",
      arquivo: "retorno_bb_20240115.ret",
      dataProcessamento: "2024-01-15 14:30",
      registros: 1250,
      pagos: 1180,
      rejeitados: 70,
      valor: "R$ 485.750,00",
      status: "Processado",
    },
    {
      id: "RET002",
      banco: "Itaú",
      arquivo: "retorno_itau_20240114.ret",
      dataProcessamento: "2024-01-14 16:45",
      registros: 890,
      pagos: 850,
      rejeitados: 40,
      valor: "R$ 325.480,00",
      status: "Processado",
    },
    {
      id: "RET003",
      banco: "Bradesco",
      arquivo: "retorno_bradesco_20240113.ret",
      dataProcessamento: "2024-01-13 10:15",
      registros: 2100,
      pagos: 1950,
      rejeitados: 150,
      valor: "R$ 756.200,00",
      status: "Processado",
    },
  ])

  const handleProcessRetorno = () => {
    setIsProcessing(true)
    setUploadProgress(0)

    const interval = setInterval(() => {
      setUploadProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval)
          setIsProcessing(false)
          setIsModalOpen(false)
          alert("Arquivo de retorno processado com sucesso!")
          return 100
        }
        return prev + 10
      })
    }, 300)
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Processado":
        return "bg-green-100 text-green-800"
      case "Processando":
        return "bg-blue-100 text-blue-800"
      case "Erro":
        return "bg-red-100 text-red-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Retorno Bancário</h1>
          <p className="text-muted-foreground">Processamento de arquivos de retorno dos bancos</p>
        </div>
        <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
          <DialogTrigger asChild>
            <Button className="bg-primary hover:bg-primary/90">
              <UploadIcon />
              Processar Retorno
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[500px]">
            <DialogHeader>
              <DialogTitle>Processar Arquivo de Retorno</DialogTitle>
              <DialogDescription>Faça upload do arquivo de retorno bancário para processamento</DialogDescription>
            </DialogHeader>
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="arquivo">Arquivo de Retorno</Label>
                <Input type="file" id="arquivo" accept=".ret,.txt" />
                <p className="text-xs text-muted-foreground">Formatos aceitos: .ret, .txt (CNAB 240/400)</p>
              </div>
              {isProcessing && (
                <div className="space-y-2">
                  <Label>Progresso do Processamento</Label>
                  <Progress value={uploadProgress} className="w-full" />
                  <p className="text-sm text-muted-foreground">{uploadProgress}% concluído</p>
                </div>
              )}
              <Separator />
              <div className="flex justify-end space-x-2">
                <Button variant="outline" onClick={() => setIsModalOpen(false)} disabled={isProcessing}>
                  Cancelar
                </Button>
                <Button onClick={handleProcessRetorno} disabled={isProcessing}>
                  {isProcessing ? "Processando..." : "Processar Arquivo"}
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Arquivos Processados</CardTitle>
            <FileIcon />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">89</div>
            <p className="text-xs text-muted-foreground">+5% em relação ao mês anterior</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Pagamentos Confirmados</CardTitle>
            <CheckCircleIcon />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">3.980</div>
            <p className="text-xs text-muted-foreground">94.2% de taxa de sucesso</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Rejeições</CardTitle>
            <XCircleIcon />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">260</div>
            <p className="text-xs text-muted-foreground">5.8% do total processado</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Valor Confirmado</CardTitle>
            <CheckCircleIcon />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">R$ 1.5M</div>
            <p className="text-xs text-muted-foreground">+12% em relação ao mês anterior</p>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Histórico de Retornos</CardTitle>
          <CardDescription>Últimos arquivos de retorno processados</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {retornos.map((retorno) => (
              <div key={retorno.id} className="flex items-center justify-between p-4 border rounded-lg">
                <div className="flex items-center space-x-4">
                  <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center">
                    <FileIcon />
                  </div>
                  <div>
                    <p className="font-medium">{retorno.arquivo}</p>
                    <p className="text-sm text-muted-foreground">
                      {retorno.banco} • {retorno.dataProcessamento}
                    </p>
                  </div>
                </div>
                <div className="flex items-center space-x-4">
                  <div className="text-right">
                    <p className="font-medium">{retorno.valor}</p>
                    <p className="text-sm text-muted-foreground">
                      {retorno.pagos} pagos • {retorno.rejeitados} rejeitados
                    </p>
                  </div>
                  <Badge className={getStatusColor(retorno.status)}>{retorno.status}</Badge>
                  <Button variant="outline" size="sm">
                    <EyeIcon />
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
