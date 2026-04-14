"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Search, FileText, Send, X, AlertTriangle } from "lucide-react"

const mockTitulos = [
  {
    id: "TIT-001",
    beneficiario: "João Silva Santos",
    numeroTitulo: "BOL-2024-001",
    valorTitulo: 850.0,
    dataVencimento: "2023-12-15",
    diasAtraso: 45,
    statusProtesto: "Enviado",
    cartorio: "1º Cartório de Protestos - SP",
  },
  {
    id: "TIT-002",
    beneficiario: "Maria Costa Lima",
    numeroTitulo: "BOL-2024-002",
    valorTitulo: 1200.0,
    dataVencimento: "2023-11-20",
    diasAtraso: 75,
    statusProtesto: "Protestado",
    cartorio: "2º Cartório de Protestos - RJ",
  },
  {
    id: "TIT-003",
    beneficiario: "Roberto Santos",
    numeroTitulo: "BOL-2024-003",
    valorTitulo: 650.0,
    dataVencimento: "2024-01-10",
    diasAtraso: 30,
    statusProtesto: "Pendente",
    cartorio: "-",
  },
]

export default function ProtestoTitulosPage() {
  const [filtros, setFiltros] = useState({
    beneficiario: "",
    statusProtesto: "Todos",
    cartorio: "Todos",
  })

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "Protestado":
        return <Badge className="bg-red-500/10 text-red-400 border-red-500/20">{status}</Badge>
      case "Enviado":
        return <Badge className="bg-yellow-500/10 text-yellow-400 border-yellow-500/20">{status}</Badge>
      case "Pendente":
        return <Badge className="bg-[#262626] text-[#a1a1a1] border-[#333]">{status}</Badge>
      default:
        return <Badge variant="outline">{status}</Badge>
    }
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-semibold text-[#ededed]">Protesto de Titulos</h1>
        <p className="text-[#737373] text-sm mt-1">Gerencie protestos de titulos em cartorio</p>
      </div>

      {/* Filters Card */}
      <Card className="bg-[#0a0a0a] border-[#1a1a1a]">
        <CardHeader className="border-b border-[#1a1a1a] pb-4">
          <CardTitle className="text-base font-medium flex items-center gap-2 text-[#ededed]">
            <Search className="h-4 w-4 text-[#737373]" />
            Filtros de Pesquisa
          </CardTitle>
        </CardHeader>
        <CardContent className="pt-6 space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="space-y-2">
              <Label className="text-[#a1a1a1] text-sm">Beneficiario</Label>
              <Input
                placeholder="Nome do beneficiário"
                value={filtros.beneficiario}
                onChange={(e) => setFiltros({ ...filtros, beneficiario: e.target.value })}
                className="bg-[#171717] border-[#262626] text-[#ededed] placeholder:text-[#525252] focus:border-[#00d084] focus:ring-1 focus:ring-[#00d084]/20"
              />
            </div>

            <div className="space-y-2">
              <Label className="text-[#a1a1a1] text-sm">Status do Protesto</Label>
              <Select
                value={filtros.statusProtesto}
                onValueChange={(value) => setFiltros({ ...filtros, statusProtesto: value })}
              >
                <SelectTrigger className="bg-[#171717] border-[#262626] text-[#ededed] focus:border-[#00d084] focus:ring-1 focus:ring-[#00d084]/20">
                  <SelectValue placeholder="Todos" />
                </SelectTrigger>
                <SelectContent className="bg-[#0a0a0a] border-[#262626]">
                  <SelectItem value="Todos">Todos</SelectItem>
                  <SelectItem value="pendente">Pendente</SelectItem>
                  <SelectItem value="enviado">Enviado</SelectItem>
                  <SelectItem value="protestado">Protestado</SelectItem>
                  <SelectItem value="cancelado">Cancelado</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label className="text-[#a1a1a1] text-sm">Cartorio</Label>
              <Select value={filtros.cartorio} onValueChange={(value) => setFiltros({ ...filtros, cartorio: value })}>
                <SelectTrigger className="bg-[#171717] border-[#262626] text-[#ededed] focus:border-[#00d084] focus:ring-1 focus:ring-[#00d084]/20">
                  <SelectValue placeholder="Todos" />
                </SelectTrigger>
                <SelectContent className="bg-[#0a0a0a] border-[#262626]">
                  <SelectItem value="Todos">Todos</SelectItem>
                  <SelectItem value="1-cartorio-sp">1º Cartório de Protestos - SP</SelectItem>
                  <SelectItem value="2-cartorio-rj">2º Cartório de Protestos - RJ</SelectItem>
                  <SelectItem value="3-cartorio-mg">3º Cartório de Protestos - MG</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="flex gap-3 justify-end pt-4 border-t border-[#1a1a1a]">
            <Button variant="outline" className="border-[#262626] text-[#a1a1a1] hover:bg-[#1a1a1a] hover:text-[#ededed]">
              Limpar
            </Button>
            <Button className="bg-[#00d084] text-black hover:bg-[#00f5a0] font-medium">
              <Search className="h-4 w-4 mr-2" />
              Pesquisar
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Results Card */}
      <Card className="bg-[#0a0a0a] border-[#1a1a1a]">
        <CardHeader className="border-b border-[#1a1a1a]">
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="text-base font-medium text-[#ededed] flex items-center gap-2">
                <AlertTriangle className="h-4 w-4 text-[#f5a623]" />
                Titulos para Protesto
              </CardTitle>
              <CardDescription className="text-[#737373] mt-1">
                Titulos em atraso elegiveis para protesto em cartorio
              </CardDescription>
            </div>
            <Badge className="bg-[#1a1a1a] text-[#a1a1a1] border-[#262626]">
              {mockTitulos.length} registros
            </Badge>
          </div>
        </CardHeader>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow className="border-b border-[#1a1a1a] hover:bg-transparent">
                  <TableHead className="text-[#737373] font-medium text-xs uppercase tracking-wider">ID</TableHead>
                  <TableHead className="text-[#737373] font-medium text-xs uppercase tracking-wider">Beneficiario</TableHead>
                  <TableHead className="text-[#737373] font-medium text-xs uppercase tracking-wider">Nº Titulo</TableHead>
                  <TableHead className="text-[#737373] font-medium text-xs uppercase tracking-wider">Valor</TableHead>
                  <TableHead className="text-[#737373] font-medium text-xs uppercase tracking-wider">Vencimento</TableHead>
                  <TableHead className="text-[#737373] font-medium text-xs uppercase tracking-wider">Atraso</TableHead>
                  <TableHead className="text-[#737373] font-medium text-xs uppercase tracking-wider">Status</TableHead>
                  <TableHead className="text-[#737373] font-medium text-xs uppercase tracking-wider">Cartorio</TableHead>
                  <TableHead className="text-[#737373] font-medium text-xs uppercase tracking-wider">Acoes</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {mockTitulos.map((titulo) => (
                  <TableRow key={titulo.id} className="border-b border-[#1a1a1a] hover:bg-[#0f0f0f]">
                    <TableCell className="font-mono text-sm text-[#a1a1a1]">{titulo.id}</TableCell>
                    <TableCell className="text-[#ededed]">{titulo.beneficiario}</TableCell>
                    <TableCell className="font-mono text-sm text-[#a1a1a1]">{titulo.numeroTitulo}</TableCell>
                    <TableCell className="font-medium text-[#ededed]">
                      R$ {titulo.valorTitulo.toFixed(2)}
                    </TableCell>
                    <TableCell className="text-[#a1a1a1]">
                      {new Date(titulo.dataVencimento).toLocaleDateString("pt-BR")}
                    </TableCell>
                    <TableCell>
                      <Badge className="bg-red-500/10 text-red-400 border-red-500/20">
                        {titulo.diasAtraso} dias
                      </Badge>
                    </TableCell>
                    <TableCell>{getStatusBadge(titulo.statusProtesto)}</TableCell>
                    <TableCell className="text-sm text-[#737373]">{titulo.cartorio}</TableCell>
                    <TableCell>
                      <div className="flex gap-1">
                        {titulo.statusProtesto === "Pendente" && (
                          <Button size="sm" variant="ghost" className="h-8 w-8 p-0 text-[#00d084] hover:bg-[#00d084]/10">
                            <Send className="w-4 h-4" />
                          </Button>
                        )}
                        <Button size="sm" variant="ghost" className="h-8 w-8 p-0 text-[#0070f3] hover:bg-[#0070f3]/10">
                          <FileText className="w-4 h-4" />
                        </Button>
                        {titulo.statusProtesto !== "Protestado" && (
                          <Button size="sm" variant="ghost" className="h-8 w-8 p-0 text-red-400 hover:bg-red-500/10">
                            <X className="w-4 h-4" />
                          </Button>
                        )}
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
