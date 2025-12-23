"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { MoreHorizontal, CheckCircle, X, Building, FileText, Printer, Mail } from "lucide-react"

// Mock data para demonstração
const mockAvisoCredito = {
  banco: "001 - Banco do Brasil",
  agencia: "1234-5",
  tipo: "Cobrança Registrada",
  contaCorrente: "12345-6",
  agenteCobrador: "Banco do Brasil S.A.",
  qtdParcelas: {
    aviso: 150,
    naoConciliado: 25,
    conciliado: 125,
  },
  premioTotal: {
    aviso: 125000.0,
    naoConciliado: 15000.0,
    conciliado: 110000.0,
  },
  premioPago: {
    aviso: 120000.0,
    naoConciliado: 12000.0,
    conciliado: 108000.0,
  },
  comissao: {
    aviso: 8750.0,
    naoConciliado: 1050.0,
    conciliado: 7700.0,
  },
  diferencaPremio: {
    aviso: 5000.0,
    naoConciliado: 3000.0,
    conciliado: 2000.0,
  },
  iofEmissao: {
    aviso: 3125.0,
    naoConciliado: 375.0,
    conciliado: 2750.0,
  },
  iofRetido: {
    aviso: 2500.0,
    naoConciliado: 300.0,
    conciliado: 2200.0,
  },
  iofCalc: {
    aviso: 3000.0,
    naoConciliado: 360.0,
    conciliado: 2640.0,
  },
  iofReter: {
    aviso: 2800.0,
    naoConciliado: 336.0,
    conciliado: 2464.0,
  },
  valorJuros: {
    aviso: 1250.0,
    naoConciliado: 0,
    conciliado: 0,
  },
  creditosDescontos: {
    aviso: 2500.0,
    naoConciliado: 500.0,
    conciliado: 2000.0,
  },
}

export default function AvisoCreditoPage() {
  const [searchData, setSearchData] = useState({
    banco: "",
    agencia: "",
    tipo: "",
    contaCorrente: "",
    agenteCobrador: "",
  })

  const [showResults, setShowResults] = useState(false)
  const [selectedAction, setSelectedAction] = useState("")

  const handleSearch = () => {
    setShowResults(true)
  }

  const handleClear = () => {
    setSearchData({
      banco: "",
      agencia: "",
      tipo: "",
      contaCorrente: "",
      agenteCobrador: "",
    })
    setShowResults(false)
  }

  const handleAction = (action: string) => {
    setSelectedAction(action)
    console.log(`Executando ação: ${action}`)
  }

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat("pt-BR", {
      style: "currency",
      currency: "BRL",
    }).format(value)
  }

  const handleImprimir = () => {
    alert("Imprimindo aviso de crédito...")
  }

  const handleEncaminharEmail = () => {
    alert("Encaminhando por e-mail...")
  }

  const handleEncaminharWhatsApp = () => {
    alert("Encaminhando por WhatsApp...")
  }

  return (
    <div className="space-y-6 p-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Aviso de Crédito</h1>
          <p className="text-muted-foreground">Gerencie avisos de crédito e conciliações bancárias</p>
        </div>
      </div>

      {/* Dados Agente Cobrador */}
      <Card className="border-emerald-200">
        <CardHeader className="border-b border-emerald-200">
          <div className="flex items-center justify-between">
            <CardTitle className="text-lg font-semibold flex items-center gap-2 text-foreground">
              <Building className="h-5 w-5" />
              Dados Agente Cobrador
            </CardTitle>
            <div className="flex gap-2">
              <Button variant="outline" size="sm" className="border-emerald-300 hover:bg-emerald-50 bg-transparent">
                Novo
              </Button>
              <Button size="sm" className="bg-emerald-600 hover:bg-emerald-700 text-white">
                Salvar
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="banco" className="text-sm font-medium text-foreground">
                Banco:
              </Label>
              <div className="flex gap-2">
                <Input
                  id="banco"
                  value={searchData.banco}
                  onChange={(e) => setSearchData((prev) => ({ ...prev, banco: e.target.value }))}
                  placeholder="Digite o código ou nome do banco"
                />
                <Dialog>
                  <DialogTrigger asChild>
                    <Button
                      variant="outline"
                      size="icon"
                      className="border-emerald-300 hover:bg-emerald-50 bg-transparent"
                    >
                      <MoreHorizontal className="h-4 w-4" />
                    </Button>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>Selecionar Banco</DialogTitle>
                    </DialogHeader>
                    <div className="space-y-4">
                      <div className="space-y-2">
                        <Label>Bancos Disponíveis:</Label>
                        <Select onValueChange={(value) => setSearchData((prev) => ({ ...prev, banco: value }))}>
                          <SelectTrigger>
                            <SelectValue placeholder="Selecione um banco" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="001 - Banco do Brasil">001 - Banco do Brasil</SelectItem>
                            <SelectItem value="104 - Caixa Econômica Federal">104 - Caixa Econômica Federal</SelectItem>
                            <SelectItem value="341 - Itaú Unibanco">341 - Itaú Unibanco</SelectItem>
                            <SelectItem value="033 - Santander">033 - Santander</SelectItem>
                            <SelectItem value="237 - Bradesco">237 - Bradesco</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                  </DialogContent>
                </Dialog>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="contaCorrente" className="text-sm font-medium text-foreground">
                Conta Corrente:
              </Label>
              <Input
                id="contaCorrente"
                value={searchData.contaCorrente}
                onChange={(e) => setSearchData((prev) => ({ ...prev, contaCorrente: e.target.value }))}
                placeholder="Digite a conta corrente"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="agencia" className="text-sm font-medium text-foreground">
                Agência:
              </Label>
              <Input
                id="agencia"
                value={searchData.agencia}
                onChange={(e) => setSearchData((prev) => ({ ...prev, agencia: e.target.value }))}
                placeholder="Digite a agência"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="agenteCobrador" className="text-sm font-medium text-foreground">
                Agente Cobrador:
              </Label>
              <Input
                id="agenteCobrador"
                value={searchData.agenteCobrador}
                onChange={(e) => setSearchData((prev) => ({ ...prev, agenteCobrador: e.target.value }))}
                placeholder="Digite o agente cobrador"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="tipo" className="text-sm font-medium text-foreground">
                Tipo:
              </Label>
              <Select onValueChange={(value) => setSearchData((prev) => ({ ...prev, tipo: value }))}>
                <SelectTrigger>
                  <SelectValue placeholder="Selecione o tipo" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="cobranca-registrada">Cobrança Registrada</SelectItem>
                  <SelectItem value="cobranca-simples">Cobrança Simples</SelectItem>
                  <SelectItem value="desconto-duplicata">Desconto de Duplicata</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Dados Aviso Crédito */}
      <Card className="border-emerald-200">
        <CardHeader className="bg-emerald-50 border-b border-emerald-200">
          <CardTitle className="text-emerald-800 flex items-center gap-2">
            <FileText className="h-5 w-5" />
            Dados Aviso Crédito
          </CardTitle>
        </CardHeader>
        <CardContent className="p-6">
          <div className="overflow-x-auto">
            <table className="w-full border-collapse">
              <thead>
                <tr className="border-b">
                  <th className="text-left p-3 font-medium text-gray-700"></th>
                  <th className="text-center p-3 font-medium text-blue-700 bg-blue-50 rounded">Aviso</th>
                  <th className="text-center p-3 font-medium text-yellow-700 bg-yellow-50 rounded">Não Conciliado</th>
                  <th className="text-center p-3 font-medium text-green-700 bg-green-50 rounded">Conciliado</th>
                </tr>
              </thead>
              <tbody>
                <tr className="border-b hover:bg-gray-50">
                  <td className="p-3 font-medium text-right text-gray-700">Qtd. Parcelas:</td>
                  <td className="p-3 text-center">
                    <Input
                      value={mockAvisoCredito.qtdParcelas.aviso}
                      readOnly
                      className="text-center bg-blue-50 border-blue-200"
                    />
                  </td>
                  <td className="p-3 text-center">
                    <Input
                      value={mockAvisoCredito.qtdParcelas.naoConciliado}
                      readOnly
                      className="text-center bg-yellow-50 border-yellow-200"
                    />
                  </td>
                  <td className="p-3 text-center">
                    <Input
                      value={mockAvisoCredito.qtdParcelas.conciliado}
                      readOnly
                      className="text-center bg-green-50 border-green-200"
                    />
                  </td>
                </tr>

                <tr className="border-b hover:bg-gray-50">
                  <td className="p-3 font-medium text-right text-gray-700">Prêmio Total:</td>
                  <td className="p-3 text-center">
                    <Input
                      value={formatCurrency(mockAvisoCredito.premioTotal.aviso)}
                      readOnly
                      className="text-center bg-blue-50 border-blue-200"
                    />
                  </td>
                  <td className="p-3 text-center">
                    <Input
                      value={formatCurrency(mockAvisoCredito.premioTotal.naoConciliado)}
                      readOnly
                      className="text-center bg-yellow-50 border-yellow-200"
                    />
                  </td>
                  <td className="p-3 text-center">
                    <Input
                      value={formatCurrency(mockAvisoCredito.premioTotal.conciliado)}
                      readOnly
                      className="text-center bg-green-50 border-green-200"
                    />
                  </td>
                </tr>

                <tr className="border-b hover:bg-gray-50">
                  <td className="p-3 font-medium text-right text-gray-700">Prêmio Pago:</td>
                  <td className="p-3 text-center">
                    <Input
                      value={formatCurrency(mockAvisoCredito.premioPago.aviso)}
                      readOnly
                      className="text-center bg-blue-50 border-blue-200"
                    />
                  </td>
                  <td className="p-3 text-center">
                    <Input
                      value={formatCurrency(mockAvisoCredito.premioPago.naoConciliado)}
                      readOnly
                      className="text-center bg-yellow-50 border-yellow-200"
                    />
                  </td>
                  <td className="p-3 text-center">
                    <Input
                      value={formatCurrency(mockAvisoCredito.premioPago.conciliado)}
                      readOnly
                      className="text-center bg-green-50 border-green-200"
                    />
                  </td>
                </tr>

                <tr className="border-b hover:bg-gray-50">
                  <td className="p-3 font-medium text-right text-gray-700">Comissão:</td>
                  <td className="p-3 text-center">
                    <Input
                      value={formatCurrency(mockAvisoCredito.comissao.aviso)}
                      readOnly
                      className="text-center bg-blue-50 border-blue-200"
                    />
                  </td>
                  <td className="p-3 text-center">
                    <Input
                      value={formatCurrency(mockAvisoCredito.comissao.naoConciliado)}
                      readOnly
                      className="text-center bg-yellow-50 border-yellow-200"
                    />
                  </td>
                  <td className="p-3 text-center">
                    <Input
                      value={formatCurrency(mockAvisoCredito.comissao.conciliado)}
                      readOnly
                      className="text-center bg-green-50 border-green-200"
                    />
                  </td>
                </tr>

                <tr className="border-b hover:bg-gray-50">
                  <td className="p-3 font-medium text-right text-gray-700">Diferença Prêmio:</td>
                  <td className="p-3 text-center">
                    <Input
                      value={formatCurrency(mockAvisoCredito.diferencaPremio.aviso)}
                      readOnly
                      className="text-center bg-blue-50 border-blue-200"
                    />
                  </td>
                  <td className="p-3 text-center">
                    <Input
                      value={formatCurrency(mockAvisoCredito.diferencaPremio.naoConciliado)}
                      readOnly
                      className="text-center bg-yellow-50 border-yellow-200"
                    />
                  </td>
                  <td className="p-3 text-center">
                    <Input
                      value={formatCurrency(mockAvisoCredito.diferencaPremio.conciliado)}
                      readOnly
                      className="text-center bg-green-50 border-green-200"
                    />
                  </td>
                </tr>

                <tr className="border-b hover:bg-gray-50">
                  <td className="p-3 font-medium text-right text-gray-700">IOF Emissão:</td>
                  <td className="p-3 text-center">
                    <Input
                      value={formatCurrency(mockAvisoCredito.iofEmissao.aviso)}
                      readOnly
                      className="text-center bg-blue-50 border-blue-200"
                    />
                  </td>
                  <td className="p-3 text-center">
                    <Input
                      value={formatCurrency(mockAvisoCredito.iofEmissao.naoConciliado)}
                      readOnly
                      className="text-center bg-yellow-50 border-yellow-200"
                    />
                  </td>
                  <td className="p-3 text-center">
                    <Input
                      value={formatCurrency(mockAvisoCredito.iofEmissao.conciliado)}
                      readOnly
                      className="text-center bg-green-50 border-green-200"
                    />
                  </td>
                </tr>

                <tr className="border-b hover:bg-gray-50">
                  <td className="p-3 font-medium text-right text-gray-700">IOF Retido:</td>
                  <td className="p-3 text-center">
                    <Input
                      value={formatCurrency(mockAvisoCredito.iofRetido.aviso)}
                      readOnly
                      className="text-center bg-blue-50 border-blue-200"
                    />
                  </td>
                  <td className="p-3 text-center">
                    <Input
                      value={formatCurrency(mockAvisoCredito.iofRetido.naoConciliado)}
                      readOnly
                      className="text-center bg-yellow-50 border-yellow-200"
                    />
                  </td>
                  <td className="p-3 text-center">
                    <Input
                      value={formatCurrency(mockAvisoCredito.iofRetido.conciliado)}
                      readOnly
                      className="text-center bg-green-50 border-green-200"
                    />
                  </td>
                </tr>

                <tr className="border-b hover:bg-gray-50">
                  <td className="p-3 font-medium text-right text-gray-700">IOF Calc.:</td>
                  <td className="p-3 text-center">
                    <Input
                      value={formatCurrency(mockAvisoCredito.iofCalc.aviso)}
                      readOnly
                      className="text-center bg-blue-50 border-blue-200"
                    />
                  </td>
                  <td className="p-3 text-center">
                    <Input
                      value={formatCurrency(mockAvisoCredito.iofCalc.naoConciliado)}
                      readOnly
                      className="text-center bg-yellow-50 border-yellow-200"
                    />
                  </td>
                  <td className="p-3 text-center">
                    <Input
                      value={formatCurrency(mockAvisoCredito.iofCalc.conciliado)}
                      readOnly
                      className="text-center bg-green-50 border-green-200"
                    />
                  </td>
                </tr>

                <tr className="border-b hover:bg-gray-50">
                  <td className="p-3 font-medium text-right text-gray-700">IOF Reter:</td>
                  <td className="p-3 text-center">
                    <Input
                      value={formatCurrency(mockAvisoCredito.iofReter.aviso)}
                      readOnly
                      className="text-center bg-blue-50 border-blue-200"
                    />
                  </td>
                  <td className="p-3 text-center">
                    <Input
                      value={formatCurrency(mockAvisoCredito.iofReter.naoConciliado)}
                      readOnly
                      className="text-center bg-yellow-50 border-yellow-200"
                    />
                  </td>
                  <td className="p-3 text-center">
                    <Input
                      value={formatCurrency(mockAvisoCredito.iofReter.conciliado)}
                      readOnly
                      className="text-center bg-green-50 border-green-200"
                    />
                  </td>
                </tr>

                <tr className="border-b hover:bg-gray-50">
                  <td className="p-3 font-medium text-right text-gray-700">Valor Juros:</td>
                  <td className="p-3 text-center">
                    <Input
                      value={formatCurrency(mockAvisoCredito.valorJuros.aviso)}
                      readOnly
                      className="text-center bg-blue-50 border-blue-200"
                    />
                  </td>
                  <td className="p-3 text-center">
                    <Input
                      value={formatCurrency(mockAvisoCredito.valorJuros.naoConciliado)}
                      readOnly
                      className="text-center bg-yellow-50 border-yellow-200"
                    />
                  </td>
                  <td className="p-3 text-center">
                    <Input
                      value={formatCurrency(mockAvisoCredito.valorJuros.conciliado)}
                      readOnly
                      className="text-center bg-green-50 border-green-200"
                    />
                  </td>
                </tr>

                <tr className="border-b hover:bg-gray-50">
                  <td className="p-3 font-medium text-right text-gray-700">Créditos / Descontos:</td>
                  <td className="p-3 text-center">
                    <Input
                      value={formatCurrency(mockAvisoCredito.creditosDescontos.aviso)}
                      readOnly
                      className="text-center bg-blue-50 border-blue-200"
                    />
                  </td>
                  <td className="p-3 text-center">
                    <Input
                      value={formatCurrency(mockAvisoCredito.creditosDescontos.naoConciliado)}
                      readOnly
                      className="text-center bg-yellow-50 border-yellow-200"
                    />
                  </td>
                  <td className="p-3 text-center">
                    <Input
                      value={formatCurrency(mockAvisoCredito.creditosDescontos.conciliado)}
                      readOnly
                      className="text-center bg-green-50 border-green-200"
                    />
                  </td>
                </tr>
              </tbody>
            </table>
          </div>

          {/* Botões de Ação */}
          <div className="flex justify-center gap-4 mt-6">
            <Button onClick={() => handleAction("efetivar")} className="bg-blue-600 hover:bg-blue-700 text-white px-6">
              <CheckCircle className="h-4 w-4 mr-2" />
              Efetivar
            </Button>
            <Button
              onClick={() => handleAction("incluir-parcelas")}
              className="bg-emerald-600 hover:bg-emerald-700 text-white px-6"
            >
              <FileText className="h-4 w-4 mr-2" />
              Incluir Parcelas
            </Button>
            <Button onClick={handleImprimir} className="bg-blue-600 hover:bg-blue-700 text-white px-6">
              <Printer className="h-4 w-4 mr-2" />
              Imprimir
            </Button>
            <Button onClick={handleEncaminharEmail} className="bg-blue-600 hover:bg-blue-700 text-white px-6">
              <Mail className="h-4 w-4 mr-2" />
              Encaminhar por e-mail
            </Button>
            <Button onClick={handleEncaminharWhatsApp} className="bg-green-600 hover:bg-green-700 text-white px-6">
              <svg className="h-4 w-4 mr-2" fill="currentColor" viewBox="0 0 24 24">
                <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.173-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.890-5.335 11.893-11.893A11.821 11.821 0 0020.885 3.787" />
              </svg>
              Encaminhar WhatsApp
            </Button>
            <Button
              onClick={() => handleAction("cancelar")}
              variant="outline"
              className="border-red-300 text-red-600 hover:bg-red-50 px-6"
            >
              <X className="h-4 w-4 mr-2" />
              Cancelar
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Status Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="border-blue-200">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Total de Avisos</p>
                <p className="text-2xl font-bold text-blue-600">{mockAvisoCredito.qtdParcelas.aviso}</p>
              </div>
              <Badge variant="secondary" className="bg-blue-100 text-blue-800">
                Processados
              </Badge>
            </div>
          </CardContent>
        </Card>

        <Card className="border-yellow-200">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Não Conciliados</p>
                <p className="text-2xl font-bold text-yellow-600">{mockAvisoCredito.qtdParcelas.naoConciliado}</p>
              </div>
              <Badge variant="secondary" className="bg-yellow-100 text-yellow-800">
                Pendente
              </Badge>
            </div>
          </CardContent>
        </Card>

        <Card className="border-green-200">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Conciliados</p>
                <p className="text-2xl font-bold text-green-600">{mockAvisoCredito.qtdParcelas.conciliado}</p>
              </div>
              <Badge variant="secondary" className="bg-green-100 text-green-800">
                Concluído
              </Badge>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
