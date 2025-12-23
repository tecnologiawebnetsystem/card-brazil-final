"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Checkbox } from "@/components/ui/checkbox"
import { Calendar } from "@/components/ui/calendar"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { CalendarIcon, FileText, Download, Settings, Mail, MessageSquare, Smartphone, QrCode } from "lucide-react"
import { format } from "date-fns"
import { ptBR } from "date-fns/locale"
import { AlteracaoVencimentoIcon } from "@/components/ui/icons"

export default function GerarBoletosPage() {
  const [dataVencimento, setDataVencimento] = useState<Date>()
  const [selectedClientes, setSelectedClientes] = useState<string[]>([])

  const clientes = [
    {
      id: "1",
      nome: "Maria Santos",
      cpf: "123.456.789-00",
      valor: 450.0,
      email: "maria@email.com",
      whatsapp: "(11) 99999-1111",
    },
    {
      id: "2",
      nome: "Pedro Oliveira",
      cpf: "987.654.321-00",
      valor: 280.0,
      email: "pedro@email.com",
      whatsapp: "(11) 99999-2222",
    },
    {
      id: "3",
      nome: "Lucia Ferreira",
      cpf: "456.789.123-00",
      valor: 680.0,
      email: "lucia@email.com",
      whatsapp: "(11) 99999-3333",
    },
  ]

  const handleClienteSelect = (clienteId: string, checked: boolean) => {
    if (checked) {
      setSelectedClientes([...selectedClientes, clienteId])
    } else {
      setSelectedClientes(selectedClientes.filter((id) => id !== clienteId))
    }
  }

  const handleDownloadBoleto = () => {
    console.log("[v0] Downloading boletos for clients:", selectedClientes)
    // Simular download
    alert("Boletos baixados com sucesso!")
  }

  const handleEnviarEmail = () => {
    console.log("[v0] Sending boletos via email for clients:", selectedClientes)
    alert("Boletos enviados por email com sucesso!")
  }

  const handleEnviarWhatsApp = () => {
    console.log("[v0] Sending boletos via WhatsApp for clients:", selectedClientes)
    alert("Boletos enviados por WhatsApp com sucesso!")
  }

  const handleEnviarCodigoBarrasSMS = () => {
    console.log("[v0] Sending barcode via SMS for clients:", selectedClientes)
    alert("Código de barras enviado por SMS com sucesso!")
  }

  const handleEnviarQRCode = () => {
    console.log("[v0] Sending QR code for clients:", selectedClientes)
    alert("QR Code de pagamento enviado com sucesso!")
  }

  return (
    <div className="container mx-auto p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-emerald-800">Gerar Boletos</h1>
          <p className="text-muted-foreground">Gere boletos para cobrança de mensalidades</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Configurações */}
        <div className="lg:col-span-1">
          <Card>
            <CardHeader>
              <CardTitle className="text-emerald-800 flex items-center gap-2">
                <Settings className="h-5 w-5" />
                Configurações
              </CardTitle>
              <CardDescription>Configure os parâmetros para geração dos boletos</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label>Data de Vencimento</Label>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button variant="outline" className="w-full justify-start text-left font-normal bg-transparent">
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {dataVencimento ? format(dataVencimento, "dd/MM/yyyy", { locale: ptBR }) : "Selecionar data"}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0">
                    <Calendar mode="single" selected={dataVencimento} onSelect={setDataVencimento} initialFocus />
                  </PopoverContent>
                </Popover>
              </div>

              <div className="space-y-2">
                <Label>Banco</Label>
                <Select>
                  <SelectTrigger>
                    <SelectValue placeholder="Selecionar banco" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="bb">Banco do Brasil</SelectItem>
                    <SelectItem value="itau">Itaú</SelectItem>
                    <SelectItem value="bradesco">Bradesco</SelectItem>
                    <SelectItem value="santander">Santander</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label>Juros (%)</Label>
                <Input type="number" placeholder="2.0" step="0.1" />
              </div>

              <div className="space-y-2">
                <Label>Multa (%)</Label>
                <Input type="number" placeholder="10.0" step="0.1" />
              </div>

              <div className="space-y-2">
                <Label>Desconto (%)</Label>
                <Input type="number" placeholder="0.0" step="0.1" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Lista de Clientes */}
        <div className="lg:col-span-2">
          <Card>
            <CardHeader>
              <CardTitle className="text-emerald-800 flex items-center gap-2">
                <FileText className="h-5 w-5" />
                Selecionar Clientes
              </CardTitle>
              <CardDescription>Escolha os clientes para gerar os boletos</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <Button variant="outline" onClick={() => setSelectedClientes(clientes.map((c) => c.id))}>
                    Selecionar Todos
                  </Button>
                  <Button variant="outline" onClick={() => setSelectedClientes([])}>
                    Limpar Seleção
                  </Button>
                </div>

                <div className="border rounded-lg">
                  <div className="grid grid-cols-5 gap-4 p-3 bg-emerald-50 font-semibold text-emerald-800 border-b">
                    <div>Selecionar</div>
                    <div>Cliente</div>
                    <div>CPF</div>
                    <div>Contato</div>
                    <div className="text-right">Valor</div>
                  </div>

                  {clientes.map((cliente) => (
                    <div
                      key={cliente.id}
                      className="grid grid-cols-5 gap-4 p-3 border-b last:border-b-0 hover:bg-gray-50"
                    >
                      <div className="flex items-center">
                        <Checkbox
                          checked={selectedClientes.includes(cliente.id)}
                          onCheckedChange={(checked) => handleClienteSelect(cliente.id, checked as boolean)}
                        />
                      </div>
                      <div className="font-medium">{cliente.nome}</div>
                      <div className="text-muted-foreground">{cliente.cpf}</div>
                      <div className="text-sm">
                        <div>{cliente.email}</div>
                        <div className="text-muted-foreground">{cliente.whatsapp}</div>
                      </div>
                      <div className="text-right font-medium">
                        R$ {cliente.valor.toLocaleString("pt-BR", { minimumFractionDigits: 2 })}
                      </div>
                    </div>
                  ))}
                </div>

                <div className="flex items-center justify-between pt-4 border-t">
                  <div className="text-sm text-muted-foreground">
                    {selectedClientes.length} cliente(s) selecionado(s)
                  </div>
                  <div className="flex flex-wrap gap-2">
                    <Button variant="outline" onClick={handleDownloadBoleto} disabled={selectedClientes.length === 0}>
                      <Download className="h-4 w-4 mr-2" />
                      Download
                    </Button>
                    <Button variant="outline" onClick={handleEnviarEmail} disabled={selectedClientes.length === 0}>
                      <Mail className="h-4 w-4 mr-2" />
                      Email
                    </Button>
                    <Button variant="outline" onClick={handleEnviarWhatsApp} disabled={selectedClientes.length === 0}>
                      <MessageSquare className="h-4 w-4 mr-2" />
                      WhatsApp
                    </Button>
                    <Button
                      variant="outline"
                      onClick={handleEnviarCodigoBarrasSMS}
                      disabled={selectedClientes.length === 0}
                    >
                      <Smartphone className="h-4 w-4 mr-2" />
                      SMS Código
                    </Button>
                    <Button variant="outline" onClick={handleEnviarQRCode} disabled={selectedClientes.length === 0}>
                      <QrCode className="h-4 w-4 mr-2" />
                      QR Code
                    </Button>
                    <Button variant="outline" asChild>
                      <a href="/dashboard/cobranca/alteracao-vencimento">
                        <AlteracaoVencimentoIcon className="h-4 w-4 mr-2" />
                        Alterar Vencimento
                      </a>
                    </Button>
                    <Button className="bg-emerald-600 hover:bg-emerald-700">
                      <FileText className="h-4 w-4 mr-2" />
                      Gerar Boletos
                    </Button>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
