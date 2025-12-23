# CardBrazil CRM - Sistema de Gestão de Saúde

Sistema completo de gestão para operadoras de saúde, administradoras de benefícios e corretoras, desenvolvido com Next.js 15, React 19, TypeScript e MySQL.

## 🚀 Características Principais

- **Multi-tenant** - Suporte completo para múltiplas administradoras
- **Autenticação Segura** - Sistema de login com JWT e controle de sessões
- **CRUD Completo** - Gestão de pessoas, operadoras, planos, propostas, beneficiários e financeiro
- **Integrações Externas** - ViaCEP, Brasil API (Bacen), AwesomeAPI (Cotações)
- **Dashboard Interativo** - Métricas em tempo real, gráficos e ações rápidas
- **UX/UI Moderna** - Componentes responsivos, acessíveis e com feedback visual
- **Documentação Swagger** - API REST totalmente documentada

## 📋 Módulos do Sistema

### 1. Cadastros
- Pessoas (PF/PJ) com endereços e dados bancários múltiplos
- Operadoras de saúde
- Administradoras de benefícios
- Estipulantes e subestipulantes
- Corretores e agenciadores
- Planos e produtos
- Convênios

### 2. Propostas
- Nova proposta com formulário completo
- Lista de propostas com filtros avançados
- Propostas pendentes de análise
- Análise e aprovação individual
- Aprovação em lote
- Propostas aprovadas
- Relatórios de propostas

### 3. Beneficiários
- Beneficiário titular com CRUD completo
- Dependentes vinculados ao titular
- Consulta unificada de beneficiários
- Carteirinhas digitais

### 4. Financeiro
- **Contas a Receber** - Gestão de recebíveis com filtros e métricas
- **Contas a Pagar** - Gestão de pagamentos, restituições e reembolsos
- **Fluxo de Caixa** - Visualização de entradas e saídas integrada
- **Cobrança Judicial** - Gestão de processos judiciais com advogados e tribunais
- **Multas e Juros** - Configuração com geração de PIX/QR Code

### 5. Cobrança
- Geração de boletos com QR Code
- Consulta e gestão de boletos
- Negociação de débitos
- Histórico de pagamentos
- Conciliação bancária
- Gestão de inadimplência
- Arquivos de remessa e retorno

### 6. Tabelas Gerais
- **CEP** - Busca via ViaCEP (por CEP ou endereço)
- **Bancos** - Cadastro com sincronização automática via Bacen
- **Moedas** - Cotações atualizadas via AwesomeAPI
- **Feriados** - Gestão de feriados nacionais, estaduais e municipais

### 7. Sistema Contábil
- Plano de contas
- Lançamentos contábeis
- Balancetes e DRE
- Provisões técnicas
- Balanço patrimonial
- Razão e diário contábil

### 8. Configurações
- Usuários e perfis de acesso
- Permissões granulares
- Configurações de email e SMS
- Personalização de temas
- Logs de segurança e auditoria

## 🛠️ Tecnologias Utilizadas

### Front-end
- **Next.js 15** - Framework React com App Router
- **React 19** - Biblioteca UI
- **TypeScript 5** - Tipagem estática
- **Tailwind CSS 4** - Framework CSS utilitário
- **Radix UI** - Componentes acessíveis
- **Recharts** - Gráficos interativos
- **React Hook Form + Zod** - Formulários e validação
- **date-fns** - Manipulação de datas
- **Lucide React** - Ícones

### Back-end
- **Next.js API Routes** - Endpoints REST
- **MySQL 8** - Banco de dados relacional
- **mysql2** - Driver MySQL para Node.js
- **bcryptjs** - Hash de senhas
- **jsonwebtoken** - Autenticação JWT

### Integrações
- **ViaCEP** - Busca de endereços
- **Brasil API** - Dados de bancos (Bacen)
- **AwesomeAPI** - Cotações de moedas

## 📦 Instalação

### Pré-requisitos
- Node.js 18+ 
- MySQL 8+
- npm ou yarn

### Passo 1: Clonar o Repositório
\`\`\`bash
git clone https://github.com/seu-usuario/cardbrazil-crm.git
cd cardbrazil-crm
\`\`\`

### Passo 2: Instalar Dependências
\`\`\`bash
npm install
\`\`\`

### Passo 3: Configurar Banco de Dados

1. Criar o banco de dados:
\`\`\`sql
CREATE DATABASE cardbrazil CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
\`\`\`

2. Executar DDLs (em ordem):
\`\`\`bash
mysql -u root -p cardbrazil < banco-dados/DDL/00_administradoras.sql
mysql -u root -p cardbrazil < banco-dados/DDL/01_usuarios_autenticacao.sql
mysql -u root -p cardbrazil < banco-dados/DDL/02_pessoas_enderecos_bancarios.sql
mysql -u root -p cardbrazil < banco-dados/DDL/03_operadoras_estipulantes.sql
mysql -u root -p cardbrazil < banco-dados/DDL/04_corretores_agenciadores.sql
mysql -u root -p cardbrazil < banco-dados/DDL/05_planos_produtos.sql
mysql -u root -p cardbrazil < banco-dados/DDL/06_financeiro_auditoria.sql
mysql -u root -p cardbrazil < banco-dados/DDL/07_propostas.sql
mysql -u root -p cardbrazil < banco-dados/DDL/08_tabelas_gerais.sql
mysql -u root -p cardbrazil < banco-dados/DDL/09_modulo_financeiro.sql
\`\`\`

3. Executar DMLs (dados de teste):
\`\`\`bash
mysql -u root -p cardbrazil < banco-dados/DML/01_administradora_inicial.sql
mysql -u root -p cardbrazil < banco-dados/DML/02_roles_iniciais.sql
mysql -u root -p cardbrazil < banco-dados/DML/03_usuarios_iniciais.sql
mysql -u root -p cardbrazil < banco-dados/DML/04_pessoas_teste.sql
mysql -u root -p cardbrazil < banco-dados/DML/05_operadoras_teste.sql
mysql -u root -p cardbrazil < banco-dados/DML/06_estipulantes_teste.sql
mysql -u root -p cardbrazil < banco-dados/DML/07_corretores_agenciadores_teste.sql
mysql -u root -p cardbrazil < banco-dados/DML/08_produtos_planos_teste.sql
mysql -u root -p cardbrazil < banco-dados/DML/09_bancos_brasileiros.sql
mysql -u root -p cardbrazil < banco-dados/DML/10_moedas_principais.sql
mysql -u root -p cardbrazil < banco-dados/DML/11_feriados_nacionais.sql
mysql -u root -p cardbrazil < banco-dados/DML/12_beneficiarios_teste.sql
mysql -u root -p cardbrazil < banco-dados/DML/13_contas_receber_teste.sql
mysql -u root -p cardbrazil < banco-dados/DML/14_contas_pagar_teste.sql
mysql -u root -p cardbrazil < banco-dados/DML/15_fluxo_caixa_teste.sql
mysql -u root -p cardbrazil < banco-dados/DML/16_cobranca_judicial_teste.sql
mysql -u root -p cardbrazil < banco-dados/DML/17_multas_juros_teste.sql
\`\`\`

### Passo 4: Configurar Variáveis de Ambiente

Crie um arquivo `.env` na raiz do projeto:

\`\`\`env
# Ambiente (development, homologation, production)
NODE_ENV=development

# Database Development
DB_HOST=localhost
DB_PORT=3306
DB_USER=root
DB_PASSWORD=sua_senha
DB_NAME=cardbrazil

# JWT
JWT_SECRET=sua_chave_secreta_super_segura
JWT_EXPIRES_IN=24h

# API
NEXT_PUBLIC_API_URL=http://localhost:3000
\`\`\`

### Passo 5: Executar o Projeto

\`\`\`bash
# Desenvolvimento
npm run dev

# Build de produção
npm run build

# Iniciar produção
npm start
\`\`\`

### Passo 6: Acessar o Sistema

\`\`\`
URL: http://localhost:3000
Login: admin
Senha: admin123
\`\`\`

## 👥 Usuários de Teste

| Login | Senha | Perfil | Descrição |
|-------|-------|--------|-----------|
| admin | admin123 | Administrador | Acesso total ao sistema |
| donizete | admin123 | Administrador | Acesso total ao sistema |
| kleber | admin123 | Administrador | Acesso total ao sistema |
| cad | cad123 | Cadastro | Acesso a cadastros |
| prop | prop123 | Propostas | Acesso a propostas |

## 📚 Documentação

### Swagger API
Acesse a documentação completa da API em:
\`\`\`
http://localhost:3000/api/swagger
\`\`\`

### Documentos Disponíveis
- `ANALISE_COMPLETA_FINAL.md` - Análise completa do sistema
- `BACKEND_SETUP.md` - Guia de configuração do back-end
- `CONFIGURACAO_AMBIENTE.md` - Configuração de ambientes
- `RELATORIO_INTEGRACAO.md` - Relatório de integração front-end/back-end
- `REVISAO_BUILD.md` - Checklist de build
- `ANALISE_DDL_DML_COMPLETA.md` - Análise de DDLs e DMLs

## 🗄️ Estrutura do Banco de Dados

### Tabelas Principais (39 tabelas)
- **Administração**: administradoras, usuarios, perfis, roles, permissoes
- **Pessoas**: pessoas, enderecos, dados_bancarios
- **Operadoras**: operadoras, estipulantes, subestipulantes
- **Intermediários**: corretores, agenciadores
- **Produtos**: planos, produtos, contratos, beneficiarios
- **Propostas**: propostas
- **Financeiro**: contas_receber, contas_pagar, fluxo_caixa, processos_judiciais, multas_juros
- **Tabelas Gerais**: bancos, agencias, moedas, cotacoes, feriados
- **Auditoria**: logs_autenticacao, logs_auditoria

### Multi-Tenant
Todas as tabelas incluem `id_administradora` para isolamento de dados entre administradoras.

## 🔒 Segurança

- Hash de senhas com bcrypt
- Autenticação JWT com tokens httpOnly
- Proteção contra força bruta (5 tentativas)
- Logs de auditoria completos
- Validação de dados em todas as APIs
- Sanitização de inputs
- CORS configurado
- Rate limiting

## 🎨 Componentes UX/UI

### Navegação
- Breadcrumbs dinâmicos
- Busca global (Ctrl+K)
- Atalhos de teclado
- Menu responsivo

### Feedback Visual
- Skeleton screens
- Loading overlays
- Progress bars
- Contadores animados
- Estados vazios
- Toasts de notificação

### Formulários
- Máscaras (CPF, CNPJ, telefone, CEP, data, moeda)
- Validação em tempo real
- Autocomplete
- Campos condicionais

### Tabelas
- Paginação
- Ordenação
- Busca integrada
- Filtros avançados
- Exportação (CSV)

### Dashboard
- Cards de estatísticas animados
- Gráficos interativos
- Seletor de período
- Ações rápidas
- Atividades recentes

### Acessibilidade
- Navegação por teclado
- ARIA labels
- Contraste WCAG AA
- Screen reader support
- Focus trap em modais

## 📊 APIs REST

### Endpoints Principais

#### Autenticação
- `POST /api/auth/login` - Login
- `POST /api/auth/logout` - Logout

#### Cadastros
- `GET/POST /api/pessoas` - Listar/Criar pessoas
- `GET/PUT/DELETE /api/pessoas/[id]` - Buscar/Atualizar/Deletar
- `GET/POST /api/operadoras` - Operadoras
- `GET/POST /api/planos` - Planos
- `GET/POST /api/produtos` - Produtos

#### Propostas
- `GET/POST /api/propostas` - Listar/Criar propostas
- `GET/PUT/DELETE /api/propostas/[id]` - Buscar/Atualizar/Deletar

#### Beneficiários
- `GET/POST /api/beneficiarios` - Listar/Criar beneficiários
- `GET /api/beneficiarios/titular/[id]/dependentes` - Dependentes

#### Financeiro
- `GET/POST /api/financeiro/contas-receber` - Contas a receber
- `GET/POST /api/financeiro/contas-pagar` - Contas a pagar
- `GET/POST /api/financeiro/fluxo-caixa` - Fluxo de caixa
- `GET/POST /api/financeiro/processos-judiciais` - Cobrança judicial
- `GET/POST /api/financeiro/multas-juros/configuracoes` - Multas e juros

#### Tabelas Gerais
- `GET /api/cep/[cep]` - Buscar CEP (ViaCEP)
- `POST /api/bancos/atualizar-bacen` - Sincronizar bancos
- `POST /api/moedas/atualizar-cotacoes` - Atualizar cotações

## 🧪 Testes

\`\`\`bash
# Executar testes (quando implementados)
npm test

# Cobertura de testes
npm run test:coverage
\`\`\`

## 📈 Performance

- Lazy loading de componentes
- Skeleton screens durante carregamento
- Debounce em buscas
- Memoização de componentes pesados
- Otimização de imagens
- Code splitting automático (Next.js)

## 🌐 Deploy

### Vercel (Recomendado)
\`\`\`bash
vercel deploy
\`\`\`

### Docker
\`\`\`bash
docker build -t cardbrazil-crm .
docker run -p 3000:3000 cardbrazil-crm
\`\`\`

## 🤝 Contribuindo

1. Fork o projeto
2. Crie uma branch para sua feature (`git checkout -b feature/AmazingFeature`)
3. Commit suas mudanças (`git commit -m 'Add some AmazingFeature'`)
4. Push para a branch (`git push origin feature/AmazingFeature`)
5. Abra um Pull Request

## 📝 Licença

Este projeto é proprietário da CardBrazil.

## 📞 Suporte

Para suporte, entre em contato:
- Email: suporte@cardbrazil.com.br
- Telefone: (11) 1234-5678

## 🎯 Roadmap

- [ ] Testes unitários e E2E
- [ ] CI/CD com GitHub Actions
- [ ] Monitoramento com Sentry
- [ ] Cache Redis
- [ ] Notificações push
- [ ] App mobile (React Native)
- [ ] Integração com WhatsApp Business
- [ ] BI e Analytics avançado

---

**Desenvolvido com ❤️ pela equipe CardBrazil**

**Versão:** 2.0.0  
**Última atualização:** Janeiro 2025
