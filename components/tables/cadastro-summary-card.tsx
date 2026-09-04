"use client"

import type React from "react"
import { Card, CardContent } from "@/components/ui/card"
import { cn } from "@/lib/utils"

export interface CadastroSummaryMetric {
  label: string
  value: React.ReactNode
  tone?: "default" | "positive" | "muted"
}

interface CadastroSummaryCardProps {
  title: string
  value: React.ReactNode
  description?: string
  icon?: React.ReactNode
  metrics?: CadastroSummaryMetric[]
  className?: string
}

export function CadastroSummaryCard({ title, value, description, icon, metrics, className }: CadastroSummaryCardProps) {
  return (
    <Card className={cn("border-border/70 bg-card shadow-sm", className)}>
      <CardContent className="flex min-h-0 flex-col gap-5 p-5 sm:p-6">
        <div className="flex items-start justify-between gap-4">
          <div className="min-w-0 space-y-1">
            <p className="text-sm font-medium text-muted-foreground">{title}</p>
            <p className="text-3xl font-semibold tracking-tight text-foreground">{value}</p>
            {description && <p className="text-xs leading-5 text-muted-foreground">{description}</p>}
          </div>
          {icon && <div className="shrink-0 rounded-lg bg-primary/10 p-2.5 text-primary">{icon}</div>}
        </div>
        {metrics && metrics.length > 0 && (
          <div className="grid grid-cols-2 gap-3 border-t border-border/70 pt-4">
            {metrics.map((metric) => (
              <div key={metric.label} className="space-y-0.5">
                <p className="text-[11px] font-medium uppercase tracking-wide text-muted-foreground">{metric.label}</p>
                <p
                  className={cn(
                    "text-sm font-semibold",
                    metric.tone === "positive" && "text-primary",
                    metric.tone === "muted" && "text-muted-foreground",
                    (!metric.tone || metric.tone === "default") && "text-foreground",
                  )}
                >
                  {metric.value}
                </p>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  )
}

export function CadastroSummaryGrid({ children, className }: { children: React.ReactNode; className?: string }) {
  return <div className={cn("grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4", className)}>{children}</div>
}
