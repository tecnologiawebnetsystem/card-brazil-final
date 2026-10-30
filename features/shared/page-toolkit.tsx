import type React from "react"
import type { LucideIcon } from "lucide-react"
import { ArrowRight, Search } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"

export function PageHeader({ eyebrow, title, description, action }: { eyebrow: string; title: string; description: string; action?: React.ReactNode }) {
  return (
    <header className="flex flex-col justify-between gap-5 border-b border-border/70 pb-7 lg:flex-row lg:items-end">
      <div className="max-w-3xl">
        <p className="mb-2 text-xs font-semibold uppercase tracking-[0.18em] text-primary">{eyebrow}</p>
        <h1 className="font-heading text-3xl font-semibold tracking-tight text-foreground sm:text-4xl">{title}</h1>
        <p className="mt-2 text-sm leading-6 text-muted-foreground sm:text-base">{description}</p>
      </div>
      {action && <div className="shrink-0">{action}</div>}
    </header>
  )
}

export function MetricCard({ label, value, hint, icon: Icon }: { label: string; value: React.ReactNode; hint?: string; icon: LucideIcon }) {
  return (
    <Card className="border-border/70 shadow-sm">
      <CardContent className="flex items-center gap-4 p-5">
        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-accent text-primary"><Icon className="h-5 w-5" aria-hidden="true" /></div>
        <div className="min-w-0"><p className="truncate text-xs font-medium uppercase tracking-wide text-muted-foreground">{label}</p><p className="mt-1 font-heading text-2xl font-semibold text-foreground">{value}</p>{hint && <p className="mt-0.5 text-xs text-muted-foreground">{hint}</p>}</div>
      </CardContent>
    </Card>
  )
}

export function EmptyState({ title, description, onClear }: { title: string; description: string; onClear?: () => void }) {
  return (
    <div className="flex flex-col items-center justify-center rounded-xl border border-dashed border-border px-6 py-14 text-center">
      <div className="flex h-12 w-12 items-center justify-center rounded-full bg-secondary text-muted-foreground"><Search className="h-5 w-5" /></div>
      <h3 className="mt-4 font-heading text-base font-semibold text-foreground">{title}</h3>
      <p className="mt-1 max-w-sm text-sm leading-5 text-muted-foreground">{description}</p>
      {onClear && <Button variant="link" className="mt-2" onClick={onClear}>Limpar filtros <ArrowRight className="ml-1 h-3.5 w-3.5" /></Button>}
    </div>
  )
}
