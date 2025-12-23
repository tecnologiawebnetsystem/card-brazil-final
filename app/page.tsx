import { LoginSection } from "@/components/login-section"
import { HeroSection } from "@/components/hero-section"
import { Footer } from "@/components/footer"

export default function HomePage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-primary/5 via-background to-secondary/5">
      <main className="container mx-auto px-4">
        <div className="grid lg:grid-cols-2 min-h-screen">
          {/* Left side - Hero content */}
          <HeroSection />

          {/* Right side - Login */}
          <LoginSection />
        </div>
      </main>

      <Footer />
    </div>
  )
}
