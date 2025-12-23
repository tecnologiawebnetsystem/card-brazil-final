"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Badge } from "@/components/ui/badge"
import { Search, Plus, Edit, Trash2, Building2 } from "lucide-react"

interface AgenteCobrador {
  id: string
  banco: string
  agencia: string
  numeroAviso: string
  tipo: string
  agenteCobrador: string
  moeda: string
  contaCorrente: string
  dataLote: string
  dataSituacao: string
  situacao: string
  qtdeDocumentosAviso: number
  qtdeDocumentosBaixados: number
  qtdeDocumentosNaoBaixados: number
  valorMultaJuros: number
  iof: number
  desconto: number
  premioTotal: number
  iofRetido: number
  premioPago: number
  credito: number
  diferenca: number
  iofOriginal: number
}

export default function AgenteCobradorPage() {
  const [selectedAgente, setSelectedAgente] = useState<AgenteCobrador | null>(null)
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [searchTerm, setSearchTerm] = useState("")

  // Dados mockados para demonstração
  const agentesCobradores: AgenteCobrador[] = [
    {
      id: "001",
      banco: "Banco do Brasil",
      agencia: "1234-5",
      numeroAviso: "AV001",
      tipo: "Cobrança Registrada",
      agenteCobrador: "BB Cobrança",
      moeda: "Real",
      contaCorrente: "12345-6",
      dataLote: "2024-03-15",
      dataSituacao: "2024-03-15",
      situacao: "Ativo",
      qtdeDocumentosAviso: 150,
      qtdeDocumentosBaixados: 120,
      qtdeDocumentosNaoBaixados: 30,
      valorMultaJuros: 2500.0,
      iof: 450.0,
      desconto: 100.0,
      premioTotal: 45000.0,
      iofRetido: 350.0,
      premioPago: 42000.0,
      credito: 1500.0,
      diferenca: 500.0,
      iofOriginal: 450.0,
    },
    {
      id: "002",
      banco: "Itaú Unibanco",
      agencia: "5678-9",
      numeroAviso: "AV002",
      tipo: "Cobrança Simples",
      agenteCobrador: "Itaú Cobrança",
      moeda: "Real",
      contaCorrente: "67890-1",
      dataLote: "2024-03-14",
      dataSituacao: "2024-03-14",
      situacao: "Ativo",
      qtdeDocumentosAviso: 89,
      qtdeDocumentosBaixados: 75,
      qtdeDocumentosNaoBaixados: 14,
      valorMultaJuros: 1800.0,
      iof: 320.0,
      desconto: 50.0,
      premioTotal: 28500.0,
      iofRetido: 280.0,
      premioPago: 26000.0,
      credito: 900.0,
      diferenca: 320.0,
      iofOriginal: 320.0,
    },
    {
      id: "003",
      banco: "Bradesco",
      agencia: "9012-3",
      numeroAviso: "AV003",
      tipo: "Cobrança Registrada",
      agenteCobrador: "Bradesco Cobrança",
      moeda: "Real",
      contaCorrente: "34567-8",
      dataLote: "2024-03-13",
      dataSituacao: "2024-03-13",
      situacao: "Inativo",
      qtdeDocumentosAviso: 203,
      qtdeDocumentosBaixados: 180,
      qtdeDocumentosNaoBaixados: 23,
      valorMultaJuros: 3200.0,
      iof: 680.0,
      desconto: 150.0,
      premioTotal: 67800.0,
      iofRetido: 600.0,
      premioPago: 64000.0,
      credito: 2100.0,
      diferenca: 700.0,
      iofOriginal: 680.0,
    },
  ]

  const filteredAgentes = agentesCobradores.filter(
    (agente) =>
      agente.banco.toLowerCase().includes(searchTerm.toLowerCase()) ||
      agente.agenteCobrador.toLowerCase().includes(searchTerm.toLowerCase()) ||
      agente.numeroAviso.toLowerCase().includes(searchTerm.toLowerCase()),
  )

  const getSituacaoBadge = (situacao: string) => {
    return situacao === "Ativo" ? (
      <Badge className="bg-green-100 text-green-800">Ativo</Badge>
    ) : (
      <Badge variant="secondary">Inativo</Badge>
    )
  }

  const handleConsultar = () => {
    // Lógica de consulta
    console.log("Consultando agentes cobradores...")
  }

  const handleLimpar = () => {
    setSearchTerm("")
    setSelectedAgente(null)
  }

  const handleOcorrenciasLote = (agente: AgenteCobrador) => {
    console.log("Visualizando ocorrências do lote:", agente.id)
  }

  return (
    <div className="container mx-auto p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-emerald-800">Agente Cobrador</h1>
          <p className="text-muted-foreground">Gerencie agentes cobradores e dados de remessa bancária</p>
        </div>
        <Button className="bg-emerald-600 hover:bg-emerald-700">
          <Plus className="h-4 w-4 mr-2" />
          Novo Agente
        </Button>
      </div>

      {/* Dados Agente Cobrador */}
      <Card>
        <CardHeader className="bg-blue-600 text-white">
          <CardTitle className="flex items-center gap-2">
            <Building2 className="h-5 w-5" />
            Dados Agente Cobrador
          </CardTitle>
        </CardHeader>
        <CardContent className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
            <div className="space-y-2">
              <Label>Banco:</Label>
              <div className="flex gap-2">
                <Input placeholder="Selecione o banco" className="flex-1" />
                <Button size="sm" variant="outline">
                  ...
                </Button>
              </div>
            </div>
            <div className="space-y-2">
              <Label>Agência:</Label>
              <Input placeholder="Digite a agência" />
            </div>
            <div className="space-y-2">
              <Label>Conta Corrente:</Label>
              <Input placeholder="Digite a conta corrente" />
            </div>
            <div className="space-y-2">
              <Label>Número Aviso:</Label>
              <div className="flex gap-2">
                <Input placeholder="Digite o número do aviso" className="flex-1" />
                <Button size="sm" variant="outline">
                  ...
                </Button>
              </div>
            </div>
            <div className="space-y-2">
              <Label>Data do Lote:</Label>
              <Input type="date" />
            </div>
            <div className="space-y-2">
              <Label>Data Situação:</Label>
              <Input type="date" />
            </div>
            <div className="space-y-2">
              <Label>Tipo:</Label>
              <Input placeholder="Digite o tipo" />
            </div>
            <div className="space-y-2">
              <Label>Agente Cobrador:</Label>
              <Input placeholder="Digite o agente cobrador" />
            </div>
            <div className="space-y-2">
              <Label>Situação:</Label>
              <Input placeholder="Digite a situação" />
            </div>
            <div className="space-y-2">
              <Label>Moeda:</Label>
              <Input placeholder="Digite a moeda" />
            </div>
          </div>

          <div className="flex gap-4 justify-end">
            <Button onClick={handleConsultar} className="bg-blue-600 hover:bg-blue-700">
              Consultar
            </Button>
            <Button onClick={handleLimpar} variant="destructive">
              Limpar
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Dados do Lote */}
      <Card>
        <CardHeader className="bg-blue-100">
          <CardTitle className="text-foreground">Dados do Lote</CardTitle>
        </CardHeader>
        <CardContent className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="space-y-4">
              <div className="space-y-2">
                <Label className="text-right block">Qtde Doctos Aviso:</Label>
                <Input readOnly className="bg-gray-100" />
              </div>
              <div className="space-y-2">
                <Label className="text-right block">Valor Multa/Juros:</Label>
                <Input readOnly className="bg-gray-100" />
              </div>
              <div className="space-y-2">
                <Label className="text-right block">Prêmio Total:</Label>
                <Input readOnly className="bg-gray-100" />
              </div>
              <div className="space-y-2">
                <Label className="text-right block">Crédito:</Label>
                <Input readOnly className="bg-gray-100" />
              </div>
            </div>

            <div className="space-y-4">
              <div className="space-y-2">
                <Label className="text-right block">Qtde Doctos Baixados:</Label>
                <Input readOnly className="bg-gray-100" />
              </div>
              <div className="space-y-2">
                <Label className="text-right block">IOF:</Label>
                <Input readOnly className="bg-gray-100" />
              </div>
              <div className="space-y-2">
                <Label className="text-right block">IOF Retido:</Label>
                <Input readOnly className="bg-gray-100" />
              </div>
              <div className="space-y-2">
                <Label className="text-right block">Diferença:</Label>
                <Input readOnly className="bg-gray-100" />
              </div>
            </div>

            <div className="space-y-4">
              <div className="space-y-2">
                <Label className="text-right block">Qtde Doctos Não Baixados:</Label>
                <Input readOnly className="bg-gray-100" />
              </div>
              <div className="space-y-2">
                <Label className="text-right block">Desconto:</Label>
                <Input readOnly className="bg-gray-100" />
              </div>
              <div className="space-y-2">
                <Label className="text-right block">Prêmio Pago:</Label>
                <Input readOnly className="bg-gray-100" />
              </div>
              <div className="space-y-2">
                <Label className="text-right block">IOF Orig.:</Label>
                <Input readOnly className="bg-gray-100" />
              </div>
            </div>
          </div>

          <div className="flex justify-center mt-6">
            <Button className="bg-green-600 hover:bg-green-700">Ocorrências do Lote</Button>
          </div>
        </CardContent>
      </Card>

      {/* Lista de Agentes Cobradores */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="text-emerald-800">Agentes Cobradores Cadastrados</CardTitle>
            <div className="flex items-center gap-2">
              <Search className="h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Buscar por banco, agente ou número..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-64"
              />
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full border-collapse">
              <thead>
                <tr className="border-b border-emerald-200">
                  <th className="text-left p-3 font-semibold text-emerald-800">Banco</th>
                  <th className="text-left p-3 font-semibold text-emerald-800">Agência</th>
                  <th className="text-left p-3 font-semibold text-emerald-800">Agente Cobrador</th>
                  <th className="text-left p-3 font-semibold text-emerald-800">Número Aviso</th>
                  <th className="text-left p-3 font-semibold text-emerald-800">Tipo</th>
                  <th className="text-right p-3 font-semibold text-emerald-800">Prêmio Total</th>
                  <th className="text-center p-3 font-semibold text-emerald-800">Situação</th>
                  <th className="text-center p-3 font-semibold text-emerald-800">Ações</th>
                </tr>
              </thead>
              <tbody>
                {filteredAgentes.map((agente) => (
                  <tr key={agente.id} className="border-b border-gray-100 hover:bg-emerald-50">
                    <td className="p-3 font-medium">{agente.banco}</td>
                    <td className="p-3">{agente.agencia}</td>
                    <td className="p-3">{agente.agenteCobrador}</td>
                    <td className="p-3">{agente.numeroAviso}</td>
                    <td className="p-3">{agente.tipo}</td>
                    <td className="p-3 text-right font-medium">
                      R$ {agente.premioTotal.toLocaleString("pt-BR", { minimumFractionDigits: 2 })}
                    </td>
                    <td className="p-3 text-center">{getSituacaoBadge(agente.situacao)}</td>
                    <td className="p-3 text-center">
                      <div className="flex items-center justify-center gap-2">
                        <Dialog>
                          <DialogTrigger asChild>
                            <Button size="sm" variant="outline" onClick={() => setSelectedAgente(agente)}>
                              <Edit className="h-4 w-4" />
                            </Button>
                          </DialogTrigger>
                          <DialogContent className="max-w-4xl">
                            <DialogHeader>
                              <DialogTitle>Detalhes do Agente Cobrador - {agente.banco}</DialogTitle>
                            </DialogHeader>
                            {selectedAgente && (
                              <div className="grid grid-cols-2 gap-4 p-4">
                                <div className="space-y-2">
                                  <Label>Banco:</Label>
                                  <Input value={selectedAgente.banco} readOnly />
                                </div>
                                <div className="space-y-2">
                                  <Label>Agência:</Label>
                                  <Input value={selectedAgente.agencia} readOnly />
                                </div>
                                <div className="space-y-2">
                                  <Label>Conta Corrente:</Label>
                                  <Input value={selectedAgente.contaCorrente} readOnly />
                                </div>
                                <div className="space-y-2">
                                  <Label>Agente Cobrador:</Label>
                                  <Input value={selectedAgente.agenteCobrador} readOnly />
                                </div>
                                <div className="space-y-2">
                                  <Label>Qtde Documentos Aviso:</Label>
                                  <Input value={selectedAgente.qtdeDocumentosAviso} readOnly />
                                </div>
                                <div className="space-y-2">
                                  <Label>Qtde Documentos Baixados:</Label>
                                  <Input value={selectedAgente.qtdeDocumentosBaixados} readOnly />
                                </div>
                                <div className="space-y-2">
                                  <Label>Prêmio Total:</Label>
                                  <Input
                                    value={`R$ ${selectedAgente.premioTotal.toLocaleString("pt-BR", { minimumFractionDigits: 2 })}`}
                                    readOnly
                                  />
                                </div>
                                <div className="space-y-2">
                                  <Label>Situação:</Label>
                                  <Input value={selectedAgente.situacao} readOnly />
                                </div>
                              </div>
                            )}
                          </DialogContent>
                        </Dialog>
                        <Button
                          size="sm"
                          className="bg-green-600 hover:bg-green-700"
                          onClick={() => handleOcorrenciasLote(agente)}
                        >
                          Ocorrências
                        </Button>
                        <Button size="sm" variant="destructive">
                          <Trash2 className="h-4 w-4" />
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
