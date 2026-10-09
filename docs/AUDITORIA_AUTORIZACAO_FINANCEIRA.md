# Auditoria de autorização das APIs financeiras

## Escopo e conclusão

A auditoria foi realizada no código, sem executar SQL, migrations, DDL/DML ou acessar dados reais. Foram inspecionadas as rotas de propostas, contratos, beneficiários, cobrança e financeiro encontradas em `app/api`.

A correção desta etapa cobre os desvios confirmados nas rotas críticas abaixo. O sistema **não deve ser declarado integralmente seguro**: ainda existem rotas financeiras legadas que usam somente `getAuthContext()` e exigem uma etapa adicional de padronização.

## Mecanismos encontrados

- `getAuthContext()` valida o cookie `auth-token`, verifica o JWT, valida `userId`/`administradoraId` e recarrega o usuário dentro da mesma administradora.
- `requireCobrancaAccess()`, `requireFinanceiroAccess()` e `requireCadastroAccess()` retornam o contexto com `administradoraId` e `userId`.
- Administradores (`admin`/`administrador`) preservam o acesso administrativo existente.
- Para usuários não administrativos, a autorização agora é **deny-by-default**: a chave de permissão deve ser exatamente `true`; ausência da chave não concede acesso.
- `hasPermission()` fornece a mesma regra para handlers que precisam retornar `401`/`403` diretamente.

## Rotas corrigidas

| Rota | Métodos | Autorização | Isolamento |
|---|---|---|---|
| `/api/propostas/faturas` | GET, POST, PATCH, DELETE | `financeiro.view/create/edit/delete` | `administradora_id` derivado do contexto em todas as consultas/escritas |
| `/api/cobranca/inadimplencia` | GET, POST | `cobranca.view/create` | Casos, parcelas e regras filtrados pela administradora do contexto |
| `/api/cobranca/conciliacao/transacoes` | GET, POST, PATCH | `cobranca.view/create/edit` | Transação e parcela vinculadas à administradora do contexto |
| `/api/propostas/pendentes` | GET | `cadastros.view` | Consulta passou a filtrar `administradora_id` |
| `/api/financeiro/fluxo-caixa/[id]` | GET, PUT, DELETE | `financeiro.view/edit/delete` | Consulta, atualização e cancelamento passaram a filtrar `administradora_id` |

A autorização ocorre antes de validação de corpo e antes de qualquer transação ou gravação nas rotas corrigidas.

## Inventário examinado

Foram localizados endpoints para propostas/aprovação/análise/faturas/vidas/relatórios, contratos e beneficiários, cobrança, inadimplência, pagamentos, conciliação, relatórios de cobrança, contas a pagar/receber, fluxo de caixa, faturas e pagamentos, arquivos bancários, configurações de cobrança, multas/juros, processos judiciais, advogados e tribunais.

A maioria das rotas financeiras já utiliza `requireFinanceiroAccess()` ou `requireCobrancaAccess()`. As rotas legadas que usam somente `getAuthContext()` foram identificadas para continuação, incluindo cobrança base, relatórios de cobrança, pagamentos e outras rotas auxiliares. Não foi feita alteração fora do conjunto corrigido nesta etapa para evitar mudança funcional não comprovada.

## Matriz aplicada

| Operação | Permissão aplicada |
|---|---|
| Consulta financeira/cobrança | `financeiro.view` / `cobranca.view` |
| Emissão ou criação | `financeiro.create` / `cobranca.create` |
| Alteração | `financeiro.edit` / `cobranca.edit` |
| Cancelamento/exclusão lógica | `financeiro.delete` / `cobranca.delete` |
| Baixa/pagamento | permanece com a regra existente da rota; requer revisão específica de granularidade |
| Estorno, aprovação de conciliação e negociação | lacuna de granularidade; não foram criadas permissões novas |

O modelo atual não representa separadamente leitura, emissão, baixa, estorno, importação, conciliação, negociação e configuração financeira. Esta é uma lacuna documentada; qualquer evolução deve ser aprovada e feita em etapa própria, sem alterar o banco agora.

## Testes e validações reais

- `node --test tests/api-contracts.test.mjs tests/finance-authorization.test.mjs`: **9 testes aprovados**.
- `npx tsc --noEmit`: **aprovado**.
- `npm run lint`: **aprovado com warnings preexistentes** de dependências de `useEffect`; nenhum erro introduzido foi reportado.
- `npm run build`: compilação concluída; o build reportou warnings preexistentes de lint e não houve erro de compilação.
- `git diff --check`: aprovado.
- Testes de integração com sessão real, perfis reais, banco e efeitos colaterais: **pendentes**, pois não foram executados conforme as restrições.

## Riscos remanescentes e próxima etapa

1. Rotas legadas ainda podem aceitar usuário autenticado sem exigir a permissão de negócio correspondente.
2. O modelo de permissões não distingue algumas operações financeiras sensíveis.
3. Não houve teste com dois usuários de administradoras diferentes em banco real.
4. Não houve teste de rollback/ausência de efeitos colaterais em transações negadas.
5. A matriz administrativa precisa ser validada com os perfis reais antes de ampliar qualquer acesso.

Nenhuma alteração de banco, migration, DDL, DML, dado ou permissão foi realizada.

## Arquivos alterados

- `lib/api-auth.ts`
- `app/api/propostas/faturas/route.ts`
- `app/api/cobranca/inadimplencia/route.ts`
- `app/api/cobranca/conciliacao/transacoes/route.ts`
- `app/api/propostas/pendentes/route.ts`
- `app/api/financeiro/fluxo-caixa/[id]/route.ts`
- `tests/finance-authorization.test.mjs`
- `docs/AUDITORIA_AUTORIZACAO_FINANCEIRA.md`
