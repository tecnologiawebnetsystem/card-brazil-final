"use client"

import type React from "react"

import { useState } from "react"
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
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [subestipulantes, setSubestipulantes] = useState<Subestipulante[]>([
    {
      id: 1,
      nome: "Departamento RH - ABC",
      estipulante: "Empresa ABC Ltda",
      contrato: "SUB-2024-001",
      status: "Ativo",
      segurados: 45,
      responsavel: "Ana Costa",
      telefone: "(11) 2345-6789",
    },
    {
      id: 2,
      nome: "Filial São Paulo - XYZ",
      estipulante: "Corporação XYZ S.A.",
      contrato: "SUB-2024-002",
      status: "Ativo",
      segurados: 120,
      responsavel: "Carlos Oliveira",
      telefone: "(11) 9876-5432",
    },
  ])

  const handleAddSubestipulante = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    const formData = new FormData(event.currentTarget)

    const novoSubestipulante = {
      id: subestipulantes.length + 1,
      nome: formData.get("nome") as string,
      estipulante: formData.get("estipulante") as string,
      contrato: `SUB-2024-${String(subestipulantes.length + 1).padStart(3, "0")}`,
      status: formData.get("status") as string,
      segurados: 0,
      responsavel: formData.get("responsavel") as string,
      telefone: formData.get("telefone") as string,
    }

    setSubestipulantes([...subestipulantes, novoSubestipulante])
    setIsModalOpen(false)
  }

  const handleToggleStatus = (sub: Subestipulante) => {
    setSubestipulantes(
      subestipulantes.map((s) => (s.id === sub.id ? { ...s, status: s.status === "Ativo" ? "Inativo" : "Ativo" } : s)),
    )
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
