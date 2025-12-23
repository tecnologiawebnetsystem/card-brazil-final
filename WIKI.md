# CardBrazil CRM - Wiki do Projeto

## Visão Geral
Sistema completo de gestão para operadoras de saúde, administradoras de benefícios e corretoras, desenvolvido com Next.js 15, React 19, TypeScript e MySQL. O sistema oferece suporte multi-tenant, autenticação segura, CRUD completo e integrações externas.

## Esquema de Cores

### Paleta Principal
O projeto utiliza uma paleta de cores suaves inspirada em tons de turquesa e cinzas neutros, criando uma interface moderna e profissional adequada para o setor de saúde.

#### Cores Primárias
- **Primary**: `#22d3ee` (Turquesa principal)
- **Secondary**: `#67e8f9` (Turquesa claro)
- **Accent**: `#06b6d4` (Ciano médio)

#### Cores Neutras
- **Background**: `#f8fafb` (Cinza muito claro)
- **Foreground**: `#475569` (Cinza escuro suave)
- **Card**: `#ffffff` (Branco)
- **Muted**: `#f1f5f9` (Cinza neutro suave)
- **Border**: `#e2e8f0` (Borda cinza suave)

#### Cores Semânticas
- **Success**: `#22d3ee` (Turquesa para sucesso)
- **Warning**: `#fbbf24` (Amarelo suave)
- **Destructive**: `#f87171` (Coral suave)
- **Info**: `#67e8f9` (Turquesa claro para informações)

#### Cores para Gráficos
- **Chart 1**: `#22d3ee` (Turquesa principal)
- **Chart 2**: `#67e8f9` (Turquesa claro)
- **Chart 3**: `#06b6d4` (Ciano)
- **Chart 4**: `#a7f3d0` (Verde suave)
- **Chart 5**: `#f87171` (Coral suave)

### Modo Escuro
O sistema possui suporte completo ao modo escuro com adaptações das cores principais:
- **Background**: `#0f172a` (Azul escuro profundo)
- **Card**: `#1e293b` (Azul escuro médio)
- **Primary**: `#67e8f9` (Turquesa mais claro no escuro)

## Módulos do Sistema

### 1. Cadastros
- **Pessoas** - Gestão de pessoas físicas e jurídicas com endereços e dados bancários múltiplos
- **Operadoras** - Cadastro de operadoras de saúde
- **Administradoras** - Gestão de administradoras de benefícios
- **Estipulantes** - Cadastro de estipulantes e subestipulantes
- **Corretores** - Gestão de corretores
- **Agenciadores** - Cadastro de agenciadores
- **Planos e Produtos** - Gestão de planos de saúde e produtos
- **Convênios** - Cadastro de convênios

### 2. Propostas
- **Nova Proposta** - Formulário completo para criação de propostas
- **Lista de Propostas** - Visualização e gestão de todas as propostas
- **Propostas Pendentes** - Propostas aguardando análise
- **Análise de Propostas** - Análise individual detalhada
- **Aprovação de Propostas** - Aprovação em lote
- **Propostas Aprovadas** - Gestão de propostas aprovadas
- **Relatórios** - Relatórios completos de propostas

### 3. Beneficiários
- **Beneficiário Titular** - CRUD completo de titulares
- **Dependentes** - Gestão de dependentes vinculados
- **Consulta** - Consulta unificada de beneficiários e dependentes
- **Carteirinhas** - Geração de carteirinhas digitais

### 4. Financeiro
- **Contas a Receber** - Gestão de recebíveis com filtros avançados
- **Contas a Pagar** - Gestão de pagamentos, restituições e reembolsos
- **Fluxo de Caixa** - Visualização integrada de entradas e saídas
- **Cobrança Judicial** - Gestão de processos judiciais com advogados e tribunais
- **Multas e Juros** - Configuração com geração de PIX/QR Code

### 5. Cobrança
- **Geração de Boletos** - Geração com QR Code
- **Consulta de Boletos** - Gestão e consulta
- **Negociação de Débitos** - Acordos de pagamento
- **Histórico de Pagamentos** - Histórico completo
- **Conciliação Bancária** - Conciliação automática
- **Inadimplência** - Controle de inadimplentes
- **Arquivos de Remessa** - Gestão de arquivos bancários

### 6. Tabelas Gerais
- **CEP** - Busca via ViaCEP (por CEP ou endereço)
- **Bancos** - Cadastro com sincronização automática via Bacen
- **Moedas** - Cotações atualizadas via AwesomeAPI
- **Feriados** - Gestão de feriados nacionais, estaduais e municipais

### 7. Sistema Contábil
- **Plano de Contas** - Estrutura contábil completa
- **Lançamentos Contábeis** - Registro de lançamentos
- **Balancetes e DRE** - Relatórios contábeis
- **Provisões Técnicas** - Conformidade ANS
- **Balanço Patrimonial** - Demonstrações financeiras
- **Razão e Diário** - Livros contábeis

### 8. Configurações
- **Usuários** - Gestão de usuários do sistema
- **Perfis de Acesso** - Controle de permissões
- **Configurações de Email/SMS** - Notificações
- **Personalização** - Temas e preferências
- **Logs de Auditoria** - Rastreamento de ações

## Estrutura do Projeto

### Tecnologias Utilizadas

#### Front-end
- **Next.js 15** - Framework React com App Router
- **React 19** - Biblioteca UI
- **TypeScript 5** - Tipagem estática
- **Tailwind CSS 4** - Framework CSS utilitário
- **Radix UI** - Componentes acessíveis
- **Recharts** - Gráficos interativos
- **React Hook Form + Zod** - Formulários e validação
- **date-fns** - Manipulação de datas
- **Lucide React** - Ícones

#### Back-end
- **Next.js API Routes** - Endpoints REST
- **MySQL 8** - Banco de dados relacional
- **mysql2** - Driver MySQL para Node.js
- **bcryptjs** - Hash de senhas
- **jsonwebtoken** - Autenticação JWT

#### Integrações Externas
- **ViaCEP** - Busca de endereços
- **Brasil API** - Dados de bancos (Bacen)
- **AwesomeAPI** - Cotações de moedas

### Componentes Principais

#### Navegação
- **AppSidebar** - Menu lateral hierárquico com expansão/colapso
- **Breadcrumbs** - Navegação contextual automática
- **GlobalSearch** - Busca global com atalho Ctrl+K
- **KeyboardShortcuts** - Atalhos de teclado para ações rápidas

#### Feedback Visual
- **SkeletonScreens** - Loading states elegantes
- **ProgressBars** - Indicadores de progresso
- **AnimatedCounters** - Contadores animados para métricas
- **EmptyStates** - Estados vazios informativos
- **Toasts** - Notificações de feedback

#### Formulários
- **InputMasks** - Máscaras para CPF, CNPJ, telefone, CEP, data, moeda
- **RealTimeValidation** - Validação em tempo real
- **Autocomplete** - Sugestões automáticas
- **ConditionalFields** - Campos condicionais baseados em contexto

#### Tabelas
- **DataTable** - Tabelas com paginação, ordenação e busca
- **AdvancedFilters** - Filtros avançados por múltiplos campos
- **BulkActions** - Ações em lote
- **ExportCSV** - Exportação de dados

#### Dashboard
- **StatCards** - Cards de estatísticas animados
- **InteractiveCharts** - Gráficos interativos com Recharts
- **DateRangePicker** - Seletor de período
- **QuickActions** - Ações rápidas contextuais
- **RecentActivity** - Feed de atividades recentes

## Funcionalidades Avançadas

### Multi-Tenant
- Isolamento completo de dados por administradora
- Campo `id_administradora` em todas as tabelas
- Filtros automáticos por contexto do usuário

### Autenticação e Segurança
- Hash de senhas com bcrypt (10 rounds)
- Tokens JWT com httpOnly cookies
- Proteção contra força bruta (5 tentativas)
- Logs de auditoria completos
- Validação de dados em todas as APIs
- Sanitização de inputs
- CORS configurado
- Rate limiting

### Acessibilidade (WCAG AA)
- Navegação completa por teclado
- ARIA labels em todos os componentes
- Contraste adequado de cores
- Screen reader support
- Focus trap em modais
- Skip links para navegação rápida

### Performance
- Lazy loading de componentes
- Code splitting automático
- Debounce em buscas (300ms)
- Memoização de componentes pesados
- Otimização de imagens
- Cache de requisições

## Banco de Dados

### Estrutura (39 Tabelas)

#### Administração
- administradoras
- usuarios
- perfis
- roles
- permissoes
- logs_autenticacao
- logs_auditoria

#### Pessoas e Endereços
- pessoas
- enderecos
- dados_bancarios

#### Operadoras e Intermediários
- operadoras
- estipulantes
- subestipulantes
- corretores
- agenciadores

#### Produtos e Contratos
- planos
- produtos
- contratos
- beneficiarios

#### Propostas
- propostas

#### Financeiro
- contas_receber
- contas_pagar
- fluxo_caixa
- advogados
- tribunais
- processos_judiciais
- configuracoes_multas_juros
- historico_multas_juros

#### Tabelas Gerais
- bancos
- agencias_bancarias
- moedas
- historico_cotacoes
- feriados

### Padrões de Desenvolvimento

#### Nomenclatura
- Arquivos: kebab-case (`user-profile.tsx`)
- Componentes: PascalCase (`UserProfile`)
- Funções: camelCase (`getUserData`)
- Constantes: UPPER_SNAKE_CASE (`API_BASE_URL`)

#### Estrutura de Componentes
- Separação clara entre páginas e componentes
- Reutilização máxima de componentes UI
- Props tipadas com TypeScript
- Documentação inline com JSDoc

#### Estilização
- Classes utilitárias do Tailwind
- Variáveis CSS customizadas para cores
- Componentes com classes específicas para healthcare
- Responsive design mobile-first

## APIs REST

### Autenticação
- `POST /api/auth/login` - Login com email/senha
- `POST /api/auth/logout` - Logout e invalidação de token

### Cadastros
- `GET/POST /api/pessoas` - Listar/Criar pessoas
- `GET/PUT/DELETE /api/pessoas/[id]` - Buscar/Atualizar/Deletar
- `GET/POST /api/operadoras` - Operadoras
- `GET/POST /api/planos` - Planos
- `GET/POST /api/produtos` - Produtos

### Propostas
- `GET/POST /api/propostas` - Listar/Criar propostas
- `GET/PUT/DELETE /api/propostas/[id]` - Buscar/Atualizar/Deletar

### Beneficiários
- `GET/POST /api/beneficiarios` - Listar/Criar beneficiários
- `GET /api/beneficiarios/titular/[id]/dependentes` - Dependentes

### Financeiro
- `GET/POST /api/financeiro/contas-receber` - Contas a receber
- `GET/POST /api/financeiro/contas-pagar` - Contas a pagar
- `GET/POST /api/financeiro/fluxo-caixa` - Fluxo de caixa
- `GET/POST /api/financeiro/processos-judiciais` - Cobrança judicial
- `GET/POST /api/financeiro/multas-juros/configuracoes` - Multas e juros
- `POST /api/financeiro/multas-juros/calcular` - Calcular multas e juros

### Tabelas Gerais
- `GET /api/cep/[cep]` - Buscar CEP (ViaCEP)
- `POST /api/cep/buscar` - Buscar por endereço
- `POST /api/bancos/atualizar-bacen` - Sincronizar bancos
- `POST /api/moedas/atualizar-cotacoes` - Atualizar cotações

### Documentação Swagger
Acesse a documentação completa da API em: `http://localhost:3000/api/swagger`

## Instalação e Configuração

### Pré-requisitos
- Node.js 18+
- MySQL 8+
- npm ou yarn

### Passos de Instalação

1. **Clonar o repositório**
\`\`\`bash
git clone https://github.com/seu-usuario/cardbrazil-crm.git
cd cardbrazil-crm
\`\`\`

2. **Instalar dependências**
\`\`\`bash
npm install
\`\`\`

3. **Configurar banco de dados**
\`\`\`sql
CREATE DATABASE cardbrazil CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
\`\`\`

4. **Executar DDLs** (em ordem numérica 00 a 09)
5. **Executar DMLs** (em ordem numérica 01 a 17)

6. **Configurar variáveis de ambiente** (`.env`)
\`\`\`env
NODE_ENV=development
DB_HOST=localhost
DB_PORT=3306
DB_USER=root
DB_PASSWORD=sua_senha
DB_NAME=cardbrazil
JWT_SECRET=sua_chave_secreta
JWT_EXPIRES_IN=24h
NEXT_PUBLIC_API_URL=http://localhost:3000
\`\`\`

7. **Executar o projeto**
\`\`\`bash
npm run dev
\`\`\`

8. **Acessar o sistema**
\`\`\`
URL: http://localhost:3000
Login: admin
Senha: admin123
\`\`\`

## Usuários de Teste

| Login | Senha | Perfil | Descrição |
|-------|-------|--------|-----------|
| admin | admin123 | Administrador | Acesso total |
| donizete | admin123 | Administrador | Acesso total |
| kleber | admin123 | Administrador | Acesso total |
| cad | cad123 | Cadastro | Acesso a cadastros |
| prop | prop123 | Propostas | Acesso a propostas |

## Deploy

### Vercel (Recomendado)
\`\`\`bash
vercel deploy
\`\`\`

### Docker
\`\`\`bash
docker build -t cardbrazil-crm .
docker run -p 3000:3000 cardbrazil-crm
\`\`\`

## Atualizações Recentes

### Janeiro 2025
- Implementação completa do módulo Financeiro
- Integração com ViaCEP, Brasil API e AwesomeAPI
- Sistema de beneficiários com titulares e dependentes
- Tabelas gerais (CEP, Bancos, Moedas, Feriados)
- Melhorias de UX/UI com componentes modernos
- Documentação Swagger completa
- Correções de build e otimizações

## Roadmap

- [ ] Testes unitários e E2E
- [ ] CI/CD com GitHub Actions
- [ ] Monitoramento com Sentry
- [ ] Cache Redis
- [ ] Notificações push
- [ ] App mobile (React Native)
- [ ] Integração com WhatsApp Business
- [ ] BI e Analytics avançado

## Suporte

Para suporte, entre em contato:
- Email: suporte@cardbrazil.com.br
- Telefone: (11) 1234-5678

---

**Desenvolvido com ❤️ pela equipe CardBrazil**

**Versão:** 2.0.0  
**Última atualização:** Janeiro 2025
