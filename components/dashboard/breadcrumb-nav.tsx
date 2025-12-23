"use client"

import { usePathname } from "next/navigation"
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb"

export function BreadcrumbNav() {
  const pathname = usePathname()
  const segments = pathname.split("/").filter(Boolean)

  const breadcrumbMap: Record<string, string> = {
    dashboard: "Dashboard",
    segurados: "Segurados",
    sinistros: "Sinistros",
    pagamentos: "Pagamentos",
    relatorios: "Relatórios",
    cobranca: "Cobrança",
    "rede-credenciada": "Rede Credenciada",
    consultas: "Consultas",
    agendamentos: "Agendamentos",
    configuracoes: "Configurações",
    notificacoes: "Notificações",
    ajuda: "Ajuda",
  }

  if (segments.length <= 1) return null

  return (
    <Breadcrumb className="mb-4">
      <BreadcrumbList>
        <BreadcrumbItem>
          <BreadcrumbLink href="/dashboard" className="flex items-center gap-1">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"
              />
              <polyline points="9,22 9,12 15,12 15,22" />
            </svg>
            Início
          </BreadcrumbLink>
        </BreadcrumbItem>
        {segments.slice(1).map((segment, index) => {
          const isLast = index === segments.length - 2
          const href = "/" + segments.slice(0, index + 2).join("/")
          const label = breadcrumbMap[segment] || segment

          return (
            <div key={segment} className="flex items-center gap-2">
              <BreadcrumbSeparator />
              <BreadcrumbItem>
                {isLast ? (
                  <BreadcrumbPage>{label}</BreadcrumbPage>
                ) : (
                  <BreadcrumbLink href={href}>{label}</BreadcrumbLink>
                )}
              </BreadcrumbItem>
            </div>
          )
        })}
      </BreadcrumbList>
    </Breadcrumb>
  )
}
