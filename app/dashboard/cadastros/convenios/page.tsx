"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Badge } from "@/components/ui/badge"

interface Convenio {
  id: number
  nome: string
  tipo: "Médico" | "Odontológico" | "Hospitalar" | "Laboratorial" | "Farmácia"
  cnpj?: string
  contato: string
  telefone: string
  email: string
  percentualCobertura: number
  valorConsulta?: number
  valorExame?: number
  prazoAutorizacao: number // em horas
  situacao: "Ativo" | "Desativo"
  dataContrato: string
  dataVencimento?: string
  observacoes?: string
}

export default function ConveniosPage() {
  const [convenios, setConvenios] = useState<Convenio[]>([
    {
      id: 1,
      nome: "Hospital São Lucas",
      tipo: "Hospitalar",
      cnpj: "12.345.678/0001-90",
      contato: "Dr. João Silva",
      telefone: "(11) 3456-7890",
      email: "contato@saolucas.com.br",
      percentualCobertura: 80,
      valorConsulta: 150,
      valorExame: 200,
      prazoAutorizacao: 24,
      situacao: "Ativo",
      dataContrato: "2023-01-15",
      dataVencimento: "2024-01-15",
      observacoes: "Convênio com desconto especial para emergências",
    },
    {
      id: 2,
      nome: "Clínica Odonto Vida",
      tipo: "Odontológico",
      cnpj: "98.765.432/0001-10",
      contato: "Dra. Maria Santos",
      telefone: "(11) 9876-5432",
      email: "contato@odontovida.com.br",
      percentualCobertura: 70,
      valorConsulta: 80,
      prazoAutorizacao: 12,
      situacao: "Ativo",
      dataContrato: "2023-03-10",
      dataVencimento: "2024-03-10",
    },
    {
      id: 3,
      nome: "Laboratório Exames+",
      tipo: "Laboratorial",
      cnpj: "11.222.333/0001-44",
      contato: "Carlos Eduardo",
      telefone: "(11) 1111-2222",
      email: "contato@examesmais.com.br",
      percentualCobertura: 90,
      valorExame: 50,
      prazoAutorizacao: 6,
      situacao: "Desativo",
      dataContrato: "2022-06-20",
      dataVencimento: "2023-06-20",
      observacoes: "Convênio suspenso por inadimplência",
    },
  ])

  const [filtroTipo, setFiltroTipo] = useState<string>("Todos")
  const [filtroSituacao, setFiltroSituacao] = useState<string>("Todos")
  const [busca, setBusca] = useState("")
  const [showModal, setShowModal] = useState(false)
  const [editingConvenio, setEditingConvenio] = useState<Convenio | null>(null)
  const [formData, setFormData] = useState<Partial<Convenio>>({})

  const conveniosFiltrados = convenios.filter((convenio) => {
    const matchBusca =
      convenio.nome.toLowerCase().includes(busca.toLowerCase()) ||
      convenio.contato.toLowerCase().includes(busca.toLowerCase()) ||
      (convenio.cnpj && convenio.cnpj.includes(busca))
    const matchTipo = filtroTipo === "Todos" || convenio.tipo === filtroTipo
    const matchSituacao = filtroSituacao === "Todos" || convenio.situacao === filtroSituacao

    return matchBusca && matchTipo && matchSituacao
  })

  const handleAdd = () => {
    setEditingConvenio(null)
    setFormData({
      nome: "",
      tipo: "Médico",
      contato: "",
      telefone: "",
      email: "",
      percentualCobertura: 80,
      prazoAutorizacao: 24,
      situacao: "Ativo",
      dataContrato: new Date().toISOString().split("T")[0],
    })
    setShowModal(true)
  }

  const handleEdit = (convenio: Convenio) => {
    setEditingConvenio(convenio)
    setFormData(convenio)
    setShowModal(true)
  }

  const handleSave = () => {
    if (formData.nome && formData.contato && formData.telefone && formData.email) {
      if (editingConvenio) {
        // Editar existente
        setConvenios(convenios.map((c) => (c.id === editingConvenio.id ? { ...editingConvenio, ...formData } : c)))
      } else {
        // Adicionar novo
        const newConvenio: Convenio = {
          id: Date.now(),
          nome: formData.nome || "",
          tipo: formData.tipo || "Médico",
          cnpj: formData.cnpj,
          contato: formData.contato || "",
          telefone: formData.telefone || "",
          email: formData.email || "",
          percentualCobertura: formData.percentualCobertura || 80,
          valorConsulta: formData.valorConsulta,
          valorExame: formData.valorExame,
          prazoAutorizacao: formData.prazoAutorizacao || 24,
          situacao: formData.situacao || "Ativo",
          dataContrato: formData.dataContrato || new Date().toISOString().split("T")[0],
          dataVencimento: formData.dataVencimento,
          observacoes: formData.observacoes,
        }
        setConvenios([...convenios, newConvenio])
      }
      setShowModal(false)
      setFormData({})
      setEditingConvenio(null)
    }
  }

  const handleDelete = (id: number) => {
    if (confirm("Tem certeza que deseja excluir este convênio?")) {
      setConvenios(convenios.filter((c) => c.id !== id))
    }
  }

  const toggleSituacao = (id: number) => {
    setConvenios(
      convenios.map((c) => (c.id === id ? { ...c, situacao: c.situacao === "Ativo" ? "Desativo" : "Ativo" } : c)),
    )
  }

  return (
    <div className="min-h-screen bg-background py-6">
      <div className="container mx-auto px-6 space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Convênios</h1>
            <p className="text-gray-600">Gerencie os convênios médicos e hospitalares</p>
          </div>
          <Button onClick={handleAdd}>
            <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
            Novo Convênio
          </Button>
        </div>

        {/* Filtros e Busca */}
        <Card>
          <CardHeader>
            <CardTitle>Filtros</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div>
                <Label htmlFor="busca">Buscar</Label>
                <Input
                  id="busca"
                  placeholder="Nome, contato ou CNPJ..."
                  value={busca}
                  onChange={(e) => setBusca(e.target.value)}
                />
              </div>
              <div>
                <Label htmlFor="filtroTipo">Tipo</Label>
                <select
                  id="filtroTipo"
                  value={filtroTipo}
                  onChange={(e) => setFiltroTipo(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="Todos">Todos os tipos</option>
                  <option value="Médico">Médico</option>
                  <option value="Odontológico">Odontológico</option>
                  <option value="Hospitalar">Hospitalar</option>
                  <option value="Laboratorial">Laboratorial</option>
                  <option value="Farmácia">Farmácia</option>
                </select>
              </div>
              <div>
                <Label htmlFor="filtroSituacao">Situação</Label>
                <select
                  id="filtroSituacao"
                  value={filtroSituacao}
                  onChange={(e) => setFiltroSituacao(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="Todos">Todas as situações</option>
                  <option value="Ativo">Ativo</option>
                  <option value="Desativo">Desativo</option>
                </select>
              </div>
              <div className="flex items-end">
                <Button
                  variant="outline"
                  onClick={() => {
                    setBusca("")
                    setFiltroTipo("Todos")
                    setFiltroSituacao("Todos")
                  }}
                >
                  Limpar Filtros
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Lista de Convênios */}
        <Card>
          <CardHeader>
            <CardTitle>Lista de Convênios ({conveniosFiltrados.length})</CardTitle>
          </CardHeader>
          <CardContent>
            {conveniosFiltrados.length === 0 ? (
              <div className="text-center py-8 text-gray-500">
                <svg
                  className="w-12 h-12 mx-auto mb-4 text-gray-300"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                  />
                </svg>
                <p>Nenhum convênio encontrado</p>
              </div>
            ) : (
              <div className="space-y-4">
                {conveniosFiltrados.map((convenio) => (
                  <Card key={convenio.id} className="border-l-4 border-l-blue-500">
                    <CardContent className="p-4">
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <div className="flex items-center gap-3 mb-2">
                            <h3 className="text-lg font-semibold text-gray-900">{convenio.nome}</h3>
                            <Badge variant={convenio.tipo === "Médico" ? "default" : "secondary"}>
                              {convenio.tipo}
                            </Badge>
                            <Badge variant={convenio.situacao === "Ativo" ? "default" : "destructive"}>
                              {convenio.situacao}
                            </Badge>
                          </div>

                          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 text-sm">
                            <div>
                              <Label className="text-xs font-medium text-gray-500">Contato</Label>
                              <p className="text-gray-900">{convenio.contato}</p>
                            </div>
                            <div>
                              <Label className="text-xs font-medium text-gray-500">Telefone</Label>
                              <p className="text-gray-900">{convenio.telefone}</p>
                            </div>
                            <div>
                              <Label className="text-xs font-medium text-gray-500">Cobertura</Label>
                              <p className="text-gray-900">{convenio.percentualCobertura}%</p>
                            </div>
                            <div>
                              <Label className="text-xs font-medium text-gray-500">Prazo Autorização</Label>
                              <p className="text-gray-900">{convenio.prazoAutorizacao}h</p>
                            </div>
                            {convenio.valorConsulta && (
                              <div>
                                <Label className="text-xs font-medium text-gray-500">Valor Consulta</Label>
                                <p className="text-gray-900">R$ {convenio.valorConsulta.toFixed(2)}</p>
                              </div>
                            )}
                            {convenio.valorExame && (
                              <div>
                                <Label className="text-xs font-medium text-gray-500">Valor Exame</Label>
                                <p className="text-gray-900">R$ {convenio.valorExame.toFixed(2)}</p>
                              </div>
                            )}
                            <div>
                              <Label className="text-xs font-medium text-gray-500">Data Contrato</Label>
                              <p className="text-gray-900">
                                {new Date(convenio.dataContrato).toLocaleDateString("pt-BR")}
                              </p>
                            </div>
                            {convenio.dataVencimento && (
                              <div>
                                <Label className="text-xs font-medium text-gray-500">Vencimento</Label>
                                <p className="text-gray-900">
                                  {new Date(convenio.dataVencimento).toLocaleDateString("pt-BR")}
                                </p>
                              </div>
                            )}
                          </div>

                          {convenio.observacoes && (
                            <div className="mt-3">
                              <Label className="text-xs font-medium text-gray-500">Observações</Label>
                              <p className="text-sm text-gray-700">{convenio.observacoes}</p>
                            </div>
                          )}
                        </div>

                        <div className="flex gap-2 ml-4">
                          <Button
                            onClick={() => toggleSituacao(convenio.id)}
                            variant={convenio.situacao === "Ativo" ? "destructive" : "default"}
                            size="sm"
                          >
                            {convenio.situacao === "Ativo" ? "Desativar" : "Ativar"}
                          </Button>
                          <Button onClick={() => handleEdit(convenio)} variant="outline" size="sm">
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
                              />
                            </svg>
                          </Button>
                          <Button onClick={() => handleDelete(convenio.id)} variant="destructive" size="sm">
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                              />
                            </svg>
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Modal de Cadastro/Edição */}
        <Dialog open={showModal} onOpenChange={setShowModal}>
          <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>{editingConvenio ? "Editar Convênio" : "Novo Convênio"}</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="nome">Nome do Convênio *</Label>
                  <Input
                    id="nome"
                    value={formData.nome || ""}
                    onChange={(e) => setFormData({ ...formData, nome: e.target.value })}
                    placeholder="Digite o nome do convênio"
                  />
                </div>
                <div>
                  <Label htmlFor="tipo">Tipo *</Label>
                  <select
                    id="tipo"
                    value={formData.tipo || "Médico"}
                    onChange={(e) => setFormData({ ...formData, tipo: e.target.value as Convenio["tipo"] })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="Médico">Médico</option>
                    <option value="Odontológico">Odontológico</option>
                    <option value="Hospitalar">Hospitalar</option>
                    <option value="Laboratorial">Laboratorial</option>
                    <option value="Farmácia">Farmácia</option>
                  </select>
                </div>
                <div>
                  <Label htmlFor="cnpj">CNPJ</Label>
                  <Input
                    id="cnpj"
                    value={formData.cnpj || ""}
                    onChange={(e) => setFormData({ ...formData, cnpj: e.target.value })}
                    placeholder="00.000.000/0000-00"
                  />
                </div>
                <div>
                  <Label htmlFor="contato">Contato *</Label>
                  <Input
                    id="contato"
                    value={formData.contato || ""}
                    onChange={(e) => setFormData({ ...formData, contato: e.target.value })}
                    placeholder="Nome do responsável"
                  />
                </div>
                <div>
                  <Label htmlFor="telefone">Telefone *</Label>
                  <Input
                    id="telefone"
                    value={formData.telefone || ""}
                    onChange={(e) => setFormData({ ...formData, telefone: e.target.value })}
                    placeholder="(00) 0000-0000"
                  />
                </div>
                <div>
                  <Label htmlFor="email">E-mail *</Label>
                  <Input
                    id="email"
                    type="email"
                    value={formData.email || ""}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    placeholder="contato@convenio.com.br"
                  />
                </div>
                <div>
                  <Label htmlFor="percentualCobertura">Percentual de Cobertura (%)</Label>
                  <Input
                    id="percentualCobertura"
                    type="number"
                    min="0"
                    max="100"
                    value={formData.percentualCobertura || ""}
                    onChange={(e) => setFormData({ ...formData, percentualCobertura: Number(e.target.value) })}
                    placeholder="80"
                  />
                </div>
                <div>
                  <Label htmlFor="prazoAutorizacao">Prazo Autorização (horas)</Label>
                  <Input
                    id="prazoAutorizacao"
                    type="number"
                    min="1"
                    value={formData.prazoAutorizacao || ""}
                    onChange={(e) => setFormData({ ...formData, prazoAutorizacao: Number(e.target.value) })}
                    placeholder="24"
                  />
                </div>
                <div>
                  <Label htmlFor="valorConsulta">Valor Consulta (R$)</Label>
                  <Input
                    id="valorConsulta"
                    type="number"
                    min="0"
                    step="0.01"
                    value={formData.valorConsulta || ""}
                    onChange={(e) => setFormData({ ...formData, valorConsulta: Number(e.target.value) })}
                    placeholder="150.00"
                  />
                </div>
                <div>
                  <Label htmlFor="valorExame">Valor Exame (R$)</Label>
                  <Input
                    id="valorExame"
                    type="number"
                    min="0"
                    step="0.01"
                    value={formData.valorExame || ""}
                    onChange={(e) => setFormData({ ...formData, valorExame: Number(e.target.value) })}
                    placeholder="200.00"
                  />
                </div>
                <div>
                  <Label htmlFor="dataContrato">Data do Contrato</Label>
                  <Input
                    id="dataContrato"
                    type="date"
                    value={formData.dataContrato || ""}
                    onChange={(e) => setFormData({ ...formData, dataContrato: e.target.value })}
                  />
                </div>
                <div>
                  <Label htmlFor="dataVencimento">Data de Vencimento</Label>
                  <Input
                    id="dataVencimento"
                    type="date"
                    value={formData.dataVencimento || ""}
                    onChange={(e) => setFormData({ ...formData, dataVencimento: e.target.value })}
                  />
                </div>
              </div>
              <div>
                <Label htmlFor="observacoes">Observações</Label>
                <textarea
                  id="observacoes"
                  value={formData.observacoes || ""}
                  onChange={(e) => setFormData({ ...formData, observacoes: e.target.value })}
                  placeholder="Observações adicionais sobre o convênio..."
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  rows={3}
                />
              </div>
              <div className="flex justify-end gap-2 pt-4">
                <Button variant="outline" onClick={() => setShowModal(false)}>
                  Cancelar
                </Button>
                <Button onClick={handleSave}>{editingConvenio ? "Salvar Alterações" : "Cadastrar Convênio"}</Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  )
}
