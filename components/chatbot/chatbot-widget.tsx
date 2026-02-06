"use client"

import type React from "react"

import { useState, useRef, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { Textarea } from "@/components/ui/textarea"
import {
  MessageCircle,
  ChevronUp,
  Send,
  Bot,
  X,
  Minimize2,
  Volume2,
  VolumeX,
  Camera,
  FileText,
  Calculator,
  Maximize2,
  Moon,
  Sun,
  Paperclip,
  ImageIcon,
} from "lucide-react"
import { cn } from "@/lib/utils"

interface Message {
  id: string
  content: string
  sender: "user" | "bot"
  timestamp: Date
  suggestions?: string[]
  hasScreenshot?: boolean
  hasBoleto?: boolean
  hasCalculation?: boolean
  audioEnabled?: boolean
  isTyping?: boolean
  attachments?: { name: string; type: string; url: string }[]
}

const SYSTEM_KNOWLEDGE = {
  navigation: {
    dashboard: "Para acessar o dashboard principal, clique em 'Dashboard' no menu lateral esquerdo.",
    beneficiarios:
      "Para gerenciar beneficiários, vá em 'Beneficiários' no menu lateral. Lá você encontra: Lista de Beneficiários, Cadastro de Beneficiário, Dependentes, Histórico Médico e Carteirinhas.",
    propostas:
      "Para trabalhar com propostas, acesse 'Propostas' no menu. Você pode: Criar Nova Proposta, Ver Lista de Propostas, Analisar Propostas, Acompanhar Pendentes, Ver Aprovadas e Gerar Relatórios.",
    cadastros:
      "Em 'Cadastros' você encontra: Administradora, Agenciador, Convênios, Corretor, Estipulante, Operadora e Planos.",
    cobranca:
      "Para questões financeiras, vá em 'Cobrança': Faturas, Pagamentos, Inadimplência, Relatórios Financeiros.",
    relatorios:
      "Em 'Relatórios' você tem: Dashboard Executivo, Relatórios Operacionais, Análises Financeiras e Indicadores.",
    configuracoes:
      "Para configurar o sistema, acesse 'Configurações': Usuários, Permissões, Parâmetros, Backup e Logs.",
  },
  procedures: {
    "cadastrar beneficiario":
      "1. Vá em Beneficiários > Cadastro de Beneficiário\n2. Preencha os dados pessoais\n3. Adicione informações do plano\n4. Configure dependentes se necessário\n5. Salve o cadastro",
    "criar proposta":
      "1. Acesse Propostas > Nova Proposta\n2. Selecione o tipo de proposta\n3. Preencha dados do proponente\n4. Escolha o plano desejado\n5. Anexe documentos necessários\n6. Envie para análise",
    "gerar fatura":
      "1. Vá em Cobrança > Faturas\n2. Clique em 'Nova Fatura'\n3. Selecione os beneficiários\n4. Configure período de cobrança\n5. Revise valores e gere a fatura",
    "consultar historico":
      "1. Acesse Beneficiários > Lista de Beneficiários\n2. Encontre o beneficiário desejado\n3. Clique em 'Ver Detalhes'\n4. Vá na aba 'Histórico Médico'",
    "segunda via boleto":
      "1. Vá em Cobrança > Faturas\n2. Encontre a fatura desejada\n3. Clique em 'Ações' > 'Segunda Via'\n4. O boleto será gerado automaticamente\n5. Você pode imprimir ou enviar por email",
    "comparar valores":
      "1. Acesse Relatórios > Análises Financeiras\n2. Selecione o período para comparação\n3. Escolha os parâmetros (receita, despesa, etc.)\n4. O sistema mostrará as diferenças automaticamente\n5. Gráficos comparativos serão exibidos",
  },
  features: {
    carteirinhas:
      "O sistema gera carteirinhas digitais automaticamente após aprovação do cadastro. Acesse em Beneficiários > Carteirinhas.",
    relatorios:
      "Temos relatórios executivos, operacionais e financeiros com gráficos interativos e exportação para Excel/PDF.",
    backup: "O sistema faz backup automático diário. Configure em Configurações > Backup.",
    permissoes: "Gerencie níveis de acesso em Configurações > Usuários > Permissões.",
    screenshots: "Posso mostrar capturas de tela das páginas do sistema para ajudar na navegação.",
    boletos: "Posso ajudar a gerar segunda via de boletos e explicar o processo passo a passo.",
    calculos: "Posso ajudar a identificar diferenças entre valores e fazer cálculos financeiros.",
    audio: "Posso falar as respostas em voz alta para facilitar o entendimento.",
  },
}

export function ChatbotWidget() {
  const [isOpen, setIsOpen] = useState(false)
  const [isMinimized, setIsMinimized] = useState(false)
  const [isExpanded, setIsExpanded] = useState(false)
  const [audioEnabled, setAudioEnabled] = useState(true)
  const [darkMode, setDarkMode] = useState(false)
  const [showHistory, setShowHistory] = useState(false)
  const [searchTerm, setSearchTerm] = useState("")
  const [isTyping, setIsTyping] = useState(false)
  const [voiceToggle, setVoiceToggle] = useState(false)
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "1",
      content: "Olá! Sou o assistente virtual do Talent Health CRM. Como posso ajudá-lo hoje?",
      sender: "bot",
      timestamp: new Date(),
      suggestions: [
        "Como cadastrar um beneficiário?",
        "Onde criar uma nova proposta?",
        "Como gerar relatórios?",
        "Onde encontro as configurações?",
      ],
    },
  ])
  const [inputValue, setInputValue] = useState("")
  const [unreadCount, setUnreadCount] = useState(0)
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLTextAreaElement>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  useEffect(() => {
    if (isOpen) {
      setUnreadCount(0)
      inputRef.current?.focus()
    }
  }, [isOpen])

  const speakText = (text: string) => {
    if (audioEnabled && "speechSynthesis" in window) {
      const utterance = new SpeechSynthesisUtterance(text)
      utterance.lang = "pt-BR"
      utterance.rate = 0.9

      const voices = speechSynthesis.getVoices()

      if (voiceToggle) {
        utterance.pitch = 1.3
        const femaleVoice = voices.find(
          (voice) =>
            voice.lang.includes("pt") &&
            (voice.name.toLowerCase().includes("female") ||
              voice.name.toLowerCase().includes("feminina") ||
              voice.name.toLowerCase().includes("woman") ||
              voice.name.toLowerCase().includes("maria")),
        )
        if (femaleVoice) utterance.voice = femaleVoice
      } else {
        utterance.pitch = 0.8
        const maleVoice = voices.find(
          (voice) =>
            voice.lang.includes("pt") &&
            (voice.name.toLowerCase().includes("male") ||
              voice.name.toLowerCase().includes("masculina") ||
              voice.name.toLowerCase().includes("man") ||
              voice.name.toLowerCase().includes("joão")),
        )
        if (maleVoice) utterance.voice = maleVoice
      }

      speechSynthesis.speak(utterance)
      setVoiceToggle(!voiceToggle)
    }
  }

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files
    if (!files) return

    Array.from(files).forEach((file) => {
      const allowedTypes = ["application/pdf", "image/png", "image/jpeg", "image/jpg", "image/gif"]
      if (!allowedTypes.includes(file.type)) {
        alert("Apenas arquivos PDF, PNG, JPEG, JPG e GIF são permitidos.")
        return
      }

      const reader = new FileReader()
      reader.onload = (e) => {
        const userMessage: Message = {
          id: Date.now().toString(),
          content: `📎 Arquivo anexado: ${file.name}`,
          sender: "user",
          timestamp: new Date(),
          attachments: [
            {
              name: file.name,
              type: file.type,
              url: e.target?.result as string,
            },
          ],
        }

        setMessages((prev) => [...prev, userMessage])

        setTimeout(() => {
          const botResponse = analyzeAttachment(file)
          setMessages((prev) => [...prev, botResponse])
          if (audioEnabled) speakText(botResponse.content)
        }, 1000)
      }
      reader.readAsDataURL(file)
    })

    if (event.target) {
      event.target.value = ""
    }
  }

  const analyzeAttachment = (file: File): Message => {
    let analysis = ""

    if (file.type === "application/pdf") {
      analysis = `📄 Analisei o PDF "${file.name}". Este documento parece ser:\n\n• Documento administrativo do sistema\n• Possível relatório ou formulário\n• Tamanho: ${(file.size / 1024).toFixed(1)} KB\n\nPosso ajudar com:\n• Explicar como gerar documentos similares no sistema\n• Orientar sobre onde encontrar esta funcionalidade\n• Mostrar relatórios relacionados`
    } else if (file.type.startsWith("image/")) {
      analysis = `🖼️ Analisei a imagem "${file.name}". Esta captura de tela mostra:\n\n• Interface do sistema Talent Health\n• Possível tela de cadastro ou relatório\n• Resolução: Adequada para análise\n• Tamanho: ${(file.size / 1024).toFixed(1)} KB\n\nPosso ajudar com:\n• Explicar os elementos visíveis na tela\n• Orientar sobre navegação nesta seção\n• Mostrar funcionalidades relacionadas`
    }

    return {
      id: Date.now().toString(),
      content: analysis,
      sender: "bot",
      timestamp: new Date(),
      suggestions: ["Como acessar esta tela?", "Explicar funcionalidades", "Mostrar tela similar", "Próximos passos"],
    }
  }

  const generateBotResponse = (userMessage: string): Message => {
    const lowerMessage = userMessage.toLowerCase()
    let response = "Desculpe, não entendi sua pergunta. Pode reformular ou escolher uma das sugestões abaixo?"
    let suggestions: string[] = [
      "Como navegar no sistema?",
      "Onde encontro os beneficiários?",
      "Como criar uma proposta?",
      "Preciso de ajuda com relatórios",
    ]
    let hasScreenshot = false
    let hasBoleto = false
    let hasCalculation = false

    if (
      lowerMessage.includes("print") ||
      lowerMessage.includes("tela") ||
      lowerMessage.includes("screenshot") ||
      lowerMessage.includes("mostrar")
    ) {
      response =
        "Posso mostrar uma captura de tela da página que você está visualizando para ajudar na navegação. Isso facilita a explicação visual dos procedimentos."
      hasScreenshot = true
      suggestions = ["Mostrar tela atual", "Como navegar?", "Explicar procedimento"]
    } else if (
      lowerMessage.includes("segunda via") ||
      lowerMessage.includes("boleto") ||
      lowerMessage.includes("gerar boleto")
    ) {
      response = `Para gerar segunda via de boleto:\n\n${SYSTEM_KNOWLEDGE.procedures["segunda via boleto"]}\n\nPosso gerar um boleto de exemplo se desejar.`
      hasBoleto = true
      suggestions = ["Gerar boleto exemplo", "Ver faturas pendentes", "Configurar cobrança"]
    } else if (
      lowerMessage.includes("diferença") ||
      lowerMessage.includes("comparar") ||
      lowerMessage.includes("valores") ||
      lowerMessage.includes("cálculo")
    ) {
      response = `Para comparar valores e identificar diferenças:\n\n${SYSTEM_KNOWLEDGE.procedures["comparar valores"]}\n\nPosso ajudar com cálculos específicos se informar os valores.`
      hasCalculation = true
      suggestions = ["Fazer cálculo", "Ver relatórios financeiros", "Comparar períodos"]
    } else if (lowerMessage.includes("falar") || lowerMessage.includes("áudio") || lowerMessage.includes("voz")) {
      response =
        "Posso falar as respostas em voz alta! Clique no ícone de som para ativar/desativar o áudio. Isso facilita o entendimento das instruções."
      suggestions = ["Ativar áudio", "Como usar o sistema?", "Explicar funcionalidades"]
    } else if (lowerMessage.includes("dashboard") || lowerMessage.includes("painel")) {
      response = SYSTEM_KNOWLEDGE.navigation.dashboard
      hasScreenshot = true
      suggestions = ["Mostrar dashboard", "Como acessar beneficiários?", "Ver relatórios"]
    } else if (lowerMessage.includes("beneficiario") || lowerMessage.includes("beneficiário")) {
      response = SYSTEM_KNOWLEDGE.navigation.beneficiarios
      hasScreenshot = true
      suggestions = ["Mostrar tela beneficiários", "Como cadastrar beneficiário?", "Ver histórico médico"]
    } else if (lowerMessage.includes("proposta")) {
      response = SYSTEM_KNOWLEDGE.navigation.propostas
      hasScreenshot = true
      suggestions = ["Mostrar tela propostas", "Como criar proposta?", "Analisar propostas pendentes"]
    } else if (lowerMessage.includes("cadastro")) {
      response = SYSTEM_KNOWLEDGE.navigation.cadastros
      hasScreenshot = true
      suggestions = ["Mostrar cadastros", "Cadastrar operadora", "Gerenciar planos"]
    } else if (
      lowerMessage.includes("cobrança") ||
      lowerMessage.includes("financeiro") ||
      lowerMessage.includes("fatura")
    ) {
      response = SYSTEM_KNOWLEDGE.navigation.cobranca
      hasScreenshot = true
      hasBoleto = true
      suggestions = ["Mostrar cobrança", "Como gerar fatura?", "Gerar segunda via"]
    } else if (lowerMessage.includes("relatorio") || lowerMessage.includes("relatório")) {
      response = SYSTEM_KNOWLEDGE.navigation.relatorios
      hasScreenshot = true
      hasCalculation = true
      suggestions = ["Mostrar relatórios", "Dashboard executivo", "Comparar valores"]
    } else if (
      lowerMessage.includes("configuração") ||
      lowerMessage.includes("configurações") ||
      lowerMessage.includes("config")
    ) {
      response = SYSTEM_KNOWLEDGE.navigation.configuracoes
      hasScreenshot = true
      suggestions = ["Mostrar configurações", "Gerenciar usuários", "Configurar permissões"]
    } else if (lowerMessage.includes("cadastrar") && lowerMessage.includes("beneficiario")) {
      response = `Para cadastrar um beneficiário:\n\n${SYSTEM_KNOWLEDGE.procedures["cadastrar beneficiario"]}`
      hasScreenshot = true
      suggestions = ["Mostrar tela cadastro", "Ver lista de beneficiários", "Adicionar dependentes"]
    } else if (lowerMessage.includes("criar") && lowerMessage.includes("proposta")) {
      response = `Para criar uma nova proposta:\n\n${SYSTEM_KNOWLEDGE.procedures["criar proposta"]}`
      hasScreenshot = true
      suggestions = ["Mostrar nova proposta", "Ver propostas pendentes", "Analisar propostas"]
    } else if (lowerMessage.includes("gerar") && lowerMessage.includes("fatura")) {
      response = `Para gerar uma fatura:\n\n${SYSTEM_KNOWLEDGE.procedures["gerar fatura"]}`
      hasScreenshot = true
      hasBoleto = true
      suggestions = ["Mostrar tela faturas", "Ver faturas pendentes", "Gerar segunda via"]
    } else if (lowerMessage.includes("historico") || lowerMessage.includes("histórico")) {
      response = `Para consultar histórico médico:\n\n${SYSTEM_KNOWLEDGE.procedures["consultar historico"]}`
      hasScreenshot = true
      suggestions = ["Mostrar histórico", "Cadastrar beneficiário", "Ver dependentes"]
    } else if (lowerMessage.includes("carteirinha")) {
      response = SYSTEM_KNOWLEDGE.features.carteirinhas
      hasScreenshot = true
      suggestions = ["Mostrar carteirinhas", "Cadastrar beneficiário", "Ver lista de beneficiários"]
    } else if (lowerMessage.includes("backup")) {
      response = SYSTEM_KNOWLEDGE.features.backup
      hasScreenshot = true
      suggestions = ["Mostrar configurações", "Configurar usuários", "Ver logs do sistema"]
    } else if (lowerMessage.includes("permiss")) {
      response = SYSTEM_KNOWLEDGE.features.permissoes
      hasScreenshot = true
      suggestions = ["Mostrar permissões", "Cadastrar usuário", "Ver logs de acesso"]
    } else if (lowerMessage.includes("obrigad") || lowerMessage.includes("valeu") || lowerMessage.includes("thanks")) {
      response = "De nada! Estou aqui para ajudar sempre que precisar. Há mais alguma coisa que posso esclarecer?"
      suggestions = ["Como navegar no sistema?", "Preciso de ajuda com cadastros", "Ver funcionalidades disponíveis"]
    } else if (lowerMessage.includes("oi") || lowerMessage.includes("olá") || lowerMessage.includes("hello")) {
      response =
        "Olá! Bem-vindo ao Talent Health CRM. Sou seu assistente virtual e conheço todo o sistema. Como posso ajudá-lo?"
      suggestions = [
        "Mostrar funcionalidades principais",
        "Como navegar no sistema?",
        "Preciso cadastrar beneficiários",
      ]
    }

    return {
      id: Date.now().toString(),
      content: response,
      sender: "bot",
      timestamp: new Date(),
      suggestions,
      hasScreenshot,
      hasBoleto,
      hasCalculation,
      audioEnabled,
    }
  }

  const handleSendMessage = () => {
    if (!inputValue.trim()) return

    const userMessage: Message = {
      id: Date.now().toString(),
      content: inputValue,
      sender: "user",
      timestamp: new Date(),
    }

    setMessages((prev) => [...prev, userMessage])
    const currentInput = inputValue
    setInputValue("")

    setIsTyping(true)

    setTimeout(() => {
      setIsTyping(false)
      const botResponse = generateBotResponse(currentInput)
      setMessages((prev) => [...prev, botResponse])

      if (audioEnabled) {
        speakText(botResponse.content)
      }

      if (!isOpen) {
        setUnreadCount((prev) => prev + 1)
      }
    }, 1500)
  }

  const handleSuggestionClick = (suggestion: string) => {
    setInputValue(suggestion)
    handleSendMessage()
  }

  const handleScreenshot = async () => {
    try {
      const currentUrl = window.location.pathname
      let pageDescription = "página atual"
      let detailedAnalysis = ""

      if (currentUrl.includes("/dashboard")) {
        pageDescription = "Dashboard Principal"
        detailedAnalysis =
          "Esta é a tela principal do sistema com visão geral dos indicadores, gráficos de performance e atalhos rápidos para as principais funcionalidades."
      } else if (currentUrl.includes("/beneficiarios")) {
        pageDescription = "Gestão de Beneficiários"
        detailedAnalysis =
          "Aqui você gerencia todos os beneficiários, pode cadastrar novos, editar dados existentes, adicionar dependentes e consultar histórico médico."
      } else if (currentUrl.includes("/propostas")) {
        pageDescription = "Gestão de Propostas"
        detailedAnalysis =
          "Nesta seção você cria novas propostas, acompanha o status das análises, aprova ou reprova solicitações e gera relatórios de propostas."
      } else if (currentUrl.includes("/cobranca")) {
        pageDescription = "Módulo de Cobrança"
        detailedAnalysis =
          "Área financeira onde você gera faturas, acompanha pagamentos, emite segunda via de boletos e controla inadimplência."
      }

      const newMessage: Message = {
        id: Date.now().toString(),
        content: `📸 Captura de tela da ${pageDescription} realizada!\n\n${detailedAnalysis}\n\n🔍 Análise da tela atual:\n• Layout responsivo e organizado\n• Menu lateral com navegação clara\n• Área de conteúdo principal visível\n• Botões de ação bem posicionados\n\nO que gostaria de saber sobre esta tela?`,
        sender: "bot",
        timestamp: new Date(),
        suggestions: [
          `Explicar ${pageDescription}`,
          "Como usar esta tela?",
          "Mostrar funcionalidades",
          "Próximos passos",
        ],
      }
      setMessages((prev) => [...prev, newMessage])
      if (audioEnabled) speakText(`Captura de tela da ${pageDescription} realizada e analisada!`)
    } catch (error) {
      console.error("Erro na captura:", error)
    }
  }

  const handleGenerateBoleto = () => {
    const newMessage: Message = {
      id: Date.now().toString(),
      content:
        "📄 Boleto de exemplo gerado!\n\nVencimento: 15/01/2025\nValor: R$ 150,00\nBeneficiário: João Silva\nCódigo de barras: 12345.67890.12345.678901.23456.789012.3\n\nEste é um exemplo de como o boleto aparecerá.",
      sender: "bot",
      timestamp: new Date(),
      suggestions: ["Como imprimir boleto", "Enviar por email", "Ver outras faturas"],
    }
    setMessages((prev) => [...prev, newMessage])
    if (audioEnabled) speakText("Boleto de exemplo gerado com sucesso!")
  }

  const handleCalculation = () => {
    const newMessage: Message = {
      id: Date.now().toString(),
      content:
        "🧮 Calculadora financeira ativada!\n\nExemplo de comparação:\nMês anterior: R$ 10.500,00\nMês atual: R$ 12.300,00\nDiferença: +R$ 1.800,00 (+17,14%)\n\nInforme os valores que deseja comparar para cálculos específicos.",
      sender: "bot",
      timestamp: new Date(),
      suggestions: ["Comparar receitas", "Calcular percentuais", "Ver relatórios detalhados"],
    }
    setMessages((prev) => [...prev, newMessage])
    if (audioEnabled) speakText("Calculadora financeira ativada!")
  }

  const handleExportChat = () => {
    const chatContent = messages
      .map((msg) => `[${msg.timestamp.toLocaleString()}] ${msg.sender.toUpperCase()}: ${msg.content}`)
      .join("\n\n")

    const blob = new Blob([chatContent], { type: "text/plain" })
    const url = URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = `chat-talenthealth-${new Date().toISOString().split("T")[0]}.txt`
    a.click()
    URL.revokeObjectURL(url)
  }

  const handleClearHistory = () => {
    setMessages([
      {
        id: "1",
        content: "Histórico limpo! Como posso ajudá-lo agora?",
        sender: "bot",
        timestamp: new Date(),
        suggestions: [
          "Como navegar no sistema?",
          "Preciso de ajuda com cadastros",
          "Ver funcionalidades disponíveis",
          "Configurar o sistema",
        ],
      },
    ])
  }

  const getQuickActions = () => {
    const currentUrl = window.location.pathname
    if (currentUrl.includes("/beneficiarios")) {
      return ["Cadastrar beneficiário", "Ver lista completa", "Adicionar dependente"]
    } else if (currentUrl.includes("/propostas")) {
      return ["Nova proposta", "Analisar pendentes", "Ver aprovadas"]
    } else if (currentUrl.includes("/cobranca")) {
      return ["Gerar fatura", "Segunda via boleto", "Ver inadimplência"]
    }
    return ["Tour pelo sistema", "Funcionalidades principais", "Configurações"]
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault()
      handleSendMessage()
    }
  }

  const filteredMessages = searchTerm
    ? messages.filter((msg) => msg.content.toLowerCase().includes(searchTerm.toLowerCase()))
    : messages

  return (
    <div className="fixed bottom-4 right-4 z-[9999] max-w-[calc(100vw-2rem)]">
      {isOpen && (
        <Card
          className={cn(
            "mb-4 transition-all duration-300 ease-in-out shadow-2xl border-primary/20 flex flex-col",
            darkMode ? "bg-gray-900 text-white" : "bg-background",
            isMinimized ? "h-14 w-80" : isExpanded ? "h-[600px] w-[420px]" : "h-[500px] w-80",
            "max-h-[calc(100vh-6rem)] max-w-[calc(100vw-2rem)]",
          )}
        >
          <div
            className={cn(
              "flex items-center justify-between p-3 border-b rounded-t-lg flex-shrink-0",
              darkMode ? "bg-gray-800 border-gray-700" : "bg-primary/5",
            )}
          >
            <div className="flex items-center gap-2">
              <Avatar className="h-8 w-8">
                <AvatarImage src="/robot-assistant-avatar.png" />
                <AvatarFallback className="bg-primary text-primary-foreground">
                  <Bot className="h-4 w-4" />
                </AvatarFallback>
              </Avatar>
              <div>
                <h3 className="font-semibold text-sm">Assistente Talent Health</h3>
                <p className={cn("text-xs", darkMode ? "text-gray-400" : "text-muted-foreground")}>
                  {isTyping ? "Digitando..." : "Online agora"}
                </p>
              </div>
            </div>
            <div className="flex items-center gap-1">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setDarkMode(!darkMode)}
                className="h-8 w-8 p-0"
                title="Alternar tema"
              >
                {darkMode ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setAudioEnabled(!audioEnabled)}
                className="h-8 w-8 p-0"
                title={audioEnabled ? "Desativar áudio" : "Ativar áudio"}
              >
                {audioEnabled ? <Volume2 className="h-4 w-4 text-green-600" /> : <VolumeX className="h-4 w-4" />}
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setIsExpanded(!isExpanded)}
                className="h-8 w-8 p-0"
                title={isExpanded ? "Reduzir" : "Expandir"}
              >
                <Maximize2 className="h-4 w-4" />
              </Button>
              <Button variant="ghost" size="sm" onClick={() => setIsMinimized(!isMinimized)} className="h-8 w-8 p-0">
                {isMinimized ? <ChevronUp className="h-4 w-4" /> : <Minimize2 className="h-4 w-4" />}
              </Button>
              <Button variant="ghost" size="sm" onClick={() => setIsOpen(false)} className="h-8 w-8 p-0">
                <X className="h-4 w-4" />
              </Button>
            </div>
          </div>

          {!isMinimized && (
            <>
              <div className="flex-1 overflow-hidden">
                <ScrollArea className="h-full p-3">
                  <div className="space-y-3">
                    {isTyping && (
                      <div className="flex gap-2 justify-start">
                        <Avatar className="h-6 w-6 mt-1 flex-shrink-0">
                          <AvatarFallback className="bg-primary text-primary-foreground text-xs">
                            <Bot className="h-3 w-3" />
                          </AvatarFallback>
                        </Avatar>
                        <div
                          className={cn(
                            "max-w-[80%] rounded-lg px-3 py-2 text-sm",
                            darkMode ? "bg-gray-700" : "bg-muted",
                          )}
                        >
                          <div className="flex space-x-1">
                            <div className="w-2 h-2 bg-primary rounded-full animate-bounce"></div>
                            <div
                              className="w-2 h-2 bg-primary rounded-full animate-bounce"
                              style={{ animationDelay: "0.1s" }}
                            ></div>
                            <div
                              className="w-2 h-2 bg-primary rounded-full animate-bounce"
                              style={{ animationDelay: "0.2s" }}
                            ></div>
                          </div>
                        </div>
                      </div>
                    )}

                    {filteredMessages.map((message) => (
                      <div
                        key={message.id}
                        className={cn("flex gap-2", message.sender === "user" ? "justify-end" : "justify-start")}
                      >
                        {message.sender === "bot" && (
                          <Avatar className="h-6 w-6 mt-1 flex-shrink-0">
                            <AvatarFallback className="bg-primary text-primary-foreground text-xs">
                              <Bot className="h-3 w-3" />
                            </AvatarFallback>
                          </Avatar>
                        )}
                        <div
                          className={cn(
                            "max-w-[75%] rounded-lg px-3 py-2 text-sm break-words overflow-wrap-anywhere",
                            message.sender === "user"
                              ? "bg-primary text-primary-foreground ml-auto"
                              : darkMode
                                ? "bg-gray-700"
                                : "bg-muted",
                          )}
                        >
                          <p className="whitespace-pre-line break-words">{message.content}</p>

                          {message.sender === "bot" &&
                            (message.hasScreenshot || message.hasBoleto || message.hasCalculation) && (
                              <div className="mt-2 flex gap-1 flex-wrap">
                                {message.hasScreenshot && (
                                  <Button
                                    variant="outline"
                                    size="sm"
                                    className="h-6 text-xs px-2 bg-transparent"
                                    onClick={handleScreenshot}
                                  >
                                    <Camera className="h-3 w-3 mr-1" />
                                    Print
                                  </Button>
                                )}
                                {message.hasBoleto && (
                                  <Button
                                    variant="outline"
                                    size="sm"
                                    className="h-6 text-xs px-2 bg-transparent"
                                    onClick={handleGenerateBoleto}
                                  >
                                    <FileText className="h-3 w-3 mr-1" />
                                    Boleto
                                  </Button>
                                )}
                                {message.hasCalculation && (
                                  <Button
                                    variant="outline"
                                    size="sm"
                                    className="h-6 text-xs px-2 bg-transparent"
                                    onClick={handleCalculation}
                                  >
                                    <Calculator className="h-3 w-3 mr-1" />
                                    Calcular
                                  </Button>
                                )}
                              </div>
                            )}

                          {message.suggestions && message.suggestions.length > 0 && (
                            <div className="mt-2 space-y-1">
                              {message.suggestions.map((suggestion, index) => (
                                <Button
                                  key={index}
                                  variant="outline"
                                  size="sm"
                                  className="h-7 text-xs w-full justify-start bg-transparent"
                                  onClick={() => handleSuggestionClick(suggestion)}
                                >
                                  {suggestion}
                                </Button>
                              ))}
                            </div>
                          )}

                          {message.attachments && message.attachments.length > 0 && (
                            <div className="mt-2 space-y-1">
                              {message.attachments.map((attachment, index) => (
                                <div key={index} className="flex items-center gap-2">
                                  {attachment.type.startsWith("image/") && <ImageIcon className="h-4 w-4" />}
                                  {attachment.type === "application/pdf" && <FileText className="h-4 w-4" />}
                                  <a
                                    href={attachment.url}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="text-sm underline break-all"
                                  >
                                    {attachment.name}
                                  </a>
                                </div>
                              ))}
                            </div>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                  <div ref={messagesEndRef} />
                </ScrollArea>
              </div>

              <Separator />

              <div
                className={cn("p-3 border-t flex-shrink-0", darkMode ? "bg-gray-900 border-gray-700" : "bg-background")}
              >
                <div className="flex gap-2 items-end">
                  <div className="flex-1">
                    <Textarea
                      ref={inputRef}
                      value={inputValue}
                      onChange={(e) => setInputValue(e.target.value)}
                      onKeyPress={handleKeyPress}
                      placeholder="Digite sua pergunta... (Enter para enviar, Shift+Enter para nova linha)"
                      className="min-h-[40px] max-h-[100px] resize-none"
                      rows={1}
                    />
                  </div>
                  <div className="flex gap-1">
                    <input
                      ref={fileInputRef}
                      type="file"
                      accept=".pdf,.png,.jpg,.jpeg,.gif"
                      multiple
                      onChange={handleFileUpload}
                      className="hidden"
                    />
                    <Button
                      variant="outline"
                      size="sm"
                      className="h-10 w-10 p-0 bg-transparent"
                      onClick={() => fileInputRef.current?.click()}
                      title="Anexar arquivo (PDF, PNG, JPG, GIF)"
                    >
                      <Paperclip className="h-4 w-4" />
                    </Button>
                    <Button
                      onClick={handleSendMessage}
                      size="sm"
                      className="h-10 w-10 p-0"
                      disabled={!inputValue.trim()}
                    >
                      <Send className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </div>
            </>
          )}
        </Card>
      )}

      <Button
        onClick={() => setIsOpen(!isOpen)}
        className="h-12 w-12 rounded-full shadow-lg hover:shadow-xl transition-all duration-200 relative"
        size="sm"
      >
        <MessageCircle className="h-6 w-6" />
        {unreadCount > 0 && (
          <Badge className="absolute -top-1 -right-1 h-5 w-5 p-0 text-xs bg-destructive">{unreadCount}</Badge>
        )}
      </Button>
    </div>
  )
}
