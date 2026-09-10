"use client"

import { Button } from "@/components/ui/button"
import { GlobalSearch } from "@/components/navigation/global-search"
import { Menu } from "lucide-react"
import { useSidebar } from "@/components/ui/sidebar"
import { BreadcrumbsNav } from "@/components/navigation/breadcrumbs-nav"
import { ProfileMenu } from "@/components/dashboard/profile-menu"

export function DashboardHeader() {
  const { toggleSidebar } = useSidebar()

  return (
    <header className="sticky top-0 z-50 border-b border-border/80 bg-card/95 pt-[env(safe-area-inset-top)] shadow-sm backdrop-blur">
      <div className="flex min-h-16 items-center justify-between gap-2 px-3 sm:gap-4 sm:px-5 md:px-8">
        <div className="flex items-center gap-4 flex-1 max-w-md">
          <Button variant="ghost" size="sm" onClick={toggleSidebar} className="min-h-11 min-w-11 rounded-xl text-muted-foreground hover:bg-secondary hover:text-foreground" aria-label="Alternar menu lateral">
            <Menu className="w-5 h-5" />
          </Button>

          <GlobalSearch />
        </div>

        {/* Right side - Status and notifications only */}
        <div className="flex items-center gap-4">
          {/* Current Date */}
          <div className="hidden rounded-lg bg-muted/70 px-3 py-1.5 text-sm font-medium text-muted-foreground md:block">
            {new Date().toLocaleDateString("pt-BR", {
              day: "2-digit",
              month: "short",
              year: "numeric",
            })}
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
