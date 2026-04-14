"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Bell, X, Volume2, VolumeX, CheckCircle, AlertCircle, Info } from "lucide-react"
import { cn } from "@/lib/utils"

interface Notification {
  id: string
  title: string
  message: string
  type: "success" | "warning" | "info"
  timestamp: Date
  read: boolean
}

export function NotificationWidget() {
  const [isOpen, setIsOpen] = useState(false)
  const [audioEnabled, setAudioEnabled] = useState(true)
  const [notifications, setNotifications] = useState<Notification[]>([
    {
      id: "1",
      title: "Novo sinistro aprovado",
      message: "Sinistro SIN-2024-001 foi aprovado para João Silva",
      type: "success",
      timestamp: new Date(Date.now() - 2 * 60 * 1000),
      read: false,
    },
    {
      id: "2",
      title: "Pagamento em atraso",
      message: "Mensalidade de Carlos Oliveira está 5 dias em atraso",
      type: "warning",
      timestamp: new Date(Date.now() - 60 * 60 * 1000),
      read: false,
    },
    {
      id: "3",
      title: "Novo segurado cadastrado",
      message: "Maria Santos foi cadastrada no plano Premium",
      type: "info",
      timestamp: new Date(Date.now() - 3 * 60 * 60 * 1000),
      read: true,
    },
  ])

  const unreadCount = notifications.filter((n) => !n.read).length

  const stopSpeech = () => {
    if ("speechSynthesis" in window) {
      speechSynthesis.cancel()
    }
  }

  const speakNotifications = () => {
    if (audioEnabled && "speechSynthesis" in window) {
      const utterance = new SpeechSynthesisUtterance(
        `Você tem ${unreadCount} notificação${unreadCount !== 1 ? "ões" : ""} não lida${unreadCount !== 1 ? "s" : ""}`,
      )
      utterance.lang = "pt-BR"
      utterance.rate = 0.9
      utterance.pitch = 1.1

      const voices = speechSynthesis.getVoices()
      const femaleVoice = voices.find(
        (voice) =>
          voice.lang.includes("pt") &&
          (voice.name.toLowerCase().includes("female") ||
            voice.name.toLowerCase().includes("feminina") ||
            voice.name.toLowerCase().includes("woman") ||
            voice.name.toLowerCase().includes("maria")),
      )
      if (femaleVoice) utterance.voice = femaleVoice

      speechSynthesis.speak(utterance)
    }
  }

  const speakNotification = (notification: Notification) => {
    if (audioEnabled && "speechSynthesis" in window) {
      const utterance = new SpeechSynthesisUtterance(`${notification.title}. ${notification.message}`)
      utterance.lang = "pt-BR"
      utterance.rate = 0.9
      utterance.pitch = 1.1

      const voices = speechSynthesis.getVoices()
      const femaleVoice = voices.find(
        (voice) =>
          voice.lang.includes("pt") &&
          (voice.name.toLowerCase().includes("female") ||
            voice.name.toLowerCase().includes("feminina") ||
            voice.name.toLowerCase().includes("woman") ||
            voice.name.toLowerCase().includes("maria")),
      )
      if (femaleVoice) utterance.voice = femaleVoice

      speechSynthesis.speak(utterance)
    }
  }

  const handleNotificationClick = () => {
    setIsOpen(!isOpen)
    if (!isOpen && unreadCount > 0) {
      speakNotifications()
    }
  }

  const markAsRead = (id: string) => {
    setNotifications((prev) => prev.map((n) => (n.id === id ? { ...n, read: true } : n)))
  }

  const markAllAsRead = () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })))
  }

  const getIcon = (type: string) => {
    switch (type) {
      case "success":
        return <CheckCircle className="w-4 h-4 text-[#00d084]" />
      case "warning":
        return <AlertCircle className="w-4 h-4 text-[#f5a623]" />
      case "info":
        return <Info className="w-4 h-4 text-[#0070f3]" />
      default:
        return <Bell className="w-4 h-4 text-[#737373]" />
    }
  }

  const formatTime = (date: Date) => {
    const now = new Date()
    const diff = now.getTime() - date.getTime()
    const minutes = Math.floor(diff / (1000 * 60))
    const hours = Math.floor(diff / (1000 * 60 * 60))

    if (minutes < 60) {
      return `${minutes} min atrás`
    } else if (hours < 24) {
      return `${hours}h atrás`
    } else {
      return date.toLocaleDateString("pt-BR")
    }
  }

  const handleNotificationItemClick = (notification: Notification) => {
    markAsRead(notification.id)
    speakNotification(notification)
  }

  const handleAudioToggle = () => {
    if (audioEnabled) {
      stopSpeech() // Para qualquer áudio em reprodução
    }
    setAudioEnabled(!audioEnabled)
  }

  return (
    <div className="relative">
      {isOpen && (
        <Card className="absolute right-0 top-12 w-80 max-h-[380px] shadow-xl border border-[#262626] z-[9999] bg-[#0a0a0a] overflow-hidden">
          <div className="flex items-center justify-between p-3 border-b border-[#1a1a1a]">
            <div className="flex items-center gap-2">
              <Bell className="w-4 h-4 text-[#737373]" />
              <h3 className="font-semibold text-sm text-[#ededed]">Notificacoes</h3>
              {unreadCount > 0 && (
                <Badge variant="secondary" className="text-xs bg-[#00d084]/10 text-[#00d084] border border-[#00d084]/20">
                  {unreadCount}
                </Badge>
              )}
            </div>
            <div className="flex items-center gap-1">
              <Button
                variant="ghost"
                size="sm"
                onClick={handleAudioToggle}
                className="h-6 w-6 p-0 hover:bg-[#1a1a1a]"
                title={audioEnabled ? "Desativar áudio" : "Ativar áudio"}
              >
                {audioEnabled ? (
                  <Volume2 className="h-3 w-3 text-[#00d084]" />
                ) : (
                  <VolumeX className="h-3 w-3 text-[#737373]" />
                )}
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setIsOpen(false)}
                className="h-6 w-6 p-0 hover:bg-[#1a1a1a]"
              >
                <X className="h-3 w-3 text-[#737373]" />
              </Button>
            </div>
          </div>

          <ScrollArea className="h-[280px] overflow-hidden">
            <div className="p-3 space-y-2">
              {unreadCount > 0 && (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={markAllAsRead}
                  className="w-full text-xs h-7 bg-[#171717] hover:bg-[#1a1a1a] border-[#262626] text-[#a1a1a1]"
                >
                  Marcar todas como lidas
                </Button>
              )}

              {notifications.length === 0 ? (
                <div className="text-center py-6 text-[#737373] text-sm">Nenhuma notificacao</div>
              ) : (
                notifications.map((notification) => (
                  <div
                    key={notification.id}
                    className={cn(
                      "p-3 rounded-lg border cursor-pointer hover:bg-[#171717] transition-all duration-200",
                      !notification.read && "bg-[#0070f3]/5 border-[#0070f3]/20",
                      notification.read && "bg-transparent border-[#1a1a1a]",
                    )}
                    onClick={() => handleNotificationItemClick(notification)}
                  >
                    <div className="flex items-start gap-2">
                      {getIcon(notification.type)}
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between">
                          <h4 className="font-medium text-sm truncate text-[#ededed]">{notification.title}</h4>
                          {!notification.read && (
                            <div className="w-2 h-2 bg-[#0070f3] rounded-full flex-shrink-0 ml-2" />
                          )}
                        </div>
                        <p className="text-xs text-[#a1a1a1] mt-1 break-words leading-relaxed">
                          {notification.message}
                        </p>
                        <p className="text-xs text-[#737373] mt-1">{formatTime(notification.timestamp)}</p>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          </ScrollArea>
        </Card>
      )}

      <Button
        variant="ghost"
        size="sm"
        className="relative h-8 w-8 p-0 hover:bg-[#1a1a1a] text-[#737373] hover:text-[#ededed]"
        onClick={handleNotificationClick}
      >
        <Bell className="w-4 h-4" />
        {unreadCount > 0 && (
          <Badge className="absolute -top-1 -right-1 w-4 h-4 text-xs p-0 flex items-center justify-center bg-red-500 text-white">
            {unreadCount}
          </Badge>
        )}
      </Button>
    </div>
  )
}
