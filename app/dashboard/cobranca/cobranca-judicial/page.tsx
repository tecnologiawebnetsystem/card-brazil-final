"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Gavel, FileText, Calendar } from "lucide-react"

export default function CobrancaJudicialPage() {
  const [processos, setProcessos] = useState<any[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [novoProcesso, setNovoProcesso] = useState({
    beneficiario: "",
    valorDevido: "",
    advogado: "",
    tribunal: "",
    observacao: "",
  })

  useEffect(() => {
    fetch("/api/financeiro/processos-judiciais", { credentials: "include" })
      .then((response) => response.json())
      .then((payload) => setProcessos(Array.isArray(payload) ? payload : payload.data || []))
      .catch((requestError) => {
        console.error("[v0] Erro ao carregar processos judiciais:", requestError)
        setError("Não foi possível carregar os processos judiciais.")
      })
      .finally(() => setIsLoading(false))
  }, [])

  return (
    <div className="space-y-6 p-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Cobrança Judicial</h1>
          <p className="text-muted-foreground">Gerencie processos judiciais de cobrança</p>
        </div>
      </div>

      <Card className="border-red-200">
        <CardHeader className="border-b border-red-200">
          <CardTitle className="text-lg font-semibold flex items-center gap-2 text-foreground">
            <Gavel className="h-5 w-5" />
            Novo Processo Judicial
          </CardTitle>
        </CardHeader>
        <CardContent className="p-6 space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Beneficiário</Label>
              <Input
                placeholder="Nome do beneficiário"
                value={novoProcesso.beneficiario}
                onChange={(e) => setNovoProcesso({ ...novoProcesso, beneficiario: e.target.value })}
              />
            </div>

            <div className="space-y-2">
              <Label>Valor Devido (R$)</Label>
              <Input
                type="number"
                placeholder="0,00"
                value={novoProcesso.valorDevido}
                onChange={(e) => setNovoProcesso({ ...novoProcesso, valorDevido: e.target.value })}
              />
            </div>

            <div className="space-y-2">
              <Label>Advogado Responsável</Label>
              <Select
                value={novoProcesso.advogado}
                onValueChange={(value) => setNovoProcesso({ ...novoProcesso, advogado: value })}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Selecionar advogado" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="dr-carlos">Dr. Carlos Mendes</SelectItem>
                  <SelectItem value="dra-ana">Dra. Ana Santos</SelectItem>
                  <SelectItem value="dr-paulo">Dr. Paulo Silva</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label>Tribunal</Label>
              <Input
                placeholder="Ex: 1ª Vara Cível - SP"
                value={novoProcesso.tribunal}
                onChange={(e) => setNovoProcesso({ ...novoProcesso, tribunal: e.target.value })}
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label>Observações</Label>
            <Textarea
              placeholder="Detalhes sobre o processo judicial"
              value={novoProcesso.observacao}
              onChange={(e) => setNovoProcesso({ ...novoProcesso, observacao: e.target.value })}
              rows={3}
            />
          </div>

          <div className="flex gap-3 justify-end pt-4 border-t">
            <Button className="bg-red-600 hover:bg-red-700">
              <Gavel className="h-4 w-4 mr-2" />
              Iniciar Processo
            </Button>
          </div>
        </CardContent>
      </Card>

      <Card className="border-red-200">
        <CardHeader className="bg-red-50 border-b border-red-200">
          <CardTitle className="text-red-800">Processos Judiciais Ativos</CardTitle>
          <CardDescription>Lista de processos judiciais em andamento</CardDescription>
        </CardHeader>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow className="bg-red-50">
                <TableHead className="text-red-800 font-semibold">Processo</TableHead>
                <TableHead className="text-red-800 font-semibold">Beneficiário</TableHead>
                <TableHead className="text-red-800 font-semibold">Valor Devido</TableHead>
                <TableHead className="text-red-800 font-semibold">Data Início</TableHead>
                <TableHead className="text-red-800 font-semibold">Status</TableHead>
                <TableHead className="text-red-800 font-semibold">Advogado</TableHead>
                <TableHead className="text-red-800 font-semibold">Tribunal</TableHead>
                <TableHead className="text-red-800 font-semibold">Ações</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {isLoading ? <TableRow><TableCell colSpan={8} className="h-24 text-center text-muted-foreground">Carregando processos...</TableCell></TableRow> : error ? <TableRow><TableCell colSpan={8} className="h-24 text-center text-destructive">{error}</TableCell></TableRow> : processos.length === 0 ? <TableRow><TableCell colSpan={8} className="h-24 text-center text-muted-foreground">Nenhum processo judicial encontrado.</TableCell></TableRow> : processos.map((processo) => (
                <TableRow key={processo.id} className="hover:bg-red-50/50">
                  <TableCell className="font-medium">{processo.id}</TableCell>
                  <TableCell>{processo.beneficiario_nome || processo.beneficiario_id || "—"}</TableCell>
                  <TableCell className="font-semibold text-red-600">R$ {Number(processo.valor_causa || processo.valorDevido || 0).toFixed(2)}</TableCell>
                  <TableCell>{new Date(processo.data_distribuicao).toLocaleDateString("pt-BR")}</TableCell>
                  <TableCell>
                    <Badge variant={(processo.status || processo.resultado) === "Sentença Favorável" || processo.status === "concluido" ? "default" : "secondary"}>
                      {processo.status || processo.resultado || "—"}
                    </Badge>
                  </TableCell>
                  <TableCell>{processo.advogado_nome || processo.advogado_id || "—"}</TableCell>
                  <TableCell>{processo.tribunal_nome || processo.tribunal_id || "—"}</TableCell>
                  <TableCell>
                    <div className="flex gap-2">
                      <Button size="sm" variant="ghost" className="text-blue-600 hover:text-blue-700">
                        <FileText className="w-4 h-4" />
                      </Button>
                      <Button size="sm" variant="ghost" className="text-orange-600 hover:text-orange-700">
                        <Calendar className="w-4 h-4" />
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
