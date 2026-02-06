import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { CheckCircle2, Database, Globe, Lock, Palette, Rocket, Shield, Users, Zap } from "lucide-react"

export default function SobrePage() {
  return (
    <div className="container-responsive py-8 space-y-8">
      {/* Header */}
      <div className="space-y-2">
        <h1 className="text-4xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
          Talent Health CRM
        </h1>
        <p className="text-xl text-muted-foreground">Sistema de Gestão de Saúde</p>
        <div className="flex gap-2">
          <Badge variant="outline" className="bg-primary/10 text-primary border-primary/20">
            Versão 2.0.0
          </Badge>
          <Badge variant="outline" className="bg-success/10 text-success border-success/20">
            Janeiro 2025
          </Badge>
        </div>
      </div>

      <Separator />

      {/* Características Principais */}
      <Card className="healthcare-card">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Zap className="h-5 w-5 text-primary" />
            Características Principais
          </CardTitle>
          <CardDescription>
            Sistema completo de gestão para operadoras de saúde, administradoras de benefícios e corretoras
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="flex items-start gap-3">
              <Users className="h-5 w-5 text-primary mt-0.5" />
              <div>
                <h4 className="font-semibold">Multi-tenant</h4>
                <p className="text-sm text-muted-foreground">Suporte completo para múltiplas administradoras</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <Lock className="h-5 w-5 text-primary mt-0.5" />
              <div>
                <h4 className="font-semibold">Autenticação Segura</h4>
                <p className="text-sm text-muted-foreground">Sistema de login com JWT e controle de sessões</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <Database className="h-5 w-5 text-primary mt-0.5" />
              <div>
                <h4 className="font-semibold">CRUD Completo</h4>
                <p className="text-sm text-muted-foreground">
                  Gestão de pessoas, operadoras, planos, propostas e financeiro
                </p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <Globe className="h-5 w-5 text-primary mt-0.5" />
              <div>
                <h4 className="font-semibold">Integrações Externas</h4>
                <p className="text-sm text-muted-foreground">ViaCEP, Brasil API (Bacen), AwesomeAPI (Cotações)</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <Palette className="h-5 w-5 text-primary mt-0.5" />
              <div>
                <h4 className="font-semibold">UX/UI Moderna</h4>
                <p className="text-sm text-muted-foreground">
                  Componentes responsivos, acessíveis e com feedback visual
                </p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <Shield className="h-5 w-5 text-primary mt-0.5" />
              <div>
                <h4 className="font-semibold">Documentação Swagger</h4>
                <p className="text-sm text-muted-foreground">API REST totalmente documentada</p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Módulos do Sistema */}
      <Card className="healthcare-card">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Rocket className="h-5 w-5 text-primary" />
            Módulos do Sistema
          </CardTitle>
          <CardDescription>Funcionalidades completas para gestão de saúde</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {/* Cadastros */}
            <div className="space-y-2">
              <h4 className="font-semibold text-primary flex items-center gap-2">
                <CheckCircle2 className="h-4 w-4" />
                Cadastros
              </h4>
              <ul className="space-y-1 text-sm text-muted-foreground">
                <li>• Pessoas (PF/PJ)</li>
                <li>• Operadoras de saúde</li>
                <li>• Administradoras</li>
                <li>• Estipulantes</li>
                <li>• Corretores e agenciadores</li>
                <li>• Planos e produtos</li>
                <li>• Convênios</li>
              </ul>
            </div>

            {/* Propostas */}
            <div className="space-y-2">
              <h4 className="font-semibold text-primary flex items-center gap-2">
                <CheckCircle2 className="h-4 w-4" />
                Propostas
              </h4>
              <ul className="space-y-1 text-sm text-muted-foreground">
                <li>• Nova proposta</li>
                <li>• Lista de propostas</li>
                <li>• Propostas pendentes</li>
                <li>• Análise e aprovação</li>
                <li>• Aprovação em lote</li>
                <li>• Relatórios</li>
              </ul>
            </div>

            {/* Beneficiários */}
            <div className="space-y-2">
              <h4 className="font-semibold text-primary flex items-center gap-2">
                <CheckCircle2 className="h-4 w-4" />
                Beneficiários
              </h4>
              <ul className="space-y-1 text-sm text-muted-foreground">
                <li>• Beneficiário titular</li>
                <li>• Dependentes</li>
                <li>• Consulta unificada</li>
                <li>• Carteirinhas digitais</li>
              </ul>
            </div>

            {/* Financeiro */}
            <div className="space-y-2">
              <h4 className="font-semibold text-primary flex items-center gap-2">
                <CheckCircle2 className="h-4 w-4" />
                Financeiro
              </h4>
              <ul className="space-y-1 text-sm text-muted-foreground">
                <li>• Contas a receber</li>
                <li>• Contas a pagar</li>
                <li>• Fluxo de caixa</li>
                <li>• Cobrança judicial</li>
                <li>• Multas e juros</li>
              </ul>
            </div>

            {/* Cobrança */}
            <div className="space-y-2">
              <h4 className="font-semibold text-primary flex items-center gap-2">
                <CheckCircle2 className="h-4 w-4" />
                Cobrança
              </h4>
              <ul className="space-y-1 text-sm text-muted-foreground">
                <li>• Geração de boletos</li>
                <li>• Consulta de boletos</li>
                <li>• Negociação de débitos</li>
                <li>• Histórico de pagamentos</li>
                <li>• Conciliação bancária</li>
                <li>• Controle de inadimplência</li>
              </ul>
            </div>

            {/* Tabelas Gerais */}
            <div className="space-y-2">
              <h4 className="font-semibold text-primary flex items-center gap-2">
                <CheckCircle2 className="h-4 w-4" />
                Tabelas Gerais
              </h4>
              <ul className="space-y-1 text-muted-foreground">
                <li>• CEP (ViaCEP)</li>
                <li>• Bancos (Bacen)</li>
                <li>• Moedas (AwesomeAPI)</li>
                <li>• Feriados</li>
              </ul>
            </div>

            {/* Sistema Contábil */}
            <div className="space-y-2">
              <h4 className="font-semibold text-primary flex items-center gap-2">
                <CheckCircle2 className="h-4 w-4" />
                Sistema Contábil
              </h4>
              <ul className="space-y-1 text-sm text-muted-foreground">
                <li>• Plano de contas</li>
                <li>• Lançamentos contábeis</li>
                <li>• Balancetes e DRE</li>
                <li>• Provisões técnicas</li>
                <li>• Balanço patrimonial</li>
              </ul>
            </div>

            {/* Configurações */}
            <div className="space-y-2">
              <h4 className="font-semibold text-primary flex items-center gap-2">
                <CheckCircle2 className="h-4 w-4" />
                Configurações
              </h4>
              <ul className="space-y-1 text-sm text-muted-foreground">
                <li>• Usuários e perfis</li>
                <li>• Permissões</li>
                <li>• Email e SMS</li>
                <li>• Personalização</li>
                <li>• Logs de auditoria</li>
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Tecnologias */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card className="healthcare-card">
          <CardHeader>
            <CardTitle className="text-lg">Front-end</CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="space-y-2 text-sm">
              <li className="flex items-center gap-2">
                <CheckCircle2 className="h-4 w-4 text-primary" />
                Next.js 15 - Framework React
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle2 className="h-4 w-4 text-primary" />
                React 19 - Biblioteca UI
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle2 className="h-4 w-4 text-primary" />
                TypeScript 5 - Tipagem estática
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle2 className="h-4 w-4 text-primary" />
                Tailwind CSS 4 - Framework CSS
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle2 className="h-4 w-4 text-primary" />
                Radix UI - Componentes acessíveis
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle2 className="h-4 w-4 text-primary" />
                Recharts - Gráficos interativos
              </li>
            </ul>
          </CardContent>
        </Card>

        <Card className="healthcare-card">
          <CardHeader>
            <CardTitle className="text-lg">Back-end</CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="space-y-2 text-sm">
              <li className="flex items-center gap-2">
                <CheckCircle2 className="h-4 w-4 text-primary" />
                Next.js API Routes - Endpoints REST
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle2 className="h-4 w-4 text-primary" />
                Neon PostgreSQL - Banco de dados serverless
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle2 className="h-4 w-4 text-primary" />
                @neondatabase/serverless - Driver PostgreSQL
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle2 className="h-4 w-4 text-primary" />
                bcryptjs - Hash de senhas
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle2 className="h-4 w-4 text-primary" />
                jsonwebtoken - Autenticação JWT
              </li>
            </ul>
          </CardContent>
        </Card>
      </div>

      {/* Banco de Dados */}
      <Card className="healthcare-card">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Database className="h-5 w-5 text-primary" />
            Banco de Dados
          </CardTitle>
          <CardDescription>13 tabelas principais criadas no Neon PostgreSQL</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
            <div>
              <h5 className="font-semibold mb-2">Administração</h5>
              <p className="text-muted-foreground">2 tabelas</p>
            </div>
            <div>
              <h5 className="font-semibold mb-2">Pessoas</h5>
              <p className="text-muted-foreground">3 tabelas</p>
            </div>
            <div>
              <h5 className="font-semibold mb-2">Operadoras</h5>
              <p className="text-muted-foreground">5 tabelas</p>
            </div>
            <div>
              <h5 className="font-semibold mb-2">Produtos</h5>
              <p className="text-muted-foreground">4 tabelas</p>
            </div>
            <div>
              <h5 className="font-semibold mb-2">Propostas</h5>
              <p className="text-muted-foreground">1 tabela</p>
            </div>
            <div>
              <h5 className="font-semibold mb-2">Financeiro</h5>
              <p className="text-muted-foreground">8 tabelas</p>
            </div>
            <div>
              <h5 className="font-semibold mb-2">Tabelas Gerais</h5>
              <p className="text-muted-foreground">5 tabelas</p>
            </div>
            <div>
              <h5 className="font-semibold mb-2">Auditoria</h5>
              <p className="text-muted-foreground">2 tabelas</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Segurança */}
      <Card className="healthcare-card">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Shield className="h-5 w-5 text-primary" />
            Segurança
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <ul className="space-y-2 text-sm">
              <li className="flex items-center gap-2">
                <CheckCircle2 className="h-4 w-4 text-primary" />
                Hash de senhas com bcrypt
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle2 className="h-4 w-4 text-primary" />
                Autenticação JWT com httpOnly
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle2 className="h-4 w-4 text-primary" />
                Proteção contra força bruta
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle2 className="h-4 w-4 text-primary" />
                Logs de auditoria completos
              </li>
            </ul>
            <ul className="space-y-2 text-sm">
              <li className="flex items-center gap-2">
                <CheckCircle2 className="h-4 w-4 text-primary" />
                Validação de dados em APIs
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle2 className="h-4 w-4 text-primary" />
                Sanitização de inputs
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle2 className="h-4 w-4 text-primary" />
                CORS configurado
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle2 className="h-4 w-4 text-primary" />
                Rate limiting
              </li>
            </ul>
          </div>
        </CardContent>
      </Card>

      {/* Suporte */}
      <Card className="healthcare-card">
        <CardHeader>
          <CardTitle>Suporte</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2 text-sm">
            <p>
              <strong>Email:</strong> suporte@talenthealth.com.br
            </p>
            <p>
              <strong>Telefone:</strong> (11) 1234-5678
            </p>
            <p className="text-muted-foreground mt-4">Desenvolvido com ❤️ pela equipe Talent Health</p>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
