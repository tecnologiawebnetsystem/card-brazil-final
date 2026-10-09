BEGIN;

CREATE UNIQUE INDEX IF NOT EXISTS uq_faturas_mensais_admin_proposta_competencia
  ON faturas_mensais (administradora_id, proposta_id, competencia)
  WHERE deleted_at IS NULL;

CREATE UNIQUE INDEX IF NOT EXISTS uq_contas_receber_admin_documento
  ON contas_receber (administradora_id, numero_documento)
  WHERE deleted_at IS NULL;

CREATE INDEX IF NOT EXISTS idx_contratos_admin_plano
  ON contratos (administradora_id, plano_id, status)
  WHERE deleted_at IS NULL;

CREATE INDEX IF NOT EXISTS idx_beneficiarios_admin_contrato_plano
  ON beneficiarios (administradora_id, contrato_id, plano_id, status)
  WHERE deleted_at IS NULL;

COMMIT;
