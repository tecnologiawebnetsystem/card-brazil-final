"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { UserIcon, FileTextIcon } from "lucide-react"

export default function BeneficiarioTitularPage() {
  const [formData, setFormData] = useState({
    nome: "",
    cpf: "",
    rg: "",
    dataNascimento: "",
    sexo: "",
    estadoCivil: "",
    profissao: "",
    renda: "",
    telefone: "",
    celular: "",
    email: "",
    cep: "",
    endereco: "",
    numero: "",
    complemento: "",
    bairro: "",
    cidade: "",
    uf: "",
    planoEscolhido: "",
    operadora: "",
    valorMensalidade: "",
    formaPagamento: "",
    diaVencimento: "",
    observacoes: "",
  })

  const handleInputChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
  }

  return (
    <div className="flex-1 space-y-6 p-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-gray-900">Proposta - Beneficiário Titular</h1>
          <p className="text-gray-600">Cadastro de nova proposta para beneficiário titular</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline">
            <FileTextIcon className="h-4 w-4 mr-2" />
            Imprimir
          </Button>
          <Button>
            <UserIcon className="h-4 w-4 mr-2" />
            Salvar Proposta
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        <div className="lg:col-span-1">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Status da Proposta</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="text-center">
                <Badge variant="secondary" className="mb-2">
                  Em Análise
                </Badge>
                <p className="text-sm text-gray-600">Proposta nº: 2024001234</p>
                <p className="text-xs text-gray-500">Criada em: 15/01/2024</p>
              </div>
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span>Dados Pessoais</span>
                  <Badge variant="outline" className="text-xs">
                    Pendente
                  </Badge>
                </div>
                <div className="flex justify-between text-sm">
                  <span>Plano Escolhido</span>
                  <Badge variant="outline" className="text-xs">
                    Pendente
                  </Badge>
                </div>
                <div className="flex justify-between text-sm">
                  <span>Documentação</span>
                  <Badge variant="outline" className="text-xs">
                    Pendente
                  </Badge>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="lg:col-span-3">
          <Tabs defaultValue="dados-pessoais" className="space-y-6">
            <TabsList className="grid w-full grid-cols-4">
              <TabsTrigger value="dados-pessoais">Dados Pessoais</TabsTrigger>
              <TabsTrigger value="endereco">Endereço</TabsTrigger>
              <TabsTrigger value="plano">Plano e Pagamento</TabsTrigger>
              <TabsTrigger value="documentos">Documentos</TabsTrigger>
            </TabsList>

            <TabsContent value="dados-pessoais">
              <Card>
                <CardHeader>
                  <CardTitle>Dados Pessoais do Titular</CardTitle>
                  <CardDescription>Informações básicas do beneficiário titular</CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="nome">Nome Completo *</Label>
                      <Input
                        id="nome"
                        placeholder="Digite o nome completo"
                        value={formData.nome}
                        onChange={(e) => handleInputChange("nome", e.target.value)}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="cpf">CPF *</Label>
                      <Input
                        id="cpf"
                        placeholder="000.000.000-00"
                        value={formData.cpf}
                        onChange={(e) => handleInputChange("cpf", e.target.value)}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="rg">RG</Label>
                      <Input
                        id="rg"
                        placeholder="Digite o RG"
                        value={formData.rg}
                        onChange={(e) => handleInputChange("rg", e.target.value)}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="dataNascimento">Data de Nascimento *</Label>
                      <Input
                        id="dataNascimento"
                        type="date"
                        value={formData.dataNascimento}
                        onChange={(e) => handleInputChange("dataNascimento", e.target.value)}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="sexo">Sexo *</Label>
                      <Select value={formData.sexo} onValueChange={(value) => handleInputChange("sexo", value)}>
                        <SelectTrigger>
                          <SelectValue placeholder="Selecione" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="masculino">Masculino</SelectItem>
                          <SelectItem value="feminino">Feminino</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="estadoCivil">Estado Civil</Label>
                      <Select
                        value={formData.estadoCivil}
                        onValueChange={(value) => handleInputChange("estadoCivil", value)}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Selecione" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="solteiro">Solteiro(a)</SelectItem>
                          <SelectItem value="casado">Casado(a)</SelectItem>
                          <SelectItem value="divorciado">Divorciado(a)</SelectItem>
                          <SelectItem value="viuvo">Viúvo(a)</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="profissao">Profissão</Label>
                      <Input
                        id="profissao"
                        placeholder="Digite a profissão"
                        value={formData.profissao}
                        onChange={(e) => handleInputChange("profissao", e.target.value)}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="renda">Renda Mensal</Label>
                      <Input
                        id="renda"
                        placeholder="R$ 0,00"
                        value={formData.renda}
                        onChange={(e) => handleInputChange("renda", e.target.value)}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="telefone">Telefone</Label>
                      <Input
                        id="telefone"
                        placeholder="(11) 0000-0000"
                        value={formData.telefone}
                        onChange={(e) => handleInputChange("telefone", e.target.value)}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="celular">Celular *</Label>
                      <Input
                        id="celular"
                        placeholder="(11) 90000-0000"
                        value={formData.celular}
                        onChange={(e) => handleInputChange("celular", e.target.value)}
                      />
                    </div>
                    <div className="space-y-2 md:col-span-2">
                      <Label htmlFor="email">E-mail *</Label>
                      <Input
                        id="email"
                        type="email"
                        placeholder="email@exemplo.com"
                        value={formData.email}
                        onChange={(e) => handleInputChange("email", e.target.value)}
                      />
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="endereco">
              <Card>
                <CardHeader>
                  <CardTitle>Endereço Residencial</CardTitle>
                  <CardDescription>Informações de endereço do beneficiário</CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="cep">CEP *</Label>
                      <Input
                        id="cep"
                        placeholder="00000-000"
                        value={formData.cep}
                        onChange={(e) => handleInputChange("cep", e.target.value)}
                      />
                    </div>
                    <div className="space-y-2 md:col-span-2">
                      <Label htmlFor="endereco">Endereço *</Label>
                      <Input
                        id="endereco"
                        placeholder="Digite o endereço"
                        value={formData.endereco}
                        onChange={(e) => handleInputChange("endereco", e.target.value)}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="numero">Número *</Label>
                      <Input
                        id="numero"
                        placeholder="123"
                        value={formData.numero}
                        onChange={(e) => handleInputChange("numero", e.target.value)}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="complemento">Complemento</Label>
                      <Input
                        id="complemento"
                        placeholder="Apto, Bloco, etc."
                        value={formData.complemento}
                        onChange={(e) => handleInputChange("complemento", e.target.value)}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="bairro">Bairro *</Label>
                      <Input
                        id="bairro"
                        placeholder="Digite o bairro"
                        value={formData.bairro}
                        onChange={(e) => handleInputChange("bairro", e.target.value)}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="cidade">Cidade *</Label>
                      <Input
                        id="cidade"
                        placeholder="Digite a cidade"
                        value={formData.cidade}
                        onChange={(e) => handleInputChange("cidade", e.target.value)}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="uf">UF *</Label>
                      <Select value={formData.uf} onValueChange={(value) => handleInputChange("uf", value)}>
                        <SelectTrigger>
                          <SelectValue placeholder="Selecione" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="SP">São Paulo</SelectItem>
                          <SelectItem value="RJ">Rio de Janeiro</SelectItem>
                          <SelectItem value="MG">Minas Gerais</SelectItem>
                          <SelectItem value="RS">Rio Grande do Sul</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="plano">
              <Card>
                <CardHeader>
                  <CardTitle>Plano e Forma de Pagamento</CardTitle>
                  <CardDescription>Escolha do plano de saúde e configuração de pagamento</CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="operadora">Operadora *</Label>
                      <Select
                        value={formData.operadora}
                        onValueChange={(value) => handleInputChange("operadora", value)}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Selecione a operadora" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="unimed">Unimed</SelectItem>
                          <SelectItem value="bradesco">Bradesco Saúde</SelectItem>
                          <SelectItem value="amil">Amil</SelectItem>
                          <SelectItem value="sulamerica">SulAmérica</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="planoEscolhido">Plano Escolhido *</Label>
                      <Select
                        value={formData.planoEscolhido}
                        onValueChange={(value) => handleInputChange("planoEscolhido", value)}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Selecione o plano" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="basico">Plano Básico</SelectItem>
                          <SelectItem value="intermediario">Plano Intermediário</SelectItem>
                          <SelectItem value="premium">Plano Premium</SelectItem>
                          <SelectItem value="executivo">Plano Executivo</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="valorMensalidade">Valor da Mensalidade</Label>
                      <Input
                        id="valorMensalidade"
                        placeholder="R$ 0,00"
                        value={formData.valorMensalidade}
                        onChange={(e) => handleInputChange("valorMensalidade", e.target.value)}
                        readOnly
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="formaPagamento">Forma de Pagamento *</Label>
                      <Select
                        value={formData.formaPagamento}
                        onValueChange={(value) => handleInputChange("formaPagamento", value)}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Selecione" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="boleto">Boleto Bancário</SelectItem>
                          <SelectItem value="debito">Débito Automático</SelectItem>
                          <SelectItem value="cartao">Cartão de Crédito</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="diaVencimento">Dia de Vencimento</Label>
                      <Select
                        value={formData.diaVencimento}
                        onValueChange={(value) => handleInputChange("diaVencimento", value)}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Selecione o dia" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="05">Dia 05</SelectItem>
                          <SelectItem value="10">Dia 10</SelectItem>
                          <SelectItem value="15">Dia 15</SelectItem>
                          <SelectItem value="20">Dia 20</SelectItem>
                          <SelectItem value="25">Dia 25</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="observacoes">Observações</Label>
                    <Textarea
                      id="observacoes"
                      placeholder="Observações adicionais sobre a proposta..."
                      value={formData.observacoes}
                      onChange={(e) => handleInputChange("observacoes", e.target.value)}
                      rows={3}
                    />
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="documentos">
              <Card>
                <CardHeader>
                  <CardTitle>Documentos Necessários</CardTitle>
                  <CardDescription>Upload dos documentos obrigatórios para análise da proposta</CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-4">
                      <h4 className="font-medium">Documentos Pessoais</h4>
                      <div className="space-y-3">
                        <div className="flex items-center justify-between p-3 border rounded-lg">
                          <span className="text-sm">CPF (frente e verso)</span>
                          <Badge variant="outline">Pendente</Badge>
                        </div>
                        <div className="flex items-center justify-between p-3 border rounded-lg">
                          <span className="text-sm">RG (frente e verso)</span>
                          <Badge variant="outline">Pendente</Badge>
                        </div>
                        <div className="flex items-center justify-between p-3 border rounded-lg">
                          <span className="text-sm">Comprovante de Residência</span>
                          <Badge variant="outline">Pendente</Badge>
                        </div>
                      </div>
                    </div>
                    <div className="space-y-4">
                      <h4 className="font-medium">Documentos Financeiros</h4>
                      <div className="space-y-3">
                        <div className="flex items-center justify-between p-3 border rounded-lg">
                          <span className="text-sm">Comprovante de Renda</span>
                          <Badge variant="outline">Pendente</Badge>
                        </div>
                        <div className="flex items-center justify-between p-3 border rounded-lg">
                          <span className="text-sm">Declaração de Saúde</span>
                          <Badge variant="outline">Pendente</Badge>
                        </div>
                        <div className="flex items-center justify-between p-3 border rounded-lg">
                          <span className="text-sm">Proposta Assinada</span>
                          <Badge variant="outline">Pendente</Badge>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="flex justify-center">
                    <Button variant="outline" className="w-full max-w-md bg-transparent">
                      <FileTextIcon className="h-4 w-4 mr-2" />
                      Fazer Upload de Documentos
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  )
}
