"use client"

import { useEffect } from "react"
import { useRouter } from "next/navigation"
import { toast } from "sonner"

const shortcuts = [
  { key: "h", ctrl: true, action: "/dashboard", description: "Ir para Dashboard" },
  { key: "n", ctrl: true, shift: true, action: "/dashboard/propostas/nova", description: "Nova Proposta" },
  { key: "p", ctrl: true, shift: true, action: "/dashboard/cadastros/pessoas", description: "Cadastro de Pessoas" },
]

export function KeyboardShortcuts() {
  const router = useRouter()

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      for (const shortcut of shortcuts) {
        const ctrlMatch = shortcut.ctrl ? e.ctrlKey || e.metaKey : true
        const shiftMatch = shortcut.shift ? e.shiftKey : !e.shiftKey

        if (e.key.toLowerCase() === shortcut.key && ctrlMatch && shiftMatch) {
          e.preventDefault()
          router.push(shortcut.action)
          toast.success(`Navegando para: ${shortcut.description}`)
          return
        }
      }
    }

    document.addEventListener("keydown", handleKeyDown)
    return () => document.removeEventListener("keydown", handleKeyDown)
  }, [router])

  return null
}
