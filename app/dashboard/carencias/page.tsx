"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

const ClockIcon = () => (
  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
    />
  </svg>
)

const CheckCircleIcon = () => (
  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
    />
  </svg>
)

const AlertCircleIcon = () => (
  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z"
    />
  </svg>
)

const PlusIcon = () => (
  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
  </svg>
)

export default function CarenciasPage() {
  const [showNovaCarencia, setShowNovaCarencia] = useState(false)
  const [carenciaData, setCarenciaData] = useState({
    procedimento: "",
    plano: "",
    diasCarencia: "",
    categoria: "",
    observacoes: "",
  })

  const [carencias] = useState([
    {
      id: 1,
      procedimento: "Consultas Médicas",
      categoria: "Ambulatorial",
      plano: "Todos os Planos",
      diasCarencia: 0,
      status: "Ativo",
      dataVigencia: "2024-01-01",
    },
    {
      id: 2,
      procedimento: "Exames Simples",
      categoria: "Diagnóstico",
      plano: "Todos os Planos",
      diasCarencia: 30,
      status: "Ativo",
      dataVigencia: "2024-01-01",
    },
    {
      id: 3,
      procedimento: "Cirurgias Eletivas",
      categoria: "Hospitalar",
      plano: "Premium/Executivo",
      diasCarencia: 180,
      status: "Ativo",
      dataVigencia: "2024-01-01",
    },
    {
      id: 4,
      procedimento: "Tratamento Oncológico",
      categoria: "Hospitalar",
      plano: "Todos os Planos",
      diasCarencia: 180,
      status: "Ativo",
      dataVigencia: "2024-01-01",
    },
    {
      id: 5,
      procedimento: "Parto",
      categoria: "Obstétrico",
      plano: "Familiar/Premium",
      diasCarencia: 300,
      status: "Ativo",
      dataVigencia: "2024-01-01",
    },
  ])

  const [seguradosCarencia] = useState([
    {
      id: 1,
      nome: "Maria Silva Santos",
      procedimento: "Cirurgia Cardíaca",
      dataAdesao: "2023-10-15",
      diasCarencia: 180,
      diasRestantes: 45,
      status: "Em Carência",
    },
    {
      id: 2,
      nome: "João Pedro Oliveira",
      procedimento: "Tratamento Oncológico",
      dataAdesao: "2023-08-20",
      diasCarencia: 180,
      diasRestantes: 0,
      status: "Liberado",
    },
    {
      id: 3,
      nome: "Ana Carolina Lima",
      procedimento: "Parto Normal",
      dataAdesao: "2023-06-10",
      diasCarencia: 300,
      diasRestantes: 85,
      status: "Em Carência",
    },
  ])

  const handleSalvarCarencia = () => {
    setShowNovaCarencia(false)
    setCarenciaData({
      procedimento: "",
      plano: "",
      diasCarencia: "",
      categoria: "",
      observacoes: "",
    })
  }

  return (
    <div className="flex-1 space-y-6 p-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold tracking-tight text-foreground">Carências</h2>
          <p className="text-muted-foreground">Controle de carências por procedimento e acompanhamento de segurados</p>
        </div>
        <Dialog open={showNovaCarencia} onOpenChange={setShowNovaCarencia}>
          <DialogTrigger asChild>
            <Button className="bg-primary hover:bg-primary/90">
              <PlusIcon />
              Nova Carência
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[600px]">
            <DialogHeader>
              <DialogTitle>Configurar Carência</DialogTitle>
              <DialogDescription>Defina os períodos de carência para procedimentos específicos</DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="procedimento">Procedimento</Label>
                  <Input
                    id="procedimento"
                    placeholder="Ex: Cirurgia Cardíaca"
                    value={carenciaData.procedimento}
                    onChange={(e) => setCarenciaData({ ...carenciaData, procedimento: e.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="categoria">Categoria</Label>
                  <Select
                    value={carenciaData.categoria}
                    onValueChange={(value) => setCarenciaData({ ...carenciaData, categoria: value })}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Selecione a categoria" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="ambulatorial">Ambulatorial</SelectItem>
                      <SelectItem value="hospitalar">Hospitalar</SelectItem>
                      <SelectItem value="diagnostico">Diagnóstico</SelectItem>
                      <SelectItem value="obstetrico">Obstétrico</SelectItem>
                      <SelectItem value="urgencia">Urgência/Emergência</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="plano">Plano Aplicável</Label>
                  <Select
                    value={carenciaData.plano}
                    onValueChange={(value) => setCarenciaData({ ...carenciaData, plano: value })}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Selecione o plano" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="todos">Todos os Planos</SelectItem>
                      <SelectItem value="basico">Plano Básico</SelectItem>
                      <SelectItem value="familiar">Plano Familiar</SelectItem>
                      <SelectItem value="executivo">Plano Executivo</SelectItem>
                      <SelectItem value="premium">Plano Premium</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="dias">Dias de Carência</Label>
                  <Input
                    id="dias"
                    type="number"
                    placeholder="Ex: 180"
                    value={carenciaData.diasCarencia}
                    onChange={(e) => setCarenciaData({ ...carenciaData, diasCarencia: e.target.value })}
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="observacoes">Observações</Label>
                <Input
                  id="observacoes"
                  placeholder="Observações sobre a carência"
                  value={carenciaData.observacoes}
                  onChange={(e) => setCarenciaData({ ...carenciaData, observacoes: e.target.value })}
                />
              </div>
            </div>
            <div className="flex justify-end gap-3">
              <Button variant="outline" onClick={() => setShowNovaCarencia(false)}>
                Cancelar
              </Button>
              <Button onClick={handleSalvarCarencia}>Salvar Carência</Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Procedimentos Cadastrados</CardTitle>
            <ClockIcon />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">47</div>
            <p className="text-xs text-muted-foreground">Diferentes tipos de procedimentos</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Segurados em Carência</CardTitle>
            <AlertCircleIcon />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">234</div>
            <p className="text-xs text-muted-foreground">Aguardando liberação de procedimentos</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Liberações Hoje</CardTitle>
            <CheckCircleIcon />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">18</div>
            <p className="text-xs text-muted-foreground">Carências cumpridas hoje</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Carência Média</CardTitle>
            <ClockIcon />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">120 dias</div>
            <p className="text-xs text-muted-foreground">Tempo médio de carência</p>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="procedimentos" className="space-y-4">
        <TabsList>
          <TabsTrigger value="procedimentos">Procedimentos</TabsTrigger>
          <TabsTrigger value="segurados">Segurados em Carência</TabsTrigger>
          <TabsTrigger value="relatorios">Relatórios</TabsTrigger>
        </TabsList>

        <TabsContent value="procedimentos" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Carências por Procedimento</CardTitle>
              <CardDescription>Lista de procedimentos e seus respectivos períodos de carência</CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Procedimento</TableHead>
                    <TableHead>Categoria</TableHead>
                    <TableHead>Plano</TableHead>
                    <TableHead>Dias de Carência</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Data Vigência</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {carencias.map((carencia) => (
                    <TableRow key={carencia.id}>
                      <TableCell className="font-medium">{carencia.procedimento}</TableCell>
                      <TableCell>{carencia.categoria}</TableCell>
                      <TableCell>{carencia.plano}</TableCell>
                      <TableCell>
                        <Badge variant={carencia.diasCarencia === 0 ? "default" : "secondary"}>
                          {carencia.diasCarencia === 0 ? "Sem carência" : `${carencia.diasCarencia} dias`}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <Badge variant="default">{carencia.status}</Badge>
                      </TableCell>
                      <TableCell>{new Date(carencia.dataVigencia).toLocaleDateString("pt-BR")}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="segurados" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Segurados em Período de Carência</CardTitle>
              <CardDescription>Acompanhamento de segurados aguardando liberação de procedimentos</CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Segurado</TableHead>
                    <TableHead>Procedimento</TableHead>
                    <TableHead>Data Adesão</TableHead>
                    <TableHead>Carência Total</TableHead>
                    <TableHead>Dias Restantes</TableHead>
                    <TableHead>Status</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {seguradosCarencia.map((segurado) => (
                    <TableRow key={segurado.id}>
                      <TableCell className="font-medium">{segurado.nome}</TableCell>
                      <TableCell>{segurado.procedimento}</TableCell>
                      <TableCell>{new Date(segurado.dataAdesao).toLocaleDateString("pt-BR")}</TableCell>
                      <TableCell>{segurado.diasCarencia} dias</TableCell>
                      <TableCell>
                        <Badge variant={segurado.diasRestantes === 0 ? "default" : "secondary"}>
                          {segurado.diasRestantes === 0 ? "Liberado" : `${segurado.diasRestantes} dias`}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <Badge variant={segurado.status === "Liberado" ? "default" : "destructive"}>
                          {segurado.status}
                        </Badge>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="relatorios" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Relatórios de Carência</CardTitle>
              <CardDescription>Gere relatórios sobre períodos de carência e liberações</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <Button variant="outline">Relatório de Liberações</Button>
                <Button variant="outline">Segurados em Carência</Button>
                <Button variant="outline">Análise por Procedimento</Button>
                <Button variant="outline">Histórico de Carências</Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
