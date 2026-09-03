import { SobreContent } from "@/components/sobre/sobre-content"
import { Footer } from "@/components/footer"
import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "Sobre Nos - WebNetSystem | CardBrazil CRM",
  description:
    "Conheca a WebNetSystem, empresa de tecnologia com mais de 20 anos no mercado. Desenvolvedora do CardBrazil CRM.",
}

export default function SobrePage() {
  return (
    <div className="min-h-screen bg-[#0a0a0a]">
      <SobreContent />
      <Footer />
    </div>
  )
}
