"use client"

import { useEffect, useState } from "react"
import { Download, X } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"

interface BeforeInstallPromptEvent extends Event {
  prompt: () => Promise<void>
  userChoice: Promise<{ outcome: "accepted" | "dismissed" }>
}

export function InstallPwaPrompt() {
  const [event, setEvent] = useState<BeforeInstallPromptEvent | null>(null)
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    const handler = (installEvent: Event) => {
      installEvent.preventDefault()
      setEvent(installEvent as BeforeInstallPromptEvent)
      setVisible(true)
    }
    window.addEventListener("beforeinstallprompt", handler)
    return () => window.removeEventListener("beforeinstallprompt", handler)
  }, [])

  if (!visible || !event) return null

  return (
    <Card className="fixed inset-x-4 bottom-[calc(1rem+env(safe-area-inset-bottom))] z-50 shadow-lg md:inset-x-auto md:right-6 md:w-96">
      <CardContent className="flex items-center gap-3 p-4">
        <Download className="size-5 shrink-0 text-primary" aria-hidden="true" />
        <p className="flex-1 text-sm leading-6">Instale o CardBrazil para acessar mais rápido pelo celular.</p>
        <Button size="sm" onClick={async () => { await event.prompt(); setVisible(false) }}>Instalar</Button>
        <Button variant="ghost" size="icon" aria-label="Fechar aviso de instalação" onClick={() => setVisible(false)}>
          <X data-icon="inline-start" aria-hidden="true" />
        </Button>
      </CardContent>
    </Card>
  )
}
