# Arquitetura do CardBrazil

## Visão geral

O CardBrazil é uma aplicação Next.js com App Router. O diretório `app/` é a camada de entrada: páginas, layouts e adaptadores HTTP. A lógica de negócio deve permanecer fora das páginas, em `back-end/`, e a interface reutilizável deve permanecer em `components/`.

```text
app/             Rotas Next.js e API Routes
components/      Interface e componentes reutilizáveis
back-end/        Casos de uso, domínio, segurança e integrações
lib/             Utilitários e clientes compartilhados
 database/       Migrações, DDL e seeds organizados
 docs/            Decisões e documentação técnica
 tests/           Testes por camada
```

## Regras de dependência

- `app/` pode importar `components/`, `lib/` e casos de uso de `back-end/`.
- `components/` não acessa banco diretamente.
- `components/ui/` não conhece regras de negócio.
- `back-end/domains/` não importa React, Next.js ou componentes visuais.
- `back-end/infrastructure/` concentra banco e integrações externas.
- As API Routes validam entrada, chamam casos de uso e formatam respostas HTTP.
- Toda regra de autorização deve passar por `back-end/security/`.

## Estratégia de migração

A estrutura será adotada de forma incremental. As rotas existentes não serão movidas para fora de `app/`, pois o App Router depende da convenção de pastas. Novos módulos devem seguir a estrutura nova e módulos antigos serão migrados quando houver mudança funcional.
