"use client"

import { useState, useEffect } from "react"
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
  DialogTrigger,
} from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { useToast } from "@/hooks/use-toast"

const SearchIcon = () => (
  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="m21 21-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
  </svg>
)

const PlusIcon = () => (
  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
  </svg>
)

const EyeIcon = () => (
  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
    />
  </svg>
)

const EditIcon = () => (
  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
    />
  </svg>
)

const HistoryIcon = () => (
  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
    />
  </svg>
)

interface Contrato {
  id: number
  numero: string
  estipulante_id?: number
  operadora_id?: number
  plano_id?: number
  data_inicio?: string
  data_fim?: string
  valor_total?: number
  status: string
  observacoes?: string
  versao?: string
  created_at?: string
  updated_at?: string
  deleted_at?: string | null
}

export default function ContratosPage() {
  const { toast } = useToast()
  const [searchTerm, setSearchTerm] = useState("")
  const [isNewContractOpen, setIsNewContractOpen] = useState(false)
  const [isEditMode, setIsEditMode] = useState(false)
  const [editingContract, setEditingContract] = useState<Contrato | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [contracts, setContracts] = useState<Contrato[]>([])
  const [filteredContracts, setFilteredContracts] = useState<Contrato[]>([])
  const [showDeleteDialog, setShowDeleteDialog] = useState(false)
  const [contractToDelete, setContractToDelete] = useState<number | null>(null)

  const [newContract, setNewContract] = useState({
    numero: "",
    estipulante_id: "",
    operadora_id: "",
    plano_id: "",
    data_inicio: "",
    data_fim: "",
    valor_total: "",
    status: "Ativo",
    observacoes: "",
  })

  useEffect(() => {
    loadContracts()
  }, [])

  useEffect(() => {
    if (!searchTerm.trim()) {
      setFilteredContracts(contracts)
    } else {
      const filtered = contracts.filter((contract) => contract.numero.toLowerCase().includes(searchTerm.toLowerCase()))
      setFilteredContracts(filtered)
    }
  }, [searchTerm, contracts])

  const loadContracts = async () => {
    setIsLoading(true)
    try {
      const response = await fetch("/api/contratos")
      const data = await response.json()

      if (data.success) {
        setContracts(data.data)
        setFilteredContracts(data.data)
      } else {
        throw new Error(data.message)
      }
    } catch (error) {
      console.error("Erro ao carregar contratos:", error)
      toast({
        title: "Erro",
        description: "Não foi possível carregar os contratos",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  const handleOpenModal = (contract?: Contrato) => {
    if (contract) {
      setIsEditMode(true)
      setEditingContract(contract)
      setNewContract({
        numero: contract.numero,
        estipulante_id: contract.estipulante_id?.toString() || "",
        operadora_id: contract.operadora_id?.toString() || "",
        plano_id: contract.plano_id?.toString() || "",
        data_inicio: contract.data_inicio || "",
        data_fim: contract.data_fim || "",
        valor_total: contract.valor_total?.toString() || "",
        status: contract.status,
        observacoes: contract.observacoes || "",
      })
    } else {
      setIsEditMode(false)
      setEditingContract(null)
      setNewContract({
        numero: "",
        estipulante_id: "",
        operadora_id: "",
        plano_id: "",
        data_inicio: "",
        data_fim: "",
        valor_total: "",
        status: "Ativo",
        observacoes: "",
      })
    }
    setIsNewContractOpen(true)
  }

  const handleSaveContract = async () => {
    if (!newContract.numero.trim()) {
      toast({
        title: "Erro",
        description: "O número do contrato é obrigatório",
        variant: "destructive",
      })
      return
    }

    setIsLoading(true)
    try {
      const payload = {
        numero: newContract.numero,
        estipulante_id: newContract.estipulante_id ? Number.parseInt(newContract.estipulante_id) : null,
        operadora_id: newContract.operadora_id ? Number.parseInt(newContract.operadora_id) : null,
        plano_id: newContract.plano_id ? Number.parseInt(newContract.plano_id) : null,
        data_inicio: newContract.data_inicio || null,
        data_fim: newContract.data_fim || null,
        valor_total: newContract.valor_total ? Number.parseFloat(newContract.valor_total) : null,
        status: newContract.status,
        observacoes: newContract.observacoes || null,
      }

      let response
      if (isEditMode && editingContract) {
        response = await fetch(`/api/contratos/${editingContract.id}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        })
      } else {
        response = await fetch("/api/contratos", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        })
      }

      const data = await response.json()

      if (data.success) {
        toast({
          title: "Sucesso",
          description: isEditMode ? "Contrato atualizado com sucesso" : "Contrato criado com sucesso",
        })
        await loadContracts()
        setIsNewContractOpen(false)
      } else {
        throw new Error(data.message)
      }
    } catch (error) {
      console.error("Erro ao salvar contrato:", error)
      toast({
        title: "Erro",
        description: "Não foi possível salvar o contrato",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  const handleDeleteContract = async () => {
    if (!contractToDelete) return

    setIsLoading(true)
    try {
      const response = await fetch(`/api/contratos/${contractToDelete}`, {
        method: "DELETE",
      })

      const data = await response.json()

      if (data.success) {
        toast({
          title: "Sucesso",
          description: "Contrato excluído com sucesso",
        })
        await loadContracts()
        setShowDeleteDialog(false)
        setContractToDelete(null)
      } else {
        throw new Error(data.message)
      }
    } catch (error) {
      console.error("Erro ao excluir contrato:", error)
      toast({
        title: "Erro",
        description: "Não foi possível excluir o contrato",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Ativo":
        return "bg-green-100 text-green-800"
      case "Renovação Pendente":
        return "bg-yellow-100 text-yellow-800"
      case "Vencido":
        return "bg-red-100 text-red-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Gestão de Contratos</h1>
          <p className="text-gray-600">Sistema de versionamento e controle de contratos</p>
        </div>

        <Dialog open={isNewContractOpen} onOpenChange={setIsNewContractOpen}>
          <DialogTrigger asChild>
            <Button className="bg-primary hover:bg-primary/90" onClick={() => handleOpenModal()}>
              <PlusIcon />
              <span className="ml-2">{isEditMode ? "Editar Contrato" : "Novo Contrato"}</span>
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>{isEditMode ? "Editar Contrato" : "Criar Novo Contrato"}</DialogTitle>
              <DialogDescription>
                {isEditMode
                  ? "Atualize as informações do contrato"
                  : "Preencha as informações para criar um novo contrato"}
              </DialogDescription>
            </DialogHeader>

            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="numero">Número do Contrato</Label>
                  <Input
                    id="numero"
                    value={newContract.numero}
                    onChange={(e) => setNewContract({ ...newContract, numero: e.target.value })}
                    placeholder="2024/003"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="valor">Valor Total</Label>
                  <Input
                    id="valor"
                    value={newContract.valor_total}
                    onChange={(e) => setNewContract({ ...newContract, valor_total: e.target.value })}
                    placeholder="R$ 150.000,00"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="estipulante">Estipulante</Label>
                <Select onValueChange={(value) => setNewContract({ ...newContract, estipulante_id: value })}>
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione o estipulante" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="1">Empresa ABC Ltda</SelectItem>
                    <SelectItem value="2">Corporação XYZ S.A.</SelectItem>
                    <SelectItem value="3">Indústria DEF Ltda</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="plano">Plano de Saúde</Label>
                <Select onValueChange={(value) => setNewContract({ ...newContract, plano_id: value })}>
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione o plano" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="1">Executivo Plus</SelectItem>
                    <SelectItem value="2">Empresarial Standard</SelectItem>
                    <SelectItem value="3">Básico Familiar</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="vigenciaInicio">Vigência Início</Label>
                  <Input
                    id="vigenciaInicio"
                    type="date"
                    value={newContract.data_inicio}
                    onChange={(e) => setNewContract({ ...newContract, data_inicio: e.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="vigenciaFim">Vigência Fim</Label>
                  <Input
                    id="vigenciaFim"
                    type="date"
                    value={newContract.data_fim}
                    onChange={(e) => setNewContract({ ...newContract, data_fim: e.target.value })}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="observacoes">Observações</Label>
                <Textarea
                  id="observacoes"
                  value={newContract.observacoes}
                  onChange={(e) => setNewContract({ ...newContract, observacoes: e.target.value })}
                  placeholder="Observações adicionais sobre o contrato..."
                  rows={3}
                />
              </div>
            </div>

            <DialogFooter>
              <Button variant="outline" onClick={() => setIsNewContractOpen(false)} disabled={isLoading}>
                Cancelar
              </Button>
              <Button onClick={handleSaveContract} disabled={isLoading}>
                {isLoading ? "Salvando..." : isEditMode ? "Atualizar" : "Criar Contrato"}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Contratos Ativos</CardTitle>
          <CardDescription>Gerencie todos os contratos com sistema de versionamento automático</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center space-x-2 mb-4">
            <div className="relative flex-1">
              <SearchIcon />
              <Input
                placeholder="Buscar por número, estipulante ou plano..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b">
                  <th className="text-left p-2">Número</th>
                  <th className="text-left p-2">Estipulante</th>
                  <th className="text-left p-2">Plano</th>
                  <th className="text-left p-2">Vigência</th>
                  <th className="text-left p-2">Status</th>
                  <th className="text-left p-2">Versão</th>
                  <th className="text-left p-2">Valor</th>
                  <th className="text-left p-2">Segurados</th>
                  <th className="text-left p-2">Ações</th>
                </tr>
              </thead>
              <tbody>
                {filteredContracts.map((contract) => (
                  <tr key={contract.id} className="border-b hover:bg-gray-50">
                    <td className="p-2 font-medium">{contract.numero}</td>
                    <td className="p-2">{contract.estipulante_id || "-"}</td>
                    <td className="p-2">{contract.plano_id || "-"}</td>
                    <td className="p-2 text-sm">
                      {contract.data_inicio && contract.data_fim
                        ? `${new Date(contract.data_inicio).toLocaleDateString("pt-BR")} - ${new Date(contract.data_fim).toLocaleDateString("pt-BR")}`
                        : "-"}
                    </td>
                    <td className="p-2">
                      <Badge className={getStatusColor(contract.status)}>{contract.status}</Badge>
                    </td>
                    <td className="p-2 font-mono text-sm">{contract.versao || "1.0"}</td>
                    <td className="p-2 font-medium">
                      {contract.valor_total ? `R$ ${contract.valor_total.toFixed(2)}` : "-"}
                    </td>
                    <td className="p-2 text-center">-</td>
                    <td className="p-2">
                      <div className="flex space-x-1">
                        <Button variant="ghost" size="sm" onClick={() => console.log("View Contract")}>
                          <EyeIcon />
                        </Button>
                        <Button variant="ghost" size="sm" onClick={() => handleOpenModal(contract)}>
                          <EditIcon />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => {
                            setContractToDelete(contract.id)
                            setShowDeleteDialog(true)
                          }}
                        >
                          Excluir
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {filteredContracts.length === 0 && !isLoading && (
            <div className="text-center py-8 text-gray-500">
              <p>Nenhum contrato encontrado</p>
            </div>
          )}

          {isLoading && (
            <div className="text-center py-8 text-gray-500">
              <p>Carregando contratos...</p>
            </div>
          )}
        </CardContent>
      </Card>

      <Dialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Confirmar Exclusão</DialogTitle>
            <DialogDescription>
              Tem certeza que deseja excluir este contrato? Esta ação não pode ser desfeita.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowDeleteDialog(false)} disabled={isLoading}>
              Cancelar
            </Button>
            <Button variant="destructive" onClick={handleDeleteContract} disabled={isLoading}>
              {isLoading ? "Excluindo..." : "Excluir"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
