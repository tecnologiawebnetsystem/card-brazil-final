"use client"

import { Progress } from "@/components/ui/progress"
import { cn } from "@/lib/utils"

interface ProgressWithLabelProps {
  value: number
  label?: string
  showPercentage?: boolean
  className?: string
}

export function ProgressWithLabel({ value, label, showPercentage = true, className }: ProgressWithLabelProps) {
  return (
    <div className={cn("space-y-2", className)}>
      {(label || showPercentage) && (
        <div className="flex items-center justify-between text-sm">
          {label && <span className="text-muted-foreground">{label}</span>}
          {showPercentage && <span className="font-medium">{value}%</span>}
        </div>
      )}
      <Progress value={value} className="h-2" />
    </div>
  )
}
