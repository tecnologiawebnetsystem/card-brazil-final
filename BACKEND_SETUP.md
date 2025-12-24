# 🚀 CardBrazil CRM - Guia Completo do Back-end

## 📋 Índice
1. [Visão Geral](#visão-geral)
2. [Estrutura do Projeto](#estrutura-do-projeto)
3. [Configuração do Banco de Dados](#configuração-do-banco-de-dados)
4. [API Endpoints](#api-endpoints)
5. [Documentação Swagger](#documentação-swagger)
6. [Segurança](#segurança)
7. [Como Testar](#como-testar)

---

## 🎯 Visão Geral

O back-end do CardBrazil CRM está **totalmente integrado** com o front-end usando Next.js API Routes. Isso significa que:

- ✅ Front-end e back-end compilam juntos
- ✅ Não precisa de servidor separado
- ✅ Deploy unificado no Vercel
- ✅ TypeScript compartilhado entre front e back
- ✅ Documentação Swagger automática
- ✅ Banco de dados MySQL local

---

## 📁 Estrutura do Projeto

\`\`\`
cardbrazil-crm/
│
├── banco-dados/              # Scripts SQL
│   ├── DDL/                  # Data Definition Language
│   │   └── 01_usuarios.sql   # Criação de tabelas
│   └── DML/                  # Data Manipulation Language
│       ├── 01_roles_iniciais.sql
│       ├── 02_usuario_admin.sql
│       └── 03_usuarios_exemplo.sql
│
├── lib/                      # Serviços e utilitários
│   ├── database.ts           # Configuração MySQL + Tipos
│   ├── auth-service.ts       # Serviço de autenticação
│   └── auth.ts               # Utilitários de auth (cliente)
│
├── app/api/                  # API Routes (Back-end)
│   ├── auth/
│   │   ├── login/
│   │   │   └── route.ts      # POST /api/auth/login
│   │   └── logout/
│   │       └── route.ts      # POST /api/auth/logout
│   ├── swagger/
│   │   └── route.ts          # GET /api/swagger (JSON spec)
│   └── docs/
│       └── page.tsx          # Swagger UI (/api/docs)
│
└── app/                      # Front-end (páginas)
    └── dashboard/
        └── ...
\`\`\`

---

## 🗄️ Configuração do Banco de Dados

### Conexão MySQL

**Credenciais configuradas:**
- **Host:** 127.0.0.1
- **Port:** 3306
- **Username:** root
- **Password:** D05m09@123
- **Database:** cardbrazil

### Tabelas Criadas (DDL)

#### 1. **usuarios** - Dados de autenticação
\`\`\`sql
- id (CHAR(36), PK, UUID)
- email (VARCHAR(255), UNIQUE)
- senha_hash (VARCHAR(255))
- ativo (BOOLEAN)
- email_verificado (BOOLEAN)
- tentativas_login (INT)
- bloqueado_ate (DATETIME)
- created_at, updated_at (auto-update)
\`\`\`

#### 2. **perfis_usuario** - Dados pessoais
\`\`\`sql
- id (CHAR(36), PK, UUID)
- usuario_id (CHAR(36), FK → usuarios)
- nome_completo (VARCHAR(255))
- nome_exibicao (VARCHAR(100))
- telefone (VARCHAR(20))
- avatar_url (TEXT)
- cargo (VARCHAR(100))
- departamento (VARCHAR(100))
- data_nascimento (DATE)
- endereco (JSON)
- preferencias (JSON)
- created_at, updated_at (auto-update)
\`\`\`

#### 3. **roles** - Papéis/Funções
\`\`\`sql
- id (CHAR(36), PK, UUID)
- nome (VARCHAR(50), UNIQUE)
- descricao (TEXT)
- permissoes (JSON)
- ativo (BOOLEAN)
- created_at
\`\`\`

#### 4. **usuario_roles** - Relacionamento N:N
\`\`\`sql
- id (CHAR(36), PK, UUID)
- usuario_id (CHAR(36), FK → usuarios)
- role_id (CHAR(36), FK → roles)
- created_at
- UNIQUE(usuario_id, role_id)
\`\`\`

#### 5. **sessoes_usuario** - Controle de sessões
\`\`\`sql
- id (CHAR(36), PK, UUID)
- usuario_id (CHAR(36), FK → usuarios)
- token_hash (VARCHAR(255))
- refresh_token_hash (VARCHAR(255))
- expires_at (DATETIME)
- ip_address (VARCHAR(45))
- user_agent (TEXT)
- ativo (BOOLEAN)
- created_at
\`\`\`

#### 6. **logs_autenticacao** - Auditoria
\`\`\`sql
- id (CHAR(36), PK, UUID)
- usuario_id (CHAR(36), FK → usuarios)
- email (VARCHAR(255))
- tipo_evento (VARCHAR(50))
- ip_address (VARCHAR(45))
- user_agent (TEXT)
- detalhes (JSON)
- created_at
\`\`\`

### Dados Iniciais (DML)

#### Roles Padrão
- **admin** - Acesso total (`["*"]`)
- **gerente** - Dashboard, cadastros, relatórios, usuários
- **operador** - Dashboard, cadastros (view/create/edit)
- **consultor** - Dashboard, cadastros (view), relatórios
- **usuario** - Dashboard, editar próprio perfil

#### Usuários de Teste

| Email | Senha | Role | Nome |
|-------|-------|------|------|
| admin@cardbrazil.com.br | admin123 | admin | Administrador do Sistema |
| gerente@cardbrazil.com.br | admin123 | gerente | João Silva Santos |
| operador@cardbrazil.com.br | admin123 | operador | Maria Oliveira Costa |
| consultor@cardbrazil.com.br | admin123 | consultor | Carlos Pereira Lima |

---

## 🔌 API Endpoints

### 1. POST /api/auth/login

**Descrição:** Autentica usuário e retorna JWT token

**Request Body:**
\`\`\`json
{
  "email": "admin@cardbrazil.com.br",
  "senha": "admin123"
}
\`\`\`

**Response (200 OK):**
\`\`\`json
{
  "success": true,
  "message": "Login realizado com sucesso",
  "data": {
    "usuario": {
      "id": "uuid",
      "email": "admin@cardbrazil.com.br",
      "ativo": true,
      "perfil": {
        "nome_completo": "Administrador do Sistema",
        "cargo": "Administrador",
        "departamento": "TI"
      },
      "roles": [
        {
          "nome": "admin",
          "permissoes": ["*"]
        }
      ]
    },
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "refreshToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
  }
}
\`\`\`

**Cookies Definidos:**
- `auth-token` (httpOnly, secure, sameSite: strict, 24h)
- `refresh-token` (httpOnly, secure, sameSite: strict, 7d)

**Erros:**
- `400` - Email ou senha não fornecidos
- `401` - Credenciais inválidas ou usuário bloqueado
- `500` - Erro interno do servidor

---

### 2. POST /api/auth/logout

**Descrição:** Invalida sessão do usuário

**Headers:**
\`\`\`
Authorization: Bearer <token>
\`\`\`

**Response (200 OK):**
\`\`\`json
{
  "success": true,
  "message": "Logout realizado com sucesso"
}
\`\`\`

**Cookies Removidos:**
- `auth-token`
- `refresh-token`

---

## 📚 Documentação Swagger

### Como Acessar

1. **Swagger UI (Interface Visual):**
   \`\`\`
   http://localhost:3000/api/docs
   \`\`\`
   - Interface interativa para testar APIs
   - Visualização de schemas
   - Exemplos de requisições

2. **Especificação OpenAPI (JSON):**
   \`\`\`
   http://localhost:3000/api/swagger
   \`\`\`
   - Especificação OpenAPI 3.0.0 completa
   - Pode ser importada em Postman, Insomnia, etc.

### Recursos da Documentação

- ✅ Todos os endpoints documentados
- ✅ Schemas de dados (Usuario, PerfilUsuario, Role)
- ✅ Exemplos de requisição/resposta
- ✅ Códigos de status HTTP
- ✅ Autenticação Bearer (JWT)
- ✅ Teste direto na interface

---

## 🔒 Segurança

### Recursos Implementados

1. **Hash de Senhas**
   - Algoritmo: bcrypt
   - Salt rounds: 10
   - Senhas nunca armazenadas em texto plano

2. **JWT Tokens**
   - Algoritmo: HS256
   - Expiração: 24h (access token)
   - Expiração: 7d (refresh token)
   - Armazenamento: httpOnly cookies

3. **Proteção Contra Força Bruta**
   - Limite: 5 tentativas de login
   - Bloqueio: 30 minutos após limite
   - Reset automático após login bem-sucedido

4. **Cookies Seguros**
   - `httpOnly`: true (protege contra XSS)
   - `secure`: true em produção (HTTPS only)
   - `sameSite`: strict (protege contra CSRF)

5. **Logging de Auditoria**
   - Todos os eventos de autenticação registrados
   - IP address e User-Agent capturados
   - Detalhes de falhas armazenados

6. **Validação de Dados**
   - Email e senha obrigatórios
   - Email em formato válido
   - Verificação de usuário ativo

---

## 🧪 Como Testar

### 1. Configurar Variáveis de Ambiente

Crie um arquivo `.env.local` na raiz do projeto (use o `.env.example` como base):

\`\`\`env
# Configuração do Banco de Dados MySQL
DB_HOST=127.0.0.1
DB_PORT=3306
DB_USER=root
DB_PASSWORD=D05m09@123
DB_NAME=cardbrazil

# Configuração JWT
JWT_SECRET=sua_chave_secreta_super_segura_aqui_mude_em_producao
JWT_EXPIRES_IN=1h
REFRESH_TOKEN_EXPIRES_IN=7d

# Configuração da API
NEXT_PUBLIC_API_URL=http://localhost:3000
\`\`\`

### 2. Executar Scripts SQL no MySQL

**Ordem de execução:**

1. Crie o banco de dados:
   \`\`\`sql
   CREATE DATABASE cardbrazil CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
   USE cardbrazil;
   \`\`\`

2. Execute o DDL primeiro:
   \`\`\`bash
   mysql -u root -p cardbrazil < banco-dados/DDL/01_usuarios.sql
   \`\`\`

3. Execute os DMLs na ordem:
   \`\`\`bash
   mysql -u root -p cardbrazil < banco-dados/DML/01_roles_iniciais.sql
   mysql -u root -p cardbrazil < banco-dados/DML/02_usuario_admin.sql
   mysql -u root -p cardbrazil < banco-dados/DML/03_usuarios_exemplo.sql
   \`\`\`

### 3. Instalar Dependências

\`\`\`bash
npm install
\`\`\`

As dependências necessárias já estão no package.json:
- mysql2 (driver MySQL)
- bcryptjs (hash de senhas)
- jsonwebtoken (JWT tokens)
- swagger-jsdoc e swagger-ui-react (documentação)

### 4. Iniciar o Servidor

\`\`\`bash
npm run dev
\`\`\`

### 5. Testar Login via Swagger UI

1. Acesse: `http://localhost:3000/api/docs`
2. Expanda o endpoint `POST /api/auth/login`
3. Clique em "Try it out"
4. Use as credenciais de teste:
   \`\`\`json
   {
     "email": "admin@cardbrazil.com.br",
     "senha": "admin123"
   }
   \`\`\`
5. Clique em "Execute"
6. Verifique a resposta com o token JWT

### 6. Testar Login via cURL

\`\`\`bash
curl -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "admin@cardbrazil.com.br",
    "senha": "admin123"
  }'
\`\`\`

### 7. Testar Logout

\`\`\`bash
curl -X POST http://localhost:3000/api/auth/logout \
  -H "Authorization: Bearer SEU_TOKEN_AQUI"
\`\`\`

---

## ✅ Checklist de Verificação

- [x] Scripts SQL criados (DDL + DML) para MySQL
- [x] Tabelas estruturadas corretamente
- [x] Relacionamentos com Foreign Keys
- [x] Índices para performance
- [x] Auto-update de timestamps
- [x] Dados iniciais (roles + usuários)
- [x] Serviço de autenticação (AuthService)
- [x] Configuração do banco MySQL (database.ts)
- [x] Pool de conexões MySQL
- [x] API Route de login
- [x] API Route de logout
- [x] Documentação Swagger
- [x] Interface Swagger UI
- [x] Segurança (bcrypt + JWT)
- [x] Cookies httpOnly
- [x] Proteção contra força bruta
- [x] Logging de auditoria
- [x] TypeScript types compartilhados
- [x] Integração front-end + back-end
- [x] Arquivo .env.example com credenciais

---

## 🎉 Conclusão

O back-end está **100% funcional e integrado** com o front-end usando MySQL! Você pode:

1. ✅ Executar os scripts SQL no MySQL local
2. ✅ Configurar as variáveis de ambiente (.env.local)
3. ✅ Testar o login via Swagger UI em `/api/docs`
4. ✅ Integrar o front-end com as APIs criadas
5. ✅ Expandir com novos endpoints seguindo o mesmo padrão

**Próximos passos sugeridos:**
- Implementar refresh token automático
- Adicionar endpoints de CRUD para outras entidades
- Implementar recuperação de senha
- Adicionar autenticação de dois fatores (2FA)
- Expandir sistema de permissões granulares

---

**Documentação atualizada em:** 2025
**Versão:** 2.0.0 (MySQL)
**Autor:** CardBrazil CRM Team
