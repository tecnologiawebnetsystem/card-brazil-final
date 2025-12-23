"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Switch } from "@/components/ui/switch"
import { Badge } from "@/components/ui/badge"
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

export default function ConfiguracoesPermissoesPage() {
  const [selectedRole, setSelectedRole] = useState("admin")
  const [permissions, setPermissions] = useState({
    admin: {
      cadastros: { read: true, write: true, delete: true },
      propostas: { read: true, write: true, delete: true },
      beneficiarios: { read: true, write: true, delete: true },
      cobrancas: { read: true, write: true, delete: true },
      relatorios: { read: true, write: true, delete: true },
      configuracoes: { read: true, write: true, delete: true },
      sistema: { read: true, write: true, delete: true },
    },
    operador: {
      cadastros: { read: true, write: true, delete: false },
      propostas: { read: true, write: true, delete: false },
      beneficiarios: { read: true, write: true, delete: false },
      cobrancas: { read: true, write: true, delete: false },
      relatorios: { read: true, write: false, delete: false },
      configuracoes: { read: false, write: false, delete: false },
      sistema: { read: false, write: false, delete: false },
    },
    consulta: {
      cadastros: { read: true, write: false, delete: false },
      propostas: { read: true, write: false, delete: false },
      beneficiarios: { read: true, write: false, delete: false },
      cobrancas: { read: true, write: false, delete: false },
      relatorios: { read: true, write: false, delete: false },
      configuracoes: { read: false, write: false, delete: false },
      sistema: { read: false, write: false, delete: false },
    },
  })

  const modules = [
    { key: "cadastros", name: "Cadastros", description: "Gerenciar cadastros de clientes, corretores, etc." },
    { key: "propostas", name: "Propostas", description: "Criar e gerenciar propostas de seguros" },
    { key: "beneficiarios", name: "Beneficiários", description: "Gerenciar beneficiários dos seguros" },
    { key: "cobrancas", name: "Cobranças", description: "Controlar cobranças e pagamentos" },
    { key: "relatorios", name: "Relatórios", description: "Visualizar e gerar relatórios" },
    { key: "configuracoes", name: "Configurações", description: "Configurar sistema e preferências" },
    { key: "sistema", name: "Sistema", description: "Administração geral do sistema" },
  ]

  const roles = [
    { value: "admin", name: "Administrador", color: "bg-red-100 text-red-800" },
    { value: "operador", name: "Operador", color: "bg-blue-100 text-blue-800" },
    { value: "consulta", name: "Consulta", color: "bg-green-100 text-green-800" },
  ]

  const handlePermissionChange = (module: string, permission: string, value: boolean) => {
    setPermissions((prev) => ({
      ...prev,
      [selectedRole]: {
        ...prev[selectedRole as keyof typeof prev],
        [module]: {
          ...prev[selectedRole as keyof typeof prev][module as keyof (typeof prev)[typeof selectedRole]],
          [permission]: value,
        },
      },
    }))
  }

  const handleSave = () => {
    toast.success("Permissões salvas com sucesso!")
  }

  const currentPermissions = permissions[selectedRole as keyof typeof permissions]

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-6 py-6">
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-foreground">Permissões de Usuários</h1>
          <p className="text-muted-foreground">Configure as permissões por perfil de usuário</p>
        </div>

        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Selecionar Perfil</CardTitle>
              <CardDescription>Escolha o perfil para configurar as permissões</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex gap-4">
                {roles.map((role) => (
                  <div
                    key={role.value}
                    className={`p-4 border rounded-lg cursor-pointer transition-colors ${
                      selectedRole === role.value ? "border-emerald-500 bg-emerald-50" : "hover:bg-muted/50"
                    }`}
                    onClick={() => setSelectedRole(role.value)}
                  >
                    <Badge className={role.color}>{role.name}</Badge>
                    <p className="text-sm text-muted-foreground mt-2">
                      {role.value === "admin" && "Acesso total ao sistema"}
                      {role.value === "operador" && "Acesso operacional limitado"}
                      {role.value === "consulta" && "Apenas visualização"}
                    </p>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Permissões para {roles.find((r) => r.value === selectedRole)?.name}</CardTitle>
              <CardDescription>Configure as permissões específicas para este perfil</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                {modules.map((module) => (
                  <div key={module.key} className="border rounded-lg p-4">
                    <div className="flex items-center justify-between mb-4">
                      <div>
                        <h4 className="font-medium">{module.name}</h4>
                        <p className="text-sm text-muted-foreground">{module.description}</p>
                      </div>
                    </div>

                    <div className="grid grid-cols-3 gap-4">
                      <div className="flex items-center justify-between p-3 border rounded">
                        <div>
                          <span className="font-medium text-sm">Visualizar</span>
                          <p className="text-xs text-muted-foreground">Pode ver os dados</p>
                        </div>
                        <Switch
                          checked={currentPermissions[module.key as keyof typeof currentPermissions]?.read || false}
                          onCheckedChange={(checked) => handlePermissionChange(module.key, "read", checked)}
                        />
                      </div>

                      <div className="flex items-center justify-between p-3 border rounded">
                        <div>
                          <span className="font-medium text-sm">Editar</span>
                          <p className="text-xs text-muted-foreground">Pode modificar</p>
                        </div>
                        <Switch
                          checked={currentPermissions[module.key as keyof typeof currentPermissions]?.write || false}
                          onCheckedChange={(checked) => handlePermissionChange(module.key, "write", checked)}
                        />
                      </div>

                      <div className="flex items-center justify-between p-3 border rounded">
                        <div>
                          <span className="font-medium text-sm">Excluir</span>
                          <p className="text-xs text-muted-foreground">Pode remover</p>
                        </div>
                        <Switch
                          checked={currentPermissions[module.key as keyof typeof currentPermissions]?.delete || false}
                          onCheckedChange={(checked) => handlePermissionChange(module.key, "delete", checked)}
                        />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Resumo de Permissões</CardTitle>
              <CardDescription>Visão geral das permissões configuradas</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {roles.map((role) => (
                  <div key={role.value} className="p-4 border rounded-lg">
                    <Badge className={role.color + " mb-2"}>{role.name}</Badge>
                    <div className="space-y-2">
                      {modules.map((module) => {
                        const rolePermissions = permissions[role.value as keyof typeof permissions]
                        const modulePermissions = rolePermissions[module.key as keyof typeof rolePermissions]
                        const permissionCount = Object.values(modulePermissions || {}).filter(Boolean).length

                        return (
                          <div key={module.key} className="flex justify-between text-sm">
                            <span>{module.name}</span>
                            <span className="text-muted-foreground">{permissionCount}/3</span>
                          </div>
                        )
                      })}
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          <Button onClick={handleSave} className="bg-emerald-700 hover:bg-emerald-800">
            <SaveIcon className="w-4 h-4 mr-2" />
            Salvar Permissões
          </Button>
        </div>
      </div>
    </div>
  )
}
