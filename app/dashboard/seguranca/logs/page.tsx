"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Calendar } from "@/components/ui/calendar"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { format } from "date-fns"
import { ptBR } from "date-fns/locale"
import { Search, CalendarIcon, Download, Eye, AlertTriangle, Info, CheckCircle } from "lucide-react"

interface LogEntry {
  id: number
  usuario: string
  perfil: string
  acao: string
  pagina: string
  ip: string
  userAgent: string
  timestamp: string
  tipo: "info" | "warning" | "error" | "success"
  detalhes?: string
}

export default function LogsPage() {
  const [logs] = useState<LogEntry[]>([
    {
      id: 1,
      usuario: "João Silva Santos",
      perfil: "Administrador",
      acao: "Login realizado",
      pagina: "/dashboard",
      ip: "192.168.1.100",
      userAgent: "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36",
      timestamp: "2024-01-15 14:30:25",
      tipo: "success",
    },
    {
      id: 2,
      usuario: "Maria Oliveira Costa",
      perfil: "Operador",
      acao: "Cadastrou nova pessoa",
      pagina: "/dashboard/segurados",
      ip: "192.168.1.101",
      userAgent: "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36",
      timestamp: "2024-01-15 14:25:10",
      tipo: "info",
      detalhes: "Pessoa: Carlos Eduardo Lima - CPF: 456.789.123-00",
    },
    {
      id: 3,
      usuario: "Carlos Eduardo Lima",
      perfil: "Financeiro",
      acao: "Tentativa de acesso negada",
      pagina: "/dashboard/sistema/usuarios",
      ip: "192.168.1.102",
      userAgent: "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36",
      timestamp: "2024-01-15 14:20:45",
      tipo: "warning",
      detalhes: "Usuário não possui permissão para acessar gestão de usuários",
    },
    {
      id: 4,
      usuario: "Ana Paula Santos",
      perfil: "Corretor",
      acao: "Erro ao salvar dados",
      pagina: "/dashboard/cadastros/corretor",
      ip: "192.168.1.103",
      userAgent: "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36",
      timestamp: "2024-01-15 14:15:30",
      tipo: "error",
      detalhes: "Erro de validação: Campo CNPJ inválido",
    },
    {
      id: 5,
      usuario: "João Silva Santos",
      perfil: "Administrador",
      acao: "Visualizou relatório financeiro",
      pagina: "/dashboard/relatorios/financeiro",
      ip: "192.168.1.100",
      userAgent: "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36",
      timestamp: "2024-01-15 14:10:15",
      tipo: "info",
    },
    {
      id: 6,
      usuario: "Maria Oliveira Costa",
      perfil: "Operador",
      acao: "Exportou dados de pessoas",
      pagina: "/dashboard/segurados",
      ip: "192.168.1.101",
      userAgent: "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36",
      timestamp: "2024-01-15 14:05:00",
      tipo: "info",
      detalhes: "Exportação em formato Excel - 150 registros",
    },
  ])

  const [searchTerm, setSearchTerm] = useState("")
  const [filtroTipo, setFiltroTipo] = useState<string>("todos")
  const [filtroPerfil, setFiltroPerfil] = useState<string>("todos")
  const [dataInicio, setDataInicio] = useState<Date>()
  const [dataFim, setDataFim] = useState<Date>()

  const logsFiltrados = logs.filter((log) => {
    const matchesSearch =
      log.usuario.toLowerCase().includes(searchTerm.toLowerCase()) ||
      log.acao.toLowerCase().includes(searchTerm.toLowerCase()) ||
      log.pagina.toLowerCase().includes(searchTerm.toLowerCase())

    const matchesTipo = filtroTipo === "todos" || log.tipo === filtroTipo
    const matchesPerfil = filtroPerfil === "todos" || log.perfil === filtroPerfil

    const logDate = new Date(log.timestamp)
    const matchesDataInicio = !dataInicio || logDate >= dataInicio
    const matchesDataFim = !dataFim || logDate <= dataFim

    return matchesSearch && matchesTipo && matchesPerfil && matchesDataInicio && matchesDataFim
  })

  const getTipoIcon = (tipo: string) => {
    switch (tipo) {
      case "success":
        return <CheckCircle className="h-4 w-4 text-green-600" />
      case "warning":
        return <AlertTriangle className="h-4 w-4 text-yellow-600" />
      case "error":
        return <AlertTriangle className="h-4 w-4 text-red-600" />
      default:
        return <Info className="h-4 w-4 text-blue-600" />
    }
  }

  const getTipoColor = (tipo: string) => {
    switch (tipo) {
      case "success":
        return "bg-green-100 text-green-800"
      case "warning":
        return "bg-yellow-100 text-yellow-800"
      case "error":
        return "bg-red-100 text-red-800"
      default:
        return "bg-blue-100 text-blue-800"
    }
  }

  const exportarLogs = () => {
    // Implementar exportação
    console.log("Exportando logs...")
  }

  const perfisUnicos = [...new Set(logs.map((log) => log.perfil))]
  const logsInfo = logs.filter((l) => l.tipo === "info").length
  const logsWarning = logs.filter((l) => l.tipo === "warning").length
  const logsError = logs.filter((l) => l.tipo === "error").length
  const logsSuccess = logs.filter((l) => l.tipo === "success").length

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-6 py-6">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-3xl font-bold text-foreground">Logs do Sistema</h1>
            <p className="text-muted-foreground">Monitore todas as atividades dos usuários</p>
          </div>
          <Button onClick={exportarLogs} className="bg-emerald-700 hover:bg-emerald-800">
            <Download className="h-4 w-4 mr-2" />
            Exportar Logs
          </Button>
        </div>

        {/* Métricas */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Informações</CardTitle>
              <Info className="h-5 w-5 text-blue-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-blue-600">{logsInfo}</div>
              <p className="text-xs text-muted-foreground">logs informativos</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Sucessos</CardTitle>
              <CheckCircle className="h-5 w-5 text-green-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-600">{logsSuccess}</div>
              <p className="text-xs text-muted-foreground">operações bem-sucedidas</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Avisos</CardTitle>
              <AlertTriangle className="h-5 w-5 text-yellow-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-yellow-600">{logsWarning}</div>
              <p className="text-xs text-muted-foreground">avisos de segurança</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Erros</CardTitle>
              <AlertTriangle className="h-5 w-5 text-red-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-red-600">{logsError}</div>
              <p className="text-xs text-muted-foreground">erros registrados</p>
            </CardContent>
          </Card>
        </div>

        {/* Filtros */}
        <Card className="mb-6">
          <CardContent className="pt-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                <Input
                  placeholder="Buscar logs..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>

              <Select value={filtroTipo} onValueChange={setFiltroTipo}>
                <SelectTrigger>
                  <SelectValue placeholder="Tipo" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="todos">Todos os Tipos</SelectItem>
                  <SelectItem value="info">Informação</SelectItem>
                  <SelectItem value="success">Sucesso</SelectItem>
                  <SelectItem value="warning">Aviso</SelectItem>
                  <SelectItem value="error">Erro</SelectItem>
                </SelectContent>
              </Select>

              <Select value={filtroPerfil} onValueChange={setFiltroPerfil}>
                <SelectTrigger>
                  <SelectValue placeholder="Perfil" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="todos">Todos os Perfis</SelectItem>
                  {perfisUnicos.map((perfil) => (
                    <SelectItem key={perfil} value={perfil}>
                      {perfil}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              <Popover>
                <PopoverTrigger asChild>
                  <Button variant="outline" className="justify-start text-left font-normal bg-transparent">
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {dataInicio ? format(dataInicio, "dd/MM/yyyy", { locale: ptBR }) : "Data início"}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0">
                  <Calendar mode="single" selected={dataInicio} onSelect={setDataInicio} initialFocus />
                </PopoverContent>
              </Popover>

              <Popover>
                <PopoverTrigger asChild>
                  <Button variant="outline" className="justify-start text-left font-normal bg-transparent">
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {dataFim ? format(dataFim, "dd/MM/yyyy", { locale: ptBR }) : "Data fim"}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0">
                  <Calendar mode="single" selected={dataFim} onSelect={setDataFim} initialFocus />
                </PopoverContent>
              </Popover>
            </div>
          </CardContent>
        </Card>

        {/* Lista de Logs */}
        <Card>
          <CardHeader>
            <CardTitle>Logs de Atividade ({logsFiltrados.length})</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {logsFiltrados.map((log) => (
                <div key={log.id} className="flex items-start justify-between p-4 border rounded-lg">
                  <div className="flex items-start space-x-4">
                    <div className="mt-1">{getTipoIcon(log.tipo)}</div>
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <h3 className="font-medium">{log.usuario}</h3>
                        <Badge variant="outline">{log.perfil}</Badge>
                        <Badge className={getTipoColor(log.tipo)}>{log.tipo.toUpperCase()}</Badge>
                      </div>
                      <p className="text-sm text-foreground mb-1">{log.acao}</p>
                      <p className="text-xs text-muted-foreground">
                        Página: {log.pagina} • IP: {log.ip} • {log.timestamp}
                      </p>
                      {log.detalhes && (
                        <p className="text-xs text-muted-foreground mt-2 p-2 bg-muted rounded">{log.detalhes}</p>
                      )}
                    </div>
                  </div>
                  <Button variant="outline" size="sm">
                    <Eye className="h-4 w-4" />
                  </Button>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
