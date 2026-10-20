"use client"

import { useEffect, type ReactNode } from "react"
import { usePathname, useRouter } from "next/navigation"
import { SidebarProvider } from "@/components/ui/sidebar"
import { AppSidebar } from "@/components/dashboard/app-sidebar"
import { useAuth } from "@/contexts/auth-context"
import { DashboardHeader } from "@/components/dashboard/dashboard-header"
import { DashboardFooter } from "@/components/dashboard/dashboard-footer"
import { KeyboardShortcuts } from "@/components/navigation/keyboard-shortcuts"
import { SkipToContent } from "@/components/accessibility/skip-to-content"

export default function DashboardLayout({
  children,
}: {
  children: ReactNode
}) {
  const pathname = usePathname()
  const router = useRouter()
  const { isAuthenticated, isLoading } = useAuth()

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      router.replace("/")
    }
  }, [isAuthenticated, isLoading, router])

  if (isLoading || !isAuthenticated) {
    return (
      <main className="relative flex min-h-screen items-center justify-center overflow-hidden bg-background px-6" aria-live="polite">
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top_right,color-mix(in_srgb,var(--primary)_12%,transparent),transparent_42%),radial-gradient(circle_at_bottom_left,color-mix(in_srgb,var(--accent)_18%,transparent),transparent_38%)]" />
        <div className="relative flex w-full max-w-md flex-col items-center gap-7 rounded-3xl border border-border/70 bg-card/90 p-10 text-center shadow-xl shadow-primary/10 backdrop-blur-sm">
          <div className="flex size-16 items-center justify-center rounded-2xl bg-sidebar text-sidebar-foreground shadow-lg shadow-primary/20">
            <span className="text-2xl font-bold tracking-tight">CB</span>
          </div>
          <div className="flex flex-col items-center gap-2">
            <h1 className="font-heading text-xl font-semibold text-foreground">CardBrazil</h1>
            <p className="text-sm text-muted-foreground">Preparando seu ambiente seguro</p>
          </div>
          <div className="flex w-full flex-col gap-3">
            <div className="h-2 overflow-hidden rounded-full bg-muted">
              <div className="h-full w-2/3 animate-pulse rounded-full bg-primary" />
            </div>
            <p className="text-xs font-medium text-muted-foreground">Verificando acesso...</p>
          </div>
        </div>
      </main>
    )
  }

  if (pathname === "/dashboard/sql-manager") {
    return <main className="min-h-screen w-full overflow-auto bg-background">{children}</main>
  }

  return (
    <SidebarProvider>
      <SkipToContent />
      <KeyboardShortcuts />

      <div className="flex min-h-screen w-full overflow-x-hidden bg-background pb-[env(safe-area-inset-bottom)]">
        <AppSidebar />
        <div className="flex min-w-0 flex-1 flex-col overflow-hidden bg-background">
          <DashboardHeader />
          <main id="main-content" className="module-page min-w-0 flex-1 overflow-auto bg-background px-3 py-4 pb-8 sm:px-4 sm:py-5 md:px-8 md:py-7" tabIndex={-1}>
            {children}
          </main>
          <DashboardFooter />
        </div>
      </div>
    </SidebarProvider>
  )
}
