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
    <header className="bg-black border-b border-[#1a1a1a] sticky top-0 z-50">
      <div className="flex items-center justify-between h-14 px-6">
        <div className="flex items-center gap-4 flex-1 max-w-md">
          <Button variant="ghost" size="sm" onClick={toggleSidebar} className="hover:bg-[#1a1a1a] text-[#737373] hover:text-[#ededed]">
            <Menu className="w-5 h-5" />
          </Button>

          <GlobalSearch />
        </div>

        {/* Right side - Status and notifications only */}
        <div className="flex items-center gap-4">
          {/* System Status */}
          <div className="hidden lg:flex items-center gap-2">
            <div className="w-2 h-2 bg-[#00d084] rounded-full"></div>
            <span className="text-sm text-[#737373]">Sistema Online</span>
          </div>

          {/* Current Date */}
          <div className="hidden md:block text-sm text-[#737373]">
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

      <div className="px-6 pb-2">
        <BreadcrumbsNav />
      </div>
    </header>
  )
}
