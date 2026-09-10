"use client"

import { useEffect, useState } from "react"
import { Download, Smartphone } from "lucide-react"
import { Button } from "@/components/ui/button"

interface BeforeInstallPromptEvent extends Event {
  prompt: () => Promise<void>
  userChoice: Promise<{ outcome: "accepted" | "dismissed" }>
}

export function LoginInstallActions() {
  const [installEvent, setInstallEvent] = useState<BeforeInstallPromptEvent | null>(null)
  const [isInstalled, setIsInstalled] = useState(false)

  useEffect(() => {
    setIsInstalled(window.matchMedia("(display-mode: standalone)").matches || Boolean((navigator as Navigator & { standalone?: boolean }).standalone))
    const handleBeforeInstall = (event: Event) => {
      event.preventDefault()
      setInstallEvent(event as BeforeInstallPromptEvent)
    }
    window.addEventListener("beforeinstallprompt", handleBeforeInstall)
    return () => window.removeEventListener("beforeinstallprompt", handleBeforeInstall)
  }, [])

  const installAndroid = async () => {
    if (!installEvent) return
    await installEvent.prompt()
    await installEvent.userChoice
    setInstallEvent(null)
  }

  if (isInstalled) return null

  return (
    <section className="mt-7 border-t border-border/70 pt-6" aria-label="Instalar CardBrazil no celular">
      <div className="flex items-start gap-3">
        <span className="grid size-10 shrink-0 place-items-center rounded-xl bg-primary/10 text-primary"><Smartphone /></span>
        <div className="min-w-0">
          <h3 className="font-semibold">Acesse pelo celular</h3>
          <p className="mt-1 text-sm leading-5 text-muted-foreground">Instale o CardBrazil pelo navegador para usar como aplicativo.</p>
        </div>
      </div>
      <div className="mt-4 grid min-w-0 gap-2 sm:grid-cols-2">
        <Button type="button" variant="outline" className="min-h-11 min-w-0 justify-start px-3 text-left text-xs sm:text-sm" onClick={installAndroid} disabled={!installEvent}>
          <Download data-icon="inline-start" />Android: instalar app
        </Button>
        <Button type="button" variant="outline" className="min-h-11 min-w-0 justify-start px-3 text-left text-xs sm:text-sm" onClick={() => window.alert("No iPhone: abra esta página no Safari, toque em Compartilhar e escolha Adicionar à Tela de Início.")}>
          <Download data-icon="inline-start" />iPhone: adicionar à tela
        </Button>
      </div>
      {!installEvent && <p className="mt-2 text-xs leading-4 text-muted-foreground">No Android, use Chrome. Se o botão estiver desativado, abra o menu do navegador e escolha Instalar aplicativo.</p>}
    </section>
  )
}
