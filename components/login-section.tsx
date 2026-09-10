"use client"

import type React from "react"
import { useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { ArrowRight, Eye, EyeOff, HeartPulse, LockKeyhole, Mail, ShieldCheck, Sparkles } from "lucide-react"
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
    <main className="relative min-h-screen overflow-hidden bg-background px-4 py-6 text-foreground sm:px-6 lg:px-10"><div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(11,111,174,0.10),transparent_34%),radial-gradient(circle_at_bottom_left,rgba(251,228,220,0.35),transparent_30%)]" />
      <div className="relative mx-auto grid min-h-[calc(100vh-3rem)] max-w-7xl overflow-hidden rounded-[2rem] border border-border/80 bg-card/95 shadow-[0_30px_100px_-45px_rgba(22,50,79,0.65)] backdrop-blur-sm lg:grid-cols-[1.05fr_0.95fr]">
        <section className="relative hidden overflow-hidden bg-primary p-10 text-primary-foreground lg:flex lg:flex-col lg:justify-between xl:p-16">
          <div className="absolute -right-24 -top-24 size-72 rounded-full border-[28px] border-primary-foreground/10" />
          <div className="absolute -bottom-32 -left-16 size-80 rounded-full border-[40px] border-accent/20" />
          <div className="relative flex items-center gap-3 text-lg font-semibold"><span className="grid size-10 place-items-center rounded-2xl bg-accent text-accent-foreground"><HeartPulse /></span>CardBrazil</div>
          <div className="relative max-w-xl"><p className="mb-5 text-sm font-medium uppercase tracking-[0.24em] text-primary-foreground/65">Gestão que move pessoas</p><h1 className="text-balance text-5xl font-semibold leading-[1.02] tracking-[-0.06em] xl:text-7xl">Decisões melhores começam com uma visão mais clara.</h1><p className="mt-7 max-w-md text-base leading-7 text-primary-foreground/75">Centralize propostas, benefícios e dados estratégicos em uma experiência feita para times que querem evoluir.</p></div>
          <div className="relative grid gap-3 text-sm text-primary-foreground/75 sm:grid-cols-2"><div className="rounded-2xl border border-primary-foreground/15 bg-primary-foreground/10 p-4"><ShieldCheck className="mb-5" /><strong className="block text-primary-foreground">Dados protegidos</strong><span>Acesso seguro por perfil.</span></div><div className="rounded-2xl border border-primary-foreground/15 bg-primary-foreground/10 p-4"><Sparkles className="mb-5" /><strong className="block text-primary-foreground">Visão inteligente</strong><span>Indicadores no momento certo.</span></div></div>
        </section>
        <section className="relative flex items-center justify-center bg-secondary/45 p-4 sm:p-8 lg:p-14"><div className="relative w-full max-w-md rounded-[1.75rem] border border-border/80 bg-card p-5 shadow-[0_24px_70px_-28px_rgba(22,50,79,0.42)] sm:p-8 lg:p-10 before:absolute before:left-8 before:right-8 before:top-0 before:h-1 before:rounded-b-full before:bg-accent-foreground/70"><div className="mb-10 lg:hidden"><div className="flex items-center gap-3 text-lg font-semibold"><span className="grid size-10 place-items-center rounded-2xl bg-accent text-accent-foreground"><HeartPulse /></span>CardBrazil</div></div><div className="mb-8 border-b border-border/70 pb-7"><p className="mb-3 text-sm font-semibold uppercase tracking-[0.16em] text-primary">Bem-vindo de volta</p><h2 className="text-3xl font-semibold tracking-tight text-balance">Acesse seu workspace</h2><p className="mt-2 leading-6 text-muted-foreground">Entre para continuar sua gestão com mais clareza.</p></div><form className="flex flex-col gap-5" onSubmit={handleLogin}><div className="flex flex-col gap-2"><Label htmlFor="email">E-mail corporativo</Label><div className="relative"><Mail className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" /><Input id="email" type="text" value={email} onChange={(event) => setEmail(event.target.value)} placeholder="nome@empresa.com" className="h-12 rounded-xl border-border/90 bg-background/70 pl-10 shadow-sm transition-shadow placeholder:text-muted-foreground/70 focus-visible:border-primary focus-visible:bg-card focus-visible:shadow-[0_0_0_4px_rgba(11,111,174,0.10)]" autoComplete="username" required /></div></div><div className="flex flex-col gap-2"><div className="flex items-center justify-between"><Label htmlFor="password">Senha</Label><Link href="/esqueci-senha" className="text-sm font-medium text-accent-foreground hover:underline">Esqueci minha senha</Link></div><div className="relative"><LockKeyhole className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" /><Input id="password" type={showPassword ? "text" : "password"} value={password} onChange={(event) => setPassword(event.target.value)} placeholder="Digite sua senha" className="h-12 rounded-xl border-border/90 bg-background/70 pl-10 pr-12 shadow-sm transition-shadow placeholder:text-muted-foreground/70 focus-visible:border-primary focus-visible:bg-card focus-visible:shadow-[0_0_0_4px_rgba(11,111,174,0.10)]" autoComplete="current-password" required /><button type="button" aria-label={showPassword ? "Ocultar senha" : "Mostrar senha"} onClick={() => setShowPassword((value) => !value)} className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground">{showPassword ? <EyeOff /> : <Eye />}</button></div></div>{error && <p role="alert" className="rounded-xl border border-destructive/30 bg-destructive/10 p-3 text-sm text-destructive">{error}</p>}<Button type="submit" className="h-12 w-full" disabled={loading}>{loading ? "Entrando..." : <>Entrar no CardBrazil <ArrowRight data-icon="inline-end" /></>}</Button></form><LoginInstallActions /><p className="mt-10 text-center text-xs leading-5 text-muted-foreground">Ao entrar, você concorda com as políticas de segurança e privacidade da CardBrazil.</p></div></section>
      </div>
    </main>
  )
}
