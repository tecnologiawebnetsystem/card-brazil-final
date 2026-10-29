-- Integridade incremental do núcleo financeiro.
-- PostgreSQL / Neon. Não remove nem altera dados existentes.

BEGIN;

DO $$
BEGIN
  IF EXISTS (
    SELECT 1
    FROM cobrancas c
    LEFT JOIN contas_receber cr ON cr.id = c.conta_receber_id
      AND cr.administradora_id = c.administradora_id
    WHERE c.conta_receber_id IS NOT NULL AND cr.id IS NULL
  ) THEN
    RAISE EXCEPTION 'Existem cobranças com conta_receber_id órfão ou de outra administradora';
  END IF;

  IF EXISTS (
    SELECT 1
    FROM cobranca_parcelas cp
    LEFT JOIN contas_receber cr ON cr.id = cp.conta_receber_id
      AND cr.administradora_id = cp.administradora_id
    WHERE cp.conta_receber_id IS NOT NULL AND cr.id IS NULL
  ) THEN
    RAISE EXCEPTION 'Existem parcelas com conta_receber_id órfão ou de outra administradora';
  END IF;
END $$;

CREATE UNIQUE INDEX IF NOT EXISTS uq_contas_receber_id_admin
  ON contas_receber (id, administradora_id);

CREATE INDEX IF NOT EXISTS idx_cobrancas_admin_conta_receber
  ON cobrancas (administradora_id, conta_receber_id);

CREATE INDEX IF NOT EXISTS idx_cobranca_parcelas_admin_conta_receber
  ON cobranca_parcelas (administradora_id, conta_receber_id);

CREATE INDEX IF NOT EXISTS idx_cobranca_pagamentos_admin_idempotency
  ON cobranca_pagamentos (administradora_id, idempotency_key);

CREATE OR REPLACE FUNCTION validar_conta_receber_da_administradora()
RETURNS trigger
LANGUAGE plpgsql
AS $$
BEGIN
  IF NEW.conta_receber_id IS NOT NULL AND NOT EXISTS (
    SELECT 1
    FROM contas_receber cr
    WHERE cr.id::bigint = NEW.conta_receber_id
      AND cr.administradora_id::bigint = NEW.administradora_id
      AND cr.deleted_at IS NULL
  ) THEN
    RAISE EXCEPTION 'conta_receber_id não pertence à administradora informada';
  END IF;
  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS trg_cobrancas_conta_receber_admin ON cobrancas;
CREATE TRIGGER trg_cobrancas_conta_receber_admin
  BEFORE INSERT OR UPDATE OF conta_receber_id, administradora_id ON cobrancas
  FOR EACH ROW EXECUTE FUNCTION validar_conta_receber_da_administradora();

DROP TRIGGER IF EXISTS trg_cobranca_parcelas_conta_receber_admin ON cobranca_parcelas;
CREATE TRIGGER trg_cobranca_parcelas_conta_receber_admin
  BEFORE INSERT OR UPDATE OF conta_receber_id, administradora_id ON cobranca_parcelas
  FOR EACH ROW EXECUTE FUNCTION validar_conta_receber_da_administradora();

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_constraint WHERE conname = 'contas_receber_valores_coerentes_ck'
  ) THEN
    ALTER TABLE contas_receber
      ADD CONSTRAINT contas_receber_valores_coerentes_ck
      CHECK (
        valor_original >= 0
        AND valor_multa >= 0
        AND valor_juros >= 0
        AND valor_desconto >= 0
        AND valor_total >= 0
        AND valor_pago >= 0
        AND valor_pago <= valor_total
      ) NOT VALID;
  END IF;
END $$;

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_constraint WHERE conname = 'cobranca_parcelas_valores_coerentes_ck'
  ) THEN
    ALTER TABLE cobranca_parcelas
      ADD CONSTRAINT cobranca_parcelas_valores_coerentes_ck
      CHECK (
        valor_original >= 0
        AND valor_multa >= 0
        AND valor_juros >= 0
        AND valor_desconto >= 0
        AND valor_total >= 0
        AND valor_pago >= 0
        AND valor_pago <= valor_total
      ) NOT VALID;
  END IF;
END $$;

-- A unicidade é por administradora para impedir apenas reprocessamentos duplicados.
CREATE UNIQUE INDEX IF NOT EXISTS uq_cobranca_pagamentos_admin_idempotency
  ON cobranca_pagamentos (administradora_id, idempotency_key)
  WHERE idempotency_key IS NOT NULL;

COMMIT;

-- Os checks são NOT VALID para preservar dados legados já existentes.
-- Após saneamento, valide-os separadamente com ALTER TABLE ... VALIDATE CONSTRAINT.
