# CardBrazil CRM - Sistema de Gestão de Saúde

Sistema completo de gestão para operadoras de saúde, administradoras de benefícios e corretoras, desenvolvido com Next.js 15, React 19, TypeScript e Neon PostgreSQL.

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
- **Neon PostgreSQL** - Banco de dados serverless
- **@neondatabase/serverless** - Driver PostgreSQL para Neon
- **bcryptjs** - Hash de senhas
- **jsonwebtoken** - Autenticação JWT

### Integrações
- **ViaCEP** - Busca de endereços
- **Brasil API** - Dados de bancos (Bacen)
- **AwesomeAPI** - Cotações de moedas

## 📦 Instalação

### Pré-requisitos
- Node.js 18+ 
- Conta Neon (PostgreSQL serverless) - https://neon.tech
- npm ou yarn

### Passo 1: Clonar o Repositório
```bash
git clone https://github.com/seu-usuario/cardbrazil-crm.git
cd cardbrazil-crm
```

### Passo 2: Instalar Dependências
```bash
npm install
```

### Passo 3: Configurar Banco de Dados

1. Crie uma conta no Neon (https://neon.tech)
2. Crie um novo projeto
3. Copie a connection string fornecida
4. As tabelas já foram criadas automaticamente via migrations do Neon

**Dados já inseridos no banco:**
- Administradora CardBrazil (ID: 1)
- Usuário admin (email: admin@cardbrazil.com.br, senha: admin123)
- Pessoas de teste (João Silva, Maria Santos, Empresa Teste)
- Operadora Unimed Saúde
- 2 Planos (Ambulatorial e Hospitalar)
- 3 Produtos com faixas etárias

### Passo 4: Configurar Variáveis de Ambiente

Crie um arquivo `.env` na raiz do projeto:

```env
# Ambiente (development, homologation, production)
NODE_ENV=development

# Database Neon PostgreSQL
DATABASE_URL=postgresql://user:password@host.neon.tech/database?sslmode=require

# JWT
JWT_SECRET=sua_chave_secreta_super_segura
JWT_EXPIRES_IN=24h

# API
NEXT_PUBLIC_API_URL=http://localhost:3000
```

### Passo 5: Executar o Projeto

```bash
# Desenvolvimento
npm run dev

# Build de produção
npm run build

# Iniciar produção
npm start
```

### Passo 6: Acessar o Sistema

```
URL: http://localhost:3000
Email: admin@cardbrazil.com.br
Senha: admin123
```

## 👥 Usuários de Teste

| Email | Senha | Tipo | Descrição |
|-------|-------|------|-----------|
| admin@cardbrazil.com.br | admin123 | admin | Acesso total ao sistema |

## 🗄️ Estrutura do Banco de Dados

### Tabelas Criadas no Neon (13 tabelas principais)
- **Administração**: administradoras, usuarios
- **Pessoas**: pessoas, enderecos, dados_bancarios
- **Operadoras**: operadoras, estipulantes
- **Intermediários**: corretores, agenciadores
- **Produtos**: planos, produtos, contratos, beneficiarios

### Multi-Tenant
Todas as tabelas incluem `administradora_id` para isolamento de dados entre administradoras.

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

```bash
# Executar testes (quando implementados)
npm test

# Cobertura de testes
npm run test:coverage
```

## 📈 Performance

- Lazy loading de componentes
- Skeleton screens durante carregamento
- Debounce em buscas
- Memoização de componentes pesados
- Otimização de imagens
- Code splitting automático (Next.js)

## 🌐 Deploy

### Vercel (Recomendado)
```bash
vercel deploy
```

### Docker
```bash
docker build -t cardbrazil-crm .
docker run -p 3000:3000 cardbrazil-crm
```

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

**Versão:** 3.0.0 (Neon PostgreSQL)  
**Última atualização:** Janeiro 2025
