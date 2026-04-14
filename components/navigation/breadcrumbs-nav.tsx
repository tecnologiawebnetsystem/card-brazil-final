"use client"

import { usePathname } from "next/navigation"
import Link from "next/link"
import { ChevronRight, Home } from "lucide-react"
import {
  Breadcrumb,
  BreadcrumbList,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb"

const routeNames: Record<string, string> = {
  dashboard: "Dashboard",
  cadastros: "Cadastros",
  pessoas: "Pessoas",
  operadora: "Operadoras",
  administradora: "Administradoras",
  estipulante: "Estipulantes",
  corretor: "Corretores",
  agenciador: "Agenciadores",
  planos: "Planos",
  produtos: "Produtos",
  propostas: "Propostas",
  nova: "Nova Proposta",
  lista: "Lista de Propostas",
  pendentes: "Propostas Pendentes",
  analise: "Análise de Propostas",
  aprovadas: "Propostas Aprovadas",
  aprovacao: "Aprovação de Propostas",
  relatorios: "Relatórios",
  beneficiarios: "Beneficiários",
  consulta: "Consulta",
  inclusao: "Inclusão",
  alteracao: "Alteração",
  exclusao: "Exclusão",
  carteirinhas: "Carteirinhas",
  contratos: "Contratos",
  cobranca: "Cobrança",
  financeiro: "Financeiro",
  contabil: "Contábil",
  sistemas: "Sistemas",
  configuracoes: "Configurações",
}

export function BreadcrumbsNav() {
  const pathname = usePathname()

  const segments = pathname.split("/").filter(Boolean)

  if (segments.length === 0 || segments[0] !== "dashboard") {
    return null
  }

  return (
    <Breadcrumb>
      <BreadcrumbList>
        <BreadcrumbItem>
          <BreadcrumbLink asChild>
            <Link href="/dashboard" className="flex items-center gap-1 text-[#737373] hover:text-[#ededed] transition-colors">
              <Home className="h-3.5 w-3.5" />
              <span className="sr-only">Dashboard</span>
            </Link>
          </BreadcrumbLink>
        </BreadcrumbItem>

        {segments.slice(1).map((segment, index) => {
          const href = `/dashboard/${segments.slice(1, index + 2).join("/")}`
          const isLast = index === segments.length - 2
          const name = routeNames[segment] || segment.charAt(0).toUpperCase() + segment.slice(1)

          return (
            <div key={segment} className="flex items-center gap-1.5">
              <BreadcrumbSeparator>
                <ChevronRight className="h-3.5 w-3.5 text-[#525252]" />
              </BreadcrumbSeparator>
              <BreadcrumbItem>
                {isLast ? (
                  <BreadcrumbPage className="text-[#ededed] text-sm">{name}</BreadcrumbPage>
                ) : (
                  <BreadcrumbLink asChild>
                    <Link href={href} className="text-[#737373] hover:text-[#ededed] text-sm transition-colors">{name}</Link>
                  </BreadcrumbLink>
                )}
              </BreadcrumbItem>
            </div>
          )
        })}
      </BreadcrumbList>
    </Breadcrumb>
  )
}
