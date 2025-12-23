"use client"

import type React from "react"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Search, MapPin, Loader2 } from "lucide-react"
import { useToast } from "@/hooks/use-toast"

interface Endereco {
  cep: string
  logradouro: string
  complemento?: string
  bairro: string
  cidade: string
  uf: string
  ibge?: string
}

export default function CEPPage() {
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedUF, setSelectedUF] = useState("")
  const [cidade, setCidade] = useState("")
  const [resultados, setResultados] = useState<Endereco[]>([])
  const [loading, setLoading] = useState(false)
  const { toast } = useToast()

  const buscarCEP = async () => {
    if (!searchTerm.trim()) {
      toast({
        title: "Atenção",
        description: "Digite um CEP ou nome de rua para buscar",
        variant: "destructive",
      })
      return
    }

    setLoading(true)
    setResultados([])

    try {
      // Verificar se é um CEP (apenas números)
      const apenasNumeros = searchTerm.replace(/\D/g, "")

      if (apenasNumeros.length === 8) {
        // Buscar por CEP
        const response = await fetch(`/api/cep/${apenasNumeros}`)
        const data = await response.json()

        if (response.ok) {
          setResultados([data])
          toast({
            title: "Sucesso",
            description: "CEP encontrado!",
          })
        } else {
          toast({
            title: "Erro",
            description: data.error || "CEP não encontrado",
            variant: "destructive",
          })
        }
      } else {
        // Buscar por endereço
        if (!selectedUF || !cidade) {
          toast({
            title: "Atenção",
            description: "Para buscar por endereço, informe UF e cidade",
            variant: "destructive",
          })
          return
        }

        const response = await fetch(
          `/api/cep/buscar?uf=${selectedUF}&cidade=${encodeURIComponent(cidade)}&logradouro=${encodeURIComponent(searchTerm)}`,
        )
        const data = await response.json()

        if (response.ok && Array.isArray(data)) {
          setResultados(data)
          toast({
            title: "Sucesso",
            description: `${data.length} endereço(s) encontrado(s)`,
          })
        } else {
          toast({
            title: "Erro",
            description: data.error || "Nenhum endereço encontrado",
            variant: "destructive",
          })
        }
      }
    } catch (error) {
      toast({
        title: "Erro",
        description: "Erro ao buscar CEP. Tente novamente.",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      buscarCEP()
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">CEP - Códigos de Endereçamento Postal</h1>
          <p className="text-muted-foreground">Consulta de CEPs dos Correios via ViaCEP</p>
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Consultas Realizadas</CardTitle>
            <MapPin className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{resultados.length}</div>
            <p className="text-xs text-muted-foreground">Nesta sessão</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Base de Dados</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">ViaCEP</div>
            <p className="text-xs text-muted-foreground">API dos Correios</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Cobertura</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">100%</div>
            <p className="text-xs text-muted-foreground">Todo o Brasil</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Atualização</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">Tempo Real</div>
            <p className="text-xs text-muted-foreground">Base oficial</p>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Consultar CEP</CardTitle>
          <CardDescription>
            Digite o CEP (apenas números) ou informe UF, cidade e nome da rua para buscar
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex gap-4">
              <div className="relative flex-1">
                <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Digite o CEP (ex: 01310100) ou nome da rua..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  onKeyPress={handleKeyPress}
                  className="pl-8"
                />
              </div>
              <Button onClick={buscarCEP} disabled={loading}>
                {loading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Buscando...
                  </>
                ) : (
                  <>
                    <Search className="mr-2 h-4 w-4" />
                    Buscar
                  </>
                )}
              </Button>
            </div>

            <div className="flex gap-4">
              <select
                className="px-3 py-2 border rounded-md"
                value={selectedUF}
                onChange={(e) => setSelectedUF(e.target.value)}
              >
                <option value="">Selecione a UF</option>
                <option value="AC">Acre</option>
                <option value="AL">Alagoas</option>
                <option value="AP">Amapá</option>
                <option value="AM">Amazonas</option>
                <option value="BA">Bahia</option>
                <option value="CE">Ceará</option>
                <option value="DF">Distrito Federal</option>
                <option value="ES">Espírito Santo</option>
                <option value="GO">Goiás</option>
                <option value="MA">Maranhão</option>
                <option value="MT">Mato Grosso</option>
                <option value="MS">Mato Grosso do Sul</option>
                <option value="MG">Minas Gerais</option>
                <option value="PA">Pará</option>
                <option value="PB">Paraíba</option>
                <option value="PR">Paraná</option>
                <option value="PE">Pernambuco</option>
                <option value="PI">Piauí</option>
                <option value="RJ">Rio de Janeiro</option>
                <option value="RN">Rio Grande do Norte</option>
                <option value="RS">Rio Grande do Sul</option>
                <option value="RO">Rondônia</option>
                <option value="RR">Roraima</option>
                <option value="SC">Santa Catarina</option>
                <option value="SP">São Paulo</option>
                <option value="SE">Sergipe</option>
                <option value="TO">Tocantins</option>
              </select>
              <Input
                placeholder="Nome da cidade..."
                value={cidade}
                onChange={(e) => setCidade(e.target.value)}
                onKeyPress={handleKeyPress}
                className="flex-1"
              />
            </div>
          </div>

          {resultados.length > 0 && (
            <div className="mt-6">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>CEP</TableHead>
                    <TableHead>Logradouro</TableHead>
                    <TableHead>Bairro</TableHead>
                    <TableHead>Cidade</TableHead>
                    <TableHead>UF</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {resultados.map((item, index) => (
                    <TableRow key={index}>
                      <TableCell className="font-mono">{item.cep}</TableCell>
                      <TableCell className="font-medium">
                        {item.logradouro}
                        {item.complemento && <span className="text-muted-foreground"> - {item.complemento}</span>}
                      </TableCell>
                      <TableCell>{item.bairro}</TableCell>
                      <TableCell>{item.cidade}</TableCell>
                      <TableCell>
                        <Badge variant="outline">{item.uf}</Badge>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}

          {!loading && resultados.length === 0 && (
            <div className="mt-6 text-center text-muted-foreground">
              <MapPin className="mx-auto h-12 w-12 mb-2 opacity-50" />
              <p>Digite um CEP ou endereço e clique em Buscar para consultar</p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
