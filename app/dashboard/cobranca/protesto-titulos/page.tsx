"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Search, FileText, Send, X } from "lucide-react"

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
]

export default function ProtestoTitulosPage() {
  const [filtros, setFiltros] = useState({
    beneficiario: "",
    statusProtesto: "Todos",
    cartorio: "Todos",
  })

  return (
    <div className="space-y-6 p-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Protesto de Títulos</h1>
          <p className="text-muted-foreground">Gerencie protestos de títulos em cartório</p>
        </div>
      </div>

      <Card className="border-orange-200">
        <CardHeader className="border-b border-orange-200">
          <CardTitle className="text-lg font-semibold flex items-center gap-2 text-foreground">
            <Search className="h-5 w-5" />
            Filtros de Pesquisa
          </CardTitle>
        </CardHeader>
        <CardContent className="p-6 space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="space-y-2">
              <Label>Beneficiário</Label>
              <Input
                placeholder="Nome do beneficiário"
                value={filtros.beneficiario}
                onChange={(e) => setFiltros({ ...filtros, beneficiario: e.target.value })}
              />
            </div>

            <div className="space-y-2">
              <Label>Status do Protesto</Label>
              <Select
                value={filtros.statusProtesto}
                onValueChange={(value) => setFiltros({ ...filtros, statusProtesto: value })}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Todos" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Todos">Todos</SelectItem>
                  <SelectItem value="pendente">Pendente</SelectItem>
                  <SelectItem value="enviado">Enviado</SelectItem>
                  <SelectItem value="protestado">Protestado</SelectItem>
                  <SelectItem value="cancelado">Cancelado</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label>Cartório</Label>
              <Select value={filtros.cartorio} onValueChange={(value) => setFiltros({ ...filtros, cartorio: value })}>
                <SelectTrigger>
                  <SelectValue placeholder="Todos" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Todos">Todos</SelectItem>
                  <SelectItem value="1-cartorio-sp">1º Cartório de Protestos - SP</SelectItem>
                  <SelectItem value="2-cartorio-rj">2º Cartório de Protestos - RJ</SelectItem>
                  <SelectItem value="3-cartorio-mg">3º Cartório de Protestos - MG</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="flex gap-3 justify-end pt-4 border-t">
            <Button className="bg-orange-600 hover:bg-orange-700">
              <Search className="h-4 w-4 mr-2" />
              Pesquisar
            </Button>
          </div>
        </CardContent>
      </Card>

      <Card className="border-orange-200">
        <CardHeader className="bg-orange-50 border-b border-orange-200">
          <CardTitle className="text-orange-800">Títulos para Protesto</CardTitle>
          <CardDescription>Títulos em atraso elegíveis para protesto em cartório</CardDescription>
        </CardHeader>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow className="bg-orange-50">
                <TableHead className="text-orange-800 font-semibold">ID</TableHead>
                <TableHead className="text-orange-800 font-semibold">Beneficiário</TableHead>
                <TableHead className="text-orange-800 font-semibold">Nº Título</TableHead>
                <TableHead className="text-orange-800 font-semibold">Valor</TableHead>
                <TableHead className="text-orange-800 font-semibold">Vencimento</TableHead>
                <TableHead className="text-orange-800 font-semibold">Dias Atraso</TableHead>
                <TableHead className="text-orange-800 font-semibold">Status</TableHead>
                <TableHead className="text-orange-800 font-semibold">Cartório</TableHead>
                <TableHead className="text-orange-800 font-semibold">Ações</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {mockTitulos.map((titulo) => (
                <TableRow key={titulo.id} className="hover:bg-orange-50/50">
                  <TableCell className="font-medium">{titulo.id}</TableCell>
                  <TableCell>{titulo.beneficiario}</TableCell>
                  <TableCell>{titulo.numeroTitulo}</TableCell>
                  <TableCell className="font-semibold text-orange-600">R$ {titulo.valorTitulo.toFixed(2)}</TableCell>
                  <TableCell>{new Date(titulo.dataVencimento).toLocaleDateString("pt-BR")}</TableCell>
                  <TableCell>
                    <Badge variant="destructive" className="bg-red-100 text-red-800">
                      {titulo.diasAtraso} dias
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <Badge
                      variant={
                        titulo.statusProtesto === "Protestado"
                          ? "destructive"
                          : titulo.statusProtesto === "Enviado"
                            ? "secondary"
                            : "outline"
                      }
                    >
                      {titulo.statusProtesto}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-sm">{titulo.cartorio}</TableCell>
                  <TableCell>
                    <div className="flex gap-2">
                      {titulo.statusProtesto === "Pendente" && (
                        <Button size="sm" variant="ghost" className="text-orange-600 hover:text-orange-700">
                          <Send className="w-4 h-4" />
                        </Button>
                      )}
                      <Button size="sm" variant="ghost" className="text-blue-600 hover:text-blue-700">
                        <FileText className="w-4 h-4" />
                      </Button>
                      {titulo.statusProtesto !== "Protestado" && (
                        <Button size="sm" variant="ghost" className="text-red-600 hover:text-red-700">
                          <X className="w-4 h-4" />
                        </Button>
                      )}
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  )
}
