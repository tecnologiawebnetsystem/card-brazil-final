# Análise Completa: DDL vs DML vs Páginas

## 📊 RESUMO EXECUTIVO

### Tabelas Criadas nos DDLs (38 tabelas):
1. **DDL 00**: administradoras
2. **DDL 01**: roles, perfis_usuario, usuarios, usuario_roles, sessoes_usuario, logs_autenticacao
3. **DDL 02**: pessoas, enderecos, dados_bancarios
4. **DDL 03**: operadoras, estipulantes (duplicado), subestipulantes (duplicado)
5. **DDL 04**: estipulantes, subestipulantes, corretores, agenciadores
6. **DDL 05**: planos, produtos, contratos, beneficiarios
7. **DDL 06**: movimentacoes_financeiras, auditoria, alcadas, permissoes
8. **DDL 07**: propostas
9. **DDL 08**: bancos, agencias_bancarias, moedas, historico_cotacoes, feriados
10. **DDL 09**: contas_receber, contas_pagar, fluxo_caixa, advogados, tribunais, processos_judiciais, configuracoes_multas_juros, historico_multas_juros

---

## 🚨 PROBLEMAS CRÍTICOS ENCONTRADOS

### 1. **DUPLICAÇÃO DE TABELAS**
- `estipulantes` está definida em DDL 03 E DDL 04
- `subestipulantes` está definida em DDL 03 E DDL 04
- **SOLUÇÃO**: Remover DDL 03 completamente ou mesclar com DDL 04

### 2. **DMLs SEM DDL CORRESPONDENTE**
- `DML 08_produtos_planos_teste.sql` tenta inserir em `planos_faixa` mas essa tabela NÃO EXISTE no DDL 05

### 3. **CAMPOS INCOMPATÍVEIS ENTRE DDL E DML**

#### DML 04 (pessoas_teste.sql):
- ❌ Usa `sexo` → DDL tem `genero`
- ❌ Usa `cpf_cnpj` → DDL tem `cpf` OU `cnpj` separados
- ✅ **JÁ CORRIGIDO**

#### DML 05 (operadoras_teste.sql):
- ❌ Falta campo `codigo` (obrigatório no DDL)
- ❌ Estrutura: `(id_administradora, nome, cnpj, registro_ans, telefone, email, ativo)`
- ✅ DDL: `codigo, nome, razao_social, cnpj, registro_ans, telefone, email, site, endereco, cidade, estado, cep, ativo`

#### DML 06 (estipulantes_teste.sql):
- ❌ Usa `pessoa_id` → DDL NÃO TEM esse campo
- ❌ Falta campos obrigatórios: `nome`, `cnpj`, `telefone`, `email`
- ❌ Estrutura: `(id_administradora, pessoa_id, codigo, data_cadastro, ativo)`
- ✅ DDL: `codigo, nome, razao_social, cnpj, inscricao_estadual, telefone, email, site, endereco, cidade, estado, cep, data_cadastro, ativo`

#### DML 07 (corretores_agenciadores_teste.sql):
- ❌ Usa `pessoa_id` → DDL NÃO TEM esse campo
- ❌ Usa `codigo_susep` → DDL tem `susep`
- ❌ Falta campos obrigatórios: `nome`, `cpf_cnpj`, `telefone`, `email`
- ❌ Estrutura corretores: `(id_administradora, pessoa_id, codigo_susep, data_cadastro, ativo)`
- ✅ DDL corretores: `codigo, nome, cpf_cnpj, susep, telefone, celular, email, comissao_percentual, endereco, cidade, estado, cep, data_cadastro, ativo`
- ❌ Estrutura agenciadores: `(id_administradora, pessoa_id, codigo, data_cadastro, ativo)`
- ✅ DDL agenciadores: `codigo, nome, cpf_cnpj, telefone, celular, email, comissao_percentual, endereco, cidade, estado, cep, data_cadastro, ativo`

#### DML 08 (produtos_planos_teste.sql):
- ❌ Tenta inserir em `produtos` mas DDL 05 tem estrutura diferente
- ❌ Tenta inserir em `planos_faixa` mas essa tabela NÃO EXISTE
- ❌ Estrutura produtos: `(id_administradora, nome, descricao, categoria, ativo)`
- ✅ DDL produtos: `operadora_id, codigo, nome, descricao, tipo, categoria, abrangencia, acomodacao, cobertura, carencia_geral, valor_base, ativo`

#### DML 12 (beneficiarios_teste.sql):
- ⚠️ Precisa verificar se `contrato_id` e `pessoa_id` existem antes de inserir
- ⚠️ Precisa verificar se `titular_id` existe para dependentes

#### DML 13-17 (Módulo Financeiro):
- ⚠️ Precisa verificar se foreign keys existem (beneficiario_id, proposta_id, etc)

---

## 📋 TABELAS FALTANTES (Páginas sem DDL/DML)

### Páginas que NÃO têm DDL correspondente:
1. **Convênios** (`/cadastros/convenios`) - Precisa criar DDL + DML
2. **Planos Faixa** (`/cadastros/planos-faixa`) - Precisa criar DDL + DML
3. **Carências** (`/carencias`) - Precisa criar DDL + DML
4. **Carteirinhas** (`/beneficiarios/carteirinhas`) - Pode usar tabela beneficiarios
5. **Cotação** (`/cotacao`) - Pode usar tabela moedas/historico_cotacoes
6. **Inadimplência** (`/inadimplencia`) - Precisa criar DDL + DML
7. **Pagamentos** (`/pagamentos`) - Pode usar contas_receber/contas_pagar
8. **Prazos** (`/prazos`) - Precisa criar DDL + DML
9. **Prêmios** (`/premios`) - Precisa criar DDL + DML
10. **Remessa** (`/remessa`) - Precisa criar DDL + DML
11. **Renovações** (`/renovacoes`) - Precisa criar DDL + DML
12. **Reservas** (`/reservas`) - Precisa criar DDL + DML
13. **Relatórios Obrigatórios** (`/relatorios-obrigatorios`) - Precisa criar DDL + DML
14. **Módulo Contábil** (15+ páginas) - Precisa criar DDL + DML completo
15. **Módulo Cobrança** (20+ páginas) - Muitas páginas sem DDL/DML

---

## ✅ PLANO DE CORREÇÃO

### FASE 1: Corrigir DDLs Existentes
1. ✅ Remover duplicação de estipulantes/subestipulantes (manter apenas DDL 04)
2. ✅ Adicionar tabela `planos_faixa` no DDL 05
3. ✅ Adicionar tabela `convenios` no DDL apropriado

### FASE 2: Corrigir TODOS os DMLs Existentes
1. ✅ DML 05 - Operadoras (adicionar campo `codigo` e outros faltantes)
2. ✅ DML 06 - Estipulantes (remover `pessoa_id`, adicionar campos obrigatórios)
3. ✅ DML 07 - Corretores/Agenciadores (remover `pessoa_id`, adicionar campos obrigatórios)
4. ✅ DML 08 - Produtos/Planos (ajustar estrutura completa)
5. ✅ DML 12 - Beneficiários (verificar foreign keys)
6. ✅ DML 13-17 - Financeiro (verificar foreign keys)

### FASE 3: Criar DDLs e DMLs Faltantes
1. ✅ Criar DDL para Convênios
2. ✅ Criar DDL para Carências
3. ✅ Criar DDL para Inadimplência
4. ✅ Criar DDL para Prazos
5. ✅ Criar DDL para Prêmios
6. ✅ Criar DDL para Remessa/Retorno
7. ✅ Criar DDL para Renovações
8. ✅ Criar DDL para Reservas Técnicas
9. ✅ Criar DDL completo para Módulo Contábil
10. ✅ Criar DDL completo para Módulo Cobrança

### FASE 4: Criar DMLs de Teste
1. ✅ Criar DML para cada DDL novo criado
2. ✅ Garantir pelo menos 10-20 registros de teste por tabela

---

## 🎯 ORDEM DE EXECUÇÃO DOS SCRIPTS

### DDLs (ordem correta):
\`\`\`
00_administradoras.sql
01_usuarios_autenticacao.sql
02_pessoas_enderecos_bancarios.sql
04_corretores_agenciadores.sql (contém estipulantes, subestipulantes, corretores, agenciadores)
05_planos_produtos.sql (adicionar planos_faixa e convenios)
06_financeiro_auditoria.sql
07_propostas.sql
08_tabelas_gerais.sql
09_modulo_financeiro.sql
10_modulo_cobranca.sql (NOVO)
11_modulo_contabil.sql (NOVO)
12_tabelas_complementares.sql (NOVO - carências, inadimplência, prazos, prêmios, etc)
\`\`\`

### DMLs (ordem correta):
\`\`\`
01_administradora_inicial.sql
02_roles_iniciais.sql
03_usuarios_iniciais.sql
04_pessoas_teste.sql (CORRIGIR)
05_operadoras_teste.sql (CORRIGIR)
06_estipulantes_teste.sql (CORRIGIR)
07_corretores_agenciadores_teste.sql (CORRIGIR)
08_produtos_planos_teste.sql (CORRIGIR)
09_bancos_brasileiros.sql
10_moedas_principais.sql
11_feriados_nacionais.sql
12_beneficiarios_teste.sql
13_contas_receber_teste.sql
14_contas_pagar_teste.sql
15_fluxo_caixa_teste.sql
16_cobranca_judicial_teste.sql
17_multas_juros_teste.sql
18_convenios_teste.sql (NOVO)
19_carencias_teste.sql (NOVO)
20_inadimplencia_teste.sql (NOVO)
... (continuar para todas as tabelas novas)
\`\`\`

---

## 📝 PRÓXIMOS PASSOS

1. **URGENTE**: Corrigir DMLs 05, 06, 07, 08 para corresponder aos DDLs
2. **IMPORTANTE**: Remover DDL 03 (duplicado)
3. **NECESSÁRIO**: Criar DDLs faltantes para módulos Contábil e Cobrança
4. **RECOMENDADO**: Criar DMLs de teste para todas as novas tabelas

---

**Data da Análise**: 2025-01-26
**Status**: 🔴 CRÍTICO - Múltiplas inconsistências encontradas
**Ação Requerida**: Correção imediata antes do build
