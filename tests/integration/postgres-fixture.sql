CREATE TABLE contas_receber (
  id BIGSERIAL PRIMARY KEY,
  administradora_id BIGINT NOT NULL,
  numero_documento VARCHAR(100) NOT NULL,
  deleted_at TIMESTAMPTZ,
  valor_original NUMERIC(14,2) NOT NULL DEFAULT 0,
  valor_multa NUMERIC(14,2) NOT NULL DEFAULT 0,
  valor_juros NUMERIC(14,2) NOT NULL DEFAULT 0,
  valor_desconto NUMERIC(14,2) NOT NULL DEFAULT 0,
  valor_total NUMERIC(14,2) NOT NULL DEFAULT 0,
  valor_pago NUMERIC(14,2) NOT NULL DEFAULT 0
);

CREATE TABLE cobrancas (
  id BIGSERIAL PRIMARY KEY,
  administradora_id BIGINT NOT NULL,
  conta_receber_id BIGINT
);

CREATE TABLE cobranca_parcelas (
  id BIGSERIAL PRIMARY KEY,
  administradora_id BIGINT NOT NULL,
  conta_receber_id BIGINT,
  valor_original NUMERIC(14,2) NOT NULL,
  valor_multa NUMERIC(14,2) NOT NULL DEFAULT 0,
  valor_juros NUMERIC(14,2) NOT NULL DEFAULT 0,
  valor_desconto NUMERIC(14,2) NOT NULL DEFAULT 0,
  valor_total NUMERIC(14,2) NOT NULL,
  valor_pago NUMERIC(14,2) NOT NULL DEFAULT 0,
  status VARCHAR(30) NOT NULL DEFAULT 'pendente',
  data_pagamento DATE,
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE cobranca_pagamentos (
  id BIGSERIAL PRIMARY KEY,
  administradora_id BIGINT NOT NULL,
  parcela_id BIGINT NOT NULL,
  idempotency_key VARCHAR(160) NOT NULL,
  valor_pago NUMERIC(14,2) NOT NULL,
  data_pagamento TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  forma_pagamento VARCHAR(30) NOT NULL,
  UNIQUE (administradora_id, idempotency_key)
);

CREATE TABLE cobranca_eventos (
  id BIGSERIAL PRIMARY KEY,
  administradora_id BIGINT NOT NULL,
  parcela_id BIGINT NOT NULL,
  tipo VARCHAR(40) NOT NULL,
  status_novo VARCHAR(30),
  payload JSONB NOT NULL DEFAULT '{}'::jsonb,
  usuario_id BIGINT
);

CREATE TABLE faturas_mensais (
  id BIGSERIAL PRIMARY KEY,
  administradora_id BIGINT NOT NULL,
  proposta_id BIGINT NOT NULL DEFAULT 1,
  competencia DATE NOT NULL DEFAULT CURRENT_DATE,
  valor_total NUMERIC(14,2) NOT NULL,
  status VARCHAR(30) NOT NULL DEFAULT 'pendente',
  data_pagamento DATE,
  deleted_at TIMESTAMPTZ,
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE pagamentos_faturas (
  id BIGSERIAL PRIMARY KEY,
  fatura_id BIGINT NOT NULL,
  administradora_id BIGINT NOT NULL,
  meio VARCHAR(30) NOT NULL,
  idempotency_key VARCHAR(160) NOT NULL,
  valor NUMERIC(14,2) NOT NULL,
  data_pagamento DATE NOT NULL DEFAULT CURRENT_DATE,
  identificador_externo VARCHAR(160),
  status VARCHAR(30) NOT NULL DEFAULT 'confirmado',
  retorno_bruto JSONB NOT NULL DEFAULT '{}'::jsonb,
  usuario_id BIGINT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE (administradora_id, idempotency_key)
);

CREATE TABLE fatura_eventos (
  id BIGSERIAL PRIMARY KEY,
  fatura_id BIGINT NOT NULL,
  administradora_id BIGINT NOT NULL,
  tipo VARCHAR(40) NOT NULL,
  status_anterior VARCHAR(30),
  status_novo VARCHAR(30),
  origem VARCHAR(30) NOT NULL DEFAULT 'sistema',
  payload JSONB NOT NULL DEFAULT '{}'::jsonb,
  usuario_id BIGINT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE auditoria_cadastros (
  id BIGSERIAL PRIMARY KEY,
  administradora_id BIGINT NOT NULL,
  usuario_id BIGINT NOT NULL,
  acao VARCHAR(20) NOT NULL CHECK (acao IN ('payment', 'settlement')),
  tabela VARCHAR(120) NOT NULL,
  registro_id BIGINT NOT NULL,
  dados_anteriores JSONB,
  dados_novos JSONB,
  created_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE contratos (
  id BIGSERIAL PRIMARY KEY,
  administradora_id BIGINT NOT NULL,
  plano_id BIGINT NOT NULL,
  status VARCHAR(30) NOT NULL DEFAULT 'ativo',
  deleted_at TIMESTAMPTZ
);

CREATE TABLE beneficiarios (
  id BIGSERIAL PRIMARY KEY,
  administradora_id BIGINT NOT NULL,
  contrato_id BIGINT NOT NULL,
  plano_id BIGINT NOT NULL,
  status VARCHAR(30) NOT NULL DEFAULT 'ativo',
  deleted_at TIMESTAMPTZ
);
