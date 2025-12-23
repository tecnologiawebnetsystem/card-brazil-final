# Scripts de Banco de Dados - CardBrazil CRM

## Ordem de Execução

### 1. Drop Database (Opcional - CUIDADO!)
\`\`\`bash
mysql -u root -p < 00_drop_database.sql
\`\`\`

### 2. Scripts DDL (Estrutura)
Execute na ordem:
\`\`\`bash
mysql -u root -p cardbrazil_crm < DDL/00_administradoras.sql
mysql -u root -p cardbrazil_crm < DDL/01_usuarios_autenticacao.sql
mysql -u root -p cardbrazil_crm < DDL/02_pessoas_enderecos_bancarios.sql
mysql -u root -p cardbrazil_crm < DDL/03_operadoras_estipulantes.sql
mysql -u root -p cardbrazil_crm < DDL/04_corretores_agenciadores.sql
mysql -u root -p cardbrazil_crm < DDL/05_planos_produtos.sql
mysql -u root -p cardbrazil_crm < DDL/06_financeiro_auditoria.sql
mysql -u root -p cardbrazil_crm < DDL/07_propostas.sql
\`\`\`

### 3. Scripts DML (Dados Iniciais)
Execute na ordem:
\`\`\`bash
mysql -u root -p cardbrazil_crm < DML/01_administradora_inicial.sql
mysql -u root -p cardbrazil_crm < DML/02_roles_iniciais.sql
mysql -u root -p cardbrazil_crm < DML/03_usuario_admin.sql
mysql -u root -p cardbrazil_crm < DML/04_pessoas_exemplo.sql
mysql -u root -p cardbrazil_crm < DML/05_propostas_exemplo.sql
\`\`\`

## Credenciais Padrão

**Usuário Administrador:**
- Email: `admin@cardbrazil.com.br`
- Senha: `Admin@123`

## Estrutura do Banco

### Multi-tenancy
Todas as tabelas possuem o campo `id_administradora` para suportar múltiplas administradoras no mesmo banco.

### Relacionamentos Principais
- 1 Administradora → N Usuários
- 1 Administradora → N Pessoas
- 1 Administradora → N Propostas
- 1 Pessoa → N Endereços
- 1 Pessoa → N Contas Bancárias
- 1 Pessoa → pode ser Operadora, Estipulante, Corretor, etc.
- 1 Proposta → 1 Usuário (analisador)

## Observações

- Todos os scripts usam `IF NOT EXISTS` para evitar erros em re-execuções
- Soft delete implementado com campo `deleted_at`
- Timestamps automáticos em todas as tabelas
- Índices otimizados para consultas frequentes
- Sistema de scores para avaliação rápida de propostas
