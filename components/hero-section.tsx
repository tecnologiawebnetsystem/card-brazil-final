export function HeroSection() {
  return (
    <div className="flex flex-col justify-start pt-4 pb-8 px-8 lg:px-12">
      {/* Logo and Brand */}
      <div className="mb-8">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-12 h-12 bg-primary rounded-xl flex items-center justify-center">
            <svg className="w-7 h-7 text-primary-foreground" fill="currentColor" viewBox="0 0 24 24">
              <path d="M12 1L3 5v6c0 5.55 3.84 10.74 9 12 5.16-1.26 9-6.45 9-12V5l-9-4z" />
            </svg>
          </div>
          <h1 className="text-3xl font-bold text-foreground">CardBrazil</h1>
        </div>
        <p className="text-lg text-muted-foreground">Administradora de Seguro de Saúde</p>
      </div>

      {/* Main content */}
      <div className="space-y-6">
        <h2 className="text-4xl lg:text-5xl font-bold text-foreground leading-tight text-balance">
          Cuidando da sua saúde com <span className="text-primary">segurança</span> e{" "}
          <span className="text-primary">confiança</span>
        </h2>

        <p className="text-xl text-muted-foreground leading-relaxed">
          Oferecemos soluções completas em seguro de saúde, garantindo o melhor atendimento e cobertura para você e sua
          família. Nossa plataforma digital facilita o acesso aos seus benefícios.
        </p>

        <div className="bg-gradient-to-r from-primary/5 to-primary/10 rounded-2xl p-6 my-8">
          <h3 className="text-2xl font-bold text-foreground mb-4">Por que escolher a CardBrazil?</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="text-center">
              <div className="text-3xl font-bold text-primary mb-2">500K+</div>
              <p className="text-sm text-muted-foreground">Beneficiários ativos</p>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-primary mb-2">15K+</div>
              <p className="text-sm text-muted-foreground">Médicos credenciados</p>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-primary mb-2">98%</div>
              <p className="text-sm text-muted-foreground">Satisfação dos clientes</p>
            </div>
          </div>
        </div>

        <div className="space-y-4">
          <h3 className="text-xl font-semibold text-foreground">Principais benefícios:</h3>
          <div className="grid grid-cols-1 gap-3">
            <div className="flex items-center gap-3">
              <div className="w-2 h-2 bg-primary rounded-full"></div>
              <span className="text-muted-foreground">Consultas médicas sem carência</span>
            </div>
            <div className="flex items-center gap-3">
              <div className="w-2 h-2 bg-primary rounded-full"></div>
              <span className="text-muted-foreground">Exames laboratoriais e de imagem</span>
            </div>
            <div className="flex items-center gap-3">
              <div className="w-2 h-2 bg-primary rounded-full"></div>
              <span className="text-muted-foreground">Internações hospitalares completas</span>
            </div>
            <div className="flex items-center gap-3">
              <div className="w-2 h-2 bg-primary rounded-full"></div>
              <span className="text-muted-foreground">Atendimento de urgência e emergência 24h</span>
            </div>
            <div className="flex items-center gap-3">
              <div className="w-2 h-2 bg-primary rounded-full"></div>
              <span className="text-muted-foreground">Telemedicina e consultas online</span>
            </div>
          </div>
        </div>

        {/* Features */}
        <div className="grid grid-cols-2 gap-4 mt-8">
          <div className="flex items-center gap-3 p-4 bg-card rounded-lg border">
            <svg className="w-6 h-6 text-primary" fill="currentColor" viewBox="0 0 24 24">
              <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
            </svg>
            <div>
              <h3 className="font-semibold text-card-foreground">Cobertura Completa</h3>
              <p className="text-sm text-muted-foreground">Atendimento médico</p>
            </div>
          </div>

          <div className="flex items-center gap-3 p-4 bg-card rounded-lg border">
            <svg className="w-6 h-6 text-primary" fill="currentColor" viewBox="0 0 24 24">
              <path d="M16 4c0-1.11.89-2 2-2s2 .89 2 2-.89 2-2 2-2-.89-2-2zM4 18v-4h3v4h2v-7.5c0-.83.67-1.5 1.5-1.5S12 9.67 12 10.5V18h2v-4h3v4h2V10.5c0-1.93-1.57-3.5-3.5-3.5S12 8.57 12 10.5V18H4z" />
            </svg>
            <div>
              <h3 className="font-semibold text-card-foreground">Rede Credenciada</h3>
              <p className="text-sm text-muted-foreground">Milhares de médicos</p>
            </div>
          </div>

          <div className="flex items-center gap-3 p-4 bg-card rounded-lg border">
            <svg className="w-6 h-6 text-primary" fill="currentColor" viewBox="0 0 24 24">
              <path d="M12 1L3 5v6c0 5.55 3.84 10.74 9 12 5.16-1.26 9-6.45 9-12V5l-9-4z" />
            </svg>
            <div>
              <h3 className="font-semibold text-card-foreground">Segurança Total</h3>
              <p className="text-sm text-muted-foreground">Dados protegidos</p>
            </div>
          </div>

          <div className="flex items-center gap-3 p-4 bg-card rounded-lg border">
            <svg className="w-6 h-6 text-primary" fill="currentColor" viewBox="0 0 24 24">
              <path d="M5 16L3 5h5.5l1.5 9 1.5-9H17l-2 11H5zm7-13.5L9.5 9h5L12 2.5z" />
            </svg>
            <div>
              <h3 className="font-semibold text-card-foreground">Qualidade</h3>
              <p className="text-sm text-muted-foreground">Certificação ANS</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
