"use client"
import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

interface Endereco {
  id: number
  tipo: "residencial" | "comercial" | "cobranca"
  cep: string
  logradouro: string
  numero: string
  complemento?: string
  bairro: string
  cidade: string
  estado: string
  email?: string
}

interface DadoBancario {
  id: number
  banco: string
  agencia: string
  tipoConta: "corrente" | "poupanca"
  conta: string
  digitoConta: string
}

interface PersonModalProps {
  isOpen: boolean
  onClose: () => void
  onSave: (personData: any) => void
  title?: string
  description?: string
  allowedTypes?: ("fisica" | "juridica")[]
  showAddressTabs?: boolean
  showBankTabs?: boolean
  className?: string
}

export function PersonModal({
  isOpen,
  onClose,
  onSave,
  title = "Cadastrar Nova Pessoa",
  description = "Preencha os dados completos da nova pessoa",
  allowedTypes = ["fisica", "juridica"],
  showAddressTabs = false,
  showBankTabs = false,
  className = "max-w-7xl", // Aumentando de max-w-6xl para max-w-7xl
}: PersonModalProps) {
  const [personType, setPersonType] = useState(allowedTypes[0])
  const [formData, setFormData] = useState<any>({})
  const [enderecos, setEnderecos] = useState<Endereco[]>([])
  const [dadosBancarios, setDadosBancarios] = useState<DadoBancario[]>([])

  // Estados para formulários de endereço
  const [showEnderecoForm, setShowEnderecoForm] = useState(false)
  const [enderecoForm, setEnderecoForm] = useState({
    tipo: "residencial" as "residencial" | "comercial" | "cobranca",
    cep: "",
    logradouro: "",
    numero: "",
    complemento: "",
    bairro: "",
    cidade: "",
    estado: "",
    email: "",
  })

  // Estados para formulários de dados bancários
  const [showBancoForm, setShowBancoForm] = useState(false)
  const [bancoForm, setBancoForm] = useState({
    banco: "",
    agencia: "",
    tipoConta: "corrente" as "corrente" | "poupanca",
    conta: "",
    digitoConta: "",
  })

  const bancos = [
    "Banco do Brasil",
    "Itaú",
    "Bradesco",
    "Santander",
    "Caixa Econômica Federal",
    "Banco Inter",
    "Nubank",
    "C6 Bank",
    "Banco Original",
    "Banco Safra",
  ]

  const buscarCEP = async (cep: string) => {
    if (cep.length === 8) {
      try {
        const response = await fetch(`https://viacep.com.br/ws/${cep}/json/`)
        const data = await response.json()
        if (!data.erro) {
          setEnderecoForm((prev) => ({
            ...prev,
            logradouro: data.logradouro || "",
            bairro: data.bairro || "",
            cidade: data.localidade || "",
            estado: data.uf || "",
          }))
        }
      } catch (error) {
        console.log("Erro ao buscar CEP:", error)
      }
    }
  }

  const handleAddEndereco = () => {
    if (!enderecoForm.cep || !enderecoForm.logradouro || !enderecoForm.numero) {
      return
    }

    const novoEndereco: Endereco = {
      id: Date.now(),
      ...enderecoForm,
    }

    setEnderecos((prev) => [...prev, novoEndereco])
    setEnderecoForm({
      tipo: "residencial",
      cep: "",
      logradouro: "",
      numero: "",
      complemento: "",
      bairro: "",
      cidade: "",
      estado: "",
      email: "",
    })
    setShowEnderecoForm(false)
  }

  const handleAddBanco = () => {
    if (!bancoForm.banco || !bancoForm.agencia || !bancoForm.conta) {
      return
    }

    const novoBanco: DadoBancario = {
      id: Date.now(),
      ...bancoForm,
    }

    setDadosBancarios((prev) => [...prev, novoBanco])
    setBancoForm({
      banco: "",
      agencia: "",
      tipoConta: "corrente",
      conta: "",
      digitoConta: "",
    })
    setShowBancoForm(false)
  }

  const handleRemoveEndereco = (id: number) => {
    setEnderecos((prev) => prev.filter((e) => e.id !== id))
  }

  const handleRemoveBanco = (id: number) => {
    setDadosBancarios((prev) => prev.filter((b) => b.id !== id))
  }

  const handleSave = () => {
    const newPerson = {
      id: Date.now(),
      tipo: personType,
      nome: personType === "fisica" ? formData.nome : formData.razaoSocial,
      razaoSocial: formData.razaoSocial,
      razaoAbreviada: formData.razaoAbreviada,
      cnpj: formData.cnpj,
      dataAbertura: formData.dataAbertura,
      inscricaoEstadual: formData.inscricaoEstadual,
      inscricaoMunicipal: formData.inscricaoMunicipal,
      codigoAtividade: formData.codigoAtividade,
      rg: formData.rg,
      cpf: formData.cpf,
      dataNascimento: formData.dataNascimento,
      status: "Ativo",
      enderecos: enderecos,
      dadosBancarios: dadosBancarios,
    }
    onSave(newPerson)
    onClose()
    setFormData({})
    setEnderecos([])
    setDadosBancarios([])
  }

  const tabsConfig = []
  tabsConfig.push("dados")
  if (showAddressTabs) tabsConfig.push("enderecos")
  if (showBankTabs) tabsConfig.push("bancarios")

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className={`${className} max-h-[95vh] overflow-y-auto p-8`}>
        {" "}
        {/* Aumentando altura para 95vh e padding para p-8 */}
        <DialogHeader className="pb-4">
          {" "}
          {/* Adicionando padding bottom no header */}
          <DialogTitle className="text-xl">{title}</DialogTitle> {/* Aumentando tamanho do título */}
          <DialogDescription className="text-base">{description}</DialogDescription>{" "}
          {/* Aumentando tamanho da descrição */}
        </DialogHeader>
        <Tabs defaultValue="dados" className="w-full">
          <TabsList className={`grid w-full grid-cols-${tabsConfig.length} mb-6`}>
            {" "}
            {/* Adicionando margin bottom nas tabs */}
            <TabsTrigger value="dados">Dados Pessoais</TabsTrigger>
            {showAddressTabs && <TabsTrigger value="enderecos">Endereços ({enderecos.length})</TabsTrigger>}
            {showBankTabs && <TabsTrigger value="bancarios">Dados Bancários ({dadosBancarios.length})</TabsTrigger>}
          </TabsList>

          <TabsContent value="dados" className="space-y-4">
            {allowedTypes.length > 1 && (
              <div>
                <Label htmlFor="tipoPessoa">Tipo de Pessoa *</Label>
                <Select value={personType} onValueChange={setPersonType}>
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione o tipo" />
                  </SelectTrigger>
                  <SelectContent>
                    {allowedTypes.includes("fisica") && <SelectItem value="fisica">Física</SelectItem>}
                    {allowedTypes.includes("juridica") && <SelectItem value="juridica">Jurídica</SelectItem>}
                  </SelectContent>
                </Select>
              </div>
            )}

            {personType === "fisica" ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="nome">Nome *</Label>
                  <Input
                    id="nome"
                    placeholder="Nome completo"
                    value={formData.nome || ""}
                    onChange={(e) => setFormData({ ...formData, nome: e.target.value })}
                  />
                </div>
                <div>
                  <Label htmlFor="rg">RG *</Label>
                  <Input
                    id="rg"
                    placeholder="00.000.000-0"
                    value={formData.rg || ""}
                    onChange={(e) => setFormData({ ...formData, rg: e.target.value })}
                  />
                </div>
                <div>
                  <Label htmlFor="cpf">CPF *</Label>
                  <Input
                    id="cpf"
                    placeholder="000.000.000-00"
                    value={formData.cpf || ""}
                    onChange={(e) => setFormData({ ...formData, cpf: e.target.value })}
                  />
                </div>
                <div>
                  <Label htmlFor="dataNascimento">Data de Nascimento *</Label>
                  <Input
                    id="dataNascimento"
                    type="date"
                    value={formData.dataNascimento || ""}
                    onChange={(e) => setFormData({ ...formData, dataNascimento: e.target.value })}
                  />
                </div>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="razaoSocial">Razão Social *</Label>
                  <Input
                    id="razaoSocial"
                    placeholder="Razão social completa"
                    value={formData.razaoSocial || ""}
                    onChange={(e) => setFormData({ ...formData, razaoSocial: e.target.value })}
                  />
                </div>
                <div>
                  <Label htmlFor="razaoAbreviada">Razão Abreviada *</Label>
                  <Input
                    id="razaoAbreviada"
                    placeholder="Nome fantasia"
                    value={formData.razaoAbreviada || ""}
                    onChange={(e) => setFormData({ ...formData, razaoAbreviada: e.target.value })}
                  />
                </div>
                <div>
                  <Label htmlFor="cnpj">CNPJ *</Label>
                  <Input
                    id="cnpj"
                    placeholder="00.000.000/0000-00"
                    value={formData.cnpj || ""}
                    onChange={(e) => setFormData({ ...formData, cnpj: e.target.value })}
                  />
                </div>
                <div>
                  <Label htmlFor="dataAbertura">Data Abertura *</Label>
                  <Input
                    id="dataAbertura"
                    type="date"
                    value={formData.dataAbertura || ""}
                    onChange={(e) => setFormData({ ...formData, dataAbertura: e.target.value })}
                  />
                </div>
                <div>
                  <Label htmlFor="inscricaoEstadual">Inscrição Estadual</Label>
                  <Input
                    id="inscricaoEstadual"
                    placeholder="000.000.000.000"
                    value={formData.inscricaoEstadual || ""}
                    onChange={(e) => setFormData({ ...formData, inscricaoEstadual: e.target.value })}
                  />
                </div>
                <div>
                  <Label htmlFor="inscricaoMunicipal">Inscrição Municipal</Label>
                  <Input
                    id="inscricaoMunicipal"
                    placeholder="000000000"
                    value={formData.inscricaoMunicipal || ""}
                    onChange={(e) => setFormData({ ...formData, inscricaoMunicipal: e.target.value })}
                  />
                </div>
              </div>
            )}
          </TabsContent>

          {showAddressTabs && (
            <TabsContent value="enderecos" className="space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-medium">Endereços</h3>
                <Button onClick={() => setShowEnderecoForm(true)} disabled={showEnderecoForm}>
                  <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                  </svg>
                  Adicionar Endereço
                </Button>
              </div>

              {showEnderecoForm && (
                <Card>
                  <CardHeader>
                    <CardTitle className="text-base">Novo Endereço</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div>
                        <Label>Tipo de Endereço *</Label>
                        <Select
                          value={enderecoForm.tipo}
                          onValueChange={(value: any) => setEnderecoForm({ ...enderecoForm, tipo: value })}
                        >
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="residencial">Residencial</SelectItem>
                            <SelectItem value="comercial">Comercial</SelectItem>
                            <SelectItem value="cobranca">Cobrança</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div>
                        <Label>CEP *</Label>
                        <Input
                          placeholder="00000-000"
                          value={enderecoForm.cep}
                          onChange={(e) => {
                            const cep = e.target.value.replace(/\D/g, "")
                            setEnderecoForm({ ...enderecoForm, cep })
                            if (cep.length === 8) buscarCEP(cep)
                          }}
                        />
                      </div>
                      <div>
                        <Label>Email</Label>
                        <Input
                          placeholder="email@exemplo.com"
                          value={enderecoForm.email}
                          onChange={(e) => setEnderecoForm({ ...enderecoForm, email: e.target.value })}
                        />
                      </div>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <Label>Logradouro *</Label>
                        <Input
                          placeholder="Rua, Avenida..."
                          value={enderecoForm.logradouro}
                          onChange={(e) => setEnderecoForm({ ...enderecoForm, logradouro: e.target.value })}
                        />
                      </div>
                      <div>
                        <Label>Número *</Label>
                        <Input
                          placeholder="123"
                          value={enderecoForm.numero}
                          onChange={(e) => setEnderecoForm({ ...enderecoForm, numero: e.target.value })}
                        />
                      </div>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div>
                        <Label>Complemento</Label>
                        <Input
                          placeholder="Apto, Sala..."
                          value={enderecoForm.complemento}
                          onChange={(e) => setEnderecoForm({ ...enderecoForm, complemento: e.target.value })}
                        />
                      </div>
                      <div>
                        <Label>Bairro *</Label>
                        <Input
                          placeholder="Bairro"
                          value={enderecoForm.bairro}
                          onChange={(e) => setEnderecoForm({ ...enderecoForm, bairro: e.target.value })}
                        />
                      </div>
                      <div>
                        <Label>Cidade *</Label>
                        <Input
                          placeholder="Cidade"
                          value={enderecoForm.cidade}
                          onChange={(e) => setEnderecoForm({ ...enderecoForm, cidade: e.target.value })}
                        />
                      </div>
                    </div>
                    <div className="flex justify-end gap-2">
                      <Button variant="outline" onClick={() => setShowEnderecoForm(false)}>
                        Cancelar
                      </Button>
                      <Button onClick={handleAddEndereco}>Adicionar</Button>
                    </div>
                  </CardContent>
                </Card>
              )}

              <div className="space-y-3">
                {enderecos.map((endereco) => (
                  <Card key={endereco.id}>
                    <CardContent className="p-4">
                      <div className="flex items-center justify-between mb-2">
                        <h4 className="font-medium capitalize">{endereco.tipo}</h4>
                        <Button variant="ghost" size="sm" onClick={() => handleRemoveEndereco(endereco.id)}>
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                            />
                          </svg>
                        </Button>
                      </div>
                      <div className="grid grid-cols-2 md:grid-cols-3 gap-2 text-sm">
                        <div>
                          <span className="text-muted-foreground">CEP:</span> {endereco.cep}
                        </div>
                        <div>
                          <span className="text-muted-foreground">Logradouro:</span> {endereco.logradouro},{" "}
                          {endereco.numero}
                        </div>
                        <div>
                          <span className="text-muted-foreground">Bairro:</span> {endereco.bairro}
                        </div>
                        <div>
                          <span className="text-muted-foreground">Cidade:</span> {endereco.cidade}
                        </div>
                        <div>
                          <span className="text-muted-foreground">Estado:</span> {endereco.estado}
                        </div>
                        {endereco.email && (
                          <div>
                            <span className="text-muted-foreground">Email:</span> {endereco.email}
                          </div>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </TabsContent>
          )}

          {showBankTabs && (
            <TabsContent value="bancarios" className="space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-medium">Dados Bancários</h3>
                <Button onClick={() => setShowBancoForm(true)} disabled={showBancoForm}>
                  <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                  </svg>
                  Adicionar Conta
                </Button>
              </div>

              {showBancoForm && (
                <Card>
                  <CardHeader>
                    <CardTitle className="text-base">Nova Conta Bancária</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <Label>Banco *</Label>
                        <Select
                          value={bancoForm.banco}
                          onValueChange={(value) => setBancoForm({ ...bancoForm, banco: value })}
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="Selecione o banco" />
                          </SelectTrigger>
                          <SelectContent>
                            {bancos.map((banco) => (
                              <SelectItem key={banco} value={banco}>
                                {banco}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                      <div>
                        <Label>Agência *</Label>
                        <Input
                          placeholder="0000-0"
                          value={bancoForm.agencia}
                          onChange={(e) => setBancoForm({ ...bancoForm, agencia: e.target.value })}
                        />
                      </div>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div>
                        <Label>Tipo da Conta *</Label>
                        <Select
                          value={bancoForm.tipoConta}
                          onValueChange={(value: any) => setBancoForm({ ...bancoForm, tipoConta: value })}
                        >
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="corrente">Corrente</SelectItem>
                            <SelectItem value="poupanca">Poupança</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div>
                        <Label>Conta *</Label>
                        <Input
                          placeholder="00000-0"
                          value={bancoForm.conta}
                          onChange={(e) => setBancoForm({ ...bancoForm, conta: e.target.value })}
                        />
                      </div>
                      <div>
                        <Label>Dígito da Conta *</Label>
                        <Input
                          placeholder="0"
                          value={bancoForm.digitoConta}
                          onChange={(e) => setBancoForm({ ...bancoForm, digitoConta: e.target.value })}
                        />
                      </div>
                    </div>
                    <div className="flex justify-end gap-2">
                      <Button variant="outline" onClick={() => setShowBancoForm(false)}>
                        Cancelar
                      </Button>
                      <Button onClick={handleAddBanco}>Adicionar</Button>
                    </div>
                  </CardContent>
                </Card>
              )}

              <div className="space-y-3">
                {dadosBancarios.map((banco) => (
                  <Card key={banco.id}>
                    <CardContent className="p-4">
                      <div className="flex items-center justify-between mb-2">
                        <h4 className="font-medium">{banco.banco}</h4>
                        <Button variant="ghost" size="sm" onClick={() => handleRemoveBanco(banco.id)}>
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                            />
                          </svg>
                        </Button>
                      </div>
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-2 text-sm">
                        <div>
                          <span className="text-muted-foreground">Agência:</span> {banco.agencia}
                        </div>
                        <div>
                          <span className="text-muted-foreground">Tipo:</span> {banco.tipoConta}
                        </div>
                        <div>
                          <span className="text-muted-foreground">Conta:</span> {banco.conta}
                        </div>
                        <div>
                          <span className="text-muted-foreground">Dígito:</span> {banco.digitoConta}
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </TabsContent>
          )}
        </Tabs>
        <div className="flex justify-end gap-2 mt-6">
          <Button variant="outline" onClick={onClose}>
            Cancelar
          </Button>
          <Button onClick={handleSave}>Salvar Pessoa</Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}
