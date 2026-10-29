# Checklist de homologação

## Inventário

- [x] Páginas e APIs inventariadas por padrão de filesystem.
- [x] Ocorrências de possíveis mocks localizadas.
- [x] Cada ocorrência classificada por grupo e prioridade em `docs/MATRIZ_INTEGRACAO_HOMOLOGACAO.md`.
- [ ] Cada página de negócio mapeada para endpoint e tabela.
- [ ] Módulos pendentes sem dados reais bloqueados para homologação oficial.

## Banco de dados

- [x] Schema consultado no banco conectado.
- [x] 51 tabelas públicas identificadas.
- [x] 812 colunas identificadas.
- [x] 51 chaves primárias identificadas.
- [x] 124 chaves estrangeiras identificadas.
- [x] 29 constraints UNIQUE identificadas.
- [x] 352 constraints CHECK identificadas.
- [x] 83 índices identificados.
- [x] Script de auditoria somente leitura criado em `banco-dados/QA/01_auditoria_integridade.sql`.
- [x] Criar consulta de comparação em `banco-dados/QA/02_comparar_ddl_live.sql`.
- [ ] Comparar DDL versionado com schema live e corrigir divergências.
- [ ] Validar órfãos por relacionamento de negócio.
- [x] Documentar ordem e regras dos seeds em `banco-dados/QA/03_seed_homologacao.md`.
- [ ] Executar seeds reproduzíveis em ambiente de homologação dedicado.
- [ ] Avaliar índices para colunas FK com `EXPLAIN`, sem criar índices automaticamente.

## Validação desta rodada

- [x] Build de produção executado com sucesso: 193 páginas geradas.
- [x] Auditoria live confirmou ausência de tabelas sem PK e FKs apontando para tabelas inexistentes.
- [x] Mocks classificados por domínio em `docs/MATRIZ_INTEGRACAO_HOMOLOGACAO.md`.
- [x] Procedimentos de comparação DDL e seed documentados.

## Critério de saída

A homologação oficial só deve começar quando as pendências marcadas acima forem concluídas ou formalmente aceitas como exceção pelo responsável do projeto.
