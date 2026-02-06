import { CardBrazilLogo } from "@/components/card-brazil-logo"
import { Shield, Heart, Stethoscope, Clock, Users, Activity } from "lucide-react"

export function HeroSection() {
  return (
    <div className="flex flex-col justify-center py-8 px-8 lg:px-16">
      {/* Logo and Brand */}
      <div className="mb-10">
        <CardBrazilLogo variant="full" size="lg" glow />
      </div>

      {/* Main heading */}
      <div className="space-y-6 mb-10">
        <h2 className="text-4xl lg:text-5xl font-bold text-[#f5f5f5] leading-tight text-balance">
          Cuidando da sua saude com{" "}
          <span className="text-gradient">seguranca</span> e{" "}
          <span className="text-gradient">confianca</span>
        </h2>

        <p className="text-lg text-[#a3a3a3] leading-relaxed max-w-xl">
          Oferecemos solucoes completas em seguro de saude, garantindo o melhor atendimento e
          cobertura para voce e sua familia. Nossa plataforma digital facilita o acesso aos seus beneficios.
        </p>
      </div>

      {/* Stats bar */}
      <div className="bg-[#141414] border border-[#262626] rounded-2xl p-6 mb-10 glow-red">
        <h3 className="text-lg font-bold text-[#f5f5f5] mb-4">Por que escolher a CardBrazil?</h3>
        <div className="grid grid-cols-3 gap-6">
          <div className="text-center">
            <div className="text-3xl font-bold text-[#dc2626] mb-1">500K+</div>
            <p className="text-sm text-[#a3a3a3]">Beneficiarios ativos</p>
          </div>
          <div className="text-center">
            <div className="text-3xl font-bold text-[#c2410c] mb-1">15K+</div>
            <p className="text-sm text-[#a3a3a3]">Medicos credenciados</p>
          </div>
          <div className="text-center">
            <div className="text-3xl font-bold text-[#1e3a5f] mb-1">98%</div>
            <p className="text-sm text-[#a3a3a3]">Satisfacao dos clientes</p>
          </div>
        </div>
      </div>

      {/* Benefits */}
      <div className="space-y-4 mb-10">
        <h3 className="text-lg font-semibold text-[#f5f5f5]">Principais beneficios:</h3>
        <div className="grid grid-cols-1 gap-2.5">
          {[
            "Consultas medicas sem carencia",
            "Exames laboratoriais e de imagem",
            "Internacoes hospitalares completas",
            "Atendimento de urgencia e emergencia 24h",
            "Telemedicina e consultas online",
          ].map((benefit) => (
            <div key={benefit} className="flex items-center gap-3">
              <div className="w-2 h-2 bg-[#dc2626] rounded-full shrink-0" />
              <span className="text-[#a3a3a3] text-sm">{benefit}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Feature cards */}
      <div className="grid grid-cols-2 gap-4">
        {[
          { icon: Heart, title: "Cobertura Completa", desc: "Atendimento medico", color: "#dc2626" },
          { icon: Users, title: "Rede Credenciada", desc: "Milhares de medicos", color: "#c2410c" },
          { icon: Shield, title: "Seguranca Total", desc: "Dados protegidos", color: "#1e3a5f" },
          { icon: Stethoscope, title: "Qualidade", desc: "Certificacao ANS", color: "#dc2626" },
        ].map((feature) => (
          <div
            key={feature.title}
            className="flex items-center gap-3 p-4 bg-[#141414] border border-[#262626] rounded-xl hover:border-[#dc2626]/30 transition-all duration-300"
          >
            <div
              className="w-10 h-10 rounded-lg flex items-center justify-center shrink-0"
              style={{ backgroundColor: `${feature.color}15` }}
            >
              <feature.icon className="w-5 h-5" style={{ color: feature.color }} />
            </div>
            <div>
              <h4 className="font-semibold text-[#f5f5f5] text-sm">{feature.title}</h4>
              <p className="text-xs text-[#a3a3a3]">{feature.desc}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
