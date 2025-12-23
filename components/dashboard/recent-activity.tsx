import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { CreditCard, UserPlus, AlertTriangle, CheckCircle, Clock, FileText } from "lucide-react"

export function RecentActivity() {
  const activities = [
    {
      id: 1,
      type: "payment",
      title: "Pagamento recebido",
      description: "João Silva - Plano Premium",
      amount: "R$ 450,00",
      time: "2 min atrás",
      icon: CreditCard,
      status: "success",
    },
    {
      id: 2,
      type: "new_user",
      title: "Novo segurado",
      description: "Maria Santos cadastrada no sistema",
      time: "15 min atrás",
      icon: UserPlus,
      status: "info",
    },
    {
      id: 3,
      type: "claim",
      title: "Sinistro reportado",
      description: "Carlos Oliveira - Consulta cardiológica",
      amount: "R$ 280,00",
      time: "1 hora atrás",
      icon: FileText,
      status: "warning",
    },
    {
      id: 4,
      type: "overdue",
      title: "Pagamento em atraso",
      description: "Ana Costa - Plano Básico",
      amount: "R$ 180,00",
      time: "2 horas atrás",
      icon: AlertTriangle,
      status: "error",
    },
    {
      id: 5,
      type: "approval",
      title: "Sinistro aprovado",
      description: "Pedro Lima - Exame de sangue",
      amount: "R$ 120,00",
      time: "3 horas atrás",
      icon: CheckCircle,
      status: "success",
    },
    {
      id: 6,
      type: "pending",
      title: "Análise pendente",
      description: "Lucia Ferreira - Cirurgia eletiva",
      time: "4 horas atrás",
      icon: Clock,
      status: "warning",
    },
  ]

  const getStatusColor = (status: string) => {
    switch (status) {
      case "success":
        return "text-green-600 bg-green-50"
      case "error":
        return "text-red-600 bg-red-50"
      case "warning":
        return "text-yellow-600 bg-yellow-50"
      case "info":
        return "text-blue-600 bg-blue-50"
      default:
        return "text-gray-600 bg-gray-50"
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Atividades Recentes</CardTitle>
        <CardDescription>Últimas movimentações do sistema</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {activities.map((activity) => {
            const Icon = activity.icon
            return (
              <div
                key={activity.id}
                className="flex items-start gap-4 p-3 rounded-lg hover:bg-muted/50 transition-colors"
              >
                <div
                  className={`w-10 h-10 rounded-lg flex items-center justify-center ${getStatusColor(activity.status)}`}
                >
                  <Icon className="w-5 h-5" />
                </div>

                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between">
                    <h4 className="font-medium text-card-foreground truncate">{activity.title}</h4>
                    {activity.amount && (
                      <span className="text-sm font-medium text-card-foreground">{activity.amount}</span>
                    )}
                  </div>
                  <p className="text-sm text-muted-foreground truncate">{activity.description}</p>
                  <p className="text-xs text-muted-foreground mt-1">{activity.time}</p>
                </div>
              </div>
            )
          })}
        </div>
      </CardContent>
    </Card>
  )
}
