"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { toast } from "sonner"
import { Palette, Upload, Save } from "lucide-react"


const UploadIcon = ({ className = "w-4 h-4" }: { className?: string }) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"
    />
  </svg>
)

export default function ConfiguracoesPersonalizacaoPage() {
  const [customSettings, setCustomSettings] = useState({
    companyName: "CardBrazil CRM",
    primaryColor: "#059669",
    secondaryColor: "#0f766e",
    accentColor: "#06b6d4",
    enableCustomTheme: true,
    showCompanyLogo: true,
    enableBranding: true,
    customFavicon: true,
  })

  const handleSave = () => {
    toast.success("Configurações de personalização salvas com sucesso!")
  }

  const handleLogoUpload = () => {
    toast.success("Logo carregado com sucesso!")
  }

  const handleFaviconUpload = () => {
    toast.success("Favicon carregado com sucesso!")
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="mx-auto max-w-7xl px-6 py-8">
        <div className="mb-8 flex items-start gap-4">
          <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary ring-1 ring-primary/15"><Palette className="h-6 w-6" /></div>
          <div><p className="mb-1 text-xs font-semibold uppercase tracking-[0.18em] text-primary">Administração do sistema</p><h1 className="text-3xl font-bold tracking-tight text-foreground">Personalização</h1><p className="mt-1 text-muted-foreground">Customize a aparência e a identidade visual do sistema.</p></div>
        </div>

        <div className="space-y-6">
          <Card className="overflow-hidden border-border shadow-sm">
            <CardHeader className="border-b border-border/70 bg-muted/30 px-6 py-5">
              <CardTitle>Identidade Visual</CardTitle>
              <CardDescription>Configure a marca e logotipos da empresa</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6 p-6">
              <div className="space-y-2">
                <Label htmlFor="company-name">Nome da Empresa</Label>
                <Input
                  id="company-name"
                  value={customSettings.companyName}
                  onChange={(e) => setCustomSettings({ ...customSettings, companyName: e.target.value })}
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold">Logo da Empresa</h3>
                  <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
                    <div className="w-20 h-20 mx-auto mb-4 bg-primary/10 rounded-lg flex items-center justify-center">
                      <span className="text-primary font-bold text-xl">CB</span>
                    </div>
                    <p className="text-sm text-muted-foreground mb-4">Logo atual: 200x80px</p>
                    <Button onClick={handleLogoUpload} variant="outline" size="sm">
                      <Upload className="mr-2 h-4 w-4" />
                      Alterar Logo
                    </Button>
                  </div>
                </div>

                <div className="space-y-4">
                  <h3 className="text-lg font-semibold">Favicon</h3>
                  <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
                    <div className="w-16 h-16 mx-auto mb-4 bg-primary rounded-lg flex items-center justify-center">
                      <span className="text-white font-bold">CB</span>
                    </div>
                    <p className="text-sm text-muted-foreground mb-4">Favicon atual: 32x32px</p>
                    <Button onClick={handleFaviconUpload} variant="outline" size="sm">
                      <Upload className="mr-2 h-4 w-4" />
                      Alterar Favicon
                    </Button>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="overflow-hidden border-border shadow-sm">
            <CardHeader className="border-b border-border/70 bg-muted/30 px-6 py-5">
              <CardTitle>Cores do Sistema</CardTitle>
              <CardDescription>Configure as cores principais da interface</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6 p-6">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="primary-color">Cor Primária</Label>
                  <div className="flex gap-2">
                    <Input
                      id="primary-color"
                      type="color"
                      value={customSettings.primaryColor}
                      onChange={(e) => setCustomSettings({ ...customSettings, primaryColor: e.target.value })}
                      className="w-16 h-10 p-1 border rounded"
                    />
                    <Input
                      value={customSettings.primaryColor}
                      onChange={(e) => setCustomSettings({ ...customSettings, primaryColor: e.target.value })}
                      className="flex-1"
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="secondary-color">Cor Secundária</Label>
                  <div className="flex gap-2">
                    <Input
                      id="secondary-color"
                      type="color"
                      value={customSettings.secondaryColor}
                      onChange={(e) => setCustomSettings({ ...customSettings, secondaryColor: e.target.value })}
                      className="w-16 h-10 p-1 border rounded"
                    />
                    <Input
                      value={customSettings.secondaryColor}
                      onChange={(e) => setCustomSettings({ ...customSettings, secondaryColor: e.target.value })}
                      className="flex-1"
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="accent-color">Cor de Destaque</Label>
                  <div className="flex gap-2">
                    <Input
                      id="accent-color"
                      type="color"
                      value={customSettings.accentColor}
                      onChange={(e) => setCustomSettings({ ...customSettings, accentColor: e.target.value })}
                      className="w-16 h-10 p-1 border rounded"
                    />
                    <Input
                      value={customSettings.accentColor}
                      onChange={(e) => setCustomSettings({ ...customSettings, accentColor: e.target.value })}
                      className="flex-1"
                    />
                  </div>
                </div>
              </div>

              <div className="p-4 border rounded-lg bg-muted/50">
                <h4 className="font-medium mb-2">Pré-visualização</h4>
                <div className="flex gap-2">
                  <div className="w-8 h-8 rounded" style={{ backgroundColor: customSettings.primaryColor }}></div>
                  <div className="w-8 h-8 rounded" style={{ backgroundColor: customSettings.secondaryColor }}></div>
                  <div className="w-8 h-8 rounded" style={{ backgroundColor: customSettings.accentColor }}></div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="overflow-hidden border-border shadow-sm">
            <CardHeader className="border-b border-border/70 bg-muted/30 px-6 py-5">
              <CardTitle>Opções de Personalização</CardTitle>
              <CardDescription>Configure as opções avançadas de personalização</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between p-4 border rounded-lg">
                <div>
                  <h4 className="font-medium">Tema Personalizado</h4>
                  <p className="text-sm text-muted-foreground">Aplicar cores personalizadas ao sistema</p>
                </div>
                <Switch
                  checked={customSettings.enableCustomTheme}
                  onCheckedChange={(checked) => setCustomSettings({ ...customSettings, enableCustomTheme: checked })}
                />
              </div>
              <div className="flex items-center justify-between p-4 border rounded-lg">
                <div>
                  <h4 className="font-medium">Exibir Logo da Empresa</h4>
                  <p className="text-sm text-muted-foreground">Mostrar logo da empresa no cabeçalho</p>
                </div>
                <Switch
                  checked={customSettings.showCompanyLogo}
                  onCheckedChange={(checked) => setCustomSettings({ ...customSettings, showCompanyLogo: checked })}
                />
              </div>
              <div className="flex items-center justify-between p-4 border rounded-lg">
                <div>
                  <h4 className="font-medium">Branding Personalizado</h4>
                  <p className="text-sm text-muted-foreground">Aplicar identidade visual em relatórios e documentos</p>
                </div>
                <Switch
                  checked={customSettings.enableBranding}
                  onCheckedChange={(checked) => setCustomSettings({ ...customSettings, enableBranding: checked })}
                />
              </div>
              <div className="flex items-center justify-between p-4 border rounded-lg">
                <div>
                  <h4 className="font-medium">Favicon Personalizado</h4>
                  <p className="text-sm text-muted-foreground">Usar favicon personalizado da empresa</p>
                </div>
                <Switch
                  checked={customSettings.customFavicon}
                  onCheckedChange={(checked) => setCustomSettings({ ...customSettings, customFavicon: checked })}
                />
              </div>
            </CardContent>
          </Card>

          <Card className="overflow-hidden border-border shadow-sm">
            <CardHeader className="border-b border-border/70 bg-muted/30 px-6 py-5">
              <CardTitle>Temas Predefinidos</CardTitle>
              <CardDescription>Escolha entre temas predefinidos para aplicar rapidamente</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="p-4 border rounded-lg cursor-pointer hover:bg-muted/50">
                  <div className="flex gap-2 mb-2">
                    <div className="w-4 h-4 rounded bg-primary"></div>
                    <div className="w-4 h-4 rounded bg-emerald-700"></div>
                    <div className="w-4 h-4 rounded bg-cyan-600"></div>
                  </div>
                  <h4 className="font-medium">CardBrazil (Padrão)</h4>
                  <p className="text-sm text-muted-foreground">Verde esmeralda e ciano</p>
                </div>
                <div className="p-4 border rounded-lg cursor-pointer hover:bg-muted/50">
                  <div className="flex gap-2 mb-2">
                    <div className="w-4 h-4 rounded bg-blue-600"></div>
                    <div className="w-4 h-4 rounded bg-blue-700"></div>
                    <div className="w-4 h-4 rounded bg-indigo-600"></div>
                  </div>
                  <h4 className="font-medium">Corporativo</h4>
                  <p className="text-sm text-muted-foreground">Azul e índigo</p>
                </div>
                <div className="p-4 border rounded-lg cursor-pointer hover:bg-muted/50">
                  <div className="flex gap-2 mb-2">
                    <div className="w-4 h-4 rounded bg-purple-600"></div>
                    <div className="w-4 h-4 rounded bg-purple-700"></div>
                    <div className="w-4 h-4 rounded bg-pink-600"></div>
                  </div>
                  <h4 className="font-medium">Moderno</h4>
                  <p className="text-sm text-muted-foreground">Roxo e rosa</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Button onClick={handleSave}>
            <Save className="mr-2 h-4 w-4" />
            Salvar configurações
          </Button>
        </div>
      </div>
    </div>
  )
}
