"use client"
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from "@/components/ui/sidebar"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Button } from "@/components/ui/button"
import { useAuth } from "@/contexts/auth-context"
import { useState } from "react"
import { ChevronDown, ChevronRight, ChevronUp, Menu, X } from "lucide-react"

const LayoutDashboardIcon = () => (
  <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <rect x="3" y="3" width="7" height="7" />
    <rect x="14" y="3" width="7" height="7" />
    <rect x="14" y="14" width="7" height="7" />
    <rect x="3" y="14" width="7" height="7" />
  </svg>
)

const UsersIcon = () => (
  <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z"
    />
  </svg>
)

const BuildingIcon = () => (
  <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"
    />
  </svg>
)

const ShieldIcon = () => (
  <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"
    />
  </svg>
)

const BriefcaseIcon = () => (
  <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2-2v2m8 0H8m8 0v2a2 2 0 01-2 2H10a2 2 0 01-2-2V6m8 0H8m0 0H5a2 2 0 00-2 2v6a2 2 0 002 2h14a2 2 0 002-2V8a2 2 0 00-2-2h-3"
    />
  </svg>
)

const DollarSignIcon = () => (
  <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <line x1="12" y1="1" x2="12" y2="23" />
    <path d="M17 5H9.5a3.5 3.5 0 000 7h5a3.5 3.5 0 010 7H6" />
  </svg>
)

const FileTextIcon = () => (
  <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="M9 12h6m-6 4h6m2 5H7a2 2 0 00-2-2V5a2 2 0 002-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
    />
  </svg>
)

const BarChartIcon = () => (
  <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <line x1="12" y1="20" x2="12" y2="10" />
    <line x1="18" y1="20" x2="18" y2="4" />
    <line x1="6" y1="20" x2="6" y2="16" />
  </svg>
)

const CogIcon = () => (
  <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c.426 1.756 2.924 1.756 0 3.35a1.724 1.724 0 00-1.066 2.573c-.94 1.543.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"
    />
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
  </svg>
)

const CarteirinhaIcon = () => (
  <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 2v20M14 2v20M4 7h16M4 17h16" />
  </svg>
)

const menuItems = [
  {
    title: "Principal",
    items: [
      {
        title: "Dashboard",
        url: "/dashboard",
        icon: <LayoutDashboardIcon />,
        requiredPermission: null,
      },
      {
        title: "Pessoas",
        url: "/dashboard/pessoas",
        icon: <UsersIcon />,
        requiredPermission: null,
      },
      {
        title: "Sobre o Sistema",
        url: "/dashboard/sobre",
        icon: <FileTextIcon />,
        requiredPermission: null,
      },
    ],
  },
  {
    title: "Cadastros",
    items: [
      {
        title: "Entidades",
        icon: <BuildingIcon />,
        subItems: [
          { title: "Operadora", url: "/dashboard/cadastros/operadora", icon: <CarteirinhaIcon className="h-3 w-3" /> },
          {
            title: "Administradora",
            url: "/dashboard/cadastros/administradora",
            icon: <BuildingIcon className="h-3 w-3" />,
          },
          { title: "Estipulante", url: "/dashboard/cadastros/estipulante", icon: <FileTextIcon className="h-3 w-3" /> },
          { title: "Agenciador", url: "/dashboard/cadastros/agenciador", icon: <UsersIcon className="h-3 w-3" /> },
          { title: "Corretor", url: "/dashboard/cadastros/corretor", icon: <UsersIcon className="h-3 w-3" /> },
        ],
      },
      {
        title: "Produtos e Serviços",
        icon: <FileTextIcon />,
        subItems: [
          { title: "Produtos", url: "/dashboard/cadastros/produtos", icon: <CogIcon className="h-3 w-3" /> },
          { title: "Planos", url: "/dashboard/cadastros/planos", icon: <CogIcon className="h-3 w-3" /> },
          { title: "Plano Faixa", url: "/dashboard/cadastros/planos-faixa", icon: <CogIcon className="h-3 w-3" /> },
          { title: "Convênios", url: "/dashboard/cadastros/convenios", icon: <CogIcon className="h-3 w-3" /> },
        ],
      },
      {
        title: "Parâmetros Técnicos",
        icon: <CogIcon />,
        subItems: [],
      },
    ],
  },
  {
    title: "Propostas",
    items: [
      {
        title: "Gestão de Propostas",
        icon: <CogIcon />,
        subItems: [
          { title: "Nova Proposta", url: "/dashboard/propostas/nova", icon: <CogIcon className="h-3 w-3" /> },
          { title: "Lista de Propostas", url: "/dashboard/propostas/lista", icon: <CogIcon className="h-3 w-3" /> },
          {
            title: "Propostas Pendentes",
            url: "/dashboard/propostas/pendentes",
            icon: <CogIcon className="h-3 w-3" />,
          },
          { title: "Análise de Propostas", url: "/dashboard/propostas/analise", icon: <CogIcon className="h-3 w-3" /> },
          {
            title: "Propostas Aprovadas",
            url: "/dashboard/propostas/aprovadas",
            icon: <CogIcon className="h-3 w-3" />,
          },
          {
            title: "Aprovação de Propostas",
            url: "/dashboard/propostas/aprovacao",
            icon: <CogIcon className="h-3 w-3" />,
          },
        ],
      },
      {
        title: "Relatórios",
        icon: <CogIcon />,
        subItems: [
          {
            title: "Relatório de Propostas",
            url: "/dashboard/propostas/relatorios",
            icon: <CogIcon className="h-3 w-3" />,
          },
        ],
      },
    ],
  },
  {
    title: "Tabelas Gerais",
    items: [
      {
        title: "Códigos e Classificações",
        icon: <CogIcon />,
        subItems: [
          {
            title: "CEP - Códigos de Endereçamento",
            url: "/dashboard/tabelas/cep",
            icon: <CogIcon className="h-3 w-3" />,
          },
          {
            title: "Bancos e Agências",
            url: "/dashboard/tabelas/bancos-agencias",
            icon: <CogIcon className="h-3 w-3" />,
          },
          {
            title: "Cotação de Moedas",
            url: "/dashboard/tabelas/cotacao-moedas",
            icon: <CogIcon className="h-3 w-3" />,
          },
          { title: "Feriados", url: "/dashboard/tabelas/feriados", icon: <CogIcon className="h-3 w-3" /> },
        ],
      },
      {
        title: "Tabelas ANS",
        icon: <ShieldIcon />,
        subItems: [],
      },
    ],
  },
  {
    title: "Beneficiários",
    items: [
      {
        title: "Beneficiário Titular",
        url: "/dashboard/beneficiarios/titular",
        icon: <UsersIcon />,
      },
      {
        title: "Dependentes",
        url: "/dashboard/beneficiarios/dependentes",
        icon: <UsersIcon />,
      },
      {
        title: "Consulta",
        url: "/dashboard/beneficiarios/consulta",
        icon: <FileTextIcon />,
      },
    ],
  },
  {
    title: "Financeiro",
    items: [
      {
        title: "Contas a Pagar",
        url: "/dashboard/financeiro/contas-pagar",
        icon: <DollarSignIcon />,
      },
      {
        title: "Contas a Receber",
        url: "/dashboard/financeiro/contas-receber",
        icon: <DollarSignIcon />,
      },
      {
        title: "Cobrança Judicial",
        url: "/dashboard/financeiro/conta-judicial",
        icon: <FileTextIcon />,
      },
      {
        title: "Fluxo de Caixa",
        url: "/dashboard/financeiro/fluxo-caixa",
        icon: <BarChartIcon />,
      },
      {
        title: "Multas e Juros",
        url: "/dashboard/financeiro/multas-juros",
        icon: <DollarSignIcon />,
      },
    ],
  },
  {
    title: "Cobrança",
    items: [
      {
        title: "Cobrança",
        icon: <FileTextIcon />,
        subItems: [
          {
            title: "Geração de Boletos",
            url: "/dashboard/cobranca/gerar-boletos",
            icon: <CogIcon className="h-3 w-3" />,
          },
          {
            title: "Aviso de Crédito",
            url: "/dashboard/cobranca/aviso-credito",
            icon: <CogIcon className="h-3 w-3" />,
          },
          {
            title: "Arquivos Lote",
            url: "/dashboard/cobranca/lotes-aviso-credito",
            icon: <CogIcon className="h-3 w-3" />,
          },
          {
            title: "Baixa Pagamento",
            url: "/dashboard/cobranca/baixa-pagamento",
            icon: <CogIcon className="h-3 w-3" />,
          },
          {
            title: "Controle de Inadimplência",
            url: "/dashboard/cobranca/inadimplencia",
            icon: <CogIcon className="h-3 w-3" />,
          },
          {
            title: "Acordo Pagamento",
            url: "/dashboard/cobranca/negociacao-debitos",
            icon: <CogIcon className="h-3 w-3" />,
          },
          {
            title: "Histórico de Pagamentos",
            url: "/dashboard/cobranca/historico-pagamentos",
            icon: <CogIcon className="h-3 w-3" />,
          },
          {
            title: "Protesto de Títulos",
            url: "/dashboard/cobranca/protesto-titulos",
            icon: <CogIcon className="h-3 w-3" />,
          },
          {
            title: "Consulta Boletos",
            url: "/dashboard/cobranca/consultar-boletos",
            icon: <CogIcon className="h-3 w-3" />,
          },
        ],
      },
      {
        title: "Configurações de Cobrança",
        icon: <CogIcon />,
        subItems: [
          {
            title: "Relatórios de Cobrança",
            url: "/dashboard/cobranca/relatorios",
            icon: <CogIcon className="h-3 w-3" />,
          },
        ],
      },
    ],
  },
  {
    title: "Sistema Contábil",
    items: [
      {
        title: "Estrutura Contábil",
        icon: <FileTextIcon />,
        subItems: [
          {
            title: "Plano de Contas",
            url: "/dashboard/contabil/plano-contas",
            icon: <CogIcon className="h-3 w-3" />,
          },
          { title: "Cadastro de Eventos", url: "/dashboard/contabil/eventos", icon: <CogIcon className="h-3 w-3" /> },
          {
            title: "Objetos de Contabilização",
            url: "/dashboard/contabil/objetos-contabilizacao",
            icon: <CogIcon className="h-3 w-3" />,
          },
        ],
      },
      {
        title: "Lançamentos",
        icon: <CogIcon />,
        subItems: [
          {
            title: "Lançamentos Contábeis",
            url: "/dashboard/contabil/lancamentos",
            icon: <CogIcon className="h-3 w-3" />,
          },
          {
            title: "Lançamentos do Mês",
            url: "/dashboard/contabil/lancamentos-mes",
            icon: <CogIcon className="h-3 w-3" />,
          },
          {
            title: "Ajustes Manuais",
            url: "/dashboard/contabil/ajustes-manuais",
            icon: <CogIcon className="h-3 w-3" />,
          },
        ],
      },
      {
        title: "Relatórios Contábeis",
        icon: <CogIcon />,
        subItems: [
          { title: "Balancetes", url: "/dashboard/contabil/balancetes", icon: <CogIcon className="h-3 w-3" /> },
          { title: "DRE", url: "/dashboard/contabil/dre", icon: <CogIcon className="h-3 w-3" /> },
          {
            title: "Balanço Patrimonial",
            url: "/dashboard/contabil/balanco-patrimonial",
            icon: <CogIcon className="h-3 w-3" />,
          },
          { title: "Razão Contábil", url: "/dashboard/contabil/razao", icon: <CogIcon className="h-3 w-3" /> },
          { title: "Diário Contábil", url: "/dashboard/contabil/diario", icon: <CogIcon className="h-3 w-3" /> },
        ],
      },
      {
        title: "Análises e Controles",
        icon: <CogIcon />,
        subItems: [
          {
            title: "Comparação Razão/Balancete",
            url: "/dashboard/contabil/comparacao-razao",
            icon: <CogIcon className="h-3 w-3" />,
          },
          {
            title: "Análise Débito/Crédito",
            url: "/dashboard/contabil/analise-debito-credito",
            icon: <CogIcon className="h-3 w-3" />,
          },
          {
            title: "Divergências Contábil x ERP",
            url: "/dashboard/contabil/divergencias-erp",
            icon: <CogIcon className="h-3 w-3" />,
          },
          {
            title: "Correção de Divergências",
            url: "/dashboard/contabil/correcao-divergencias",
            icon: <CogIcon className="h-3 w-3" />,
          },
        ],
      },
      {
        title: "Regulamentação ANS",
        icon: <ShieldIcon />,
        subItems: [
          {
            title: "Provisões Técnicas",
            url: "/dashboard/contabil/provisoes-tecnicas",
            icon: <CogIcon className="h-3 w-3" />,
          },
          { title: "Quadros ANS", url: "/dashboard/contabil/quadros-ans", icon: <CogIcon className="h-3 w-3" /> },
          {
            title: "Conformidade ANS",
            url: "/dashboard/contabil/conformidade-ans",
            icon: <CogIcon className="h-3 w-3" />,
          },
        ],
      },
    ],
  },
  {
    title: "Sistemas",
    items: [
      {
        title: "Integra����������ão ANS",
        icon: <CogIcon />,
        subItems: [
          {
            title: "Sincronização ANS",
            url: "/dashboard/sistemas/sincronizacao-ans",
            icon: <CogIcon className="h-3 w-3" />,
          },
        ],
      },
      {
        title: "Monitoramento",
        icon: <CogIcon />,
        subItems: [
          {
            title: "Performance do Sistema",
            url: "/dashboard/sistemas/performance",
            icon: <CogIcon className="h-3 w-3" />,
          },
        ],
      },
      {
        title: "Segurança",
        icon: <ShieldIcon />,
        subItems: [
          {
            title: "Controle de Acesso",
            url: "/dashboard/sistemas/controle-acesso",
            icon: <CogIcon className="h-3 w-3" />,
          },
          {
            title: "Perfis de Usuário",
            url: "/dashboard/sistemas/perfis-usuario",
            icon: <CogIcon className="h-3 w-3" />,
          },
          {
            title: "Logs de Segurança",
            url: "/dashboard/sistemas/logs-seguranca",
            icon: <CogIcon className="h-3 w-3" />,
          },
        ],
      },
    ],
  },
  {
    title: "Relatórios",
    items: [
      {
        title: "Relatórios Gerenciais",
        url: "/dashboard/relatorios/gerenciais",
        icon: <CogIcon />,
      },
      {
        title: "Relatórios Inteligentes",
        url: "/dashboard/relatorios/inteligentes",
        icon: <CogIcon />,
      },
    ],
  },
  {
    title: "Configurações",
    items: [
      {
        title: "Administração de Usuários",
        icon: <UsersIcon />,
        subItems: [
          {
            title: "Cadastro de Usuários",
            url: "/dashboard/configuracoes/usuarios",
            icon: <CogIcon className="h-3 w-3" />,
          },
          {
            title: "Grupos de Usuários",
            url: "/dashboard/configuracoes/grupos-usuarios",
            icon: <CogIcon className="h-3 w-3" />,
          },
          {
            title: "Permissões de Acesso",
            url: "/dashboard/configuracoes/permissoes",
            icon: <CogIcon className="h-3 w-3" />,
          },
        ],
      },
    ],
  },
]

type AppSidebarProps = {}

export function AppSidebar() {
  const { state, isMobile, toggleSidebar } = useSidebar()
  const { user, logout } = useAuth()
  const [expandedGroups, setExpandedGroups] = useState<Record<string, boolean>>({
    Principal: true,
    Cadastros: true,
    Propostas: true,
    "Tabelas Gerais": true,
    Beneficiários: true,
    Financeiro: true,
    Cobrança: true,
    "Sistema Contábil": true,
    Sistemas: true,
    Relatórios: true,
    Configurações: true,
  })

  const toggleGroupExpansion = (groupTitle: string) => {
    setExpandedGroups((prev) => ({
      ...prev,
      [groupTitle]: !prev[groupTitle],
    }))
  }

  const filterMenuItems = (items: any[]) => {
    return items.filter((item) => {
      if (!item.requiredPermission) return true
      return user?.permissions?.[item.requiredPermission] === true
    })
  }

  const filterMenuGroups = (groups: any[]) => {
    return groups
      .map((group) => ({
        ...group,
        items: filterMenuItems(group.items),
      }))
      .filter((group) => group.items.length > 0)
  }

  const filteredMenuItems = user ? filterMenuGroups(menuItems) : menuItems

  const getProfileDisplayName = (roleName: string) => {
    return roleName || "Usuário"
  }

  return (
    <>
      {isMobile && (
        <Button variant="ghost" size="sm" className="fixed top-4 left-4 z-50 md:hidden" onClick={toggleSidebar}>
          {state === "expanded" ? <X className="h-4 w-4" /> : <Menu className="h-4 w-4" />}
        </Button>
      )}

      <Sidebar variant="inset" className="border-r border-[#1a1a1a] bg-[#0a0a0a]">
        <SidebarHeader className="border-b border-[#1a1a1a] p-4">
          <div className="flex items-center gap-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-[#00d084]">
              <svg className="h-5 w-5 text-black" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"
                />
              </svg>
            </div>
            <div>
              <h1 className="text-base font-semibold text-[#ededed]">
                Talent Health
              </h1>
              <p className="text-xs text-[#737373]">Sistema de Gestao</p>
            </div>
          </div>
        </SidebarHeader>
        <SidebarContent className="px-2 py-2">
          {filteredMenuItems.map((group) => (
            <SidebarGroup key={group.title} className="mb-2">
              <SidebarGroupLabel
                className="mb-1 flex cursor-pointer items-center justify-between rounded-md px-3 py-1.5 text-xs font-medium uppercase tracking-wider text-[#737373] hover:text-[#a1a1a1] transition-colors"
                onClick={() => toggleGroupExpansion(group.title)}
              >
                <span>{group.title}</span>
                {expandedGroups[group.title] ? (
                  <ChevronDown className="h-3.5 w-3.5" />
                ) : (
                  <ChevronRight className="h-3.5 w-3.5" />
                )}
              </SidebarGroupLabel>
              {expandedGroups[group.title] && (
                <SidebarGroupContent>
                  <SidebarMenu className="space-y-0.5">
                    {group.items.map((item) => (
                      <SidebarMenuItem key={item.title}>
                        {item.subItems ? (
                          <div className="flex flex-col space-y-0.5">
                            {item.subItems.map((subItem) => (
                              <SidebarMenuButton
                                key={subItem.title}
                                asChild
                                className="rounded-md hover:bg-[#1a1a1a] transition-colors h-8"
                              >
                                <a href={subItem.url} className="flex items-center gap-3 px-3 py-1.5">
                                  <span className="text-[#737373]">{subItem.icon || item.icon}</span>
                                  <span className="text-sm text-[#a1a1a1] hover:text-[#ededed] transition-colors">
                                    {subItem.title}
                                  </span>
                                </a>
                              </SidebarMenuButton>
                            ))}
                          </div>
                        ) : (
                          <SidebarMenuButton
                            asChild
                            className="rounded-md hover:bg-[#1a1a1a] transition-colors h-8"
                          >
                            <a href={item.url} className="flex items-center gap-3 px-3 py-1.5">
                              <span className="text-[#737373]">{item.icon}</span>
                              <span className="text-sm text-[#a1a1a1] hover:text-[#ededed] transition-colors">
                                {item.title}
                              </span>
                            </a>
                          </SidebarMenuButton>
                        )}
                      </SidebarMenuItem>
                    ))}
                  </SidebarMenu>
                </SidebarGroupContent>
              )}
            </SidebarGroup>
          ))}
        </SidebarContent>
        <SidebarFooter className="border-t border-[#1a1a1a] bg-[#0a0a0a] p-3">
          {user && (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="ghost"
                  className="w-full justify-start gap-3 rounded-lg hover:bg-[#1a1a1a] transition-colors h-auto py-2"
                >
                  <Avatar className="h-8 w-8">
                    <AvatarImage src="/images/user-avatar.jpg" alt={user.nome} />
                    <AvatarFallback className="bg-[#00d084] text-black text-xs font-semibold">
                      {user.nome
                        ? user.nome
                            .split(" ")
                            .map((n) => n[0])
                            .join("")
                            .toUpperCase()
                        : "U"}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex flex-col items-start text-left">
                    <span className="text-sm font-medium text-[#ededed]">{user.nome}</span>
                    <span className="text-xs text-[#737373]">{getProfileDisplayName(user.role_nome)}</span>
                  </div>
                  <ChevronUp className="ml-auto h-4 w-4 text-[#737373]" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-56 rounded-lg bg-[#0a0a0a] border-[#262626]">
                <DropdownMenuLabel className="text-[#ededed]">Minha Conta</DropdownMenuLabel>
                <DropdownMenuSeparator className="bg-[#262626]" />
                <DropdownMenuItem
                  className="rounded-md hover:bg-[#1a1a1a] transition-colors cursor-pointer text-[#a1a1a1]"
                  onClick={() => (window.location.href = "/dashboard/perfil")}
                >
                  <span>Perfil</span>
                </DropdownMenuItem>
                <DropdownMenuItem
                  className="rounded-md hover:bg-[#1a1a1a] transition-colors cursor-pointer text-[#a1a1a1]"
                  onClick={() => (window.location.href = "/dashboard/configuracoes")}
                >
                  <span>Configuracoes</span>
                </DropdownMenuItem>
                <DropdownMenuSeparator className="bg-[#262626]" />
                <DropdownMenuItem
                  className="rounded-md hover:bg-[#1a1a1a] text-[#00d084] transition-colors cursor-pointer"
                  onClick={logout}
                >
                  <span>Sair</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          )}
        </SidebarFooter>
      </Sidebar>

      {isMobile && state === "expanded" && (
        <div className="fixed inset-0 bg-black/20 z-30 md:hidden" onClick={toggleSidebar} />
      )}
    </>
  )
}
