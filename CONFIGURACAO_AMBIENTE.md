# Configuração de Ambientes - CardBrazil CRM

Este documento explica como configurar e alternar entre os ambientes de desenvolvimento, homologação e produção.

## Ambientes Disponíveis

O sistema suporta 3 ambientes:

1. **Development (Desenvolvimento)** - Localhost
2. **Homologation (Homologação)** - Servidor de testes
3. **Production (Produção)** - Servidor de produção

## Como Configurar

### 1. Arquivo `.env`

Edite o arquivo `.env` na raiz do projeto e configure as credenciais de cada ambiente:

\`\`\`env
# Defina o ambiente atual aqui
NODE_ENV=development

# Configurações de DESENVOLVIMENTO
DEV_DB_HOST=127.0.0.1
DEV_DB_PORT=3306
DEV_DB_USER=root
DEV_DB_PASSWORD=sua_senha
DEV_DB_NAME=cardbrazil_crm

# Configurações de HOMOLOGAÇÃO
HOMOLOG_DB_HOST=servidor-homolog.com
HOMOLOG_DB_PORT=3306
HOMOLOG_DB_USER=usuario_homolog
HOMOLOG_DB_PASSWORD=senha_homolog
HOMOLOG_DB_NAME=cardbrazil_crm_homolog

# Configurações de PRODUÇÃO
PROD_DB_HOST=servidor-producao.com
PROD_DB_PORT=3306
PROD_DB_USER=usuario_prod
PROD_DB_PASSWORD=senha_prod
PROD_DB_NAME=cardbrazil_crm
\`\`\`

### 2. Como Alternar Entre Ambientes

Para alternar entre ambientes, basta mudar o valor de `NODE_ENV` no arquivo `.env`:

**Para Desenvolvimento (localhost):**
\`\`\`env
NODE_ENV=development
\`\`\`

**Para Homologação:**
\`\`\`env
NODE_ENV=homologation
\`\`\`

**Para Produção:**
\`\`\`env
NODE_ENV=production
\`\`\`

### 3. Verificação

Após alterar o ambiente e reiniciar o servidor, você verá nos logs do console:

\`\`\`
[v0] ========================================
[v0] AMBIENTE DETECTADO: DEVELOPMENT
[v0] ========================================
[v0] Configuração do Banco de Dados:
[v0] - Host: 127.0.0.1
[v0] - Port: 3306
[v0] - User: root
[v0] - Database: cardbrazil_crm
[v0] - Password: ***configurada***
[v0] ========================================
\`\`\`

## Configuração Atual (Desenvolvimento)

Atualmente o sistema está configurado para usar **localhost**:

- **Host:** 127.0.0.1
- **Porta:** 3306
- **Usuário:** root
- **Senha:** D05m09@123
- **Database:** cardbrazil_crm

## Credenciais de Acesso ao Sistema

**Usuário Admin:**
- Email: `admin@cardbrazil.com.br`
- Senha: `Admin@123`

## Importante

- Nunca commite o arquivo `.env` no Git (já está no `.gitignore`)
- Use `.env.example` como template para novos ambientes
- Sempre teste a conexão após mudar de ambiente
- Em produção, use senhas fortes e diferentes das de desenvolvimento
