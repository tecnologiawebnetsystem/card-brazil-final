"use client"

import type React from "react"
import { SidebarProvider } from "@/components/ui/sidebar"
import { AppSidebar } from "@/components/dashboard/app-sidebar"
import { DashboardHeader } from "@/components/dashboard/dashboard-header"
import { DashboardFooter } from "@/components/dashboard/dashboard-footer"
import { ChatbotWidget } from "@/components/chatbot/chatbot-widget"
import { KeyboardShortcuts } from "@/components/navigation/keyboard-shortcuts"
import { SkipToContent } from "@/components/accessibility/skip-to-content"

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <SidebarProvider>
      <SkipToContent />
      <KeyboardShortcuts />

      <div className="flex min-h-screen w-full bg-background">
        <AppSidebar />
        <div className="flex-1 flex flex-col overflow-hidden bg-background">
          <DashboardHeader />
          <main id="main-content" className="flex-1 overflow-auto p-6 bg-muted/30">
            {children}
          </main>
          <DashboardFooter />
        </div>
      </div>
      <ChatbotWidget />
    </SidebarProvider>
  )
}
