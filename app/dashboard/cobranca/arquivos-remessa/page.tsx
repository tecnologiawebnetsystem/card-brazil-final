"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Checkbox } from "@/components/ui/checkbox"
import {
  Upload,
  Download,
  FileText,
  CheckCircle,
  AlertCircle,
  Send,
  MessageSquare,
  Mail,
  Printer,
  Plus,
} from "lucide-react"

interface ArquivoRemessa {
  id: string
  nome: string
  dataEnvio: string
  banco: string
  totalRegistros: number
  valorTotal: number
  status: string
  beneficiario: string
  corretor: string
  estipulante: string
  plano: string
}

export default function ArquivosRemessaPage() {
  const [selectedFile, setSelectedFile] = useState<File | null>(null)
  const [selectedArquivos, setSelectedArquivos] = useState<string[]>([])
  const [isLoteDialogOpen, setIsLoteDialogOpen] = useState(false)

  const arquivosRemessa: ArquivoRemessa[] = [
    {
      id: "001",
      nome: "REMESSA_20240315_001.txt",
      dataEnvio: "2024-03-15",
      banco: "Banco do Brasil",
      totalRegistros: 150,
      valorTotal: 45000.0,
      status: "Processado",
      beneficiario: "João Silva Santos",
      corretor: "Maria Oliveira",
      estipulante: "Empresa ABC Ltda",
      plano: "Plano Saúde Premium",
    },
    {
      id: "002",
      nome: "REMESSA_20240314_001.txt",
      dataEnvio: "2024-03-14",
      banco: "Itaú",
      totalRegistros: 89,
      valorTotal: 28500.0,
      status: "Enviado",
      beneficiario: "Ana Costa Lima",
      corretor: "Carlos Pereira",
      estipulante: "Empresa XYZ S.A.",
      plano: "Plano Saúde Básico",
    },
    {
      id: "003",
      nome: "REMESSA_20240313_001.txt",
      dataEnvio: "2024-03-13",
      banco: "Bradesco",
      totalRegistros: 203,
      valorTotal: 67800.0,
      status: "Erro",
      beneficiario: "Pedro Almeida",
      corretor: "Lucia Santos",
      estipulante: "Empresa DEF Ltda",
      plano: "Plano Saúde Executivo",
    },
    {
      id: "004",
      nome: "REMESSA_20240312_001.txt",
      dataEnvio: "2024-03-12",
      banco: "Santander",
      totalRegistros: 175,
      valorTotal: 52000.0,
      status: "Processado",
      beneficiario: "Carla Rodrigues",
      corretor: "Roberto Silva",
      estipulante: "Empresa GHI S.A.",
      plano: "Plano Saúde Família",
    },
    {
      id: "005",
      nome: "REMESSA_20240311_001.txt",
      dataEnvio: "2024-03-11",
      banco: "Caixa Econômica",
      totalRegistros: 98,
      valorTotal: 31200.0,
      status: "Enviado",
      beneficiario: "Fernando Costa",
      corretor: "Patricia Lima",
      estipulante: "Empresa JKL Ltda",
      plano: "Plano Saúde Individual",
    },
  ]

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "Processado":
        return (
          <Badge className="bg-green-100 text-green-800">
            <CheckCircle className="h-3 w-3 mr-1" />
            Processado
          </Badge>
        )
      case "Enviado":
        return (
          <Badge className="bg-blue-100 text-blue-800">
            <Upload className="h-3 w-3 mr-1" />
            Enviado
          </Badge>
        )
      case "Erro":
        return (
          <Badge variant="destructive">
            <AlertCircle className="h-3 w-3 mr-1" />
            Erro
          </Badge>
        )
      default:
        return <Badge variant="secondary">{status}</Badge>
    }
  }

  const handleSelectArquivo = (arquivoId: string, checked: boolean) => {
    if (checked) {
      setSelectedArquivos([...selectedArquivos, arquivoId])
    } else {
      setSelectedArquivos(selectedArquivos.filter((id) => id !== arquivoId))
    }
  }

  const handleSelectAll = (checked: boolean) => {
    if (checked) {
      setSelectedArquivos(arquivosRemessa.map((arquivo) => arquivo.id))
    } else {
      setSelectedArquivos([])
    }
  }

  const handleEnviarLote = (tipo: "email" | "whatsapp" | "sms") => {
    console.log(`Enviando lote via ${tipo} para ${selectedArquivos.length} arquivos`)
    setIsLoteDialogOpen(false)
    setSelectedArquivos([])
  }

  const handleAlterarVencimento = (arquivoId: string) => {
    window.location.href = `/dashboard/cobranca/alteracao-vencimento?arquivo=${arquivoId}`
  }

  return (
    <div className="container mx-auto p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-emerald-800">Arquivos de Remessa</h1>
          <p className="text-muted-foreground">Gerencie arquivos de remessa bancária e envios em lote</p>
        </div>
        <Button className="bg-emerald-600 hover:bg-emerald-700">
          <Plus className="h-4 w-4 mr-2" />
          Novo Arquivo
        </Button>
      </div>

      {/* Upload de Arquivo */}
      <Card>
        <CardHeader>
          <CardTitle className="text-emerald-800 flex items-center gap-2">
            <Upload className="h-5 w-5" />
            Enviar Arquivo de Remessa
          </CardTitle>
          <CardDescription>Faça upload de um novo arquivo de remessa</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label>Selecionar Arquivo</Label>
            <Input type="file" accept=".txt,.rem" onChange={(e) => setSelectedFile(e.target.files?.[0] || null)} />
          </div>
          <Button className="bg-emerald-600 hover:bg-emerald-700" disabled={!selectedFile}>
            <Upload className="h-4 w-4 mr-2" />
            Enviar Arquivo
          </Button>
        </CardContent>
      </Card>

      {/* Ações em Lote */}
      {selectedArquivos.length > 0 && (
        <Card className="border-blue-200 bg-blue-50">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <span className="font-medium text-blue-800">{selectedArquivos.length} arquivo(s) selecionado(s)</span>
              <div className="flex gap-2">
                <Dialog open={isLoteDialogOpen} onOpenChange={setIsLoteDialogOpen}>
                  <DialogTrigger asChild>
                    <Button className="bg-blue-600 hover:bg-blue-700">
                      <Send className="h-4 w-4 mr-2" />
                      Ações em Lote
                    </Button>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>Ações em Lote - {selectedArquivos.length} arquivo(s)</DialogTitle>
                    </DialogHeader>
                    <div className="space-y-4 p-4">
                      <Button
                        onClick={() => handleEnviarLote("email")}
                        className="w-full justify-start"
                        variant="outline"
                      >
                        <Mail className="h-4 w-4 mr-2" />
                        Enviar por E-mail
                      </Button>
                      <Button
                        onClick={() => handleEnviarLote("whatsapp")}
                        className="w-full justify-start bg-green-600 hover:bg-green-700 text-white"
                      >
                        <MessageSquare className="h-4 w-4 mr-2" />
                        Enviar por WhatsApp
                      </Button>
                      <Button
                        onClick={() => handleEnviarLote("sms")}
                        className="w-full justify-start"
                        variant="outline"
                      >
                        <Send className="h-4 w-4 mr-2" />
                        Enviar por SMS
                      </Button>
                      <Button
                        onClick={() => console.log("Imprimindo lote")}
                        className="w-full justify-start"
                        variant="outline"
                      >
                        <Printer className="h-4 w-4 mr-2" />
                        Imprimir Lote
                      </Button>
                    </div>
                  </DialogContent>
                </Dialog>
                <Button variant="outline" onClick={() => setSelectedArquivos([])}>
                  Limpar Seleção
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Lista de Arquivos */}
      <Card>
        <CardHeader>
          <CardTitle className="text-emerald-800">Histórico de Remessas</CardTitle>
          <CardDescription>Arquivos de remessa enviados</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full border-collapse">
              <thead>
                <tr className="border-b border-emerald-200">
                  <th className="text-left p-3">
                    <Checkbox
                      checked={selectedArquivos.length === arquivosRemessa.length}
                      onCheckedChange={handleSelectAll}
                    />
                  </th>
                  <th className="text-left p-3 font-semibold text-emerald-800">Arquivo</th>
                  <th className="text-left p-3 font-semibold text-emerald-800">Data Envio</th>
                  <th className="text-left p-3 font-semibold text-emerald-800">Banco</th>
                  <th className="text-left p-3 font-semibold text-emerald-800">Beneficiário</th>
                  <th className="text-right p-3 font-semibold text-emerald-800">Registros</th>
                  <th className="text-right p-3 font-semibold text-emerald-800">Valor Total</th>
                  <th className="text-center p-3 font-semibold text-emerald-800">Status</th>
                  <th className="text-center p-3 font-semibold text-emerald-800">Ações</th>
                </tr>
              </thead>
              <tbody>
                {arquivosRemessa.map((arquivo) => (
                  <tr key={arquivo.id} className="border-b border-gray-100 hover:bg-emerald-50">
                    <td className="p-3">
                      <Checkbox
                        checked={selectedArquivos.includes(arquivo.id)}
                        onCheckedChange={(checked) => handleSelectArquivo(arquivo.id, checked as boolean)}
                      />
                    </td>
                    <td className="p-3 font-medium">{arquivo.nome}</td>
                    <td className="p-3">{new Date(arquivo.dataEnvio).toLocaleDateString("pt-BR")}</td>
                    <td className="p-3">{arquivo.banco}</td>
                    <td className="p-3">{arquivo.beneficiario}</td>
                    <td className="p-3 text-right">{arquivo.totalRegistros}</td>
                    <td className="p-3 text-right font-medium">
                      R$ {arquivo.valorTotal.toLocaleString("pt-BR", { minimumFractionDigits: 2 })}
                    </td>
                    <td className="p-3 text-center">{getStatusBadge(arquivo.status)}</td>
                    <td className="p-3 text-center">
                      <div className="flex items-center justify-center gap-2">
                        <Button size="sm" variant="outline">
                          <Download className="h-4 w-4" />
                        </Button>
                        <Button size="sm" variant="outline">
                          <FileText className="h-4 w-4" />
                        </Button>
                        <Button
                          size="sm"
                          className="bg-blue-600 hover:bg-blue-700 text-white"
                          onClick={() => handleAlterarVencimento(arquivo.id)}
                        >
                          Alterar Vencimento
                        </Button>
                        <Button size="sm" className="bg-green-600 hover:bg-green-700 text-white">
                          <MessageSquare className="h-4 w-4" />
                        </Button>
                        <Button size="sm" variant="outline">
                          <Mail className="h-4 w-4" />
                        </Button>
                        <Button size="sm" variant="outline">
                          <Printer className="h-4 w-4" />
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
