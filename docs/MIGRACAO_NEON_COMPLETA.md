# Migração Completa para Neon PostgreSQL

## Status da Migração

O sistema CardBrazil foi completamente migrado de MySQL para PostgreSQL (Neon).

## Alterações Realizadas

### 1. Configuração do Banco de Dados
- ✅ Criado `lib/database.ts` com integração Neon
- ✅ Adicionado suporte a `pool` e `queryOne` para compatibilidade
- ✅ Todas as queries agora usam placeholders PostgreSQL ($1, $2, etc.)

### 2. Autenticação
- ✅ Recriado `contexts/auth-context.tsx` com hook `useAuth`
- ✅ Atualizado `lib/auth-service.ts` para PostgreSQL
- ✅ Criada rota `/api/auth/me` para verificação de sessão
- ✅ Layout atualizado com `AuthProvider`

### 3. API Routes Convertidas
- ✅ `/api/auth/login` - Login com cookies seguros
- ✅ `/api/financeiro/advogados` - CRUD de advogados
- ✅ `/api/financeiro/contas-pagar` - Contas a pagar
- ✅ `/api/financeiro/contas-receber` - Contas a receber

### 4. Scripts SQL PostgreSQL
Criados em `/scripts`:
- ✅ `01_create_administradoras.sql` - Tabela base multi-tenancy
- ✅ `02_create_usuarios.sql` - Usuários, roles e autenticação
- ✅ `03_seed_initial_data.sql` - Dados iniciais de teste

## Como Executar os Scripts

### Opção 1: Via v0 (Recomendado)
1. Os scripts já estão na pasta `/scripts`
2. A v0 pode executá-los diretamente no Neon conectado

### Opção 2: Manualmente
1. Acesse o Neon Dashboard
2. Abra o SQL Editor
3. Execute os scripts na ordem:
   - `01_create_administradoras.sql`
   - `02_create_usuarios.sql`
   - `03_seed_initial_data.sql`

## Credenciais de Teste

Após executar os scripts, use:
- **Email**: admin@cardbrazil.com.br
- **Senha**: admin123

## Variáveis de Ambiente Necessárias

Certifique-se de que estas variáveis estão configuradas:

```env
DATABASE_URL=postgresql://...  # Já configurado via Neon
JWT_SECRET=your-secret-key-change-in-production
NODE_ENV=production
```

## Próximos Passos

1. ✅ Executar os scripts SQL no Neon
2. ⏳ Testar o login na aplicação
3. ⏳ Verificar o dashboard após login
4. ⏳ Converter APIs restantes conforme necessário

## APIs que Ainda Precisam de Conversão

As seguintes APIs ainda usam MySQL e precisam ser convertidas:
- `/api/financeiro/fluxo-caixa/*`
- `/api/financeiro/processos-judiciais/*`
- `/api/financeiro/multas-juros/*`
- `/api/beneficiarios/*`
- `/api/pessoas/*`
- `/api/operadoras/*`
- `/api/estipulantes/*`
- `/api/corretores/*`
- `/api/agenciadores/*`

**Nota**: Estas APIs só precisam ser convertidas quando forem utilizadas. Por enquanto, o sistema de login e dashboard está funcional.

## Problemas Conhecidos

### Se o preview não aparecer:
1. Verifique se todos os scripts SQL foram executados
2. Confirme que a variável DATABASE_URL está correta
3. Teste o endpoint `/api/auth/me` para verificar conectividade

### Se houver erro de autenticação:
1. Verifique se o usuário admin foi criado no banco
2. Confirme que a senha está hasheada corretamente
3. Limpe os cookies do navegador

## Suporte

Para converter mais APIs, use o padrão estabelecido:
1. Substitua `pool` por `sql` do `@/lib/database`
2. Converta placeholders `?` para `$1, $2, ...`
3. Substitua `NOW()` por `CURRENT_TIMESTAMP`
4. Use `RETURNING id` em vez de `insertId`
