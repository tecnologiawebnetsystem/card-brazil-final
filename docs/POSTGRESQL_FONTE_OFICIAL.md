# PostgreSQL como fonte oficial do CARD BRASIL

**Status:** documentação canônica baseada em inspeção estática do repositório.

**Data da inspeção:** 2026-10-09.

## 1. Conclusão

A aplicação atual utiliza PostgreSQL/Neon como banco de execução:

- biblioteca: `@neondatabase/serverless`;
- conexão: `DATABASE_URL` lida em `lib/database.ts`;
- consultas parametrizadas com placeholders PostgreSQL (`$1`, `$2`, ...);
- transações por `connection.transaction(...)`;
- uso de recursos PostgreSQL como `jsonb`, `plpgsql`, `ON CONFLICT`, índices parciais e `DO $$`.

O mecanismo oficial de evolução do esquema, conforme a evidência disponível no repositório, é a sequência versionada em `banco-dados/migrations/`:

```text
001_cadastros_postgresql.sql
002_saneamento_cadastros.sql
003_preenchimento_deterministico.sql
004_dados_ficticios_homologacao.sql
005_integridade_cobranca_financeira.sql
006_conciliacao_inadimplencia.sql
007_integracao_fluxo_principal.sql
```

Essa conclusão é sobre a fonte versionada do projeto. **Não foi confirmado que todas as migrations foram executadas no banco conectado**, pois não foi feita consulta ao schema live nem encontrado um runner de migrations no código.

## 2. Configuração e acesso ao banco

### Confirmado

`lib/database.ts`:

- inicializa `neon(process.env.DATABASE_URL)` sob demanda;
- expõe `query`, `queryOne`, `transaction` e `pool.execute`;
- normaliza placeholders `?` para `$1`, `$2`, ...;
- não contém conexão MySQL;
- não imprime valores de variáveis de ambiente.

`package.json` contém `@neondatabase/serverless` e também `mysql2`. A presença de `mysql2` é uma dependência disponível, mas não foi encontrada referência de uso na camada de acesso examinada; portanto, não é evidência de que o banco ativo seja MySQL.

### Não confirmado

- versão efetivamente aplicada de cada migration;
- existência de tabela de controle de migrations;
- schema live do banco;
- existência de todas as tabelas esperadas em homologação ou produção;
- existência de processo CI/CD que execute SQL automaticamente.

## 3. Ordem de aplicação

A ordem declarada pelo repositório é numérica:

1. `001_cadastros_postgresql.sql`
2. `002_saneamento_cadastros.sql`
3. `003_preenchimento_deterministico.sql`
4. `004_dados_ficticios_homologacao.sql`
5. `005_integridade_cobranca_financeira.sql`
6. `006_conciliacao_inadimplencia.sql`
7. `007_integracao_fluxo_principal.sql`

A migration `004` contém dados fictícios de homologação e não deve ser tratada como criação estrutural para produção.

As migrations `005`, `006` e `007` usam PostgreSQL e são incrementais. Elas incluem `BEGIN`/`COMMIT`, `DO $$`, `plpgsql`, `jsonb`, índices parciais e `ON CONFLICT`/`IF NOT EXISTS` conforme o caso.

## 4. DDL legado e classificação

### LEGADO — NÃO EXECUTAR NO POSTGRESQL

Os seguintes DDLs usam sintaxe MySQL identificada estaticamente, incluindo `USE cardbrazil`, `AUTO_INCREMENT`, `ENUM`, `ENGINE=InnoDB`, `COLLATE` e/ou `ON UPDATE CURRENT_TIMESTAMP`:

```text
banco-dados/DDL/00_administradoras.sql
banco-dados/DDL/01_usuarios_autenticacao.sql
banco-dados/DDL/02_pessoas_enderecos_bancarios.sql
banco-dados/DDL/03_operadoras_estipulantes.sql
banco-dados/DDL/04_corretores_agenciadores.sql
banco-dados/DDL/05_planos_produtos.sql
banco-dados/DDL/06_financeiro_auditoria.sql
banco-dados/DDL/07_propostas.sql
banco-dados/DDL/08_tabelas_gerais.sql
banco-dados/DDL/09_modulo_financeiro.sql
```

Eles foram preservados sem alteração. Não devem ser usados para provisionar Neon/PostgreSQL.

### PostgreSQL fragmentário — NÃO É FONTE EXECUTÁVEL OFICIAL

`banco-dados/DDL/10_faturamento_bancario.sql` usa sintaxe PostgreSQL (`BIGSERIAL`, `JSONB`, `TIMESTAMPTZ`, `CHECK`), mas é um fragmento de tabelas bancárias/faturamento sem mecanismo de versionamento, controle de aplicação ou garantia de compatibilidade completa com as migrations. Portanto, deve ser tratado como artefato histórico/referencial até ser incorporado explicitamente a uma migration futura autorizada.

Não foi convertido, renomeado, removido ou executado nenhum DDL.

## 5. Objetos financeiros confirmados nas migrations

A confirmação abaixo é da definição encontrada nas migrations, não uma confirmação do banco live.

### `conciliacao_transacoes`

Origem: `006_conciliacao_inadimplencia.sql`.

- `id BIGSERIAL PRIMARY KEY`;
- `administradora_id BIGINT NOT NULL`;
- `arquivo_id BIGINT REFERENCES arquivos_bancarios(id)`;
- `identificador_externo VARCHAR(180) NOT NULL`;
- dados bancários e transacionais em colunas textuais/date/numeric;
- `valor NUMERIC(14,2) NOT NULL CHECK (valor > 0)`;
- `dados JSONB NOT NULL`;
- status com `CHECK`;
- `parcela_id BIGINT`, `pagamento_id BIGINT`;
- unicidade `(administradora_id, identificador_externo)`;
- índices por administradora/status/data.

### `regras_inadimplencia`

Origem: `006_conciliacao_inadimplencia.sql`.

Possui versão, vigência, parâmetros de notificação/procedimento, configuração `JSONB`, status ativo e unicidade `(administradora_id, nome, versao)`.

### `inadimplencia_casos`

Origem: `006_conciliacao_inadimplencia.sql`.

Relaciona administradora e parcela, com contrato/beneficiário/regra opcionais, saldo, dias de atraso, status e unicidade `(administradora_id, parcela_id)`.

### `notificacoes_inadimplencia`

Origem: `006_conciliacao_inadimplencia.sql`.

Relaciona caso, parcela, contrato e beneficiário; registra meio, template, destinatário, conteúdo, tentativa, status e resultado `JSONB`.

### `auditoria_inadimplencia`

Origem: `006_conciliacao_inadimplencia.sql`.

Registra ação, dados anteriores/novos, origem, usuário e referências à administradora, caso e regra.

### `faturas_mensais`, `contas_receber`, `contratos`, `beneficiarios`

As migrations `005` a `007` pressupõem a existência desses objetos e adicionam integridade/indexação sobre eles. A criação estrutural completa desses objetos não está contida integralmente nas migrations `005` a `007`; suas definições também aparecem nos DDLs legados MySQL e/ou em outros arquivos do repositório. Por isso, tipos completos, nulabilidade e todas as FKs não estão confirmados somente por essas migrations.

Confirmado em `007_integracao_fluxo_principal.sql`:

- índice único parcial de `faturas_mensais` por administradora, proposta e competência;
- índice único parcial de `contas_receber` por administradora e número do documento;
- índice parcial de contratos por administradora, plano e status;
- índice parcial de beneficiários por administradora, contrato, plano e status.

### `cobrancas`, `cobranca_parcelas`, `cobranca_pagamentos`, `cobranca_eventos`, `contas_pagar`, `fluxo_caixa`

Esses objetos são referenciados pelo código e/ou DDLs, mas sua definição PostgreSQL completa e sua presença no banco live não foram confirmadas nesta inspeção. A migration `005` confirma parte da integridade entre cobrança e `contas_receber`, incluindo triggers, índices e constraints de valores.

## 6. Integridade PostgreSQL confirmada

A migration `005_integridade_cobranca_financeira.sql` confirma:

- validação de `conta_receber_id` pertencente à mesma administradora;
- triggers para `cobrancas` e `cobranca_parcelas`;
- checks de valores não negativos e `valor_pago <= valor_total`;
- índice único de idempotência em pagamentos por administradora;
- validação prévia de referências órfãs antes da criação das estruturas incrementais.

A migration `006` confirma:

- idempotência da transação bancária por administradora e identificador externo;
- unicidade de itens de arquivo bancário quando aplicável;
- vínculo lógico entre conciliação, parcela e pagamento, sem FKs declaradas para esses dois campos nessa migration.

A migration `007` confirma:

- unicidade parcial de faturamento por proposta e competência;
- unicidade parcial de obrigação financeira por documento;
- índices para consultas de contratos e beneficiários.

## 7. Scripts de QA e homologação

Foram encontrados scripts somente leitura ou orientativos:

- `banco-dados/QA/01_auditoria_integridade.sql`: inventário de tabelas, colunas, constraints e índices do schema `public`;
- `banco-dados/QA/02_comparar_ddl_live.sql`: consultas para comparar schema live, constraints e índices;
- `banco-dados/QA/03_seed_homologacao.md`: orientações para seeds em ambiente dedicado;
- `docs/CHECKLIST_HOMOLOGACAO.md`: checklist que ainda marca a comparação com schema live como pendente.

Esses artefatos suportam validação futura, mas não constituem um runner de migrations.

## 8. Divergências documentais identificadas

Os documentos abaixo ainda orientam execução MySQL ou apresentam instruções antigas:

- `docs/BACKEND_SETUP.md`;
- `docs/CHECKLIST_CORRECOES_v0.md`;
- `docs/CHECKLIST_BUILD_FINAL.md`;
- `docs/ANALISE_COMPLETA_FINAL.md`.

Eles contêm comandos `mysql` e devem ser considerados documentação legada até revisão. Esta documentação não reescreve esses arquivos para evitar alterações amplas fora do escopo.

## 9. Validação segura executada

Executado nesta tarefa:

- inspeção estática de `lib/database.ts`, `package.json`, migrations, DDLs, scripts QA e referências de execução;
- classificação de sintaxe MySQL/PostgreSQL;
- conferência da ordem numérica das migrations;
- conferência de que as migrations `005`, `006` e `007` usam PostgreSQL;
- conferência de referências do código a um runner de migrations.

Não executado:

- SQL contra qualquer banco;
- migration ou alteração de schema;
- seed ou DML;
- comparação com schema live;
- validação de conexão, tabelas reais ou versão aplicada.

Nenhum dado, tabela, índice, constraint ou migration foi alterado nesta tarefa.

## 10. Pré-requisitos para novo ambiente

Antes de provisionar um ambiente novo, é necessário:

1. obter uma cópia do schema PostgreSQL aprovado ou executar a etapa de bootstrap PostgreSQL oficialmente definida pelo projeto;
2. registrar as migrations aplicadas em mecanismo de controle apropriado;
3. validar pré-requisitos das migrations, especialmente as tabelas-base usadas por `001`, `005`, `006` e `007`;
4. aplicar migrations apenas em PostgreSQL de homologação dedicado;
5. executar `QA/01_auditoria_integridade.sql` e `QA/02_comparar_ddl_live.sql` em modo somente leitura;
6. executar testes de contrato e fluxo sem dados de produção;
7. promover para produção somente após aprovação formal e backup/ponto de restauração.

O procedimento exato de bootstrap ainda não está documentado no repositório e permanece pendente.

## 11. Pendências que exigem PostgreSQL de homologação

- confirmar quais migrations estão aplicadas;
- confirmar existência e definição de todas as tabelas financeiras;
- comparar tipos, nulabilidade, FKs, índices e constraints com as migrations;
- verificar órfãos e duplicidades antes de qualquer aplicação;
- testar reconstrução de uma base nova;
- validar transações e concorrência das APIs financeiras;
- decidir se `DDL/10_faturamento_bancario.sql` será incorporado em migration futura ou permanecerá referencial;
- substituir ou marcar explicitamente a documentação MySQL antiga.

## 12. Próximo passo recomendado

Criar um ambiente PostgreSQL/Neon de homologação isolado, sem dados de produção, e executar somente o inventário QA e a comparação do schema. Após confirmar o estado real, elaborar uma migration/bootstrap PostgreSQL aprovada — sem converter ou executar silenciosamente os DDLs legados.

Até essa confirmação, não se deve afirmar que o banco implantado corresponde integralmente às migrations.
