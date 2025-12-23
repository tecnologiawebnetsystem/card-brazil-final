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

export default function ConfiguracoesSmsPage() {
  const [smsSettings, setSmsSettings] = useState({
    provider: "twilio",
    apiKey: "",
    apiSecret: "",
    fromNumber: "+5511999999999",
    enableSms: true,
    enableLogs: true,
    maxLength: 160,
  })

  const handleSave = () => {
    toast.success("Configurações de SMS salvas com sucesso!")
  }

  const handleTest = () => {
    toast.success("SMS de teste enviado com sucesso!")
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-6 py-6">
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-foreground">Configurações de SMS</h1>
          <p className="text-muted-foreground">Configure o provedor e templates de SMS</p>
        </div>

        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Provedor de SMS</CardTitle>
              <CardDescription>Configure as informações do provedor de SMS</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="provider">Provedor</Label>
                  <Select
                    value={smsSettings.provider}
                    onValueChange={(value) => setSmsSettings({ ...smsSettings, provider: value })}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="twilio">Twilio</SelectItem>
                      <SelectItem value="zenvia">Zenvia</SelectItem>
                      <SelectItem value="totalvoice">TotalVoice</SelectItem>
                      <SelectItem value="smsdev">SMSDev</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="from-number">Número Remetente</Label>
                  <Input
                    id="from-number"
                    value={smsSettings.fromNumber}
                    onChange={(e) => setSmsSettings({ ...smsSettings, fromNumber: e.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="api-key">API Key</Label>
                  <Input
                    id="api-key"
                    type="password"
                    value={smsSettings.apiKey}
                    onChange={(e) => setSmsSettings({ ...smsSettings, apiKey: e.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="api-secret">API Secret</Label>
                  <Input
                    id="api-secret"
                    type="password"
                    value={smsSettings.apiSecret}
                    onChange={(e) => setSmsSettings({ ...smsSettings, apiSecret: e.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="max-length">Tamanho Máximo</Label>
                  <Input
                    id="max-length"
                    type="number"
                    value={smsSettings.maxLength}
                    onChange={(e) => setSmsSettings({ ...smsSettings, maxLength: Number.parseInt(e.target.value) })}
                  />
                </div>
              </div>

              <div className="flex gap-2">
                <Button onClick={handleTest} variant="outline">
                  <TestIcon className="w-4 h-4 mr-2" />
                  Testar Envio
                </Button>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Configurações Gerais</CardTitle>
              <CardDescription>Configure as opções gerais de SMS</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between p-4 border rounded-lg">
                <div>
                  <h4 className="font-medium">Habilitar Envio de SMS</h4>
                  <p className="text-sm text-muted-foreground">Ativar/desativar o envio de SMS do sistema</p>
                </div>
                <Switch
                  checked={smsSettings.enableSms}
                  onCheckedChange={(checked) => setSmsSettings({ ...smsSettings, enableSms: checked })}
                />
              </div>
              <div className="flex items-center justify-between p-4 border rounded-lg">
                <div>
                  <h4 className="font-medium">Log de SMS</h4>
                  <p className="text-sm text-muted-foreground">Registrar histórico de SMS enviados</p>
                </div>
                <Switch
                  checked={smsSettings.enableLogs}
                  onCheckedChange={(checked) => setSmsSettings({ ...smsSettings, enableLogs: checked })}
                />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Templates de SMS</CardTitle>
              <CardDescription>Configure os modelos de SMS do sistema</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="template-boas-vindas-sms">Template de Boas-vindas</Label>
                <Textarea
                  id="template-boas-vindas-sms"
                  placeholder="Digite o template de boas-vindas..."
                  className="min-h-[80px]"
                  maxLength={160}
                />
                <p className="text-xs text-muted-foreground">Máximo 160 caracteres</p>
              </div>
              <div className="space-y-2">
                <Label htmlFor="template-cobranca-sms">Template de Cobrança</Label>
                <Textarea
                  id="template-cobranca-sms"
                  placeholder="Digite o template de cobrança..."
                  className="min-h-[80px]"
                  maxLength={160}
                />
                <p className="text-xs text-muted-foreground">Máximo 160 caracteres</p>
              </div>
              <div className="space-y-2">
                <Label htmlFor="template-vencimento-sms">Template de Vencimento</Label>
                <Textarea
                  id="template-vencimento-sms"
                  placeholder="Digite o template de vencimento..."
                  className="min-h-[80px]"
                  maxLength={160}
                />
                <p className="text-xs text-muted-foreground">Máximo 160 caracteres</p>
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
