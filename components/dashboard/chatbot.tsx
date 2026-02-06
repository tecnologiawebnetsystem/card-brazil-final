"use client"

import type React from "react"
import { AvatarImage } from "@/components/ui/avatar"

import { useState, useEffect, useRef } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"

interface Message {
  id: string
  type: "bot" | "user"
  content: string
  timestamp: Date
}

interface Notification {
  id: string
  title: string
  message: string
  type: "info" | "warning" | "success"
  timestamp: Date
}

const ChatBotIcon = () => (
  <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
    />
  </svg>
)

const CloseIcon = () => (
  <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
  </svg>
)

const SendIcon = () => (
  <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
  </svg>
)

export function ChatBot() {
  const [isOpen, setIsOpen] = useState(false)
  const [messages, setMessages] = useState<Message[]>([])
  const [inputValue, setInputValue] = useState("")
  const [notifications] = useState<Notification[]>([
    {
      id: "1",
      title: "Parcelas Pendentes",
      message: "Você tem 15 parcelas pendentes de cobrança",
      type: "warning",
      timestamp: new Date(),
    },
    {
      id: "2",
      title: "Novos Segurados",
      message: "3 novos segurados foram cadastrados hoje",
      type: "info",
      timestamp: new Date(),
    },
    {
      id: "3",
      title: "Backup Concluído",
      message: "Backup automático realizado com sucesso",
      type: "success",
      timestamp: new Date(),
    },
  ])
  const messagesEndRef = useRef<HTMLDivElement>(null)

  const pageGuide = {
    "/dashboard": "Dashboard - Visão geral do sistema com métricas e gráficos",
    "/dashboard/pessoas": "Pessoas - Cadastro e gestão de segurados",
    "/dashboard/cadastros/operadora": "Operadora - Cadastro de operadoras de saúde",
    "/dashboard/cadastros/administradora": "Administradora - Gestão de administradoras",
    "/dashboard/cadastros/estipulante": "Estipulante - Cadastro de estipulantes",
    "/dashboard/cadastros/agenciador": "Agenciador - Gestão de agenciadores",
    "/dashboard/cadastros/corretor": "Corretor - Cadastro de corretores",
    "/dashboard/cadastros/produtos": "Produtos - Gestão de produtos de saúde",
    "/dashboard/cadastros/planos": "Planos - Cadastro de planos de saúde",
    "/dashboard/cadastros/planos-faixa": "Planos Faixa - Gestão de faixas etárias",
    "/dashboard/cadastros/convenios": "Convênios - Cadastro de convênios médicos",
    "/dashboard/cobranca": "Cobrança - Gestão de boletos e cobranças",
    "/dashboard/financeiro": "Financeiro - Controle financeiro e fluxo de caixa",
    "/dashboard/sistema/usuarios": "Usuários - Gestão de usuários do sistema",
    "/dashboard/sistema/perfis": "Perfis - Configuração de perfis de acesso",
    "/dashboard/sistema/alcadas": "Alçadas - Controle de permissões por perfil",
    "/dashboard/relatorios": "Relatórios - Geração de relatórios diversos",
    "/dashboard/configuracoes": "Configurações - Configurações pessoais e do sistema",
  }

  useEffect(() => {
    if (isOpen && messages.length === 0) {
      // Mensagem inicial do bot
      const welcomeMessage: Message = {
        id: "welcome",
        type: "bot",
        content: `Olá! Sou seu assistente virtual do Talent Health. 

📊 Você tem ${notifications.length} notificações pendentes:
${notifications.map((n) => `• ${n.title}: ${n.message}`).join("\n")}

Gostaria de ler as notificações detalhadas? Ou posso ajudá-lo a navegar pelo sistema. Digite sua pergunta!`,
        timestamp: new Date(),
      }
      setMessages([welcomeMessage])
    }
  }, [isOpen, notifications])

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }, [messages])

  const handleSendMessage = () => {
    if (!inputValue.trim()) return

    const userMessage: Message = {
      id: Date.now().toString(),
      type: "user",
      content: inputValue,
      timestamp: new Date(),
    }

    setMessages((prev) => [...prev, userMessage])

    // Simular resposta do bot
    setTimeout(() => {
      const botResponse = generateBotResponse(inputValue)
      const botMessage: Message = {
        id: (Date.now() + 1).toString(),
        type: "bot",
        content: botResponse,
        timestamp: new Date(),
      }
      setMessages((prev) => [...prev, botMessage])
    }, 1000)

    setInputValue("")
  }

  const generateBotResponse = (input: string): string => {
    const lowerInput = input.toLowerCase()

    // Respostas sobre notificações
    if (lowerInput.includes("notifica") || lowerInput.includes("pendente")) {
      return `📋 Suas notificações detalhadas:

${notifications
  .map(
    (n, i) => `${i + 1}. **${n.title}**
   ${n.message}
   Tipo: ${n.type === "warning" ? "⚠️ Atenção" : n.type === "info" ? "ℹ️ Informação" : "✅ Sucesso"}
`,
  )
  .join("\n")}

Precisa de ajuda com alguma dessas questões?`
    }

    // Respostas sobre navegação
    if (lowerInput.includes("onde") || lowerInput.includes("como") || lowerInput.includes("página")) {
      for (const [path, description] of Object.entries(pageGuide)) {
        if (lowerInput.includes(path.split("/").pop()?.toLowerCase() || "")) {
          return `📍 Para acessar **${description}**, vá para: Menu → ${path.split("/").slice(2).join(" → ")}

Esta página permite que você gerencie todas as funcionalidades relacionadas. Precisa de mais detalhes sobre alguma função específica?`
        }
      }

      return `🗺️ Posso ajudá-lo a navegar pelo sistema! Aqui estão as principais seções:

**Cadastros**: Pessoas, Operadoras, Planos, Produtos
**Financeiro**: Parcelas, Cobrança, Fluxo de Caixa
**Sistema**: Usuários, Perfis, Permissões
**Relatórios**: Financeiro, Segurados, Vendas

Digite o nome da seção que procura para mais detalhes!`
    }

    // Respostas sobre funcionalidades específicas
    if (lowerInput.includes("cadastr") || lowerInput.includes("criar")) {
      return `➕ Para cadastrar informações no sistema:

1. **Pessoas**: Menu → Pessoas → Novo Cadastro
2. **Planos**: Menu → Cadastros → Planos → Adicionar
3. **Usuários**: Menu → Sistema → Usuários → Criar Usuário

Cada seção tem formulários específicos. Qual tipo de cadastro você precisa fazer?`
    }

    if (lowerInput.includes("relatório") || lowerInput.includes("relatorio")) {
      return `📊 Relatórios disponíveis:

• **Financeiro**: Análise de receitas e despesas
• **Segurados**: Lista e estatísticas de segurados  
• **Vendas**: Performance de vendas por período

Acesse: Menu → Relatórios → [Escolha o tipo]

Qual relatório você gostaria de gerar?`
    }

    if (lowerInput.includes("cobrança") || lowerInput.includes("boleto")) {
      return `💰 Para gestão de cobrança:

• **Gerar Boletos**: Menu → Cobrança → Gerar Boletos
• **Consultar**: Menu → Cobrança → Consultar Boletos  
• **Parcelas Pendentes**: Menu → Cobrança → Parcelas Pendentes

Você tem ${notifications.find((n) => n.title.includes("Parcelas"))?.message || "parcelas pendentes"}. Precisa de ajuda com alguma cobrança específica?`
    }

    // Resposta padrão
    return `🤖 Entendi sua pergunta! Posso ajudá-lo com:

• **Navegação**: "Onde encontro cadastros?"
• **Notificações**: "Mostrar minhas notificações"  
• **Funcionalidades**: "Como criar um usuário?"
• **Relatórios**: "Quais relatórios posso gerar?"

Digite sua dúvida ou escolha uma das opções acima!`
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault()
      handleSendMessage()
    }
  }

  return (
    <>
      {/* Botão flutuante */}
      <Button
        onClick={() => setIsOpen(true)}
        className="fixed bottom-6 right-6 h-14 w-14 rounded-full shadow-lg bg-emerald-600 hover:bg-emerald-700 z-50"
        size="icon"
      >
        <ChatBotIcon />
        {notifications.length > 0 && (
          <Badge className="absolute -top-2 -right-2 h-6 w-6 rounded-full p-0 flex items-center justify-center bg-red-500 text-white text-xs">
            {notifications.length}
          </Badge>
        )}
      </Button>

      {/* Modal do ChatBot */}
      {isOpen && (
        <div className="fixed inset-0 bg-black/50 flex items-end justify-end p-6 z-50">
          <Card className="w-96 h-[600px] flex flex-col shadow-2xl">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4 bg-emerald-600 text-white rounded-t-lg">
              <CardTitle className="text-lg font-semibold flex items-center gap-2">
                <Avatar className="h-8 w-8">
                  <AvatarImage src="/images/chatbot-avatar.png" alt="Assistente Talent Health" />
                  <AvatarFallback className="bg-emerald-700 text-white">CB</AvatarFallback>
                </Avatar>
                Assistente Talent Health
              </CardTitle>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setIsOpen(false)}
                className="h-8 w-8 text-white hover:bg-emerald-700"
              >
                <CloseIcon />
              </Button>
            </CardHeader>

            <CardContent className="flex-1 flex flex-col p-0">
              <ScrollArea className="flex-1 p-4">
                <div className="space-y-4">
                  {messages.map((message) => (
                    <div
                      key={message.id}
                      className={`flex ${message.type === "user" ? "justify-end" : "justify-start"}`}
                    >
                      <div
                        className={`max-w-[80%] rounded-lg p-3 ${
                          message.type === "user" ? "bg-emerald-600 text-white" : "bg-muted text-foreground"
                        }`}
                      >
                        <div className="text-sm whitespace-pre-wrap">{message.content}</div>
                        <div
                          className={`text-xs mt-1 ${
                            message.type === "user" ? "text-emerald-100" : "text-muted-foreground"
                          }`}
                        >
                          {message.timestamp.toLocaleTimeString("pt-BR", {
                            hour: "2-digit",
                            minute: "2-digit",
                          })}
                        </div>
                      </div>
                    </div>
                  ))}
                  <div ref={messagesEndRef} />
                </div>
              </ScrollArea>

              <div className="p-4 border-t">
                <div className="flex gap-2">
                  <Input
                    value={inputValue}
                    onChange={(e) => setInputValue(e.target.value)}
                    onKeyPress={handleKeyPress}
                    placeholder="Digite sua pergunta..."
                    className="flex-1"
                  />
                  <Button onClick={handleSendMessage} size="icon" className="bg-emerald-600 hover:bg-emerald-700">
                    <SendIcon />
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </>
  )
}
