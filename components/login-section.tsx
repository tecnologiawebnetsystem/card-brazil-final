"use client"

import type React from "react"
import { useState } from "react"
import { useRouter } from "next/navigation"
import { useAuth } from "@/contexts/auth-context"
import { ChevronRight, KeyRound, LockKeyhole, ShieldCheck, Users, FileText, CreditCard, BarChart3, CircleHelp, UserRound } from "lucide-react"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { LoginInstallActions } from "@/components/pwa/login-install-actions"

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
      const response = await fetch("/api/auth/login", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ email: email.trim(), ...(challenge ? { codigo, challenge } : {}) }) })
      const data = await response.json()
      if (!response.ok || !data.success) { setError(data.message || "Confira seus dados de acesso."); return }
      if (!challenge) {
        setChallenge(data.data.challenge)
        setTokenExibido(data.data.codigo)
        setCodigo("")
        return
      }
      await checkAuth(data.data.usuario)
      router.push("/dashboard")
    } catch { setError("Não foi possível conectar ao servidor.") } finally { setLoading(false) }
  }

  return (
    <main className="min-h-screen overflow-hidden bg-[#f7f9fc] text-[#0d2f63]">
      <div className="flex min-h-screen flex-col lg:flex-row">
        <section className="relative hidden min-h-screen overflow-hidden bg-[#06284b] text-white lg:flex lg:w-[61%] lg:flex-col lg:justify-between lg:px-16 lg:py-12 xl:px-20">
          <div className="absolute inset-0 bg-[linear-gradient(115deg,rgba(2,32,67,.96)_0%,rgba(13,67,125,.78)_55%,rgba(31,115,178,.28)_100%),url('/images/cardbrazil-building.png')] bg-cover bg-center" />
          <div className="absolute -right-36 -top-24 h-[115%] w-72 rotate-[17deg] rounded-[50%] bg-[#f7f9fc] shadow-[-20px_0_60px_rgba(7,41,76,.12)]" />
          <div className="absolute -bottom-44 right-[-6%] h-72 w-[68%] rotate-[-28deg] rounded-[50%] bg-[#13aa9a]/80" />
          <div className="absolute -bottom-48 right-[8%] h-64 w-[58%] rotate-[-28deg] rounded-[50%] bg-[#3157a4]/90" />
          <div className="relative z-10 flex items-center gap-4">
            <img src="/cardbrazil-icon.svg" alt="" width={64} height={64} className="h-16 w-16 max-w-none object-contain" />
            <div><h1 className="text-5xl font-bold tracking-tight text-white">Card Brazil</h1><p className="text-xl text-white/90">Gestão inteligente em saúde</p></div>
          </div>
          <div className="relative z-10 max-w-xl pb-8">
            <h2 className="text-4xl font-medium leading-tight text-white xl:text-5xl">Mais eficiência para<br />a gestão do seu <span className="text-[#35d4cc]">plano<br />de saúde.</span></h2>
            <p className="mt-7 max-w-lg text-lg leading-relaxed text-white/85">O Card Brasil é um ERP completo para administradoras de planos de saúde, com tecnologia, segurança e agilidade em todos os processos.</p>
            <div className="relative z-20 mt-12 grid max-w-2xl grid-cols-3 gap-x-5 gap-y-9 pr-16">
              {[{icon: Users, title: "Beneficiários", text: "Cadastro e gestão completa"}, {icon: FileText, title: "Propostas", text: "Mais agilidade no processo"}, {icon: CreditCard, title: "Contratos", text: "Controle e renovação"}, {icon: CreditCard, title: "Financeiro", text: "Conciliação e pagamentos"}, {icon: ShieldCheck, title: "Cobrança", text: "Redução da inadimplência"}, {icon: BarChart3, title: "Relatórios", text: "Decisões com base em dados"}].map(({ icon: Icon, title, text }) => <div key={title} className="flex gap-3"><span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-[#087b87]/80 ring-1 ring-white/10"><Icon className="h-6 w-6" /></span><div><p className="font-semibold text-white">{title}</p><p className="mt-1 text-sm leading-relaxed text-white/75">{text}</p></div></div>)}
            </div>
          </div>
          <p className="relative z-10 text-sm text-white/80">Tecnologia que simplifica.<br />Gestão que fortalece.</p>
        </section>
        <section className="relative flex min-h-screen w-full flex-col bg-[#f7f9fc] px-5 py-8 lg:w-[39%] lg:px-14 lg:py-11 xl:px-20">
          <div className="flex justify-end gap-6 text-xs text-[#0d2f63]"><span className="flex items-center gap-2"><LockKeyhole className="h-4 w-4 text-[#486b96]" /> Sistema seguro</span><span className="border-l border-[#cbd7e5] pl-6">Acesso restrito</span></div>
          <div className="my-auto w-full max-w-md self-center rounded-2xl border border-[#dbe4ef] bg-white p-8 shadow-[0_18px_55px_rgba(31,64,103,.08)] xl:p-10">
            <div className="mb-8 flex items-center gap-3"><img src="/cardbrazil-icon.svg" alt="Card Brasil" width={48} height={48} className="h-12 w-12 max-w-none object-contain" /><div><p className="text-2xl font-bold">Card Brasil</p><p className="text-xs text-[#3157a4]">Gestão inteligente em saúde</p></div></div>
            <h2 className="text-3xl font-bold">Bem-vindo(a) ao Card Brasil</h2><p className="mt-2 text-[#6680a5]">Acesse sua plataforma de gestão.</p>
            <form className="mt-9 space-y-5" onSubmit={handleLogin}>
              <div className="space-y-2"><Label htmlFor="email" className="text-xs font-semibold">Usuário ou e-mail</Label><div className="relative"><UserRound className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-[#7090b7]" /><Input id="email" type="text" value={email} onChange={(event) => setEmail(event.target.value)} placeholder="Digite seu usuário ou e-mail" className="h-12 rounded-lg border-[#cbd9ea] pl-12 text-sm placeholder:text-[#9bb0ca]" autoComplete="username" required /></div></div>
              {error && <div role="alert" className="rounded-lg border border-destructive/20 bg-destructive/5 px-4 py-3 text-sm text-destructive">{error}</div>}
              <Button type="submit" disabled={loading} className="h-12 w-full rounded-lg bg-[#2865b5] text-base font-semibold text-white shadow-none hover:bg-[#1f559d]">{loading ? "Verificando..." : challenge ? "Validar token" : "Entrar"}<ChevronRight className="ml-2 h-5 w-5" /></Button>
            </form>
            <button type="button" onClick={() => router.push("/esqueci-senha")} className="mx-auto mt-7 flex items-center gap-2 text-xs font-medium text-[#1665c1] hover:underline"><CircleHelp className="h-4 w-4" /> Esqueceu sua senha?</button>
          </div>
          <p className="mt-8 text-center text-xs text-[#7188a6]">Card Brasil &nbsp; v1.0 &nbsp; | &nbsp; Todos os direitos reservados.</p><LoginInstallActions />
        </section>
      </div>
      <Dialog open={Boolean(challenge)} onOpenChange={(open) => { if (!open) { setChallenge(null); setTokenExibido(null); setCodigo(""); setError(null) } }}>
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
