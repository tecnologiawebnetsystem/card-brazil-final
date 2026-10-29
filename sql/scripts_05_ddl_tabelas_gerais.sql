-- =====================================================
-- TABELAS GERAIS: BANCOS, MOEDAS, FERIADOS
-- =====================================================

-- Tabela de Bancos
CREATE TABLE IF NOT EXISTS bancos (
    id SERIAL PRIMARY KEY,
    id_administradora INT NOT NULL,
    codigo VARCHAR(10) NOT NULL,
    nome VARCHAR(200) NOT NULL,
    nome_curto VARCHAR(100),
    tipo VARCHAR(50),
    cnpj VARCHAR(18),
    site VARCHAR(200),
    telefone VARCHAR(20),
    email VARCHAR(100),
    status VARCHAR(20) DEFAULT 'Ativo',
    data_cadastro TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    data_atualizacao TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    ativo BOOLEAN DEFAULT TRUE,
    FOREIGN KEY (id_administradora) REFERENCES administradoras(id) ON DELETE CASCADE,
    UNIQUE (id_administradora, codigo)
);

CREATE INDEX IF NOT EXISTS idx_bancos_admin ON bancos(id_administradora);
CREATE INDEX IF NOT EXISTS idx_bancos_codigo ON bancos(codigo);
CREATE INDEX IF NOT EXISTS idx_bancos_status ON bancos(status);

-- Tabela de Moedas
CREATE TABLE IF NOT EXISTS moedas (
    id SERIAL PRIMARY KEY,
    id_administradora INT NOT NULL,
    codigo VARCHAR(10) NOT NULL,
    nome VARCHAR(100) NOT NULL,
    simbolo VARCHAR(10),
    pais VARCHAR(100),
    cotacao_compra DECIMAL(15, 6),
    cotacao_venda DECIMAL(15, 6),
    variacao_percentual DECIMAL(10, 4),
    data_cotacao TIMESTAMP,
    fonte_cotacao VARCHAR(100),
    status VARCHAR(20) DEFAULT 'Ativa',
    data_cadastro TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    data_atualizacao TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    ativo BOOLEAN DEFAULT TRUE,
    FOREIGN KEY (id_administradora) REFERENCES administradoras(id) ON DELETE CASCADE,
    UNIQUE (id_administradora, codigo)
);

CREATE INDEX IF NOT EXISTS idx_moedas_admin ON moedas(id_administradora);
CREATE INDEX IF NOT EXISTS idx_moedas_codigo ON moedas(codigo);
CREATE INDEX IF NOT EXISTS idx_moedas_status ON moedas(status);

-- Tabela de Feriados
CREATE TABLE IF NOT EXISTS feriados (
    id SERIAL PRIMARY KEY,
    id_administradora INT NOT NULL,
    data DATE NOT NULL,
    nome VARCHAR(200) NOT NULL,
    tipo VARCHAR(50) NOT NULL,
    uf VARCHAR(2),
    cidade VARCHAR(100),
    fixo BOOLEAN DEFAULT TRUE,
    descricao TEXT,
    status VARCHAR(20) DEFAULT 'Ativo',
    data_cadastro TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    data_atualizacao TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    ativo BOOLEAN DEFAULT TRUE,
    FOREIGN KEY (id_administradora) REFERENCES administradoras(id) ON DELETE CASCADE
);

CREATE INDEX IF NOT EXISTS idx_feriados_admin ON feriados(id_administradora);
CREATE INDEX IF NOT EXISTS idx_feriados_data ON feriados(data);
CREATE INDEX IF NOT EXISTS idx_feriados_tipo ON feriados(tipo);
CREATE INDEX IF NOT EXISTS idx_feriados_uf ON feriados(uf);
CREATE UNIQUE INDEX IF NOT EXISTS idx_feriados_unique ON feriados(id_administradora, data, tipo, COALESCE(uf, ''), COALESCE(cidade, ''));
