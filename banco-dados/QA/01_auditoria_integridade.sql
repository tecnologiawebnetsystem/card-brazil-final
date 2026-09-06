-- Auditoria somente leitura do schema público.
-- Executar em homologação antes de cada rodada de testes.

-- Resumo estrutural.
SELECT
  (SELECT count(*) FROM information_schema.tables WHERE table_schema = 'public' AND table_type = 'BASE TABLE') AS tabelas,
  (SELECT count(*) FROM information_schema.columns WHERE table_schema = 'public') AS colunas,
  (SELECT count(*) FROM information_schema.table_constraints WHERE table_schema = 'public' AND constraint_type = 'PRIMARY KEY') AS chaves_primarias,
  (SELECT count(*) FROM information_schema.table_constraints WHERE table_schema = 'public' AND constraint_type = 'FOREIGN KEY') AS chaves_estrangeiras,
  (SELECT count(*) FROM information_schema.table_constraints WHERE table_schema = 'public' AND constraint_type = 'UNIQUE') AS constraints_unicas,
  (SELECT count(*) FROM information_schema.table_constraints WHERE table_schema = 'public' AND constraint_type = 'CHECK') AS constraints_check,
  (SELECT count(*) FROM pg_indexes WHERE schemaname = 'public') AS indices;

-- Tabelas sem chave primária.
SELECT t.table_name
FROM information_schema.tables t
WHERE t.table_schema = 'public' AND t.table_type = 'BASE TABLE'
  AND NOT EXISTS (
    SELECT 1 FROM information_schema.table_constraints c
    WHERE c.table_schema = t.table_schema AND c.table_name = t.table_name AND c.constraint_type = 'PRIMARY KEY'
  )
ORDER BY t.table_name;

-- Foreign keys com referência quebrada ou constraint incompleta.
SELECT tc.table_name, kcu.column_name, ccu.table_name AS tabela_referenciada, ccu.column_name AS coluna_referenciada
FROM information_schema.table_constraints tc
JOIN information_schema.key_column_usage kcu USING (constraint_name, table_schema, table_name)
JOIN information_schema.constraint_column_usage ccu USING (constraint_name, table_schema)
WHERE tc.table_schema = 'public' AND tc.constraint_type = 'FOREIGN KEY'
ORDER BY tc.table_name, kcu.column_name;

-- Colunas sem tipo/default explícito não nulo são listadas para revisão funcional.
SELECT table_name, column_name, data_type, is_nullable, column_default
FROM information_schema.columns
WHERE table_schema = 'public'
ORDER BY table_name, ordinal_position;

-- Índices públicos.
SELECT schemaname, tablename, indexname, indexdef
FROM pg_indexes
WHERE schemaname = 'public'
ORDER BY tablename, indexname;
