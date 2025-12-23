"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  LineChart,
  Line,
} from "recharts"

const monthlyData = [
  { month: "Jan", pagos: 2400, pendentes: 180, inadimplentes: 95 },
  { month: "Fev", pagos: 2200, pendentes: 200, inadimplentes: 120 },
  { month: "Mar", pagos: 2600, pendentes: 150, inadimplentes: 80 },
  { month: "Abr", pagos: 2800, pendentes: 170, inadimplentes: 90 },
  { month: "Mai", pagos: 2400, pendentes: 180, inadimplentes: 95 },
  { month: "Jun", pagos: 2700, pendentes: 160, inadimplentes: 85 },
]

const planDistribution = [
  { name: "Básico", value: 35, color: "#8B9A6B" },
  { name: "Intermediário", value: 45, color: "#A3C6A5" },
  { name: "Premium", value: 20, color: "#6B8A7A" },
]

const bankingFilesData = [
  { type: "Remessa Enviada", jan: 45, fev: 52, mar: 48, abr: 55, mai: 50, jun: 58 },
  { type: "Retorno Processado", jan: 42, fev: 48, mar: 45, abr: 52, mai: 47, jun: 55 },
  { type: "Arquivos Rejeitados", jan: 3, fev: 4, mar: 3, abr: 3, mai: 3, jun: 3 },
  { type: "Conciliação Automática", jan: 39, fev: 44, mar: 42, abr: 49, mai: 44, jun: 52 },
]

export function ChartsSection() {
  return (
    <div className="grid lg:grid-cols-3 gap-6">
      {/* Revenue Chart */}
      <Card className="lg:col-span-2">
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            Receitas vs Pendências
            <Badge variant="secondary">Últimos 6 meses</Badge>
          </CardTitle>
          <CardDescription>Comparativo mensal de pagamentos, pendências e inadimplência</CardDescription>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={monthlyData}>
              <CartesianGrid strokeDasharray="3 3" className="opacity-30" />
              <XAxis dataKey="month" />
              <YAxis />
              <Bar dataKey="pagos" fill="#8B9A6B" name="Pagos" radius={[2, 2, 0, 0]} />
              <Bar dataKey="pendentes" fill="#A3C6A5" name="Pendentes" radius={[2, 2, 0, 0]} />
              <Bar dataKey="inadimplentes" fill="#d97706" name="Inadimplentes" radius={[2, 2, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      {/* Plan Distribution */}
      <Card>
        <CardHeader>
          <CardTitle>Distribuição de Planos</CardTitle>
          <CardDescription>Percentual por tipo de plano</CardDescription>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={200}>
            <PieChart>
              <Pie
                data={planDistribution}
                cx="50%"
                cy="50%"
                innerRadius={40}
                outerRadius={80}
                paddingAngle={5}
                dataKey="value"
              >
                {planDistribution.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
            </PieChart>
          </ResponsiveContainer>
          <div className="space-y-2 mt-4">
            {planDistribution.map((plan, index) => (
              <div key={index} className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full" style={{ backgroundColor: plan.color }} />
                  <span className="text-sm text-muted-foreground">{plan.name}</span>
                </div>
                <span className="text-sm font-medium">{plan.value}%</span>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Processamento de Arquivos Bancários */}
      <Card className="lg:col-span-3">
        <CardHeader>
          <CardTitle>Processamento de Arquivos Bancários</CardTitle>
          <CardDescription>Volume de arquivos de remessa e retorno processados nos últimos 6 meses</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {bankingFilesData.map((fileType, index) => (
              <div key={index} className="space-y-2">
                <h4 className="font-medium text-card-foreground">{fileType.type}</h4>
                <ResponsiveContainer width="100%" height={100}>
                  <LineChart
                    data={[
                      { month: "Jan", value: fileType.jan },
                      { month: "Fev", value: fileType.fev },
                      { month: "Mar", value: fileType.mar },
                      { month: "Abr", value: fileType.abr },
                      { month: "Mai", value: fileType.mai },
                      { month: "Jun", value: fileType.jun },
                    ]}
                  >
                    <Line type="monotone" dataKey="value" stroke="#8B9A6B" strokeWidth={2} dot={false} />
                  </LineChart>
                </ResponsiveContainer>
                <p className="text-sm text-muted-foreground">
                  Total: {fileType.jan + fileType.fev + fileType.mar + fileType.abr + fileType.mai + fileType.jun}
                </p>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
