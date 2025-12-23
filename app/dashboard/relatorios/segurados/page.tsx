"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"

export default function RelatorioSeguradosPage() {
  const [periodo, setPeriodo] = useState("mes")
  const [isGenerating, setIsGenerating] = useState(false)

  const handleGenerateReport = () => {
    setIsGenerating(true)
    setTimeout(() => {
      setIsGenerating(false)
    }, 2000)
  }

  const mockDados = [
    { operadora: "Unimed SP", ativos: 1250, inativos: 45, novos: 32, cancelados: 8 },
    { operadora: "Bradesco Saúde", ativos: 890, inativos: 23, novos: 18, cancelados: 5 },
    { operadora: "SulAmérica", ativos: 650, inativos: 15, novos: 12, cancelados: 3 },
  ]

  const totais = mockDados.reduce(
    (acc, curr) => ({
      ativos: acc.ativos + curr.ativos,
      inativos: acc.inativos + curr.inativos,
      novos: acc.novos + curr.novos,
      cancelados: acc.cancelados + curr.cancelados,
    }),
    { ativos: 0, inativos: 0, novos: 0, cancelados: 0 },
  )

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-6 py-6">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-2xl font-bold text-foreground">Relatório de Segurados</h1>
            <p className="text-muted-foreground">Estatísticas e análises dos segurados por operadora</p>
          </div>
          <div className="flex gap-2">
            <Select value={periodo} onValueChange={setPeriodo}>
              <SelectTrigger className="w-40">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="mes">Este Mês</SelectItem>
                <SelectItem value="trimestre">Trimestre</SelectItem>
                <SelectItem value="ano">Este Ano</SelectItem>
              </SelectContent>
            </Select>
            <Button onClick={handleGenerateReport} disabled={isGenerating}>
              {isGenerating ? "Gerando..." : "Gerar Relatório"}
            </Button>
          </div>
        </div>

        {/* Resumo Geral */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 bg-emerald-700 text-white rounded-lg flex items-center justify-center">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                    />
                  </svg>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Segurados Ativos</p>
                  <p className="text-xl font-bold text-emerald-700">{totais.ativos.toLocaleString("pt-BR")}</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 bg-blue-600 text-white rounded-lg flex items-center justify-center">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z"
                    />
                  </svg>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Novos Segurados</p>
                  <p className="text-xl font-bold text-blue-600">{totais.novos}</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 bg-red-600 text-white rounded-lg flex items-center justify-center">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M13 7a4 4 0 11-8 0 4 4 0 018 0zM9 14a6 6 0 00-6 6v1h12v-1a6 6 0 00-6-6zM21 12h-6"
                    />
                  </svg>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Cancelamentos</p>
                  <p className="text-xl font-bold text-red-600">{totais.cancelados}</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 bg-yellow-600 text-white rounded-lg flex items-center justify-center">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
                    />
                  </svg>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Inativos</p>
                  <p className="text-xl font-bold text-yellow-600">{totais.inativos}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Tabela por Operadora */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle>Distribuição por Operadora</CardTitle>
            <CardDescription>Estatísticas detalhadas de segurados por operadora</CardDescription>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Operadora</TableHead>
                  <TableHead>Segurados Ativos</TableHead>
                  <TableHead>Inativos</TableHead>
                  <TableHead>Novos (Mês)</TableHead>
                  <TableHead>Cancelados (Mês)</TableHead>
                  <TableHead>Taxa de Crescimento</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {mockDados.map((item, index) => {
                  const crescimento = (((item.novos - item.cancelados) / item.ativos) * 100).toFixed(1)
                  return (
                    <TableRow key={index}>
                      <TableCell className="font-medium">{item.operadora}</TableCell>
                      <TableCell>{item.ativos.toLocaleString("pt-BR")}</TableCell>
                      <TableCell>{item.inativos}</TableCell>
                      <TableCell className="text-blue-600">+{item.novos}</TableCell>
                      <TableCell className="text-red-600">-{item.cancelados}</TableCell>
                      <TableCell>
                        <Badge variant={Number.parseFloat(crescimento) > 0 ? "default" : "destructive"}>
                          {crescimento}%
                        </Badge>
                      </TableCell>
                    </TableRow>
                  )
                })}
              </TableBody>
            </Table>
          </CardContent>
        </Card>

        {/* Análises e Insights */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle>Análise de Faixa Etária</CardTitle>
              <CardDescription>Distribuição dos segurados por idade</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <span>0-18 anos</span>
                  <div className="flex items-center gap-2">
                    <div className="w-20 h-2 bg-gray-200 rounded">
                      <div className="w-3/5 h-2 bg-blue-600 rounded"></div>
                    </div>
                    <span className="text-sm">15%</span>
                  </div>
                </div>
                <div className="flex justify-between items-center">
                  <span>19-35 anos</span>
                  <div className="flex items-center gap-2">
                    <div className="w-20 h-2 bg-gray-200 rounded">
                      <div className="w-4/5 h-2 bg-green-600 rounded"></div>
                    </div>
                    <span className="text-sm">32%</span>
                  </div>
                </div>
                <div className="flex justify-between items-center">
                  <span>36-50 anos</span>
                  <div className="flex items-center gap-2">
                    <div className="w-20 h-2 bg-gray-200 rounded">
                      <div className="w-full h-2 bg-purple-600 rounded"></div>
                    </div>
                    <span className="text-sm">28%</span>
                  </div>
                </div>
                <div className="flex justify-between items-center">
                  <span>51-65 anos</span>
                  <div className="flex items-center gap-2">
                    <div className="w-20 h-2 bg-gray-200 rounded">
                      <div className="w-3/5 h-2 bg-orange-600 rounded"></div>
                    </div>
                    <span className="text-sm">18%</span>
                  </div>
                </div>
                <div className="flex justify-between items-center">
                  <span>65+ anos</span>
                  <div className="flex items-center gap-2">
                    <div className="w-20 h-2 bg-gray-200 rounded">
                      <div className="w-1/5 h-2 bg-red-600 rounded"></div>
                    </div>
                    <span className="text-sm">7%</span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Tendências Mensais</CardTitle>
              <CardDescription>Evolução dos segurados nos últimos meses</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <span>Janeiro 2024</span>
                  <Badge variant="default">+24 segurados</Badge>
                </div>
                <div className="flex justify-between items-center">
                  <span>Dezembro 2023</span>
                  <Badge variant="default">+18 segurados</Badge>
                </div>
                <div className="flex justify-between items-center">
                  <span>Novembro 2023</span>
                  <Badge variant="default">+31 segurados</Badge>
                </div>
                <div className="flex justify-between items-center">
                  <span>Outubro 2023</span>
                  <Badge variant="secondary">+12 segurados</Badge>
                </div>
                <div className="flex justify-between items-center">
                  <span>Setembro 2023</span>
                  <Badge variant="destructive">-5 segurados</Badge>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Ações do Relatório */}
        <Card className="mt-6">
          <CardHeader>
            <CardTitle>Exportar Relatório</CardTitle>
            <CardDescription>Baixe o relatório em diferentes formatos</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex gap-4">
              <Button variant="outline">
                <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                  />
                </svg>
                Exportar PDF
              </Button>
              <Button variant="outline">
                <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                  />
                </svg>
                Exportar Excel
              </Button>
              <Button variant="outline">
                <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
                  />
                </svg>
                Enviar por Email
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
