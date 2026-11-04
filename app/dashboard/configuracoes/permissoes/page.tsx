"use client"

import { useMemo, useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Switch } from "@/components/ui/switch"
import { Badge } from "@/components/ui/badge"
import { KeyRound, Save, ShieldCheck } from "lucide-react"
import { toast } from "sonner"

const grupos = [
  { nome: "Cadastros", descricao: "Pessoas, empresas e registros operacionais", recursos: ["Visualizar", "Criar", "Editar", "Excluir"] },
  { nome: "Financeiro", descricao: "Recebimentos, pagamentos e movimentações", recursos: ["Visualizar", "Criar", "Editar", "Excluir"] },
  { nome: "Cobrança", descricao: "Boletos, parcelas e pagamentos", recursos: ["Visualizar", "Criar", "Editar", "Cancelar"] },
  { nome: "Relatórios", descricao: "Consultas e exportação de informações", recursos: ["Visualizar", "Exportar"] },
  { nome: "Sistema", descricao: "Usuários, perfis e configurações", recursos: ["Visualizar", "Gerenciar"] },
]

export default function PermissoesPage() {
  const [perfil, setPerfil] = useState("administrador")
  const [permissoes, setPermissoes] = useState<Record<string, boolean>>(
    Object.fromEntries(grupos.flatMap((grupo) => grupo.recursos.map((recurso) => [`${grupo.nome}.${recurso}`, true])))
  )
  const total = Object.keys(permissoes).length
  const ativas = Object.values(permissoes).filter(Boolean).length
  const percentual = total ? Math.round((ativas / total) * 100) : 0
  const perfilLabel = useMemo(() => ({ administrador: "Administrador", operador: "Operador", estipulante: "Estipulante", agenciador: "Agenciador", corretor: "Corretor" })[perfil] || perfil, [perfil])

  const toggle = (chave: string, valor: boolean) => setPermissoes((atual) => ({ ...atual, [chave]: valor }))

  return (
    <div className="min-h-screen bg-background">
      <div className="mx-auto max-w-7xl px-6 py-8">
        <div className="mb-8 flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-start gap-4">
            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary ring-1 ring-primary/15"><KeyRound className="h-6 w-6" /></div>
            <div><p className="mb-1 text-xs font-semibold uppercase tracking-[0.18em] text-primary">Segurança do sistema</p><h1 className="text-3xl font-bold tracking-tight text-foreground">Permissões</h1><p className="mt-1 text-muted-foreground">Defina as ações que cada perfil pode executar.</p></div>
          </div>
          <Button onClick={() => toast.success("Permissões salvas com sucesso!")} className="w-full sm:w-auto"><Save className="mr-2 h-4 w-4" />Salvar alterações</Button>
        </div>

        <Card className="mb-8 overflow-hidden border-border shadow-sm">
          <CardHeader className="border-b border-border/70 bg-muted/30 px-6 py-5"><CardTitle className="text-lg">Perfil de acesso</CardTitle><CardDescription>Selecione o perfil para configurar suas permissões.</CardDescription></CardHeader>
          <CardContent className="flex flex-col gap-5 px-6 py-5 sm:flex-row sm:items-center sm:justify-between"><Select value={perfil} onValueChange={setPerfil}><SelectTrigger className="w-full sm:w-72"><SelectValue /></SelectTrigger><SelectContent>{["administrador", "operador", "estipulante", "agenciador", "corretor"].map((item) => <SelectItem key={item} value={item}>{({ administrador: "Administrador", operador: "Operador", estipulante: "Estipulante", agenciador: "Agenciador", corretor: "Corretor" }[item])}</SelectItem>)}</SelectContent></Select><div className="flex items-center gap-3"><ShieldCheck className="h-5 w-5 text-primary" /><div><p className="font-medium text-foreground">{ativas} de {total} permissões ativas</p><p className="text-sm text-muted-foreground">{percentual}% de acesso liberado para {perfilLabel}</p></div></div></CardContent>
        </Card>

        <div className="grid gap-5 lg:grid-cols-2">
          {grupos.map((grupo) => <Card key={grupo.nome} className="overflow-hidden border-border shadow-sm"><CardHeader className="border-b border-border/70 bg-muted/30 px-6 py-5"><CardTitle className="text-lg">{grupo.nome}</CardTitle><CardDescription>{grupo.descricao}</CardDescription></CardHeader><CardContent className="space-y-3 p-5">{grupo.recursos.map((recurso) => { const chave = `${grupo.nome}.${recurso}`; return <div key={chave} className="flex items-center justify-between gap-4 rounded-xl border border-border/80 p-4"><div><p className="font-medium text-foreground">{recurso}</p><p className="text-xs text-muted-foreground">Permissão para {recurso.toLowerCase()} em {grupo.nome.toLowerCase()}</p></div><Switch checked={permissoes[chave]} onCheckedChange={(valor) => toggle(chave, valor)} aria-label={`${recurso} em ${grupo.nome}`} /></div> })}</CardContent></Card>)}
        </div>
        <div className="mt-6 flex items-center gap-2 text-sm text-muted-foreground"><Badge variant="secondary">Perfil selecionado: {perfilLabel}</Badge><span>As alterações ficam disponíveis após salvar.</span></div>
      </div>
    </div>
  )
}
