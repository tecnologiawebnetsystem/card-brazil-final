"use client"

import type React from "react"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
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
import { BreadcrumbNav } from "@/components/dashboard/breadcrumb-nav"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { toast } from "@/hooks/use-toast"

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

const TrashIcon = () => (
  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
    />
  </svg>
)

const MapPinIcon = () => (
  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
    />
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
  </svg>
)

interface CodigoPostal {
  id: string
  cep: string
  logradouro: string
  bairro: string
  cidade: string
  estado: string
  latitude?: string
  longitude?: string
  complemento?: string
  status: "ativo" | "inativo"
}

const mockCodigosPostais: CodigoPostal[] = [
  {
    id: "1",
    cep: "01310-100",
    logradouro: "Avenida Paulista",
    bairro: "Bela Vista",
    cidade: "São Paulo",
    estado: "SP",
    latitude: "-23.5613",
    longitude: "-46.6565",
    status: "ativo",
  },
  {
    id: "2",
    cep: "20040-020",
    logradouro: "Rua da Assembleia",
    bairro: "Centro",
    cidade: "Rio de Janeiro",
    estado: "RJ",
    latitude: "-22.9068",
    longitude: "-43.1729",
    status: "ativo",
  },
  {
    id: "3",
    cep: "30112-000",
    logradouro: "Rua da Bahia",
    bairro: "Centro",
    cidade: "Belo Horizonte",
    estado: "MG",
    latitude: "-19.9167",
    longitude: "-43.9345",
    status: "ativo",
  },
  {
    id: "4",
    cep: "01310-200",
    logradouro: "Avenida Paulista",
    bairro: "Bela Vista",
    cidade: "São Paulo",
    estado: "SP",
    latitude: "-23.5615",
    longitude: "-46.6568",
    complemento: "lado par",
    status: "ativo",
  },
  {
    id: "5",
    cep: "04038-001",
    logradouro: "Rua Vergueiro",
    bairro: "Vila Mariana",
    cidade: "São Paulo",
    estado: "SP",
    latitude: "-23.5729",
    longitude: "-46.6395",
    status: "ativo",
  },
]

export default function CodigosPostaisPage() {
  const [codigosPostais, setCodigosPostais] = useState<CodigoPostal[]>(mockCodigosPostais)
  const [searchTerm, setSearchTerm] = useState("")
  const [searchType, setSearchType] = useState<"cep" | "endereco">("cep")
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [selectedCep, setSelectedCep] = useState<CodigoPostal | null>(null)
  const [isDetailsModalOpen, setIsDetailsModalOpen] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [formData, setFormData] = useState({
    cep: "",
    logradouro: "",
    bairro: "",
    cidade: "",
    estado: "",
    latitude: "",
    longitude: "",
    complemento: "",
    status: "ativo" as "ativo" | "inativo",
  })

  const filteredCodigosPostais = codigosPostais.filter((codigo) => {
    if (searchType === "cep") {
      return codigo.cep.replace(/\D/g, "").includes(searchTerm.replace(/\D/g, ""))
    } else {
      return (
        codigo.logradouro.toLowerCase().includes(searchTerm.toLowerCase()) ||
        codigo.bairro.toLowerCase().includes(searchTerm.toLowerCase()) ||
        codigo.cidade.toLowerCase().includes(searchTerm.toLowerCase())
      )
    }
  })

  const handleCepSearch = async (cep: string) => {
    const cleanCep = cep.replace(/\D/g, "")
    if (cleanCep.length === 8) {
      setIsLoading(true)
      try {
        const response = await fetch(`https://viacep.com.br/ws/${cleanCep}/json/`)
        const data = await response.json()

        if (data.erro) {
          toast({
            title: "CEP não encontrado",
            description: "O CEP informado não foi encontrado na base dos Correios.",
            variant: "destructive",
          })
          return
        }

        setFormData((prev) => ({
          ...prev,
          logradouro: data.logradouro || "",
          bairro: data.bairro || "",
          cidade: data.localidade || "",
          estado: data.uf || "",
          complemento: data.complemento || "",
        }))

        toast({
          title: "CEP encontrado!",
          description: `Endereço: ${data.logradouro}, ${data.bairro} - ${data.localidade}/${data.uf}`,
        })
      } catch (error) {
        toast({
          title: "Erro na consulta",
          description: "Não foi possível consultar o CEP. Tente novamente.",
          variant: "destructive",
        })
      } finally {
        setIsLoading(false)
      }
    }
  }

  const handleRealTimeSearch = async () => {
    if (searchType === "cep" && searchTerm.replace(/\D/g, "").length === 8) {
      setIsLoading(true)
      try {
        const cleanCep = searchTerm.replace(/\D/g, "")
        const response = await fetch(`https://viacep.com.br/ws/${cleanCep}/json/`)
        const data = await response.json()

        if (data.erro) {
          toast({
            title: "CEP não encontrado",
            description: "O CEP informado não foi encontrado na base dos Correios.",
            variant: "destructive",
          })
          return
        }

        const newResult: CodigoPostal = {
          id: `api-${Date.now()}`,
          cep: `${cleanCep.slice(0, 5)}-${cleanCep.slice(5)}`,
          logradouro: data.logradouro || "",
          bairro: data.bairro || "",
          cidade: data.localidade || "",
          estado: data.uf || "",
          complemento: data.complemento || "",
          status: "ativo",
        }

        setCodigosPostais((prev) => {
          const filtered = prev.filter((item) => !item.id.startsWith("api-"))
          return [newResult, ...filtered]
        })

        toast({
          title: "CEP consultado com sucesso!",
          description: `${data.logradouro}, ${data.bairro} - ${data.localidade}/${data.uf}`,
        })
      } catch (error) {
        toast({
          title: "Erro na consulta",
          description: "Não foi possível consultar o CEP. Tente novamente.",
          variant: "destructive",
        })
      } finally {
        setIsLoading(false)
      }
    } else if (searchType === "endereco" && searchTerm.length >= 3) {
      const results = mockCodigosPostais.filter(
        (codigo) =>
          codigo.logradouro.toLowerCase().includes(searchTerm.toLowerCase()) ||
          codigo.bairro.toLowerCase().includes(searchTerm.toLowerCase()) ||
          codigo.cidade.toLowerCase().includes(searchTerm.toLowerCase()),
      )

      if (results.length === 0) {
        toast({
          title: "Nenhum resultado encontrado",
          description: "Tente refinar sua busca ou usar um CEP específico.",
        })
      }
    }
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    const newCodigo: CodigoPostal = {
      id: Date.now().toString(),
      ...formData,
    }
    setCodigosPostais([...codigosPostais, newCodigo])
    setFormData({
      cep: "",
      logradouro: "",
      bairro: "",
      cidade: "",
      estado: "",
      latitude: "",
      longitude: "",
      complemento: "",
      status: "ativo",
    })
    setIsModalOpen(false)
    toast({
      title: "CEP cadastrado com sucesso!",
      description: `O CEP ${newCodigo.cep} foi adicionado ao sistema.`,
    })
  }

  const handleViewDetails = (codigo: CodigoPostal) => {
    setSelectedCep(codigo)
    setIsDetailsModalOpen(true)
  }

  return (
    <div className="flex-1 space-y-4 p-4 md:p-8 pt-6">
      <BreadcrumbNav
        items={[
          { title: "Dashboard", link: "/dashboard" },
          { title: "Tabelas Gerais", link: "/dashboard/tabelas" },
          { title: "Códigos Postais", link: "/dashboard/tabelas/codigos-postais" },
        ]}
      />

      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Códigos Postais</h2>
          <p className="text-muted-foreground">Consulte CEPs em tempo real usando a API dos Correios do Brasil</p>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total de CEPs</CardTitle>
            <MapPinIcon />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{codigosPostais.length}</div>
            <p className="text-xs text-muted-foreground">Códigos cadastrados</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">CEPs Ativos</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{codigosPostais.filter((c) => c.status === "ativo").length}</div>
            <p className="text-xs text-muted-foreground">Em uso no sistema</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Estados</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{new Set(codigosPostais.map((c) => c.estado)).size}</div>
            <p className="text-xs text-muted-foreground">Estados cobertos</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Cidades</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{new Set(codigosPostais.map((c) => c.cidade)).size}</div>
            <p className="text-xs text-muted-foreground">Cidades cadastradas</p>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Buscar CEP</CardTitle>
          <CardDescription>
            Digite o CEP para consulta em tempo real na base dos Correios ou busque por endereço
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex gap-4">
            <Select value={searchType} onValueChange={(value: "cep" | "endereco") => setSearchType(value)}>
              <SelectTrigger className="w-40">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="cep">Por CEP</SelectItem>
                <SelectItem value="endereco">Por Endereço</SelectItem>
              </SelectContent>
            </Select>
            <div className="relative flex-1">
              <SearchIcon />
              <Input
                placeholder={
                  searchType === "cep" ? "Digite o CEP (ex: 01310-100)" : "Digite o nome da rua, bairro ou cidade"
                }
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-8"
                disabled={isLoading}
              />
            </div>
            <Button
              variant="outline"
              onClick={handleRealTimeSearch}
              disabled={isLoading || (searchType === "cep" && searchTerm.replace(/\D/g, "").length !== 8)}
            >
              {isLoading ? (
                <div className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin" />
              ) : (
                <SearchIcon />
              )}
              {isLoading ? "Consultando..." : "Buscar"}
            </Button>
          </div>
          <p className="text-xs text-muted-foreground mt-2">
            {searchType === "cep"
              ? "A consulta por CEP utiliza a API oficial dos Correios (ViaCEP) em tempo real"
              : "A busca por endereço consulta os dados já cadastrados no sistema"}
          </p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Resultados da Busca</CardTitle>
              <CardDescription>{filteredCodigosPostais.length} resultado(s) encontrado(s)</CardDescription>
            </div>
            <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
              <DialogTrigger asChild>
                <Button>
                  <PlusIcon />
                  Novo CEP
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-[500px]">
                <DialogHeader>
                  <DialogTitle>Cadastrar Novo CEP</DialogTitle>
                  <DialogDescription>Digite o CEP para busca automática ou preencha manualmente</DialogDescription>
                </DialogHeader>
                <form onSubmit={handleSubmit}>
                  <div className="grid gap-4 py-4">
                    <div className="grid grid-cols-4 items-center gap-4">
                      <Label htmlFor="cep" className="text-right">
                        CEP
                      </Label>
                      <div className="col-span-3 flex gap-2">
                        <Input
                          id="cep"
                          value={formData.cep}
                          onChange={(e) => {
                            setFormData({ ...formData, cep: e.target.value })
                            if (e.target.value.replace(/\D/g, "").length === 8) {
                              handleCepSearch(e.target.value)
                            }
                          }}
                          placeholder="00000-000"
                          required
                          disabled={isLoading}
                        />
                        {isLoading && (
                          <div className="w-8 h-8 border-2 border-current border-t-transparent rounded-full animate-spin" />
                        )}
                      </div>
                    </div>
                    <div className="grid grid-cols-4 items-center gap-4">
                      <Label htmlFor="logradouro" className="text-right">
                        Logradouro
                      </Label>
                      <Input
                        id="logradouro"
                        value={formData.logradouro}
                        onChange={(e) => setFormData({ ...formData, logradouro: e.target.value })}
                        className="col-span-3"
                        required
                      />
                    </div>
                    <div className="grid grid-cols-4 items-center gap-4">
                      <Label htmlFor="bairro" className="text-right">
                        Bairro
                      </Label>
                      <Input
                        id="bairro"
                        value={formData.bairro}
                        onChange={(e) => setFormData({ ...formData, bairro: e.target.value })}
                        className="col-span-3"
                        required
                      />
                    </div>
                    <div className="grid grid-cols-4 items-center gap-4">
                      <Label htmlFor="cidade" className="text-right">
                        Cidade
                      </Label>
                      <Input
                        id="cidade"
                        value={formData.cidade}
                        onChange={(e) => setFormData({ ...formData, cidade: e.target.value })}
                        className="col-span-3"
                        required
                      />
                    </div>
                    <div className="grid grid-cols-4 items-center gap-4">
                      <Label htmlFor="estado" className="text-right">
                        Estado
                      </Label>
                      <Input
                        id="estado"
                        value={formData.estado}
                        onChange={(e) => setFormData({ ...formData, estado: e.target.value })}
                        className="col-span-3"
                        placeholder="SP"
                        maxLength={2}
                        required
                      />
                    </div>
                    <div className="grid grid-cols-4 items-center gap-4">
                      <Label htmlFor="latitude" className="text-right">
                        Latitude
                      </Label>
                      <Input
                        id="latitude"
                        value={formData.latitude}
                        onChange={(e) => setFormData({ ...formData, latitude: e.target.value })}
                        className="col-span-3"
                        placeholder="-23.5505"
                      />
                    </div>
                    <div className="grid grid-cols-4 items-center gap-4">
                      <Label htmlFor="longitude" className="text-right">
                        Longitude
                      </Label>
                      <Input
                        id="longitude"
                        value={formData.longitude}
                        onChange={(e) => setFormData({ ...formData, longitude: e.target.value })}
                        className="col-span-3"
                        placeholder="-46.6333"
                      />
                    </div>
                    <div className="grid grid-cols-4 items-center gap-4">
                      <Label htmlFor="complemento" className="text-right">
                        Complemento
                      </Label>
                      <Input
                        id="complemento"
                        value={formData.complemento}
                        onChange={(e) => setFormData({ ...formData, complemento: e.target.value })}
                        className="col-span-3"
                        placeholder="lado par, próximo ao..."
                      />
                    </div>
                  </div>
                  <DialogFooter>
                    <Button type="submit" disabled={isLoading}>
                      {isLoading ? "Consultando..." : "Cadastrar CEP"}
                    </Button>
                  </DialogFooter>
                </form>
              </DialogContent>
            </Dialog>
          </div>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>CEP</TableHead>
                <TableHead>Logradouro</TableHead>
                <TableHead>Bairro</TableHead>
                <TableHead>Cidade/UF</TableHead>
                <TableHead>Coordenadas</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Ações</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredCodigosPostais.map((codigo) => (
                <TableRow key={codigo.id}>
                  <TableCell className="font-medium">
                    {codigo.cep}
                    {codigo.id.startsWith("api-") && (
                      <Badge variant="outline" className="ml-2 text-xs">
                        API
                      </Badge>
                    )}
                  </TableCell>
                  <TableCell>{codigo.logradouro}</TableCell>
                  <TableCell>{codigo.bairro}</TableCell>
                  <TableCell>
                    {codigo.cidade}/{codigo.estado}
                  </TableCell>
                  <TableCell>
                    {codigo.latitude && codigo.longitude ? (
                      <span className="text-xs text-muted-foreground">
                        {codigo.latitude}, {codigo.longitude}
                      </span>
                    ) : (
                      <span className="text-xs text-muted-foreground">-</span>
                    )}
                  </TableCell>
                  <TableCell>
                    <Badge variant={codigo.status === "ativo" ? "default" : "secondary"}>{codigo.status}</Badge>
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex items-center justify-end gap-2">
                      <Button variant="ghost" size="sm" onClick={() => handleViewDetails(codigo)}>
                        <MapPinIcon />
                      </Button>
                      <Button variant="ghost" size="sm">
                        <EditIcon />
                      </Button>
                      <Button variant="ghost" size="sm">
                        <TrashIcon />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      <Dialog open={isDetailsModalOpen} onOpenChange={setIsDetailsModalOpen}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>Detalhes do CEP</DialogTitle>
            <DialogDescription>Informações completas do código postal</DialogDescription>
          </DialogHeader>
          {selectedCep && (
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label className="text-sm font-medium">CEP</Label>
                  <p className="text-lg font-bold">{selectedCep.cep}</p>
                </div>
                <div>
                  <Label className="text-sm font-medium">Status</Label>
                  <Badge variant={selectedCep.status === "ativo" ? "default" : "secondary"}>{selectedCep.status}</Badge>
                </div>
              </div>
              <div>
                <Label className="text-sm font-medium">Endereço Completo</Label>
                <p>{selectedCep.logradouro}</p>
                <p>
                  {selectedCep.bairro} - {selectedCep.cidade}/{selectedCep.estado}
                </p>
                {selectedCep.complemento && <p className="text-sm text-muted-foreground">{selectedCep.complemento}</p>}
              </div>
              {selectedCep.latitude && selectedCep.longitude && (
                <div>
                  <Label className="text-sm font-medium">Coordenadas Geográficas</Label>
                  <p>Latitude: {selectedCep.latitude}</p>
                  <p>Longitude: {selectedCep.longitude}</p>
                </div>
              )}
            </div>
          )}
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsDetailsModalOpen(false)}>
              Fechar
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
