"use client"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { Download, FileText, CheckCircle, AlertCircle, Clock } from "lucide-react"

export default function RetornoBancarioPage() {
  const retornosBancarios = [
    {
      id: "001",
      nome: "RETORNO_20240315_001.ret",
      dataProcessamento: "2024-03-15",
      banco: "Banco do Brasil",
      totalRegistros: 145,
      pagamentos: 120,
      rejeicoes: 25,
      valorProcessado: 42500.0,
      status: "Processado",
    },
    {
      id: "002",
      nome: "RETORNO_20240314_001.ret",
      dataProcessamento: "2024-03-14",
      banco: "Itaú",
      totalRegistros: 87,
      pagamentos: 80,
      rejeicoes: 7,
      valorProcessado: 26800.0,
      status: "Processando",
    },
    {
      id: "003",
      nome: "RETORNO_20240313_001.ret",
      dataProcessamento: "2024-03-13",
      banco: "Bradesco",
      totalRegistros: 198,
      pagamentos: 165,
      rejeicoes: 33,
      valorProcessado: 58900.0,
      status: "Erro",
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
      case "Processando":
        return (
          <Badge className="bg-blue-100 text-blue-800">
            <Clock className="h-3 w-3 mr-1" />
            Processando
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

  return (
    <div className="container mx-auto p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-emerald-800">Retorno Bancário</h1>
          <p className="text-muted-foreground">Gerencie arquivos de retorno bancário</p>
        </div>
      </div>

      {/* Upload de Arquivo */}
      <Card>
        <CardHeader>
          <CardTitle className="text-emerald-800 flex items-center gap-2">
            <Download className="h-5 w-5" />
            Processar Arquivo de Retorno
          </CardTitle>
          <CardDescription>Faça upload de um arquivo de retorno bancário</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label>Selecionar Arquivo de Retorno</Label>
            <Input type="file" accept=".ret,.txt" />
          </div>
          <Button className="bg-emerald-600 hover:bg-emerald-700">
            <Download className="h-4 w-4 mr-2" />
            Processar Retorno
          </Button>
        </CardContent>
      </Card>

      {/* Lista de Retornos */}
      <Card>
        <CardHeader>
          <CardTitle className="text-emerald-800">Histórico de Retornos</CardTitle>
          <CardDescription>Arquivos de retorno processados</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full border-collapse">
              <thead>
                <tr className="border-b border-emerald-200">
                  <th className="text-left p-3 font-semibold text-emerald-800">Arquivo</th>
                  <th className="text-left p-3 font-semibold text-emerald-800">Data</th>
                  <th className="text-left p-3 font-semibold text-emerald-800">Banco</th>
                  <th className="text-right p-3 font-semibold text-emerald-800">Registros</th>
                  <th className="text-right p-3 font-semibold text-emerald-800">Pagamentos</th>
                  <th className="text-right p-3 font-semibold text-emerald-800">Rejeições</th>
                  <th className="text-right p-3 font-semibold text-emerald-800">Valor</th>
                  <th className="text-center p-3 font-semibold text-emerald-800">Status</th>
                  <th className="text-center p-3 font-semibold text-emerald-800">Ações</th>
                </tr>
              </thead>
              <tbody>
                {retornosBancarios.map((retorno) => (
                  <tr key={retorno.id} className="border-b border-gray-100 hover:bg-emerald-50">
                    <td className="p-3 font-medium">{retorno.nome}</td>
                    <td className="p-3">{new Date(retorno.dataProcessamento).toLocaleDateString("pt-BR")}</td>
                    <td className="p-3">{retorno.banco}</td>
                    <td className="p-3 text-right">{retorno.totalRegistros}</td>
                    <td className="p-3 text-right text-green-600 font-medium">{retorno.pagamentos}</td>
                    <td className="p-3 text-right text-red-600 font-medium">{retorno.rejeicoes}</td>
                    <td className="p-3 text-right font-medium">
                      R$ {retorno.valorProcessado.toLocaleString("pt-BR", { minimumFractionDigits: 2 })}
                    </td>
                    <td className="p-3 text-center">{getStatusBadge(retorno.status)}</td>
                    <td className="p-3 text-center">
                      <div className="flex items-center justify-center gap-2">
                        <Button size="sm" variant="outline">
                          <Download className="h-4 w-4" />
                        </Button>
                        <Button size="sm" variant="outline">
                          <FileText className="h-4 w-4" />
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
