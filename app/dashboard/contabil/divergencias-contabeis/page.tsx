"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { AlertTriangle, Search, RefreshCw, CheckCircle, X } from "lucide-react"

export default function DivergenciasContabeisPage() {
  const [divergencias, setDivergencias] = useState<any[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [filtros, setFiltros] = useState({
    conta: "",
    status: "all", // Updated default value to "all"
    responsavel: "",
  })

  useEffect(() => {
    fetch("/api/contabil/lancamentos?limit=100", { credentials: "include" })
      .then((response) => response.json())
      .then((payload) => setDivergencias((payload.data || []).map((item: any) => ({
        id: `LCT-${item.id}`,
        conta: `${item.plano_conta_id || "—"} / ${item.centro_custo_id || "—"}`,
        descricao: item.historico || "Lançamento contábil",
        valorContabil: Number(item.valor || 0),
        valorERP: null,
        diferenca: null,
        dataIdentificacao: item.data_lancamento,
        status: item.status === "conciliado" ? "Corrigida" : item.status === "em_analise" ? "Em Análise" : "Pendente",
        responsavel: item.origem || "Sistema",
      }))))
      .catch((requestError) => {
        console.error("[v0] Erro ao carregar lançamentos contábeis:", requestError)
        setError("Não foi possível carregar os lançamentos contábeis.")
      })
      .finally(() => setIsLoading(false))
  }, [])

  return (
    <div className="space-y-6 p-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Divergências Contábeis</h1>
          <p className="text-muted-foreground">Identifique e gerencie divergências entre sistemas</p>
        </div>
        <Button className="bg-blue-600 hover:bg-blue-700">
          <RefreshCw className="h-4 w-4 mr-2" />
          Verificar Divergências
        </Button>
      </div>

      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Divergências</CardTitle>
            <AlertTriangle className="h-4 w-4 text-orange-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-orange-600">{divergencias.length}</div>
            <p className="text-xs text-muted-foreground">divergências identificadas</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Pendentes</CardTitle>
            <X className="h-4 w-4 text-red-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-600">
              {divergencias.filter((d) => d.status === "Pendente").length}
            </div>
            <p className="text-xs text-muted-foreground">aguardando correção</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Em Análise</CardTitle>
            <Search className="h-4 w-4 text-yellow-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-yellow-600">
              {divergencias.filter((d) => d.status === "Em Análise").length}
            </div>
            <p className="text-xs text-muted-foreground">sendo analisadas</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Corrigidas</CardTitle>
            <CheckCircle className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">
              {divergencias.filter((d) => d.status === "Corrigida").length}
            </div>
            <p className="text-xs text-muted-foreground">já corrigidas</p>
          </CardContent>
        </Card>
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
              <Label>Conta Contábil</Label>
              <Input
                placeholder="Digite o código ou nome da conta"
                value={filtros.conta}
                onChange={(e) => setFiltros({ ...filtros, conta: e.target.value })}
              />
            </div>

            <div className="space-y-2">
              <Label>Status</Label>
              <Select value={filtros.status} onValueChange={(value) => setFiltros({ ...filtros, status: value })}>
                <SelectTrigger>
                  <SelectValue placeholder="Todos" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todos</SelectItem> // Updated value prop to "all"
                  <SelectItem value="pendente">Pendente</SelectItem>
                  <SelectItem value="analise">Em Análise</SelectItem>
                  <SelectItem value="corrigida">Corrigida</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label>Responsável</Label>
              <Select
                value={filtros.responsavel}
                onValueChange={(value) => setFiltros({ ...filtros, responsavel: value })}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Todos" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todos</SelectItem> // Updated value prop to "all"
                  <SelectItem value="joao">João Silva</SelectItem>
                  <SelectItem value="maria">Maria Santos</SelectItem>
                  <SelectItem value="carlos">Carlos Lima</SelectItem>
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
          <CardTitle className="text-orange-800">Lista de Divergências</CardTitle>
          <CardDescription>Divergências identificadas entre sistema contábil e ERP</CardDescription>
        </CardHeader>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow className="bg-orange-50">
                <TableHead className="text-orange-800 font-semibold">ID</TableHead>
                <TableHead className="text-orange-800 font-semibold">Conta</TableHead>
                <TableHead className="text-orange-800 font-semibold">Descrição</TableHead>
                <TableHead className="text-orange-800 font-semibold">Valor Contábil</TableHead>
                <TableHead className="text-orange-800 font-semibold">Valor ERP</TableHead>
                <TableHead className="text-orange-800 font-semibold">Diferença</TableHead>
                <TableHead className="text-orange-800 font-semibold">Data</TableHead>
                <TableHead className="text-orange-800 font-semibold">Status</TableHead>
                <TableHead className="text-orange-800 font-semibold">Responsável</TableHead>
                <TableHead className="text-orange-800 font-semibold">Ações</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {isLoading ? <TableRow><TableCell colSpan={10} className="h-24 text-center text-muted-foreground">Carregando lançamentos...</TableCell></TableRow> : error ? <TableRow><TableCell colSpan={10} className="h-24 text-center text-destructive">{error}</TableCell></TableRow> : divergencias.length === 0 ? <TableRow><TableCell colSpan={10} className="h-24 text-center text-muted-foreground">Nenhum lançamento encontrado.</TableCell></TableRow> : divergencias.map((divergencia) => (
                <TableRow key={divergencia.id} className="hover:bg-orange-50/50">
                  <TableCell className="font-medium">{divergencia.id}</TableCell>
                  <TableCell className="text-sm">{divergencia.conta}</TableCell>
                  <TableCell className="text-sm">{divergencia.descricao}</TableCell>
                  <TableCell className="font-semibold">R$ {divergencia.valorContabil.toFixed(2)}</TableCell>
                  <TableCell className="font-semibold">{divergencia.valorERP == null ? "Não disponível" : `R$ ${divergencia.valorERP.toFixed(2)}`}</TableCell>
                  <TableCell
                    className={`font-semibold ${divergencia.diferenca == null ? "text-muted-foreground" : divergencia.diferenca > 0 ? "text-green-600" : "text-red-600"}`}
                  >
                    {divergencia.diferenca == null ? "Não disponível" : `R$ ${divergencia.diferenca.toFixed(2)}`}
                  </TableCell>
                  <TableCell>{new Date(divergencia.dataIdentificacao).toLocaleDateString("pt-BR")}</TableCell>
                  <TableCell>
                    <Badge
                      variant={
                        divergencia.status === "Corrigida"
                          ? "default"
                          : divergencia.status === "Em Análise"
                            ? "secondary"
                            : "destructive"
                      }
                    >
                      {divergencia.status}
                    </Badge>
                  </TableCell>
                  <TableCell>{divergencia.responsavel}</TableCell>
                  <TableCell>
                    <div className="flex gap-2">
                      {divergencia.status !== "Corrigida" && (
                        <Button size="sm" variant="ghost" className="text-green-600 hover:text-green-700">
                          <CheckCircle className="w-4 h-4" />
                        </Button>
                      )}
                      <Button size="sm" variant="ghost" className="text-blue-600 hover:text-blue-700">
                        <Search className="w-4 h-4" />
                      </Button>
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
