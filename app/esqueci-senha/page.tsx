"use client"

import type React from "react"
import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { ArrowLeft, CheckCircle, KeyRound, ShieldAlert } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
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

  useEffect(() => {
    setToken(new URLSearchParams(window.location.search).get("token") || "")
  }, [])

  async function requestReset(event: React.FormEvent) {
    event.preventDefault()
    setLoading(true)
    setMessage("")
    const response = await fetch("/api/auth/forgot-password", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email }),
    })
    const data = await response.json()
    setMessage(data.message)
    setLoading(false)
  }

  async function resetPassword(event: React.FormEvent) {
    event.preventDefault()
    if (senha !== confirmacao) return setMessage("As senhas não coincidem.")
    setLoading(true)
    const response = await fetch("/api/auth/reset-password", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ token, senha }),
    })
    const data = await response.json()
    setMessage(data.message)
    setDone(data.success)
    setLoading(false)
  }

  return (
    <main className="aperTo-abraco-pattern flex min-h-screen items-center justify-center p-4">
      <Card className="w-full max-w-md rounded-2xl border-border/80 bg-card/95 shadow-xl shadow-primary/10 backdrop-blur">
        <CardHeader className="space-y-4 text-center">
          <Button variant="ghost" className="mx-auto w-fit text-muted-foreground" onClick={() => router.push("/")}>
            <ArrowLeft className="mr-2 size-4" /> Voltar ao login
          </Button>
          <div className="mx-auto flex size-14 items-center justify-center rounded-2xl bg-primary/10 text-primary">
            {token ? <KeyRound className="size-7" /> : <ShieldAlert className="size-7" />}
          </div>
          <CardTitle className="text-2xl">{token ? "Criar nova senha" : "Recuperar acesso"}</CardTitle>
          <CardDescription>{token ? "Defina uma senha forte com pelo menos 12 caracteres." : "Informe seu e-mail para gerar um link seguro."}</CardDescription>
        </CardHeader>
        <CardContent>
          {done ? (
            <div className="space-y-4 text-center"><CheckCircle className="mx-auto size-10 text-primary" /><p className="text-sm text-muted-foreground">Senha atualizada. Agora você já pode entrar com a nova senha.</p><Button className="w-full" onClick={() => router.push("/")}>Ir para o login</Button></div>
          ) : token ? (
            <form onSubmit={resetPassword} className="space-y-5">
              <div className="space-y-2"><Label htmlFor="senha">Nova senha</Label><Input id="senha" type="password" minLength={12} value={senha} onChange={(event) => setSenha(event.target.value)} required /></div>
              <div className="space-y-2"><Label htmlFor="confirmacao">Confirmar senha</Label><Input id="confirmacao" type="password" minLength={12} value={confirmacao} onChange={(event) => setConfirmacao(event.target.value)} required /></div>
              {message && <Alert variant="destructive"><AlertDescription>{message}</AlertDescription></Alert>}
              <Button className="w-full" disabled={loading}>{loading ? "Atualizando..." : "Atualizar senha"}</Button>
            </form>
          ) : (
            <form onSubmit={requestReset} className="space-y-5">
              <div className="space-y-2"><Label htmlFor="email">E-mail</Label><Input id="email" type="email" autoComplete="email" placeholder="voce@empresa.com" value={email} onChange={(event) => setEmail(event.target.value)} required /></div>
              {message && <Alert><AlertDescription>{message}</AlertDescription></Alert>}
              <Button className="w-full" disabled={loading}>{loading ? "Enviando e-mail..." : "Enviar link de recuperação"}</Button>
            </form>
          )}
        </CardContent>
      </Card>
    </main>
  )
}
