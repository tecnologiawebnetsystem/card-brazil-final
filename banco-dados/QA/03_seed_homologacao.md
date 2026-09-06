# Seed de homologação

Os seeds existentes estão organizados em `banco-dados/DML/` e devem ser executados em ordem após as DDLs. A execução deve ocorrer somente em uma base de homologação dedicada.

## Ordem recomendada

1. `01_administradora_inicial.sql`
2. `02_roles_iniciais.sql`
3. `04_pessoas_teste.sql`
4. `05_operadoras_teste.sql`
5. `06_estipulantes_teste.sql`
6. `07_corretores_agenciadores_teste.sql`
7. `08_produtos_planos_teste.sql`
8. `11_propostas_beneficiarios_teste.sql`
9. `12_beneficiarios_teste.sql`
10. `13_contas_receber_teste.sql`
11. `14_contas_pagar_teste.sql`
12. `15_fluxo_caixa_teste.sql`
13. `16_cobranca_judicial_teste.sql`
14. `17_multas_juros_teste.sql`

## Regras

- Não executar `00_drop_database.sql` em homologação compartilhada.
- Seeds devem ser idempotentes ou executados apenas em banco limpo.
- Validar PK/FK após a carga com `QA/01_auditoria_integridade.sql`.
- Registrar quantidade inserida por tabela.
- Nunca utilizar dados pessoais reais; usar somente dados fictícios.
- Falhas de seed devem interromper o processo e gerar evidência.
