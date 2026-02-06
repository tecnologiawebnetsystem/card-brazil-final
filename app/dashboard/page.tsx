"use client"

import { StatCard } from "@/components/dashboard/stat-card"
import { QuickActions } from "@/components/dashboard/quick-actions"
import { RecentActivity } from "@/components/dashboard/recent-activity"
import { InteractiveChart } from "@/components/dashboard/interactive-chart"
import { DateRangePicker } from "@/components/dashboard/date-range-picker"
import { useState } from "react"
import { Users, DollarSign, Clock, AlertTriangle } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Settings, Edit } from "lucide-react"

export default function DashboardPage() {
  const user = {
    name: "Admin Demo",
    email: "admin@cardbrazil.com.br",
    role: "Administrador",
  }

  const [dateRange, setDateRange] = useState({ from: new Date(2024, 0, 1), to: new Date() })

  const chartData = [
    { name: "Jan", value: 4000, comparison: 3800 },
    { name: "Fev", value: 3000, comparison: 2800 },
    { name: "Mar", value: 5000, comparison: 4200 },
    { name: "Abr", value: 4500, comparison: 4000 },
    { name: "Mai", value: 6000, comparison: 5200 },
    { name: "Jun", value: 5500, comparison: 5000 },
  ]

  const activities = [
    {
      id: "1",
      user: "João Silva",
      action: "cadastrou novo segurado",
      timestamp: new Date(Date.now() - 1000 * 60 * 5),
      type: "create" as const,
    },
    {
      id: "2",
      user: "Maria Santos",
      action: "aprovou proposta #1234",
      timestamp: new Date(Date.now() - 1000 * 60 * 15),
      type: "update" as const,
    },
    {
      id: "3",
      user: "Pedro Costa",
      action: "gerou relatório ANS",
      timestamp: new Date(Date.now() - 1000 * 60 * 30),
      type: "info" as const,
    },
  ]

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Dashboard CardBrazil</h1>
          <p className="text-muted-foreground">Sistema de Gestão para Administradora de Seguros de Saúde</p>
        </div>
        <DateRangePicker value={dateRange} onChange={setDateRange} />
      </div>

      <Card className="bg-gradient-to-br from-primary/5 to-accent/5">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-primary">
            <Users className="w-5 h-5" />
            Perfil do Usuário
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-start justify-between">
            <div className="flex items-center gap-4">
              <Avatar className="w-20 h-20">
                <AvatarImage src="/placeholder.svg?height=80&width=80" alt={user.name} />
                <AvatarFallback className="bg-primary text-primary-foreground text-xl">
                  {user.name
                    .split(" ")
                    .map((n) => n[0])
                    .join("")}
                </AvatarFallback>
              </Avatar>
              <div className="space-y-2">
                <div>
                  <h2 className="text-2xl font-bold">{user.name}</h2>
                  <p className="text-muted-foreground">{user.email}</p>
                </div>
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <span className="flex items-center gap-1">
                    <Clock className="w-4 h-4" />
                    Último acesso: Hoje às 14:30
                  </span>
                  <Badge variant="outline" className="bg-success/10 text-success border-success/20">
                    Online
                  </Badge>
                </div>
              </div>
            </div>
            <div className="flex gap-2">
              <Button variant="outline" size="sm">
                <Edit className="w-4 h-4 mr-2" />
                Editar Perfil
              </Button>
              <Button variant="outline" size="sm">
                <Settings className="w-4 h-4 mr-2" />
                Configurações
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard
          title="Segurados Ativos"
          value={12847}
          format="number"
          change={5.2}
          icon={<Users className="h-6 w-6" />}
        />
        <StatCard
          title="Pagamentos em Dia"
          value={2400000}
          format="currency"
          change={12.1}
          icon={<DollarSign className="h-6 w-6" />}
        />
        <StatCard
          title="Pendências"
          value={180000}
          format="currency"
          change={-8.3}
          icon={<Clock className="h-6 w-6" />}
        />
        <StatCard
          title="Inadimplência"
          value={95000}
          format="currency"
          change={-15.2}
          icon={<AlertTriangle className="h-6 w-6" />}
        />
      </div>

      <div className="bg-gradient-to-r from-[#dc2626]/5 to-[#1e3a5f]/10 p-6 rounded-lg border border-[#262626]">
        <h2 className="text-xl font-bold text-foreground mb-4">Sistema Contabil Completo</h2>
        <p className="text-muted-foreground mb-4">
          Acesse todas as funcionalidades contábeis específicas para administradoras de seguros de saúde
        </p>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="bg-card p-4 rounded-lg shadow-sm">
            <h3 className="font-medium text-sm">Plano de Contas</h3>
            <p className="text-xs text-muted-foreground">Gestão completa</p>
          </div>
          <div className="bg-card p-4 rounded-lg shadow-sm">
            <h3 className="font-medium text-sm">Lançamentos</h3>
            <p className="text-xs text-muted-foreground">Partidas dobradas</p>
          </div>
          <div className="bg-card p-4 rounded-lg shadow-sm">
            <h3 className="font-medium text-sm">Quadros ANS</h3>
            <p className="text-xs text-muted-foreground">Conformidade total</p>
          </div>
          <div className="bg-card p-4 rounded-lg shadow-sm">
            <h3 className="font-medium text-sm">Divergências ERP</h3>
            <p className="text-xs text-muted-foreground">Análise automática</p>
          </div>
        </div>
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        <InteractiveChart
          title="Receita Mensal"
          data={chartData}
          type="bar"
          dataKeys={[
            { key: "value", label: "Receita Atual", color: "#3b82f6" },
            { key: "comparison", label: "Período Anterior", color: "#94a3b8" },
          ]}
        />
        <RecentActivity activities={activities} />
      </div>

      <QuickActions />
    </div>
  )
}
