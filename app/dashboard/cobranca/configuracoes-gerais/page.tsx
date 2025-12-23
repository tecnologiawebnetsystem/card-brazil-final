"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Switch } from "@/components/ui/switch"
import { Textarea } from "@/components/ui/textarea"
import { Settings, CreditCard, Bell, Shield, Save, RefreshCw } from "lucide-react"

export default function ConfiguracoesGeraisPage() {
  return (
    <div className="flex-1 space-y-4 p-4 md:p-8 pt-6">
      <div className="flex items-center justify-between space-y-2">
        <h2 className="text-3xl font-bold tracking-tight">Configurações Gerais</h2>
        <div className="flex items-center space-x-2">
          <Button variant="outline">
            <RefreshCw className="mr-2 h-4 w-4" />
            Restaurar Padrões
          </Button>
          <Button>
            <Save className="mr-2 h-4 w-4" />
            Salvar Alterações
          </Button>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Configurações Ativas</CardTitle>
            <Settings className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">24</div>
            <p className="text-xs text-muted-foreground">Parâmetros configurados</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Métodos de Pagamento</CardTitle>
            <CreditCard className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">8</div>
            <p className="text-xs text-muted-foreground">Formas habilitadas</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Notificações</CardTitle>
            <Bell className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">12</div>
            <p className="text-xs text-muted-foreground">Tipos configurados</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Segurança</CardTitle>
            <Shield className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">Alta</div>
            <p className="text-xs text-muted-foreground">Nível de proteção</p>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="geral" className="space-y-4">
        <TabsList>
          <TabsTrigger value="geral">Geral</TabsTrigger>
          <TabsTrigger value="pagamentos">Pagamentos</TabsTrigger>
          <TabsTrigger value="notificacoes">Notificações</TabsTrigger>
          <TabsTrigger value="seguranca">Segurança</TabsTrigger>
        </TabsList>

        <TabsContent value="geral" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Configurações Gerais do Sistema</CardTitle>
              <CardDescription>Configurações básicas que afetam todo o sistema de cobrança</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="empresa">Nome da Empresa</Label>
                  <Input id="empresa" placeholder="Talend Saúde" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="cnpj">CNPJ</Label>
                  <Input id="cnpj" placeholder="00.000.000/0001-00" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="telefone">Telefone</Label>
                  <Input id="telefone" placeholder="(11) 9999-9999" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="email">E-mail Principal</Label>
                  <Input id="email" placeholder="contato@talendsaude.com.br" />
                </div>
              </div>

              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>Cobrança Automática</Label>
                    <p className="text-sm text-muted-foreground">Habilitar cobrança automática para faturas vencidas</p>
                  </div>
                  <Switch />
                </div>

                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>Multa por Atraso</Label>
                    <p className="text-sm text-muted-foreground">Aplicar multa automaticamente em faturas em atraso</p>
                  </div>
                  <Switch />
                </div>

                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>Desconto por Pontualidade</Label>
                    <p className="text-sm text-muted-foreground">Oferecer desconto para pagamentos antecipados</p>
                  </div>
                  <Switch />
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="pagamentos" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Configurações de Pagamento</CardTitle>
              <CardDescription>Configure os métodos de pagamento aceitos e suas regras</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="vencimento-padrao">Vencimento Padrão (dias)</Label>
                  <Input id="vencimento-padrao" placeholder="10" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="carencia">Carência para Cobrança (dias)</Label>
                  <Input id="carencia" placeholder="5" />
                </div>
              </div>

              <div className="space-y-4">
                <h4 className="text-sm font-medium">Métodos de Pagamento Aceitos</h4>

                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>Boleto Bancário</Label>
                    <p className="text-sm text-muted-foreground">Cobrança via boleto</p>
                  </div>
                  <Switch defaultChecked />
                </div>

                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>Débito Automático</Label>
                    <p className="text-sm text-muted-foreground">Débito em conta corrente</p>
                  </div>
                  <Switch defaultChecked />
                </div>

                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>Cartão de Crédito</Label>
                    <p className="text-sm text-muted-foreground">Pagamento via cartão</p>
                  </div>
                  <Switch defaultChecked />
                </div>

                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>PIX</Label>
                    <p className="text-sm text-muted-foreground">Pagamento instantâneo</p>
                  </div>
                  <Switch defaultChecked />
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="notificacoes" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Configurações de Notificações</CardTitle>
              <CardDescription>Configure quando e como os beneficiários serão notificados</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <h4 className="text-sm font-medium">Notificações por E-mail</h4>

                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>Lembrete de Vencimento</Label>
                    <p className="text-sm text-muted-foreground">3 dias antes do vencimento</p>
                  </div>
                  <Switch defaultChecked />
                </div>

                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>Fatura Vencida</Label>
                    <p className="text-sm text-muted-foreground">No dia do vencimento</p>
                  </div>
                  <Switch defaultChecked />
                </div>

                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>Cobrança de Atraso</Label>
                    <p className="text-sm text-muted-foreground">5 dias após vencimento</p>
                  </div>
                  <Switch defaultChecked />
                </div>
              </div>

              <div className="space-y-4">
                <h4 className="text-sm font-medium">Notificações por SMS</h4>

                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>Lembrete de Vencimento</Label>
                    <p className="text-sm text-muted-foreground">1 dia antes do vencimento</p>
                  </div>
                  <Switch />
                </div>

                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>Confirmação de Pagamento</Label>
                    <p className="text-sm text-muted-foreground">Após confirmação do pagamento</p>
                  </div>
                  <Switch />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="template-email">Template de E-mail</Label>
                <Textarea
                  id="template-email"
                  placeholder="Personalize o template de e-mail..."
                  className="min-h-[100px]"
                />
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="seguranca" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Configurações de Segurança</CardTitle>
              <CardDescription>Configure as políticas de segurança do sistema</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="tentativas-login">Máximo de Tentativas de Login</Label>
                  <Input id="tentativas-login" placeholder="3" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="tempo-sessao">Tempo de Sessão (minutos)</Label>
                  <Input id="tempo-sessao" placeholder="30" />
                </div>
              </div>

              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>Autenticação de Dois Fatores</Label>
                    <p className="text-sm text-muted-foreground">Exigir código adicional no login</p>
                  </div>
                  <Switch />
                </div>

                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>Log de Auditoria</Label>
                    <p className="text-sm text-muted-foreground">Registrar todas as ações do sistema</p>
                  </div>
                  <Switch defaultChecked />
                </div>

                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>Criptografia de Dados</Label>
                    <p className="text-sm text-muted-foreground">Criptografar dados sensíveis</p>
                  </div>
                  <Switch defaultChecked />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="politica-senha">Política de Senhas</Label>
                <Select>
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione a política" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="basica">Básica (6 caracteres)</SelectItem>
                    <SelectItem value="media">Média (8 caracteres + números)</SelectItem>
                    <SelectItem value="forte">Forte (12 caracteres + símbolos)</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
