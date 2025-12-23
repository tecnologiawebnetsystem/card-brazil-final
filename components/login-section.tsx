"use client"

import type React from "react"
import { useState } from "react"
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
  Heart,
  Lock,
  Mail,
  CheckCircle,
  Stethoscope,
  Activity,
  AlertCircle,
} from "lucide-react"
import { useAuth } from "@/contexts/auth-context"
import { Alert, AlertDescription } from "@/components/ui/alert"

export function LoginSection() {
  const [showPassword, setShowPassword] = useState(false)
  const [userType, setUserType] = useState("usuario")
  const [error, setError] = useState<string | null>(null)
  const { login, loading } = useAuth()

  const userTypes = [
    {
      value: "admin",
      label: "Administrador",
      icon: Lock,
      description: "Acesso total ao sistema",
      color: "bg-destructive/10 text-destructive border-destructive/20",
    },
    {
      value: "operadora",
      label: "Operadora",
      icon: Building2,
      description: "Gestão de seguros e apólices",
      color: "bg-primary/10 text-primary border-primary/20",
    },
    {
      value: "estipulante",
      label: "Estipulante",
      icon: Users,
      description: "Gestão de grupos e contratos",
      color: "bg-success/10 text-success border-success/20",
    },
    {
      value: "subestipulante",
      label: "Sub-estipulante",
      icon: User,
      description: "Gestão de sub-grupos",
      color: "bg-warning/10 text-warning border-warning/20",
    },
    {
      value: "usuario",
      label: "Usuário",
      icon: User,
      description: "Sistema de gestão de saúde",
      color: "bg-secondary/10 text-secondary border-secondary/20",
    },
  ]

  const currentUserType = userTypes.find((type) => type.value === userType)

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)

    const form = e.target as HTMLFormElement
    const email = (form.elements.namedItem("email") as HTMLInputElement).value
    const password = (form.elements.namedItem("password") as HTMLInputElement).value
    const codigo = (form.elements.namedItem("codigo") as HTMLInputElement)?.value

    try {
      await login({
        email,
        password,
        userType,
        codigo,
      })
    } catch (err: any) {
      setError(err.message || "Erro ao fazer login. Verifique suas credenciais.")
    }
  }

  return (
    <div className="flex flex-col justify-center p-8 lg:p-12 relative min-h-screen gradient-healthcare">
      <div className="absolute inset-0 bg-gradient-to-br from-primary/3 via-accent/2 to-secondary/3" />
      <div className="absolute top-20 right-20 w-64 h-64 bg-primary/8 rounded-full blur-3xl animate-pulse" />
      <div className="absolute bottom-20 left-20 w-48 h-48 bg-accent/8 rounded-full blur-2xl animate-pulse delay-1000" />
      <div className="absolute top-1/3 left-1/3 w-32 h-32 bg-secondary/6 rounded-full blur-xl animate-pulse delay-500" />
      <div className="absolute bottom-1/3 right-1/3 w-40 h-40 bg-primary/5 rounded-full blur-2xl animate-pulse delay-700" />

      <div className="relative z-10">
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-6 mb-8">
            <div className="relative">
              <div className="w-20 h-20 bg-gradient-to-br from-primary to-accent rounded-3xl flex items-center justify-center shadow-2xl shadow-primary/30 border border-primary/20">
                <div className="relative">
                  <Heart className="w-10 h-10 text-white" />
                  <div className="absolute -top-1 -right-1">
                    <Activity className="w-5 h-5 text-white animate-pulse" />
                  </div>
                </div>
              </div>
              <div className="absolute -top-2 -right-2 w-8 h-8 bg-success rounded-full flex items-center justify-center shadow-lg">
                <CheckCircle className="w-5 h-5 text-white" />
              </div>
            </div>
            <div className="text-left">
              <h1 className="text-4xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
                CardBrazil
              </h1>
              <p className="text-lg text-muted-foreground font-medium flex items-center gap-2">
                <Stethoscope className="w-5 h-5 text-primary" />
                Sistema de Saúde Corporativo
              </p>
            </div>
          </div>
        </div>

        <Card className="w-full max-w-lg mx-auto healthcare-card bg-card/98 backdrop-blur-sm border-primary/10">
          <CardHeader className="text-center space-y-8 pb-8">
            <div className="flex flex-col items-center gap-6">
              <div className="space-y-4 text-center">
                <CardTitle className="text-3xl font-bold text-foreground">Bem-vindo de volta</CardTitle>
                <CardDescription className="text-base text-muted-foreground max-w-sm leading-relaxed">
                  {currentUserType?.description}
                </CardDescription>
              </div>
            </div>
          </CardHeader>

          <CardContent className="space-y-8 px-8 pb-8">
            {error && (
              <Alert variant="destructive">
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}

            <form onSubmit={handleLogin} className="space-y-6">
              <div className="space-y-4">
                <Label htmlFor="userType" className="text-sm font-semibold flex items-center gap-2 text-foreground">
                  <Users className="w-4 h-4 text-primary" />
                  Tipo de Usuário
                </Label>
                <Select value={userType} onValueChange={setUserType}>
                  <SelectTrigger className="healthcare-input h-16 text-base">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className="bg-card/98 backdrop-blur-sm border-primary/20">
                    {userTypes.map((type) => {
                      const Icon = type.icon
                      return (
                        <SelectItem key={type.value} value={type.value} className="py-4 hover:bg-primary/5">
                          <div className="flex items-center gap-4">
                            <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center border border-primary/20">
                              <Icon className="w-6 h-6 text-primary" />
                            </div>
                            <div className="text-left">
                              <div className="font-semibold text-foreground">{type.label}</div>
                              <div className="text-sm text-muted-foreground">{type.description}</div>
                            </div>
                          </div>
                        </SelectItem>
                      )
                    })}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-6">
                <div className="space-y-4">
                  <Label htmlFor="email" className="text-sm font-semibold flex items-center gap-2 text-foreground">
                    <Mail className="w-4 h-4 text-primary" />
                    Email ou CPF
                  </Label>
                  <Input
                    id="email"
                    type="text"
                    placeholder="Digite seu email ou CPF"
                    className="healthcare-input h-16 text-base"
                    required
                  />
                </div>

                <div className="space-y-4">
                  <Label htmlFor="password" className="text-sm font-semibold flex items-center gap-2 text-foreground">
                    <Lock className="w-4 h-4 text-primary" />
                    Senha
                  </Label>
                  <div className="relative">
                    <Input
                      id="password"
                      type={showPassword ? "text" : "password"}
                      placeholder="Digite sua senha"
                      className="healthcare-input h-16 pr-16 text-base"
                      required
                    />
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      className="absolute right-0 top-0 h-full px-4 hover:bg-transparent text-muted-foreground hover:text-primary transition-colors"
                      onClick={() => setShowPassword(!showPassword)}
                    >
                      {showPassword ? <EyeOff className="w-6 h-6" /> : <Eye className="w-6 h-6" />}
                    </Button>
                  </div>
                </div>

                {(userType === "operadora" || userType === "estipulante" || userType === "subestipulante") && (
                  <div className="space-y-4">
                    <Label htmlFor="codigo" className="text-sm font-semibold text-foreground">
                      Código da{" "}
                      {userType === "operadora"
                        ? "Operadora"
                        : userType === "estipulante"
                          ? "Estipulante"
                          : "Sub-estipulante"}
                    </Label>
                    <Input
                      id="codigo"
                      type="text"
                      placeholder={`Digite o código da ${userType}`}
                      className="healthcare-input h-16 text-base"
                    />
                  </div>
                )}

                <Button
                  type="submit"
                  className="w-full healthcare-button h-16 text-base font-semibold rounded-xl"
                  disabled={loading}
                >
                  {loading ? (
                    <div className="flex items-center gap-3">
                      <div className="w-6 h-6 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                      Entrando no sistema...
                    </div>
                  ) : (
                    <div className="flex items-center gap-3">
                      <Lock className="w-5 h-5" />
                      Entrar no Sistema
                    </div>
                  )}
                </Button>
              </div>
            </form>

            <Separator className="my-8" />

            <div className="text-center space-y-5">
              <Button
                variant="link"
                className="text-sm text-primary hover:text-primary/80 p-0 font-semibold underline-offset-4"
                onClick={() => (window.location.href = "/esqueci-senha")}
              >
                Esqueci minha senha
              </Button>
              <div className="text-sm text-muted-foreground">
                Não tem conta?{" "}
                <Button
                  variant="link"
                  className="p-0 h-auto text-primary hover:text-primary/80 font-semibold underline-offset-4"
                >
                  Solicitar acesso
                </Button>
              </div>
              <div className="pt-2">
                <Button
                  variant="link"
                  className="text-sm text-accent hover:text-accent/80 p-0 font-semibold underline-offset-4"
                  onClick={() => (window.location.href = "/wiki")}
                >
                  📚 Wiki - Guia do Sistema
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
