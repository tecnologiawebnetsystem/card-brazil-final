-- =====================================================
-- MÓDULO FINANCEIRO COMPLETO
-- =====================================================

-- Tabela de Contas a Receber
CREATE TABLE IF NOT EXISTS contas_receber (
    id SERIAL PRIMARY KEY,
    id_administradora INT NOT NULL,
    
    beneficiario_id INT,
    proposta_id INT,
    contrato_id INT,
    
    numero_documento VARCHAR(100) NOT NULL,
    descricao TEXT NOT NULL,
    categoria VARCHAR(30) CHECK (categoria IN ('mensalidade', 'adesao', 'coparticipacao', 'taxa', 'multa', 'juros', 'outro')) NOT NULL,
    
    valor_original DECIMAL(10,2) NOT NULL,
    valor_multa DECIMAL(10,2) DEFAULT 0,
    valor_juros DECIMAL(10,2) DEFAULT 0,
    valor_desconto DECIMAL(10,2) DEFAULT 0,
    valor_total DECIMAL(10,2) NOT NULL,
    valor_pago DECIMAL(10,2) DEFAULT 0,
    
    data_emissao DATE NOT NULL,
    data_vencimento DATE NOT NULL,
    data_pagamento DATE,
    
    status VARCHAR(20) CHECK (status IN ('pendente', 'pago', 'parcial', 'vencido', 'cancelado')) DEFAULT 'pendente',
    dias_atraso INT DEFAULT 0,
    
    forma_pagamento VARCHAR(30) CHECK (forma_pagamento IN ('boleto', 'pix', 'cartao_credito', 'cartao_debito', 'transferencia', 'dinheiro')),
    codigo_barras VARCHAR(200),
    linha_digitavel VARCHAR(200),
    pix_qrcode TEXT,
    pix_chave VARCHAR(200),
    
    observacoes TEXT,
    
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    deleted_at TIMESTAMP NULL,
    created_by INT,
    updated_by INT,
    
    FOREIGN KEY (id_administradora) REFERENCES administradoras(id),
    FOREIGN KEY (beneficiario_id) REFERENCES beneficiarios(id) ON DELETE SET NULL,
    FOREIGN KEY (proposta_id) REFERENCES propostas(id) ON DELETE SET NULL,
    FOREIGN KEY (contrato_id) REFERENCES contratos(id) ON DELETE SET NULL,
    FOREIGN KEY (created_by) REFERENCES usuarios(id) ON DELETE SET NULL,
    FOREIGN KEY (updated_by) REFERENCES usuarios(id) ON DELETE SET NULL,
    UNIQUE (id_administradora, numero_documento)
);

CREATE INDEX IF NOT EXISTS idx_contas_receber_admin ON contas_receber(id_administradora);
CREATE INDEX IF NOT EXISTS idx_contas_receber_beneficiario ON contas_receber(beneficiario_id);
CREATE INDEX IF NOT EXISTS idx_contas_receber_proposta ON contas_receber(proposta_id);
CREATE INDEX IF NOT EXISTS idx_contas_receber_contrato ON contas_receber(contrato_id);
CREATE INDEX IF NOT EXISTS idx_contas_receber_status ON contas_receber(status);
CREATE INDEX IF NOT EXISTS idx_contas_receber_vencimento ON contas_receber(data_vencimento);
CREATE INDEX IF NOT EXISTS idx_contas_receber_categoria ON contas_receber(categoria);

-- Tabela de Contas a Pagar
CREATE TABLE IF NOT EXISTS contas_pagar (
    id SERIAL PRIMARY KEY,
    id_administradora INT NOT NULL,
    
    fornecedor_id INT,
    beneficiario_id INT,
    proposta_id INT,
    
    numero_documento VARCHAR(100) NOT NULL,
    descricao TEXT NOT NULL,
    categoria VARCHAR(50) CHECK (categoria IN ('restituicao', 'reembolso', 'pagamento_duplicado', 'servicos_medicos', 'exames', 
                   'medicamentos', 'internacoes', 'consultas', 'fornecedores', 'impostos', 'outro')) NOT NULL,
    tipo_conta VARCHAR(50) CHECK (tipo_conta IN ('restituicao_beneficiario', 'reembolso_procedimento', 'pagamento_duplicado', 
                    'fornecedor', 'operacional', 'outro')) NOT NULL,
    
    valor_original DECIMAL(10,2) NOT NULL,
    valor_multa DECIMAL(10,2) DEFAULT 0,
    valor_juros DECIMAL(10,2) DEFAULT 0,
    valor_desconto DECIMAL(10,2) DEFAULT 0,
    valor_total DECIMAL(10,2) NOT NULL,
    valor_pago DECIMAL(10,2) DEFAULT 0,
    
    data_emissao DATE NOT NULL,
    data_vencimento DATE NOT NULL,
    data_pagamento DATE,
    
    status VARCHAR(20) CHECK (status IN ('pendente', 'pago', 'parcial', 'vencido', 'cancelado', 'programado')) DEFAULT 'pendente',
    dias_atraso INT DEFAULT 0,
    
    forma_pagamento VARCHAR(30) CHECK (forma_pagamento IN ('transferencia', 'pix', 'boleto', 'cheque', 'dinheiro', 'cartao')),
    conta_bancaria_id INT,
    
    favorecido_nome VARCHAR(200),
    favorecido_cpf_cnpj VARCHAR(20),
    favorecido_banco VARCHAR(10),
    favorecido_agencia VARCHAR(10),
    favorecido_conta VARCHAR(20),
    favorecido_tipo_conta VARCHAR(20) CHECK (favorecido_tipo_conta IN ('corrente', 'poupanca')),
    favorecido_pix_chave VARCHAR(200),
    
    observacoes TEXT,
    motivo_restituicao TEXT,
    
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    deleted_at TIMESTAMP NULL,
    created_by INT,
    updated_by INT,
    
    FOREIGN KEY (id_administradora) REFERENCES administradoras(id),
    FOREIGN KEY (fornecedor_id) REFERENCES pessoas(id) ON DELETE SET NULL,
    FOREIGN KEY (beneficiario_id) REFERENCES beneficiarios(id) ON DELETE SET NULL,
    FOREIGN KEY (proposta_id) REFERENCES propostas(id) ON DELETE SET NULL,
    FOREIGN KEY (conta_bancaria_id) REFERENCES bancos(id) ON DELETE SET NULL,
    FOREIGN KEY (created_by) REFERENCES usuarios(id) ON DELETE SET NULL,
    FOREIGN KEY (updated_by) REFERENCES usuarios(id) ON DELETE SET NULL,
    UNIQUE (id_administradora, numero_documento)
);

CREATE INDEX IF NOT EXISTS idx_contas_pagar_admin ON contas_pagar(id_administradora);
CREATE INDEX IF NOT EXISTS idx_contas_pagar_fornecedor ON contas_pagar(fornecedor_id);
CREATE INDEX IF NOT EXISTS idx_contas_pagar_beneficiario ON contas_pagar(beneficiario_id);
CREATE INDEX IF NOT EXISTS idx_contas_pagar_proposta ON contas_pagar(proposta_id);
CREATE INDEX IF NOT EXISTS idx_contas_pagar_status ON contas_pagar(status);
CREATE INDEX IF NOT EXISTS idx_contas_pagar_vencimento ON contas_pagar(data_vencimento);
CREATE INDEX IF NOT EXISTS idx_contas_pagar_categoria ON contas_pagar(categoria);

-- Tabela de Fluxo de Caixa
CREATE TABLE IF NOT EXISTS fluxo_caixa (
    id SERIAL PRIMARY KEY,
    id_administradora INT NOT NULL,
    
    conta_receber_id INT,
    conta_pagar_id INT,
    conta_bancaria_id INT,
    
    tipo VARCHAR(10) CHECK (tipo IN ('entrada', 'saida')) NOT NULL,
    categoria VARCHAR(100) NOT NULL,
    descricao TEXT NOT NULL,
    
    valor DECIMAL(10,2) NOT NULL,
    
    data_movimentacao DATE NOT NULL,
    data_competencia DATE NOT NULL,
    
    status VARCHAR(20) CHECK (status IN ('realizado', 'previsto', 'cancelado')) DEFAULT 'previsto',
    
    conta_origem VARCHAR(200),
    conta_destino VARCHAR(200),
    
    observacoes TEXT,
    
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    deleted_at TIMESTAMP NULL,
    created_by INT,
    
    FOREIGN KEY (id_administradora) REFERENCES administradoras(id),
    FOREIGN KEY (conta_receber_id) REFERENCES contas_receber(id) ON DELETE SET NULL,
    FOREIGN KEY (conta_pagar_id) REFERENCES contas_pagar(id) ON DELETE SET NULL,
    FOREIGN KEY (conta_bancaria_id) REFERENCES bancos(id) ON DELETE SET NULL,
    FOREIGN KEY (created_by) REFERENCES usuarios(id) ON DELETE SET NULL
);

CREATE INDEX IF NOT EXISTS idx_fluxo_caixa_admin ON fluxo_caixa(id_administradora);
CREATE INDEX IF NOT EXISTS idx_fluxo_caixa_tipo ON fluxo_caixa(tipo);
CREATE INDEX IF NOT EXISTS idx_fluxo_caixa_categoria ON fluxo_caixa(categoria);
CREATE INDEX IF NOT EXISTS idx_fluxo_caixa_status ON fluxo_caixa(status);
CREATE INDEX IF NOT EXISTS idx_fluxo_caixa_data_mov ON fluxo_caixa(data_movimentacao);
CREATE INDEX IF NOT EXISTS idx_fluxo_caixa_data_comp ON fluxo_caixa(data_competencia);

-- Tabelas de Cobrança Judicial
CREATE TABLE IF NOT EXISTS advogados (
    id SERIAL PRIMARY KEY,
    id_administradora INT NOT NULL,
    
    nome VARCHAR(200) NOT NULL,
    oab VARCHAR(20) NOT NULL,
    oab_uf CHAR(2) NOT NULL,
    cpf VARCHAR(14) NOT NULL,
    
    email VARCHAR(200),
    telefone VARCHAR(20),
    celular VARCHAR(20),
    
    cep VARCHAR(10),
    logradouro VARCHAR(200),
    numero VARCHAR(20),
    complemento VARCHAR(100),
    bairro VARCHAR(100),
    cidade VARCHAR(100),
    uf CHAR(2),
    
    ativo BOOLEAN DEFAULT TRUE,
    observacoes TEXT,
    
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    deleted_at TIMESTAMP NULL,
    
    FOREIGN KEY (id_administradora) REFERENCES administradoras(id),
    UNIQUE (id_administradora, oab, oab_uf)
);

CREATE INDEX IF NOT EXISTS idx_advogados_admin ON advogados(id_administradora);
CREATE INDEX IF NOT EXISTS idx_advogados_oab ON advogados(oab, oab_uf);
CREATE INDEX IF NOT EXISTS idx_advogados_cpf ON advogados(cpf);
CREATE INDEX IF NOT EXISTS idx_advogados_ativo ON advogados(ativo);

CREATE TABLE IF NOT EXISTS tribunais (
    id SERIAL PRIMARY KEY,
    id_administradora INT NOT NULL,
    
    nome VARCHAR(200) NOT NULL,
    sigla VARCHAR(20),
    tipo VARCHAR(30) CHECK (tipo IN ('federal', 'estadual', 'trabalhista', 'eleitoral', 'militar')) NOT NULL,
    instancia VARCHAR(20) CHECK (instancia IN ('primeira', 'segunda', 'superior', 'supremo')) NOT NULL,
    
    uf CHAR(2) NOT NULL,
    cidade VARCHAR(100),
    
    telefone VARCHAR(20),
    email VARCHAR(200),
    site VARCHAR(200),
    
    cep VARCHAR(10),
    logradouro VARCHAR(200),
    numero VARCHAR(20),
    complemento VARCHAR(100),
    bairro VARCHAR(100),
    
    ativo BOOLEAN DEFAULT TRUE,
    
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    
    FOREIGN KEY (id_administradora) REFERENCES administradoras(id)
);

CREATE INDEX IF NOT EXISTS idx_tribunais_admin ON tribunais(id_administradora);
CREATE INDEX IF NOT EXISTS idx_tribunais_tipo ON tribunais(tipo);
CREATE INDEX IF NOT EXISTS idx_tribunais_uf ON tribunais(uf);
CREATE INDEX IF NOT EXISTS idx_tribunais_ativo ON tribunais(ativo);

CREATE TABLE IF NOT EXISTS processos_judiciais (
    id SERIAL PRIMARY KEY,
    id_administradora INT NOT NULL,
    
    beneficiario_id INT NOT NULL,
    advogado_id INT,
    tribunal_id INT,
    conta_receber_id INT,
    
    numero_processo VARCHAR(50) NOT NULL,
    tipo_acao VARCHAR(30) CHECK (tipo_acao IN ('cobranca', 'execucao', 'monitoria', 'outro')) NOT NULL,
    valor_causa DECIMAL(10,2) NOT NULL,
    
    data_distribuicao DATE NOT NULL,
    data_citacao DATE,
    data_audiencia DATE,
    data_sentenca DATE,
    data_transito_julgado DATE,
    
    status VARCHAR(50) CHECK (status IN ('em_andamento', 'suspenso', 'arquivado', 'sentenca_favoravel', 'sentenca_desfavoravel', 'acordo')) DEFAULT 'em_andamento',
    fase_processual VARCHAR(30) CHECK (fase_processual IN ('inicial', 'citacao', 'contestacao', 'instrucao', 'sentenca', 'recurso', 'execucao', 'finalizado')) DEFAULT 'inicial',
    
    resultado VARCHAR(50) CHECK (resultado IN ('procedente', 'improcedente', 'parcialmente_procedente', 'acordo', 'desistencia', 'em_andamento')) DEFAULT 'em_andamento',
    valor_sentenca DECIMAL(10,2),
    valor_acordo DECIMAL(10,2),
    valor_recuperado DECIMAL(10,2) DEFAULT 0,
    
    observacoes TEXT,
    historico JSONB,
    
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    deleted_at TIMESTAMP NULL,
    created_by INT,
    updated_by INT,
    
    FOREIGN KEY (id_administradora) REFERENCES administradoras(id),
    FOREIGN KEY (beneficiario_id) REFERENCES beneficiarios(id) ON DELETE CASCADE,
    FOREIGN KEY (advogado_id) REFERENCES advogados(id) ON DELETE SET NULL,
    FOREIGN KEY (tribunal_id) REFERENCES tribunais(id) ON DELETE SET NULL,
    FOREIGN KEY (conta_receber_id) REFERENCES contas_receber(id) ON DELETE SET NULL,
    FOREIGN KEY (created_by) REFERENCES usuarios(id) ON DELETE SET NULL,
    FOREIGN KEY (updated_by) REFERENCES usuarios(id) ON DELETE SET NULL,
    UNIQUE (id_administradora, numero_processo)
);

CREATE INDEX IF NOT EXISTS idx_processos_admin ON processos_judiciais(id_administradora);
CREATE INDEX IF NOT EXISTS idx_processos_beneficiario ON processos_judiciais(beneficiario_id);
CREATE INDEX IF NOT EXISTS idx_processos_advogado ON processos_judiciais(advogado_id);
CREATE INDEX IF NOT EXISTS idx_processos_tribunal ON processos_judiciais(tribunal_id);
CREATE INDEX IF NOT EXISTS idx_processos_status ON processos_judiciais(status);
CREATE INDEX IF NOT EXISTS idx_processos_fase ON processos_judiciais(fase_processual);
CREATE INDEX IF NOT EXISTS idx_processos_numero ON processos_judiciais(numero_processo);

-- Configurações de Multas e Juros
CREATE TABLE IF NOT EXISTS configuracoes_multas_juros (
    id SERIAL PRIMARY KEY,
    id_administradora INT NOT NULL,
    
    nome VARCHAR(200) NOT NULL,
    descricao TEXT,
    
    percentual_multa DECIMAL(5,2) NOT NULL DEFAULT 2.00,
    valor_fixo_multa DECIMAL(10,2) DEFAULT 0,
    
    percentual_juros_mensal DECIMAL(5,2) NOT NULL DEFAULT 1.00,
    percentual_juros_diario DECIMAL(5,4),
    tipo_calculo_juros VARCHAR(20) CHECK (tipo_calculo_juros IN ('simples', 'composto')) DEFAULT 'simples',
    
    dias_carencia INT DEFAULT 0,
    
    aplicar_multa BOOLEAN DEFAULT TRUE,
    aplicar_juros BOOLEAN DEFAULT TRUE,
    
    texto_padrao_boleto TEXT,
    texto_padrao_pix TEXT,
    
    pix_chave VARCHAR(200),
    pix_tipo_chave VARCHAR(20) CHECK (pix_tipo_chave IN ('cpf', 'cnpj', 'email', 'telefone', 'aleatoria')),
    pix_nome_recebedor VARCHAR(200),
    pix_cidade VARCHAR(100),
    
    ativo BOOLEAN DEFAULT TRUE,
    padrao BOOLEAN DEFAULT FALSE,
    
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    deleted_at TIMESTAMP NULL,
    created_by INT,
    updated_by INT,
    
    FOREIGN KEY (id_administradora) REFERENCES administradoras(id),
    FOREIGN KEY (created_by) REFERENCES usuarios(id) ON DELETE SET NULL,
    FOREIGN KEY (updated_by) REFERENCES usuarios(id) ON DELETE SET NULL
);

CREATE INDEX IF NOT EXISTS idx_config_multas_admin ON configuracoes_multas_juros(id_administradora);
CREATE INDEX IF NOT EXISTS idx_config_multas_ativo ON configuracoes_multas_juros(ativo);
CREATE INDEX IF NOT EXISTS idx_config_multas_padrao ON configuracoes_multas_juros(padrao);

CREATE TABLE IF NOT EXISTS historico_multas_juros (
    id SERIAL PRIMARY KEY,
    id_administradora INT NOT NULL,
    
    conta_receber_id INT NOT NULL,
    configuracao_id INT,
    
    dias_atraso INT NOT NULL,
    valor_original DECIMAL(10,2) NOT NULL,
    valor_multa DECIMAL(10,2) NOT NULL,
    valor_juros DECIMAL(10,2) NOT NULL,
    valor_total DECIMAL(10,2) NOT NULL,
    
    percentual_multa_aplicado DECIMAL(5,2),
    percentual_juros_aplicado DECIMAL(5,2),
    
    data_calculo DATE NOT NULL,
    data_referencia DATE NOT NULL,
    
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    created_by INT,
    
    FOREIGN KEY (id_administradora) REFERENCES administradoras(id),
    FOREIGN KEY (conta_receber_id) REFERENCES contas_receber(id) ON DELETE CASCADE,
    FOREIGN KEY (configuracao_id) REFERENCES configuracoes_multas_juros(id) ON DELETE SET NULL,
    FOREIGN KEY (created_by) REFERENCES usuarios(id) ON DELETE SET NULL
);

CREATE INDEX IF NOT EXISTS idx_historico_multas_admin ON historico_multas_juros(id_administradora);
CREATE INDEX IF NOT EXISTS idx_historico_multas_conta ON historico_multas_juros(conta_receber_id);
CREATE INDEX IF NOT EXISTS idx_historico_multas_data ON historico_multas_juros(data_calculo);
