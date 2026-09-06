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
    <header className="sticky top-0 z-50 border-b border-border/80 bg-card/95 shadow-sm backdrop-blur">
      <div className="flex min-h-16 items-center justify-between gap-4 px-4 md:px-8">
        <div className="flex items-center gap-4 flex-1 max-w-md">
          <Button variant="ghost" size="sm" onClick={toggleSidebar} className="rounded-xl text-muted-foreground hover:bg-secondary hover:text-foreground">
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

      <div className="border-t border-border/50 px-4 pb-3 pt-2 md:px-8">
        <BreadcrumbsNav />
      </div>
    </header>
  )
}
