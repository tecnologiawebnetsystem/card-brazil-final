-- Preenchimento determinístico de campos técnicos nullable.
-- Não inventa dados pessoais, documentos, contatos, endereços ou valores financeiros.

CREATE TABLE IF NOT EXISTS auditoria_preenchimento_deterministico (
  id BIGSERIAL PRIMARY KEY,
  tabela VARCHAR(120) NOT NULL,
  coluna VARCHAR(120) NOT NULL,
  registros_afetados INTEGER NOT NULL,
  regra VARCHAR(240) NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP
);

DO $$
DECLARE
  item RECORD;
  affected INTEGER;
BEGIN
  FOR item IN
    SELECT DISTINCT table_name, column_name
    FROM information_schema.columns
    WHERE table_schema = 'public'
      AND is_nullable = 'YES'
      AND column_name IN ('created_at', 'updated_at')
  LOOP
    EXECUTE format('UPDATE %I SET %I = CURRENT_TIMESTAMP WHERE %I IS NULL', item.table_name, item.column_name, item.column_name);
    GET DIAGNOSTICS affected = ROW_COUNT;
    IF affected > 0 THEN
      INSERT INTO auditoria_preenchimento_deterministico (tabela, coluna, registros_afetados, regra)
      VALUES (item.table_name, item.column_name, affected, 'CURRENT_TIMESTAMP para campo técnico nulo');
    END IF;
  END LOOP;

  FOR item IN
    SELECT DISTINCT table_name, column_name
    FROM information_schema.columns
    WHERE table_schema = 'public'
      AND is_nullable = 'YES'
      AND data_type = 'boolean'
      AND column_name IN ('ativo', 'is_active', 'enabled')
  LOOP
    EXECUTE format('UPDATE %I SET %I = TRUE WHERE %I IS NULL', item.table_name, item.column_name, item.column_name);
    GET DIAGNOSTICS affected = ROW_COUNT;
    IF affected > 0 THEN
      INSERT INTO auditoria_preenchimento_deterministico (tabela, coluna, registros_afetados, regra)
      VALUES (item.table_name, item.column_name, affected, 'TRUE para flag técnica nula');
    END IF;
  END LOOP;
END $$;

CREATE INDEX IF NOT EXISTS idx_auditoria_preenchimento_data
  ON auditoria_preenchimento_deterministico (created_at DESC);
