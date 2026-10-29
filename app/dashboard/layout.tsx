"use client"

import { useEffect, type ReactNode } from "react"
import { LoaderCircle, ShieldCheck } from "lucide-react"
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
      <main className="relative flex min-h-screen items-center justify-center overflow-hidden bg-background px-6 py-10" aria-live="polite" aria-busy="true" role="status">
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top_right,color-mix(in_srgb,var(--primary)_12%,transparent),transparent_42%),radial-gradient(circle_at_bottom_left,color-mix(in_srgb,var(--accent)_18%,transparent),transparent_38%)]" />
        <div className="relative flex w-full max-w-md flex-col items-center gap-7 rounded-3xl border border-border/70 bg-card/95 p-8 text-center shadow-xl shadow-primary/10 backdrop-blur-sm sm:p-10">
          <div className="relative flex size-20 items-center justify-center rounded-[1.5rem] bg-sidebar text-sidebar-foreground shadow-lg shadow-primary/20">
            <span className="text-2xl font-bold tracking-tight">CB</span>
            <span className="absolute -bottom-2 -right-2 flex size-8 items-center justify-center rounded-full border-4 border-card bg-primary text-primary-foreground">
              <LoaderCircle className="size-4 animate-spin" aria-hidden="true" />
            </span>
          </div>
          <div className="flex flex-col items-center gap-2">
            <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-primary">CardBrazil</p>
            <h1 className="font-heading text-2xl font-semibold tracking-tight text-foreground">Preparando seu ambiente</h1>
            <p className="max-w-xs text-sm leading-6 text-muted-foreground">Estamos validando seu acesso e carregando os módulos da sua operação.</p>
          </div>
          <div className="flex w-full flex-col gap-3 rounded-2xl border border-border/70 bg-muted/30 p-4 text-left">
            <div className="flex items-center gap-2 text-xs font-medium text-foreground">
              <ShieldCheck className="size-4 text-primary" aria-hidden="true" />
              <span>Conexão segura</span>
              <span className="ml-auto text-muted-foreground">Aguarde</span>
            </div>
            <div className="h-1.5 overflow-hidden rounded-full bg-muted" aria-hidden="true">
              <div className="h-full w-1/3 animate-[loading-progress_1.6s_ease-in-out_infinite] rounded-full bg-primary" />
            </div>
            <p className="text-xs text-muted-foreground">Verificando credenciais...</p>
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
          <main id="main-content" className="module-page min-w-0 flex-1 overflow-auto bg-background px-4 py-5 pb-8 sm:px-6 sm:py-6 md:px-8 md:py-8" tabIndex={-1}>
            {children}
          </main>
          <DashboardFooter />
        </div>
      </div>
    </SidebarProvider>
  )
}
