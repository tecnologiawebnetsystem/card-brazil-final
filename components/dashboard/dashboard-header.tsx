"use client"

import { Button } from "@/components/ui/button"
import { GlobalSearch } from "@/components/navigation/global-search"
import { Menu } from "lucide-react"
import { useSidebar } from "@/components/ui/sidebar"
import { NotificationWidget } from "@/components/notifications/notification-widget"
import { BreadcrumbsNav } from "@/components/navigation/breadcrumbs-nav"

export function DashboardHeader() {
  const { toggleSidebar } = useSidebar()

  return (
    <header className="bg-card border-b border-border sticky top-0 z-50 shadow-sm">
      <div className="flex items-center justify-between h-16 px-6">
        <div className="flex items-center gap-4 flex-1 max-w-md">
          <Button variant="ghost" size="sm" onClick={toggleSidebar}>
            <Menu className="w-5 h-5" />
          </Button>

          <GlobalSearch />
        </div>

        {/* Right side - Status and notifications only */}
        <div className="flex items-center gap-4">
          {/* System Status */}
          <div className="hidden lg:flex items-center gap-2">
            <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
            <span className="text-sm text-muted-foreground">Sistema Online</span>
          </div>

          {/* Current Date */}
          <div className="hidden md:block text-sm text-muted-foreground">
            {new Date().toLocaleDateString("pt-BR", {
              day: "2-digit",
              month: "short",
              year: "numeric",
            })}
          </div>

          {/* Notifications */}
          <NotificationWidget />
        </div>
      </div>

      <div className="px-6 pb-3">
        <BreadcrumbsNav />
      </div>
    </header>
  )
}
