"use client"

import type React from "react"

import { useEffect, useState } from "react"
import { useToast } from "@/hooks/use-toast"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Plus } from "lucide-react"
import { CadastroTable, type CadastroColumn } from "@/components/tables/cadastro-table"
import { CadastroDetailsGrid, CadastroDetailField } from "@/components/tables/cadastro-details"
import { CadastroSummaryCard, CadastroSummaryGrid } from "@/components/tables/cadastro-summary-card"

interface Subestipulante {
  id: number
  nome: string
  estipulante: string
  contrato: string
  status: string
  segurados: number
  responsavel: string
  telefone: string
}

export default function SubestipulantePage() {
  const { toast } = useToast()
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [subestipulantes, setSubestipulantes] = useState<Subestipulante[]>([])
  const [loading, setLoading] = useState(true)

  const carregarSubestipulantes = async () => {
    try {
      const response = await fetch("/api/subestipulantes")
      const payload = await response.json()
      if (!response.ok) throw new Error(payload.error || "Não foi possível carregar os subestipulantes")
      setSubestipulantes(payload.data || [])
    } catch (error) {
      toast({ title: "Erro", description: error instanceof Error ? error.message : "Falha ao carregar dados", variant: "destructive" })
    } finally { setLoading(false) }
  }

  useEffect(() => { carregarSubestipulantes() }, [])

  const handleAddSubestipulante = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    const formData = new FormData(event.currentTarget)
    const body = Object.fromEntries(formData.entries())
    const response = await fetch("/api/subestipulantes", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(body) })
    const payload = await response.json()
    if (!response.ok) { toast({ title: "Erro", description: payload.error || "Não foi possível cadastrar", variant: "destructive" }); return }
    setIsModalOpen(false)
    event.currentTarget.reset()
    await carregarSubestipulantes()
    toast({ title: "Cadastro realizado", description: "Subestipulante cadastrado com sucesso." })
  }

  const handleToggleStatus = async (sub: Subestipulante) => {
    const response = await fetch(`/api/subestipulantes/${sub.id}`, { method: "PUT", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ status: sub.status === "Ativo" ? "Inativo" : "Ativo" }) })
    if (!response.ok) { toast({ title: "Erro", description: "Não foi possível alterar o status", variant: "destructive" }); return }
    await carregarSubestipulantes()
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-foreground">Subestipulantes</h1>
            <p className="text-muted-foreground">Gerencie os subestipulantes cadastrados</p>
          </div>
          <Button onClick={() => setIsModalOpen(true)}>
            <Plus className="mr-2 h-4 w-4" />
            Novo Subestipulante
          </Button>
        </div>

        <CadastroSummaryGrid className="mb-6 xl:grid-cols-1">
          <CadastroSummaryCard title="Total de Subestipulantes" value={subestipulantes.length} description="cadastros realizados" metrics={[{ label: "Status", value: `${subestipulantes.filter((s) => s.status === "Ativo").length} ativos`, tone: "positive" }]} />
        </CadastroSummaryGrid>

        <Card>
          <CardHeader>
            <CardTitle>Subestipulantes cadastrados</CardTitle>
            <CardDescription>Busque, visualize e altere o status dos subestipulantes.</CardDescription>
          </CardHeader>
          <CardContent>
            <CadastroTable
              data={subestipulantes}
              getId={(s) => s.id}
              getSearchText={(s) => `${s.nome} ${s.estipulante} ${s.contrato} ${s.responsavel}`}
              isActive={(s) => s.status === "Ativo"}
              searchPlaceholder="Buscar por nome, estipulante, contrato ou responsável..."
              emptyMessage="Nenhum subestipulante encontrado."
              columns={
                [
                  { key: "nome", header: "Nome", sortable: true, className: "font-medium text-foreground" },
                  { key: "estipulante", header: "Estipulante", sortable: true },
                  {
                    key: "contrato",
                    header: "Contrato",
                    render: (s) => (
                      <Badge variant="outline" className="text-xs">
                        {s.contrato}
                      </Badge>
                    ),
                  },
                  {
                    key: "segurados",
                    header: "Segurados",
                    sortable: true,
                    sortValue: (s) => s.segurados,
                  },
                  { key: "responsavel", header: "Responsável" },
                ] as CadastroColumn<Subestipulante>[]
              }
              onToggleStatus={handleToggleStatus}
              detailsTitle={(s) => s.nome}
              renderDetails={(s) => (
                <CadastroDetailsGrid>
                  <CadastroDetailField label="Nome" value={s.nome} />
                  <CadastroDetailField label="Estipulante" value={s.estipulante} />
                  <CadastroDetailField label="Contrato" value={s.contrato} />
                  <CadastroDetailField label="Segurados" value={String(s.segurados)} />
                  <CadastroDetailField label="Responsável" value={s.responsavel} />
                  <CadastroDetailField label="Telefone" value={s.telefone} />
                  <CadastroDetailField label="Status" value={s.status} />
                </CadastroDetailsGrid>
              )}
            />
          </CardContent>
        </Card>

        <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
          <DialogContent className="sm:max-w-[425px]">
            <DialogHeader>
              <DialogTitle>Novo Subestipulante</DialogTitle>
              <DialogDescription>Cadastre um novo subestipulante no sistema.</DialogDescription>
            </DialogHeader>
            <form onSubmit={handleAddSubestipulante}>
              <div className="grid gap-4 py-4">
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="nome" className="text-right">
                    Nome
                  </Label>
                  <Input id="nome" name="nome" placeholder="Nome do subestipulante" className="col-span-3" required />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="estipulante" className="text-right">
                    Estipulante
                  </Label>
                  <Select name="estipulante" required>
                    <SelectTrigger className="col-span-3">
                      <SelectValue placeholder="Selecione o estipulante" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Empresa ABC Ltda">Empresa ABC Ltda</SelectItem>
                      <SelectItem value="Corporação XYZ S.A.">Corporação XYZ S.A.</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="responsavel" className="text-right">
                    Responsável
                  </Label>
                  <Input
                    id="responsavel"
                    name="responsavel"
                    placeholder="Nome do responsável"
                    className="col-span-3"
                    required
                  />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="telefone" className="text-right">
                    Telefone
                  </Label>
                  <Input id="telefone" name="telefone" placeholder="(11) 9999-9999" className="col-span-3" required />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="status" className="text-right">
                    Status
                  </Label>
                  <Select name="status" defaultValue="Ativo" required>
                    <SelectTrigger className="col-span-3">
                      <SelectValue placeholder="Selecione o status" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Ativo">Ativo</SelectItem>
                      <SelectItem value="Inativo">Inativo</SelectItem>
                      <SelectItem value="Suspenso">Suspenso</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <DialogFooter>
                <Button type="button" variant="outline" onClick={() => setIsModalOpen(false)}>
                  Cancelar
                </Button>
                <Button type="submit">Cadastrar</Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
    </div>
  )
}
