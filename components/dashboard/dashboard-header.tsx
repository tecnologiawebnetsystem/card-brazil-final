"use client"

import { Button } from "@/components/ui/button"
import { GlobalSearch } from "@/components/navigation/global-search"
import { Menu } from "lucide-react"
import { useSidebar } from "@/components/ui/sidebar"
import { BreadcrumbsNav } from "@/components/navigation/breadcrumbs-nav"
import { ProfileMenu } from "@/components/dashboard/profile-menu"
import { useSyncExternalStore } from "react"

export function DashboardHeader() {
  const { toggleSidebar } = useSidebar()
  const currentDate = useSyncExternalStore(
    () => () => undefined,
    () => new Intl.DateTimeFormat("pt-BR", { day: "2-digit", month: "short", year: "numeric", timeZone: "America/Sao_Paulo" }).format(new Date()),
    () => "",
  )

  return (
    <header className="sticky top-0 z-50 border-b border-border/80 bg-surface/95 pt-[env(safe-area-inset-top)] shadow-[0_1px_12px_-10px_color-mix(in_srgb,var(--foreground)_35%,transparent)] backdrop-blur supports-[backdrop-filter]:bg-surface/90">
      <div className="flex min-h-[4.25rem] items-center justify-between gap-2 px-3 sm:gap-4 sm:px-6 md:px-8">
        <div className="flex items-center gap-4 flex-1 max-w-md">
          <Button variant="ghost" size="sm" onClick={toggleSidebar} className="min-h-11 min-w-11 rounded-xl text-muted-foreground hover:bg-secondary hover:text-foreground" aria-label="Alternar menu lateral">
            <Menu aria-hidden="true" />
          </Button>

          <GlobalSearch />
        </div>

        {/* Right side - Status and notifications only */}
        <div className="flex items-center gap-4">
          {/* Current Date */}
          <div className="hidden min-w-28 rounded-lg bg-muted/70 px-3 py-1.5 text-sm font-medium text-muted-foreground md:block" aria-label={currentDate ? `Data atual: ${currentDate}` : undefined}>
            {currentDate || "\u00a0"}
          </div>

          <ProfileMenu />
        </div>
      </div>

      <div className="border-t border-border/50 px-3 pb-3 pt-2 sm:px-5 md:px-8">
        <BreadcrumbsNav />
      </div>
    </header>
  )
}
