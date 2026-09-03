"use client"

import { useState } from "react"
import useSWR from "swr"
import { UserRound, Save, ArrowLeft } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"

const fetcher = (url: string) => fetch(url).then((response) => response.json())

export default function PerfilPage() {
  const { data, mutate } = useSWR("/api/auth/me", fetcher)
  const user = data?.user
  const [nome, setNome] = useState("")
  const [email, setEmail] = useState("")
  const [message, setMessage] = useState("")

  const displayName = nome || user?.nome || user?.nome_completo || "Usuário"
  const initials = displayName.split(" ").map((part: string) => part[0]).join("").slice(0, 2).toUpperCase()

  const saveProfile = async (event: React.FormEvent) => {
    event.preventDefault()
    const response = await fetch("/api/auth/me", { method: "PATCH", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ nome: nome || user?.nome, email: email || user?.email }) })
    setMessage(response.ok ? "Perfil atualizado com sucesso." : "Não foi possível atualizar o perfil.")
    if (response.ok) mutate()
  }

  return <div className="mx-auto w-full max-w-3xl space-y-6"><div className="flex items-center gap-3"><Button variant="ghost" size="icon" asChild><a href="/dashboard" aria-label="Voltar"><ArrowLeft className="h-5 w-5" /></a></Button><div><p className="text-sm text-primary">Minha conta</p><h1 className="text-3xl font-semibold tracking-tight">Meu perfil</h1><p className="mt-1 text-muted-foreground">Atualize seus dados de acesso e identificação.</p></div></div><Card><CardHeader><CardTitle className="flex items-center gap-2"><UserRound className="h-5 w-5 text-primary" />Dados pessoais</CardTitle></CardHeader><CardContent><form onSubmit={saveProfile} className="space-y-5"><div className="flex items-center gap-4 border-b border-border pb-5"><Avatar className="h-16 w-16"><AvatarFallback className="bg-primary text-lg text-primary-foreground">{initials}</AvatarFallback></Avatar><div><p className="font-semibold">{displayName}</p><p className="text-sm text-muted-foreground">{user?.role_nome || "Usuário CardBrazil"}</p></div></div><div className="grid gap-5 md:grid-cols-2"><div className="space-y-2"><Label htmlFor="nome">Nome completo</Label><Input id="nome" defaultValue={user?.nome || user?.nome_completo || ""} onChange={(event) => setNome(event.target.value)} /></div><div className="space-y-2"><Label htmlFor="email">E-mail</Label><Input id="email" type="email" defaultValue={user?.email || ""} onChange={(event) => setEmail(event.target.value)} /></div></div>{message && <p className="text-sm text-primary" role="status">{message}</p>}<Button type="submit"><Save className="mr-2 h-4 w-4" />Salvar alterações</Button></form></CardContent></Card></div>
}
