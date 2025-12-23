"use client"

import type React from "react"

import { Card, CardContent } from "@/components/ui/card"
import { cn } from "@/lib/utils"
import { TrendingUp, TrendingDown, Minus } from "lucide-react"
import { AnimatedCounter } from "@/components/feedback/animated-counter"

interface StatCardProps {
  title: string
  value: number
  change?: number
  changeLabel?: string
  icon?: React.ReactNode
  format?: "number" | "currency" | "percentage"
  className?: string
}

export function StatCard({ title, value, change, changeLabel, icon, format = "number", className }: StatCardProps) {
  const formatValue = (val: number) => {
    switch (format) {
      case "currency":
        return val.toLocaleString("pt-BR", { style: "currency", currency: "BRL" })
      case "percentage":
        return `${val}%`
      default:
        return val.toLocaleString("pt-BR")
    }
  }

  const getTrendIcon = () => {
    if (!change) return <Minus className="h-4 w-4" />
    if (change > 0) return <TrendingUp className="h-4 w-4" />
    return <TrendingDown className="h-4 w-4" />
  }

  const getTrendColor = () => {
    if (!change) return "text-muted-foreground"
    if (change > 0) return "text-green-600"
    return "text-red-600"
  }

  return (
    <Card className={cn(className)}>
      <CardContent className="pt-6">
        <div className="flex items-center justify-between">
          <div className="space-y-2 flex-1">
            <p className="text-sm font-medium text-muted-foreground">{title}</p>
            <div className="text-2xl font-bold">
              {format === "currency" ? (
                formatValue(value)
              ) : (
                <AnimatedCounter value={value} suffix={format === "percentage" ? "%" : ""} />
              )}
            </div>
            {change !== undefined && (
              <div className={cn("flex items-center gap-1 text-xs", getTrendColor())}>
                {getTrendIcon()}
                <span>
                  {Math.abs(change)}% {changeLabel || "vs mês anterior"}
                </span>
              </div>
            )}
          </div>
          {icon && <div className="rounded-full bg-primary/10 p-3 text-primary">{icon}</div>}
        </div>
      </CardContent>
    </Card>
  )
}
