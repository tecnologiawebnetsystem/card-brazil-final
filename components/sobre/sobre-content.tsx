"use client"

import Link from "next/link"
import { TalentHealthLogo } from "@/components/talent-health-logo"
import {
  ArrowLeft,
  Building2,
  Target,
  Eye,
  Heart,
  TrendingUp,
  Users,
  MapPin,
  Star,
  Quote,
  Shield,
  Zap,
  Clock,
  Award,
  MonitorSmartphone,
  Database,
  HeadphonesIcon,
  ChevronRight,
} from "lucide-react"

const stats = [
  { icon: Building2, value: "500+", label: "Empresas Atendidas", color: "#dc2626" },
  { icon: Users, value: "50k+", label: "Usuarios Cadastrados", color: "#c2410c" },
  { icon: TrendingUp, value: "98%", label: "Satisfacao dos Clientes", color: "#dc2626" },
  { icon: MapPin, value: "10+", label: "Estados no Brasil", color: "#c2410c" },
]

const clients = [
  "Petrobras",
  "Claro",
  "BS2",
  "Caixa Economica",
  "Globo.com",
  "Zurich",
  "HDI",
  "Generali",
  "Excelsior",
  "Ergodata",
  "Alelo",
  "Banco do Brasil Assets",
  "Liberty Seguros",
  "Mercado Livre",
  "JSL",
]

const testimonials = [
  {
    name: "Carlos Eduardo Silva",
    role: "Diretor de TI - Zurich Seguros",
    text: "A WebNetSystem transformou completamente nossa gestao de seguros. O Talent Health e uma ferramenta indispensavel para nosso dia a dia. A equipe sempre se mostrou disponivel e comprometida com resultados.",
    rating: 5,
  },
  {
    name: "Ana Paula Ferreira",
    role: "Gerente de Operacoes - HDI Seguros",
    text: "Trabalhamos com a WebNetSystem ha mais de 8 anos. A qualidade do sistema, aliada ao suporte tecnico excepcional, faz toda a diferenca. O Talent Health nos deu agilidade que nao tinhamos antes.",
    rating: 5,
  },
  {
    name: "Roberto Mendes",
    role: "CEO - Excelsior Corretora",
    text: "O investimento no Talent Health foi o melhor que fizemos. Em poucos meses, conseguimos reduzir custos operacionais em 40% e aumentar significativamente a produtividade da equipe.",
    rating: 5,
  },
  {
    name: "Mariana Santos",
    role: "Coordenadora - Alelo Beneficios",
    text: "A experiencia com a WebNetSystem e sempre positiva. Eles entendem nossas necessidades e entregam solucoes que realmente funcionam. O Talent Health superou todas as nossas expectativas.",
    rating: 5,
  },
]

const whyTalentHealth = [
  {
    icon: Shield,
    title: "Seguranca e Confiabilidade",
    desc: "Dados protegidos com criptografia de ponta, backups automaticos e conformidade com a LGPD.",
  },
  {
    icon: Zap,
    title: "Performance Superior",
    desc: "Sistema otimizado para alta performance, com tempos de resposta inferiores a 200ms.",
  },
  {
    icon: MonitorSmartphone,
    title: "Multiplataforma",
    desc: "Acesse de qualquer dispositivo - desktop, tablet ou smartphone, com interface responsiva.",
  },
  {
    icon: Database,
    title: "Integracao Total",
    desc: "Conecta-se facilmente com ERPs, sistemas legados e APIs de operadoras de saude.",
  },
  {
    icon: HeadphonesIcon,
    title: "Suporte Dedicado",
    desc: "Equipe de suporte tecnico disponivel, com atendimento personalizado e SLA garantido.",
  },
  {
    icon: Clock,
    title: "Atualizacoes Constantes",
    desc: "Novas funcionalidades e melhorias lancadas regularmente, sem custo adicional.",
  },
]

export function SobreContent() {
  return (
    <div className="relative">
      {/* Navigation bar */}
      <nav className="sticky top-0 z-50 bg-[#0a0a0a]/95 backdrop-blur-md border-b border-[#262626]">
        <div className="container mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Link
              href="/"
              className="flex items-center gap-2 text-[#a3a3a3] hover:text-[#dc2626] transition-colors"
            >
              <ArrowLeft className="w-5 h-5" />
              <span className="text-sm font-medium">Voltar</span>
            </Link>
            <div className="w-px h-6 bg-[#262626]" />
            <TalentHealthLogo variant="minimal" size="sm" />
          </div>
          <Link
            href="/"
            className="text-sm font-semibold text-[#dc2626] hover:text-[#ef4444] transition-colors flex items-center gap-1"
          >
            Acessar Sistema
            <ChevronRight className="w-4 h-4" />
          </Link>
        </div>
      </nav>

      {/* Hero / Nossa Historia */}
      <section className="relative py-16 lg:py-24">
        <div className="absolute inset-0 bg-gradient-to-b from-[#dc2626]/5 via-transparent to-transparent" />
        <div className="container mx-auto px-6 relative">
          <div className="bg-[#141414] border border-[#262626] rounded-2xl p-8 lg:p-12">
            <div className="flex items-center gap-3 mb-8">
              <div className="w-10 h-10 bg-[#dc2626]/10 rounded-xl flex items-center justify-center border border-[#dc2626]/20">
                <Building2 className="w-5 h-5 text-[#dc2626]" />
              </div>
              <h2 className="text-2xl lg:text-3xl font-bold text-[#f5f5f5]">Nossa Historia</h2>
            </div>

            <div className="space-y-6 text-[#a3a3a3] leading-relaxed text-base lg:text-lg">
              <p>
                O <span className="text-[#dc2626] font-bold">Talent Health</span> nasceu da experiencia da{" "}
                <span className="text-[#f5f5f5] font-bold">WebNetSystem</span>, empresa fundada em{" "}
                <span className="text-[#f5f5f5] font-bold">2005</span> com o objetivo de levar transformacao
                digital para empresas de todos os portes. Com mais de{" "}
                <span className="text-[#f5f5f5] font-bold">20 anos de experiencia</span> em desenvolvimento
                de sistemas, decidimos revolucionar o mercado de{" "}
                <span className="text-[#dc2626] font-semibold">gestao de saude e seguros</span>.
              </p>

              <p>
                Localizada no{" "}
                <span className="text-[#dc2626] font-semibold underline decoration-[#dc2626]/30 underline-offset-4">
                  Vale do Paraiba
                </span>
                , nossa equipe conhece de perto as necessidades das operadoras de saude, estipulantes e
                corretores da regiao e de todo o Brasil. Desenvolvemos o{" "}
                <span className="text-[#dc2626] font-bold">Talent Health</span> para ser a solucao completa
                que faltava no mercado:{" "}
                <span className="text-[#dc2626] font-semibold underline decoration-[#dc2626]/30 underline-offset-4">
                  gestao de beneficiarios
                </span>
                ,{" "}
                <span className="text-[#dc2626] font-semibold underline decoration-[#dc2626]/30 underline-offset-4">
                  controle financeiro
                </span>
                ,{" "}
                <span className="text-[#dc2626] font-semibold underline decoration-[#dc2626]/30 underline-offset-4">
                  automacao de processos com IA
                </span>
                ,{" "}
                <span className="text-[#dc2626] font-semibold underline decoration-[#dc2626]/30 underline-offset-4">
                  relatorios inteligentes
                </span>{" "}
                e muito mais.
              </p>

              <p>
                Ao longo de duas decadas, construimos uma reputacao solida no mercado de tecnologia,
                atendendo desde pequenas corretoras ate grandes operadoras nacionais. Nossa missao sempre
                foi entregar <span className="text-[#f5f5f5] font-semibold">inovacao com qualidade</span>,
                e o Talent Health e a prova de que tecnologia de ponta pode ser acessivel e eficiente.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Missao, Visao, Valores */}
      <section className="py-12 lg:py-16">
        <div className="container mx-auto px-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              {
                icon: Target,
                title: "Missao",
                text: "Transformar a gestao de saude e seguros atraves da tecnologia, proporcionando mais tempo para o que realmente importa: o cuidado com as pessoas.",
                color: "#dc2626",
              },
              {
                icon: Eye,
                title: "Visao",
                text: "Ser a plataforma de gestao de saude mais utilizada do Brasil, presente em todas as operadoras e corretoras que buscam excelencia e inovacao.",
                color: "#c2410c",
              },
              {
                icon: Heart,
                title: "Valores",
                text: "Inovacao, compromisso com resultados, proximidade com o cliente, seguranca de dados e paixao pelo universo da saude e tecnologia.",
                color: "#dc2626",
              },
            ].map((item) => (
              <div
                key={item.title}
                className="bg-[#141414] border border-[#262626] rounded-2xl p-6 lg:p-8 hover:border-[#dc2626]/30 transition-all duration-300 group"
              >
                <div
                  className="w-12 h-12 rounded-xl flex items-center justify-center mb-5 border transition-colors duration-300"
                  style={{
                    backgroundColor: `${item.color}10`,
                    borderColor: `${item.color}30`,
                  }}
                >
                  <item.icon className="w-6 h-6" style={{ color: item.color }} />
                </div>
                <h3 className="text-xl font-bold text-[#f5f5f5] mb-3">{item.title}</h3>
                <p className="text-[#a3a3a3] leading-relaxed">{item.text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="py-12 lg:py-16">
        <div className="container mx-auto px-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 lg:gap-6">
            {stats.map((stat) => (
              <div
                key={stat.label}
                className="bg-[#141414] border border-[#262626] rounded-2xl p-6 text-center hover:border-[#dc2626]/30 transition-all duration-300 group"
              >
                <div
                  className="w-12 h-12 rounded-xl flex items-center justify-center mx-auto mb-4 border transition-colors duration-300"
                  style={{
                    backgroundColor: `${stat.color}10`,
                    borderColor: `${stat.color}30`,
                  }}
                >
                  <stat.icon className="w-6 h-6" style={{ color: stat.color }} />
                </div>
                <div className="text-3xl lg:text-4xl font-bold mb-2" style={{ color: stat.color }}>
                  {stat.value}
                </div>
                <p className="text-sm text-[#a3a3a3]">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Clientes que Confiam em Nos */}
      <section className="py-12 lg:py-16">
        <div className="container mx-auto px-6">
          <div className="bg-[#141414] border border-[#262626] rounded-2xl p-8 lg:p-12">
            <div className="text-center mb-10">
              <h2 className="text-2xl lg:text-3xl font-bold text-[#f5f5f5] mb-3">
                Clientes que Confiam em Nos
              </h2>
              <p className="text-[#a3a3a3]">
                Empresas de grande porte que escolheram a WebNetSystem
              </p>
            </div>

            <div className="flex flex-wrap justify-center gap-3">
              {clients.map((client) => (
                <div
                  key={client}
                  className="px-5 py-2.5 bg-[#1a1a1a] border border-[#262626] rounded-xl text-sm text-[#a3a3a3] hover:border-[#dc2626]/30 hover:text-[#f5f5f5] hover:bg-[#dc2626]/5 transition-all duration-200 cursor-default"
                >
                  {client}
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Por que criamos o Talent Health */}
      <section className="py-12 lg:py-16">
        <div className="container mx-auto px-6">
          <div className="text-center mb-12">
            <h2 className="text-2xl lg:text-3xl font-bold text-[#f5f5f5] mb-3">
              Por que criamos o Talent Health?
            </h2>
            <p className="text-[#a3a3a3] max-w-2xl mx-auto">
              Apos anos atendendo operadoras de saude e corretoras, identificamos lacunas criticas nos
              sistemas existentes. O Talent Health nasceu para resolver esses problemas de forma definitiva.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {whyTalentHealth.map((item) => (
              <div
                key={item.title}
                className="bg-[#141414] border border-[#262626] rounded-2xl p-6 hover:border-[#dc2626]/30 transition-all duration-300"
              >
                <div className="w-12 h-12 bg-[#dc2626]/10 border border-[#dc2626]/20 rounded-xl flex items-center justify-center mb-4">
                  <item.icon className="w-6 h-6 text-[#dc2626]" />
                </div>
                <h3 className="text-lg font-bold text-[#f5f5f5] mb-2">{item.title}</h3>
                <p className="text-[#a3a3a3] text-sm leading-relaxed">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Depoimentos */}
      <section className="py-12 lg:py-16">
        <div className="container mx-auto px-6">
          <div className="text-center mb-12">
            <h2 className="text-2xl lg:text-3xl font-bold text-[#f5f5f5] mb-3">
              O que dizem sobre a WebNetSystem
            </h2>
            <p className="text-[#a3a3a3]">
              Depoimentos reais de clientes que transformaram seus negocios
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {testimonials.map((t) => (
              <div
                key={t.name}
                className="bg-[#141414] border border-[#262626] rounded-2xl p-6 lg:p-8 hover:border-[#dc2626]/30 transition-all duration-300 relative"
              >
                <Quote className="absolute top-6 right-6 w-8 h-8 text-[#dc2626]/10" />
                <div className="flex items-center gap-1 mb-4">
                  {Array.from({ length: t.rating }).map((_, i) => (
                    <Star
                      key={i}
                      className="w-4 h-4 fill-[#dc2626] text-[#dc2626]"
                    />
                  ))}
                </div>
                <p className="text-[#a3a3a3] leading-relaxed mb-6 italic">
                  {'"'}
                  {t.text}
                  {'"'}
                </p>
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-gradient-to-br from-[#dc2626] to-[#c2410c] flex items-center justify-center text-[#ffffff] font-bold text-sm">
                    {t.name
                      .split(" ")
                      .map((n) => n[0])
                      .slice(0, 2)
                      .join("")}
                  </div>
                  <div>
                    <h4 className="font-semibold text-[#f5f5f5] text-sm">{t.name}</h4>
                    <p className="text-xs text-[#a3a3a3]">{t.role}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA - Conheca o Talent Health */}
      <section className="py-12 lg:py-16">
        <div className="container mx-auto px-6">
          <div className="bg-gradient-to-r from-[#dc2626] to-[#c2410c] rounded-2xl p-8 lg:p-12 text-center relative overflow-hidden">
            <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxnIGZpbGw9IiNmZmZmZmYiIGZpbGwtb3BhY2l0eT0iMC4wNSI+PHBhdGggZD0iTTM2IDM0djItSDI0di0yaDEyem0wLTRWMjhIMjR2Mmgxem0tMi0yVjI2SDI2djJoOHptLTYtMlYyNEgyNnYyaDJ6Ii8+PC9nPjwvZz48L3N2Zz4=')] opacity-30" />
            <div className="relative z-10">
              <Award className="w-12 h-12 text-[#ffffff] mx-auto mb-4 opacity-90" />
              <h2 className="text-2xl lg:text-3xl font-bold text-[#ffffff] mb-3 text-balance">
                Conheca o Talent Health
              </h2>
              <p className="text-[#ffffff]/80 max-w-xl mx-auto mb-8 text-balance">
                Nossa mais recente inovacao: uma plataforma completa de gestao para operadoras de saude,
                estipulantes e corretores de seguros.
              </p>
              <Link
                href="/"
                className="inline-flex items-center gap-2 bg-[#ffffff] text-[#dc2626] font-bold px-8 py-3 rounded-xl hover:bg-[#f5f5f5] transition-colors shadow-lg"
              >
                Acessar o Sistema
                <ChevronRight className="w-5 h-5" />
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
