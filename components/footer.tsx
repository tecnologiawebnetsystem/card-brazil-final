import Link from "next/link"
import { TalentHealthLogo } from "@/components/talent-health-logo"

export function Footer() {
  return (
    <footer className="bg-[#0a0a0a] border-t border-[#262626]">
      <div className="container mx-auto px-6 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">
          {/* Brand */}
          <div className="space-y-6">
            <TalentHealthLogo variant="full" size="md" />
            <p className="text-[#a3a3a3] leading-relaxed">
              Administradora de Seguro de Saude comprometida com o seu bem-estar e tranquilidade.
            </p>
            <div className="flex gap-3">
              {[
                "M24 12.073c0-6.627-5.373-12-12-12s-12 5.367-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z",
                "M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z",
              ].map((path, i) => (
                <div
                  key={i}
                  className="w-10 h-10 bg-[#1a1a1a] border border-[#262626] rounded-xl flex items-center justify-center hover:bg-[#dc2626]/10 hover:border-[#dc2626]/30 transition-all duration-200 cursor-pointer group"
                >
                  <svg
                    className="w-5 h-5 text-[#a3a3a3] group-hover:text-[#dc2626] transition-colors"
                    fill="currentColor"
                    viewBox="0 0 24 24"
                    aria-hidden="true"
                  >
                    <path d={path} />
                  </svg>
                </div>
              ))}
            </div>
          </div>

          {/* Services */}
          <div className="space-y-6">
            <h4 className="text-lg font-semibold text-[#f5f5f5]">Nossos Servicos</h4>
            <ul className="space-y-3 text-[#a3a3a3]">
              {["Planos Individuais", "Planos Empresariais", "Rede Credenciada"].map((item) => (
                <li
                  key={item}
                  className="hover:text-[#dc2626] transition-colors cursor-pointer hover:translate-x-1 transition-transform duration-200"
                >
                  {item}
                </li>
              ))}
            </ul>
          </div>

          {/* Support */}
          <div className="space-y-6">
            <h4 className="text-lg font-semibold text-[#f5f5f5]">Suporte</h4>
            <ul className="space-y-3 text-[#a3a3a3]">
              {["Central de Ajuda", "Como usar", "Duvidas Frequentes", "Fale Conosco", "Ouvidoria"].map((item) => (
                <li
                  key={item}
                  className="hover:text-[#dc2626] transition-colors cursor-pointer hover:translate-x-1 transition-transform duration-200"
                >
                  {item}
                </li>
              ))}
              <li className="hover:text-[#dc2626] transition-colors hover:translate-x-1 transition-transform duration-200">
                <Link href="/sobre" className="inline-block">
                  Sobre Nos
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact */}
          <div className="space-y-6">
            <h4 className="text-lg font-semibold text-[#f5f5f5]">Contato</h4>
            <div className="space-y-4">
              {[
                { icon: "phone", label: "0800 123 4567" },
                { icon: "email", label: "contato@talenthealth.com.br" },
                { icon: "location", label: "Av. Paulista, 1000\nSao Paulo - SP" },
              ].map((contact) => (
                <div key={contact.icon} className="flex items-start gap-4 text-[#a3a3a3] group">
                  <div className="w-10 h-10 bg-[#1a1a1a] border border-[#262626] rounded-xl flex items-center justify-center group-hover:bg-[#dc2626]/10 group-hover:border-[#dc2626]/30 transition-colors shrink-0">
                    <svg className="w-5 h-5 text-[#dc2626]" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                      {contact.icon === "phone" && (
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"
                        />
                      )}
                      {contact.icon === "email" && (
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                        />
                      )}
                      {contact.icon === "location" && (
                        <>
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
                        </>
                      )}
                    </svg>
                  </div>
                  <span className="font-medium whitespace-pre-line">{contact.label}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Bottom */}
        <div className="border-t border-[#262626] mt-12 pt-8 flex flex-col md:flex-row justify-between items-center gap-6">
          <p className="text-[#a3a3a3] font-medium">{"© 2024 Talent Health. Todos os direitos reservados."}</p>
          <div className="flex gap-8 font-medium text-[#a3a3a3]">
            <span className="hover:text-[#dc2626] transition-colors cursor-pointer">ANS: 12345</span>
          </div>
        </div>
      </div>
    </footer>
  )
}
