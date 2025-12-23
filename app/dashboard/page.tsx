"use client"

import { useAuth } from "@/contexts/auth-context"
import { StatCard } from "@/components/dashboard/stat-card"
import { QuickActions } from "@/components/dashboard/quick-actions"
import { RecentActivity } from "@/components/dashboard/recent-activity"
import { InteractiveChart } from "@/components/dashboard/interactive-chart"
import { DateRangePicker } from "@/components/dashboard/date-range-picker"
import { useState } from "react"

export default function DashboardPage() {
  const { user } = useAuth()
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

  const quickActions = [
    {
      title: "Novo Segurado",
      description: "Cadastrar novo cliente",
      icon: "Users",
      href: "/dashboard/cadastros/pessoas/novo",
      color: "blue" as const,
    },
    {
      title: "Nova Proposta",
      description: "Criar proposta de seguro",
      icon: "DollarSign",
      href: "/dashboard/propostas/nova",
      color: "green" as const,
    },
    {
      title: "Lançamento Contábil",
      description: "Registrar operação",
      icon: "Clock",
      href: "/dashboard/contabil/lancamentos/novo",
      color: "purple" as const,
    },
    {
      title: "Relatórios ANS",
      description: "Gerar quadros regulatórios",
      icon: "AlertTriangle",
      href: "/dashboard/contabil/quadros-ans",
      color: "orange" as const,
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

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard
          title="Segurados Ativos"
          value={12847}
          format="number"
          trend={{ value: 5.2, isPositive: true }}
          icon="Users"
          color="blue"
        />
        <StatCard
          title="Pagamentos em Dia"
          value={2400000}
          format="currency"
          trend={{ value: 12.1, isPositive: true }}
          icon="DollarSign"
          color="green"
        />
        <StatCard
          title="Pendências"
          value={180000}
          format="currency"
          trend={{ value: 8.3, isPositive: false }}
          icon="Clock"
          color="yellow"
        />
        <StatCard
          title="Inadimplência"
          value={95000}
          format="currency"
          trend={{ value: 15.2, isPositive: true }}
          icon="AlertTriangle"
          color="red"
        />
      </div>

      <div className="bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-950 dark:to-purple-950 p-6 rounded-lg border">
        <h2 className="text-xl font-bold text-foreground mb-4">Sistema Contábil Completo</h2>
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

      <QuickActions actions={quickActions} />
    </div>
  )
}
