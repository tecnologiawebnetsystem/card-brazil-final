-- Migração incremental segura para PostgreSQL/Neon.
-- Executar em homologação, validar duplicidades e somente então aplicar em produção.

CREATE INDEX IF NOT EXISTS idx_pessoas_administradora_status ON pessoas (administradora_id, status) WHERE deleted_at IS NULL;
CREATE INDEX IF NOT EXISTS idx_operadoras_administradora_status ON operadoras (administradora_id, status) WHERE deleted_at IS NULL;
CREATE INDEX IF NOT EXISTS idx_estipulantes_administradora_status ON estipulantes (administradora_id, status) WHERE deleted_at IS NULL;
CREATE INDEX IF NOT EXISTS idx_corretores_administradora_status ON corretores (administradora_id, status);
CREATE INDEX IF NOT EXISTS idx_agenciadores_administradora_status ON agenciadores (administradora_id, status) WHERE deleted_at IS NULL;
CREATE INDEX IF NOT EXISTS idx_planos_administradora_status ON planos (administradora_id, status) WHERE deleted_at IS NULL;
CREATE INDEX IF NOT EXISTS idx_produtos_administradora_status ON produtos (administradora_id, status) WHERE deleted_at IS NULL;
CREATE INDEX IF NOT EXISTS idx_convenios_administradora_status ON convenios (administradora_id, status) WHERE deleted_at IS NULL;

CREATE UNIQUE INDEX IF NOT EXISTS uq_pessoas_cpf_administradora_ativo ON pessoas (administradora_id, cpf) WHERE cpf IS NOT NULL AND deleted_at IS NULL;
CREATE UNIQUE INDEX IF NOT EXISTS uq_pessoas_cnpj_administradora_ativo ON pessoas (administradora_id, cnpj) WHERE cnpj IS NOT NULL AND deleted_at IS NULL;
CREATE UNIQUE INDEX IF NOT EXISTS uq_pessoa_operadora ON operadoras (administradora_id, pessoa_id) WHERE deleted_at IS NULL;
CREATE UNIQUE INDEX IF NOT EXISTS uq_pessoa_estipulante ON estipulantes (administradora_id, pessoa_id) WHERE deleted_at IS NULL;
CREATE UNIQUE INDEX IF NOT EXISTS uq_pessoa_corretor ON corretores (administradora_id, pessoa_id) WHERE deleted_at IS NULL;
CREATE UNIQUE INDEX IF NOT EXISTS uq_pessoa_agenciador ON agenciadores (administradora_id, pessoa_id) WHERE deleted_at IS NULL;

DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'pessoas_tipo_pessoa_check') THEN
    ALTER TABLE pessoas ADD CONSTRAINT pessoas_tipo_pessoa_check CHECK (tipo_pessoa IN ('fisica', 'juridica')) NOT VALID;
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'pessoas_status_check') THEN
    ALTER TABLE pessoas ADD CONSTRAINT pessoas_status_check CHECK (status IN ('ativo', 'inativo', 'suspenso')) NOT VALID;
  END IF;
END $$;

CREATE TABLE IF NOT EXISTS auditoria_cadastros (
  id BIGSERIAL PRIMARY KEY,
  administradora_id BIGINT NOT NULL,
  usuario_id BIGINT NOT NULL,
  acao VARCHAR(20) NOT NULL,
  tabela VARCHAR(120) NOT NULL,
  registro_id BIGINT NOT NULL,
  dados_anteriores JSONB,
  dados_novos JSONB,
  created_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_auditoria_cadastros_scope
  ON auditoria_cadastros (administradora_id, tabela, registro_id, created_at DESC);

-- O código da aplicação usa exclusivamente PostgreSQL: serial/identity, varchar,
-- timestamp e placeholders posicionais ($1, $2...). Os DDL MySQL antigos ficam
-- preservados como histórico e não devem ser usados para provisionar o Neon.
