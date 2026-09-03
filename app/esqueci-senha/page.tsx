"use client"

import type React from "react"
import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { ArrowLeft, CheckCircle2, KeyRound, Mail, ShieldCheck, Sparkles } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Alert, AlertDescription } from "@/components/ui/alert"

export const dynamic = "force-dynamic"

export default function EsqueciSenhaPage() {
  const router = useRouter()
  const [token, setToken] = useState("")
  const [email, setEmail] = useState("")
  const [senha, setSenha] = useState("")
  const [confirmacao, setConfirmacao] = useState("")
  const [message, setMessage] = useState("")
  const [loading, setLoading] = useState(false)
  const [done, setDone] = useState(false)

  useEffect(() => { setToken(new URLSearchParams(window.location.search).get("token") || "") }, [])
  async function requestReset(event: React.FormEvent) { event.preventDefault(); setLoading(true); setMessage(""); const response = await fetch("/api/auth/forgot-password", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ email }) }); const data = await response.json(); setMessage(data.message); setLoading(false) }
  async function resetPassword(event: React.FormEvent) { event.preventDefault(); if (senha !== confirmacao) { setMessage("As senhas não coincidem."); return }; setLoading(true); const response = await fetch("/api/auth/reset-password", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ token, senha }) }); const data = await response.json(); setMessage(data.message); setDone(data.success); setLoading(false) }

  return <main className="min-h-screen bg-background px-4 py-6 text-foreground sm:px-6 lg:px-10"><div className="mx-auto grid min-h-[calc(100vh-3rem)] max-w-6xl overflow-hidden rounded-[2rem] border border-border bg-card shadow-2xl lg:grid-cols-[0.85fr_1.15fr]"><section className="hidden bg-primary p-10 text-primary-foreground lg:flex lg:flex-col lg:justify-between xl:p-14"><div className="flex items-center gap-3 text-lg font-semibold"><span className="grid size-10 place-items-center rounded-2xl bg-accent text-accent-foreground"><Sparkles /></span>Talent</div><div><p className="mb-4 text-sm uppercase tracking-[0.22em] text-primary-foreground/60">Acesso seguro</p><h1 className="text-balance text-5xl font-semibold leading-[1.04] tracking-[-0.06em]">Retome o controle da sua conta.</h1><p className="mt-6 leading-7 text-primary-foreground/75">Um link protegido e uma nova senha. Sem complicações.</p></div><div className="flex items-center gap-3 text-sm text-primary-foreground/70"><ShieldCheck /> Seus dados continuam protegidos.</div></section><section className="flex items-center justify-center p-6 sm:p-10 lg:p-16"><div className="w-full max-w-md"><Button variant="ghost" className="mb-10 -ml-3" onClick={() => router.push("/")}><ArrowLeft data-icon="inline-start" /> Voltar ao login</Button><div className="mb-8"><div className="mb-6 grid size-14 place-items-center rounded-2xl bg-accent/15 text-accent-foreground">{token ? <KeyRound /> : <Mail />}</div><p className="mb-3 text-sm font-medium text-accent-foreground">{token ? "Última etapa" : "Recupere seu acesso"}</p><h2 className="text-3xl font-semibold tracking-tight">{token ? "Crie uma nova senha" : "Enviaremos um link seguro"}</h2><p className="mt-3 leading-6 text-muted-foreground">{token ? "Use pelo menos 12 caracteres e escolha algo que você não usa em outros serviços." : "Informe seu e-mail corporativo para receber as instruções de recuperação."}</p></div>{done ? <div className="flex flex-col gap-5 text-center"><CheckCircle2 className="mx-auto size-12 text-primary" /><p className="leading-6 text-muted-foreground">Senha atualizada com sucesso. Você já pode acessar o Talent.</p><Button onClick={() => router.push("/")}>Ir para o login</Button></div> : token ? <form onSubmit={resetPassword} className="flex flex-col gap-5"><div className="flex flex-col gap-2"><Label htmlFor="senha">Nova senha</Label><Input id="senha" type="password" minLength={12} value={senha} onChange={(event) => setSenha(event.target.value)} required /></div><div className="flex flex-col gap-2"><Label htmlFor="confirmacao">Confirme sua nova senha</Label><Input id="confirmacao" type="password" minLength={12} value={confirmacao} onChange={(event) => setConfirmacao(event.target.value)} required /></div>{message && <Alert variant="destructive"><AlertDescription>{message}</AlertDescription></Alert>}<Button disabled={loading}>{loading ? "Atualizando senha..." : "Salvar nova senha"}</Button></form> : <form onSubmit={requestReset} className="flex flex-col gap-5"><div className="flex flex-col gap-2"><Label htmlFor="email">E-mail corporativo</Label><Input id="email" type="email" autoComplete="email" placeholder="voce@empresa.com" value={email} onChange={(event) => setEmail(event.target.value)} required /></div>{message && <Alert><AlertDescription>{message}</AlertDescription></Alert>}<Button disabled={loading}>{loading ? "Enviando instruções..." : "Enviar link de recuperação"}</Button></form>}</div></section></div></main>
}
