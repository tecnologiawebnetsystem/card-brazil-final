-- Vincula a administradora à pessoa que exerce esse papel.
-- Pessoa é o cadastro principal; esta tabela representa apenas o papel de administradora.
ALTER TABLE administradoras
  ADD COLUMN IF NOT EXISTS pessoa_id INTEGER;

CREATE INDEX IF NOT EXISTS idx_administradoras_pessoa_id
  ON administradoras (pessoa_id);

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_constraint WHERE conname = 'fk_administradoras_pessoa'
  ) THEN
    ALTER TABLE administradoras
      ADD CONSTRAINT fk_administradoras_pessoa
      FOREIGN KEY (pessoa_id) REFERENCES pessoas(id);
  END IF;
END $$;

-- Os demais papéis já possuem pessoa_id: operadoras, estipulantes,
-- agenciadores e corretores. O aplicativo exige uma pessoa ativa existente.
