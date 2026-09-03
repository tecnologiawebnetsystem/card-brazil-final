import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import Link from "next/link"

export default function WikiPage() {
  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b bg-card">
        <div className="container mx-auto px-4 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center">
                <svg className="w-6 h-6 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"
                  />
                </svg>
              </div>
              <div>
                <h1 className="text-3xl font-bold text-primary">Wiki CardBrazil</h1>
                <p className="text-muted-foreground">Guia completo do sistema de gestão de saúde</p>
              </div>
            </div>
            <Link href="/">
              <Button variant="outline">Voltar ao Login</Button>
            </Link>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        {/* Introdução */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="text-2xl">O que é o CRM CardBrazil?</CardTitle>
            <CardDescription>Sistema completo de gestão para administradoras de seguro de saúde</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-lg leading-relaxed">
              O <strong>CRM CardBrazil</strong> é uma plataforma integrada desenvolvida especificamente para
              administradoras de seguro de saúde, oferecendo controle total sobre operações, compliance regulamentário e
              gestão financeira.
            </p>
            <div className="grid md:grid-cols-3 gap-4">
              <div className="p-4 bg-primary/5 rounded-lg">
                <h4 className="font-semibold text-primary mb-2">Gestão Completa</h4>
                <p className="text-sm text-muted-foreground">
                  Controle de segurados, contratos, sinistros e pagamentos em uma única plataforma
                </p>
              </div>
              <div className="p-4 bg-primary/5 rounded-lg">
                <h4 className="font-semibold text-primary mb-2">Compliance ANS</h4>
                <p className="text-sm text-muted-foreground">
                  Relatórios obrigatórios e integração direta com sistemas da Agência Nacional de Saúde
                </p>
              </div>
              <div className="p-4 bg-primary/5 rounded-lg">
                <h4 className="font-semibold text-primary mb-2">Financeiro Avançado</h4>
                <p className="text-sm text-muted-foreground">
                  Conciliação bancária, reservas técnicas e gestão de inadimplência automatizada
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Módulos do Sistema */}
        <div className="space-y-8">
          {/* Principal */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Badge variant="secondary">Principal</Badge>
                Módulos Essenciais
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid md:grid-cols-2 gap-6">
                <div className="space-y-3">
                  <h4 className="font-semibold text-lg">📊 Dashboard</h4>
                  <p className="text-muted-foreground">
                    Visão geral em tempo real com métricas de segurados ativos, receitas, sinistros e inadimplência.
                    Inclui gráficos interativos de performance e indicadores de saúde financeira da operação.
                  </p>
                </div>
                <div className="space-y-3">
                  <h4 className="font-semibold text-lg">👥 Segurados</h4>
                  <p className="text-muted-foreground">
                    Gestão completa da base de segurados com histórico médico, dependentes, planos contratados e
                    controle de carências. Permite cadastro, edição e acompanhamento de utilização de serviços.
                  </p>
                </div>
                <div className="space-y-3">
                  <h4 className="font-semibold text-lg">🏥 Sinistros</h4>
                  <p className="text-muted-foreground">
                    Controle de sinistros médicos com registro de procedimentos, valores, prestadores e status de
                    aprovação. Inclui workflow de auditoria e análise de custos por especialidade.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Cadastros */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Badge variant="secondary">Cadastros</Badge>
                Entidades do Sistema
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid md:grid-cols-2 gap-6">
                <div className="space-y-3">
                  <h4 className="font-semibold text-lg">🏢 Operadora</h4>
                  <p className="text-muted-foreground">
                    Cadastro e gestão de operadoras de saúde parceiras, incluindo dados de registro ANS, especialidades
                    cobertas e acordos comerciais.
                  </p>
                </div>
                <div className="space-y-3">
                  <h4 className="font-semibold text-lg">🤝 Estipulante</h4>
                  <p className="text-muted-foreground">
                    Gestão de empresas estipulantes que contratam seguros coletivos, com controle de contratos, número
                    de vidas e condições comerciais específicas.
                  </p>
                </div>
                <div className="space-y-3">
                  <h4 className="font-semibold text-lg">🏪 Subestipulante</h4>
                  <p className="text-muted-foreground">
                    Controle de filiais ou departamentos vinculados aos estipulantes principais, permitindo gestão
                    descentralizada de grupos menores.
                  </p>
                </div>
                <div className="space-y-3">
                  <h4 className="font-semibold text-lg">📋 Planos</h4>
                  <p className="text-muted-foreground">
                    Cadastro de produtos de saúde com definição de coberturas, valores, carências e regras específicas
                    por faixa etária e região.
                  </p>
                </div>
                <div className="space-y-3">
                  <h4 className="font-semibold text-lg">💼 Corretor</h4>
                  <p className="text-muted-foreground">
                    Gestão de corretores de seguros com controle de SUSEP, comissões, territórios de atuação e
                    performance de vendas.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Contratos & Apólices */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Badge variant="secondary">Contratos</Badge>
                Gestão Contratual
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid md:grid-cols-2 gap-6">
                <div className="space-y-3">
                  <h4 className="font-semibold text-lg">📄 Contratos</h4>
                  <p className="text-muted-foreground">
                    Sistema de versionamento automático de contratos com histórico de alterações, controle de vigência e
                    gestão de renovações programadas.
                  </p>
                </div>
                <div className="space-y-3">
                  <h4 className="font-semibold text-lg">💰 Cálculo de Prêmios</h4>
                  <p className="text-muted-foreground">
                    Cálculo automático de prêmios baseado em faixas etárias, sinistralidade histórica e fatores de
                    risco, com simulações e cenários personalizados.
                  </p>
                </div>
                <div className="space-y-3">
                  <h4 className="font-semibold text-lg">🔄 Renovações</h4>
                  <p className="text-muted-foreground">
                    Gestão automática de renovações contratuais com alertas de vencimento, cálculo de reajustes e
                    workflow de aprovação.
                  </p>
                </div>
                <div className="space-y-3">
                  <h4 className="font-semibold text-lg">⏰ Carências</h4>
                  <p className="text-muted-foreground">
                    Controle detalhado de períodos de carência por procedimento e segurado, com alertas automáticos e
                    liberação programada de coberturas.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Financeiro */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Badge variant="secondary">Financeiro</Badge>
                Gestão Financeira Completa
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid md:grid-cols-2 gap-6">
                <div className="space-y-3">
                  <h4 className="font-semibold text-lg">💳 Pagamentos</h4>
                  <p className="text-muted-foreground">
                    Controle de recebimentos com integração bancária, baixa automática e gestão de inadimplência com
                    workflows personalizados.
                  </p>
                </div>
                <div className="space-y-3">
                  <h4 className="font-semibold text-lg">📊 Relatórios</h4>
                  <p className="text-muted-foreground">
                    Geração automática de relatórios gerenciais, financeiros e operacionais com exportação em múltiplos
                    formatos e agendamento.
                  </p>
                </div>
                <div className="space-y-3">
                  <h4 className="font-semibold text-lg">📋 Cobrança</h4>
                  <p className="text-muted-foreground">
                    Sistema automatizado de cobrança com múltiplos canais (email, SMS, WhatsApp) e escalação progressiva
                    de ações de recuperação.
                  </p>
                </div>
                <div className="space-y-3">
                  <h4 className="font-semibold text-lg">🏦 Conciliação Bancária</h4>
                  <p className="text-muted-foreground">
                    Conciliação automática de extratos bancários com identificação de divergências e sugestões de
                    ajustes para fechamento contábil.
                  </p>
                </div>
                <div className="space-y-3">
                  <h4 className="font-semibold text-lg">💹 Fluxo de Caixa</h4>
                  <p className="text-muted-foreground">
                    Projeções financeiras com análise de receitas e despesas, cenários de crescimento e alertas de
                    liquidez.
                  </p>
                </div>
                <div className="space-y-3">
                  <h4 className="font-semibold text-lg">📤 Remessa Bancária</h4>
                  <p className="text-muted-foreground">
                    Geração automática de arquivos CNAB para cobrança bancária com configuração por banco e
                    acompanhamento de status.
                  </p>
                </div>
                <div className="space-y-3">
                  <h4 className="font-semibold text-lg">📥 Retorno Bancário</h4>
                  <p className="text-muted-foreground">
                    Processamento de arquivos de retorno bancário com baixa automática de pagamentos e tratamento de
                    rejeições.
                  </p>
                </div>
                <div className="space-y-3">
                  <h4 className="font-semibold text-lg">⚠️ Inadimplência</h4>
                  <p className="text-muted-foreground">
                    Gestão completa de inadimplência com workflows automatizados, negociação assistida e controle de
                    acordos de pagamento.
                  </p>
                </div>
                <div className="space-y-3">
                  <h4 className="font-semibold text-lg">🛡️ Reservas Técnicas</h4>
                  <p className="text-muted-foreground">
                    Cálculo atuarial de reservas técnicas conforme normas ANS, com projeções de sinistros e análise de
                    solvência.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Compliance */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Badge variant="secondary">Compliance</Badge>
                Regulamentação ANS
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid md:grid-cols-2 gap-6">
                <div className="space-y-3">
                  <h4 className="font-semibold text-lg">🏛️ Integração ANS</h4>
                  <p className="text-muted-foreground">
                    Conexão direta com sistemas da ANS para envio automático de dados e acompanhamento de status de
                    transmissão em tempo real.
                  </p>
                </div>
                <div className="space-y-3">
                  <h4 className="font-semibold text-lg">📋 Relatórios Obrigatórios</h4>
                  <p className="text-muted-foreground">
                    Geração automática de RIP, SIB, DIOPS e FIP com validação de dados e envio programado dentro dos
                    prazos regulamentares.
                  </p>
                </div>
                <div className="space-y-3">
                  <h4 className="font-semibold text-lg">📅 Prazos Regulamentares</h4>
                  <p className="text-muted-foreground">
                    Controle de calendário regulamentar com alertas automáticos, workflow de aprovação e histórico de
                    cumprimento de obrigações.
                  </p>
                </div>
                <div className="space-y-3">
                  <h4 className="font-semibold text-lg">🔍 Auditoria</h4>
                  <p className="text-muted-foreground">
                    Sistema de auditoria interna e externa com trilha de auditoria completa, gestão de não conformidades
                    e planos de ação corretiva.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Sistema */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Badge variant="secondary">Sistema</Badge>
                Administração e Suporte
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid md:grid-cols-2 gap-6">
                <div className="space-y-3">
                  <h4 className="font-semibold text-lg">⚙️ Configurações</h4>
                  <p className="text-muted-foreground">
                    Configurações gerais do sistema incluindo dados da empresa, perfis de usuário, alçadas de aprovação
                    e parâmetros operacionais personalizáveis.
                  </p>
                </div>
                <div className="space-y-3">
                  <h4 className="font-semibold text-lg">🔔 Notificações</h4>
                  <p className="text-muted-foreground">
                    Central de notificações com alertas personalizados, lembretes automáticos e comunicação integrada
                    via email, SMS e push notifications.
                  </p>
                </div>
                <div className="space-y-3">
                  <h4 className="font-semibold text-lg">❓ Ajuda</h4>
                  <p className="text-muted-foreground">
                    Central de ajuda com FAQ, tutoriais interativos, documentação técnica e canais de suporte direto com
                    a equipe CardBrazil.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Footer da Wiki */}
        <Card className="mt-8 bg-primary/5">
          <CardContent className="p-6 text-center">
            <h3 className="text-xl font-semibold mb-2">Precisa de mais informações?</h3>
            <p className="text-muted-foreground mb-4">
              Nossa equipe está pronta para ajudar você a aproveitar ao máximo o CRM CardBrazil
            </p>
            <div className="flex justify-center gap-4">
              <Link href="/">
                <Button>Acessar Sistema</Button>
              </Link>
              <Button variant="outline">Contatar Suporte</Button>
            </div>
          </CardContent>
        </Card>
      </main>
    </div>
  )
}
