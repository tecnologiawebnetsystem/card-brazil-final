"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Textarea } from "@/components/ui/textarea"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { EditIcon, PlusIcon, TrashIcon, AlertTriangleIcon, CheckIcon, XIcon } from "lucide-react"

export default function AjustesManuaisPage() {
  const [selectedPeriod, setSelectedPeriod] = useState("2024-03")
  const [isDialogOpen, setIsDialogOpen] = useState(false)

  const ajustesData = [
    {
      id: "AJT-2024-001",
      data: "2024-03-15",
      tipo: "Correção de Lançamento",
      contaDebito: "1.1.2.01.001 - Banco do Brasil",
      contaCredito: "4.1.1.01.001 - Despesas com Sinistros",
      valor: 2500.0,
      historico: "Correção de lançamento duplicado - Ref: LCT-2024-045",
      justificativa: "Lançamento foi duplicado por erro no sistema. Necessário estorno.",
      status: "Aprovado",
      usuario: "João Silva",
      aprovador: "Maria Santos",
      dataAprovacao: "2024-03-16",
    },
    {
      id: "AJT-2024-002",
      data: "2024-03-18",
      tipo: "Reclassificação",
      contaDebito: "4.2.1.01.001 - Despesas Administrativas",
      contaCredito: "4.1.1.01.001 - Despesas com Sinistros",
      valor: 1800.0,
      historico: "Reclassificação de despesa médica para administrativa",
      justificativa: "Despesa foi classificada incorretamente como sinistro médico.",
      status: "Pendente",
      usuario: "Carlos Oliveira",
      aprovador: null,
      dataAprovacao: null,
    },
    {
      id: "AJT-2024-003",
      data: "2024-03-20",
      tipo: "Ajuste de Provisão",
      contaDebito: "4.1.2.01.001 - Provisão de Sinistros",
      contaCredito: "2.1.2.01.001 - Provisão a Pagar",
      valor: 5000.0,
      historico: "Ajuste de provisão conforme reavaliação atuarial",
      justificativa: "Reavaliação atuarial indicou necessidade de ajuste na provisão.",
      status: "Rejeitado",
      usuario: "Ana Costa",
      aprovador: "Maria Santos",
      dataAprovacao: "2024-03-21",
    },
  ]

  const resumoAjustes = {
    totalAjustes: ajustesData.length,
    aprovados: ajustesData.filter((item) => item.status === "Aprovado").length,
    pendentes: ajustesData.filter((item) => item.status === "Pendente").length,
    rejeitados: ajustesData.filter((item) => item.status === "Rejeitado").length,
    valorTotal: ajustesData.reduce((sum, item) => sum + item.valor, 0),
  }

  return (
    <div className="flex-1 space-y-6 p-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold tracking-tight bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
            Ajustes Manuais
          </h2>
          <p className="text-muted-foreground">Gestão de ajustes e correções contábeis</p>
        </div>
        <div className="flex items-center space-x-2">
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button>
                <PlusIcon className="mr-2 h-4 w-4" />
                Novo Ajuste
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl">
              <DialogHeader>
                <DialogTitle>Novo Ajuste Manual</DialogTitle>
                <DialogDescription>Crie um novo ajuste contábil manual</DialogDescription>
              </DialogHeader>
              <div className="grid gap-4 py-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="tipo">Tipo de Ajuste</Label>
                    <Select>
                      <SelectTrigger>
                        <SelectValue placeholder="Selecione o tipo" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="correcao">Correção de Lançamento</SelectItem>
                        <SelectItem value="reclassificacao">Reclassificação</SelectItem>
                        <SelectItem value="provisao">Ajuste de Provisão</SelectItem>
                        <SelectItem value="estorno">Estorno</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="valor">Valor</Label>
                    <Input id="valor" type="number" placeholder="0,00" />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="contaDebito">Conta Débito</Label>
                  <Select>
                    <SelectTrigger>
                      <SelectValue placeholder="Selecione a conta de débito" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="1.1.2.01.001">1.1.2.01.001 - Banco do Brasil</SelectItem>
                      <SelectItem value="4.1.1.01.001">4.1.1.01.001 - Despesas com Sinistros</SelectItem>
                      <SelectItem value="4.2.1.01.001">4.2.1.01.001 - Despesas Administrativas</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="contaCredito">Conta Crédito</Label>
                  <Select>
                    <SelectTrigger>
                      <SelectValue placeholder="Selecione a conta de crédito" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="1.1.2.01.001">1.1.2.01.001 - Banco do Brasil</SelectItem>
                      <SelectItem value="4.1.1.01.001">4.1.1.01.001 - Despesas com Sinistros</SelectItem>
                      <SelectItem value="2.1.2.01.001">2.1.2.01.001 - Provisão a Pagar</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="historico">Histórico</Label>
                  <Input id="historico" placeholder="Descrição do lançamento" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="justificativa">Justificativa</Label>
                  <Textarea id="justificativa" placeholder="Justificativa para o ajuste manual" />
                </div>
              </div>
              <DialogFooter>
                <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
                  Cancelar
                </Button>
                <Button onClick={() => setIsDialogOpen(false)}>Criar Ajuste</Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      {/* Cards de Resumo */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card className="border-l-4 border-l-blue-500">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Ajustes</CardTitle>
            <EditIcon className="h-4 w-4 text-blue-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-600">{resumoAjustes.totalAjustes}</div>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-green-500">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Aprovados</CardTitle>
            <CheckIcon className="h-4 w-4 text-green-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">{resumoAjustes.aprovados}</div>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-yellow-500">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Pendentes</CardTitle>
            <AlertTriangleIcon className="h-4 w-4 text-yellow-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-yellow-600">{resumoAjustes.pendentes}</div>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-red-500">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Rejeitados</CardTitle>
            <XIcon className="h-4 w-4 text-red-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-600">{resumoAjustes.rejeitados}</div>
          </CardContent>
        </Card>
      </div>

      {/* Ajustes Manuais */}
      <Card>
        <CardHeader>
          <CardTitle>Ajustes Manuais - {selectedPeriod}</CardTitle>
          <CardDescription>Gestão de ajustes e correções contábeis</CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="ajustes" className="w-full">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="ajustes">Ajustes</TabsTrigger>
              <TabsTrigger value="aprovacao">Aprovação</TabsTrigger>
              <TabsTrigger value="historico">Histórico</TabsTrigger>
            </TabsList>

            <TabsContent value="ajustes" className="space-y-4">
              <div className="rounded-md border">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>ID</TableHead>
                      <TableHead>Data</TableHead>
                      <TableHead>Tipo</TableHead>
                      <TableHead>Conta Débito</TableHead>
                      <TableHead>Conta Crédito</TableHead>
                      <TableHead className="text-right">Valor</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Ações</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {ajustesData.map((ajuste) => (
                      <TableRow key={ajuste.id}>
                        <TableCell className="font-mono text-sm">{ajuste.id}</TableCell>
                        <TableCell>{new Date(ajuste.data).toLocaleDateString("pt-BR")}</TableCell>
                        <TableCell className="font-medium">{ajuste.tipo}</TableCell>
                        <TableCell className="text-sm">{ajuste.contaDebito}</TableCell>
                        <TableCell className="text-sm">{ajuste.contaCredito}</TableCell>
                        <TableCell className="text-right font-semibold">
                          R$ {ajuste.valor.toLocaleString("pt-BR", { minimumFractionDigits: 2 })}
                        </TableCell>
                        <TableCell>
                          <Badge
                            variant={
                              ajuste.status === "Aprovado"
                                ? "default"
                                : ajuste.status === "Pendente"
                                  ? "secondary"
                                  : "destructive"
                            }
                          >
                            {ajuste.status}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center space-x-2">
                            <Button variant="outline" size="sm">
                              <EditIcon className="h-4 w-4" />
                            </Button>
                            <Button variant="outline" size="sm">
                              <TrashIcon className="h-4 w-4" />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </TabsContent>

            <TabsContent value="aprovacao" className="space-y-4">
              <div className="text-center py-8 text-muted-foreground">Fluxo de aprovação em desenvolvimento</div>
            </TabsContent>

            <TabsContent value="historico" className="space-y-4">
              <div className="text-center py-8 text-muted-foreground">Histórico de alterações em desenvolvimento</div>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  )
}
