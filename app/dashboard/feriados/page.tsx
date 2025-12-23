"use client"

import { useState, useMemo } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"

interface Feriado {
  id: number
  nome: string
  data: string
  tipo: "nacional" | "estadual" | "municipal" | "religioso"
  descricao: string
  fixo: boolean
  ativo: boolean
}

export default function FeriadosPage() {
  const [searchTerm, setSearchTerm] = useState("")
  const [filterTipo, setFilterTipo] = useState("todos")
  const [filterAno, setFilterAno] = useState("2024")
  const [showModal, setShowModal] = useState(false)

  const [feriados] = useState<Feriado[]>([
    {
      id: 1,
      nome: "Confraternização Universal",
      data: "2024-01-01",
      tipo: "nacional",
      descricao: "Primeiro dia do ano",
      fixo: true,
      ativo: true,
    },
    {
      id: 2,
      nome: "Carnaval",
      data: "2024-02-12",
      tipo: "nacional",
      descricao: "Segunda-feira de Carnaval",
      fixo: false,
      ativo: true,
    },
    {
      id: 3,
      nome: "Carnaval",
      data: "2024-02-13",
      tipo: "nacional",
      descricao: "Terça-feira de Carnaval",
      fixo: false,
      ativo: true,
    },
    {
      id: 4,
      nome: "Sexta-feira Santa",
      data: "2024-03-29",
      tipo: "religioso",
      descricao: "Paixão de Cristo",
      fixo: false,
      ativo: true,
    },
    {
      id: 5,
      nome: "Tiradentes",
      data: "2024-04-21",
      tipo: "nacional",
      descricao: "Dia de Tiradentes",
      fixo: true,
      ativo: true,
    },
    {
      id: 6,
      nome: "Dia do Trabalhador",
      data: "2024-05-01",
      tipo: "nacional",
      descricao: "Dia Internacional do Trabalho",
      fixo: true,
      ativo: true,
    },
    {
      id: 7,
      nome: "Corpus Christi",
      data: "2024-05-30",
      tipo: "religioso",
      descricao: "Corpo de Cristo",
      fixo: false,
      ativo: true,
    },
    {
      id: 8,
      nome: "Independência do Brasil",
      data: "2024-09-07",
      tipo: "nacional",
      descricao: "Proclamação da Independência",
      fixo: true,
      ativo: true,
    },
    {
      id: 9,
      nome: "Nossa Senhora Aparecida",
      data: "2024-10-12",
      tipo: "religioso",
      descricao: "Padroeira do Brasil",
      fixo: true,
      ativo: true,
    },
    {
      id: 10,
      nome: "Finados",
      data: "2024-11-02",
      tipo: "religioso",
      descricao: "Dia de Finados",
      fixo: true,
      ativo: true,
    },
    {
      id: 11,
      nome: "Proclamação da República",
      data: "2024-11-15",
      tipo: "nacional",
      descricao: "Proclamação da República",
      fixo: true,
      ativo: true,
    },
    {
      id: 12,
      nome: "Natal",
      data: "2024-12-25",
      tipo: "religioso",
      descricao: "Nascimento de Jesus Cristo",
      fixo: true,
      ativo: true,
    },
  ])

  const filteredFeriados = useMemo(() => {
    return feriados.filter((feriado) => {
      const matchesSearch =
        feriado.nome.toLowerCase().includes(searchTerm.toLowerCase()) ||
        feriado.descricao.toLowerCase().includes(searchTerm.toLowerCase())
      const matchesTipo = filterTipo === "todos" || feriado.tipo === filterTipo
      const matchesAno = feriado.data.startsWith(filterAno)
      return matchesSearch && matchesTipo && matchesAno
    })
  }, [feriados, searchTerm, filterTipo, filterAno])

  const analytics = useMemo(() => {
    const totalFeriados = filteredFeriados.length
    const feriadosNacionais = filteredFeriados.filter((f) => f.tipo === "nacional").length
    const feriadosReligiosos = filteredFeriados.filter((f) => f.tipo === "religioso").length
    const feriadosFixos = filteredFeriados.filter((f) => f.fixo).length

    return {
      totalFeriados,
      feriadosNacionais,
      feriadosReligiosos,
      feriadosFixos,
    }
  }, [filteredFeriados])

  const formatDate = (dateString: string) => {
    return new Date(dateString + "T00:00:00").toLocaleDateString("pt-BR", {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
    })
  }

  const getTipoColor = (tipo: string) => {
    switch (tipo) {
      case "nacional":
        return "default"
      case "estadual":
        return "secondary"
      case "municipal":
        return "outline"
      case "religioso":
        return "destructive"
      default:
        return "outline"
    }
  }

  const isProximo = (data: string) => {
    const hoje = new Date()
    const dataFeriado = new Date(data + "T00:00:00")
    const diffTime = dataFeriado.getTime() - hoje.getTime()
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))
    return diffDays >= 0 && diffDays <= 30
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-6 py-6">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-2xl font-bold text-foreground">Feriados</h1>
            <p className="text-muted-foreground">Consulte todos os feriados nacionais, estaduais e municipais</p>
          </div>
          <Dialog open={showModal} onOpenChange={setShowModal}>
            <DialogTrigger asChild>
              <Button>
                <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                </svg>
                Novo Feriado
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-md">
              <DialogHeader>
                <DialogTitle>Cadastrar Novo Feriado</DialogTitle>
                <DialogDescription>Adicione um novo feriado ao calendário</DialogDescription>
              </DialogHeader>
              <div className="space-y-4">
                <div>
                  <Label>Nome do Feriado</Label>
                  <Input placeholder="Ex: Dia da Consciência Negra" />
                </div>
                <div>
                  <Label>Data</Label>
                  <Input type="date" />
                </div>
                <div>
                  <Label>Tipo</Label>
                  <Select>
                    <SelectTrigger>
                      <SelectValue placeholder="Selecione o tipo" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="nacional">Nacional</SelectItem>
                      <SelectItem value="estadual">Estadual</SelectItem>
                      <SelectItem value="municipal">Municipal</SelectItem>
                      <SelectItem value="religioso">Religioso</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label>Descrição</Label>
                  <Input placeholder="Breve descrição do feriado" />
                </div>
                <Button className="w-full">Cadastrar Feriado</Button>
              </div>
            </DialogContent>
          </Dialog>
        </div>

        {/* Métricas */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
          <Card className="bg-emerald-700 text-white border-emerald-700">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-white">Total de Feriados</CardTitle>
              <div className="h-8 w-8 bg-emerald-800 rounded-full flex items-center justify-center">
                <svg className="h-4 w-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                  />
                </svg>
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-white">{analytics.totalFeriados}</div>
              <p className="text-sm text-emerald-100">em {filterAno}</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Feriados Nacionais</CardTitle>
              <svg className="h-4 w-4 text-muted-foreground" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M3 21v-4m0 0V5a2 2 0 012-2h6.5l1 1H21l-3 6 3 6h-8.5l-1-1H5a2 2 0 00-2 2zm9-13.5V9"
                />
              </svg>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{analytics.feriadosNacionais}</div>
              <p className="text-xs text-muted-foreground">feriados oficiais</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Feriados Religiosos</CardTitle>
              <svg className="h-4 w-4 text-muted-foreground" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"
                />
              </svg>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{analytics.feriadosReligiosos}</div>
              <p className="text-xs text-muted-foreground">datas religiosas</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Feriados Fixos</CardTitle>
              <svg className="h-4 w-4 text-muted-foreground" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
                />
              </svg>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{analytics.feriadosFixos}</div>
              <p className="text-xs text-muted-foreground">mesma data todo ano</p>
            </CardContent>
          </Card>
        </div>

        {/* Filtros e Pesquisa */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle>Filtros de Feriados</CardTitle>
            <CardDescription>Pesquise e filtre os feriados por nome, tipo ou ano</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <Input
                  placeholder="Pesquisar feriado..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
              <Select value={filterTipo} onValueChange={setFilterTipo}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="todos">Todos os Tipos</SelectItem>
                  <SelectItem value="nacional">Nacional</SelectItem>
                  <SelectItem value="estadual">Estadual</SelectItem>
                  <SelectItem value="municipal">Municipal</SelectItem>
                  <SelectItem value="religioso">Religioso</SelectItem>
                </SelectContent>
              </Select>
              <Select value={filterAno} onValueChange={setFilterAno}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="2024">2024</SelectItem>
                  <SelectItem value="2025">2025</SelectItem>
                  <SelectItem value="2026">2026</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>

        {/* Tabela de Feriados */}
        <Card>
          <CardHeader>
            <CardTitle>Calendário de Feriados {filterAno}</CardTitle>
            <CardDescription>Lista completa dos feriados cadastrados no sistema</CardDescription>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Feriado</TableHead>
                  <TableHead>Data</TableHead>
                  <TableHead>Tipo</TableHead>
                  <TableHead>Descrição</TableHead>
                  <TableHead>Características</TableHead>
                  <TableHead>Status</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredFeriados.map((feriado) => (
                  <TableRow key={feriado.id}>
                    <TableCell className="font-medium">
                      <div className="flex items-center gap-2">
                        {feriado.nome}
                        {isProximo(feriado.data) && (
                          <Badge variant="outline" className="text-xs">
                            Próximo
                          </Badge>
                        )}
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="text-sm">
                        <div className="font-medium">
                          {new Date(feriado.data + "T00:00:00").toLocaleDateString("pt-BR")}
                        </div>
                        <div className="text-muted-foreground text-xs">
                          {new Date(feriado.data + "T00:00:00").toLocaleDateString("pt-BR", { weekday: "long" })}
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge variant={getTipoColor(feriado.tipo)}>{feriado.tipo}</Badge>
                    </TableCell>
                    <TableCell className="text-sm text-muted-foreground">{feriado.descricao}</TableCell>
                    <TableCell>
                      <div className="flex gap-1">
                        {feriado.fixo && (
                          <Badge variant="outline" className="text-xs">
                            Fixo
                          </Badge>
                        )}
                        {!feriado.fixo && (
                          <Badge variant="outline" className="text-xs">
                            Móvel
                          </Badge>
                        )}
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge variant={feriado.ativo ? "default" : "secondary"}>
                        {feriado.ativo ? "Ativo" : "Inativo"}
                      </Badge>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
