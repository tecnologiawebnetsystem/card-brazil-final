# Checklist de homologação

## Inventário

- [x] Páginas e APIs inventariadas por padrão de filesystem.
- [x] Ocorrências de possíveis mocks localizadas.
- [ ] Cada ocorrência classificada como UI, fallback ou dado de negócio.
- [ ] Cada página de negócio mapeada para endpoint e tabela.

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
- [ ] Comparar DDL versionado com schema live.
- [ ] Corrigir divergências de DDL.
- [ ] Validar órfãos por relacionamento de negócio.
- [ ] Executar seeds reproduzíveis em ambiente de homologação.

## Critério de saída

A homologação oficial só deve começar quando as pendências marcadas acima forem concluídas ou formalmente aceitas como exceção pelo responsável do projeto.
