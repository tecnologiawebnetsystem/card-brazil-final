"use client"

import { Button } from "@/components/ui/button"
import { GlobalSearch } from "@/components/navigation/global-search"
import { Menu } from "lucide-react"
import { useSidebar } from "@/components/ui/sidebar"
import { NotificationWidget } from "@/components/notifications/notification-widget"
import { BreadcrumbsNav } from "@/components/navigation/breadcrumbs-nav"
import { ProfileMenu } from "@/components/dashboard/profile-menu"

export function DashboardHeader() {
  const { toggleSidebar } = useSidebar()

  return (
    <header className="bg-card/95 border-b border-border backdrop-blur sticky top-0 z-50">
      <div className="flex items-center justify-between h-14 px-6">
        <div className="flex items-center gap-4 flex-1 max-w-md">
          <Button variant="ghost" size="sm" onClick={toggleSidebar} className="hover:bg-secondary text-muted-foreground hover:text-foreground">
            <Menu className="w-5 h-5" />
          </Button>

          <GlobalSearch />
        </div>

        {/* Right side - Status and notifications only */}
        <div className="flex items-center gap-4">
          {/* Current Date */}
          <div className="hidden md:block text-sm text-muted-foreground">
            {new Date().toLocaleDateString("pt-BR", {
              day: "2-digit",
              month: "short",
              year: "numeric",
            })}
          </div>

          <NotificationWidget />
          <ProfileMenu />
        </div>
      </div>

      <div className="px-6 pb-2">
        <BreadcrumbsNav />
      </div>
    </header>
  )
}
