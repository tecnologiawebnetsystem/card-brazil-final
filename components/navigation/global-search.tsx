"use client"

import { useState, useEffect, useCallback } from "react"
import { useRouter } from "next/navigation"
import { Search, FileText, Users, Building2, ClipboardList, Settings } from "lucide-react"
import {
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command"

const pages = [
  { name: "Dashboard", href: "/dashboard", icon: FileText, category: "Geral" },
  { name: "Pessoas", href: "/dashboard/cadastros/pessoas", icon: Users, category: "Cadastros" },
  { name: "Operadoras", href: "/dashboard/cadastros/operadora", icon: Building2, category: "Cadastros" },
  { name: "Administradoras", href: "/dashboard/cadastros/administradora", icon: Building2, category: "Cadastros" },
  { name: "Estipulantes", href: "/dashboard/cadastros/estipulante", icon: Building2, category: "Cadastros" },
  { name: "Corretores", href: "/dashboard/cadastros/corretor", icon: Users, category: "Cadastros" },
  { name: "Agenciadores", href: "/dashboard/cadastros/agenciador", icon: Users, category: "Cadastros" },
  { name: "Planos", href: "/dashboard/cadastros/planos", icon: FileText, category: "Cadastros" },
  { name: "Produtos", href: "/dashboard/cadastros/produtos", icon: FileText, category: "Cadastros" },
  { name: "Nova Proposta", href: "/dashboard/propostas/nova", icon: ClipboardList, category: "Propostas" },
  { name: "Lista de Propostas", href: "/dashboard/propostas/lista", icon: ClipboardList, category: "Propostas" },
  { name: "Propostas Pendentes", href: "/dashboard/propostas/pendentes", icon: ClipboardList, category: "Propostas" },
  { name: "Análise de Propostas", href: "/dashboard/propostas/analise", icon: ClipboardList, category: "Propostas" },
  { name: "Propostas Aprovadas", href: "/dashboard/propostas/aprovadas", icon: ClipboardList, category: "Propostas" },
  {
    name: "Aprovação de Propostas",
    href: "/dashboard/propostas/aprovacao",
    icon: ClipboardList,
    category: "Propostas",
  },
  { name: "Relatórios de Propostas", href: "/dashboard/propostas/relatorios", icon: FileText, category: "Propostas" },
  { name: "Consulta Beneficiários", href: "/dashboard/beneficiarios/consulta", icon: Users, category: "Beneficiários" },
  { name: "Contratos", href: "/dashboard/contratos", icon: FileText, category: "Geral" },
  { name: "Configurações", href: "/dashboard/configuracoes", icon: Settings, category: "Sistema" },
]

export function GlobalSearch() {
  const [open, setOpen] = useState(false)
  const router = useRouter()

  useEffect(() => {
    const down = (e: KeyboardEvent) => {
      if (e.key === "k" && (e.metaKey || e.ctrlKey)) {
        e.preventDefault()
        setOpen((open) => !open)
      }
    }

    document.addEventListener("keydown", down)
    return () => document.removeEventListener("keydown", down)
  }, [])

  const handleSelect = useCallback(
    (href: string) => {
      setOpen(false)
      router.push(href)
    },
    [router],
  )

  const groupedPages = pages.reduce(
    (acc, page) => {
      if (!acc[page.category]) {
        acc[page.category] = []
      }
      acc[page.category].push(page)
      return acc
    },
    {} as Record<string, typeof pages>,
  )

  return (
    <>
      <button
        onClick={() => setOpen(true)}
        className="flex items-center gap-2 px-3 py-2 text-sm text-[#737373] border border-[#262626] rounded-lg bg-[#0a0a0a] hover:bg-[#171717] hover:text-[#a1a1a1] hover:border-[#333] transition-colors w-full max-w-sm"
      >
        <Search className="h-4 w-4" />
        <span>Buscar...</span>
        <kbd className="ml-auto pointer-events-none inline-flex h-5 select-none items-center gap-1 rounded border border-[#262626] bg-[#171717] px-1.5 font-mono text-[10px] font-medium text-[#737373]">
          <span className="text-xs">⌘</span>K
        </kbd>
      </button>

      <CommandDialog open={open} onOpenChange={setOpen}>
        <CommandInput placeholder="Digite para buscar páginas..." />
        <CommandList>
          <CommandEmpty>Nenhum resultado encontrado.</CommandEmpty>
          {Object.entries(groupedPages).map(([category, items]) => (
            <CommandGroup key={category} heading={category}>
              {items.map((page) => {
                const Icon = page.icon
                return (
                  <CommandItem key={page.href} value={page.name} onSelect={() => handleSelect(page.href)}>
                    <Icon className="mr-2 h-4 w-4" />
                    <span>{page.name}</span>
                  </CommandItem>
                )
              })}
            </CommandGroup>
          ))}
        </CommandList>
      </CommandDialog>
    </>
  )
}
