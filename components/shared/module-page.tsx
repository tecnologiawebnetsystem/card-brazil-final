"use client"

import type { ReactNode } from "react"
import { cn } from "@/lib/utils"

export function ModulePage({ children, className }: { children: ReactNode; className?: string }) {
  return <main className={cn("module-page flex-1 space-y-6 p-4 md:p-6", className)}>{children}</main>
}

export function ModulePageHeader({ title, description, actions }: { title: string; description?: string; actions?: ReactNode }) {
  return (
    <header className="module-page__header flex flex-col gap-4 border-b border-border/70 pb-5 sm:flex-row sm:items-end sm:justify-between">
      <div className="space-y-1">
        <h1 className="font-heading text-2xl font-semibold tracking-tight text-foreground md:text-3xl">{title}</h1>
        {description ? <p className="text-sm text-muted-foreground md:text-base">{description}</p> : null}
      </div>
      {actions ? <div className="flex flex-wrap items-center gap-2">{actions}</div> : null}
    </header>
  )
}

export function ModuleToolbar({ children }: { children: ReactNode }) {
  return <div className="module-toolbar flex flex-col gap-3 rounded-lg border border-border bg-card p-4 shadow-sm md:flex-row md:items-center md:justify-between">{children}</div>
}

export function ModuleTableSurface({ children }: { children: ReactNode }) {
  return <div className="module-table-surface overflow-x-auto rounded-lg border border-border bg-card shadow-sm">{children}</div>
}
