CREATE TABLE IF NOT EXISTS tokens_login_email (
  id BIGSERIAL PRIMARY KEY,
  usuario_id INTEGER NOT NULL REFERENCES usuarios(id) ON DELETE CASCADE,
  token_hash CHAR(64) NOT NULL,
  expira_em TIMESTAMPTZ NOT NULL,
  usado_em TIMESTAMPTZ,
  tentativas INTEGER NOT NULL DEFAULT 0,
  ip_address VARCHAR(45),
  criado_em TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_tokens_login_email_usuario ON tokens_login_email(usuario_id);
CREATE INDEX IF NOT EXISTS idx_tokens_login_email_expira ON tokens_login_email(expira_em);
