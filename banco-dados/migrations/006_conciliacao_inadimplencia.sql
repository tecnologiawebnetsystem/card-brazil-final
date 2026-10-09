BEGIN;

CREATE TABLE IF NOT EXISTS conciliacao_transacoes (
  id BIGSERIAL PRIMARY KEY,
  administradora_id BIGINT NOT NULL,
  arquivo_id BIGINT REFERENCES arquivos_bancarios(id),
  identificador_externo VARCHAR(180) NOT NULL,
  nosso_numero VARCHAR(120),
  documento VARCHAR(120),
  pagador_documento VARCHAR(80),
  data_transacao DATE NOT NULL,
  valor NUMERIC(14,2) NOT NULL CHECK (valor > 0),
  dados JSONB NOT NULL DEFAULT '{}'::jsonb,
  status VARCHAR(30) NOT NULL DEFAULT 'importada' CHECK (status IN ('importada','identificada','sugerida','conciliada','divergente','rejeitada')),
  divergencia_tipo VARCHAR(40),
  divergencia_detalhe TEXT,
  parcela_id BIGINT,
  pagamento_id BIGINT,
  conciliado_em TIMESTAMPTZ,
  conciliado_por BIGINT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE (administradora_id, identificador_externo)
);

CREATE TABLE IF NOT EXISTS regras_inadimplencia (
  id BIGSERIAL PRIMARY KEY,
  administradora_id BIGINT NOT NULL,
  nome VARCHAR(160) NOT NULL,
  versao INTEGER NOT NULL DEFAULT 1,
  tipo_contratacao VARCHAR(40),
  responsavel_pagamento VARCHAR(40),
  dias_para_notificar INTEGER NOT NULL DEFAULT 1 CHECK (dias_para_notificar >= 0),
  dias_para_procedimento INTEGER CHECK (dias_para_procedimento IS NULL OR dias_para_procedimento >= dias_para_notificar),
  permite_procedimento BOOLEAN NOT NULL DEFAULT false,
  configuracao JSONB NOT NULL DEFAULT '{}'::jsonb,
  ativo BOOLEAN NOT NULL DEFAULT true,
  vigencia_inicio DATE NOT NULL DEFAULT CURRENT_DATE,
  vigencia_fim DATE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE (administradora_id, nome, versao)
);

CREATE TABLE IF NOT EXISTS inadimplencia_casos (
  id BIGSERIAL PRIMARY KEY,
  administradora_id BIGINT NOT NULL,
  parcela_id BIGINT NOT NULL,
  contrato_id BIGINT,
  beneficiario_id BIGINT,
  regra_id BIGINT REFERENCES regras_inadimplencia(id),
  status VARCHAR(30) NOT NULL DEFAULT 'aberta' CHECK (status IN ('aberta','em_tratamento','notificada','promessa','negociada','regularizada','procedimento','encerrada')),
  dias_atraso INTEGER NOT NULL DEFAULT 0 CHECK (dias_atraso >= 0),
  saldo NUMERIC(14,2) NOT NULL CHECK (saldo > 0),
  dados_considerados JSONB NOT NULL DEFAULT '{}'::jsonb,
  opened_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  resolved_at TIMESTAMPTZ,
  UNIQUE (administradora_id, parcela_id)
);

CREATE TABLE IF NOT EXISTS notificacoes_inadimplencia (
  id BIGSERIAL PRIMARY KEY,
  administradora_id BIGINT NOT NULL,
  caso_id BIGINT NOT NULL REFERENCES inadimplencia_casos(id),
  parcela_id BIGINT NOT NULL,
  contrato_id BIGINT,
  beneficiario_id BIGINT,
  meio VARCHAR(30) NOT NULL,
  template VARCHAR(120) NOT NULL,
  tentativa INTEGER NOT NULL DEFAULT 1 CHECK (tentativa > 0),
  destinatario VARCHAR(180),
  conteudo TEXT NOT NULL,
  prazo DATE,
  status VARCHAR(30) NOT NULL DEFAULT 'pendente' CHECK (status IN ('pendente','enviada','confirmada','falhou','cancelada')),
  enviado_em TIMESTAMPTZ,
  resultado JSONB NOT NULL DEFAULT '{}'::jsonb,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS auditoria_inadimplencia (
  id BIGSERIAL PRIMARY KEY,
  administradora_id BIGINT NOT NULL,
  caso_id BIGINT REFERENCES inadimplencia_casos(id),
  regra_id BIGINT REFERENCES regras_inadimplencia(id),
  acao VARCHAR(60) NOT NULL,
  dados_anteriores JSONB NOT NULL DEFAULT '{}'::jsonb,
  dados_novos JSONB NOT NULL DEFAULT '{}'::jsonb,
  origem VARCHAR(20) NOT NULL DEFAULT 'sistema',
  usuario_id BIGINT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE UNIQUE INDEX IF NOT EXISTS uq_conciliacao_arquivo_transacao ON conciliacao_transacoes (administradora_id, arquivo_id, identificador_externo) WHERE arquivo_id IS NOT NULL;
CREATE INDEX IF NOT EXISTS idx_conciliacao_status ON conciliacao_transacoes (administradora_id, status, data_transacao);
CREATE INDEX IF NOT EXISTS idx_inadimplencia_aberta ON inadimplencia_casos (administradora_id, status, dias_atraso);
CREATE INDEX IF NOT EXISTS idx_notificacao_caso ON notificacoes_inadimplencia (administradora_id, caso_id, created_at DESC);

COMMIT;
