"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Textarea } from "@/components/ui/textarea"
import { Separator } from "@/components/ui/separator"

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

const DownloadIcon = () => (
  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="M12 10v6m0 0l-4-4m4 4l4-4m3 8H5a2 2 0 01-2-2V7a2 2 0 012-2h4l2 2h4a2 2 0 012 2v1"
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

export default function RemessaPage() {
  const [isGenerating, setIsGenerating] = useState(false)
  const [selectedBank, setSelectedBank] = useState("")
  const [selectedType, setSelectedType] = useState("")
  const [isModalOpen, setIsModalOpen] = useState(false)

  const [remessas] = useState([
    {
      id: "REM001",
      banco: "Banco do Brasil",
      tipo: "CNAB 240",
      dataGeracao: "2024-01-15",
      registros: 1250,
      valor: "R$ 485.750,00",
      status: "Enviado",
      arquivo: "remessa_bb_20240115.txt",
    },
    {
      id: "REM002",
      banco: "Itaú",
      tipo: "CNAB 400",
      dataGeracao: "2024-01-14",
      registros: 890,
      valor: "R$ 325.480,00",
      status: "Processado",
      arquivo: "remessa_itau_20240114.txt",
    },
    {
      id: "REM003",
      banco: "Bradesco",
      tipo: "CNAB 240",
      dataGeracao: "2024-01-13",
      registros: 2100,
      valor: "R$ 756.200,00",
      status: "Pendente",
      arquivo: "remessa_bradesco_20240113.txt",
    },
  ])

  const handleGenerateRemessa = () => {
    setIsGenerating(true)
    setTimeout(() => {
      setIsGenerating(false)
      setIsModalOpen(false)
      alert("Arquivo de remessa gerado com sucesso!")
    }, 3000)
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Enviado":
        return "bg-green-100 text-green-800"
      case "Processado":
        return "bg-blue-100 text-blue-800"
      case "Pendente":
        return "bg-yellow-100 text-yellow-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Gerar Arquivos de Remessa</h1>
          <p className="text-muted-foreground">Geração e controle de arquivos de remessa bancária</p>
        </div>
        <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
          <DialogTrigger asChild>
            <Button className="bg-primary hover:bg-primary/90">
              <UploadIcon />
              Gerar Nova Remessa
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[500px]">
            <DialogHeader>
              <DialogTitle>Gerar Arquivo de Remessa</DialogTitle>
              <DialogDescription>Configure os parâmetros para gerar o arquivo de remessa bancária</DialogDescription>
            </DialogHeader>
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="banco">Banco</Label>
                  <Select value={selectedBank} onValueChange={setSelectedBank}>
                    <SelectTrigger>
                      <SelectValue placeholder="Selecione o banco" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="bb">Banco do Brasil</SelectItem>
                      <SelectItem value="itau">Itaú</SelectItem>
                      <SelectItem value="bradesco">Bradesco</SelectItem>
                      <SelectItem value="santander">Santander</SelectItem>
                      <SelectItem value="caixa">Caixa Econômica</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="tipo">Tipo de Arquivo</Label>
                  <Select value={selectedType} onValueChange={setSelectedType}>
                    <SelectTrigger>
                      <SelectValue placeholder="Selecione o tipo" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="cnab240">CNAB 240</SelectItem>
                      <SelectItem value="cnab400">CNAB 400</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="dataVencimento">Data de Vencimento</Label>
                <Input type="date" id="dataVencimento" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="observacoes">Observações</Label>
                <Textarea id="observacoes" placeholder="Observações adicionais para a remessa..." />
              </div>
              <Separator />
              <div className="flex justify-end space-x-2">
                <Button variant="outline" onClick={() => setIsModalOpen(false)}>
                  Cancelar
                </Button>
                <Button onClick={handleGenerateRemessa} disabled={isGenerating}>
                  {isGenerating ? "Gerando..." : "Gerar Remessa"}
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total de Remessas</CardTitle>
            <FileIcon />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">156</div>
            <p className="text-xs text-muted-foreground">+12% em relação ao mês anterior</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Valor Total</CardTitle>
            <UploadIcon />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">R$ 2.8M</div>
            <p className="text-xs text-muted-foreground">+8% em relação ao mês anterior</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Registros Enviados</CardTitle>
            <FileIcon />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">4.240</div>
            <p className="text-xs text-muted-foreground">+15% em relação ao mês anterior</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Taxa de Sucesso</CardTitle>
            <UploadIcon />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">98.5%</div>
            <p className="text-xs text-muted-foreground">+2% em relação ao mês anterior</p>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Histórico de Remessas</CardTitle>
          <CardDescription>Últimas remessas geradas e enviadas aos bancos</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {remessas.map((remessa) => (
              <div key={remessa.id} className="flex items-center justify-between p-4 border rounded-lg">
                <div className="flex items-center space-x-4">
                  <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center">
                    <FileIcon />
                  </div>
                  <div>
                    <p className="font-medium">{remessa.arquivo}</p>
                    <p className="text-sm text-muted-foreground">
                      {remessa.banco} • {remessa.tipo}
                    </p>
                  </div>
                </div>
                <div className="flex items-center space-x-4">
                  <div className="text-right">
                    <p className="font-medium">{remessa.valor}</p>
                    <p className="text-sm text-muted-foreground">{remessa.registros} registros</p>
                  </div>
                  <Badge className={getStatusColor(remessa.status)}>{remessa.status}</Badge>
                  <div className="flex space-x-2">
                    <Button variant="outline" size="sm">
                      <EyeIcon />
                    </Button>
                    <Button variant="outline" size="sm">
                      <DownloadIcon />
                    </Button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
