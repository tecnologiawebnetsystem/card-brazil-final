"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Switch } from "@/components/ui/switch"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { toast } from "sonner"
import { Shield, Lock, Unlock, Save } from "lucide-react"

interface Permissao {
  id: string
  nome: string
  categoria: string
  descricao: string
}

interface AlcadaPerfil {
  perfilId: string
  permissoes: string[]
}

const permissoesDisponiveis: Permissao[] = [
  // Dashboard
  {
    id: "dashboard_view",
    nome: "Visualizar Dashboard",
    categoria: "Dashboard",
    descricao: "Acesso ao painel principal",
  },

  // Cadastros
  { id: "cadastros_view", nome: "Visualizar Cadastros", categoria: "Cadastros", descricao: "Ver páginas de cadastros" },
  { id: "cadastros_create", nome: "Criar Cadastros", categoria: "Cadastros", descricao: "Criar novos registros" },
  {
    id: "cadastros_edit",
    nome: "Editar Cadastros",
    categoria: "Cadastros",
    descricao: "Modificar registros existentes",
  },
  { id: "cadastros_delete", nome: "Excluir Cadastros", categoria: "Cadastros", descricao: "Remover registros" },

  // Pessoas
  { id: "pessoas_view", nome: "Visualizar Pessoas", categoria: "Pessoas", descricao: "Ver cadastro de pessoas" },
  { id: "pessoas_create", nome: "Criar Pessoas", categoria: "Pessoas", descricao: "Cadastrar novas pessoas" },
  { id: "pessoas_edit", nome: "Editar Pessoas", categoria: "Pessoas", descricao: "Modificar dados de pessoas" },
  { id: "pessoas_delete", nome: "Excluir Pessoas", categoria: "Pessoas", descricao: "Remover pessoas" },

  // Financeiro
  { id: "financeiro_view", nome: "Visualizar Financeiro", categoria: "Financeiro", descricao: "Ver dados financeiros" },
  {
    id: "financeiro_create",
    nome: "Criar Financeiro",
    categoria: "Financeiro",
    descricao: "Criar registros financeiros",
  },
  {
    id: "financeiro_edit",
    nome: "Editar Financeiro",
    categoria: "Financeiro",
    descricao: "Modificar dados financeiros",
  },
  {
    id: "financeiro_delete",
    nome: "Excluir Financeiro",
    categoria: "Financeiro",
    descricao: "Remover registros financeiros",
  },

  // Relatórios
  { id: "relatorios_view", nome: "Visualizar Relatórios", categoria: "Relatórios", descricao: "Acessar relatórios" },
  {
    id: "relatorios_export",
    nome: "Exportar Relatórios",
    categoria: "Relatórios",
    descricao: "Exportar dados de relatórios",
  },

  // Consultas
  { id: "consultas_view", nome: "Visualizar Consultas", categoria: "Consultas", descricao: "Acessar consultas" },
  {
    id: "consultas_advanced",
    nome: "Consultas Avançadas",
    categoria: "Consultas",
    descricao: "Consultas com filtros avançados",
  },

  // Sistema
  { id: "usuarios_view", nome: "Visualizar Usuários", categoria: "Sistema", descricao: "Ver usuários do sistema" },
  { id: "usuarios_create", nome: "Criar Usuários", categoria: "Sistema", descricao: "Cadastrar novos usuários" },
  { id: "usuarios_edit", nome: "Editar Usuários", categoria: "Sistema", descricao: "Modificar usuários" },
  { id: "usuarios_delete", nome: "Excluir Usuários", categoria: "Sistema", descricao: "Remover usuários" },
  { id: "perfis_manage", nome: "Gerenciar Perfis", categoria: "Sistema", descricao: "Criar e editar perfis" },
  { id: "alcadas_manage", nome: "Gerenciar Alçadas", categoria: "Sistema", descricao: "Definir permissões" },

  // Segurança
  { id: "logs_view", nome: "Visualizar Logs", categoria: "Segurança", descricao: "Acessar logs do sistema" },
  {
    id: "security_manage",
    nome: "Gerenciar Segurança",
    categoria: "Segurança",
    descricao: "Configurações de segurança",
  },
]

const perfisDisponiveis = [
  { id: "administrador", nome: "Administrador" },
  { id: "operador", nome: "Operador" },
  { id: "estipulante", nome: "Estipulante" },
  { id: "agenciador", nome: "Agenciador" },
  { id: "corretor", nome: "Corretor" },
  { id: "financeiro", nome: "Financeiro" },
  { id: "cobranca", nome: "Cobrança" },
]

export default function AlcadasPage() {
  const [perfilSelecionado, setPerfilSelecionado] = useState<string>("administrador")
  const [alcadas, setAlcadas] = useState<AlcadaPerfil[]>([
    {
      perfilId: "administrador",
      permissoes: permissoesDisponiveis.map((p) => p.id), // Admin tem todas as permissões
    },
    {
      perfilId: "operador",
      permissoes: [
        "dashboard_view",
        "cadastros_view",
        "cadastros_create",
        "cadastros_edit",
        "pessoas_view",
        "pessoas_create",
        "pessoas_edit",
        "consultas_view",
      ],
    },
    {
      perfilId: "financeiro",
      permissoes: [
        "dashboard_view",
        "financeiro_view",
        "financeiro_create",
        "financeiro_edit",
        "relatorios_view",
        "relatorios_export",
        "consultas_view",
      ],
    },
  ])

  const alcadaAtual = alcadas.find((a) => a.perfilId === perfilSelecionado) || {
    perfilId: perfilSelecionado,
    permissoes: [],
  }

  const togglePermissao = (permissaoId: string) => {
    setAlcadas((prev) => {
      const alcadaIndex = prev.findIndex((a) => a.perfilId === perfilSelecionado)

      if (alcadaIndex >= 0) {
        const alcadaAtualizada = { ...prev[alcadaIndex] }
        if (alcadaAtualizada.permissoes.includes(permissaoId)) {
          alcadaAtualizada.permissoes = alcadaAtualizada.permissoes.filter((p) => p !== permissaoId)
        } else {
          alcadaAtualizada.permissoes.push(permissaoId)
        }

        const novasAlcadas = [...prev]
        novasAlcadas[alcadaIndex] = alcadaAtualizada
        return novasAlcadas
      } else {
        return [...prev, { perfilId: perfilSelecionado, permissoes: [permissaoId] }]
      }
    })
  }

  const salvarAlcadas = () => {
    toast.success("Alçadas salvas com sucesso!")
  }

  const categorias = [...new Set(permissoesDisponiveis.map((p) => p.categoria))]

  const getPermissoesPorCategoria = (categoria: string) => {
    return permissoesDisponiveis.filter((p) => p.categoria === categoria)
  }

  const getPercentualPermissoes = () => {
    return Math.round((alcadaAtual.permissoes.length / permissoesDisponiveis.length) * 100)
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-6 py-6">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-3xl font-bold text-foreground">Alçadas e Permissões</h1>
            <p className="text-muted-foreground">Configure as permissões de acesso por perfil</p>
          </div>
          <Button onClick={salvarAlcadas} className="bg-emerald-700 hover:bg-emerald-800">
            <Save className="h-4 w-4 mr-2" />
            Salvar Alterações
          </Button>
        </div>

        {/* Seletor de Perfil */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle>Selecionar Perfil</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-4">
              <Select value={perfilSelecionado} onValueChange={setPerfilSelecionado}>
                <SelectTrigger className="w-64">
                  <SelectValue placeholder="Selecione um perfil" />
                </SelectTrigger>
                <SelectContent>
                  {perfisDisponiveis.map((perfil) => (
                    <SelectItem key={perfil.id} value={perfil.id}>
                      {perfil.nome}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <div className="flex items-center gap-2">
                <Shield className="h-5 w-5 text-emerald-600" />
                <span className="text-sm text-muted-foreground">
                  {alcadaAtual.permissoes.length} de {permissoesDisponiveis.length} permissões (
                  {getPercentualPermissoes()}%)
                </span>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Permissões por Categoria */}
        <div className="space-y-6">
          {categorias.map((categoria) => {
            const permissoesCategoria = getPermissoesPorCategoria(categoria)
            const permissoesAtivas = permissoesCategoria.filter((p) => alcadaAtual.permissoes.includes(p.id)).length

            return (
              <Card key={categoria}>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle className="flex items-center gap-2">
                      {categoria === "Dashboard" && <Shield className="h-5 w-5" />}
                      {categoria === "Cadastros" && <Lock className="h-5 w-5" />}
                      {categoria === "Pessoas" && <Lock className="h-5 w-5" />}
                      {categoria === "Financeiro" && <Lock className="h-5 w-5" />}
                      {categoria === "Relatórios" && <Lock className="h-5 w-5" />}
                      {categoria === "Consultas" && <Lock className="h-5 w-5" />}
                      {categoria === "Sistema" && <Shield className="h-5 w-5" />}
                      {categoria === "Segurança" && <Shield className="h-5 w-5" />}
                      {categoria}
                    </CardTitle>
                    <Badge variant="outline">
                      {permissoesAtivas}/{permissoesCategoria.length}
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {permissoesCategoria.map((permissao) => {
                      const ativa = alcadaAtual.permissoes.includes(permissao.id)

                      return (
                        <div key={permissao.id} className="flex items-center justify-between p-3 border rounded-lg">
                          <div className="flex-1">
                            <div className="flex items-center gap-2">
                              {ativa ? (
                                <Unlock className="h-4 w-4 text-green-600" />
                              ) : (
                                <Lock className="h-4 w-4 text-red-600" />
                              )}
                              <h4 className="font-medium">{permissao.nome}</h4>
                            </div>
                            <p className="text-sm text-muted-foreground mt-1">{permissao.descricao}</p>
                          </div>
                          <Switch checked={ativa} onCheckedChange={() => togglePermissao(permissao.id)} />
                        </div>
                      )
                    })}
                  </div>
                </CardContent>
              </Card>
            )
          })}
        </div>
      </div>
    </div>
  )
}
