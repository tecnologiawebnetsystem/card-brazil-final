"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Smartphone, Plus, Search, FileText, CheckCircle, Clock, QrCode, DollarSign } from "lucide-react"

export default function PixPage() {
  const [searchTerm, setSearchTerm] = useState("")

  const transacoesPix = [
    {
      id: "PIX001",
      beneficiario: "Lucas Ferreira Santos",
      cpf: "123.456.789-00",
      chavePix: "lucas@email.com",
      tipoChave: "E-mail",
      status: "Pago",
      dataTransacao: "15/01/2024 14:30",
      valor: "R$ 450,00",
    },
    {
      id: "PIX002",
      beneficiario: "Mariana Costa Silva",
      cpf: "987.654.321-00",
      chavePix: "(11) 99999-9999",
      tipoChave: "Telefone",
      status: "Pendente",
      dataTransacao: "15/01/2024 16:45",
      valor: "R$ 320,00",
    },
    {
      id: "PIX003",
      beneficiario: "Pedro Henrique Lima",
      cpf: "456.789.123-00",
      chavePix: "123.456.789-00",
      tipoChave: "CPF",
      status: "Expirado",
      dataTransacao: "14/01/2024 10:15",
      valor: "R$ 280,00",
    },
  ]

  const filteredTransacoes = transacoesPix.filter(
    (transacao) =>
      transacao.beneficiario.toLowerCase().includes(searchTerm.toLowerCase()) ||
      transacao.cpf.includes(searchTerm) ||
      transacao.chavePix.includes(searchTerm),
  )

  return (
    <div className="flex-1 space-y-6 p-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">PIX</h1>
          <p className="text-muted-foreground">Gerencie pagamentos via PIX</p>
        </div>
        <Button className="gap-2">
          <Plus className="h-4 w-4" />
          Gerar PIX
        </Button>
      </div>

      <Tabs defaultValue="transacoes" className="space-y-6">
        <TabsList>
          <TabsTrigger value="transacoes">Transações</TabsTrigger>
          <TabsTrigger value="chaves">Chaves PIX</TabsTrigger>
          <TabsTrigger value="qrcode">QR Code</TabsTrigger>
          <TabsTrigger value="configuracoes">Configurações</TabsTrigger>
        </TabsList>

        <TabsContent value="transacoes" className="space-y-6">
          <div className="grid gap-6 md:grid-cols-4">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total PIX</CardTitle>
                <Smartphone className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">2,456</div>
                <p className="text-xs text-muted-foreground">+25% em relação ao mês anterior</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">PIX Pagos</CardTitle>
                <CheckCircle className="h-4 w-4 text-green-600" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">2,234</div>
                <p className="text-xs text-muted-foreground">91% do total</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Pendentes</CardTitle>
                <Clock className="h-4 w-4 text-yellow-600" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">156</div>
                <p className="text-xs text-muted-foreground">Aguardando pagamento</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Valor Total</CardTitle>
                <DollarSign className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">R$ 892.3K</div>
                <p className="text-xs text-muted-foreground">Recebido via PIX</p>
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Transações PIX</CardTitle>
              <CardDescription>Lista de todas as transações PIX realizadas</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex items-center space-x-2 mb-4">
                <div className="relative flex-1">
                  <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Buscar por beneficiário, CPF ou chave PIX..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-8"
                  />
                </div>
                <Select>
                  <SelectTrigger className="w-[180px]">
                    <SelectValue placeholder="Status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="todos">Todos</SelectItem>
                    <SelectItem value="pago">Pago</SelectItem>
                    <SelectItem value="pendente">Pendente</SelectItem>
                    <SelectItem value="expirado">Expirado</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>ID</TableHead>
                    <TableHead>Beneficiário</TableHead>
                    <TableHead>CPF</TableHead>
                    <TableHead>Chave PIX</TableHead>
                    <TableHead>Tipo</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Data/Hora</TableHead>
                    <TableHead>Valor</TableHead>
                    <TableHead>Ações</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredTransacoes.map((transacao) => (
                    <TableRow key={transacao.id}>
                      <TableCell className="font-medium">{transacao.id}</TableCell>
                      <TableCell>{transacao.beneficiario}</TableCell>
                      <TableCell>{transacao.cpf}</TableCell>
                      <TableCell className="font-mono">{transacao.chavePix}</TableCell>
                      <TableCell>{transacao.tipoChave}</TableCell>
                      <TableCell>
                        <Badge
                          variant={
                            transacao.status === "Pago"
                              ? "default"
                              : transacao.status === "Pendente"
                                ? "secondary"
                                : "destructive"
                          }
                        >
                          {transacao.status}
                        </Badge>
                      </TableCell>
                      <TableCell>{transacao.dataTransacao}</TableCell>
                      <TableCell>{transacao.valor}</TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <Button variant="ghost" size="sm">
                            <QrCode className="h-4 w-4" />
                          </Button>
                          <Button variant="ghost" size="sm">
                            <FileText className="h-4 w-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="chaves" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Chaves PIX Cadastradas</CardTitle>
              <CardDescription>Gerencie as chaves PIX para recebimento</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-center py-8 text-muted-foreground">Nenhuma chave PIX cadastrada</div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="qrcode" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Gerador de QR Code PIX</CardTitle>
              <CardDescription>Gere QR Codes para pagamentos via PIX</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="valorPix">Valor (R$)</Label>
                  <Input id="valorPix" placeholder="0,00" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="descricaoPix">Descrição</Label>
                  <Input id="descricaoPix" placeholder="Mensalidade plano de saúde" />
                </div>
              </div>
              <Button>Gerar QR Code</Button>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="configuracoes" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Configurações PIX</CardTitle>
              <CardDescription>Configure parâmetros para pagamentos PIX</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="tempoExpiracao">Tempo de Expiração (min)</Label>
                  <Input id="tempoExpiracao" placeholder="30" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="valorMinimoPix">Valor Mínimo</Label>
                  <Input id="valorMinimoPix" placeholder="R$ 1,00" />
                </div>
              </div>
              <Button>Salvar Configurações</Button>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
