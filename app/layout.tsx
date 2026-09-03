import type React from "react"
import type { Metadata, Viewport } from "next"
import { Inter, Space_Grotesk } from "next/font/google"
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
  icons: {
    icon: "/cardbrazil-icon.svg",
    shortcut: "/cardbrazil-icon.svg",
    apple: "/cardbrazil-icon.svg",
  },
}

export const viewport: Viewport = {
  themeColor: "#f5f7fa",
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="pt-BR" className={`${inter.variable} ${spaceGrotesk.variable} antialiased`}>
      <body className="font-sans bg-background text-foreground">
        <ThemeProvider attribute="class" defaultTheme="light" enableSystem={false} disableTransitionOnChange>
          <AuthProvider>{children}</AuthProvider>
        </ThemeProvider>
      </body>
    </html>
  )
}
