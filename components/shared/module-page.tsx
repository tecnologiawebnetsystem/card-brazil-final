"use client"

import type { ReactNode } from "react"
import { cn } from "@/lib/utils"

export function ModulePage({ children, className }: { children: ReactNode; className?: string }) {
  return <main className={cn("module-page min-w-0 flex-1 space-y-5 overflow-x-hidden p-3 sm:space-y-6 sm:p-4 md:p-6", className)}>{children}</main>
}

export function ModulePageHeader({ title, description, actions }: { title: string; description?: string; actions?: ReactNode }) {
  return (
    <header className="module-page__header flex flex-col gap-4 rounded-2xl border border-border/70 bg-card p-4 shadow-sm sm:flex-row sm:items-end sm:justify-between sm:p-5">
      <div className="space-y-1">
        <h1 className="font-heading text-2xl font-semibold tracking-tight text-foreground md:text-3xl">{title}</h1>
        {description ? <p className="text-sm text-muted-foreground md:text-base">{description}</p> : null}
      </div>
      {actions ? <div className="flex flex-wrap items-center gap-2">{actions}</div> : null}
    </header>
  )
}

export function ModuleToolbar({ children }: { children: ReactNode }) {
  return <div className="module-toolbar flex min-w-0 flex-col gap-3 rounded-2xl border border-border/70 bg-card p-3 shadow-sm sm:p-4 md:flex-row md:items-center md:justify-between">{children}</div>
}

export function ModuleTableSurface({ children }: { children: ReactNode }) {
  return <div className="module-table-surface min-w-0 overflow-x-auto rounded-2xl border border-border/70 bg-card shadow-sm">{children}</div>
}
