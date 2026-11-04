# Banco de dados e APIs

## Banco

- DDL, migrations e seeds devem ficar em `database/`.
- Scripts legados permanecem em `sql/` até serem migrados com segurança.
- Toda alteração de schema deve ser idempotente e documentada.
- Consultas devem ser parametrizadas e limitar o tenant pela administradora autenticada.

## API

As rotas em `app/api/` devem ser adaptadores finos. Validação, autorização e persistência devem ser delegadas para `back-end/`. Respostas devem manter formato consistente e erros não devem expor credenciais ou detalhes internos.
