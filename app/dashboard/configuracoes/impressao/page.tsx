"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
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

const PrintIcon = () => (
  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z"
    />
  </svg>
)

export default function ConfiguracoesImpressaoPage() {
  const [printSettings, setPrintSettings] = useState({
    defaultPrinter: "HP LaserJet Pro",
    paperSize: "A4",
    orientation: "portrait",
    quality: "high",
    margins: "normal",
    enablePrint: true,
    autoSelectPrinter: true,
    printInColor: false,
    duplex: false,
  })

  const handleSave = () => {
    toast.success("Configurações de impressão salvas com sucesso!")
  }

  const handleTestPrint = () => {
    toast.success("Página de teste enviada para impressão!")
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-6 py-6">
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-foreground">Configurações de Impressão</h1>
          <p className="text-muted-foreground">Configure as preferências de impressão do sistema</p>
        </div>

        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Impressora Padrão</CardTitle>
              <CardDescription>Configure a impressora padrão do sistema</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="default-printer">Impressora Padrão</Label>
                  <Select
                    value={printSettings.defaultPrinter}
                    onValueChange={(value) => setPrintSettings({ ...printSettings, defaultPrinter: value })}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="HP LaserJet Pro">HP LaserJet Pro</SelectItem>
                      <SelectItem value="Canon PIXMA">Canon PIXMA</SelectItem>
                      <SelectItem value="Epson EcoTank">Epson EcoTank</SelectItem>
                      <SelectItem value="Brother DCP">Brother DCP</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="paper-size">Tamanho do Papel</Label>
                  <Select
                    value={printSettings.paperSize}
                    onValueChange={(value) => setPrintSettings({ ...printSettings, paperSize: value })}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="A4">A4</SelectItem>
                      <SelectItem value="A3">A3</SelectItem>
                      <SelectItem value="Letter">Letter</SelectItem>
                      <SelectItem value="Legal">Legal</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="orientation">Orientação</Label>
                  <Select
                    value={printSettings.orientation}
                    onValueChange={(value) => setPrintSettings({ ...printSettings, orientation: value })}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="portrait">Retrato</SelectItem>
                      <SelectItem value="landscape">Paisagem</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="quality">Qualidade</Label>
                  <Select
                    value={printSettings.quality}
                    onValueChange={(value) => setPrintSettings({ ...printSettings, quality: value })}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="draft">Rascunho</SelectItem>
                      <SelectItem value="normal">Normal</SelectItem>
                      <SelectItem value="high">Alta</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="margins">Margens</Label>
                  <Select
                    value={printSettings.margins}
                    onValueChange={(value) => setPrintSettings({ ...printSettings, margins: value })}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="narrow">Estreita</SelectItem>
                      <SelectItem value="normal">Normal</SelectItem>
                      <SelectItem value="wide">Larga</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="flex gap-2">
                <Button onClick={handleTestPrint} variant="outline">
                  <PrintIcon className="w-4 h-4 mr-2" />
                  Imprimir Teste
                </Button>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Opções Avançadas</CardTitle>
              <CardDescription>Configure opções avançadas de impressão</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between p-4 border rounded-lg">
                <div>
                  <h4 className="font-medium">Habilitar Impressão</h4>
                  <p className="text-sm text-muted-foreground">Ativar/desativar a funcionalidade de impressão</p>
                </div>
                <Switch
                  checked={printSettings.enablePrint}
                  onCheckedChange={(checked) => setPrintSettings({ ...printSettings, enablePrint: checked })}
                />
              </div>
              <div className="flex items-center justify-between p-4 border rounded-lg">
                <div>
                  <h4 className="font-medium">Seleção Automática</h4>
                  <p className="text-sm text-muted-foreground">Selecionar automaticamente a melhor impressora</p>
                </div>
                <Switch
                  checked={printSettings.autoSelectPrinter}
                  onCheckedChange={(checked) => setPrintSettings({ ...printSettings, autoSelectPrinter: checked })}
                />
              </div>
              <div className="flex items-center justify-between p-4 border rounded-lg">
                <div>
                  <h4 className="font-medium">Impressão Colorida</h4>
                  <p className="text-sm text-muted-foreground">Usar impressão colorida por padrão</p>
                </div>
                <Switch
                  checked={printSettings.printInColor}
                  onCheckedChange={(checked) => setPrintSettings({ ...printSettings, printInColor: checked })}
                />
              </div>
              <div className="flex items-center justify-between p-4 border rounded-lg">
                <div>
                  <h4 className="font-medium">Impressão Duplex</h4>
                  <p className="text-sm text-muted-foreground">Imprimir frente e verso automaticamente</p>
                </div>
                <Switch
                  checked={printSettings.duplex}
                  onCheckedChange={(checked) => setPrintSettings({ ...printSettings, duplex: checked })}
                />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Templates de Impressão</CardTitle>
              <CardDescription>Configure os modelos de documentos para impressão</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="p-4 border rounded-lg">
                  <h4 className="font-medium mb-2">Carteirinhas</h4>
                  <p className="text-sm text-muted-foreground mb-3">Template para impressão de carteirinhas</p>
                  <Button variant="outline" size="sm">
                    Configurar Template
                  </Button>
                </div>
                <div className="p-4 border rounded-lg">
                  <h4 className="font-medium mb-2">Boletos</h4>
                  <p className="text-sm text-muted-foreground mb-3">Template para impressão de boletos</p>
                  <Button variant="outline" size="sm">
                    Configurar Template
                  </Button>
                </div>
                <div className="p-4 border rounded-lg">
                  <h4 className="font-medium mb-2">Relatórios</h4>
                  <p className="text-sm text-muted-foreground mb-3">Template para impressão de relatórios</p>
                  <Button variant="outline" size="sm">
                    Configurar Template
                  </Button>
                </div>
                <div className="p-4 border rounded-lg">
                  <h4 className="font-medium mb-2">Contratos</h4>
                  <p className="text-sm text-muted-foreground mb-3">Template para impressão de contratos</p>
                  <Button variant="outline" size="sm">
                    Configurar Template
                  </Button>
                </div>
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
