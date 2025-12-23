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
import { BoxIcon, PlusIcon, SearchIcon, EditIcon, TrashIcon, DownloadIcon } from "lucide-react"

export default function ObjetosContabilizacaoPage() {
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedTipo, setSelectedTipo] = useState("all")

  const objetos = [
    {
      id: "001",
      codigo: "OBJ001",
      nome: "Beneficiário Pessoa Física",
      tipo: "Entidade",
      categoria: "Beneficiários",
      status: "Ativo",
      contasVinculadas: 5,
      descricao: "Objeto para contabilização de operações com beneficiários PF",
    },
    {
      id: "002",
      codigo: "OBJ002",
      nome: "Sinistro Ambulatorial",
      tipo: "Transação",
      categoria: "Sinistros",
      status: "Ativo",
      contasVinculadas: 8,
      descricao: "Objeto para contabilização de sinistros ambulatoriais",
    },
    {
      id: "003",
      codigo: "OBJ003",
      nome: "Receita de Mensalidade",
      tipo: "Receita",
      categoria: "Receitas",
      status: "Ativo",
      contasVinculadas: 3,
      descricao: "Objeto para contabilização de receitas de mensalidades",
    },
  ]

  const filteredObjetos = objetos.filter((objeto) => {
    const matchesSearch =
      objeto.nome.toLowerCase().includes(searchTerm.toLowerCase()) ||
      objeto.codigo.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesTipo = selectedTipo === "all" || objeto.tipo.toLowerCase() === selectedTipo
    return matchesSearch && matchesTipo
  })

  return (
    <div className="flex-1 space-y-6 p-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-slate-900">Objetos de Contabilização</h1>
          <p className="text-slate-600">Configure os objetos que serão utilizados na contabilização</p>
        </div>
        <Dialog>
          <DialogTrigger asChild>
            <Button className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700">
              <PlusIcon className="mr-2 h-4 w-4" />
              Novo Objeto
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[600px]">
            <DialogHeader>
              <DialogTitle>Cadastrar Novo Objeto</DialogTitle>
              <DialogDescription>Preencha as informações do novo objeto de contabilização</DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="codigo">Código</Label>
                  <Input id="codigo" placeholder="OBJ001" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="tipo">Tipo</Label>
                  <Select>
                    <SelectTrigger>
                      <SelectValue placeholder="Selecione o tipo" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="entidade">Entidade</SelectItem>
                      <SelectItem value="transacao">Transação</SelectItem>
                      <SelectItem value="receita">Receita</SelectItem>
                      <SelectItem value="despesa">Despesa</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="nome">Nome do Objeto</Label>
                <Input id="nome" placeholder="Digite o nome do objeto" />
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
                <Textarea id="descricao" placeholder="Descreva o objeto de contabilização" />
              </div>
            </div>
            <DialogFooter>
              <Button type="submit" className="bg-gradient-to-r from-blue-600 to-purple-600">
                Cadastrar Objeto
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid gap-6 md:grid-cols-4">
        <Card className="border-blue-200 bg-gradient-to-br from-blue-50 to-blue-100">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-blue-800">Total de Objetos</CardTitle>
            <BoxIcon className="h-4 w-4 text-blue-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-900">89</div>
            <p className="text-xs text-blue-600">+7 este mês</p>
          </CardContent>
        </Card>

        <Card className="border-green-200 bg-gradient-to-br from-green-50 to-green-100">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-green-800">Objetos Ativos</CardTitle>
            <BoxIcon className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-900">82</div>
            <p className="text-xs text-green-600">92% do total</p>
          </CardContent>
        </Card>

        <Card className="border-orange-200 bg-gradient-to-br from-orange-50 to-orange-100">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-orange-800">Entidades</CardTitle>
            <BoxIcon className="h-4 w-4 text-orange-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-orange-900">34</div>
            <p className="text-xs text-orange-600">38% do total</p>
          </CardContent>
        </Card>

        <Card className="border-purple-200 bg-gradient-to-br from-purple-50 to-purple-100">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-purple-800">Transações</CardTitle>
            <BoxIcon className="h-4 w-4 text-purple-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-purple-900">55</div>
            <p className="text-xs text-purple-600">62% do total</p>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Objetos Cadastrados</CardTitle>
          <CardDescription>Lista completa dos objetos de contabilização configurados</CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="lista" className="w-full">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="lista">Lista de Objetos</TabsTrigger>
              <TabsTrigger value="vinculos">Vínculos Contábeis</TabsTrigger>
              <TabsTrigger value="relatorios">Relatórios</TabsTrigger>
            </TabsList>

            <TabsContent value="lista" className="space-y-4">
              <div className="flex gap-4">
                <div className="relative flex-1">
                  <SearchIcon className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                  <Input
                    placeholder="Buscar objetos..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10"
                  />
                </div>
                <Select value={selectedTipo} onValueChange={setSelectedTipo}>
                  <SelectTrigger className="w-[180px]">
                    <SelectValue placeholder="Tipo" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Todos</SelectItem>
                    <SelectItem value="entidade">Entidade</SelectItem>
                    <SelectItem value="transacao">Transação</SelectItem>
                    <SelectItem value="receita">Receita</SelectItem>
                    <SelectItem value="despesa">Despesa</SelectItem>
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
                      <TableHead>Contas Vinculadas</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead className="text-right">Ações</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredObjetos.map((objeto) => (
                      <TableRow key={objeto.id}>
                        <TableCell className="font-medium">{objeto.codigo}</TableCell>
                        <TableCell>{objeto.nome}</TableCell>
                        <TableCell>{objeto.tipo}</TableCell>
                        <TableCell>{objeto.categoria}</TableCell>
                        <TableCell>
                          <Badge variant="outline">{objeto.contasVinculadas} contas</Badge>
                        </TableCell>
                        <TableCell>
                          <Badge variant={objeto.status === "Ativo" ? "default" : "secondary"}>{objeto.status}</Badge>
                        </TableCell>
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

            <TabsContent value="vinculos" className="space-y-4">
              <div className="grid gap-4 md:grid-cols-2">
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">Vínculos por Categoria</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2">
                      <div className="flex justify-between">
                        <span className="text-sm">Beneficiários</span>
                        <Badge>15 vínculos</Badge>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm">Sinistros</span>
                        <Badge>23 vínculos</Badge>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm">Receitas</span>
                        <Badge>12 vínculos</Badge>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm">Despesas</span>
                        <Badge>18 vínculos</Badge>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">Contas Mais Utilizadas</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2">
                      <div className="flex justify-between">
                        <span className="text-sm">1.1.01.001 - Caixa</span>
                        <Badge>8 objetos</Badge>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm">3.1.01.001 - Receitas</span>
                        <Badge>12 objetos</Badge>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm">4.1.01.001 - Despesas</span>
                        <Badge>15 objetos</Badge>
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
                    <CardTitle className="text-lg">Objetos por Tipo</CardTitle>
                    <CardDescription>Relatório agrupado por tipo</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <Button className="w-full">Gerar Relatório</Button>
                  </CardContent>
                </Card>

                <Card className="cursor-pointer hover:shadow-md transition-shadow">
                  <CardHeader>
                    <CardTitle className="text-lg">Vínculos Contábeis</CardTitle>
                    <CardDescription>Mapeamento objeto x conta</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <Button className="w-full">Gerar Relatório</Button>
                  </CardContent>
                </Card>

                <Card className="cursor-pointer hover:shadow-md transition-shadow">
                  <CardHeader>
                    <CardTitle className="text-lg">Auditoria de Objetos</CardTitle>
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
