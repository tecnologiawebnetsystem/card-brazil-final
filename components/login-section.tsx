"use client"

import type React from "react"
import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Eye,
  EyeOff,
  Lock,
  Mail,
  Stethoscope,
  AlertCircle,
} from "lucide-react"
import { Alert, AlertDescription } from "@/components/ui/alert"

export function LoginSection() {
  const router = useRouter()
  const [showPassword, setShowPassword] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)
    setLoading(true)

    const senha = password.trim()
    const login = email.trim()

    try {
      const response = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: login, senha }),
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

  return (
    <div className="aperTo-abraco-pattern flex min-h-screen items-center justify-center p-5 sm:p-8 lg:p-12 relative overflow-hidden">
      <div className="pointer-events-none absolute -left-24 -top-24 size-72 rounded-full border-[24px] border-primary/10" />
      <div className="pointer-events-none absolute -bottom-32 -right-20 size-96 rounded-full border-[32px] border-accent/40" />

      <div className="relative z-10">
        {/* Mobile logo - only show on small screens */}
        <div className="text-center mb-8 lg:hidden">
          <div className="flex items-center justify-center gap-3"><div className="flex size-10 items-center justify-center rounded-xl bg-primary text-primary-foreground shadow-lg"><Stethoscope className="size-5" /></div><span className="font-heading text-xl font-semibold tracking-tight text-foreground">Portal CardBrazil</span></div>
        </div>

        <Card className="w-full max-w-md mx-auto bg-card/95 border-border shadow-xl shadow-primary/10 backdrop-blur-sm rounded-2xl">
          <CardHeader className="text-center space-y-6 pb-6">
            <div className="flex flex-col items-center gap-4">
              <div className="w-14 h-14 bg-primary rounded-2xl flex items-center justify-center shadow-lg shadow-primary/30">
                <Stethoscope className="w-7 h-7 text-primary-foreground" />
              </div>
              <div>
                <CardTitle className="text-2xl font-semibold text-foreground">Login</CardTitle>
                <CardDescription className="text-muted-foreground mt-2">
                  Acesse o sistema de gestao de saude
                </CardDescription>
              </div>
            </div>
          </CardHeader>

          <CardContent className="space-y-6 px-6 pb-6">
            {error && (
              <Alert variant="destructive" className="bg-red-500/10 border-red-500/30 text-foreground">
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}

            <form onSubmit={handleLogin} className="space-y-5">
              <div className="space-y-3">
                <Label htmlFor="email" className="text-sm font-medium flex items-center gap-2 text-muted-foreground">
                  <Mail className="w-4 h-4 text-primary" />
                  Email ou CPF
                </Label>
                <Input
                  id="email"
                  type="text"
                  placeholder="Digite seu e-mail ou CPF"
                  value={email}
                  onChange={(event) => setEmail(event.target.value)}
                  autoComplete="username"
                  className="h-12 bg-background border-border text-foreground placeholder:text-muted-foreground focus-visible:ring-primary"
                  required
                />
              </div>

              <div className="space-y-3">
                <Label htmlFor="password" className="text-sm font-medium flex items-center gap-2 text-muted-foreground">
                  <Lock className="w-4 h-4 text-primary" />
                  Senha
                </Label>
                <div className="relative">
                  <Input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    placeholder="Digite sua senha"
                    value={password}
                    onChange={(event) => setPassword(event.target.value)}
                    autoComplete="current-password"
                    className="h-12 pr-14 bg-background border-border text-foreground placeholder:text-muted-foreground focus-visible:ring-primary"
                    required
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    className="absolute right-0 top-0 h-full px-4 hover:bg-transparent text-muted-foreground hover:text-primary transition-colors"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                  </Button>
                </div>
              </div>

              <Button
                type="submit"
                className="w-full h-12 bg-primary hover:bg-primary/90 text-primary-foreground font-semibold rounded-xl shadow-lg shadow-primary/20"
                disabled={loading}
              >
                {loading ? (
                  <div className="flex items-center gap-3">
                    <div className="w-5 h-5 border-2 border-black/30 border-t-black rounded-full animate-spin" />
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

            <div className="text-center pt-2">
              <Button
                variant="link"
                className="text-sm text-primary hover:text-[#00f5a0] p-0 font-medium underline-offset-4"
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
