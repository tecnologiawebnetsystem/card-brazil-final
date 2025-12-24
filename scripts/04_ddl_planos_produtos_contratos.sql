-- =====================================================
-- PLANOS, PRODUTOS, CONTRATOS E BENEFICIÁRIOS
-- =====================================================

-- Tabela de Planos
CREATE TABLE IF NOT EXISTS planos (
    id SERIAL PRIMARY KEY,
    id_administradora INT NOT NULL,
    operadora_id INT NOT NULL,
    
    codigo VARCHAR(50) NOT NULL,
    nome VARCHAR(255) NOT NULL,
    tipo VARCHAR(20) CHECK (tipo IN ('ambulatorial', 'hospitalar', 'odontologico', 'completo')) NOT NULL,
    abrangencia VARCHAR(20) CHECK (abrangencia IN ('municipal', 'estadual', 'regional', 'nacional')) NOT NULL,
    
    coparticipacao BOOLEAN DEFAULT FALSE,
    valor_coparticipacao DECIMAL(10,2),
    
    carencia_consulta INT DEFAULT 0,
    carencia_exame INT DEFAULT 0,
    carencia_internacao INT DEFAULT 0,
    carencia_parto INT DEFAULT 0,
    
    descricao TEXT,
    observacoes TEXT,
    status VARCHAR(20) CHECK (status IN ('ativo', 'inativo', 'suspenso')) DEFAULT 'ativo',
    
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    deleted_at TIMESTAMP NULL,
    
    FOREIGN KEY (id_administradora) REFERENCES administradoras(id),
    FOREIGN KEY (operadora_id) REFERENCES operadoras(id) ON DELETE CASCADE,
    UNIQUE (codigo, id_administradora)
);

CREATE INDEX IF NOT EXISTS idx_planos_operadora ON planos(operadora_id);
CREATE INDEX IF NOT EXISTS idx_planos_tipo ON planos(tipo);
CREATE INDEX IF NOT EXISTS idx_planos_status ON planos(status);
CREATE INDEX IF NOT EXISTS idx_planos_admin ON planos(id_administradora);

-- Tabela de Produtos
CREATE TABLE IF NOT EXISTS produtos (
    id SERIAL PRIMARY KEY,
    id_administradora INT NOT NULL,
    plano_id INT NOT NULL,
    
    codigo VARCHAR(50) NOT NULL,
    nome VARCHAR(255) NOT NULL,
    categoria VARCHAR(30) CHECK (categoria IN ('individual', 'familiar', 'empresarial', 'coletivo_adesao')) NOT NULL,
    
    faixa_etaria_inicio INT NOT NULL,
    faixa_etaria_fim INT NOT NULL,
    
    valor_mensalidade DECIMAL(10,2) NOT NULL,
    valor_adesao DECIMAL(10,2),
    
    descricao TEXT,
    observacoes TEXT,
    status VARCHAR(20) CHECK (status IN ('ativo', 'inativo')) DEFAULT 'ativo',
    
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    deleted_at TIMESTAMP NULL,
    
    FOREIGN KEY (id_administradora) REFERENCES administradoras(id),
    FOREIGN KEY (plano_id) REFERENCES planos(id) ON DELETE CASCADE,
    UNIQUE (codigo, id_administradora)
);

CREATE INDEX IF NOT EXISTS idx_produtos_plano ON produtos(plano_id);
CREATE INDEX IF NOT EXISTS idx_produtos_categoria ON produtos(categoria);
CREATE INDEX IF NOT EXISTS idx_produtos_faixa ON produtos(faixa_etaria_inicio, faixa_etaria_fim);
CREATE INDEX IF NOT EXISTS idx_produtos_status ON produtos(status);
CREATE INDEX IF NOT EXISTS idx_produtos_admin ON produtos(id_administradora);

-- Tabela de Propostas
CREATE TABLE IF NOT EXISTS propostas (
    id SERIAL PRIMARY KEY,
    id_administradora INT NOT NULL,
    
    -- Dados do Proponente
    nome_proponente VARCHAR(255) NOT NULL,
    cpf_cnpj VARCHAR(18) NOT NULL,
    email VARCHAR(255),
    telefone VARCHAR(20),
    
    -- Dados da Empresa
    empresa VARCHAR(255),
    numero_funcionarios VARCHAR(20),
    
    -- Detalhes da Proposta
    tipo_plano VARCHAR(20) CHECK (tipo_plano IN ('ambulatorial', 'hospitalar', 'odontologico', 'completo')) NOT NULL,
    valor_proposto DECIMAL(10, 2),
    observacoes TEXT,
    
    -- Status e Análise
    status VARCHAR(30) CHECK (status IN ('pendente', 'em_analise', 'aprovada', 'rejeitada', 'contrato_gerado')) DEFAULT 'pendente',
    parecer TEXT,
    analisado_por INT,
    data_analise TIMESTAMP,
    
    -- Score de Avaliação
    score_financeiro INT DEFAULT 0,
    score_documentacao INT DEFAULT 0,
    score_historico INT DEFAULT 0,
    
    -- Contrato
    numero_contrato VARCHAR(50),
    data_contrato TIMESTAMP,
    
    -- Auditoria
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    deleted_at TIMESTAMP NULL,
    
    FOREIGN KEY (id_administradora) REFERENCES administradoras(id),
    FOREIGN KEY (analisado_por) REFERENCES usuarios(id)
);

CREATE INDEX IF NOT EXISTS idx_propostas_status ON propostas(status);
CREATE INDEX IF NOT EXISTS idx_propostas_cpf_cnpj ON propostas(cpf_cnpj);
CREATE INDEX IF NOT EXISTS idx_propostas_data_analise ON propostas(data_analise);
CREATE INDEX IF NOT EXISTS idx_propostas_admin ON propostas(id_administradora);

-- Tabela de Contratos
CREATE TABLE IF NOT EXISTS contratos (
    id SERIAL PRIMARY KEY,
    id_administradora INT NOT NULL,
    estipulante_id INT NOT NULL,
    plano_id INT NOT NULL,
    
    numero_contrato VARCHAR(50) NOT NULL,
    data_inicio DATE NOT NULL,
    data_fim DATE,
    data_vencimento INT NOT NULL,
    
    valor_total DECIMAL(10,2) NOT NULL,
    forma_pagamento VARCHAR(30) CHECK (forma_pagamento IN ('boleto', 'debito_automatico', 'cartao_credito', 'pix')) NOT NULL,
    
    observacoes TEXT,
    status VARCHAR(20) CHECK (status IN ('ativo', 'suspenso', 'cancelado', 'vencido')) DEFAULT 'ativo',
    
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    deleted_at TIMESTAMP NULL,
    
    FOREIGN KEY (id_administradora) REFERENCES administradoras(id),
    FOREIGN KEY (estipulante_id) REFERENCES estipulantes(id) ON DELETE CASCADE,
    FOREIGN KEY (plano_id) REFERENCES planos(id) ON DELETE CASCADE,
    UNIQUE (numero_contrato, id_administradora)
);

CREATE INDEX IF NOT EXISTS idx_contratos_estipulante ON contratos(estipulante_id);
CREATE INDEX IF NOT EXISTS idx_contratos_plano ON contratos(plano_id);
CREATE INDEX IF NOT EXISTS idx_contratos_status ON contratos(status);
CREATE INDEX IF NOT EXISTS idx_contratos_data_inicio ON contratos(data_inicio);
CREATE INDEX IF NOT EXISTS idx_contratos_admin ON contratos(id_administradora);

-- Tabela de Beneficiários
CREATE TABLE IF NOT EXISTS beneficiarios (
    id SERIAL PRIMARY KEY,
    id_administradora INT NOT NULL,
    contrato_id INT NOT NULL,
    pessoa_id INT NOT NULL,
    
    numero_carteirinha VARCHAR(50) NOT NULL,
    tipo_beneficiario VARCHAR(20) CHECK (tipo_beneficiario IN ('titular', 'dependente')) NOT NULL,
    titular_id INT,
    
    parentesco VARCHAR(20) CHECK (parentesco IN ('titular', 'conjuge', 'filho', 'pai', 'mae', 'outro')),
    
    data_inclusao DATE NOT NULL,
    data_exclusao DATE,
    motivo_exclusao TEXT,
    
    observacoes TEXT,
    status VARCHAR(20) CHECK (status IN ('ativo', 'suspenso', 'cancelado')) DEFAULT 'ativo',
    
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    deleted_at TIMESTAMP NULL,
    
    FOREIGN KEY (id_administradora) REFERENCES administradoras(id),
    FOREIGN KEY (contrato_id) REFERENCES contratos(id) ON DELETE CASCADE,
    FOREIGN KEY (pessoa_id) REFERENCES pessoas(id) ON DELETE CASCADE,
    FOREIGN KEY (titular_id) REFERENCES beneficiarios(id) ON DELETE SET NULL,
    UNIQUE (numero_carteirinha, id_administradora)
);

CREATE INDEX IF NOT EXISTS idx_beneficiarios_contrato ON beneficiarios(contrato_id);
CREATE INDEX IF NOT EXISTS idx_beneficiarios_pessoa ON beneficiarios(pessoa_id);
CREATE INDEX IF NOT EXISTS idx_beneficiarios_titular ON beneficiarios(titular_id);
CREATE INDEX IF NOT EXISTS idx_beneficiarios_tipo ON beneficiarios(tipo_beneficiario);
CREATE INDEX IF NOT EXISTS idx_beneficiarios_status ON beneficiarios(status);
CREATE INDEX IF NOT EXISTS idx_beneficiarios_admin ON beneficiarios(id_administradora);
