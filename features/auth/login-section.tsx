"use client"

import type { FormEvent } from "react"
import { useState } from "react"
import { useRouter } from "next/navigation"
import { useAuth } from "@/contexts/auth-context"
import { ArrowRight, Check, LockKeyhole, ShieldCheck, CircleHelp } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"

export function LoginSection() {
  const router = useRouter()
  const { login } = useAuth()
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)
  const [email, setEmail] = useState("")
  const [code, setCode] = useState("")
  const [debugCode, setDebugCode] = useState<string | null>(null)
  const [step, setStep] = useState<"email" | "code">("email")

  const handleLogin = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    setError(null)
    setLoading(true)
    try {
      if (step === "email") {
        const response = await fetch("/api/auth/request-code", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email: email.trim() }),
        })
        const data = await response.json()
        if (!response.ok || !data.success) throw new Error(data.message || "Não foi possível enviar o código.")
        setStep("code")
        setDebugCode(typeof data.debugCode === "string" ? data.debugCode : null)
        return
      }
      await login(email.trim(), code)
    } catch (cause) {
      setError(cause instanceof Error ? cause.message : "Não foi possível autenticar.")
    } finally {
      setLoading(false)
    }
  }

  const requestAnotherCode = async () => {
    setError(null)
    setLoading(true)
    try {
      const response = await fetch("/api/auth/request-code", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: email.trim() }),
      })
      const data = await response.json()
      if (!response.ok || !data.success) throw new Error(data.message || "Não foi possível enviar o código.")
      setCode("")
      setDebugCode(typeof data.debugCode === "string" ? data.debugCode : null)
    } catch (cause) {
      setError(cause instanceof Error ? cause.message : "Não foi possível enviar o código.")
    } finally {
      setLoading(false)
    }
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

        <section className="flex min-h-screen flex-col bg-muted/20 px-5 py-6 sm:px-10 lg:px-16 xl:px-24">
          <div className="flex justify-end">
            <div className="flex items-center gap-2 rounded-full border border-primary/15 bg-primary/5 px-3 py-2 text-xs font-medium text-muted-foreground">
              <LockKeyhole className="h-3.5 w-3.5 text-primary" />
              Ambiente seguro
            </div>
          </div>

          <div className="my-auto flex w-full justify-center py-10 sm:py-14">
            <div className="w-full max-w-md rounded-3xl border border-border/70 bg-card p-6 shadow-xl shadow-foreground/[0.04] sm:p-9">
              <div className="mb-10 lg:hidden">
                <div className="flex items-center gap-3">
                  <img src="/cardbrazil-icon.svg" alt="" width={40} height={40} className="h-10 w-10 object-contain" />
                  <span className="font-heading text-xl font-semibold tracking-tight text-foreground">Card Brasil</span>
                </div>
              </div>

              <div className="mb-8">
                <div className="mb-4 flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10 text-primary ring-1 ring-primary/15"><LockKeyhole className="h-5 w-5" /></div>
                <p className="mb-3 text-xs font-semibold uppercase tracking-[0.2em] text-primary">Acesso à plataforma</p>
                <h2 className="font-heading text-3xl font-semibold tracking-tight text-foreground sm:text-4xl">{step === "email" ? "Bem-vindo(a) de volta." : "Confira seu e-mail."}</h2>
                <p className="mt-3 text-sm leading-6 text-muted-foreground">{step === "email" ? "Informe seu e-mail para receber um código de acesso." : `Enviamos um código de acesso para ${email.trim()}.`}</p>
              </div>

              <form className="space-y-5" onSubmit={handleLogin}>
                {step === "email" ? (
                  <div className="space-y-2">
                    <Label htmlFor="email" className="text-sm font-medium text-foreground">E-mail</Label>
                    <Input
                      id="email"
                      type="email"
                      value={email}
                      onChange={(event) => setEmail(event.target.value)}
                      placeholder="nome@empresa.com.br"
                      className="h-12 rounded-xl border-border/80 bg-background px-4 text-sm shadow-sm transition-shadow focus-visible:ring-2 focus-visible:ring-primary/25"
                      autoComplete="email"
                      maxLength={254}
                      required
                    />
                  </div>
                ) : (
                  <div className="space-y-2">
                    <Label htmlFor="codigo" className="text-sm font-medium text-foreground">Código de acesso</Label>
                    <Input
                      id="codigo"
                      type="text"
                      inputMode="numeric"
                      autoComplete="one-time-code"
                      value={code}
                      onChange={(event) => setCode(event.target.value.replace(/\\D/g, "").slice(0, 6))}
                      placeholder="000000"
                      className="h-12 rounded-xl border-border/80 bg-background px-4 text-center font-mono text-lg tracking-[0.4em] shadow-sm transition-shadow focus-visible:ring-2 focus-visible:ring-primary/25"
                      pattern="[0-9]{6}"
                      maxLength={6}
                      aria-describedby="codigo-ajuda"
                      required
                    />
                    <p id="codigo-ajuda" className="text-xs leading-5 text-muted-foreground">O código expira em 10 minutos.</p>
                  </div>
                )}

                {error && <div role="alert" className="rounded-lg border border-destructive/20 bg-destructive/5 px-4 py-3 text-sm leading-5 text-destructive">{error}</div>}

                <Button type="submit" disabled={loading || (step === "code" && code.length !== 6)} className="h-12 w-full rounded-xl text-sm font-semibold shadow-sm shadow-primary/20 transition-transform hover:-translate-y-0.5">
                  {loading ? (step === "email" ? "Enviando código..." : "Verificando...") : (step === "email" ? "Continuar" : "Entrar")}
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </form>

              {step === "code" ? (
                <div className="mt-7 flex flex-col items-center gap-3 text-sm">
                  <button type="button" onClick={requestAnotherCode} disabled={loading} className="text-muted-foreground transition-colors hover:text-primary disabled:opacity-50">Reenviar código</button>
                  <button type="button" onClick={() => { setStep("email"); setCode(""); setError(null) }} className="text-muted-foreground transition-colors hover:text-primary">Usar outro e-mail</button>
                </div>
              ) : (
                <button type="button" onClick={() => router.push("/esqueci-senha")} className="mx-auto mt-7 flex items-center gap-2 text-sm text-muted-foreground transition-colors hover:text-primary">
                  <CircleHelp className="h-4 w-4" />
                  Esqueceu sua senha?
                </button>
              )}

              <div className="mt-10 border-t border-border/60 pt-5"><p className="text-center text-xs text-muted-foreground/70">Card Brasil · v1.0 · Todos os direitos reservados.</p></div>
            </div>
          </div>
        </section>
      </div>

      <Dialog open={Boolean(debugCode)} onOpenChange={(open) => { if (!open) setDebugCode(null) }}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Código de acesso</DialogTitle>
            <DialogDescription>
              Use este código para concluir seu acesso. Ele expira em 10 minutos.
            </DialogDescription>
          </DialogHeader>
          {debugCode && (
            <div className="rounded-xl border border-border bg-muted/50 px-5 py-4 text-center font-mono text-2xl font-semibold tracking-[0.45em] text-foreground" aria-label={`Código de acesso ${debugCode}`}>
              {debugCode}
            </div>
          )}
          <p className="text-sm leading-6 text-muted-foreground">
            Exibição temporária para desenvolvimento. O envio por e-mail será usado em produção.
          </p>
          <DialogFooter>
            <Button type="button" onClick={() => { if (debugCode) setCode(debugCode); setDebugCode(null) }}>
              Preencher código
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </main>
  )
}
