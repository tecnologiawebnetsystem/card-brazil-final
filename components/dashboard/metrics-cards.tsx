import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { TrendingUp, TrendingDown, Users, AlertTriangle, CheckCircle, Clock } from "lucide-react"

export function MetricsCards() {
  const metrics = [
    {
      title: "Segurados Ativos",
      value: "12,847",
      change: "+5.2%",
      trend: "up",
      icon: Users,
      color: "text-blue-600",
      bgColor: "bg-blue-50",
    },
    {
      title: "Pagamentos em Dia",
      value: "R$ 2.4M",
      change: "+12.1%",
      trend: "up",
      icon: CheckCircle,
      color: "text-green-600",
      bgColor: "bg-green-50",
    },
    {
      title: "Pendências",
      value: "R$ 180K",
      change: "-8.3%",
      trend: "down",
      icon: Clock,
      color: "text-yellow-600",
      bgColor: "bg-yellow-50",
    },
    {
      title: "Inadimplência",
      value: "R$ 95K",
      change: "-15.2%",
      trend: "down",
      icon: AlertTriangle,
      color: "text-red-600",
      bgColor: "bg-red-50",
    },
  ]

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      {metrics.map((metric, index) => {
        const Icon = metric.icon
        const TrendIcon = metric.trend === "up" ? TrendingUp : TrendingDown

        return (
          <Card key={index} className="hover:shadow-md transition-shadow">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">{metric.title}</CardTitle>
              <div className={`w-10 h-10 rounded-lg ${metric.bgColor} flex items-center justify-center`}>
                <Icon className={`w-5 h-5 ${metric.color}`} />
              </div>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between">
                <div>
                  <div className="text-2xl font-bold text-card-foreground">{metric.value}</div>
                  <div className="flex items-center gap-1 mt-1">
                    <TrendIcon className={`w-3 h-3 ${metric.trend === "up" ? "text-green-600" : "text-red-600"}`} />
                    <span
                      className={`text-xs font-medium ${metric.trend === "up" ? "text-green-600" : "text-red-600"}`}
                    >
                      {metric.change}
                    </span>
                    <span className="text-xs text-muted-foreground">vs mês anterior</span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        )
      })}
    </div>
  )
}
