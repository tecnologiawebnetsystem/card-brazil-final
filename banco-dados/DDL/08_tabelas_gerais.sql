-- =============================================
-- Script: 08_tabelas_gerais.sql
-- Descrição: Tabelas gerais do sistema (bancos, moedas, feriados)
-- Database: cardbrazil
-- =============================================

USE cardbrazil;

-- Convertendo de PostgreSQL para MySQL - substituindo SERIAL por INT AUTO_INCREMENT

-- Tabela de Bancos
CREATE TABLE IF NOT EXISTS bancos (
    id INT AUTO_INCREMENT PRIMARY KEY,
    id_administradora INT NOT NULL,
    codigo VARCHAR(10) NOT NULL,
    nome VARCHAR(200) NOT NULL,
    nome_curto VARCHAR(100),
    tipo VARCHAR(50), -- Público, Privado, Cooperativa, Financeira
    cnpj VARCHAR(18),
    site VARCHAR(200),
    telefone VARCHAR(20),
    email VARCHAR(100),
    status VARCHAR(20) DEFAULT 'Ativo', -- Ativo, Inativo, Liquidado
    data_cadastro TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    data_atualizacao TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    ativo BOOLEAN DEFAULT TRUE,
    FOREIGN KEY (id_administradora) REFERENCES administradoras(id) ON DELETE CASCADE,
    UNIQUE (id_administradora, codigo),
    INDEX idx_bancos_administradora (id_administradora),
    INDEX idx_bancos_codigo (codigo),
    INDEX idx_bancos_status (status)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Tabela de Agências Bancárias
CREATE TABLE IF NOT EXISTS agencias_bancarias (
    id INT AUTO_INCREMENT PRIMARY KEY,
    id_administradora INT NOT NULL,
    id_banco INT NOT NULL,
    codigo_agencia VARCHAR(10) NOT NULL,
    digito_agencia VARCHAR(2),
    nome VARCHAR(200) NOT NULL,
    endereco VARCHAR(300),
    bairro VARCHAR(100),
    cidade VARCHAR(100),
    uf VARCHAR(2),
    cep VARCHAR(10),
    telefone VARCHAR(20),
    gerente VARCHAR(100),
    status VARCHAR(20) DEFAULT 'Ativa', -- Ativa, Inativa, Transferida
    data_cadastro TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    data_atualizacao TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    ativo BOOLEAN DEFAULT TRUE,
    FOREIGN KEY (id_administradora) REFERENCES administradoras(id) ON DELETE CASCADE,
    FOREIGN KEY (id_banco) REFERENCES bancos(id) ON DELETE CASCADE,
    UNIQUE (id_administradora, id_banco, codigo_agencia),
    INDEX idx_agencias_administradora (id_administradora),
    INDEX idx_agencias_banco (id_banco),
    INDEX idx_agencias_codigo (codigo_agencia)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Tabela de Moedas
CREATE TABLE IF NOT EXISTS moedas (
    id INT AUTO_INCREMENT PRIMARY KEY,
    id_administradora INT NOT NULL,
    codigo VARCHAR(10) NOT NULL, -- USD, EUR, GBP, etc
    nome VARCHAR(100) NOT NULL,
    simbolo VARCHAR(10),
    pais VARCHAR(100),
    cotacao_compra DECIMAL(15, 6),
    cotacao_venda DECIMAL(15, 6),
    variacao_percentual DECIMAL(10, 4),
    data_cotacao TIMESTAMP,
    fonte_cotacao VARCHAR(100), -- BCB, AwesomeAPI, etc
    status VARCHAR(20) DEFAULT 'Ativa', -- Ativa, Inativa, Descontinuada
    data_cadastro TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    data_atualizacao TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    ativo BOOLEAN DEFAULT TRUE,
    FOREIGN KEY (id_administradora) REFERENCES administradoras(id) ON DELETE CASCADE,
    UNIQUE (id_administradora, codigo),
    INDEX idx_moedas_administradora (id_administradora),
    INDEX idx_moedas_codigo (codigo),
    INDEX idx_moedas_status (status)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Tabela de Histórico de Cotações
CREATE TABLE IF NOT EXISTS historico_cotacoes (
    id INT AUTO_INCREMENT PRIMARY KEY,
    id_administradora INT NOT NULL,
    id_moeda INT NOT NULL,
    cotacao_compra DECIMAL(15, 6) NOT NULL,
    cotacao_venda DECIMAL(15, 6) NOT NULL,
    variacao_percentual DECIMAL(10, 4),
    data_cotacao TIMESTAMP NOT NULL,
    fonte VARCHAR(100),
    FOREIGN KEY (id_administradora) REFERENCES administradoras(id) ON DELETE CASCADE,
    FOREIGN KEY (id_moeda) REFERENCES moedas(id) ON DELETE CASCADE,
    INDEX idx_historico_administradora (id_administradora),
    INDEX idx_historico_moeda (id_moeda),
    INDEX idx_historico_data (data_cotacao)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Tabela de Feriados
CREATE TABLE IF NOT EXISTS feriados (
    id INT AUTO_INCREMENT PRIMARY KEY,
    id_administradora INT NOT NULL,
    data DATE NOT NULL,
    nome VARCHAR(200) NOT NULL,
    tipo VARCHAR(50) NOT NULL, -- Nacional, Estadual, Municipal
    uf VARCHAR(2), -- Para feriados estaduais
    cidade VARCHAR(100), -- Para feriados municipais
    fixo BOOLEAN DEFAULT TRUE, -- Se a data é fixa todo ano
    descricao TEXT,
    status VARCHAR(20) DEFAULT 'Ativo',
    data_cadastro TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    data_atualizacao TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    ativo BOOLEAN DEFAULT TRUE,
    FOREIGN KEY (id_administradora) REFERENCES administradoras(id) ON DELETE CASCADE,
    UNIQUE (id_administradora, data, tipo, uf, cidade),
    INDEX idx_feriados_administradora (id_administradora),
    INDEX idx_feriados_data (data),
    INDEX idx_feriados_tipo (tipo),
    INDEX idx_feriados_uf (uf)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
