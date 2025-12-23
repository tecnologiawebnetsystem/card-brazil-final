"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Checkbox } from "@/components/ui/checkbox"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { BreadcrumbNav } from "@/components/dashboard/breadcrumb-nav"
import { Separator } from "@/components/ui/separator"

const SearchIcon = () => (
  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="m21 21-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
  </svg>
)

const FilterIcon = () => (
  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.414A1 1 0 013 6.707V4z"
    />
  </svg>
)

const MailIcon = () => (
  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
    />
  </svg>
)

const PhoneIcon = () => (
  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"
    />
  </svg>
)

const WhatsAppIcon = () => (
  <svg className="mr-2 h-4 w-4" fill="currentColor" viewBox="0 0 24 24">
    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.890-5.335 11.893-11.893A11.821 11.821 0 0020.885 3.787" />
  </svg>
)

export default function ParcelasPendentesPage() {
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedParcela, setSelectedParcela] = useState<any>(null)
  const [isContactModalOpen, setIsContactModalOpen] = useState(false)
  const [contactType, setContactType] = useState("")
  const [contactMessage, setContactMessage] = useState("")
  const [selectedParcelas, setSelectedParcelas] = useState<string[]>([])
  const [isLoteModalOpen, setIsLoteModalOpen] = useState(false)
  const [isEditLoteModalOpen, setIsEditLoteModalOpen] = useState(false)
  const [loteAction, setLoteAction] = useState("")
  const [loteMessage, setLoteMessage] = useState("")
  const [editingParcela, setEditingParcela] = useState<any>(null)

  const parcelasPendentes = [
    {
      id: "001",
      segurado: "João Silva Santos",
      contrato: "CTR-2024-001",
      parcela: "3/12",
      valor: 450.0,
      vencimento: "2024-01-15",
      diasAtraso: 45,
      telefone: "(11) 99999-1234",
      email: "joao.silva@email.com",
      status: "Vencida",
    },
    {
      id: "002",
      segurado: "Maria Oliveira Costa",
      contrato: "CTR-2024-002",
      parcela: "2/12",
      valor: 680.0,
      vencimento: "2024-01-20",
      diasAtraso: 40,
      telefone: "(11) 98888-5678",
      email: "maria.costa@email.com",
      status: "Vencida",
    },
    {
      id: "003",
      segurado: "Carlos Eduardo Lima",
      contrato: "CTR-2024-003",
      parcela: "1/12",
      valor: 320.0,
      vencimento: "2024-02-01",
      diasAtraso: 28,
      telefone: "(11) 97777-9012",
      email: "carlos.lima@email.com",
      status: "Vencida",
    },
    {
      id: "004",
      segurado: "Ana Paula Ferreira",
      contrato: "CTR-2024-004",
      parcela: "4/12",
      valor: 520.0,
      vencimento: "2024-02-10",
      diasAtraso: 19,
      telefone: "(11) 96666-3456",
      email: "ana.ferreira@email.com",
      status: "Vencida",
    },
  ]

  const filteredParcelas = parcelasPendentes.filter(
    (parcela) =>
      parcela.segurado.toLowerCase().includes(searchTerm.toLowerCase()) ||
      parcela.contrato.toLowerCase().includes(searchTerm.toLowerCase()),
  )

  const handleContact = () => {
    console.log(`Enviando ${contactType} para ${selectedParcela?.segurado}:`, contactMessage)
    setIsContactModalOpen(false)
    setContactMessage("")
    setContactType("")
  }

  const handleSelectParcela = (parcelaId: string, checked: boolean) => {
    if (checked) {
      setSelectedParcelas([...selectedParcelas, parcelaId])
    } else {
      setSelectedParcelas(selectedParcelas.filter((id) => id !== parcelaId))
    }
  }

  const handleSelectAll = (checked: boolean) => {
    if (checked) {
      setSelectedParcelas(filteredParcelas.map((p) => p.id))
    } else {
      setSelectedParcelas([])
    }
  }

  const handleRemoveFromLote = (parcelaId: string) => {
    setSelectedParcelas(selectedParcelas.filter((id) => id !== parcelaId))
  }

  const handleEditParcelaInLote = (parcela: any) => {
    setEditingParcela({
      ...parcela,
      novoVencimento: parcela.vencimento,
      juros: "2.5",
      multa: "10.0",
      desconto: "0.0",
    })
    setIsEditLoteModalOpen(true)
  }

  const handleSaveParcelaEdit = () => {
    console.log("Salvando alterações da parcela:", editingParcela)
    setIsEditLoteModalOpen(false)
    setEditingParcela(null)
  }

  const handleSendLote = () => {
    console.log(`Enviando ${loteAction} em lote para ${selectedParcelas.length} parcelas`)
    setIsLoteModalOpen(false)
    setSelectedParcelas([])
    setLoteAction("")
    setLoteMessage("")
  }

  return (
    <div className="flex-1 space-y-4 p-4 md:p-8 pt-6">
      <BreadcrumbNav
        items={[
          { label: "Dashboard", href: "/dashboard" },
          { label: "Cobrança", href: "/dashboard/cobranca" },
          { label: "Parcelas Pendentes", href: "/dashboard/cobranca/parcelas-pendentes" },
        ]}
      />

      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Parcelas Pendentes</h2>
          <p className="text-muted-foreground">Gerencie parcelas em atraso e realize ações de cobrança</p>
        </div>
        {selectedParcelas.length > 0 && (
          <div className="flex gap-2">
            <Badge variant="secondary" className="px-3 py-1">
              {selectedParcelas.length} selecionada(s)
            </Badge>
            <Dialog open={isLoteModalOpen} onOpenChange={setIsLoteModalOpen}>
              <DialogTrigger asChild>
                <Button className="bg-emerald-600 hover:bg-emerald-700">Ações em Lote</Button>
              </DialogTrigger>
              <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
                <DialogHeader>
                  <DialogTitle>Gerenciar Lote de Cobrança</DialogTitle>
                  <DialogDescription>
                    {selectedParcelas.length} parcelas selecionadas para ação em lote
                  </DialogDescription>
                </DialogHeader>

                <div className="space-y-6">
                  <div>
                    <h4 className="font-semibold mb-3">Parcelas no Lote:</h4>
                    <div className="max-h-60 overflow-y-auto space-y-2 border rounded-lg p-3">
                      {filteredParcelas
                        .filter((p) => selectedParcelas.includes(p.id))
                        .map((parcela) => (
                          <div key={parcela.id} className="flex items-center justify-between p-3 bg-muted rounded-lg">
                            <div className="flex-1">
                              <div className="font-medium">{parcela.segurado}</div>
                              <div className="text-sm text-muted-foreground">
                                {parcela.contrato} - R$ {parcela.valor.toFixed(2)} - {parcela.diasAtraso} dias
                              </div>
                            </div>
                            <div className="flex gap-2">
                              <Button variant="outline" size="sm" onClick={() => handleEditParcelaInLote(parcela)}>
                                Editar
                              </Button>
                              <Button variant="destructive" size="sm" onClick={() => handleRemoveFromLote(parcela.id)}>
                                Remover
                              </Button>
                            </div>
                          </div>
                        ))}
                    </div>
                  </div>

                  <Separator />

                  <div>
                    <Label htmlFor="lote-action">Tipo de Ação</Label>
                    <Select onValueChange={setLoteAction}>
                      <SelectTrigger>
                        <SelectValue placeholder="Selecione a ação para o lote" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="email">Enviar E-mail em Lote</SelectItem>
                        <SelectItem value="whatsapp">Enviar WhatsApp em Lote</SelectItem>
                        <SelectItem value="sms">Enviar SMS em Lote</SelectItem>
                        <SelectItem value="boleto">Gerar Boletos em Lote</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  {loteAction && (
                    <div>
                      <Label htmlFor="lote-template">Template de Mensagem</Label>
                      <Select>
                        <SelectTrigger>
                          <SelectValue placeholder="Selecione um template" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="lembrete">Lembrete Amigável</SelectItem>
                          <SelectItem value="cobranca">Cobrança Formal</SelectItem>
                          <SelectItem value="urgente">Cobrança Urgente</SelectItem>
                          <SelectItem value="acordo">Proposta de Acordo</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  )}

                  {loteAction && (
                    <div>
                      <Label htmlFor="lote-message">Mensagem Personalizada</Label>
                      <Textarea
                        id="lote-message"
                        placeholder="Digite uma mensagem personalizada (será aplicada a todas as parcelas do lote)"
                        value={loteMessage}
                        onChange={(e) => setLoteMessage(e.target.value)}
                        rows={4}
                      />
                    </div>
                  )}
                </div>

                <DialogFooter>
                  <Button variant="outline" onClick={() => setIsLoteModalOpen(false)}>
                    Cancelar
                  </Button>
                  <Button
                    onClick={handleSendLote}
                    disabled={!loteAction}
                    className="bg-emerald-600 hover:bg-emerald-700"
                  >
                    Executar Ação em Lote
                  </Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </div>
        )}
      </div>

      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Pendente</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">R$ 1.970,00</div>
            <p className="text-xs text-muted-foreground">4 parcelas em atraso</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Média de Atraso</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">33 dias</div>
            <p className="text-xs text-muted-foreground">Tempo médio de atraso</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Maior Atraso</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">45 dias</div>
            <p className="text-xs text-muted-foreground">João Silva Santos</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Ações Hoje</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">12</div>
            <p className="text-xs text-muted-foreground">Contatos realizados</p>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Filtros de Busca</CardTitle>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="flex gap-4">
            <div className="flex-1">
              <div className="relative">
                <SearchIcon className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Buscar por segurado ou contrato..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-8"
                />
              </div>
            </div>
            <Button variant="outline">
              <FilterIcon className="mr-2 h-4 w-4" />
              Filtros Avançados
            </Button>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Parcelas em Atraso</CardTitle>
              <CardDescription>Lista de parcelas vencidas que necessitam ação de cobrança</CardDescription>
            </div>
            <div className="flex items-center space-x-2">
              <Checkbox
                id="select-all"
                checked={selectedParcelas.length === filteredParcelas.length && filteredParcelas.length > 0}
                onCheckedChange={handleSelectAll}
              />
              <Label htmlFor="select-all" className="text-sm font-medium">
                Selecionar Todas
              </Label>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {filteredParcelas.map((parcela) => (
              <div key={parcela.id} className="flex items-center justify-between p-4 border rounded-lg">
                <div className="flex items-center gap-4">
                  <Checkbox
                    checked={selectedParcelas.includes(parcela.id)}
                    onCheckedChange={(checked) => handleSelectParcela(parcela.id, checked as boolean)}
                  />
                  <div className="flex-1">
                    <div className="flex items-center gap-4">
                      <div>
                        <h4 className="font-semibold">{parcela.segurado}</h4>
                        <p className="text-sm text-muted-foreground">
                          {parcela.contrato} - Parcela {parcela.parcela}
                        </p>
                      </div>
                      <Badge variant={parcela.diasAtraso > 30 ? "destructive" : "secondary"}>
                        {parcela.diasAtraso} dias de atraso
                      </Badge>
                    </div>
                    <div className="mt-2 flex items-center gap-4 text-sm text-muted-foreground">
                      <span>Valor: R$ {parcela.valor.toFixed(2)}</span>
                      <span>Vencimento: {parcela.vencimento}</span>
                      <span>{parcela.telefone}</span>
                      <span>{parcela.email}</span>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <Dialog>
                      <DialogTrigger asChild>
                        <Button variant="outline" size="sm" onClick={() => setSelectedParcela(parcela)}>
                          <MailIcon className="mr-2 h-4 w-4" />
                          E-mail
                        </Button>
                      </DialogTrigger>
                      <DialogContent>
                        <DialogHeader>
                          <DialogTitle>Enviar E-mail de Cobrança</DialogTitle>
                          <DialogDescription>Enviar notificação de cobrança para {parcela.segurado}</DialogDescription>
                        </DialogHeader>
                        <div className="space-y-4">
                          <div>
                            <Label htmlFor="template">Template</Label>
                            <Select onValueChange={setContactType}>
                              <SelectTrigger>
                                <SelectValue placeholder="Selecione um template" />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="lembrete">Lembrete Amigável</SelectItem>
                                <SelectItem value="cobranca">Cobrança Formal</SelectItem>
                                <SelectItem value="urgente">Cobrança Urgente</SelectItem>
                              </SelectContent>
                            </Select>
                          </div>
                          <div>
                            <Label htmlFor="message">Mensagem Personalizada</Label>
                            <Textarea
                              id="message"
                              placeholder="Digite uma mensagem personalizada (opcional)"
                              value={contactMessage}
                              onChange={(e) => setContactMessage(e.target.value)}
                            />
                          </div>
                        </div>
                        <DialogFooter>
                          <Button onClick={handleContact}>Enviar E-mail</Button>
                        </DialogFooter>
                      </DialogContent>
                    </Dialog>

                    <Dialog>
                      <DialogTrigger asChild>
                        <Button variant="outline" size="sm" onClick={() => setSelectedParcela(parcela)}>
                          <WhatsAppIcon />
                          WhatsApp
                        </Button>
                      </DialogTrigger>
                      <DialogContent>
                        <DialogHeader>
                          <DialogTitle>Enviar WhatsApp</DialogTitle>
                          <DialogDescription>Enviar mensagem via WhatsApp para {parcela.segurado}</DialogDescription>
                        </DialogHeader>
                        <div className="space-y-4">
                          <div>
                            <Label htmlFor="whatsapp-template">Template WhatsApp</Label>
                            <Select onValueChange={setContactType}>
                              <SelectTrigger>
                                <SelectValue placeholder="Selecione um template" />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="lembrete-whats">Lembrete Amigável WhatsApp</SelectItem>
                                <SelectItem value="cobranca-whats">Cobrança Formal WhatsApp</SelectItem>
                                <SelectItem value="urgente-whats">Cobrança Urgente WhatsApp</SelectItem>
                              </SelectContent>
                            </Select>
                          </div>
                          <div>
                            <Label htmlFor="whatsapp-message">Mensagem Personalizada</Label>
                            <Textarea
                              id="whatsapp-message"
                              placeholder="Digite uma mensagem personalizada para WhatsApp"
                              value={contactMessage}
                              onChange={(e) => setContactMessage(e.target.value)}
                            />
                          </div>
                        </div>
                        <DialogFooter>
                          <Button onClick={handleContact} className="bg-green-600 hover:bg-green-700">
                            Enviar WhatsApp
                          </Button>
                        </DialogFooter>
                      </DialogContent>
                    </Dialog>

                    <Dialog>
                      <DialogTrigger asChild>
                        <Button variant="outline" size="sm" onClick={() => setSelectedParcela(parcela)}>
                          <PhoneIcon className="mr-2 h-4 w-4" />
                          Ligar
                        </Button>
                      </DialogTrigger>
                      <DialogContent>
                        <DialogHeader>
                          <DialogTitle>Registrar Ligação</DialogTitle>
                          <DialogDescription>Registrar contato telefônico com {parcela.segurado}</DialogDescription>
                        </DialogHeader>
                        <div className="space-y-4">
                          <div>
                            <Label htmlFor="call-result">Resultado da Ligação</Label>
                            <Select onValueChange={setContactType}>
                              <SelectTrigger>
                                <SelectValue placeholder="Selecione o resultado" />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="atendeu">Atendeu - Compromisso de Pagamento</SelectItem>
                                <SelectItem value="nao-atendeu">Não Atendeu</SelectItem>
                                <SelectItem value="ocupado">Ocupado</SelectItem>
                                <SelectItem value="recusou">Recusou Pagamento</SelectItem>
                              </SelectContent>
                            </Select>
                          </div>
                          <div>
                            <Label htmlFor="call-notes">Observações</Label>
                            <Textarea
                              id="call-notes"
                              placeholder="Digite as observações da ligação"
                              value={contactMessage}
                              onChange={(e) => setContactMessage(e.target.value)}
                            />
                          </div>
                        </div>
                        <DialogFooter>
                          <Button onClick={handleContact}>Registrar Contato</Button>
                        </DialogFooter>
                      </DialogContent>
                    </Dialog>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      <Dialog open={isEditLoteModalOpen} onOpenChange={setIsEditLoteModalOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Editar Dados da Parcela</DialogTitle>
            <DialogDescription>Altere os dados antes de incluir na ação em lote</DialogDescription>
          </DialogHeader>

          {editingParcela && (
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="novo-vencimento">Novo Vencimento</Label>
                <Input
                  id="novo-vencimento"
                  type="date"
                  value={editingParcela.novoVencimento}
                  onChange={(e) => setEditingParcela({ ...editingParcela, novoVencimento: e.target.value })}
                />
              </div>
              <div>
                <Label htmlFor="valor-original">Valor Original</Label>
                <Input id="valor-original" value={`R$ ${editingParcela.valor.toFixed(2)}`} disabled />
              </div>
              <div>
                <Label htmlFor="juros">Juros (%)</Label>
                <Input
                  id="juros"
                  value={editingParcela.juros}
                  onChange={(e) => setEditingParcela({ ...editingParcela, juros: e.target.value })}
                />
              </div>
              <div>
                <Label htmlFor="multa">Multa (%)</Label>
                <Input
                  id="multa"
                  value={editingParcela.multa}
                  onChange={(e) => setEditingParcela({ ...editingParcela, multa: e.target.value })}
                />
              </div>
              <div>
                <Label htmlFor="desconto">Desconto (%)</Label>
                <Input
                  id="desconto"
                  value={editingParcela.desconto}
                  onChange={(e) => setEditingParcela({ ...editingParcela, desconto: e.target.value })}
                />
              </div>
              <div>
                <Label htmlFor="valor-final">Valor Final</Label>
                <Input
                  id="valor-final"
                  value={`R$ ${(editingParcela.valor * (1 + Number.parseFloat(editingParcela.juros || 0) / 100 + Number.parseFloat(editingParcela.multa || 0) / 100 - Number.parseFloat(editingParcela.desconto || 0) / 100)).toFixed(2)}`}
                  disabled
                />
              </div>
            </div>
          )}

          <DialogFooter>
            <Button variant="outline" onClick={() => setIsEditLoteModalOpen(false)}>
              Cancelar
            </Button>
            <Button onClick={handleSaveParcelaEdit} className="bg-emerald-600 hover:bg-emerald-700">
              Salvar Alterações
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
