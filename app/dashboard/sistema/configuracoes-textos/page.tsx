"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Save, Mail, MessageCircle, Printer } from "lucide-react"

export default function ConfiguracoesTextosPage() {
  const [configuracoes, setConfiguracoes] = useState({
    telefoneWhatsApp: "(11) 99999-9999",
    textoWhatsApp:
      "Olá! Segue o link para visualizar/imprimir seu boleto: {link_boleto}. Em caso de dúvidas, entre em contato conosco.",
    textoEmail:
      "Prezado(a) cliente,\n\nSegue em anexo o boleto para pagamento.\n\nLink para visualização: {link_boleto}\n\nAtenciosamente,\nEquipe CardBrazil",
    textoImpressao:
      "BOLETO DE COBRANÇA - CARDBRAZIL ADMINISTRADORA DE SAÚDE\n\nBeneficiário: {beneficiario}\nPlano: {plano}\nVencimento: {vencimento}\nValor: R$ {valor}",
    assuntoEmail: "CardBrazil - Boleto de Cobrança - Vencimento {vencimento}",
  })

  const handleSave = () => {
    // Aqui salvaria as configurações no backend
    alert("Configurações salvas com sucesso!")
  }

  const handleInputChange = (field: string, value: string) => {
    setConfiguracoes((prev) => ({
      ...prev,
      [field]: value,
    }))
  }

  return (
    <div className="space-y-6 p-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Configurações de Textos</h1>
          <p className="text-muted-foreground">Configure textos padrão para WhatsApp, e-mail e impressão</p>
        </div>
      </div>

      <Tabs defaultValue="whatsapp" className="space-y-6">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="whatsapp" className="flex items-center gap-2">
            <MessageCircle className="h-4 w-4" />
            WhatsApp
          </TabsTrigger>
          <TabsTrigger value="email" className="flex items-center gap-2">
            <Mail className="h-4 w-4" />
            E-mail
          </TabsTrigger>
          <TabsTrigger value="impressao" className="flex items-center gap-2">
            <Printer className="h-4 w-4" />
            Impressão
          </TabsTrigger>
        </TabsList>

        <TabsContent value="whatsapp">
          <Card className="border-emerald-200">
            <CardHeader className="border-b border-emerald-200">
              <CardTitle className="text-lg font-semibold flex items-center gap-2 text-foreground">
                <MessageCircle className="h-5 w-5 text-green-600" />
                Configurações do WhatsApp
              </CardTitle>
            </CardHeader>
            <CardContent className="p-6 space-y-6">
              <div className="space-y-2">
                <Label htmlFor="telefoneWhatsApp" className="text-sm font-medium text-foreground">
                  Telefone do WhatsApp:
                </Label>
                <Input
                  id="telefoneWhatsApp"
                  placeholder="(11) 99999-9999"
                  value={configuracoes.telefoneWhatsApp}
                  onChange={(e) => handleInputChange("telefoneWhatsApp", e.target.value)}
                  className="border-emerald-300 focus:border-emerald-500"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="textoWhatsApp" className="text-sm font-medium text-foreground">
                  Texto Padrão do WhatsApp:
                </Label>
                <Textarea
                  id="textoWhatsApp"
                  placeholder="Digite o texto padrão para WhatsApp..."
                  value={configuracoes.textoWhatsApp}
                  onChange={(e) => handleInputChange("textoWhatsApp", e.target.value)}
                  className="border-emerald-300 focus:border-emerald-500 min-h-[120px]"
                />
                <p className="text-xs text-muted-foreground">
                  Variáveis disponíveis: {"{link_boleto}"}, {"{beneficiario}"}, {"{plano}"}, {"{vencimento}"},{" "}
                  {"{valor}"}
                </p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="email">
          <Card className="border-emerald-200">
            <CardHeader className="border-b border-emerald-200">
              <CardTitle className="text-lg font-semibold flex items-center gap-2 text-foreground">
                <Mail className="h-5 w-5 text-blue-600" />
                Configurações do E-mail
              </CardTitle>
            </CardHeader>
            <CardContent className="p-6 space-y-6">
              <div className="space-y-2">
                <Label htmlFor="assuntoEmail" className="text-sm font-medium text-foreground">
                  Assunto do E-mail:
                </Label>
                <Input
                  id="assuntoEmail"
                  placeholder="Assunto do e-mail..."
                  value={configuracoes.assuntoEmail}
                  onChange={(e) => handleInputChange("assuntoEmail", e.target.value)}
                  className="border-emerald-300 focus:border-emerald-500"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="textoEmail" className="text-sm font-medium text-foreground">
                  Texto Padrão do E-mail:
                </Label>
                <Textarea
                  id="textoEmail"
                  placeholder="Digite o texto padrão para e-mail..."
                  value={configuracoes.textoEmail}
                  onChange={(e) => handleInputChange("textoEmail", e.target.value)}
                  className="border-emerald-300 focus:border-emerald-500 min-h-[150px]"
                />
                <p className="text-xs text-muted-foreground">
                  Variáveis disponíveis: {"{link_boleto}"}, {"{beneficiario}"}, {"{plano}"}, {"{vencimento}"},{" "}
                  {"{valor}"}
                </p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="impressao">
          <Card className="border-emerald-200">
            <CardHeader className="border-b border-emerald-200">
              <CardTitle className="text-lg font-semibold flex items-center gap-2 text-foreground">
                <Printer className="h-5 w-5 text-gray-600" />
                Configurações de Impressão
              </CardTitle>
            </CardHeader>
            <CardContent className="p-6 space-y-6">
              <div className="space-y-2">
                <Label htmlFor="textoImpressao" className="text-sm font-medium text-foreground">
                  Texto Padrão para Impressão:
                </Label>
                <Textarea
                  id="textoImpressao"
                  placeholder="Digite o texto padrão para impressão..."
                  value={configuracoes.textoImpressao}
                  onChange={(e) => handleInputChange("textoImpressao", e.target.value)}
                  className="border-emerald-300 focus:border-emerald-500 min-h-[120px]"
                />
                <p className="text-xs text-muted-foreground">
                  Variáveis disponíveis: {"{beneficiario}"}, {"{plano}"}, {"{vencimento}"}, {"{valor}"},{" "}
                  {"{codigo_barras}"}
                </p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      <div className="flex justify-end pt-4 border-t">
        <Button onClick={handleSave} className="bg-emerald-600 hover:bg-emerald-700 text-white px-6">
          <Save className="h-4 w-4 mr-2" />
          Salvar Configurações
        </Button>
      </div>
    </div>
  )
}
