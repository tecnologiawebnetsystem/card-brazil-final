"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Badge } from "@/components/ui/badge"
import { CardDescription } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Plus } from "lucide-react"
import { CadastroTable, type CadastroColumn } from "@/components/tables/cadastro-table"
import { CadastroDetailsGrid, CadastroDetailField } from "@/components/tables/cadastro-details"

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
  const [isLoading, setIsLoading] = useState(false)

  const loadConvenios = async () => {
    setIsLoading(true)
    try {
      const response = await fetch("/api/convenios")
      const payload = await response.json()
      if (!response.ok) throw new Error(payload.message || "Erro ao carregar convênios")
      setConvenios((payload.data || []).map((item: any) => ({
        id: item.id, nome: item.pessoa_nome || item.codigo_convenio || "Convênio", tipo: item.tipo_prestador,
        cnpj: "", contato: item.pessoa_nome || "", telefone: "", email: "", percentualCobertura: 0,
        prazoAutorizacao: 0, situacao: item.ativo ? "Ativo" : "Desativo", dataContrato: item.data_inicio || "",
        dataVencimento: item.data_fim, observacoes: item.especialidades,
      })))
    } catch (error) { console.error("[v0] Erro ao carregar convênios", error) }
    finally { setIsLoading(false) }
  }

  useEffect(() => { loadConvenios() }, [])

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

  const handleSave = async () => {
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

  const handleDelete = async (id: number) => {
    if (!confirm("Tem certeza que deseja excluir este convênio?")) return
    const response = await fetch(`/api/convenios/${id}`, { method: "DELETE" })
    if (!response.ok) { console.error("[v0] Erro ao excluir convênio"); return }
    setConvenios(convenios.filter((c) => c.id !== id))
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
            <h1 className="text-3xl font-bold text-foreground">Convênios</h1>
            <p className="text-muted-foreground">Gerencie os convênios médicos e hospitalares</p>
          </div>
          <Button onClick={handleAdd}>
            <Plus className="mr-2 h-4 w-4" />
            Novo Convênio
          </Button>
        </div>

        {/* Grid padronizado de convênios */}
        <Card>
          <CardHeader>
            <CardTitle>Convênios cadastrados</CardTitle>
            <CardDescription>Busque, visualize, edite e altere o status dos convênios.</CardDescription>
          </CardHeader>
          <CardContent>
            <CadastroTable
              data={convenios.filter((c) => filtroTipo === "Todos" || c.tipo === filtroTipo)}
              loading={isLoading && convenios.length === 0}
              getId={(c) => c.id}
              getSearchText={(c) => `${c.nome} ${c.contato} ${c.cnpj ?? ""} ${c.tipo}`}
              isActive={(c) => c.situacao === "Ativo"}
              searchPlaceholder="Buscar por nome, contato, CNPJ ou tipo..."
              emptyMessage="Nenhum convênio encontrado."
              extraFilters={
                <Select value={filtroTipo} onValueChange={setFiltroTipo}>
                  <SelectTrigger className="w-full sm:w-48">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Todos">Todos os tipos</SelectItem>
                    <SelectItem value="Médico">Médico</SelectItem>
                    <SelectItem value="Odontológico">Odontológico</SelectItem>
                    <SelectItem value="Hospitalar">Hospitalar</SelectItem>
                    <SelectItem value="Laboratorial">Laboratorial</SelectItem>
                    <SelectItem value="Farmácia">Farmácia</SelectItem>
                  </SelectContent>
                </Select>
              }
              columns={
                [
                  { key: "nome", header: "Convênio", sortable: true, className: "font-medium text-foreground" },
                  {
                    key: "tipo",
                    header: "Tipo",
                    sortable: true,
                    render: (c) => (
                      <Badge variant="secondary" className="text-xs">
                        {c.tipo}
                      </Badge>
                    ),
                  },
                  { key: "contato", header: "Contato", render: (c) => c.contato || "—" },
                  { key: "telefone", header: "Telefone", render: (c) => c.telefone || "—" },
                  {
                    key: "percentualCobertura",
                    header: "Cobertura",
                    sortable: true,
                    sortValue: (c) => c.percentualCobertura,
                    render: (c) => `${c.percentualCobertura}%`,
                  },
                ] as CadastroColumn<Convenio>[]
              }
              onEdit={handleEdit}
              onToggleStatus={(c) => toggleSituacao(c.id)}
              detailsTitle={(c) => c.nome}
              renderDetails={(c) => (
                <CadastroDetailsGrid>
                  <CadastroDetailField label="Convênio" value={c.nome} />
                  <CadastroDetailField label="Tipo" value={c.tipo} />
                  <CadastroDetailField label="Contato" value={c.contato} />
                  <CadastroDetailField label="Telefone" value={c.telefone} />
                  <CadastroDetailField label="E-mail" value={c.email} />
                  <CadastroDetailField label="CNPJ" value={c.cnpj} />
                  <CadastroDetailField label="Cobertura" value={`${c.percentualCobertura}%`} />
                  <CadastroDetailField label="Prazo autorização" value={`${c.prazoAutorizacao}h`} />
                  <CadastroDetailField
                    label="Valor consulta"
                    value={c.valorConsulta ? `R$ ${c.valorConsulta.toFixed(2)}` : undefined}
                  />
                  <CadastroDetailField
                    label="Valor exame"
                    value={c.valorExame ? `R$ ${c.valorExame.toFixed(2)}` : undefined}
                  />
                  <CadastroDetailField label="Status" value={c.situacao} />
                  <CadastroDetailField label="Observações" value={c.observacoes} full />
                </CadastroDetailsGrid>
              )}
            />
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
