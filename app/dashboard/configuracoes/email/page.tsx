"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { toast } from "sonner"

const SaveIcon = () => (
  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="M8 7H5a2 2 0 00-2 2v9a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-3m-1 4l-3 3m0 0l-3-3m3 3V4"
    />
  </svg>
)

const TestIcon = () => (
  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
    />
  </svg>
)

export default function ConfiguracoesEmailPage() {
  const [emailSettings, setEmailSettings] = useState({
    smtpServer: "smtp.gmail.com",
    smtpPort: "587",
    smtpUser: "sistema@talenthealth.com.br",
    smtpPassword: "",
    smtpSecurity: "tls",
    fromName: "Talent Health CRM",
    fromEmail: "noreply@talenthealth.com.br",
    replyTo: "suporte@talenthealth.com.br",
    enableEmail: true,
    enableLogs: true,
  })

  const handleSave = () => {
    toast.success("Configurações de email salvas com sucesso!")
  }

  const handleTest = () => {
    toast.success("Email de teste enviado com sucesso!")
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-6 py-6">
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-foreground">Configurações de Email</h1>
          <p className="text-muted-foreground">Configure o servidor SMTP e templates de email</p>
        </div>

        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Servidor SMTP</CardTitle>
              <CardDescription>Configure as informações do servidor de email</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="smtp-server">Servidor SMTP</Label>
                  <Input
                    id="smtp-server"
                    value={emailSettings.smtpServer}
                    onChange={(e) => setEmailSettings({ ...emailSettings, smtpServer: e.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="smtp-port">Porta</Label>
                  <Input
                    id="smtp-port"
                    value={emailSettings.smtpPort}
                    onChange={(e) => setEmailSettings({ ...emailSettings, smtpPort: e.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="smtp-user">Usuário</Label>
                  <Input
                    id="smtp-user"
                    value={emailSettings.smtpUser}
                    onChange={(e) => setEmailSettings({ ...emailSettings, smtpUser: e.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="smtp-password">Senha</Label>
                  <Input
                    id="smtp-password"
                    type="password"
                    value={emailSettings.smtpPassword}
                    onChange={(e) => setEmailSettings({ ...emailSettings, smtpPassword: e.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="smtp-security">Segurança</Label>
                  <Select
                    value={emailSettings.smtpSecurity}
                    onValueChange={(value) => setEmailSettings({ ...emailSettings, smtpSecurity: value })}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="none">Nenhuma</SelectItem>
                      <SelectItem value="tls">TLS</SelectItem>
                      <SelectItem value="ssl">SSL</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="flex gap-2">
                <Button onClick={handleTest} variant="outline">
                  <TestIcon className="w-4 h-4 mr-2" />
                  Testar Conexão
                </Button>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Configurações de Envio</CardTitle>
              <CardDescription>Configure as informações padrão dos emails</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="from-name">Nome do Remetente</Label>
                  <Input
                    id="from-name"
                    value={emailSettings.fromName}
                    onChange={(e) => setEmailSettings({ ...emailSettings, fromName: e.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="from-email">Email do Remetente</Label>
                  <Input
                    id="from-email"
                    value={emailSettings.fromEmail}
                    onChange={(e) => setEmailSettings({ ...emailSettings, fromEmail: e.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="reply-to">Email de Resposta</Label>
                  <Input
                    id="reply-to"
                    value={emailSettings.replyTo}
                    onChange={(e) => setEmailSettings({ ...emailSettings, replyTo: e.target.value })}
                  />
                </div>
              </div>

              <div className="space-y-4">
                <div className="flex items-center justify-between p-4 border rounded-lg">
                  <div>
                    <h4 className="font-medium">Habilitar Envio de Email</h4>
                    <p className="text-sm text-muted-foreground">Ativar/desativar o envio de emails do sistema</p>
                  </div>
                  <Switch
                    checked={emailSettings.enableEmail}
                    onCheckedChange={(checked) => setEmailSettings({ ...emailSettings, enableEmail: checked })}
                  />
                </div>
                <div className="flex items-center justify-between p-4 border rounded-lg">
                  <div>
                    <h4 className="font-medium">Log de Emails</h4>
                    <p className="text-sm text-muted-foreground">Registrar histórico de emails enviados</p>
                  </div>
                  <Switch
                    checked={emailSettings.enableLogs}
                    onCheckedChange={(checked) => setEmailSettings({ ...emailSettings, enableLogs: checked })}
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Templates de Email</CardTitle>
              <CardDescription>Configure os modelos de email do sistema</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="template-boas-vindas">Template de Boas-vindas</Label>
                <Textarea
                  id="template-boas-vindas"
                  placeholder="Digite o template de boas-vindas..."
                  className="min-h-[100px]"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="template-cobranca">Template de Cobrança</Label>
                <Textarea
                  id="template-cobranca"
                  placeholder="Digite o template de cobrança..."
                  className="min-h-[100px]"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="template-vencimento">Template de Vencimento</Label>
                <Textarea
                  id="template-vencimento"
                  placeholder="Digite o template de vencimento..."
                  className="min-h-[100px]"
                />
              </div>
            </CardContent>
          </Card>

          <Button onClick={handleSave} className="bg-emerald-700 hover:bg-emerald-800">
            <SaveIcon className="w-4 h-4 mr-2" />
            Salvar Configurações
          </Button>
        </div>
      </div>
    </div>
  )
}
