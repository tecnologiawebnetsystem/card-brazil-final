"use client"

import type React from "react"
import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet"
import { Menu } from "lucide-react"
import { useIsMobile } from "@/hooks/use-media-query"

interface MobileNavProps {
  children: React.ReactNode
}

export function MobileNav({ children }: MobileNavProps) {
  const [open, setOpen] = useState(false)
  const isMobile = useIsMobile()

  if (!isMobile) return null

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>
        <Button variant="ghost" size="icon" className="min-h-11 min-w-11 md:hidden" aria-label="Abrir menu">
          <Menu data-icon="inline-start" aria-hidden="true" />
        </Button>
      </SheetTrigger>
      <SheetContent side="left" className="w-[min(88vw,360px)] pb-[env(safe-area-inset-bottom)]">
        <SheetHeader>
          <SheetTitle>Menu principal</SheetTitle>
        </SheetHeader>
        <div className="mt-6 flex flex-col gap-2">{children}</div>
      </SheetContent>
    </Sheet>
  )
}
