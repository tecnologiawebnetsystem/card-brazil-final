"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { AlertTriangle, CheckCircle, Download, RefreshCw } from "lucide-react"

export default function ComparacaoRazaoPage() {
  const [selectedPeriod, setSelectedPeriod] = useState("")
  const [selectedAccount, setSelectedAccount] = useState("")
  const [isComparing, setIsComparing] = useState(false)

  const mockComparisons = [
    {
      conta: "1.1.1.01.001",
      descricao: "Caixa Geral",
      saldoContabil: 125000.0,
      saldoERP: 124850.0,
      diferenca: 150.0,
      status: "divergente",
      ramo: "Ambulatorial",
    },
    {
      conta: "1.1.2.01.001",
      descricao: "Banco Bradesco",
      saldoContabil: 2500000.0,
      saldoERP: 2500000.0,
      diferenca: 0.0,
      status: "ok",
      ramo: "Hospitalar",
    },
    {
      conta: "2.1.1.01.001",
      descricao: "Provisão PEONA",
      saldoContabil: 850000.0,
      saldoERP: 845000.0,
      diferenca: 5000.0,
      status: "divergente",
      ramo: "Ambulatorial",
    },
  ]

  const handleCompare = () => {
    setIsComparing(true)
    setTimeout(() => setIsComparing(false), 2000)
  }

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold tracking-tight bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
          Comparação Razão/Balancete
        </h1>
        <p className="text-muted-foreground">Compare saldos entre contábil e ERP para identificar divergências</p>
      </div>

      <Card className="border-0 shadow-lg bg-gradient-to-br from-blue-50/50 to-purple-50/50">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <RefreshCw className="h-5 w-5 text-blue-600" />
            Parâmetros de Comparação
          </CardTitle>
          <CardDescription>Configure os filtros para comparação entre sistemas</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="space-y-2">
              <Label htmlFor="period">Período</Label>
              <Select value={selectedPeriod} onValueChange={setSelectedPeriod}>
                <SelectTrigger>
                  <SelectValue placeholder="Selecione o período" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="202412">Dezembro/2024</SelectItem>
                  <SelectItem value="202411">Novembro/2024</SelectItem>
                  <SelectItem value="202410">Outubro/2024</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="account">Conta Específica (Opcional)</Label>
              <Input
                id="account"
                placeholder="Ex: 1.1.1.01.001"
                value={selectedAccount}
                onChange={(e) => setSelectedAccount(e.target.value)}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="ramo">Ramo</Label>
              <Select>
                <SelectTrigger>
                  <SelectValue placeholder="Todos os ramos" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="ambulatorial">Ambulatorial</SelectItem>
                  <SelectItem value="hospitalar">Hospitalar</SelectItem>
                  <SelectItem value="odontologico">Odontológico</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <Button onClick={handleCompare} disabled={isComparing} className="w-full">
            {isComparing ? (
              <>
                <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
                Comparando...
              </>
            ) : (
              "Executar Comparação"
            )}
          </Button>
        </CardContent>
      </Card>

      <Tabs defaultValue="divergencias" className="space-y-6">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="divergencias">Divergências</TabsTrigger>
          <TabsTrigger value="conferidos">Conferidos</TabsTrigger>
          <TabsTrigger value="resumo">Resumo</TabsTrigger>
        </TabsList>

        <TabsContent value="divergencias" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <span className="flex items-center gap-2">
                  <AlertTriangle className="h-5 w-5 text-amber-600" />
                  Contas com Divergências
                </span>
                <Button variant="outline" size="sm">
                  <Download className="mr-2 h-4 w-4" />
                  Exportar
                </Button>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {mockComparisons
                  .filter((item) => item.status === "divergente")
                  .map((item, index) => (
                    <div key={index} className="flex items-center justify-between p-4 border rounded-lg bg-amber-50/50">
                      <div className="space-y-1">
                        <div className="flex items-center gap-2">
                          <span className="font-mono text-sm font-medium">{item.conta}</span>
                          <Badge variant="outline">{item.ramo}</Badge>
                        </div>
                        <p className="text-sm text-muted-foreground">{item.descricao}</p>
                      </div>
                      <div className="text-right space-y-1">
                        <div className="text-sm">
                          <span className="text-muted-foreground">Contábil: </span>
                          <span className="font-medium">
                            R$ {item.saldoContabil.toLocaleString("pt-BR", { minimumFractionDigits: 2 })}
                          </span>
                        </div>
                        <div className="text-sm">
                          <span className="text-muted-foreground">ERP: </span>
                          <span className="font-medium">
                            R$ {item.saldoERP.toLocaleString("pt-BR", { minimumFractionDigits: 2 })}
                          </span>
                        </div>
                        <div className="text-sm font-medium text-red-600">
                          Diferença: R$ {item.diferenca.toLocaleString("pt-BR", { minimumFractionDigits: 2 })}
                        </div>
                      </div>
                    </div>
                  ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="conferidos" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <CheckCircle className="h-5 w-5 text-green-600" />
                Contas Conferidas
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {mockComparisons
                  .filter((item) => item.status === "ok")
                  .map((item, index) => (
                    <div key={index} className="flex items-center justify-between p-4 border rounded-lg bg-green-50/50">
                      <div className="space-y-1">
                        <div className="flex items-center gap-2">
                          <span className="font-mono text-sm font-medium">{item.conta}</span>
                          <Badge variant="outline">{item.ramo}</Badge>
                          <CheckCircle className="h-4 w-4 text-green-600" />
                        </div>
                        <p className="text-sm text-muted-foreground">{item.descricao}</p>
                      </div>
                      <div className="text-right">
                        <div className="text-sm font-medium text-green-600">
                          R$ {item.saldoContabil.toLocaleString("pt-BR", { minimumFractionDigits: 2 })}
                        </div>
                        <div className="text-xs text-muted-foreground">Valores conferem</div>
                      </div>
                    </div>
                  ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="resumo" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card className="border-green-200 bg-green-50/50">
              <CardHeader className="pb-3">
                <CardTitle className="text-sm font-medium text-green-700">Contas Conferidas</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-green-600">1</div>
                <p className="text-xs text-green-600">100% de precisão</p>
              </CardContent>
            </Card>

            <Card className="border-amber-200 bg-amber-50/50">
              <CardHeader className="pb-3">
                <CardTitle className="text-sm font-medium text-amber-700">Com Divergências</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-amber-600">2</div>
                <p className="text-xs text-amber-600">Requer atenção</p>
              </CardContent>
            </Card>

            <Card className="border-blue-200 bg-blue-50/50">
              <CardHeader className="pb-3">
                <CardTitle className="text-sm font-medium text-blue-700">Total Analisado</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-blue-600">R$ 3,47M</div>
                <p className="text-xs text-blue-600">Valor total comparado</p>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}
