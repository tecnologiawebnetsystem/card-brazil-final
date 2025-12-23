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
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Switch } from "@/components/ui/switch"

const RefreshIcon = () => (
  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
    />
  </svg>
)

const CalendarIcon = () => (
  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
    />
  </svg>
)

const CheckCircleIcon = () => (
  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
    />
  </svg>
)

const PlusIcon = () => (
  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
  </svg>
)

export default function RenovacoesPage() {
  const [showNovaRenovacao, setShowNovaRenovacao] = useState(false)
  const [renovacaoData, setRenovacaoData] = useState({
    contrato: "",
    dataVencimento: "",
    tipoRenovacao: "",
    reajuste: "",
    observacoes: "",
  })

  const [renovacoes] = useState([
    {
      id: 1,
      contrato: "CT-2024-001",
      empresa: "Tech Solutions Ltda",
      dataVencimento: "2024-03-15",
      dataRenovacao: "2024-03-15",
      status: "Renovado",
      reajuste: 12.5,
      valorAnterior: 45000.0,
      valorNovo: 50625.0,
      tipoRenovacao: "Automática",
    },
    {
      id: 2,
      contrato: "CT-2024-002",
      empresa: "Indústria ABC S.A.",
      dataVencimento: "2024-04-20",
      dataRenovacao: null,
      status: "Pendente",
      reajuste: 15.0,
      valorAnterior: 78000.0,
      valorNovo: 89700.0,
      tipoRenovacao: "Manual",
    },
    {
      id: 3,
      contrato: "CT-2024-003",
      empresa: "Comércio XYZ",
      dataVencimento: "2024-05-10",
      dataRenovacao: null,
      status: "Aguardando",
      reajuste: 10.8,
      valorAnterior: 32000.0,
      valorNovo: 35456.0,
      tipoRenovacao: "Automática",
    },
  ])

  const handleProcessarRenovacao = () => {
    setShowNovaRenovacao(false)
    setRenovacaoData({
      contrato: "",
      dataVencimento: "",
      tipoRenovacao: "",
      reajuste: "",
      observacoes: "",
    })
  }

  return (
    <div className="flex-1 space-y-6 p-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold tracking-tight text-foreground">Renovações</h2>
          <p className="text-muted-foreground">Gestão automática de renovações de contratos e apólices</p>
        </div>
        <Dialog open={showNovaRenovacao} onOpenChange={setShowNovaRenovacao}>
          <DialogTrigger asChild>
            <Button className="bg-primary hover:bg-primary/90">
              <PlusIcon />
              Nova Renovação
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[600px]">
            <DialogHeader>
              <DialogTitle>Processar Renovação</DialogTitle>
              <DialogDescription>Configure os parâmetros para renovação do contrato</DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="contrato">Contrato</Label>
                  <Select
                    value={renovacaoData.contrato}
                    onValueChange={(value) => setRenovacaoData({ ...renovacaoData, contrato: value })}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Selecione o contrato" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="ct-001">CT-2024-001 - Tech Solutions</SelectItem>
                      <SelectItem value="ct-002">CT-2024-002 - Indústria ABC</SelectItem>
                      <SelectItem value="ct-003">CT-2024-003 - Comércio XYZ</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="vencimento">Data de Vencimento</Label>
                  <Input
                    id="vencimento"
                    type="date"
                    value={renovacaoData.dataVencimento}
                    onChange={(e) => setRenovacaoData({ ...renovacaoData, dataVencimento: e.target.value })}
                  />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="tipo">Tipo de Renovação</Label>
                  <Select
                    value={renovacaoData.tipoRenovacao}
                    onValueChange={(value) => setRenovacaoData({ ...renovacaoData, tipoRenovacao: value })}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Selecione o tipo" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="automatica">Automática</SelectItem>
                      <SelectItem value="manual">Manual</SelectItem>
                      <SelectItem value="condicional">Condicional</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="reajuste">Reajuste (%)</Label>
                  <Input
                    id="reajuste"
                    type="number"
                    step="0.1"
                    placeholder="Ex: 12.5"
                    value={renovacaoData.reajuste}
                    onChange={(e) => setRenovacaoData({ ...renovacaoData, reajuste: e.target.value })}
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="observacoes">Observações</Label>
                <Input
                  id="observacoes"
                  placeholder="Observações sobre a renovação"
                  value={renovacaoData.observacoes}
                  onChange={(e) => setRenovacaoData({ ...renovacaoData, observacoes: e.target.value })}
                />
              </div>
            </div>
            <div className="flex justify-end gap-3">
              <Button variant="outline" onClick={() => setShowNovaRenovacao(false)}>
                Cancelar
              </Button>
              <Button onClick={handleProcessarRenovacao}>Processar Renovação</Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Renovações Pendentes</CardTitle>
            <CalendarIcon />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">23</div>
            <p className="text-xs text-muted-foreground">Vencimento nos próximos 30 dias</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Renovações Automáticas</CardTitle>
            <RefreshIcon />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">156</div>
            <p className="text-xs text-muted-foreground">+8% em relação ao mês anterior</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Taxa de Renovação</CardTitle>
            <CheckCircleIcon />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">94.2%</div>
            <p className="text-xs text-muted-foreground">+2.1% em relação ao mês anterior</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Reajuste Médio</CardTitle>
            <RefreshIcon />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">12.8%</div>
            <p className="text-xs text-muted-foreground">Baseado no IPCA + margem</p>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="renovacoes" className="space-y-4">
        <TabsList>
          <TabsTrigger value="renovacoes">Renovações</TabsTrigger>
          <TabsTrigger value="configuracoes">Configurações</TabsTrigger>
          <TabsTrigger value="relatorios">Relatórios</TabsTrigger>
        </TabsList>

        <TabsContent value="renovacoes" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Contratos para Renovação</CardTitle>
              <CardDescription>Lista de contratos com vencimento próximo ou pendentes de renovação</CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Contrato</TableHead>
                    <TableHead>Empresa</TableHead>
                    <TableHead>Vencimento</TableHead>
                    <TableHead>Tipo</TableHead>
                    <TableHead>Reajuste</TableHead>
                    <TableHead>Valor Anterior</TableHead>
                    <TableHead>Valor Novo</TableHead>
                    <TableHead>Status</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {renovacoes.map((renovacao) => (
                    <TableRow key={renovacao.id}>
                      <TableCell className="font-medium">{renovacao.contrato}</TableCell>
                      <TableCell>{renovacao.empresa}</TableCell>
                      <TableCell>{new Date(renovacao.dataVencimento).toLocaleDateString("pt-BR")}</TableCell>
                      <TableCell>{renovacao.tipoRenovacao}</TableCell>
                      <TableCell>{renovacao.reajuste}%</TableCell>
                      <TableCell>R$ {renovacao.valorAnterior.toLocaleString("pt-BR")}</TableCell>
                      <TableCell className="font-medium">R$ {renovacao.valorNovo.toLocaleString("pt-BR")}</TableCell>
                      <TableCell>
                        <Badge
                          variant={
                            renovacao.status === "Renovado"
                              ? "default"
                              : renovacao.status === "Pendente"
                                ? "destructive"
                                : "secondary"
                          }
                        >
                          {renovacao.status}
                        </Badge>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="configuracoes" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Configurações de Renovação</CardTitle>
              <CardDescription>Configure os parâmetros automáticos para renovações</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label className="text-base">Renovação Automática</Label>
                  <p className="text-sm text-muted-foreground">Ativar renovação automática para contratos elegíveis</p>
                </div>
                <Switch defaultChecked />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Dias de Antecedência para Notificação</Label>
                  <Input type="number" defaultValue="30" />
                </div>
                <div className="space-y-2">
                  <Label>Reajuste Padrão (%)</Label>
                  <Input type="number" defaultValue="12.5" step="0.1" />
                </div>
              </div>
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label className="text-base">Notificação por Email</Label>
                  <p className="text-sm text-muted-foreground">Enviar notificações automáticas por email</p>
                </div>
                <Switch defaultChecked />
              </div>
              <Button>Salvar Configurações</Button>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="relatorios" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Relatórios de Renovação</CardTitle>
              <CardDescription>Gere relatórios sobre o processo de renovações</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <Button variant="outline">Relatório de Vencimentos</Button>
                <Button variant="outline">Taxa de Renovação</Button>
                <Button variant="outline">Análise de Reajustes</Button>
                <Button variant="outline">Histórico de Renovações</Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
