import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Bell, Check, Trash2, Settings, AlertCircle, Info, CheckCircle } from "lucide-react"

export default function NotificacoesPage() {
  const notificacoes = [
    {
      id: 1,
      titulo: "Novo sinistro aprovado",
      descricao: "Sinistro SIN-2024-001 foi aprovado para João Silva",
      tipo: "sucesso",
      tempo: "2 min atrás",
      lida: false,
    },
    {
      id: 2,
      titulo: "Pagamento em atraso",
      descricao: "Mensalidade de Carlos Oliveira está 5 dias em atraso",
      tipo: "alerta",
      tempo: "1 hora atrás",
      lida: false,
    },
    {
      id: 3,
      titulo: "Novo segurado cadastrado",
      descricao: "Maria Santos foi cadastrada no plano Premium",
      tipo: "info",
      tempo: "3 horas atrás",
      lida: true,
    },
  ]

  const getIcon = (tipo: string) => {
    switch (tipo) {
      case "sucesso":
        return <CheckCircle className="w-5 h-5 text-green-600" />
      case "alerta":
        return <AlertCircle className="w-5 h-5 text-yellow-600" />
      case "info":
        return <Info className="w-5 h-5 text-blue-600" />
      default:
        return <Bell className="w-5 h-5 text-gray-600" />
    }
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-6 py-6">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-2xl font-bold text-foreground">Notificações</h1>
            <p className="text-muted-foreground">Acompanhe as atualizações do sistema</p>
          </div>
          <div className="flex gap-2">
            <Button variant="outline">
              <Check className="w-4 h-4 mr-2" />
              Marcar Todas como Lidas
            </Button>
            <Button variant="outline">
              <Settings className="w-4 h-4 mr-2" />
              Configurar
            </Button>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-2">
                <Bell className="w-5 h-5 text-blue-600" />
                <div>
                  <p className="text-sm text-muted-foreground">Não Lidas</p>
                  <p className="text-xl font-bold text-blue-600">2</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-2">
                <CheckCircle className="w-5 h-5 text-green-600" />
                <div>
                  <p className="text-sm text-muted-foreground">Lidas Hoje</p>
                  <p className="text-xl font-bold text-green-600">8</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-2">
                <AlertCircle className="w-5 h-5 text-yellow-600" />
                <div>
                  <p className="text-sm text-muted-foreground">Alertas Ativos</p>
                  <p className="text-xl font-bold text-yellow-600">3</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Todas as Notificações</CardTitle>
            <CardDescription>Histórico completo de notificações do sistema</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {notificacoes.map((notificacao) => (
                <div
                  key={notificacao.id}
                  className={`flex items-center justify-between p-4 border rounded-lg hover:bg-muted/50 transition-colors ${
                    !notificacao.lida ? "bg-blue-50/50 border-blue-200" : ""
                  }`}
                >
                  <div className="flex items-center gap-4">
                    {getIcon(notificacao.tipo)}
                    <div>
                      <h3 className="font-medium text-foreground">{notificacao.titulo}</h3>
                      <p className="text-sm text-muted-foreground">{notificacao.descricao}</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-4">
                    <div className="text-right">
                      <p className="text-xs text-muted-foreground">{notificacao.tempo}</p>
                      {!notificacao.lida && (
                        <Badge variant="secondary" className="mt-1">
                          Nova
                        </Badge>
                      )}
                    </div>

                    <div className="flex gap-2">
                      {!notificacao.lida && (
                        <Button variant="ghost" size="sm">
                          <Check className="w-4 h-4" />
                        </Button>
                      )}
                      <Button variant="ghost" size="sm">
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
