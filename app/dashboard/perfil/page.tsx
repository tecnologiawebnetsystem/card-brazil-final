"use client"

import { useState } from "react"
import useSWR from "swr"
import { UserRound, Save, ArrowLeft, ShieldCheck, Eye, EyeOff, Loader2 } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { getAvatarOption } from "@/lib/avatar-options"

const fetcher = (url: string) => fetch(url).then((response) => response.json())

export default function PerfilPage() {
  const { data, mutate } = useSWR("/api/auth/me", fetcher)
  const user = data?.user

  const [nome, setNome] = useState("")
  const [email, setEmail] = useState("")
  const [message, setMessage] = useState("")
  const [savingProfile, setSavingProfile] = useState(false)

  const [senhaAtual, setSenhaAtual] = useState("")
  const [novaSenha, setNovaSenha] = useState("")
  const [confirmarSenha, setConfirmarSenha] = useState("")
  const [showSenhas, setShowSenhas] = useState(false)
  const [savingSenha, setSavingSenha] = useState(false)
  const [senhaMessage, setSenhaMessage] = useState<{ type: "ok" | "erro"; text: string } | null>(null)

  const displayName = nome || user?.nome_completo || "Usuário"
  const avatar = getAvatarOption(user?.avatar_url)
  const initials = displayName
    .split(" ")
    .map((part: string) => part[0])
    .join("")
    .slice(0, 2)
    .toUpperCase()

  const saveProfile = async (event: React.FormEvent) => {
    event.preventDefault()
    setSavingProfile(true)
    setMessage("")
    const response = await fetch("/api/auth/me", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ nome: nome || user?.nome_completo, email: email || user?.email }),
    })
    setMessage(response.ok ? "Perfil atualizado com sucesso." : "Não foi possível atualizar o perfil.")
    if (response.ok) mutate()
    setSavingProfile(false)
  }

  const changePassword = async (event: React.FormEvent) => {
    event.preventDefault()
    setSenhaMessage(null)

    if (novaSenha.length < 8) {
      setSenhaMessage({ type: "erro", text: "A nova senha deve ter pelo menos 8 caracteres." })
      return
    }
    if (novaSenha !== confirmarSenha) {
      setSenhaMessage({ type: "erro", text: "A confirmação não corresponde à nova senha." })
      return
    }

    setSavingSenha(true)
    const response = await fetch("/api/auth/change-password", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ senhaAtual, novaSenha }),
    })
    const result = await response.json().catch(() => ({ success: false, message: "Erro inesperado." }))
    if (response.ok && result.success) {
      setSenhaMessage({ type: "ok", text: result.message || "Senha alterada com sucesso." })
      setSenhaAtual("")
      setNovaSenha("")
      setConfirmarSenha("")
    } else {
      setSenhaMessage({ type: "erro", text: result.message || "Não foi possível alterar a senha." })
    }
    setSavingSenha(false)
  }

  return (
    <div className="mx-auto w-full max-w-3xl space-y-6">
      <div className="flex items-center gap-3">
        <Button variant="ghost" size="icon" asChild>
          <a href="/dashboard" aria-label="Voltar">
            <ArrowLeft className="h-5 w-5" />
          </a>
        </Button>
        <div>
          <p className="text-sm text-primary">Minha conta</p>
          <h1 className="text-3xl font-semibold tracking-tight">Meu perfil</h1>
          <p className="mt-1 text-muted-foreground">Atualize seus dados de acesso e identificação.</p>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <UserRound className="h-5 w-5 text-primary" />
            Dados pessoais
          </CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={saveProfile} className="space-y-5">
            <div className="flex items-center gap-4 border-b border-border pb-5">
              <Avatar className="h-16 w-16">
                {avatar && <AvatarImage src={avatar.src} alt={avatar.label} />}
                <AvatarFallback className="bg-primary text-lg text-primary-foreground">{initials}</AvatarFallback>
              </Avatar>
              <div>
                <p className="font-semibold">{displayName}</p>
                <p className="text-sm capitalize text-muted-foreground">{user?.tipo_usuario || "Usuário CardBrazil"}</p>
              </div>
            </div>
            <div className="grid gap-5 md:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="nome">Nome completo</Label>
                <Input
                  id="nome"
                  defaultValue={user?.nome_completo || ""}
                  onChange={(event) => setNome(event.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="email">E-mail</Label>
                <Input
                  id="email"
                  type="email"
                  defaultValue={user?.email || ""}
                  onChange={(event) => setEmail(event.target.value)}
                />
              </div>
            </div>
            {message && (
              <p className="text-sm text-primary" role="status">
                {message}
              </p>
            )}
            <Button type="submit" disabled={savingProfile}>
              {savingProfile ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Save className="mr-2 h-4 w-4" />}
              Salvar alterações
            </Button>
          </form>
        </CardContent>
      </Card>

      <Card id="seguranca" className="scroll-mt-24">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <ShieldCheck className="h-5 w-5 text-primary" />
            Alterar senha
          </CardTitle>
          <CardDescription>
            Você está logado, então basta confirmar a senha atual e definir a nova senha.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={changePassword} className="space-y-5">
            <div className="space-y-2">
              <Label htmlFor="senhaAtual">Senha atual</Label>
              <Input
                id="senhaAtual"
                type={showSenhas ? "text" : "password"}
                autoComplete="current-password"
                value={senhaAtual}
                onChange={(event) => setSenhaAtual(event.target.value)}
                required
              />
            </div>
            <div className="grid gap-5 md:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="novaSenha">Nova senha</Label>
                <Input
                  id="novaSenha"
                  type={showSenhas ? "text" : "password"}
                  autoComplete="new-password"
                  value={novaSenha}
                  onChange={(event) => setNovaSenha(event.target.value)}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="confirmarSenha">Confirmar nova senha</Label>
                <Input
                  id="confirmarSenha"
                  type={showSenhas ? "text" : "password"}
                  autoComplete="new-password"
                  value={confirmarSenha}
                  onChange={(event) => setConfirmarSenha(event.target.value)}
                  required
                />
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Button
                type="button"
                variant="ghost"
                size="sm"
                className="text-muted-foreground"
                onClick={() => setShowSenhas((prev) => !prev)}
              >
                {showSenhas ? <EyeOff className="mr-2 h-4 w-4" /> : <Eye className="mr-2 h-4 w-4" />}
                {showSenhas ? "Ocultar senhas" : "Mostrar senhas"}
              </Button>
              <p className="text-xs text-muted-foreground">Mínimo de 8 caracteres.</p>
            </div>
            {senhaMessage && (
              <p
                className={senhaMessage.type === "ok" ? "text-sm text-primary" : "text-sm text-destructive"}
                role="status"
              >
                {senhaMessage.text}
              </p>
            )}
            <Button type="submit" disabled={savingSenha}>
              {savingSenha ? (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              ) : (
                <ShieldCheck className="mr-2 h-4 w-4" />
              )}
              Alterar senha
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}
