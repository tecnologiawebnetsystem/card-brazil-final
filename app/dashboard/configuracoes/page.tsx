import { ConfigurationTabs } from "@/components/dashboard/configuration-tabs"

export default function ConfiguracoesPage() {
  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-6 py-6">
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-foreground">Configurações</h1>
          <p className="text-muted-foreground">Gerencie as configurações do sistema e da sua conta</p>
        </div>

        <ConfigurationTabs />
      </div>
    </div>
  )
}
