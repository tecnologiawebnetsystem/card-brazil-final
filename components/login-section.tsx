"use client"

import type React from "react"
import { useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { ArrowRight, Eye, EyeOff, LockKeyhole, Mail, ShieldCheck, Sparkles } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

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
      const response = await fetch("/api/auth/login", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ email: email.trim(), senha: password.trim() }) })
      const data = await response.json()
      if (!response.ok || !data.success) { setError(data.message || "Confira seus dados de acesso."); return }
      router.push("/dashboard")
    } catch { setError("Não foi possível conectar ao servidor.") } finally { setLoading(false) }
  }

  return (
    <main className="min-h-screen bg-background px-4 py-6 text-foreground sm:px-6 lg:px-10">
      <div className="mx-auto grid min-h-[calc(100vh-3rem)] max-w-7xl overflow-hidden rounded-[2rem] border border-border bg-card shadow-2xl lg:grid-cols-[1.05fr_0.95fr]">
        <section className="relative hidden overflow-hidden bg-primary p-10 text-primary-foreground lg:flex lg:flex-col lg:justify-between xl:p-14">
          <div className="absolute -right-24 -top-24 size-72 rounded-full border-[28px] border-primary-foreground/10" />
          <div className="absolute -bottom-32 -left-16 size-80 rounded-full border-[40px] border-accent/20" />
          <div className="relative flex items-center gap-3 text-lg font-semibold"><span className="grid size-10 place-items-center rounded-2xl bg-accent text-accent-foreground"><Sparkles /></span>Talent</div>
          <div className="relative max-w-xl"><p className="mb-5 text-sm font-medium uppercase tracking-[0.24em] text-primary-foreground/65">Gestão que move pessoas</p><h1 className="text-balance text-5xl font-semibold leading-[1.02] tracking-[-0.06em] xl:text-7xl">Decisões melhores começam com uma visão mais clara.</h1><p className="mt-7 max-w-md text-base leading-7 text-primary-foreground/75">Centralize propostas, benefícios e dados estratégicos em uma experiência feita para times que querem evoluir.</p></div>
          <div className="relative grid gap-3 text-sm text-primary-foreground/75 sm:grid-cols-2"><div className="rounded-2xl border border-primary-foreground/15 bg-primary-foreground/10 p-4"><ShieldCheck className="mb-5" /><strong className="block text-primary-foreground">Dados protegidos</strong><span>Acesso seguro por perfil.</span></div><div className="rounded-2xl border border-primary-foreground/15 bg-primary-foreground/10 p-4"><Sparkles className="mb-5" /><strong className="block text-primary-foreground">Visão inteligente</strong><span>Indicadores no momento certo.</span></div></div>
        </section>
        <section className="flex items-center justify-center p-6 sm:p-10 lg:p-14"><div className="w-full max-w-md"><div className="mb-10 lg:hidden"><div className="flex items-center gap-3 text-lg font-semibold"><span className="grid size-10 place-items-center rounded-2xl bg-accent text-accent-foreground"><Sparkles /></span>Talent</div></div><div className="mb-8"><p className="mb-3 text-sm font-medium text-accent-foreground">Bem-vindo de volta</p><h2 className="text-3xl font-semibold tracking-tight">Acesse seu workspace</h2><p className="mt-2 leading-6 text-muted-foreground">Entre para continuar sua gestão com mais clareza.</p></div><form className="flex flex-col gap-5" onSubmit={handleLogin}><div className="flex flex-col gap-2"><Label htmlFor="email">E-mail corporativo</Label><div className="relative"><Mail className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" /><Input id="email" type="text" value={email} onChange={(event) => setEmail(event.target.value)} placeholder="nome@empresa.com" className="h-12 pl-10" autoComplete="username" required /></div></div><div className="flex flex-col gap-2"><div className="flex items-center justify-between"><Label htmlFor="password">Senha</Label><Link href="/esqueci-senha" className="text-sm font-medium text-accent-foreground hover:underline">Esqueci minha senha</Link></div><div className="relative"><LockKeyhole className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" /><Input id="password" type={showPassword ? "text" : "password"} value={password} onChange={(event) => setPassword(event.target.value)} placeholder="Digite sua senha" className="h-12 pl-10 pr-12" autoComplete="current-password" required /><button type="button" aria-label={showPassword ? "Ocultar senha" : "Mostrar senha"} onClick={() => setShowPassword((value) => !value)} className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground">{showPassword ? <EyeOff /> : <Eye />}</button></div></div>{error && <p role="alert" className="rounded-xl border border-destructive/30 bg-destructive/10 p-3 text-sm text-destructive">{error}</p>}<Button type="submit" className="h-12 w-full" disabled={loading}>{loading ? "Entrando..." : <>Entrar no Talent <ArrowRight data-icon="inline-end" /></>}</Button></form><p className="mt-10 text-center text-xs leading-5 text-muted-foreground">Ao entrar, você concorda com as políticas de segurança e privacidade da Talent.</p></div></section>
      </div>
    </main>
  )
}
