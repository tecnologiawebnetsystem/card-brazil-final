"use client"

import type React from "react"
import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Separator } from "@/components/ui/separator"
import {
  Building2,
  Users,
  User,
  Eye,
  EyeOff,
  Lock,
  Mail,
  Stethoscope,
  AlertCircle,
} from "lucide-react"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { TalentHealthLogo } from "@/components/talent-health-logo"

export function LoginSection() {
  const router = useRouter()
  const [showPassword, setShowPassword] = useState(false)
  const [userType, setUserType] = useState("usuario")
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)

  const userTypes = [
    {
      value: "admin",
      label: "Administrador",
      icon: Lock,
      description: "Acesso total ao sistema",
    },
    {
      value: "operadora",
      label: "Operadora",
      icon: Building2,
      description: "Gestao de seguros e apolices",
    },
    {
      value: "estipulante",
      label: "Estipulante",
      icon: Users,
      description: "Gestao de grupos e contratos",
    },
    {
      value: "subestipulante",
      label: "Sub-estipulante",
      icon: User,
      description: "Gestao de sub-grupos",
    },
    {
      value: "usuario",
      label: "Usuario",
      icon: User,
      description: "Sistema de gestao de saude",
    },
  ]

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)
    setLoading(true)

    const form = e.target as HTMLFormElement
    const email = (form.elements.namedItem("email") as HTMLInputElement).value
    const senha = (form.elements.namedItem("password") as HTMLInputElement).value

    try {
      const response = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, senha }),
      })

      const data = await response.json()

      if (!response.ok || !data.success) {
        setError(data.message || "Erro ao fazer login")
        setLoading(false)
        return
      }

      router.push("/dashboard")
    } catch (err) {
      console.error("Login error:", err)
      setError("Erro ao conectar com o servidor")
      setLoading(false)
    }
  }

  const handleDemoLogin = async (demoType: "admin" | "user") => {
    setLoading(true)
    setError(null)

    try {
      const credentials = {
        admin: { email: "admin@talenthealth.com.br", senha: "admin123" },
        user: { email: "admin@talenthealth.com.br", senha: "admin123" },
      }

      const { email, senha } = credentials[demoType]

      const response = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, senha }),
      })

      const data = await response.json()

      if (!response.ok || !data.success) {
        setError(data.message || "Erro ao fazer login")
        setLoading(false)
        return
      }

      router.push("/dashboard")
    } catch (err) {
      console.error("Demo login error:", err)
      setError("Erro ao conectar com o servidor")
      setLoading(false)
    }
  }

  return (
    <div className="flex flex-col justify-center p-8 lg:p-12 relative min-h-screen">
      {/* Background effects */}
      <div className="absolute inset-0 bg-gradient-to-br from-[#dc2626]/5 via-transparent to-[#1e3a5f]/5" />
      <div className="absolute top-20 right-20 w-64 h-64 bg-[#dc2626]/5 rounded-full blur-3xl" />
      <div className="absolute bottom-20 left-20 w-48 h-48 bg-[#1e3a5f]/8 rounded-full blur-2xl" />

      <div className="relative z-10">
        {/* Mobile logo - only show on small screens */}
        <div className="text-center mb-8 lg:hidden">
          <TalentHealthLogo variant="full" size="md" glow />
        </div>

        <Card className="w-full max-w-lg mx-auto bg-[#141414]/95 border-[#262626] backdrop-blur-sm">
          <CardHeader className="text-center space-y-6 pb-6">
            <div className="flex flex-col items-center gap-4">
              <div className="w-16 h-16 bg-gradient-to-br from-[#dc2626] to-[#c2410c] rounded-2xl flex items-center justify-center glow-red">
                <Stethoscope className="w-8 h-8 text-[#ffffff]" />
              </div>
              <div>
                <CardTitle className="text-2xl font-bold text-[#f5f5f5]">Bem-vindo de volta</CardTitle>
                <CardDescription className="text-[#a3a3a3] mt-2">
                  Acesse o sistema de gestao de saude
                </CardDescription>
              </div>
            </div>
          </CardHeader>

          <CardContent className="space-y-6 px-6 pb-6">
            {error && (
              <Alert variant="destructive" className="bg-[#dc2626]/10 border-[#dc2626]/30 text-[#f5f5f5]">
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}

            <form onSubmit={handleLogin} className="space-y-5">
              <div className="space-y-3">
                <Label htmlFor="userType" className="text-sm font-semibold flex items-center gap-2 text-[#f5f5f5]">
                  <Users className="w-4 h-4 text-[#dc2626]" />
                  Tipo de Usuario
                </Label>
                <Select value={userType} onValueChange={setUserType}>
                  <SelectTrigger className="healthcare-input h-14 text-base text-[#f5f5f5]">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className="bg-[#141414] border-[#262626]">
                    {userTypes.map((type) => {
                      const Icon = type.icon
                      return (
                        <SelectItem key={type.value} value={type.value} className="py-3 hover:bg-[#dc2626]/10 text-[#f5f5f5]">
                          <div className="flex items-center gap-3">
                            <div className="w-10 h-10 bg-[#dc2626]/10 rounded-lg flex items-center justify-center border border-[#dc2626]/20">
                              <Icon className="w-5 h-5 text-[#dc2626]" />
                            </div>
                            <div className="text-left">
                              <div className="font-semibold text-[#f5f5f5]">{type.label}</div>
                              <div className="text-sm text-[#a3a3a3]">{type.description}</div>
                            </div>
                          </div>
                        </SelectItem>
                      )
                    })}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-3">
                <Label htmlFor="email" className="text-sm font-semibold flex items-center gap-2 text-[#f5f5f5]">
                  <Mail className="w-4 h-4 text-[#dc2626]" />
                  Email ou CPF
                </Label>
                <Input
                  id="email"
                  type="text"
                  placeholder="Digite seu email ou CPF"
                  className="healthcare-input h-14 text-base text-[#f5f5f5] placeholder:text-[#525252]"
                  required
                />
              </div>

              <div className="space-y-3">
                <Label htmlFor="password" className="text-sm font-semibold flex items-center gap-2 text-[#f5f5f5]">
                  <Lock className="w-4 h-4 text-[#dc2626]" />
                  Senha
                </Label>
                <div className="relative">
                  <Input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    placeholder="Digite sua senha"
                    className="healthcare-input h-14 pr-14 text-base text-[#f5f5f5] placeholder:text-[#525252]"
                    required
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    className="absolute right-0 top-0 h-full px-4 hover:bg-transparent text-[#a3a3a3] hover:text-[#dc2626] transition-colors"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                  </Button>
                </div>
              </div>

              {(userType === "operadora" || userType === "estipulante" || userType === "subestipulante") && (
                <div className="space-y-3">
                  <Label htmlFor="codigo" className="text-sm font-semibold text-[#f5f5f5]">
                    Codigo da{" "}
                    {userType === "operadora"
                      ? "Operadora"
                      : userType === "estipulante"
                        ? "Estipulante"
                        : "Sub-estipulante"}
                  </Label>
                  <Input
                    id="codigo"
                    type="text"
                    placeholder={`Digite o codigo da ${userType}`}
                    className="healthcare-input h-14 text-base text-[#f5f5f5] placeholder:text-[#525252]"
                  />
                </div>
              )}

              <Button
                type="submit"
                className="w-full healthcare-button h-14 text-base font-semibold rounded-xl"
                disabled={loading}
              >
                {loading ? (
                  <div className="flex items-center gap-3">
                    <div className="w-5 h-5 border-2 border-[#ffffff]/30 border-t-[#ffffff] rounded-full animate-spin" />
                    Entrando no sistema...
                  </div>
                ) : (
                  <div className="flex items-center gap-3">
                    <Lock className="w-5 h-5" />
                    Entrar no Sistema
                  </div>
                )}
              </Button>
            </form>

            <Separator className="bg-[#262626]" />

            <div className="space-y-3">
              <p className="text-center text-sm text-[#a3a3a3]">Acesso rapido para demonstracao</p>
              <div className="grid grid-cols-2 gap-3">
                <Button
                  variant="outline"
                  className="h-11 border-[#dc2626]/30 hover:bg-[#dc2626]/10 bg-transparent text-[#f5f5f5] hover:text-[#f5f5f5]"
                  onClick={() => handleDemoLogin("admin")}
                  disabled={loading}
                >
                  <Lock className="w-4 h-4 mr-2" />
                  Demo Admin
                </Button>
                <Button
                  variant="outline"
                  className="h-11 border-[#1e3a5f]/50 hover:bg-[#1e3a5f]/20 bg-transparent text-[#f5f5f5] hover:text-[#f5f5f5]"
                  onClick={() => handleDemoLogin("user")}
                  disabled={loading}
                >
                  <User className="w-4 h-4 mr-2" />
                  Demo Usuario
                </Button>
              </div>
            </div>

            <div className="text-center pt-2">
              <Button
                variant="link"
                className="text-sm text-[#dc2626] hover:text-[#ef4444] p-0 font-semibold underline-offset-4"
                onClick={() => (window.location.href = "/esqueci-senha")}
              >
                Esqueci minha senha
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
