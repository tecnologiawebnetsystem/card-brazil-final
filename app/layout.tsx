import type React from "react"
import type { Metadata, Viewport } from "next"
import { Inter, Space_Grotesk } from "next/font/google"
import { PwaRegister } from "@/components/pwa/pwa-register"
import { InstallPwaPrompt } from "@/components/pwa/install-pwa-prompt"
import "./globals.css"
import { ThemeProvider } from "@/components/theme-provider"
import { AuthProvider } from "@/contexts/auth-context"

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
})

const spaceGrotesk = Space_Grotesk({
  subsets: ["latin"],
  variable: "--font-space-grotesk",
})

export const metadata: Metadata = {
  title: "CardBrazil | Gestão de pessoas e benefícios",
  description: "Plataforma CardBrazil para gestão inteligente de pessoas, propostas e benefícios.",
  generator: "v0.app",
  manifest: "/manifest.webmanifest",
  icons: {
    icon: "/cardbrazil-health-icon.png",
    shortcut: "/cardbrazil-health-icon.png",
    apple: "/cardbrazil-health-icon.png",
  },
  appleWebApp: {
    capable: true,
    statusBarStyle: "black-translucent",
    title: "CardBrazil",
  },
}

export const viewport: Viewport = {
  themeColor: "#0b253e",
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="pt-BR" suppressHydrationWarning className={`${inter.variable} ${spaceGrotesk.variable} antialiased`}>
      <body className="font-sans bg-background text-foreground">
        <ThemeProvider attribute="class" defaultTheme="light" enableSystem={false} disableTransitionOnChange>
          <AuthProvider>{children}</AuthProvider>
          <PwaRegister />
          <InstallPwaPrompt />
        </ThemeProvider>
      </body>
    </html>
  )
}
