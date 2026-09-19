"use client"

import type React from "react"
import { useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { ArrowRight, Eye, EyeOff, LockKeyhole, Mail, ShieldAlert, Activity, ChevronRight } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { LoginInstallActions } from "@/components/pwa/login-install-actions"

export function LoginSection() {
  const router = useRouter()
  const [showPassword, setShowPassword] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")

  const handleLogin = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    setError(null)
    setLoading(true)
    try {
      const response = await fetch("/api/auth/login", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ email: email.trim(), senha: password }) })
      const data = await response.json()
      if (!response.ok || !data.success) { setError(data.message || "Confira seus dados de acesso."); return }
      router.push("/dashboard")
    } catch { setError("Não foi possível conectar ao servidor.") } finally { setLoading(false) }
  }

  return (
    <main className="relative min-h-screen overflow-hidden bg-background text-foreground">
      <div className="absolute inset-0 opacity-40 [background-image:linear-gradient(90deg,color-mix(in_srgb,var(--primary)_8%,transparent)_1px,transparent_1px),linear-gradient(180deg,color-mix(in_srgb,var(--primary)_8%,transparent)_1px,transparent_1px)] [background-size:80px_80px]" />
      <div className="absolute left-0 top-0 h-px w-full border-t border-primary/20" />
      <div className="absolute right-0 top-0 h-full w-px border-r border-primary/10" />
      <div className="absolute bottom-0 right-0 h-px w-3/5 border-b border-primary/20" />
      <div className="absolute bottom-0 right-1/3 h-96 w-px border-l border-primary/15" />
      <div className="relative mx-auto flex min-h-screen max-w-7xl flex-col lg:flex-row lg:items-stretch">
        <section className="relative hidden w-full overflow-hidden border-r border-primary/20 bg-gradient-to-b from-primary via-primary/95 to-primary/90 px-12 py-16 text-primary-foreground lg:flex lg:w-3/5 lg:flex-col lg:justify-between xl:px-20 xl:py-20">
          <div className="absolute inset-0 opacity-15 [background-image:repeating-linear-gradient(45deg,transparent,transparent_35px,currentColor_35px,currentColor_70px)]" />
          <div className="absolute right-0 top-1/3 h-96 w-96 border border-primary-foreground/10 opacity-30" />
          <div className="absolute -bottom-32 right-1/4 h-80 w-80 border border-primary-foreground/5 opacity-20" />
          <div className="relative">
            <div className="mb-20 flex items-end justify-between border-b border-primary-foreground/20 pb-8">
              <div>
                <div className="mb-2 font-mono text-xs font-bold uppercase tracking-[0.3em] text-primary-foreground/60">Gestor de Saúde</div>
                <h1 className="text-5xl font-bold tracking-[-0.08em] xl:text-6xl">CardBrazil</h1>
              </div>
              <div className="h-16 w-1 bg-gradient-to-b from-accent via-primary-foreground to-transparent" />
            </div>
          </div>
          <div className="relative max-w-2xl space-y-12">
            <div>
              <div className="mb-6 flex items-center gap-3">
                <div className="h-px w-8 bg-accent" />
                <span className="font-mono text-xs font-bold uppercase tracking-[0.2em] text-accent">Sistema Operacional</span>
              </div>
              <h2 className="text-4xl font-bold leading-tight tracking-[-0.05em] lg:text-5xl">Operação de Saúde em Tempo Real</h2>
              <p className="mt-5 max-w-lg leading-relaxed text-primary-foreground/80">Propostas, vidas e faturamento mensal integrados em um único plano de controle. Decisões data-driven, operação previsível.</p>
            </div>
            <div className="grid gap-4 border-t border-primary-foreground/15 pt-8">
              <div className="flex items-center gap-3 text-sm text-primary-foreground/75">
                <div className="h-1.5 w-1.5 bg-accent" />
                Monitoramento contínuo de ciclos
              </div>
              <div className="flex items-center gap-3 text-sm text-primary-foreground/75">
                <div className="h-1.5 w-1.5 bg-accent" />
                Auditoria e aprovação por perfil
              </div>
              <div className="flex items-center gap-3 text-sm text-primary-foreground/75">
                <div className="h-1.5 w-1.5 bg-accent" />
                Faturas mensais e reajustes automáticos
              </div>
            </div>
          </div>
          <div className="relative border-t border-primary-foreground/20 pt-8">
            <div className="text-xs text-primary-foreground/50">
              <p>Plataforma de gestão de saúde integrada</p>
              <p className="mt-2 font-mono">v1.0 • Production Ready</p>
            </div>
          </div>
        </section>
        <section className="relative flex w-full flex-col justify-center bg-background px-4 py-8 lg:w-2/5 lg:px-12 lg:py-0 xl:px-16">
          <div className="w-full max-w-sm">
            <div className="mb-12 lg:hidden">
              <div className="mb-2 font-mono text-xs font-bold uppercase tracking-[0.3em] text-primary/70">Gestor de Saúde</div>
              <h1 className="text-3xl font-bold tracking-[-0.05em]">CardBrazil</h1>
            </div>
            <div className="mb-12 space-y-4 border-l-2 border-primary/30 pl-6">
              <div>
                <div className="mb-1 font-mono text-xs font-bold uppercase tracking-[0.2em] text-primary">Acesso Restrito</div>
                <h2 className="text-3xl font-bold leading-tight tracking-[-0.03em]">Bem-vindo ao controle operacional.</h2>
              </div>
              <p className="text-sm leading-relaxed text-muted-foreground">Autentique-se para acessar o painel de gestão integrada de propostas e faturamento.</p>
            </div>
            <form className="space-y-6" onSubmit={handleLogin}>
              <div className="space-y-2">
                <Label htmlFor="email" className="font-mono text-xs font-bold uppercase tracking-[0.15em]">E-mail</Label>
                <div className="relative border-l-2 border-primary/40 pl-4">
                  <Mail className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-primary/50" size={18} />
                  <Input
                    id="email"
                    type="text"
                    value={email}
                    onChange={(event) => setEmail(event.target.value)}
                    placeholder="nome@empresa.com"
                    className="border-0 border-b border-primary/30 bg-transparent px-0 pl-8 py-3 placeholder:text-muted-foreground/50 focus-visible:border-b-2 focus-visible:border-primary focus-visible:ring-0"
                    autoComplete="username"
                    required
                  />
                </div>
              </div>
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <Label htmlFor="password" className="font-mono text-xs font-bold uppercase tracking-[0.15em]">Senha</Label>
                  <Link href="/esqueci-senha" className="font-mono text-xs uppercase tracking-[0.15em] text-primary/80 hover:text-primary">Recuperar</Link>
                </div>
                <div className="relative border-l-2 border-primary/40 pl-4">
                  <LockKeyhole className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-primary/50" size={18} />
                  <Input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    value={password}
                    onChange={(event) => setPassword(event.target.value)}
                    placeholder="••••••••"
                    className="border-0 border-b border-primary/30 bg-transparent px-0 pl-8 py-3 placeholder:text-muted-foreground/50 focus-visible:border-b-2 focus-visible:border-primary focus-visible:ring-0"
                    autoComplete="current-password"
                    required
                  />
                  <button
                    type="button"
                    aria-label={showPassword ? "Ocultar senha" : "Mostrar senha"}
                    onClick={() => setShowPassword((value) => !value)}
                    className="absolute right-0 top-1/2 -translate-y-1/2 text-primary/50 transition-colors hover:text-primary/80"
                  >
                    {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>
              </div>
              {error && (
                <div role="alert" className="border-l-2 border-destructive bg-destructive/5 px-4 py-3 text-sm text-destructive">
                  <p className="font-mono text-xs font-bold uppercase tracking-[0.1em]">Erro de Autenticação</p>
                  <p className="mt-1 text-xs">{error}</p>
                </div>
              )}
              <Button
                type="submit"
                disabled={loading}
                className="group w-full border-0 bg-primary px-6 py-3 font-mono text-sm font-bold uppercase tracking-[0.15em] text-primary-foreground shadow-none hover:bg-primary/90"
              >
                {loading ? "Verificando..." : "Entrar no Sistema"}
                {!loading && <ChevronRight className="ml-2 transition-transform group-hover:translate-x-1" size={16} />}
              </Button>
            </form>
            <div className="mt-8 border-t border-primary/20 pt-6">
              <p className="text-xs leading-relaxed text-muted-foreground">
                <span className="text-primary/60">Ambiente:</span> Produção | <span className="text-primary/60">Versão:</span> 1.0.0
              </p>
            </div>
            <LoginInstallActions />
          </div>
        </section>
      </div>
    </main>
  )
}
