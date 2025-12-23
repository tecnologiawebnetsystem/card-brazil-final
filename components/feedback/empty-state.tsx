"use client"

import type React from "react"

import { FileQuestion, Plus } from "lucide-react"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"

interface EmptyStateProps {
  title: string
  description?: string
  icon?: React.ReactNode
  action?: {
    label: string
    onClick: () => void
  }
  className?: string
}

export function EmptyState({ title, description, icon, action, className }: EmptyStateProps) {
  return (
    <div className={cn("flex flex-col items-center justify-center py-12 px-4 text-center", className)}>
      <div className="rounded-full bg-muted p-6 mb-4">
        {icon || <FileQuestion className="h-12 w-12 text-muted-foreground" />}
      </div>
      <h3 className="text-lg font-semibold mb-2">{title}</h3>
      {description && <p className="text-sm text-muted-foreground mb-6 max-w-md">{description}</p>}
      {action && (
        <Button onClick={action.onClick}>
          <Plus className="h-4 w-4 mr-2" />
          {action.label}
        </Button>
      )}
    </div>
  )
}
