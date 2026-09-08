-- Saneamento determinístico dos cadastros existentes.
-- Não remove registros nem altera documentos; apenas normaliza status equivalente.

CREATE TABLE IF NOT EXISTS auditoria_saneamento_cadastros (
  id BIGSERIAL PRIMARY KEY,
  migration VARCHAR(120) NOT NULL,
  tabela VARCHAR(120) NOT NULL,
  operacao VARCHAR(30) NOT NULL,
  registros_afetados INTEGER NOT NULL,
  detalhes JSONB,
  created_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP
);

DO $$
DECLARE
  affected INTEGER;
BEGIN
  UPDATE planos
  SET status = LOWER(status),
      updated_at = CURRENT_TIMESTAMP
  WHERE status IS NOT NULL
    AND status <> LOWER(status);

  GET DIAGNOSTICS affected = ROW_COUNT;
  INSERT INTO auditoria_saneamento_cadastros (migration, tabela, operacao, registros_afetados, detalhes)
  VALUES ('002_saneamento_cadastros', 'planos', 'normalizacao_status', affected,
          jsonb_build_object('regra', 'LOWER(status)', 'executado_em', CURRENT_TIMESTAMP));
END $$;

CREATE INDEX IF NOT EXISTS idx_auditoria_saneamento_tabela_data
  ON auditoria_saneamento_cadastros (tabela, created_at DESC);

-- Auditoria pós-migração esperada: sem administradora nula, sem órfãos,
-- sem divergência de administradora nos papéis e status padronizado em minúsculas.
