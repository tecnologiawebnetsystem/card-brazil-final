-- Auditoria somente leitura para comparar expectativas do projeto com o schema live.
-- Executar uma consulta por vez no ambiente de homologação.

-- 1. Inventário de tabelas e colunas do schema live.
SELECT table_name, column_name, data_type, udt_name, is_nullable, column_default
FROM information_schema.columns
WHERE table_schema = 'public'
ORDER BY table_name, ordinal_position;

-- 2. Constraints completas.
SELECT tc.table_name, tc.constraint_name, tc.constraint_type,
       kcu.column_name, ccu.table_name AS referenced_table,
       ccu.column_name AS referenced_column
FROM information_schema.table_constraints tc
LEFT JOIN information_schema.key_column_usage kcu
  ON kcu.constraint_name = tc.constraint_name
 AND kcu.table_schema = tc.table_schema
 AND kcu.table_name = tc.table_name
LEFT JOIN information_schema.constraint_column_usage ccu
  ON ccu.constraint_name = tc.constraint_name
 AND ccu.table_schema = tc.table_schema
WHERE tc.table_schema = 'public'
ORDER BY tc.table_name, tc.constraint_name, kcu.ordinal_position;

-- 3. Índices e definições.
SELECT schemaname, tablename, indexname, indexdef
FROM pg_indexes
WHERE schemaname = 'public'
ORDER BY tablename, indexname;

-- 4. Possíveis órfãos genéricos: para cada FK, revisar os registros cujo valor
-- não encontra correspondente na tabela referenciada. A validação de dados
-- deve ser gerada por relacionamento, pois FKs compostas exigem comparação
-- por todas as colunas da constraint.
SELECT tc.constraint_name, tc.table_name, ccu.table_name AS referenced_table,
       array_agg(kcu.column_name ORDER BY kcu.ordinal_position) AS columns,
       array_agg(ccu.column_name ORDER BY ccu.column_name) AS referenced_columns
FROM information_schema.table_constraints tc
JOIN information_schema.key_column_usage kcu
  ON kcu.constraint_name = tc.constraint_name AND kcu.table_schema = tc.table_schema
JOIN information_schema.constraint_column_usage ccu
  ON ccu.constraint_name = tc.constraint_name AND ccu.table_schema = tc.table_schema
WHERE tc.table_schema = 'public' AND tc.constraint_type = 'FOREIGN KEY'
GROUP BY tc.constraint_name, tc.table_name, ccu.table_name
ORDER BY tc.table_name, tc.constraint_name;

-- 5. Tabelas de negócio sem índice de busca óbvio devem ser revisadas com
-- EXPLAIN (ANALYZE, BUFFERS) antes de criar índices em produção.
