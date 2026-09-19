"use client"

import type React from "react"
import { useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { ArrowRight, Eye, EyeOff, LockKeyhole, Mail, ShieldCheck, Sparkles, Activity, CircleUserRound } from "lucide-react"
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
    <main className="relative min-h-screen overflow-hidden bg-background px-4 py-5 text-foreground sm:px-8 lg:px-12">
      <div className="pointer-events-none absolute inset-0 opacity-60 [background-image:linear-gradient(to_right,color-mix(in_srgb,var(--border)_24%,transparent)_1px,transparent_1px),linear-gradient(to_bottom,color-mix(in_srgb,var(--border)_24%,transparent)_1px,transparent_1px)] [background-size:56px_56px]" />
      <div className="pointer-events-none absolute -right-32 top-[-18rem] size-[38rem] rounded-full border-[1px] border-primary/20 sm:border-[2px]" />
      <div className="pointer-events-none absolute -right-12 top-[-10rem] size-[25rem] rounded-full border border-primary/10" />
      <div className="relative mx-auto grid min-h-[calc(100vh-2.5rem)] max-w-[1440px] overflow-hidden rounded-[2rem] border border-border/80 bg-card shadow-[0_30px_100px_-50px_color-mix(in_srgb,var(--foreground)_65%,transparent)] lg:grid-cols-[1.15fr_0.85fr]">
        <section className="relative hidden overflow-hidden bg-primary p-10 text-primary-foreground lg:flex lg:flex-col lg:justify-between xl:p-16">
          <div className="absolute inset-0 opacity-20 [background-image:linear-gradient(135deg,transparent_0_42%,currentColor_42%_42.3%,transparent_42.3%_100%)] [background-size:38px_38px]" />
          <div className="relative flex items-center justify-between"><div className="flex items-center gap-3 text-lg font-semibold tracking-tight"><span className="grid size-11 place-items-center rounded-2xl bg-accent text-accent-foreground shadow-lg"><ShieldCheck /></span><span>CardBrazil</span></div><span className="rounded-full border border-primary-foreground/20 px-3 py-1.5 font-mono text-[10px] uppercase tracking-[0.2em] text-primary-foreground/70">Health OS / 01</span></div>
          <div className="relative max-w-2xl"><div className="mb-7 flex items-center gap-3 text-xs font-semibold uppercase tracking-[0.25em] text-primary-foreground/65"><span className="size-2 rounded-full bg-accent shadow-[0_0_0_5px_color-mix(in_srgb,var(--accent)_20%,transparent)]" /> Operação em movimento</div><h1 className="max-w-3xl text-balance text-5xl font-semibold leading-[0.98] tracking-[-0.07em] xl:text-7xl">A saúde do negócio começa antes do primeiro clique.</h1><p className="mt-8 max-w-lg text-base leading-7 text-primary-foreground/75">Um cockpit para propostas, vidas e faturamento mensal — desenhado para transformar complexidade em decisões simples.</p></div>
          <div className="relative flex items-end justify-between gap-8"><div className="grid gap-2 text-sm text-primary-foreground/70"><div className="flex items-center gap-2"><Activity className="size-4 text-accent" /> Monitoramento contínuo</div><div className="flex items-center gap-2"><ShieldCheck className="size-4 text-accent" /> Controle por perfil e contexto</div></div><div className="hidden text-right font-mono text-[10px] uppercase tracking-[0.18em] text-primary-foreground/45 xl:block">Dados que cuidam<br />de cada decisão</div></div>
        </section>
        <section className="relative flex items-center justify-center bg-secondary/35 p-4 sm:p-8 lg:p-12 xl:p-16">
          <div className="w-full max-w-md">
            <div className="mb-8 flex items-center justify-between lg:hidden"><div className="flex items-center gap-3 text-lg font-semibold"><span className="grid size-10 place-items-center rounded-2xl bg-accent text-accent-foreground"><ShieldCheck /></span>CardBrazil</div><span className="font-mono text-[10px] uppercase tracking-[0.18em] text-muted-foreground">Health OS</span></div>
            <div className="mb-8"><div className="mb-5 flex size-14 items-center justify-center rounded-2xl border border-border bg-card text-primary shadow-sm"><CircleUserRound className="size-7" /></div><p className="mb-3 font-mono text-xs font-semibold uppercase tracking-[0.2em] text-primary">Acesso autorizado</p><h2 className="text-4xl font-semibold tracking-[-0.05em] text-balance">Volte a cuidar do que importa.</h2><p className="mt-3 leading-6 text-muted-foreground">Entre no seu ambiente seguro de gestão.</p></div>
            <form className="flex flex-col gap-5" onSubmit={handleLogin}>
              <div className="flex flex-col gap-2"><Label htmlFor="email">E-mail corporativo</Label><div className="relative"><Mail className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" /><Input id="email" type="text" value={email} onChange={(event) => setEmail(event.target.value)} placeholder="nome@empresa.com" className="h-12 rounded-xl border-border/90 bg-background/70 pl-10 shadow-sm transition-shadow placeholder:text-muted-foreground/70 focus-visible:border-primary focus-visible:bg-card focus-visible:shadow-[0_0_0_4px_color-mix(in_srgb,var(--primary)_16%,transparent)]" autoComplete="username" required /></div></div>
              <div className="flex flex-col gap-2"><div className="flex items-center justify-between"><Label htmlFor="password">Senha</Label><Link href="/esqueci-senha" className="text-sm font-medium text-primary hover:underline">Esqueci minha senha</Link></div><div className="relative"><LockKeyhole className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" /><Input id="password" type={showPassword ? "text" : "password"} value={password} onChange={(event) => setPassword(event.target.value)} placeholder="Digite sua senha" className="h-12 rounded-xl border-border/90 bg-background/70 pl-10 pr-11 shadow-sm transition-shadow placeholder:text-muted-foreground/70 focus-visible:border-primary focus-visible:bg-card focus-visible:shadow-[0_0_0_4px_color-mix(in_srgb,var(--primary)_16%,transparent)]" autoComplete="current-password" required /><button type="button" aria-label={showPassword ? "Ocultar senha" : "Mostrar senha"} onClick={() => setShowPassword((value) => !value)} className="absolute right-3 top-1/2 -translate-y-1/2 rounded-md p-1.5 text-muted-foreground transition-colors hover:bg-muted hover:text-foreground">{showPassword ? <EyeOff className="size-4" /> : <Eye className="size-4" />}</button></div></div>
              {error && <p role="alert" className="rounded-xl border border-destructive/20 bg-destructive/10 px-4 py-3 text-sm leading-5 text-destructive">{error}</p>}
              <Button type="submit" disabled={loading} className="group h-12 rounded-xl text-base font-semibold shadow-lg shadow-primary/20">{loading ? "Verificando acesso..." : "Entrar no ambiente"}{!loading && <ArrowRight className="transition-transform group-hover:translate-x-1" data-icon="inline-end" />}</Button>
            </form>
            <div className="mt-8 flex items-start gap-3 border-t border-border/70 pt-5 text-xs leading-5 text-muted-foreground"><Sparkles className="mt-0.5 size-4 shrink-0 text-primary" /><p>Ambiente protegido para gestão de saúde, propostas e faturamento mensal.</p></div>
            <LoginInstallActions />
          </div>
        </section>
      </div>
    </main>
  )
}
