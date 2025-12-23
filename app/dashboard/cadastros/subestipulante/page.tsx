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

const UserPlusIcon = () => (
  <svg className="w-8 h-8 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
    />
  </svg>
)

const SearchIcon = () => (
  <svg
    className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground"
    fill="none"
    stroke="currentColor"
    viewBox="0 0 24 24"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
    />
  </svg>
)

const PlusIcon = () => (
  <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
  </svg>
)

const MoreIcon = () => (
  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="M12 5v.01M12 12v.01M12 19v.01M12 6a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2z"
    />
  </svg>
)

export default function SubestipulantePage() {
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [subestipulantes, setSubestipulantes] = useState([
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

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-6 py-6">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-2xl font-bold text-foreground">Subestipulantes</h1>
            <p className="text-muted-foreground">Gerencie os subestipulantes cadastrados</p>
          </div>
          <Button onClick={() => setIsModalOpen(true)}>
            <PlusIcon />
            Novo Subestipulante
          </Button>
        </div>

        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle>Lista de Subestipulantes</CardTitle>
                <CardDescription>Total de {subestipulantes.length} subestipulantes cadastrados</CardDescription>
              </div>
              <div className="relative">
                <SearchIcon />
                <Input placeholder="Buscar subestipulante..." className="pl-10 w-64" />
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {subestipulantes.map((subestipulante) => (
                <div
                  key={subestipulante.id}
                  className="flex items-center justify-between p-4 border rounded-lg hover:bg-muted/50 transition-colors"
                >
                  <div className="flex items-center gap-4">
                    <UserPlusIcon />
                    <div>
                      <h3 className="font-medium text-foreground">{subestipulante.nome}</h3>
                      <p className="text-sm text-muted-foreground">Estipulante: {subestipulante.estipulante}</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-6">
                    <div className="text-center">
                      <p className="text-sm font-medium text-foreground">{subestipulante.contrato}</p>
                      <p className="text-xs text-muted-foreground">{subestipulante.segurados} segurados</p>
                    </div>

                    <div className="text-center">
                      <p className="text-sm font-medium text-foreground">{subestipulante.responsavel}</p>
                      <p className="text-xs text-muted-foreground">{subestipulante.telefone}</p>
                    </div>

                    <Badge variant="default">{subestipulante.status}</Badge>

                    <Button variant="ghost" size="sm">
                      <MoreIcon />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
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
    </div>
  )
}
