"use client"

import { useEffect, useMemo, useState } from "react"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Check, Save, Shield, Users } from "lucide-react"

type UserRow = { id: number; nome: string; email: string; perfilLegado: string; perfis: { nome: string }[] }
type MatrixData = { profiles: { nome: string }[]; resources: { slug: string; nome: string }[]; actions: { slug: string; nome: string }[]; grants: { perfil_nome: string; recurso: string; acao: string; permitido: boolean }[] }
type MenuConfig = { id: number; titulo: string; rota: string | null; modulo_nome: string; ativo_global: boolean }

export default function ControleAcessoPage() {
  const [users, setUsers] = useState<UserRow[]>([])
  const [profiles, setProfiles] = useState<{ nome: string }[]>([])
  const [matrix, setMatrix] = useState<MatrixData>({ profiles: [], resources: [], actions: [], grants: [] })
  const [menus, setMenus] = useState<MenuConfig[]>([])
  const [selectedUser, setSelectedUser] = useState<number | null>(null)
  const [selectedProfile, setSelectedProfile] = useState("")
  const [selectedProfiles, setSelectedProfiles] = useState<string[]>([])
  const [selectedGrants, setSelectedGrants] = useState<Record<string, boolean>>({})
  const [search, setSearch] = useState("")
  const [message, setMessage] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)

  async function load() {
    try {
      const [usersResponse, matrixResponse, menusResponse] = await Promise.all([fetch("/api/sistemas/usuarios-perfis"), fetch("/api/sistemas/matriz"), fetch("/api/sistemas/menu-configuracao")])
      const usersData = await usersResponse.json()
      const matrixData = await matrixResponse.json()
      const menusData = await menusResponse.json()
      if (!usersResponse.ok) throw new Error(usersData.error)
      if (!matrixResponse.ok) throw new Error(matrixData.error)
      setUsers(usersData.users || [])
      setProfiles(usersData.profiles || [])
      setMatrix(matrixData)
      if (menusResponse.ok) setMenus(menusData.menus || [])
      if (!selectedProfile && matrixData.profiles?.[0]) setSelectedProfile(matrixData.profiles[0].nome)
    } catch (cause) { setError(cause instanceof Error ? cause.message : "Não foi possível carregar a configuração.") }
  }

  useEffect(() => { load() }, [])
  useEffect(() => {
    const next: Record<string, boolean> = {}
    matrix.grants.filter((grant) => grant.perfil_nome === selectedProfile).forEach((grant) => { next[`${grant.recurso}:${grant.acao}`] = grant.permitido })
    setSelectedGrants(next)
  }, [matrix.grants, selectedProfile])

  const filteredUsers = useMemo(() => users.filter((user) => `${user.nome} ${user.email}`.toLowerCase().includes(search.toLowerCase())), [users, search])
  const chosenUser = users.find((user) => user.id === selectedUser)

  async function saveUserProfiles() {
    if (!selectedUser) return
    const response = await fetch("/api/sistemas/usuarios-perfis", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ usuarioId: selectedUser, perfis: selectedProfiles }) })
    const data = await response.json()
    if (!response.ok) return setError(data.error)
    setMessage("Perfis do usuário atualizados."); await load()
  }

  async function saveMatrix() {
    const grants = Object.entries(selectedGrants).map(([key, permitido]) => { const [recurso, acao] = key.split(":"); return { recurso, acao, permitido } })
    const response = await fetch("/api/sistemas/matriz", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ perfil: selectedProfile, grants }) })
    const data = await response.json()
    if (!response.ok) return setError(data.error)
    setMessage("Matriz de permissões salva."); await load()
  }

  async function toggleGlobalMenu(menu: MenuConfig) {
    const response = await fetch("/api/sistemas/menu-configuracao", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ menuId: menu.id, ativoGlobal: !menu.ativo_global }) })
    const data = await response.json()
    if (!response.ok) return setError(data.error)
    setMenus((current) => current.map((item) => item.id === menu.id ? { ...item, ativo_global: !item.ativo_global } : item))
    setMessage(`Menu ${menu.ativo_global ? "desativado" : "ativado"} para todos os perfis.`)
  }

  function selectUser(user: UserRow) { setSelectedUser(user.id); setSelectedProfiles(user.perfis.length ? user.perfis.map((profile) => profile.nome) : [user.perfilLegado]) }
  function toggleGrant(resource: string, action: string) { const key = `${resource}:${action}`; setSelectedGrants((current) => ({ ...current, [key]: !current[key] })) }

  return <main className="flex-1 space-y-6 p-6">
    <header><h1 className="text-3xl font-bold tracking-tight">Controle de Acesso</h1><p className="text-muted-foreground">Configure usuários, perfis, permissões e alçadas com regras persistidas no banco.</p></header>
    {error && <p className="rounded-md border border-destructive/30 bg-destructive/10 p-3 text-sm text-destructive">{error}</p>}
    {message && <p className="rounded-md border border-primary/30 bg-primary/10 p-3 text-sm">{message}</p>}
    <div className="grid gap-4 md:grid-cols-3"><Card><CardHeader><CardTitle className="text-sm">Usuários</CardTitle></CardHeader><CardContent className="flex items-center gap-2 text-2xl font-bold"><Users />{users.length}</CardContent></Card><Card><CardHeader><CardTitle className="text-sm">Perfis</CardTitle></CardHeader><CardContent className="flex items-center gap-2 text-2xl font-bold"><Shield />{profiles.length}</CardContent></Card><Card><CardHeader><CardTitle className="text-sm">Recursos</CardTitle></CardHeader><CardContent className="text-2xl font-bold">{matrix.resources.length}</CardContent></Card></div>
    <Tabs defaultValue="users" className="space-y-4"><TabsList><TabsTrigger value="users">Usuários x Perfis</TabsTrigger><TabsTrigger value="matrix">Matriz de Permissões</TabsTrigger><TabsTrigger value="menus">Menus globais</TabsTrigger><TabsTrigger value="delegations">Alçadas</TabsTrigger></TabsList>
      <TabsContent value="users"><Card><CardHeader><CardTitle>Associação de usuários a perfis</CardTitle><CardDescription>Um usuário pode possuir mais de um perfil ativo.</CardDescription><Input placeholder="Buscar usuário..." value={search} onChange={(event) => setSearch(event.target.value)} /></CardHeader><CardContent className="grid gap-6 lg:grid-cols-[1fr_1fr]"><div className="divide-y rounded-md border">{filteredUsers.map((user) => <button type="button" key={user.id} onClick={() => selectUser(user)} className={`flex w-full items-center justify-between p-3 text-left hover:bg-muted ${selectedUser === user.id ? "bg-muted" : ""}`}><span><strong>{user.nome}</strong><span className="block text-sm text-muted-foreground">{user.email}</span></span><span className="flex gap-1">{(user.perfis.length ? user.perfis : [{ nome: user.perfilLegado }]).map((profile) => <Badge key={profile.nome} variant="outline">{profile.nome}</Badge>)}</span></button>)}</div><div className="space-y-4">{chosenUser ? <><div><h3 className="font-semibold">{chosenUser.nome}</h3><p className="text-sm text-muted-foreground">Selecione os perfis permitidos</p></div><div className="grid gap-2">{profiles.map((profile) => <label key={profile.nome} className="flex items-center gap-2 rounded-md border p-3"><input type="checkbox" checked={selectedProfiles.includes(profile.nome)} onChange={() => setSelectedProfiles((current) => current.includes(profile.nome) ? current.filter((item) => item !== profile.nome) : [...current, profile.nome])} />{profile.nome}</label>)}</div><Button onClick={saveUserProfiles}><Save data-icon="inline-start" />Salvar perfis</Button></> : <p className="text-sm text-muted-foreground">Selecione um usuário para editar seus perfis.</p>}</div></CardContent></Card></TabsContent>
      <TabsContent value="matrix"><Card><CardHeader><CardTitle>Matriz Perfil x Permissão</CardTitle><CardDescription>As alterações são aplicadas server-side às rotas e ações autorizadas.</CardDescription><div className="flex flex-wrap gap-2">{matrix.profiles.map((profile) => <Button key={profile.nome} variant={selectedProfile === profile.nome ? "default" : "outline"} onClick={() => setSelectedProfile(profile.nome)}>{profile.nome}</Button>)}</div></CardHeader><CardContent className="overflow-x-auto"><table className="w-full text-sm"><thead><tr className="border-b text-left"><th className="p-3">Recurso</th>{matrix.actions.map((action) => <th key={action.slug} className="p-3">{action.nome}</th>)}</tr></thead><tbody>{matrix.resources.map((resource) => <tr key={resource.slug} className="border-b"><td className="p-3 font-medium">{resource.nome}</td>{matrix.actions.map((action) => { const key = `${resource.slug}:${action.slug}`; return <td key={key} className="p-3"><button type="button" aria-label={`${resource.nome} - ${action.nome}`} onClick={() => toggleGrant(resource.slug, action.slug)} className={`rounded-md border p-2 ${selectedGrants[key] ? "bg-primary text-primary-foreground" : "text-muted-foreground"}`}>{selectedGrants[key] ? <Check /> : "—"}</button></td> })}</tr>)}</tbody></table><Button className="mt-4" onClick={saveMatrix}><Save data-icon="inline-start" />Salvar matriz</Button></CardContent></Card></TabsContent>
      <TabsContent value="menus"><Card><CardHeader><CardTitle>Ativação global dos menus</CardTitle><CardDescription>Somente o administrador pode ativar ou desativar um item para todos os perfis.</CardDescription></CardHeader><CardContent className="divide-y rounded-md border p-0">{menus.map((menu) => <div key={menu.id} className="flex items-center justify-between gap-4 p-4"><div><p className="font-medium">{menu.titulo}</p><p className="text-sm text-muted-foreground">{menu.modulo_nome}{menu.rota ? ` · ${menu.rota}` : ""}</p></div><Button variant={menu.ativo_global ? "default" : "outline"} onClick={() => toggleGlobalMenu(menu)}>{menu.ativo_global ? "Ativo para todos" : "Desativado para todos"}</Button></div>)}{menus.length === 0 && <p className="p-4 text-sm text-muted-foreground">Nenhum menu parametrizado foi carregado.</p>}</CardContent></Card></TabsContent>
      <TabsContent value="delegations"><Card><CardHeader><CardTitle>Alçadas</CardTitle><CardDescription>O editor de alçadas será conectado ao mesmo catálogo de recursos e perfis, mantendo vigência, limites e sequência.</CardDescription></CardHeader><CardContent><Button variant="outline" onClick={() => window.location.assign("/dashboard/sistemas/controle-acesso?aba=alcadas")}>Abrir configuração de alçadas</Button></CardContent></Card></TabsContent>
    </Tabs>
  </main>
}
