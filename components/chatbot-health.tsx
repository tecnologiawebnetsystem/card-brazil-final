"use client"

import { useState, useRef, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Bot, Send, Minimize2, Maximize2, X, Sparkles, FileText, Calculator, Users, TrendingUp } from "lucide-react"
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar"

interface Message {
  id: string
  type: "user" | "bot"
  content: string
  timestamp: Date
  suggestions?: string[]
  attachments?: { type: string; title: string; url: string }[]
}

export function ChatbotHealth() {
  const [isOpen, setIsOpen] = useState(false)
  const [isMinimized, setIsMinimized] = useState(false)
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "1",
      type: "bot",
      content:
        "Olá! Sou o assistente inteligente da Talent Health. Como posso ajudá-lo hoje com questões sobre seguros de saúde?",
      timestamp: new Date(),
      suggestions: [
        "Consultar sinistralidade",
        "Gerar relatório financeiro",
        "Verificar inadimplência",
        "Análise de beneficiários",
      ],
    },
  ])
  const [inputValue, setInputValue] = useState("")
  const [isTyping, setIsTyping] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  const handleSendMessage = async (message: string) => {
    if (!message.trim()) return

    const userMessage: Message = {
      id: Date.now().toString(),
      type: "user",
      content: message,
      timestamp: new Date(),
    }

    setMessages((prev) => [...prev, userMessage])
    setInputValue("")
    setIsTyping(true)

    // Simular resposta do bot
    setTimeout(() => {
      const botResponse = generateBotResponse(message)
      setMessages((prev) => [...prev, botResponse])
      setIsTyping(false)
    }, 1500)
  }

  const generateBotResponse = (userMessage: string): Message => {
    const lowerMessage = userMessage.toLowerCase()

    if (lowerMessage.includes("sinistralidade") || lowerMessage.includes("sinistro")) {
      return {
        id: Date.now().toString(),
        type: "bot",
        content:
          "Analisando a sinistralidade atual... A taxa de sinistralidade está em 78.5% este mês, dentro da meta de 80%. Identifiquei que procedimentos cardiológicos representam 23% dos custos. Gostaria de um relatório detalhado?",
        timestamp: new Date(),
        suggestions: ["Gerar relatório de sinistralidade", "Ver por especialidade", "Comparar com mês anterior"],
        attachments: [{ type: "report", title: "Relatório de Sinistralidade - Janeiro 2024", url: "#" }],
      }
    }

    if (lowerMessage.includes("financeiro") || lowerMessage.includes("receita") || lowerMessage.includes("despesa")) {
      return {
        id: Date.now().toString(),
        type: "bot",
        content:
          "Situação financeira atual: Receitas R$ 8.5M (+8% vs mês anterior), Despesas R$ 6.2M (+3%). Margem operacional de 27%. Fluxo de caixa positivo em R$ 2.3M. Posso gerar análises mais específicas?",
        timestamp: new Date(),
        suggestions: ["DRE detalhada", "Projeção próximos 6 meses", "Análise de custos por área"],
        attachments: [{ type: "chart", title: "Dashboard Financeiro Executivo", url: "#" }],
      }
    }

    if (lowerMessage.includes("inadimplência") || lowerMessage.includes("inadimplente")) {
      return {
        id: Date.now().toString(),
        type: "bot",
        content:
          "Taxa de inadimplência atual: 4.2% (meta: <5%). Identifiquei 156 beneficiários em atraso >60 dias. Sugestão: campanha de negociação para 23 casos com maior potencial de recuperação (R$ 450K).",
        timestamp: new Date(),
        suggestions: ["Lista de inadimplentes", "Estratégias de cobrança", "Análise de risco"],
        attachments: [{ type: "list", title: "Relatório de Inadimplência Detalhado", url: "#" }],
      }
    }

    if (lowerMessage.includes("beneficiário") || lowerMessage.includes("carteira")) {
      return {
        id: Date.now().toString(),
        type: "bot",
        content:
          "Carteira atual: 12.450 beneficiários ativos. Crescimento de 3.2% no trimestre. Faixa etária predominante: 25-45 anos (45%). Taxa de utilização média: 2.3 consultas/beneficiário/mês. Alguma análise específica?",
        timestamp: new Date(),
        suggestions: ["Perfil demográfico", "Utilização por plano", "Projeção de crescimento"],
        attachments: [{ type: "dashboard", title: "Dashboard de Beneficiários", url: "#" }],
      }
    }

    // Resposta padrão
    return {
      id: Date.now().toString(),
      type: "bot",
      content:
        "Entendi sua pergunta. Posso ajudar com análises sobre sinistralidade, situação financeira, inadimplência, beneficiários, relatórios personalizados e muito mais. O que gostaria de saber especificamente?",
      timestamp: new Date(),
      suggestions: [
        "Mostrar dashboard executivo",
        "Gerar relatório personalizado",
        "Análise preditiva",
        "Comparar indicadores",
      ],
    }
  }

  const handleSuggestionClick = (suggestion: string) => {
    handleSendMessage(suggestion)
  }

  if (!isOpen) {
    return (
      <Button
        onClick={() => setIsOpen(true)}
        className="fixed bottom-6 right-6 h-14 w-14 rounded-full shadow-lg hover:shadow-xl transition-all duration-300 z-50"
        size="icon"
      >
        <Bot className="h-6 w-6" />
      </Button>
    )
  }

  return (
    <Card
      className={`fixed bottom-6 right-6 z-50 transition-all duration-300 ${
        isMinimized ? "w-80 h-16" : "w-96 h-[600px]"
      } shadow-2xl border-primary/20`}
    >
      <CardHeader className="pb-3 bg-gradient-to-r from-primary/10 to-secondary/10">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Avatar className="w-8 h-8">
              <AvatarImage src="/images/chatbot-avatar.png" alt="Assistente Talent Health" />
              <AvatarFallback className="bg-gradient-to-br from-primary to-secondary text-white">
                <Bot className="h-4 w-4" />
              </AvatarFallback>
            </Avatar>
            <div>
              <CardTitle className="text-sm">Assistente Talent Health</CardTitle>
              <div className="flex items-center gap-1">
                <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse"></div>
                <span className="text-xs text-muted-foreground">Online</span>
              </div>
            </div>
          </div>
          <div className="flex gap-1">
            <Button variant="ghost" size="sm" onClick={() => setIsMinimized(!isMinimized)} className="h-8 w-8 p-0">
              {isMinimized ? <Maximize2 className="h-4 w-4" /> : <Minimize2 className="h-4 w-4" />}
            </Button>
            <Button variant="ghost" size="sm" onClick={() => setIsOpen(false)} className="h-8 w-8 p-0">
              <X className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </CardHeader>

      {!isMinimized && (
        <CardContent className="p-0 flex flex-col h-[calc(600px-80px)]">
          <ScrollArea className="flex-1 p-4">
            <div className="space-y-4">
              {messages.map((message) => (
                <div key={message.id} className={`flex ${message.type === "user" ? "justify-end" : "justify-start"}`}>
                  <div
                    className={`max-w-[80%] rounded-lg p-3 ${
                      message.type === "user" ? "bg-primary text-primary-foreground" : "bg-muted"
                    }`}
                  >
                    <p className="text-sm">{message.content}</p>

                    {message.attachments && (
                      <div className="mt-2 space-y-1">
                        {message.attachments.map((attachment, index) => (
                          <div key={index} className="flex items-center gap-2 p-2 bg-background/50 rounded text-xs">
                            <FileText className="h-3 w-3" />
                            <span>{attachment.title}</span>
                          </div>
                        ))}
                      </div>
                    )}

                    {message.suggestions && (
                      <div className="mt-2 flex flex-wrap gap-1">
                        {message.suggestions.map((suggestion, index) => (
                          <Button
                            key={index}
                            variant="outline"
                            size="sm"
                            className="text-xs h-6 bg-transparent"
                            onClick={() => handleSuggestionClick(suggestion)}
                          >
                            {suggestion}
                          </Button>
                        ))}
                      </div>
                    )}

                    <p className="text-xs opacity-70 mt-1">
                      {message.timestamp.toLocaleTimeString("pt-BR", {
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </p>
                  </div>
                </div>
              ))}

              {isTyping && (
                <div className="flex justify-start">
                  <div className="bg-muted rounded-lg p-3">
                    <div className="flex gap-1">
                      <div className="w-2 h-2 bg-muted-foreground rounded-full animate-bounce"></div>
                      <div
                        className="w-2 h-2 bg-muted-foreground rounded-full animate-bounce"
                        style={{ animationDelay: "0.1s" }}
                      ></div>
                      <div
                        className="w-2 h-2 bg-muted-foreground rounded-full animate-bounce"
                        style={{ animationDelay: "0.2s" }}
                      ></div>
                    </div>
                  </div>
                </div>
              )}
            </div>
            <div ref={messagesEndRef} />
          </ScrollArea>

          <div className="p-4 border-t">
            <div className="flex gap-2">
              <Input
                placeholder="Digite sua pergunta sobre seguros de saúde..."
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                onKeyPress={(e) => e.key === "Enter" && handleSendMessage(inputValue)}
                className="flex-1"
              />
              <Button
                onClick={() => handleSendMessage(inputValue)}
                disabled={!inputValue.trim() || isTyping}
                size="icon"
              >
                <Send className="h-4 w-4" />
              </Button>
            </div>

            <div className="flex gap-1 mt-2">
              <Button variant="ghost" size="sm" className="text-xs h-6 gap-1">
                <Calculator className="h-3 w-3" />
                Calcular
              </Button>
              <Button variant="ghost" size="sm" className="text-xs h-6 gap-1">
                <TrendingUp className="h-3 w-3" />
                Analisar
              </Button>
              <Button variant="ghost" size="sm" className="text-xs h-6 gap-1">
                <Users className="h-3 w-3" />
                Beneficiários
              </Button>
              <Button variant="ghost" size="sm" className="text-xs h-6 gap-1">
                <Sparkles className="h-3 w-3" />
                IA
              </Button>
            </div>
          </div>
        </CardContent>
      )}
    </Card>
  )
}
