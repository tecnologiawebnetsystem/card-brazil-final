# Domínios de negócio

## Cadastros
Pessoas, pessoas jurídicas, administradoras, operadoras, estipulantes, agenciadores, corretores, produtos e planos.

## Beneficiários
Segurados, dependentes, movimentações cadastrais e vínculos com contratos.

## Propostas
Criação, análise, aprovação e acompanhamento de propostas.

## Cobrança
Parcelas, recebimentos, inadimplência e conciliação.

## Financeiro
Contas, fluxo de caixa, pagamentos, multas e juros.

## Tabelas
Catálogos auxiliares utilizados pelos demais domínios.

## Segurança
Usuários, perfis, permissões, controle de acesso, auditoria e personalização.

## Regra de organização
Cada domínio novo deve concentrar seus tipos, validadores, repositórios, serviços e componentes específicos. O que for compartilhado entre domínios deve ir para `back-end/shared`, `components/shared` ou `lib`, nunca ser duplicado em uma página.
