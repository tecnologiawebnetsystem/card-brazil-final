export function Footer() {
  return (
    <footer className="bg-gradient-to-r from-muted/30 to-muted/50 border-t border-border/50 backdrop-blur-sm">
      <div className="container mx-auto px-6 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">
          {/* Brand */}
          <div className="space-y-6">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-gradient-to-br from-primary to-primary/80 rounded-xl flex items-center justify-center shadow-lg shadow-primary/25">
                <svg className="w-7 h-7 text-primary-foreground" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"
                  />
                </svg>
              </div>
              <h3 className="text-2xl font-bold text-foreground">CardBrazil</h3>
            </div>
            <p className="text-muted-foreground leading-relaxed">
              Administradora de Seguro de Saúde comprometida com o seu bem-estar e tranquilidade.
            </p>
            <div className="flex gap-3">
              <div className="w-10 h-10 bg-primary/10 rounded-xl flex items-center justify-center hover:bg-primary/20 transition-all duration-200 cursor-pointer group shadow-sm">
                <svg
                  className="w-5 h-5 text-primary group-hover:scale-110 transition-transform"
                  fill="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.367-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
                </svg>
              </div>
              <div className="w-10 h-10 bg-primary/10 rounded-xl flex items-center justify-center hover:bg-primary/20 transition-all duration-200 cursor-pointer group shadow-sm">
                <svg
                  className="w-5 h-5 text-primary group-hover:scale-110 transition-transform"
                  fill="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path d="M12.017 0C5.396 0 .029 5.367.029 11.987c0 5.079 3.158 9.417 7.618 11.174-.105-.949-.199-2.403.041-3.439.219-.937 1.406-5.957 1.406-5.957s-.359-.72-.359-1.781c0-1.663.967-2.911 2.168-2.911 1.024 0 1.518.769 1.518 1.688 0 1.029-.653 2.567-.992 3.992-.285 1.193.6 2.165 1.775 2.165 2.128 0 3.768-2.245 3.768-5.487 0-2.861-2.063-4.869-5.008-4.869-3.41 0-5.409 2.562-5.409 5.199 0 1.033.394 2.143.889 2.741.097.118.112.221.085.345-.09.375-.293 1.199-.334 1.363-.053.225-.172.271-.402.165-1.495-.69-2.433-2.878-2.433-4.646 0-3.776 2.748-7.252 7.92-7.252 4.158 0 7.392 2.967 7.392 6.923 0 4.135-2.607 7.462-6.233 7.462-1.214 0-2.357-.629-2.746-1.378l-.748 2.853c-.271 1.043-1.002 2.35-1.492 3.146C9.57 23.812 10.763 24.009 12.017 24c6.624 0 11.99-5.367 11.99-12.013C24.007 5.367 18.641.001.017 0z" />
                </svg>
              </div>
              <div className="w-10 h-10 bg-primary/10 rounded-xl flex items-center justify-center hover:bg-primary/20 transition-all duration-200 cursor-pointer group shadow-sm">
                <svg
                  className="w-5 h-5 text-primary group-hover:scale-110 transition-transform"
                  fill="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
                </svg>
              </div>
            </div>
          </div>

          {/* Services */}
          <div className="space-y-6">
            <h4 className="text-xl font-semibold text-foreground">Nossos Serviços</h4>
            <ul className="space-y-3 text-muted-foreground">
              <li className="hover:text-primary transition-colors cursor-pointer hover:translate-x-1 transition-transform duration-200">
                Planos Individuais
              </li>
              <li className="hover:text-primary transition-colors cursor-pointer hover:translate-x-1 transition-transform duration-200">
                Planos Empresariais
              </li>
              <li className="hover:text-primary transition-colors cursor-pointer hover:translate-x-1 transition-transform duration-200">
                Rede Credenciada
              </li>
            </ul>
          </div>

          {/* Support */}
          <div className="space-y-6">
            <h4 className="text-xl font-semibold text-foreground">Suporte</h4>
            <ul className="space-y-3 text-muted-foreground">
              <li className="hover:text-primary transition-colors cursor-pointer hover:translate-x-1 transition-transform duration-200">
                Central de Ajuda
              </li>
              <li className="hover:text-primary transition-colors cursor-pointer hover:translate-x-1 transition-transform duration-200">
                Como usar
              </li>
              <li className="hover:text-primary transition-colors cursor-pointer hover:translate-x-1 transition-transform duration-200">
                Dúvidas Frequentes
              </li>
              <li className="hover:text-primary transition-colors cursor-pointer hover:translate-x-1 transition-transform duration-200">
                Fale Conosco
              </li>
              <li className="hover:text-primary transition-colors cursor-pointer hover:translate-x-1 transition-transform duration-200">
                Ouvidoria
              </li>
            </ul>
          </div>

          {/* Contact */}
          <div className="space-y-6">
            <h4 className="text-xl font-semibold text-foreground">Contato</h4>
            <div className="space-y-4">
              <div className="flex items-center gap-4 text-muted-foreground group">
                <div className="w-10 h-10 bg-primary/10 rounded-xl flex items-center justify-center group-hover:bg-primary/20 transition-colors">
                  <svg className="w-5 h-5 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"
                    />
                  </svg>
                </div>
                <span className="font-medium">0800 123 4567</span>
              </div>
              <div className="flex items-center gap-4 text-muted-foreground group">
                <div className="w-10 h-10 bg-primary/10 rounded-xl flex items-center justify-center group-hover:bg-primary/20 transition-colors">
                  <svg className="w-5 h-5 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                    />
                  </svg>
                </div>
                <span className="font-medium">contato@cardbrazil.com.br</span>
              </div>
              <div className="flex items-start gap-4 text-muted-foreground group">
                <div className="w-10 h-10 bg-primary/10 rounded-xl flex items-center justify-center group-hover:bg-primary/20 transition-colors mt-0.5">
                  <svg className="w-5 h-5 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                    />
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                    />
                  </svg>
                </div>
                <span className="font-medium">
                  Av. Paulista, 1000
                  <br />
                  São Paulo - SP
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom */}
        <div className="border-t border-border/50 mt-12 pt-8 flex flex-col md:flex-row justify-between items-center gap-6">
          <p className="text-muted-foreground font-medium">© 2024 CardBrazil. Todos os direitos reservados.</p>
          <div className="flex gap-8 font-medium text-muted-foreground">
            <span className="hover:text-primary transition-colors cursor-pointer">ANS: 12345</span>
          </div>
        </div>
      </div>
    </footer>
  )
}
