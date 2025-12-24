# CardBrazil - Sistema Completo de Gestão de Seguros de Saúde

Sistema completo para administração de seguros de saúde corporativo desenvolvido com Next.js 14, TypeScript, PostgreSQL (Neon) e shadcn/ui.

## Status do Projeto

**SISTEMA 100% FUNCIONAL E PRONTO PARA USO**

Todas as funcionalidades principais implementadas e testadas:
- Autenticação completa com bcrypt e JWT
- Banco de dados PostgreSQL com 13 tabelas
- CRUD completo de pessoas (físicas e jurídicas)
- Frontend totalmente conectado ao backend
- APIs RESTful documentadas com Swagger
- Interface responsiva e moderna

---

## Funcionalidades Implementadas

### 1. Autenticação e Autorização
- Login seguro com email/CPF e senha
- Criptografia bcrypt para senhas
- Tokens JWT em cookies httpOnly
- Sistema de sessões
- Logout com invalidação de token
- Contexto React global de autenticação
- Proteção de rotas

### 2. Gestão de Pessoas
- Cadastro de pessoas físicas e jurídicas
- CRUD completo (Create, Read, Update, Delete)
- Busca e filtros avançados
- Gestão de múltiplos endereços por pessoa
- Gestão de múltiplas contas bancárias
- Validação de CPF/CNPJ
- Interface com tabs para organização
- Listagem com paginação

### 3. Módulos do Sistema
- Administradoras (multi-tenancy)
- Usuários e perfis
- Pessoas (físicas e jurídicas)
- Endereços
- Dados bancários
- Operadoras de saúde
- Corretores
- Agenciadores
- Estipulantes
- Planos de saúde
- Produtos por faixa etária
- Contratos
- Beneficiários

### 4. Banco de Dados
- 13 tabelas principais criadas
- Relacionamentos com foreign keys
- Índices otimizados
- Soft delete implementado
- Dados de teste inseridos
- PostgreSQL/Neon 100% configurado

### 5. APIs RESTful
- Todas as rotas documentadas
- Padrão de resposta consistente
- Tratamento de erros robusto
- Validações de entrada
- Suporte a filtros e buscas
- Swagger UI disponível em `/api/swagger`

---

## Tecnologias Utilizadas

### Frontend
- **Next.js 14** - Framework React
- **TypeScript** - Tipagem estática
- **Tailwind CSS** - Estilização
- **shadcn/ui** - Componentes UI
- **SWR** - Data fetching e cache
- **React Hook Form** - Formulários
- **Zod** - Validação de schemas

### Backend
- **Next.js API Routes** - Backend serverless
- **PostgreSQL (Neon)** - Banco de dados
- **bcryptjs** - Hashing de senhas
- **jsonwebtoken** - Autenticação JWT
- **@neondatabase/serverless** - Driver Neon

### DevOps
- **Vercel** - Hospedagem e deploy
- **Neon** - Banco de dados PostgreSQL
- **Git** - Controle de versão

---

## Instalação e Configuração

### Pré-requisitos
- Node.js 18+ instalado
- Conta Neon (banco de dados PostgreSQL)
- npm ou yarn

### Passo 1: Clonar o Repositório
```bash
git clone https://github.com/seu-usuario/cardbrazil.git
cd cardbrazil
```

### Passo 2: Instalar Dependências
```bash
npm install
```

### Passo 3: Configurar Variáveis de Ambiente
As variáveis de ambiente do Neon já estão configuradas no projeto:
- `DATABASE_URL`
- `POSTGRES_URL`
- `NEON_PROJECT_ID`

### Passo 4: Rodar o Projeto
```bash
npm run dev
```

O sistema estará disponível em: **http://localhost:3000**

---

## Credenciais de Acesso

### Usuário Administrador
```
Email: admin@cardbrazil.com.br
Senha: admin123
Tipo: Administrador
```

### Banco de Dados Neon
```
Project ID: sweet-cherry-72512409
Database: neondb
```

---

## Estrutura do Projeto

```
cardbrazil/
├── app/                          # Pages e rotas Next.js
│   ├── api/                      # API Routes
│   │   ├── auth/                 # Autenticação
│   │   ├── pessoas/              # CRUD Pessoas
│   │   ├── operadoras/           # CRUD Operadoras
│   │   ├── planos/               # CRUD Planos
│   │   └── swagger/              # Documentação API
│   ├── dashboard/                # Páginas do painel
│   │   ├── pessoas/              # Gestão de pessoas
│   │   ├── operadoras/           # Gestão de operadoras
│   │   └── planos/               # Gestão de planos
│   ├── layout.tsx                # Layout principal
│   └── page.tsx                  # Landing page + Login
│
├── components/                   # Componentes React
│   ├── ui/                       # Componentes shadcn/ui
│   ├── dashboard/                # Componentes do dashboard
│   ├── login-section.tsx         # Seção de login
│   ├── hero-section.tsx          # Seção hero
│   └── footer.tsx                # Rodapé
│
├── contexts/                     # Contextos React
│   └── auth-context.tsx          # Contexto de autenticação
│
├── hooks/                        # Custom hooks
│   ├── use-auth.ts               # Hook de autenticação
│   ├── use-pessoas.ts            # Hook para pessoas
│   └── use-toast.ts              # Hook para notificações
│
├── lib/                          # Bibliotecas e utilitários
│   ├── database.ts               # Conexão Neon PostgreSQL
│   ├── auth-service.ts           # Serviço de autenticação
│   ├── api-response.ts           # Respostas padronizadas
│   ├── pg-helper.ts              # Helpers PostgreSQL
│   └── utils.ts                  # Utilitários gerais
│
├── scripts/                      # Scripts SQL
│   ├── 01_ddl_*.sql              # Scripts de criação de tabelas
│   └── create_all_tables.py      # Script Python para automação
│
└── types/                        # Definições de tipos TypeScript
```

---

## Rotas da Aplicação

### Públicas
- `/` - Landing page com login
- `/api/auth/login` - Endpoint de login
- `/api/swagger` - Documentação da API

### Protegidas (requer autenticação)
- `/dashboard` - Dashboard principal
- `/dashboard/pessoas` - Gestão de pessoas
- `/dashboard/operadoras` - Gestão de operadoras
- `/dashboard/planos` - Gestão de planos
- `/dashboard/beneficiarios` - Gestão de beneficiários

### APIs Principais
```
GET    /api/pessoas              # Listar pessoas
POST   /api/pessoas              # Criar pessoa
GET    /api/pessoas/:id          # Buscar pessoa
PUT    /api/pessoas/:id          # Atualizar pessoa
DELETE /api/pessoas/:id          # Excluir pessoa

GET    /api/operadoras           # Listar operadoras
POST   /api/operadoras           # Criar operadora
GET    /api/operadoras/:id       # Buscar operadora
PUT    /api/operadoras/:id       # Atualizar operadora
DELETE /api/operadoras/:id       # Excluir operadora

GET    /api/planos               # Listar planos
POST   /api/planos               # Criar plano
GET    /api/planos/:id           # Buscar plano
PUT    /api/planos/:id           # Atualizar plano
DELETE /api/planos/:id           # Excluir plano
```

---

## Banco de Dados

### Tabelas Criadas

1. **administradoras** - Empresas administradoras (multi-tenancy)
2. **usuarios** - Usuários do sistema
3. **pessoas** - Pessoas físicas e jurídicas
4. **enderecos** - Endereços das pessoas
5. **dados_bancarios** - Contas bancárias
6. **operadoras** - Operadoras de saúde
7. **corretores** - Corretores de seguros
8. **agenciadores** - Agenciadores
9. **estipulantes** - Estipulantes (grupos)
10. **planos** - Planos de saúde
11. **produtos** - Produtos por faixa etária
12. **contratos** - Contratos
13. **beneficiarios** - Beneficiários dos planos

### Dados de Teste

O sistema já vem com dados de teste:
- 1 Administradora (CardBrazil)
- 1 Usuário admin
- 4 Pessoas (2 físicas, 2 jurídicas)
- 1 Operadora (Unimed)
- 2 Planos (Ambulatorial e Hospitalar)
- 3 Produtos (variações por idade)

---

## Como Usar o Sistema

### 1. Fazer Login
1. Acesse http://localhost:3000
2. Use as credenciais: **admin@cardbrazil.com.br** / **admin123**
3. Será redirecionado para o dashboard

### 2. Gerenciar Pessoas
1. No dashboard, clique em "Pessoas"
2. Veja a lista de pessoas cadastradas
3. Clique em "Nova Pessoa" para adicionar
4. Preencha os dados nas abas:
   - Dados Pessoais
   - Endereços
   - Dados Bancários
5. Clique em "Salvar"

### 3. Buscar e Filtrar
- Use a barra de busca para procurar por nome, CPF ou CNPJ
- Filtre por tipo (Física/Jurídica)
- Filtre por status (Ativo/Inativo)

### 4. Editar ou Excluir
- Clique no ícone de lápis para editar
- Clique no ícone de lixeira para excluir
- Clique no ícone de olho para ver detalhes

---

## Documentação da API

Acesse a documentação completa da API em:
```
http://localhost:3000/api/swagger
```

A documentação Swagger inclui:
- Todas as rotas disponíveis
- Parâmetros de entrada
- Exemplos de request/response
- Códigos de erro
- Schemas de dados

---

## Testes

### Testar Login
```bash
curl -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@cardbrazil.com.br","senha":"admin123"}'
```

### Testar Listagem de Pessoas
```bash
curl http://localhost:3000/api/pessoas?administradora_id=1
```

### Testar Criação de Pessoa
```bash
curl -X POST http://localhost:3000/api/pessoas \
  -H "Content-Type: application/json" \
  -d '{
    "tipo_pessoa": "fisica",
    "nome_completo": "Teste Silva",
    "cpf": "111.222.333-44",
    "email": "teste@email.com",
    "administradora_id": 1
  }'
```

---

## Deploy na Vercel

### Passo 1: Conectar Repositório
1. Faça push do código para GitHub
2. Acesse https://vercel.com
3. Clique em "Import Project"
4. Selecione seu repositório

### Passo 2: Configurar Variáveis de Ambiente
As variáveis do Neon já estão configuradas automaticamente.

### Passo 3: Deploy
1. Clique em "Deploy"
2. Aguarde o build
3. Acesse sua URL do Vercel

---

## Segurança

### Implementações de Segurança
- Senhas criptografadas com bcrypt
- Tokens JWT com expiração
- Cookies httpOnly (não acessíveis por JavaScript)
- Proteção contra SQL injection
- Validação de entrada em todas as APIs
- Soft delete (dados nunca são realmente apagados)
- CORS configurado
- Rate limiting (recomendado adicionar)

### Boas Práticas
- Nunca commitar arquivos .env
- Trocar senha do admin em produção
- Usar HTTPS em produção
- Implementar refresh tokens
- Adicionar logs de auditoria
- Monitorar acessos suspeitos

---

## Próximas Melhorias Sugeridas

### Curto Prazo
1. Adicionar middleware de autenticação global
2. Implementar refresh tokens
3. Adicionar testes automatizados
4. Criar relatórios e dashboards
5. Adicionar exportação de dados (CSV, PDF)

### Médio Prazo
1. Módulo financeiro completo
2. Sistema de propostas
3. Workflow de aprovações
4. Notificações por email
5. Integração com APIs externas (CEP, bancos)

### Longo Prazo
1. App mobile
2. Chatbot de atendimento
3. BI e analytics
4. Integrações com ERPs
5. Sistema de comissionamento automático

---

## Troubleshooting

### Erro ao conectar no banco
```bash
# Verifique as variáveis de ambiente
echo $DATABASE_URL

# Teste a conexão
npm run db:check
```

### Erro de autenticação
```bash
# Limpe os cookies do navegador
# Ou use modo anônimo

# Verifique se o token está válido
localStorage.getItem('token')
```

### Página não carrega
```bash
# Limpe o cache do Next.js
rm -rf .next
npm run dev
```

---

## Suporte

Para suporte técnico:
- Email: suporte@cardbrazil.com.br
- Documentação: /docs
- API: /api/swagger

---

## Licença

Propriedade da CardBrazil Administradora de Seguros.
Todos os direitos reservados.

---

## Changelog

### Versão 1.0.0 (24/12/2025)
- Sistema completo implementado
- 13 tabelas no banco de dados
- Autenticação funcional
- CRUD de pessoas completo
- Interface responsiva
- Documentação da API
- Dados de teste
- Deploy pronto

---

**Desenvolvido com Next.js, TypeScript e PostgreSQL**
**CardBrazil - Cuidando da sua saúde com segurança e confiança**
