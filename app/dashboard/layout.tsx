"use client"

import type React from "react"
import { usePathname } from "next/navigation"
import { SidebarProvider } from "@/components/ui/sidebar"
import { AppSidebar } from "@/components/dashboard/app-sidebar"
import { DashboardHeader } from "@/components/dashboard/dashboard-header"
import { DashboardFooter } from "@/components/dashboard/dashboard-footer"
import { KeyboardShortcuts } from "@/components/navigation/keyboard-shortcuts"
import { SkipToContent } from "@/components/accessibility/skip-to-content"

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const pathname = usePathname()

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
          <main id="main-content" className="module-page min-w-0 flex-1 overflow-auto bg-background px-3 py-4 pb-8 sm:px-4 sm:py-5 md:px-8 md:py-7">
            {children}
          </main>
          <DashboardFooter />
        </div>
      </div>
    </SidebarProvider>
  )
}
