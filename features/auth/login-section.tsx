"use client"

import type React from "react"
import { useState } from "react"
import { useRouter } from "next/navigation"
import { useAuth } from "@/contexts/auth-context"
import { ArrowRight, Check, KeyRound, LockKeyhole, ShieldCheck, CircleHelp } from "lucide-react"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

export function LoginSection() {
  const router = useRouter()
  const { checkAuth } = useAuth()
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)
  const [email, setEmail] = useState("")
  const [codigo, setCodigo] = useState("")
  const [challenge, setChallenge] = useState<string | null>(null)
  const [tokenExibido, setTokenExibido] = useState<string | null>(null)

  const handleLogin = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    setError(null)
    setLoading(true)
    try {
      const response = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: email.trim(), ...(challenge ? { codigo, challenge } : {}) }),
      })
      const data = await response.json()
      if (!response.ok || !data.success) {
        setError(data.message || "Confira seus dados de acesso.")
        return
      }
      if (!challenge) {
        setChallenge(data.data.challenge)
        setTokenExibido(data.data.codigo)
        setCodigo("")
        return
      }
      await checkAuth(data.data.usuario)
      router.push("/dashboard")
    } catch {
      setError("Não foi possível conectar ao servidor.")
    } finally {
      setLoading(false)
    }
  }

  const closeChallenge = () => {
    setChallenge(null)
    setTokenExibido(null)
    setCodigo("")
    setError(null)
  }

  return (
    <main className="min-h-screen bg-background text-foreground">
      <div className="grid min-h-screen lg:grid-cols-[minmax(0,0.92fr)_minmax(440px,1.08fr)]">
        <section className="relative hidden overflow-hidden bg-sidebar px-10 py-10 text-sidebar-foreground lg:flex lg:flex-col lg:justify-between xl:px-16">
          <div className="relative z-10 flex items-center gap-3">
            <img src="/cardbrazil-icon.svg" alt="" width={42} height={42} className="h-10 w-10 object-contain" />
            <span className="font-heading text-xl font-semibold tracking-tight">Card Brasil</span>
          </div>

          <div className="relative z-10 max-w-lg py-16">
            <p className="mb-5 text-xs font-semibold uppercase tracking-[0.22em] text-sidebar-primary">Gestão inteligente em saúde</p>
            <h1 className="font-heading text-4xl font-semibold leading-[1.08] tracking-tight text-sidebar-foreground xl:text-6xl">
              Clareza para cuidar melhor da sua operação.
            </h1>
            <p className="mt-6 max-w-md text-base leading-7 text-sidebar-foreground/70">
              Uma plataforma simples e segura para administrar planos de saúde com mais controle, agilidade e confiança.
            </p>
            <div className="mt-10 flex flex-col gap-4 text-sm text-sidebar-foreground/80">
              {["Dados protegidos e acesso seguro", "Informações organizadas em um só lugar", "Decisões mais rápidas para sua equipe"].map((item) => (
                <div key={item} className="flex items-center gap-3">
                  <span className="flex h-5 w-5 items-center justify-center rounded-full bg-sidebar-primary/15 text-sidebar-primary">
                    <Check className="h-3.5 w-3.5" strokeWidth={2.5} />
                  </span>
                  {item}
                </div>
              ))}
            </div>
          </div>

          <div className="relative z-10 flex items-center gap-2 text-xs text-sidebar-foreground/50">
            <ShieldCheck className="h-4 w-4" />
            Tecnologia que simplifica a gestão.
          </div>
          <div className="pointer-events-none absolute -bottom-36 -right-36 h-96 w-96 rounded-full border-[44px] border-sidebar-primary/10" aria-hidden="true" />
        </section>

        <section className="flex min-h-screen flex-col bg-card px-5 py-6 sm:px-10 lg:px-16 xl:px-24">
          <div className="flex justify-end">
            <div className="flex items-center gap-2 text-xs text-muted-foreground">
              <LockKeyhole className="h-3.5 w-3.5 text-primary" />
              Ambiente seguro
            </div>
          </div>

          <div className="my-auto flex w-full justify-center py-14">
            <div className="w-full max-w-md">
              <div className="mb-10 lg:hidden">
                <div className="flex items-center gap-3">
                  <img src="/cardbrazil-icon.svg" alt="" width={40} height={40} className="h-10 w-10 object-contain" />
                  <span className="font-heading text-xl font-semibold tracking-tight text-foreground">Card Brasil</span>
                </div>
              </div>

              <div className="mb-8">
                <p className="mb-3 text-xs font-semibold uppercase tracking-[0.2em] text-primary">Acesso à plataforma</p>
                <h2 className="font-heading text-3xl font-semibold tracking-tight text-foreground sm:text-4xl">Bem-vindo(a) de volta.</h2>
                <p className="mt-3 text-sm leading-6 text-muted-foreground">Entre com seu usuário ou e-mail para continuar.</p>
              </div>

              <form className="space-y-5" onSubmit={handleLogin}>
                <div className="space-y-2">
                  <Label htmlFor="email" className="text-sm font-medium text-foreground">Usuário ou e-mail</Label>
                  <Input
                    id="email"
                    type="text"
                    value={email}
                    onChange={(event) => setEmail(event.target.value)}
                    placeholder="nome@empresa.com.br"
                    className="h-12 rounded-lg bg-background px-4 text-sm shadow-none"
                    autoComplete="username"
                    required
                  />
                </div>

                {error && <div role="alert" className="rounded-lg border border-destructive/20 bg-destructive/5 px-4 py-3 text-sm leading-5 text-destructive">{error}</div>}

                <Button type="submit" disabled={loading} className="h-12 w-full rounded-lg text-sm font-semibold shadow-none">
                  {loading ? "Verificando..." : challenge ? "Validar token" : "Entrar"}
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </form>

              <button type="button" onClick={() => router.push("/esqueci-senha")} className="mx-auto mt-7 flex items-center gap-2 text-sm text-muted-foreground transition-colors hover:text-primary">
                <CircleHelp className="h-4 w-4" />
                Esqueceu sua senha?
              </button>

              <p className="mt-14 text-center text-xs text-muted-foreground/70">Card Brasil · v1.0 · Todos os direitos reservados.</p>
            </div>
          </div>
        </section>
      </div>

      <Dialog open={Boolean(challenge)} onOpenChange={(open) => { if (!open) closeChallenge() }}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2"><KeyRound className="text-primary" size={20} />Confirme seu acesso</DialogTitle>
            <DialogDescription>Digite o token exibido abaixo para concluir o login de {email}.</DialogDescription>
          </DialogHeader>
          <div className="space-y-5">
            <div className="rounded-lg border border-primary/20 bg-primary/5 px-4 py-5 text-center">
              <p className="font-mono text-xs font-bold uppercase tracking-[0.18em] text-muted-foreground">Token de acesso</p>
              <p className="mt-2 font-mono text-3xl font-bold tracking-[0.35em] text-primary">{tokenExibido}</p>
              <p className="mt-2 text-xs text-muted-foreground">Válido por 10 minutos</p>
            </div>
            <div className="space-y-2">
              <Label htmlFor="codigo" className="font-mono text-xs font-bold uppercase tracking-[0.15em]">Digite o token</Label>
              <Input id="codigo" inputMode="numeric" maxLength={6} value={codigo} onChange={(event) => setCodigo(event.target.value.replace(/\D/g, ""))} placeholder="000000" autoFocus />
            </div>
            {error && <p role="alert" className="text-sm text-destructive">{error}</p>}
            <Button type="button" className="w-full" disabled={loading || codigo.length !== 6} onClick={() => void handleLogin({ preventDefault: () => undefined } as React.FormEvent<HTMLFormElement>)}>
              {loading ? "Validando..." : "Confirmar acesso"}
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </main>
  )
}
