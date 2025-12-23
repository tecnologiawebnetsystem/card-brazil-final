"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import {
  BarChart,
  Bar,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts"
import { cn } from "@/lib/utils"

interface ChartData {
  name: string
  [key: string]: string | number
}

interface InteractiveChartProps {
  title: string
  data: ChartData[]
  type?: "bar" | "line"
  dataKeys: { key: string; label: string; color: string }[]
  className?: string
}

export function InteractiveChart({ title, data, type = "bar", dataKeys, className }: InteractiveChartProps) {
  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="rounded-lg border bg-background p-3 shadow-md">
          <p className="font-medium mb-2">{label}</p>
          {payload.map((entry: any, index: number) => (
            <p key={index} className="text-sm" style={{ color: entry.color }}>
              {entry.name}: {entry.value.toLocaleString("pt-BR")}
            </p>
          ))}
        </div>
      )
    }
    return null
  }

  return (
    <Card className={cn(className)}>
      <CardHeader>
        <CardTitle>{title}</CardTitle>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={300}>
          {type === "bar" ? (
            <BarChart data={data}>
              <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
              <XAxis dataKey="name" className="text-xs" />
              <YAxis className="text-xs" />
              <Tooltip content={<CustomTooltip />} />
              <Legend />
              {dataKeys.map((dataKey) => (
                <Bar
                  key={dataKey.key}
                  dataKey={dataKey.key}
                  name={dataKey.label}
                  fill={dataKey.color}
                  radius={[4, 4, 0, 0]}
                />
              ))}
            </BarChart>
          ) : (
            <LineChart data={data}>
              <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
              <XAxis dataKey="name" className="text-xs" />
              <YAxis className="text-xs" />
              <Tooltip content={<CustomTooltip />} />
              <Legend />
              {dataKeys.map((dataKey) => (
                <Line
                  key={dataKey.key}
                  type="monotone"
                  dataKey={dataKey.key}
                  name={dataKey.label}
                  stroke={dataKey.color}
                  strokeWidth={2}
                  dot={{ r: 4 }}
                  activeDot={{ r: 6 }}
                />
              ))}
            </LineChart>
          )}
        </ResponsiveContainer>
      </CardContent>
    </Card>
  )
}
