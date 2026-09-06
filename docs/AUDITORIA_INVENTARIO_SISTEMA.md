# Auditoria de inventário do sistema

Data da auditoria: 05/09/2026

## Escopo verificado

O projeto contém **138 páginas `page.tsx`** e **85 rotas API `route.ts`** no App Router. O inventário completo é gerado diretamente do filesystem pelos padrões `app/**/page.tsx` e `app/api/**/route.ts`, evitando listas manuais desatualizadas.

### Domínios identificados

- Autenticação e recuperação de senha
- Dashboard e navegação
- Cadastros
- Propostas e beneficiários
- Financeiro e pagamentos
- Relatórios
- Segurança, usuários e perfis
- SQL Manager e documentação Swagger
- Tabelas auxiliares e integrações

## Pontos que exigem tratamento

A busca estática encontrou **28 arquivos** com sinais de dados fixos, mocks, placeholders ou estados locais de dados. Isso não significa automaticamente que cada ocorrência seja um mock de produção: algumas são estados vazios, opções de formulário, fallback visual ou dados de apresentação. Cada ocorrência deve ser classificada antes de ser substituída.

Critério de classificação:

1. Dados vindos de `/api` ou Server Component: integrado.
2. Constante usada apenas como opções de UI/status: permitido, documentar.
3. Array com entidades/registros exibidos em tabela ou gráfico: pendência de integração.
4. Fallback usado quando a API falha: corrigir para estado de erro, sem mascarar falha.

## Mapeamento recomendado

Para cada página, registrar:

| Página | Endpoint | Tabelas | Operações | Status |
|---|---|---|---|---|
| rota da página | rota API usada | tabelas consultadas | listar/criar/editar/excluir | integrado/pendente |

O mapeamento deve ser mantido junto às mudanças de cada módulo e revisado antes da homologação.

## Resultado

O inventário está concluído. O próximo passo é classificar os 28 arquivos sinalizados, começando pelas telas operacionais que exibem entidades ou indicadores, e então criar/ajustar suas APIs e consultas reais.

## Comandos de conferência

- Páginas: `app/**/page.tsx`
- APIs: `app/api/**/route.ts`
- DDL/DML: `banco-dados/**/*.sql`
- Sinais de dados fixos: `mock`, `mockado`, `hardcoded`, arrays de registros e `useState([])`

Nenhum dado de produção foi alterado por esta auditoria.
