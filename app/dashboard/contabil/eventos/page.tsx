"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { CalendarIcon, PlusIcon, SearchIcon, EditIcon, TrashIcon, FileTextIcon, DownloadIcon } from "lucide-react"

export default function CadastroEventosPage() {
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedStatus, setSelectedStatus] = useState("all")

  const eventos = [
    {
      id: "001",
      codigo: "EV001",
      nome: "Inclusão de Beneficiário",
      tipo: "Operacional",
      categoria: "Beneficiários",
      status: "Ativo",
      dataUltimaAtualizacao: "2024-01-15",
      descricao: "Evento para registro de inclusão de novos beneficiários",
    },
    {
      id: "002",
      codigo: "EV002",
      nome: "Exclusão de Beneficiário",
      tipo: "Operacional",
      categoria: "Beneficiários",
      status: "Ativo",
      dataUltimaAtualizacao: "2024-01-10",
      descricao: "Evento para registro de exclusão de beneficiários",
    },
    {
      id: "003",
      codigo: "EV003",
      nome: "Pagamento de Sinistro",
      tipo: "Financeiro",
      categoria: "Sinistros",
      status: "Ativo",
      dataUltimaAtualizacao: "2024-01-12",
      descricao: "Evento para registro de pagamentos de sinistros",
    },
  ]

  const filteredEventos = eventos.filter((evento) => {
    const matchesSearch =
      evento.nome.toLowerCase().includes(searchTerm.toLowerCase()) ||
      evento.codigo.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesStatus = selectedStatus === "all" || evento.status.toLowerCase() === selectedStatus
    return matchesSearch && matchesStatus
  })

  return (
    <div className="flex-1 space-y-6 p-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-slate-900">Cadastro de Eventos</h1>
          <p className="text-slate-600">Gerencie os eventos contábeis do sistema</p>
        </div>
        <Dialog>
          <DialogTrigger asChild>
            <Button className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700">
              <PlusIcon className="mr-2 h-4 w-4" />
              Novo Evento
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[600px]">
            <DialogHeader>
              <DialogTitle>Cadastrar Novo Evento</DialogTitle>
              <DialogDescription>Preencha as informações do novo evento contábil</DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="codigo">Código</Label>
                  <Input id="codigo" placeholder="EV001" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="tipo">Tipo</Label>
                  <Select>
                    <SelectTrigger>
                      <SelectValue placeholder="Selecione o tipo" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="operacional">Operacional</SelectItem>
                      <SelectItem value="financeiro">Financeiro</SelectItem>
                      <SelectItem value="regulatorio">Regulatório</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="nome">Nome do Evento</Label>
                <Input id="nome" placeholder="Digite o nome do evento" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="categoria">Categoria</Label>
                <Select>
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione a categoria" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="beneficiarios">Beneficiários</SelectItem>
                    <SelectItem value="sinistros">Sinistros</SelectItem>
                    <SelectItem value="receitas">Receitas</SelectItem>
                    <SelectItem value="despesas">Despesas</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="descricao">Descrição</Label>
                <Textarea id="descricao" placeholder="Descreva o evento contábil" />
              </div>
            </div>
            <DialogFooter>
              <Button type="submit" className="bg-gradient-to-r from-blue-600 to-purple-600">
                Cadastrar Evento
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid gap-6 md:grid-cols-4">
        <Card className="border-blue-200 bg-gradient-to-br from-blue-50 to-blue-100">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-blue-800">Total de Eventos</CardTitle>
            <FileTextIcon className="h-4 w-4 text-blue-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-900">156</div>
            <p className="text-xs text-blue-600">+12 este mês</p>
          </CardContent>
        </Card>

        <Card className="border-green-200 bg-gradient-to-br from-green-50 to-green-100">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-green-800">Eventos Ativos</CardTitle>
            <CalendarIcon className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-900">142</div>
            <p className="text-xs text-green-600">91% do total</p>
          </CardContent>
        </Card>

        <Card className="border-orange-200 bg-gradient-to-br from-orange-50 to-orange-100">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-orange-800">Eventos Financeiros</CardTitle>
            <FileTextIcon className="h-4 w-4 text-orange-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-orange-900">89</div>
            <p className="text-xs text-orange-600">57% do total</p>
          </CardContent>
        </Card>

        <Card className="border-purple-200 bg-gradient-to-br from-purple-50 to-purple-100">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-purple-800">Eventos Operacionais</CardTitle>
            <FileTextIcon className="h-4 w-4 text-purple-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-purple-900">67</div>
            <p className="text-xs text-purple-600">43% do total</p>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Eventos Cadastrados</CardTitle>
          <CardDescription>Lista completa dos eventos contábeis configurados no sistema</CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="lista" className="w-full">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="lista">Lista de Eventos</TabsTrigger>
              <TabsTrigger value="categorias">Por Categoria</TabsTrigger>
              <TabsTrigger value="relatorios">Relatórios</TabsTrigger>
            </TabsList>

            <TabsContent value="lista" className="space-y-4">
              <div className="flex gap-4">
                <div className="relative flex-1">
                  <SearchIcon className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                  <Input
                    placeholder="Buscar eventos..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10"
                  />
                </div>
                <Select value={selectedStatus} onValueChange={setSelectedStatus}>
                  <SelectTrigger className="w-[180px]">
                    <SelectValue placeholder="Status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Todos</SelectItem>
                    <SelectItem value="ativo">Ativo</SelectItem>
                    <SelectItem value="inativo">Inativo</SelectItem>
                  </SelectContent>
                </Select>
                <Button variant="outline">
                  <DownloadIcon className="mr-2 h-4 w-4" />
                  Exportar
                </Button>
              </div>

              <div className="rounded-md border">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Código</TableHead>
                      <TableHead>Nome</TableHead>
                      <TableHead>Tipo</TableHead>
                      <TableHead>Categoria</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Última Atualização</TableHead>
                      <TableHead className="text-right">Ações</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredEventos.map((evento) => (
                      <TableRow key={evento.id}>
                        <TableCell className="font-medium">{evento.codigo}</TableCell>
                        <TableCell>{evento.nome}</TableCell>
                        <TableCell>{evento.tipo}</TableCell>
                        <TableCell>{evento.categoria}</TableCell>
                        <TableCell>
                          <Badge variant={evento.status === "Ativo" ? "default" : "secondary"}>{evento.status}</Badge>
                        </TableCell>
                        <TableCell>{evento.dataUltimaAtualizacao}</TableCell>
                        <TableCell className="text-right">
                          <div className="flex justify-end gap-2">
                            <Button variant="ghost" size="sm">
                              <EditIcon className="h-4 w-4" />
                            </Button>
                            <Button variant="ghost" size="sm">
                              <TrashIcon className="h-4 w-4" />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </TabsContent>

            <TabsContent value="categorias" className="space-y-4">
              <div className="grid gap-4 md:grid-cols-2">
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">Beneficiários</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2">
                      <div className="flex justify-between">
                        <span className="text-sm">Inclusão</span>
                        <Badge>45 eventos</Badge>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm">Exclusão</span>
                        <Badge>32 eventos</Badge>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm">Alteração</span>
                        <Badge>28 eventos</Badge>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">Sinistros</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2">
                      <div className="flex justify-between">
                        <span className="text-sm">Pagamento</span>
                        <Badge>23 eventos</Badge>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm">Estorno</span>
                        <Badge>15 eventos</Badge>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm">Provisão</span>
                        <Badge>13 eventos</Badge>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

            <TabsContent value="relatorios" className="space-y-4">
              <div className="grid gap-4 md:grid-cols-3">
                <Card className="cursor-pointer hover:shadow-md transition-shadow">
                  <CardHeader>
                    <CardTitle className="text-lg">Eventos por Período</CardTitle>
                    <CardDescription>Relatório de eventos por data</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <Button className="w-full">Gerar Relatório</Button>
                  </CardContent>
                </Card>

                <Card className="cursor-pointer hover:shadow-md transition-shadow">
                  <CardHeader>
                    <CardTitle className="text-lg">Eventos por Categoria</CardTitle>
                    <CardDescription>Agrupamento por categoria</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <Button className="w-full">Gerar Relatório</Button>
                  </CardContent>
                </Card>

                <Card className="cursor-pointer hover:shadow-md transition-shadow">
                  <CardHeader>
                    <CardTitle className="text-lg">Auditoria de Eventos</CardTitle>
                    <CardDescription>Log de alterações</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <Button className="w-full">Gerar Relatório</Button>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  )
}
