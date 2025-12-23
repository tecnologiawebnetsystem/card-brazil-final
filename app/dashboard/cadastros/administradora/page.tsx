"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog"
import { Badge } from "@/components/ui/badge"
import { AddressCard } from "@/components/shared/address-card"
import { AddressModal } from "@/components/shared/address-modal"
import { useToast } from "@/hooks/use-toast"
import { Loader2 } from "lucide-react"

interface Endereco {
  id: number
  tipo: "residencial" | "comercial" | "cobranca"
  cep: string
  logradouro: string
  numero: string
  complemento?: string
  bairro: string
  cidade: string
  estado: string
  email?: string
}

interface Administradora {
  id: number
  razao_social: string
  nome_fantasia: string
  cnpj: string
  inscricao_estadual: string
  inscricao_municipal: string
  telefone?: string
  email?: string
  site?: string
  logotipo_url?: string
  cor_primaria?: string
  cor_secundaria?: string
  status: "ativo" | "inativo" | "suspenso"
  created_at?: string
  updated_at?: string
}

export default function AdministradoraPage() {
  const { toast } = useToast()
  const [loading, setLoading] = useState(false)
  const [administradora, setAdministradora] = useState<Administradora | null>(null)
  const [showEditModal, setShowEditModal] = useState(false)
  const [showDeleteDialog, setShowDeleteDialog] = useState(false)
  const [showAddEnderecoModal, setShowAddEnderecoModal] = useState(false)
  const [showEditEnderecoModal, setShowEditEnderecoModal] = useState(false)
  const [editingEndereco, setEditingEndereco] = useState<Endereco | null>(null)
  const [enderecos, setEnderecos] = useState<Endereco[]>([])

  const [formData, setFormData] = useState({
    razao_social: "",
    nome_fantasia: "",
    cnpj: "",
    inscricao_estadual: "",
    inscricao_municipal: "",
    telefone: "",
    email: "",
    site: "",
    logotipo_url: "",
    cor_primaria: "#6B8E23",
    cor_secundaria: "#4A5D23",
    status: "ativo" as "ativo" | "inativo" | "suspenso",
  })

  useEffect(() => {
    loadAdministradora()
  }, [])

  const loadAdministradora = async () => {
    try {
      setLoading(true)
      const response = await fetch("/api/administradoras")
      const data = await response.json()

      if (data.success && data.data.length > 0) {
        // Pega a primeira administradora (sistema single-tenant por administradora)
        setAdministradora(data.data[0])
        // Carregar endereços se houver
        if (data.data[0].id) {
          loadEnderecos(data.data[0].id)
        }
      }
    } catch (error) {
      toast({
        title: "Erro de Rede",
        description: "Erro ao carregar administradora",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  const loadEnderecos = async (administradoraId: number) => {
    try {
      // Assumindo que existe uma API de endereços filtrada por administradora
      const response = await fetch(`/api/enderecos?administradora_id=${administradoraId}`)
      const data = await response.json()

      if (data.success) {
        setEnderecos(data.data)
      }
    } catch (error) {
      console.error("Erro ao carregar endereços:", error)
    }
  }

  const handleEdit = () => {
    if (administradora) {
      setFormData({
        razao_social: administradora.razao_social,
        nome_fantasia: administradora.nome_fantasia,
        cnpj: administradora.cnpj,
        inscricao_estadual: administradora.inscricao_estadual,
        inscricao_municipal: administradora.inscricao_municipal,
        telefone: administradora.telefone || "",
        email: administradora.email || "",
        site: administradora.site || "",
        logotipo_url: administradora.logotipo_url || "",
        cor_primaria: administradora.cor_primaria || "#6B8E23",
        cor_secundaria: administradora.cor_secundaria || "#4A5D23",
        status: administradora.status,
      })
      setShowEditModal(true)
    }
  }

  const handleSave = async () => {
    try {
      if (!formData.razao_social || !formData.cnpj) {
        toast({
          title: "Erro",
          description: "Preencha todos os campos obrigatórios",
          variant: "destructive",
        })
        return
      }

      setLoading(true)

      if (administradora) {
        // Atualizar
        const response = await fetch(`/api/administradoras/${administradora.id}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(formData),
        })

        const data = await response.json()

        if (data.success) {
          toast({
            title: "Sucesso",
            description: "Administradora atualizada com sucesso",
          })
          loadAdministradora()
          setShowEditModal(false)
        } else {
          throw new Error(data.message)
        }
      } else {
        // Criar
        const response = await fetch("/api/administradoras", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(formData),
        })

        const data = await response.json()

        if (data.success) {
          toast({
            title: "Sucesso",
            description: "Administradora criada com sucesso",
          })
          loadAdministradora()
          setShowEditModal(false)
        } else {
          throw new Error(data.message)
        }
      }
    } catch (error: any) {
      toast({
        title: "Erro",
        description: error.message || "Erro ao salvar administradora",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  const handleDelete = async () => {
    if (!administradora) return

    try {
      setLoading(true)

      const response = await fetch(`/api/administradoras/${administradora.id}`, {
        method: "DELETE",
      })

      const data = await response.json()

      if (data.success) {
        toast({
          title: "Sucesso",
          description: "Administradora excluída com sucesso",
        })
        setAdministradora(null)
        setShowDeleteDialog(false)
      } else {
        throw new Error(data.message)
      }
    } catch (error: any) {
      toast({
        title: "Erro",
        description: error.message || "Erro ao excluir administradora",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  const handleCreateNew = () => {
    setFormData({
      razao_social: "",
      nome_fantasia: "",
      cnpj: "",
      inscricao_estadual: "",
      inscricao_municipal: "",
      telefone: "",
      email: "",
      site: "",
      logotipo_url: "",
      cor_primaria: "#6B8E23",
      cor_secundaria: "#4A5D23",
      status: "ativo",
    })
    setShowEditModal(true)
  }

  const handleAddEndereco = async (enderecoData: any) => {
    if (!administradora) return

    try {
      const response = await fetch("/api/enderecos", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...enderecoData,
          administradora_id: administradora.id,
        }),
      })

      const data = await response.json()

      if (data.success) {
        toast({
          title: "Sucesso",
          description: "Endereço adicionado com sucesso",
        })
        loadEnderecos(administradora.id)
        setShowAddEnderecoModal(false)
      } else {
        throw new Error(data.message)
      }
    } catch (error: any) {
      toast({
        title: "Erro",
        description: error.message || "Erro ao adicionar endereço",
        variant: "destructive",
      })
    }
  }

  const handleEditEndereco = async (enderecoData: any) => {
    if (!editingEndereco) return

    try {
      const response = await fetch(`/api/enderecos/${editingEndereco.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(enderecoData),
      })

      const data = await response.json()

      if (data.success) {
        toast({
          title: "Sucesso",
          description: "Endereço atualizado com sucesso",
        })
        if (administradora) {
          loadEnderecos(administradora.id)
        }
        setShowEditEnderecoModal(false)
        setEditingEndereco(null)
      } else {
        throw new Error(data.message)
      }
    } catch (error: any) {
      toast({
        title: "Erro",
        description: error.message || "Erro ao atualizar endereço",
        variant: "destructive",
      })
    }
  }

  const handleDeleteEndereco = async (enderecoId: number) => {
    try {
      const response = await fetch(`/api/enderecos/${enderecoId}`, {
        method: "DELETE",
      })

      const data = await response.json()

      if (data.success) {
        toast({
          title: "Sucesso",
          description: "Endereço excluído com sucesso",
        })
        if (administradora) {
          loadEnderecos(administradora.id)
        }
      } else {
        throw new Error(data.message)
      }
    } catch (error: any) {
      toast({
        title: "Erro",
        description: error.message || "Erro ao excluir endereço",
        variant: "destructive",
      })
    }
  }

  if (loading && !administradora) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Administradora</h1>
          <p className="text-muted-foreground">Gerencie os dados da administradora do sistema</p>
        </div>
        {!administradora && (
          <Button onClick={handleCreateNew} style={{ backgroundColor: "#6B8E23" }} className="hover:opacity-90">
            + Nova Administradora
          </Button>
        )}
      </div>

      {administradora ? (
        <div className="space-y-6">
          {/* Dados da Administradora */}
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle>Dados da Administradora</CardTitle>
              <div className="flex gap-2">
                <Button onClick={handleEdit} variant="outline" size="sm">
                  <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
                    />
                  </svg>
                  Editar
                </Button>
                <Button onClick={() => setShowDeleteDialog(true)} variant="destructive" size="sm">
                  <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                    />
                  </svg>
                  Excluir
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                <div>
                  <Label className="text-sm font-medium text-muted-foreground">Razão Social</Label>
                  <p className="text-sm text-foreground">{administradora.razao_social}</p>
                </div>
                <div>
                  <Label className="text-sm font-medium text-muted-foreground">Nome Fantasia</Label>
                  <p className="text-sm text-foreground">{administradora.nome_fantasia}</p>
                </div>
                <div>
                  <Label className="text-sm font-medium text-muted-foreground">CNPJ</Label>
                  <p className="text-sm text-foreground">{administradora.cnpj}</p>
                </div>
                <div>
                  <Label className="text-sm font-medium text-muted-foreground">Inscrição Estadual</Label>
                  <p className="text-sm text-foreground">{administradora.inscricao_estadual}</p>
                </div>
                <div>
                  <Label className="text-sm font-medium text-muted-foreground">Inscrição Municipal</Label>
                  <p className="text-sm text-foreground">{administradora.inscricao_municipal}</p>
                </div>
                {administradora.telefone && (
                  <div>
                    <Label className="text-sm font-medium text-muted-foreground">Telefone</Label>
                    <p className="text-sm text-foreground">{administradora.telefone}</p>
                  </div>
                )}
                {administradora.email && (
                  <div>
                    <Label className="text-sm font-medium text-muted-foreground">Email</Label>
                    <p className="text-sm text-foreground">{administradora.email}</p>
                  </div>
                )}
                {administradora.site && (
                  <div>
                    <Label className="text-sm font-medium text-muted-foreground">Site</Label>
                    <p className="text-sm text-foreground">{administradora.site}</p>
                  </div>
                )}
                <div>
                  <Label className="text-sm font-medium text-muted-foreground">Status</Label>
                  <Badge variant={administradora.status === "ativo" ? "default" : "secondary"}>
                    {administradora.status}
                  </Badge>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Endereços */}
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle>Endereços ({enderecos.length})</CardTitle>
              <Button onClick={() => setShowAddEnderecoModal(true)} size="sm">
                <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                </svg>
                Adicionar Endereço
              </Button>
            </CardHeader>
            <CardContent>
              {enderecos.length === 0 ? (
                <div className="text-center py-8 text-muted-foreground">
                  <svg
                    className="w-12 h-12 mx-auto mb-4 text-muted"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                    />
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                    />
                  </svg>
                  <p>Nenhum endereço cadastrado</p>
                  <Button onClick={() => setShowAddEnderecoModal(true)} variant="outline" size="sm" className="mt-2">
                    Cadastrar Primeiro Endereço
                  </Button>
                </div>
              ) : (
                <div className="space-y-4">
                  {enderecos.map((endereco) => (
                    <AddressCard
                      key={endereco.id}
                      endereco={endereco}
                      onEdit={(endereco) => {
                        setEditingEndereco(endereco)
                        setShowEditEnderecoModal(true)
                      }}
                      onDelete={handleDeleteEndereco}
                    />
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      ) : (
        <Card>
          <CardContent className="text-center py-12">
            <svg className="w-16 h-16 mx-auto mb-4 text-muted" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"
              />
            </svg>
            <h3 className="text-lg font-medium text-foreground mb-2">Nenhuma administradora cadastrada</h3>
            <p className="text-muted-foreground mb-4">
              Cadastre os dados da administradora para começar a usar o sistema
            </p>
            <Button onClick={handleCreateNew} style={{ backgroundColor: "#6B8E23" }} className="hover:opacity-90">
              <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
              </svg>
              Cadastrar Administradora
            </Button>
          </CardContent>
        </Card>
      )}

      {/* Modal de Edição/Cadastro */}
      <Dialog open={showEditModal} onOpenChange={setShowEditModal}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>{administradora ? "Editar Administradora" : "Cadastrar Administradora"}</DialogTitle>
            <DialogDescription>
              {administradora
                ? "Altere os dados da administradora"
                : "Preencha os dados para cadastrar a administradora"}
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 max-h-[60vh] overflow-y-auto">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="razao_social">Razão Social *</Label>
                <Input
                  id="razao_social"
                  value={formData.razao_social}
                  onChange={(e) => setFormData({ ...formData, razao_social: e.target.value })}
                  placeholder="Digite a razão social"
                />
              </div>
              <div>
                <Label htmlFor="nome_fantasia">Nome Fantasia</Label>
                <Input
                  id="nome_fantasia"
                  value={formData.nome_fantasia}
                  onChange={(e) => setFormData({ ...formData, nome_fantasia: e.target.value })}
                  placeholder="Digite o nome fantasia"
                />
              </div>
              <div>
                <Label htmlFor="cnpj">CNPJ *</Label>
                <Input
                  id="cnpj"
                  value={formData.cnpj}
                  onChange={(e) => setFormData({ ...formData, cnpj: e.target.value })}
                  placeholder="00.000.000/0000-00"
                />
              </div>
              <div>
                <Label htmlFor="inscricao_estadual">Inscrição Estadual</Label>
                <Input
                  id="inscricao_estadual"
                  value={formData.inscricao_estadual}
                  onChange={(e) => setFormData({ ...formData, inscricao_estadual: e.target.value })}
                  placeholder="Digite a inscrição estadual"
                />
              </div>
              <div>
                <Label htmlFor="inscricao_municipal">Inscrição Municipal</Label>
                <Input
                  id="inscricao_municipal"
                  value={formData.inscricao_municipal}
                  onChange={(e) => setFormData({ ...formData, inscricao_municipal: e.target.value })}
                  placeholder="Digite a inscrição municipal"
                />
              </div>
              <div>
                <Label htmlFor="telefone">Telefone</Label>
                <Input
                  id="telefone"
                  value={formData.telefone}
                  onChange={(e) => setFormData({ ...formData, telefone: e.target.value })}
                  placeholder="(00) 0000-0000"
                />
              </div>
              <div>
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  placeholder="contato@empresa.com.br"
                />
              </div>
              <div>
                <Label htmlFor="site">Site</Label>
                <Input
                  id="site"
                  value={formData.site}
                  onChange={(e) => setFormData({ ...formData, site: e.target.value })}
                  placeholder="https://www.empresa.com.br"
                />
              </div>
              <div>
                <Label htmlFor="status">Status</Label>
                <select
                  id="status"
                  value={formData.status}
                  onChange={(e) =>
                    setFormData({ ...formData, status: e.target.value as "ativo" | "inativo" | "suspenso" })
                  }
                  className="w-full px-3 py-2 border border-input rounded-md focus:outline-none focus:ring-2 focus:ring-ring"
                >
                  <option value="ativo">Ativo</option>
                  <option value="inativo">Inativo</option>
                  <option value="suspenso">Suspenso</option>
                </select>
              </div>
            </div>
            <div className="flex justify-end gap-2 pt-4">
              <Button variant="outline" onClick={() => setShowEditModal(false)} disabled={loading}>
                Cancelar
              </Button>
              <Button onClick={handleSave} disabled={loading}>
                {loading ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : null}
                {administradora ? "Salvar Alterações" : "Cadastrar"}
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Dialog de Confirmação de Exclusão */}
      <Dialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Confirmar Exclusão</DialogTitle>
            <DialogDescription>
              Tem certeza que deseja excluir esta administradora? Esta ação não pode ser desfeita.
            </DialogDescription>
          </DialogHeader>
          <div className="flex justify-end gap-2 mt-4">
            <Button variant="outline" onClick={() => setShowDeleteDialog(false)} disabled={loading}>
              Cancelar
            </Button>
            <Button variant="destructive" onClick={handleDelete} disabled={loading}>
              {loading ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : null}
              Excluir
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Modal de Adicionar Endereço */}
      <AddressModal
        isOpen={showAddEnderecoModal}
        onClose={() => setShowAddEnderecoModal(false)}
        onSave={handleAddEndereco}
        title="Adicionar Endereço"
      />

      {/* Modal de Editar Endereço */}
      <AddressModal
        isOpen={showEditEnderecoModal}
        onClose={() => {
          setShowEditEnderecoModal(false)
          setEditingEndereco(null)
        }}
        onSave={handleEditEndereco}
        endereco={editingEndereco}
        title="Editar Endereço"
      />
    </div>
  )
}
