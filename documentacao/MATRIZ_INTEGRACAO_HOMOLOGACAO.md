# Matriz de integração para homologação

Data: 05/09/2026

## Classificação das telas com dados fixos

| Grupo | Módulos identificados | Tratamento necessário | Prioridade |
|---|---|---|---|
| Financeiro | Remessa, Retorno, Conciliação, Cobrança, Pagamentos, Prêmios | Criar endpoints de leitura/escrita e substituir registros locais | Alta |
| Operações | Reservas, Renovações, Sinistros, Prazos | Mapear entidades existentes; criar schema/API quando ausente | Alta |
| Beneficiários | Inclusão, Exclusão, Carteirinhas, Dependentes | Usar beneficiários, pessoas, propostas e contratos reais | Alta |
| Segurança | Usuários | Remover `pessoasMock`; carregar pessoas pela API e manter permissões reais | Alta |
| Contábil | Plano de contas, Lançamentos | Conectar a tabelas contábeis; não usar arrays de apresentação | Média |
| Relatórios | Relatórios inteligentes e relatórios operacionais | Consultas agregadas reais; estados vazios quando não houver dados | Média |
| Infraestrutura | Agente cobrador, Lotes de aviso de crédito | Criar/usar entidades de cobrança e processamento | Média |

## Critério de classificação

- **Integrado:** dados vêm de API ou Server Component e têm operações verificáveis.
- **UI permitido:** constantes são somente opções, status, labels ou configuração visual.
- **Pendente:** entidades/registros estão em arrays exibidos em tabela, cards ou gráficos.
- **Bloqueado:** ação promete persistência, mas não existe endpoint ou tabela correspondente.

## Ordem de implementação

1. Usuários, Beneficiários e Dependentes.
2. Cobrança, Contas a Receber, Contas a Pagar e Pagamentos.
3. Propostas, Contratos e Renovações.
4. Sinistros, Reservas e módulos operacionais.
5. Relatórios, Contábil e Inteligentes.
6. Remessa, Retorno, Conciliações e Agente Cobrador.

Nenhum mock deve ser removido sem confirmar a tabela e o contrato da API correspondente. Enquanto um módulo não estiver integrado, a tela deve exibir estado de homologação pendente em vez de apresentar dados fictícios como se fossem reais.

## Banco conectado

A auditoria live encontrou 51 tabelas, 812 colunas, 51 PKs, 124 FKs, 29 UNIQUEs, 352 CHECKs e 83 índices. Não foram encontradas tabelas sem PK nem constraints FK apontando para tabelas inexistentes. A consulta também identificou colunas FK sem índice dedicado; elas devem ser avaliadas por volume e plano de execução antes de criar índices.
