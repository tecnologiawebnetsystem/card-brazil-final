"use client"

import { useState } from "react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { toast } from "sonner"

const BuildingIcon = () => (
  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"
    />
  </svg>
)

const UserIcon = () => (
  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
    />
  </svg>
)

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

const UploadIcon = () => (
  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"
    />
  </svg>
)

const EditIcon = () => (
  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
    />
  </svg>
)

export function ConfigurationTabs() {
  const [showEditProfile, setShowEditProfile] = useState(false)
  const [userSettings, setUserSettings] = useState({
    theme: "light",
    language: "pt-br",
    notifications: true,
    emailNotifications: true,
    smsNotifications: false,
    autoSave: true,
    compactView: false,
  })

  const handleSaveUserSettings = () => {
    toast.success("Configurações salvas com sucesso!")
  }

  const handleEditProfile = () => {
    setShowEditProfile(true)
  }

  const handleSaveProfile = () => {
    setShowEditProfile(false)
    toast.success("Perfil atualizado com sucesso!")
  }

  return (
    <Tabs defaultValue="configuracoes" className="space-y-6">
      <TabsList className="grid w-full grid-cols-2">
        <TabsTrigger value="configuracoes" className="flex items-center gap-2">
          <BuildingIcon />
          Configurações
        </TabsTrigger>
        <TabsTrigger value="perfil" className="flex items-center gap-2">
          <UserIcon />
          Perfil
        </TabsTrigger>
      </TabsList>

      <TabsContent value="configuracoes" className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle>Configurações Pessoais</CardTitle>
            <CardDescription>Configure suas preferências pessoais do sistema</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-4">
              <h3 className="text-lg font-semibold">Aparência</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="tema">Tema</Label>
                  <Select
                    value={userSettings.theme}
                    onValueChange={(value) => setUserSettings({ ...userSettings, theme: value })}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="light">Claro</SelectItem>
                      <SelectItem value="dark">Escuro</SelectItem>
                      <SelectItem value="system">Automático (Sistema)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="idioma">Idioma</Label>
                  <Select
                    value={userSettings.language}
                    onValueChange={(value) => setUserSettings({ ...userSettings, language: value })}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="pt-br">Português (Brasil)</SelectItem>
                      <SelectItem value="en">English</SelectItem>
                      <SelectItem value="es">Español</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </div>

            <div className="space-y-4 border-t pt-6">
              <h3 className="text-lg font-semibold">Notificações</h3>
              <div className="space-y-4">
                <div className="flex items-center justify-between p-4 border rounded-lg">
                  <div>
                    <h4 className="font-medium">Notificações do Sistema</h4>
                    <p className="text-sm text-muted-foreground">Receber notificações gerais do sistema</p>
                  </div>
                  <Switch
                    checked={userSettings.notifications}
                    onCheckedChange={(checked) => setUserSettings({ ...userSettings, notifications: checked })}
                  />
                </div>
                <div className="flex items-center justify-between p-4 border rounded-lg">
                  <div>
                    <h4 className="font-medium">Notificações por Email</h4>
                    <p className="text-sm text-muted-foreground">Receber notificações por email</p>
                  </div>
                  <Switch
                    checked={userSettings.emailNotifications}
                    onCheckedChange={(checked) => setUserSettings({ ...userSettings, emailNotifications: checked })}
                  />
                </div>
                <div className="flex items-center justify-between p-4 border rounded-lg">
                  <div>
                    <h4 className="font-medium">Notificações por SMS</h4>
                    <p className="text-sm text-muted-foreground">Receber notificações por SMS</p>
                  </div>
                  <Switch
                    checked={userSettings.smsNotifications}
                    onCheckedChange={(checked) => setUserSettings({ ...userSettings, smsNotifications: checked })}
                  />
                </div>
              </div>
            </div>

            <div className="space-y-4 border-t pt-6">
              <h3 className="text-lg font-semibold">Preferências de Interface</h3>
              <div className="space-y-4">
                <div className="flex items-center justify-between p-4 border rounded-lg">
                  <div>
                    <h4 className="font-medium">Salvamento Automático</h4>
                    <p className="text-sm text-muted-foreground">Salvar automaticamente as alterações</p>
                  </div>
                  <Switch
                    checked={userSettings.autoSave}
                    onCheckedChange={(checked) => setUserSettings({ ...userSettings, autoSave: checked })}
                  />
                </div>
                <div className="flex items-center justify-between p-4 border rounded-lg">
                  <div>
                    <h4 className="font-medium">Visualização Compacta</h4>
                    <p className="text-sm text-muted-foreground">Usar layout mais compacto nas listas</p>
                  </div>
                  <Switch
                    checked={userSettings.compactView}
                    onCheckedChange={(checked) => setUserSettings({ ...userSettings, compactView: checked })}
                  />
                </div>
              </div>
            </div>

            <Button onClick={handleSaveUserSettings} className="bg-emerald-700 hover:bg-emerald-800">
              <SaveIcon className="w-4 h-4 mr-2" />
              Salvar Configurações
            </Button>
          </CardContent>
        </Card>
      </TabsContent>

      <TabsContent value="perfil" className="space-y-6">
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle>Informações Pessoais</CardTitle>
                <CardDescription>Visualize e edite suas informações de perfil</CardDescription>
              </div>
              <Button variant="outline" onClick={handleEditProfile} className="flex items-center gap-2 bg-transparent">
                <EditIcon />
                Editar Perfil
              </Button>
            </div>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="flex items-center gap-6">
              <Avatar className="w-20 h-20">
                <AvatarImage src="/professional-avatar.png" />
                <AvatarFallback>AD</AvatarFallback>
              </Avatar>
              <div className="space-y-2">
                <h3 className="text-lg font-semibold">Administrador Talent Health</h3>
                <p className="text-sm text-muted-foreground">admin@talenthealth.com.br</p>
                <p className="text-sm text-muted-foreground">Administrador do Sistema</p>
              </div>
            </div>

            {showEditProfile && (
              <div className="space-y-6 border-t pt-6">
                <h3 className="text-lg font-semibold">Editar Informações</h3>

                <div className="flex items-center gap-6">
                  <Avatar className="w-20 h-20">
                    <AvatarImage src="/professional-avatar.png" />
                    <AvatarFallback>AD</AvatarFallback>
                  </Avatar>
                  <div className="space-y-2">
                    <Button variant="outline" size="sm">
                      <UploadIcon className="w-4 h-4 mr-2" />
                      Alterar Foto
                    </Button>
                    <p className="text-sm text-muted-foreground">JPG, PNG até 2MB</p>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label htmlFor="nome">Nome Completo</Label>
                    <Input id="nome" defaultValue="Administrador Talent Health" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="cargo">Cargo</Label>
                    <Input id="cargo" defaultValue="Administrador do Sistema" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="email-perfil">Email</Label>
                    <Input id="email-perfil" defaultValue="admin@talenthealth.com.br" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="telefone-perfil">Telefone</Label>
                    <Input id="telefone-perfil" defaultValue="(11) 99999-9999" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="departamento">Departamento</Label>
                    <Select defaultValue="ti">
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="ti">Tecnologia da Informação</SelectItem>
                        <SelectItem value="financeiro">Financeiro</SelectItem>
                        <SelectItem value="operacoes">Operações</SelectItem>
                        <SelectItem value="comercial">Comercial</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="nivel-acesso">Nível de Acesso</Label>
                    <Select defaultValue="admin" disabled>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="admin">Administrador</SelectItem>
                        <SelectItem value="operador">Operador</SelectItem>
                        <SelectItem value="consulta">Consulta</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="flex gap-2">
                  <Button onClick={handleSaveProfile} className="bg-emerald-700 hover:bg-emerald-800">
                    <SaveIcon className="w-4 h-4 mr-2" />
                    Salvar Alterações
                  </Button>
                  <Button variant="outline" onClick={() => setShowEditProfile(false)}>
                    Cancelar
                  </Button>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </TabsContent>
    </Tabs>
  )
}
