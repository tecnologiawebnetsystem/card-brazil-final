# Instruções de Instalação - CardBrazil

## 1. Pré-requisitos

- Node.js 18+ instalado
- Conta no Neon PostgreSQL (gratuito)
- Git instalado

## 2. Configurar o Banco de Dados Neon

### 2.1. Criar conta no Neon

1. Acesse: https://console.neon.tech
2. Crie uma conta gratuita
3. Crie um novo projeto chamado "CardBrazil"

### 2.2. Obter a Connection String

1. No painel do Neon, vá em "Connection Details"
2. Copie a connection string no formato:
   ```
   postgresql://[user]:[password]@[host].neon.tech/[database]?sslmode=require
   ```

### 2.3. Configurar as Variáveis de Ambiente

1. Na raiz do projeto, copie o arquivo `.env.example` para `.env.local`:
   ```bash
   cp .env.example .env.local
   ```

2. Edite o arquivo `.env.local` e adicione sua connection string:
   ```bash
   DATABASE_URL=postgresql://sua-connection-string-aqui
   ```

3. Configure um JWT_SECRET forte (troque o valor padrão):
   ```bash
   JWT_SECRET=seu-secret-key-aqui-minimo-32-caracteres
   ```

## 3. Instalar Dependências

```bash
npm install
```

## 4. Verificar se o Banco está Configurado

O banco já possui as seguintes tabelas criadas:
- administradoras
- usuarios
- pessoas
- enderecos
- dados_bancarios
- operadoras
- corretores
- agenciadores
- estipulantes
- planos
- produtos
- contratos
- beneficiarios

E dados de teste já inseridos:
- **Administradora**: CardBrazil
- **Usuário Admin**: admin@cardbrazil.com.br / admin123
- **Pessoas de teste**: João Silva, Maria Santos
- **Operadora**: Unimed Saúde
- **Planos**: Ambulatorial, Hospitalar
- **Produtos**: 3 produtos de exemplo

## 5. Executar o Projeto

### Modo Desenvolvimento
```bash
npm run dev
```

Acesse: http://localhost:3000

### Fazer Build para Produção
```bash
npm run build
npm start
```

## 6. Login no Sistema

Use as credenciais:
- **Email**: admin@cardbrazil.com.br
- **Senha**: admin123

## 7. Problemas Comuns

### Erro: DATABASE_URL is not configured

**Solução**: Certifique-se de que criou o arquivo `.env.local` com a connection string do Neon.

### Erro: Failed to connect to database

**Soluções**:
1. Verifique se a connection string está correta
2. Verifique se seu projeto Neon está ativo
3. Verifique sua conexão com a internet

### Erro: Authentication failed

**Soluções**:
1. Verifique se o JWT_SECRET está configurado
2. Limpe os cookies do navegador
3. Tente fazer login novamente

## 8. Estrutura do Projeto

```
card-brazil-final/
├── app/                    # Páginas e rotas Next.js
│   ├── api/               # API Routes
│   ├── dashboard/         # Páginas do dashboard
│   └── page.tsx           # Página de login
├── components/            # Componentes React
├── contexts/              # Context API (Auth)
├── hooks/                 # Custom hooks
├── lib/                   # Utilitários e config
│   ├── database.ts       # Conexão Neon PostgreSQL
│   └── auth-service.ts   # Serviço de autenticação
└── .env.local            # Variáveis de ambiente (criar)
```

## 9. Próximos Passos

1. Explore o dashboard em: http://localhost:3000/dashboard
2. Navegue pelas seções: Pessoas, Operadoras, Planos, etc.
3. Teste as funcionalidades de CRUD
4. Acesse a documentação Swagger em: http://localhost:3000/api/swagger

## 10. Deploy em Produção (Vercel)

1. Faça push do código para o GitHub
2. Importe o projeto no Vercel
3. Configure as variáveis de ambiente:
   - `DATABASE_URL`: Connection string do Neon
   - `JWT_SECRET`: Chave secreta forte
4. Deploy!

O Neon funciona perfeitamente com Vercel sem configuração adicional.
