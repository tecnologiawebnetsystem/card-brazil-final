"use client"

import { useState } from "react"
import useSWR from "swr"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { CadastroTable, type CadastroColumn } from "@/components/tables/cadastro-table"
import { CadastroSummaryCard, CadastroSummaryGrid } from "@/components/tables/cadastro-summary-card"
import { CadastroDetailsGrid, CadastroDetailField } from "@/components/tables/cadastro-details"
import { toast } from "sonner"
import { Plus } from "lucide-react"

type Produto = { id: number; nome: string; status?: string; ativo?: boolean }
type Operadora = { id: number; pessoa_nome?: string; nome?: string; status?: string; ativo?: boolean }
type Plano = {
  id: number
  nome: string
  codigo_ans?: string | null
  codigo?: string | null
  tipo_plano: string
  valor_base?: number | string | null
  descricao?: string | null
  produto_id: number | null
  produto_nome?: string | null
  operadora_id: number
  operadora_nome?: string | null
  status: string
  ativo: boolean
}

type PlanoForm = { nome: string; codigo_ans: string; tipo_plano: string; valor_base: string; descricao: string; produto_id: string; operadora_id: string; status: string }
const emptyForm: PlanoForm = { nome: "", codigo_ans: "", tipo_plano: "", valor_base: "", descricao: "", produto_id: "", operadora_id: "", status: "ativo" }

async function fetcher(url: string) {
  const response = await fetch(url, { credentials: "include", cache: "no-store" })
  const payload = await response.json()
  if (!response.ok || payload.success === false) throw new Error(payload.message || "Não foi possível carregar os dados")
  return payload.data ?? []
}

export default function PlanosPage() {
  const { data: planos = [], isLoading: carregandoPlanos, mutate: atualizarPlanos } = useSWR<Plano[]>("/api/planos", fetcher)
  const { data: produtos = [], isLoading: carregandoProdutos } = useSWR<Produto[]>("/api/produtos", fetcher)
  const { data: operadoras = [], isLoading: carregandoOperadoras } = useSWR<Operadora[]>("/api/operadoras?ativo=true", fetcher)
  const [modalAberto, setModalAberto] = useState(false)
  const [salvando, setSalvando] = useState(false)
  const [planoEditando, setPlanoEditando] = useState<Plano | null>(null)
  const [form, setForm] = useState<PlanoForm>(emptyForm)
  const produtosAtivos = produtos.filter((produto) => produto.ativo !== false && produto.status !== "inativo")

  const abrirCadastro = (plano?: Plano) => {
    setPlanoEditando(plano ?? null)
    setForm(plano ? {
      nome: plano.nome,
      codigo_ans: plano.codigo_ans ?? plano.codigo ?? "",
      tipo_plano: plano.tipo_plano,
      valor_base: plano.valor_base?.toString() ?? "",
      descricao: plano.descricao ?? "",
      produto_id: plano.produto_id?.toString() ?? "",
      operadora_id: plano.operadora_id?.toString() ?? "",
      status: plano.status || (plano.ativo ? "ativo" : "inativo"),
    } : emptyForm)
    setModalAberto(true)
  }

  const salvarPlano = async () => {
    if (!form.produto_id) { toast.error("Selecione um produto cadastrado antes de criar o plano."); return }
    if (!form.operadora_id) { toast.error("Selecione uma operadora."); return }
    if (!form.nome.trim() || form.tipo_plano.trim().length < 2) { toast.error("Informe o nome e o tipo do plano."); return }
    setSalvando(true)
    try {
      const response = await fetch(planoEditando ? `/api/planos/${planoEditando.id}` : "/api/planos", {
        method: planoEditando ? "PUT" : "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({
          nome: form.nome.trim(),
          codigo_ans: form.codigo_ans.trim() || null,
          tipo_plano: form.tipo_plano.trim(),
          valor_base: form.valor_base ? Number(form.valor_base) : null,
          descricao: form.descricao.trim() || null,
          produto_id: Number(form.produto_id),
          operadora_id: Number(form.operadora_id),
          status: form.status,
        }),
      })
      const payload = await response.json()
      if (!response.ok || payload.success === false) throw new Error(payload.message || "Não foi possível salvar o plano")
      toast.success(planoEditando ? "Plano atualizado com sucesso." : "Plano cadastrado com sucesso.")
      setModalAberto(false)
      await atualizarPlanos()
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Não foi possível salvar o plano.")
    } finally {
      setSalvando(false)
    }
  }

  const alternarStatus = async (plano: Plano) => {
    try {
      const response = await fetch(`/api/planos/${plano.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ status: plano.ativo ? "inativo" : "ativo" }),
      })
      const payload = await response.json()
      if (!response.ok || payload.success === false) throw new Error(payload.message || "Não foi possível atualizar o plano")
      await atualizarPlanos()
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Não foi possível atualizar o plano.")
    }
  }

  const excluirPlano = async (plano: Plano) => {
    try {
      const response = await fetch(`/api/planos/${plano.id}`, { method: "DELETE", credentials: "include" })
      const payload = await response.json()
      if (!response.ok || payload.success === false) throw new Error(payload.message || "Não foi possível excluir o plano")
      toast.success("Plano excluído com sucesso.")
      await atualizarPlanos()
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Não foi possível excluir o plano.")
    }
  }

  const aguardandoDependencias = carregandoProdutos || carregandoOperadoras
  const podeCriarPlano = produtosAtivos.length > 0 && operadoras.length > 0

  return (
    <main className="space-y-6 p-4 md:p-6">
      <header className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Planos</h1>
          <p className="text-muted-foreground">Cada plano deve estar vinculado a um produto já cadastrado.</p>
        </div>
        <Button onClick={() => abrirCadastro()} disabled={!podeCriarPlano || aguardandoDependencias}>
          <Plus className="mr-2 h-4 w-4" /> Novo Plano
        </Button>
      </header>

      {!aguardandoDependencias && !podeCriarPlano && (
        <Card className="border-border/70">
          <CardContent className="flex flex-col gap-3 p-5 text-sm text-muted-foreground sm:flex-row sm:items-center sm:justify-between">
            <p>{produtosAtivos.length === 0 ? "Cadastre ao menos um Produto antes de criar um Plano." : "Cadastre ao menos uma Operadora para associá-la ao Plano."}</p>
            {produtosAtivos.length === 0 && <Button variant="outline" asChild><a href="/dashboard/cadastros/produtos">Ir para Produtos</a></Button>}
          </CardContent>
        </Card>
      )}

      <CadastroSummaryGrid className="xl:grid-cols-1">
        <CadastroSummaryCard title="Total de Planos" value={planos.length} description="planos cadastrados" metrics={[{ label: "Status", value: `${planos.filter((plano) => plano.ativo).length} ativos`, tone: "positive" }]} />
      </CadastroSummaryGrid>

      <Card>
        <CardHeader>
          <CardTitle>Planos cadastrados</CardTitle>
          <CardDescription>Os planos vinculam um produto cadastrado a uma operadora e podem receber faixas etárias.</CardDescription>
        </CardHeader>
        <CardContent>
          <CadastroTable
            data={planos}
            loading={carregandoPlanos}
            getId={(plano) => plano.id}
            getSearchText={(plano) => `${plano.nome} ${plano.codigo_ans ?? ""} ${plano.tipo_plano} ${plano.produto_nome ?? ""} ${plano.operadora_nome ?? ""}`}
            isActive={(plano) => plano.ativo}
            searchPlaceholder="Buscar por nome, produto, operadora ou tipo..."
            emptyMessage="Nenhum plano cadastrado. Cadastre primeiro um produto e uma operadora."
            columns={[
              { key: "nome", header: "Plano", sortable: true, className: "font-medium text-foreground" },
              { key: "produto_nome", header: "Produto", sortable: true, render: (plano) => plano.produto_nome || "Sem produto" },
              { key: "operadora_nome", header: "Operadora", sortable: true, render: (plano) => plano.operadora_nome || "—" },
              { key: "tipo_plano", header: "Tipo", sortable: true },
              { key: "codigo_ans", header: "Código ANS", render: (plano) => plano.codigo_ans || "—" },
              { key: "valor_base", header: "Valor base", render: (plano) => plano.valor_base == null ? "—" : `R$ ${Number(plano.valor_base).toFixed(2)}` },
            ] as CadastroColumn<Plano>[]}
            onEdit={(plano) => abrirCadastro(plano)}
            onToggleStatus={alternarStatus}
            onDelete={excluirPlano}
            detailsTitle={(plano) => plano.nome}
            renderDetails={(plano) => (
              <CadastroDetailsGrid>
                <CadastroDetailField label="Produto" value={plano.produto_nome || "Não vinculado"} />
                <CadastroDetailField label="Operadora" value={plano.operadora_nome || "—"} />
                <CadastroDetailField label="Tipo" value={plano.tipo_plano} />
                <CadastroDetailField label="Código ANS" value={plano.codigo_ans || "—"} />
                <CadastroDetailField label="Valor base" value={plano.valor_base == null ? "—" : `R$ ${Number(plano.valor_base).toFixed(2)}`} />
                <CadastroDetailField label="Status" value={plano.ativo ? "Ativo" : "Inativo"} />
                <CadastroDetailField label="Descrição" value={plano.descricao || "—"} full />
              </CadastroDetailsGrid>
            )}
          />
        </CardContent>
      </Card>

      <Dialog open={modalAberto} onOpenChange={setModalAberto}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>{planoEditando ? "Editar Plano" : "Cadastrar Plano"}</DialogTitle>
            <DialogDescription>Selecione um produto previamente cadastrado para continuar.</DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2 sm:col-span-2">
              <Label htmlFor="plano-produto">Produto *</Label>
              <Select value={form.produto_id} onValueChange={(value) => setForm({ ...form, produto_id: value })}>
                <SelectTrigger id="plano-produto"><SelectValue placeholder="Selecione um produto" /></SelectTrigger>
                <SelectContent>{produtosAtivos.map((produto) => <SelectItem key={produto.id} value={String(produto.id)}>{produto.nome}</SelectItem>)}</SelectContent>
              </Select>
            </div>
            <div className="space-y-2 sm:col-span-2">
              <Label htmlFor="plano-operadora">Operadora *</Label>
              <Select value={form.operadora_id} onValueChange={(value) => setForm({ ...form, operadora_id: value })}>
                <SelectTrigger id="plano-operadora"><SelectValue placeholder="Selecione uma operadora" /></SelectTrigger>
                <SelectContent>{operadoras.map((operadora) => <SelectItem key={operadora.id} value={String(operadora.id)}>{operadora.pessoa_nome || operadora.nome || `Operadora ${operadora.id}`}</SelectItem>)}</SelectContent>
              </Select>
            </div>
            <div className="space-y-2 sm:col-span-2"><Label htmlFor="plano-nome">Nome do plano *</Label><Input id="plano-nome" value={form.nome} onChange={(event) => setForm({ ...form, nome: event.target.value })} maxLength={180} /></div>
            <div className="space-y-2"><Label htmlFor="plano-tipo">Tipo / segmentação *</Label><Input id="plano-tipo" value={form.tipo_plano} onChange={(event) => setForm({ ...form, tipo_plano: event.target.value })} maxLength={80} placeholder="Ex.: Ambulatorial" /></div>
            <div className="space-y-2"><Label htmlFor="plano-ans">Código ANS</Label><Input id="plano-ans" value={form.codigo_ans} onChange={(event) => setForm({ ...form, codigo_ans: event.target.value })} maxLength={60} /></div>
            <div className="space-y-2"><Label htmlFor="plano-valor">Valor base</Label><Input id="plano-valor" type="number" min="0" step="0.01" value={form.valor_base} onChange={(event) => setForm({ ...form, valor_base: event.target.value })} /></div>
            <div className="space-y-2"><Label htmlFor="plano-status">Status</Label><Select value={form.status} onValueChange={(value) => setForm({ ...form, status: value })}><SelectTrigger id="plano-status"><SelectValue /></SelectTrigger><SelectContent><SelectItem value="ativo">Ativo</SelectItem><SelectItem value="inativo">Inativo</SelectItem><SelectItem value="suspenso">Suspenso</SelectItem></SelectContent></Select></div>
            <div className="space-y-2 sm:col-span-2"><Label htmlFor="plano-descricao">Descrição</Label><Input id="plano-descricao" value={form.descricao} onChange={(event) => setForm({ ...form, descricao: event.target.value })} maxLength={4000} /></div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setModalAberto(false)} disabled={salvando}>Cancelar</Button>
            <Button onClick={salvarPlano} disabled={salvando || !form.produto_id || !form.operadora_id}>{salvando ? "Salvando..." : planoEditando ? "Salvar alterações" : "Cadastrar Plano"}</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </main>
  )
}
